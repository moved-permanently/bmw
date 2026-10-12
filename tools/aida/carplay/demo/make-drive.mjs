#!/usr/bin/env node
// Builds the demo drive Munich -> Salzburg: lat,lon lines for `simctl location start` and a GPX with timestamps.
//
// Road geometry: Apple Maps (MapKit MKDirections, automobile), cached in apple-route.json (checked in), so this
// script needs no network and no Apple Maps access. Refresh the cache on a Mac (see README, "Refresh the route"):
//   swiftc -O apple-route.swift -o /tmp/apple-route && /tmp/apple-route apple-route-legs.json apple-route.json
//
// Two routes are written, both from the same cache:
//   drive-munich-salzburg.txt/.gpx          DEFAULT_ROUTE (below)
//   drive-munich-salzburg-via-ruhpolding.txt/.gpx   the other route (-direct when the default is via-ruhpolding)
// `via-ruhpolding` leaves the A8 for the Chiemgau Arena, Ruhpolding, and returns to the A8. `direct` stays on the A8.
//
// Points are simplified with Douglas-Peucker: no point of the Apple polyline is farther than TOLERANCE_M from the
// output, and no output segment is longer than MAX_SEGMENT_M. That gives ~20 m steps in tight city bends and long
// steps on straight motorway. Straight lines between the output points are what the simulator plays back.
//
//   node make-drive.mjs                           regenerate both routes (and print a report)
//   node make-drive.mjs --tolerance 4 --max-segment 200 --minutes 4 --default direct
//   node make-drive.mjs --from file.gpx           regenerate the default .txt from a recorded GPX (simplified the same way)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join as pathJoin } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const DEFAULT_ROUTE = opt('--default', 'direct'); // 'via-ruhpolding' or 'direct'
const TOLERANCE_M = Number(opt('--tolerance', 4));        // max distance of the Apple polyline from the output track
const MAX_SEGMENT_M = Number(opt('--max-segment', 200));  // longest straight segment in the output
const minutes = Number(opt('--minutes', 0));              // scales the GPX timestamps to this duration (0 = real speed)
const SPUR_WINDOW_M = 400;                                // look this far around a stop for access spurs to cut

// Legs in apple-route.json (ids from apple-route-legs.json). `window` = metres around the stop in which an
// out-and-back spur (parking lot, entrance road, U-turn) is cut off; 0 keeps the whole tip, so the car reaches the stop.
// each entry: [leg id, spur window at the junction with the PREVIOUS leg]
export const ROUTES = {
  'via-ruhpolding': [['hq-iphitos', 0], ['iphitos-bmwpark', SPUR_WINDOW_M], ['bmwpark-ruhpolding', SPUR_WINDOW_M], ['ruhpolding-border', 120], ['border-salzburg', 0]],
  direct: [['hq-iphitos', 0], ['iphitos-bmwpark', SPUR_WINDOW_M], ['bmwpark-border', SPUR_WINDOW_M], ['border-salzburg', 0]],
};

const rad = (d) => (d * Math.PI) / 180;
const R = 6371008.8;
export const metres = (a, b) => {
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const pathLength = (pts) => pts.reduce((s, p, i) => (i ? s + metres(pts[i - 1], p) : 0), 0);

// local metric projection (one origin is enough for a 150 km strip: error below 0.5 %)
const LAT0 = 48.0;
const proj = (p) => [rad(p[1]) * R * Math.cos(rad(LAT0)), rad(p[0]) * R];
const segDist = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
};

export function simplify(pts, tol) {
  const xy = pts.map(proj);
  const keep = new Uint8Array(pts.length);
  keep[0] = 1; keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let worst = -1, wi = -1;
    for (let i = s + 1; i < e; i += 1) {
      const d = segDist(xy[i], xy[s], xy[e]);
      if (d > worst) { worst = d; wi = i; }
    }
    if (worst > tol) { keep[wi] = 1; stack.push([s, wi], [wi, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// split segments longer than max into equal pieces along the straight segment (no extra deviation)
export function capSegments(pts, max) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1], b = pts[i];
    const n = Math.ceil(metres(a, b) / max);
    for (let k = 1; k < n; k += 1) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
    out.push(b);
  }
  return out;
}

const densify = (pts, step) => {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1], b = pts[i];
    const n = Math.max(1, Math.ceil(metres(a, b) / step));
    for (let k = 1; k <= n; k += 1) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
};
// the last `window` metres of pts / the first `window` metres of pts, as {index of first point in the window}
const tailStart = (pts, window) => { let d = 0, i = pts.length - 1; while (i > 0 && d < window) { d += metres(pts[i - 1], pts[i]); i -= 1; } return i; };
const headEnd = (pts, window) => { let d = 0, i = 0; while (i < pts.length - 1 && d < window) { d += metres(pts[i], pts[i + 1]); i += 1; } return i; };

// Join leg A and leg B at a stop. Access spurs, parking lots and U-turns make A's last metres and B's first metres
// run over the same road; find the pair of points (one on each) that are close and cut away the most track.
export function joinLegs(A, B, window) {
  if (window > 0) {
    const ts = tailStart(A, window), he = headEnd(B, window);
    const at = densify(A.slice(ts), 5), bh = densify(B.slice(0, he + 1), 5);
    let best = null;
    // cumulative length from the end of `at` and from the start of `bh`
    const aRem = new Array(at.length).fill(0); for (let i = at.length - 2; i >= 0; i -= 1) aRem[i] = aRem[i + 1] + metres(at[i], at[i + 1]);
    const bLen = new Array(bh.length).fill(0); for (let j = 1; j < bh.length; j += 1) bLen[j] = bLen[j - 1] + metres(bh[j - 1], bh[j]);
    for (let i = 0; i < at.length; i += 1) {
      for (let j = 0; j < bh.length; j += 1) {
        if (metres(at[i], bh[j]) > 8) continue;
        const cut = aRem[i] + bLen[j];
        if (!best || cut > best.cut) best = { i, j, cut };
      }
    }
    if (best) return [...A.slice(0, ts), ...at.slice(0, best.i + 1), ...bh.slice(best.j), ...B.slice(he + 1)];
  }
  return [...A, ...B];
}

export function buildRoute(cache, legIds) {
  let pts = null;
  for (const [id, window] of legIds) {
    const leg = cache.legs[id];
    if (!leg) throw new Error(`leg ${id} missing in apple-route.json`);
    pts = pts ? joinLegs(pts, leg.points, window) : [...leg.points];
  }
  return pts;
}

// speed: 50 km/h within 5 km of the start or end of the route, else 130 km/h
const stamp = (points, scaleMinutes) => {
  const total = pathLength(points) / 1000;
  let t = 0, run = 0;
  const stamped = points.map((p, i) => {
    if (i) {
      const d = metres(points[i - 1], p) / 1000;
      run += d;
      t += (d / (run < 5 || total - run < 5 ? 50 : 130)) * 3600;
    }
    return t;
  });
  const scale = scaleMinutes ? (scaleMinutes * 60) / t : 1;
  return { total, seconds: t * scale, times: stamped.map((s) => s * scale) };
};

function write(name, apple, simPts, header) {
  const { total, seconds, times } = stamp(simPts, minutes);
  const start = new Date('2026-10-12T09:00:00Z').getTime();
  const trkpts = simPts.map((p, i) => `      <trkpt lat="${p[0].toFixed(6)}" lon="${p[1].toFixed(6)}"><time>${new Date(start + times[i] * 1000).toISOString()}</time></trkpt>`);
  writeFileSync(pathJoin(HERE, `${name}.gpx`), `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${header}; ${total.toFixed(1)} km, ${(seconds / 60).toFixed(1)} min -->
<gpx version="1.1" creator="make-drive.mjs" xmlns="http://www.w3.org/2003/01/Gpx">
  <trk><name>BMW Headquarters to Salzburg (${header})</name><trkseg>
${trkpts.join('\n')}
  </trkseg></trk>
</gpx>
`);
  writeFileSync(pathJoin(HERE, `${name}.txt`), `${simPts.map((p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`).join('\n')}\n`);
  return total;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (opt('--from')) {
    const gpx = readFileSync(opt('--from'), 'utf8');
    const points = [...gpx.matchAll(/<trkpt lat="([-\d.]+)" lon="([-\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
    const sim = capSegments(simplify(points, TOLERANCE_M), MAX_SEGMENT_M);
    writeFileSync(pathJoin(HERE, 'drive-munich-salzburg.txt'), `${sim.map((p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`).join('\n')}\n`);
    console.log(`wrote ${sim.length} points to drive-munich-salzburg.txt from ${opt('--from')}`);
    process.exit(0);
  }
  const cache = JSON.parse(readFileSync(pathJoin(HERE, 'apple-route.json'), 'utf8'));
  const other = DEFAULT_ROUTE === 'direct' ? 'via-ruhpolding' : 'direct';
  for (const [route, name] of [[DEFAULT_ROUTE, 'drive-munich-salzburg'], [other, `drive-munich-salzburg-${other === 'direct' ? 'direct' : 'via-ruhpolding'}`]]) {
    const apple = buildRoute(cache, ROUTES[route]);
    const sim = capSegments(simplify(apple, TOLERANCE_M), MAX_SEGMENT_M);
    const km = write(name, apple, sim, `Apple Maps road geometry, ${route}, tolerance ${TOLERANCE_M} m, max segment ${MAX_SEGMENT_M} m`);
    console.log(`${name}: ${route}${route === DEFAULT_ROUTE ? ' (default)' : ''}: ${apple.length} Apple points -> ${sim.length} waypoints, ${km.toFixed(1)} km`);
  }
}
