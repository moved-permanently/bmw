#!/usr/bin/env node
// Builds the demo drive Munich -> Salzburg as GPX (timestamps) and lat,lon lines (simctl location).
// Road geometry comes from the public OSRM demo server once; the generated files are checked in.
//   node make-drive.mjs [--minutes 4]           generate from waypoints
//   node make-drive.mjs --from file.gpx         regenerate the .txt from a recorded GPX
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const minutes = Number(opt('--minutes', 0));

// lat, lon, label
const WAYPOINTS = [
  [48.1766, 11.5611, 'BMW Headquarters'],
  [48.1845, 11.6148, 'MTTC Iphitos'],
  [48.1260, 11.5254, 'BMW Park'],
  [47.9980, 12.6500, 'A8 Siegsdorf exit (approx.)'],
  [47.7150, 12.6479, 'Chiemgau Arena Ruhpolding'],
  [47.8300, 12.9900, 'A8 Walserberg border'],
  [47.8095, 13.0550, 'Salzburg Mirabellplatz'],
];

const rad = (d) => (d * Math.PI) / 180;
const km = (a, b) => {
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

// simctl issues one update per waypoint segment, so the .txt carries one waypoint every STEP_M metres
// and run.sh asks for an update every STEP_M metres (--distance). Dense points would crawl.
const STEP_M = 500;
const resample = (pts) => {
  const out = [pts[0]]; let acc = 0;
  for (let i = 1; i < pts.length; i += 1) {
    acc += km(pts[i - 1], pts[i]) * 1000;
    if (acc >= STEP_M) { out.push(pts[i]); acc = 0; }
  }
  if (out.at(-1) !== pts.at(-1)) out.push(pts.at(-1));
  return out;
};

let points; let header;
if (opt('--from')) {
  const gpx = readFileSync(opt('--from'), 'utf8');
  points = [...gpx.matchAll(/<trkpt lat="([-\d.]+)" lon="([-\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
  header = `recorded track ${opt('--from')}`;
  const sim = resample(points);
  writeFileSync(join(HERE, 'drive-munich-salzburg.txt'), `${sim.map((p) => p.join(',')).join('\n')}\n`);
  console.log(`wrote ${sim.length} points to drive-munich-salzburg.txt`);
  process.exit(0);
}

try {
  const coords = WAYPOINTS.map((w) => `${w[1]},${w[0]}`).join(';');
  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const json = await res.json();
  points = json.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  header = 'road geometry from router.project-osrm.org';
} catch (e) {
  // fallback: straight segments, one point every ~300 m
  points = [];
  for (let i = 0; i < WAYPOINTS.length - 1; i += 1) {
    const a = WAYPOINTS[i], b = WAYPOINTS[i + 1];
    const n = Math.max(2, Math.ceil(km(a, b) / 0.3));
    for (let k = 0; k < n; k += 1) points.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  points.push(WAYPOINTS.at(-1).slice(0, 2));
  header = `STRAIGHT SEGMENTS between waypoints (OSRM unavailable: ${e.message})`;
}

// speed: 50 km/h within 5 km of the start or end of the route, else 130 km/h
const total = points.reduce((s, p, i) => (i ? s + km(points[i - 1], p) : 0), 0);
let t = 0; let run = 0;
const stamped = points.map((p, i) => {
  if (i) {
    const d = km(points[i - 1], p);
    run += d;
    const v = run < 5 || total - run < 5 ? 50 : 130;
    t += (d / v) * 3600;
  }
  return { p, t };
});
const scale = minutes ? (minutes * 60) / t : 1;
const start = new Date('2026-10-12T09:00:00Z').getTime();
const trkpts = stamped.map(({ p, t: s }) => `      <trkpt lat="${p[0].toFixed(6)}" lon="${p[1].toFixed(6)}"><time>${new Date(start + s * scale * 1000).toISOString()}</time></trkpt>`);
writeFileSync(join(HERE, 'drive-munich-salzburg.gpx'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${header}; ${total.toFixed(0)} km, ${(t * scale / 60).toFixed(1)} min -->
<gpx version="1.1" creator="make-drive.mjs" xmlns="http://www.w3.org/2003/01/Gpx">
  <trk><name>BMW Headquarters to Salzburg</name><trkseg>
${trkpts.join('\n')}
  </trkseg></trk>
</gpx>
`);
const simPts = resample(points);
writeFileSync(join(HERE, 'drive-munich-salzburg.txt'), `${simPts.map((p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`).join('\n')}\n`);
console.log(`${points.length} GPX points, ${simPts.length} simulator waypoints, ${total.toFixed(0)} km, ${header}`);
