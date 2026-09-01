// Refreshes public/assets/flights-snapshot.json — the seed the globe draws on
// first paint, and the sky it falls back to whenever OpenSky is unreachable.
// Run with `npm run snapshot`. Keep the trimming in sync with
// netlify/functions/opensky.mjs, which shapes the live payload the same way.
import { writeFile } from "node:fs/promises";

const MAX = 2000;
const OUT = new URL("../public/assets/flights-snapshot.json", import.meta.url);

const response = await fetch("https://opensky-network.org/api/states/all", {
  signal: AbortSignal.timeout(30_000),
});
if (!response.ok) {
  console.error(`OpenSky answered ${response.status}`);
  process.exit(1);
}

const { time, states } = await response.json();
const airborne = [];
for (const state of states ?? []) {
  const [icao, , , , , lon, lat, baro, onGround, velocity, track, , , geo] = state;
  if (onGround || lon == null || lat == null) continue;
  airborne.push([
    icao,
    Math.round(lon * 100) / 100,
    Math.round(lat * 100) / 100,
    Math.round(geo ?? baro ?? 0),
    Math.round(track ?? 0),
    Math.round(velocity ?? 0),
  ]);
}

const stride = Math.ceil(airborne.length / MAX);
const flights = stride > 1 ? airborne.filter((_, index) => index % stride === 0) : airborne;

await writeFile(OUT, JSON.stringify({ time, total: airborne.length, flights }));
console.log(`snapshot: ${flights.length} letters from ${airborne.length} airborne`);
