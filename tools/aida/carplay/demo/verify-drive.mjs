#!/usr/bin/env node
// Offline check of the generated drive files against the cached Apple polyline. Prints numbers, changes nothing.
//   node verify-drive.mjs [--old old-track.txt] [--osrm osrm-route.json]
// Deviation = Hausdorff distance between the output track (straight lines between waypoints) and the Apple
// polyline, measured both ways by sampling every 1 m. Proximity = where the app's Proximity logic would first fire.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, buildRoute, metres } from './make-drive.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const R = 6371008.8, rad = (d) => (d * Math.PI) / 180;
const proj = (p) => [rad(p[1]) * R * Math.cos(rad(48)), rad(p[0]) * R];
const readTxt = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => l.split(',').map(Number));

class Index { // segments of a polyline in 500 m grid cells
  constructor(pts) {
    this.xy = pts.map(proj); this.cell = 500; this.g = new Map();
    for (let i = 1; i < this.xy.length; i += 1) {
      const [a, b] = [this.xy[i - 1], this.xy[i]];
      const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 250) + 1;
      const seen = new Set();
      for (let k = 0; k <= n; k += 1) {
        const x = a[0] + ((b[0] - a[0]) * k) / n, y = a[1] + ((b[1] - a[1]) * k) / n;
        for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) {
          const key = `${Math.floor(x / this.cell) + dx},${Math.floor(y / this.cell) + dy}`;
          if (!seen.has(key)) { seen.add(key); if (!this.g.has(key)) this.g.set(key, []); this.g.get(key).push(i); }
        }
      }
    }
  }
  dist(p) {
    const q = proj(p); let best = Infinity;
    for (const i of this.g.get(`${Math.floor(q[0] / this.cell)},${Math.floor(q[1] / this.cell)}`) ?? []) {
      const a = this.xy[i - 1], b = this.xy[i];
      const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
      const t = l2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l2)) : 0;
      best = Math.min(best, Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy));
    }
    return best;
  }
}
// max/mean distance of the samples (every `step` m) of `from` to `to`, and where the max is (route km of `from`)
function oneWay(from, to, step = 1) {
  const idx = new Index(to); let max = 0, at = 0, sum = 0, n = 0, run = 0, over = 0;
  const samples = [];
  for (let i = 1; i < from.length; i += 1) {
    const a = from[i - 1], b = from[i], L = metres(a, b), k = Math.max(1, Math.ceil(L / step));
    for (let s = 0; s <= k; s += 1) {
      const p = [a[0] + ((b[0] - a[0]) * s) / k, a[1] + ((b[1] - a[1]) * s) / k];
      const d = idx.dist(p); if (d === Infinity) continue;
      sum += d; n += 1; if (d > max) { max = d; at = (run + (L * s) / k) / 1000; }
      samples.push(d);
    }
    run += L;
  }
  samples.sort((x, y) => x - y);
  return { max, at, mean: sum / n, p99: samples[Math.floor(samples.length * 0.99)] };
}
const len = (pts) => pts.reduce((s, p, i) => (i ? s + metres(pts[i - 1], p) : 0), 0);
const pct = (a, q) => a[Math.min(a.length - 1, Math.floor(a.length * q))];
function spacing(pts, km0, km1) {
  const d = []; let run = 0;
  for (let i = 1; i < pts.length; i += 1) { const l = metres(pts[i - 1], pts[i]); if (run / 1000 >= km0 && run / 1000 < km1) d.push(l); run += l; }
  d.sort((x, y) => x - y);
  return `n=${d.length} min ${d[0]?.toFixed(0)} p10 ${pct(d, 0.1)?.toFixed(0)} median ${pct(d, 0.5)?.toFixed(0)} p90 ${pct(d, 0.9)?.toFixed(0)} max ${d.at(-1)?.toFixed(0)} m`;
}

const places = JSON.parse(readFileSync(join(HERE, 'places.json'), 'utf8')).data.map((p) => ({ name: p.name, lat: Number(p.lat), lon: Number(p.lon), r: Number(p.radiusKm) }));
function proximity(track) {
  let run = 0; const first = new Map(); const nearest = new Map();
  track.forEach((p, i) => {
    if (i) run += metres(track[i - 1], p);
    for (const pl of places) {
      const d = metres(p, [pl.lat, pl.lon]) / 1000;
      if (d < (nearest.get(pl.name)?.d ?? Infinity)) nearest.set(pl.name, { d, km: run / 1000, p });
      if (d < pl.r && !first.has(pl.name)) first.set(pl.name, { km: run / 1000, d, p });
    }
  });
  for (const pl of places) {
    const f = first.get(pl.name), n = nearest.get(pl.name);
    console.log(`  ${pl.name.padEnd(30)} r=${String(pl.r).padStart(2)} km  closest ${n.d.toFixed(1)} km (route km ${n.km.toFixed(1)})  ${f ? `alert at route km ${f.km.toFixed(1)}, ${f.p.map((x) => x.toFixed(4))}, ${f.d.toFixed(1)} km from place` : 'no alert'}`);
  }
}

const cache = JSON.parse(readFileSync(join(HERE, 'apple-route.json'), 'utf8'));
const files = ['drive-munich-salzburg.txt', 'drive-munich-salzburg-direct.txt', 'drive-munich-salzburg-via-ruhpolding.txt'];
const tracks = files.flatMap((f) => { try { return [[f, readTxt(join(HERE, f))]]; } catch { return []; } });
for (const [name, legs] of Object.entries(ROUTES)) {
  const apple = buildRoute(cache, legs);
  // the file whose length is closest to this route's Apple polyline (the default route has the unsuffixed name)
  const [file, out] = tracks.reduce((b, t) => (Math.abs(len(t[1]) - len(apple)) < Math.abs(len(b[1]) - len(apple)) ? t : b));
  const total = len(apple) / 1000;
  const a = oneWay(out, apple), b = oneWay(apple, out);
  const steps = out.slice(1).map((p, i) => metres(out[i], p));
  console.log(`\n== ${name} (${file}) ==`);
  console.log(`Apple polyline: ${apple.length} points, ${total.toFixed(1)} km. Output: ${out.length} points, ${(len(out) / 1000).toFixed(1)} km`);
  console.log(`output track (all segments) -> Apple polyline: max ${a.max.toFixed(2)} m at route km ${a.at.toFixed(1)}, mean ${a.mean.toFixed(2)} m, p99 ${a.p99.toFixed(2)} m`);
  console.log(`Apple polyline -> output track: max ${b.max.toFixed(2)} m at route km ${b.at.toFixed(1)}, mean ${b.mean.toFixed(2)} m`);
  console.log(`longest output segment ${Math.max(...steps).toFixed(1)} m; shortest ${Math.min(...steps).toFixed(1)} m`);
  console.log(`spacing city (km 0-19): ${spacing(out, 0, 19)}`);
  console.log(`spacing A8 (km 25-${(total - 10).toFixed(0)}): ${spacing(out, 25, total - 10)}`);
  console.log(`spacing all: ${spacing(out, 0, 1e9)}`);
  proximity(out);
}
if (opt('--old')) {
  const old = readTxt(opt('--old'));
  console.log(`\n== old track ${opt('--old')} (${old.length} points, ${(len(old) / 1000).toFixed(1)} km) ==`);
  if (opt('--osrm')) {
    const osrm = JSON.parse(readFileSync(opt('--osrm'), 'utf8')).routes[0].geometry.coordinates.map(([lo, la]) => [la, lo]);
    const o = oneWay(old, osrm);
    console.log(`old straight segments -> OSRM road it was built from: max ${o.max.toFixed(0)} m at route km ${o.at.toFixed(1)}, mean ${o.mean.toFixed(1)} m, p99 ${o.p99.toFixed(0)} m`);
  }
  const apple = buildRoute(cache, ROUTES['via-ruhpolding']);
  const o2 = oneWay(old, apple);
  console.log(`old straight segments -> Apple polyline (includes route differences): max ${o2.max.toFixed(0)} m, mean ${o2.mean.toFixed(1)} m`);
  // old segments farther than 15 m from the road
  const osrm = opt('--osrm') ? JSON.parse(readFileSync(opt('--osrm'), 'utf8')).routes[0].geometry.coordinates.map(([lo, la]) => [la, lo]) : null;
  if (osrm) {
    const idx = new Index(osrm); let tot = 0, bad = 0;
    for (let i = 1; i < old.length; i += 1) { const L = metres(old[i - 1], old[i]); const k = Math.ceil(L / 5); for (let s = 0; s <= k; s += 1) { const p = [old[i - 1][0] + ((old[i][0] - old[i - 1][0]) * s) / k, old[i - 1][1] + ((old[i][1] - old[i - 1][1]) * s) / k]; tot += 1; if (idx.dist(p) > 15) bad += 1; } }
    console.log(`share of the old track more than 15 m off the OSRM road: ${((bad / tot) * 100).toFixed(1)} %`);
  }
}
