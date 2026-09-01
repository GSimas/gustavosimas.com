// OpenSky answers with access-control-allow-origin: https://opensky-network.org,
// so the browser cannot call it directly. This proxies it and trims the payload
// from ~1 MB to the six fields the globe actually draws.
const TTL = 60_000;
const MAX = 2000;
// The platform kills the invocation at 10s, and an overrun surfaces as a 502
// with an empty globe behind it. Spend at most this long chasing OpenSky, then
// fall back. The budget has to be generous: the API routinely needs ~5s to hand
// over its ~1 MB, and the auth round trip comes out of the same envelope.
const BUDGET = 8_500;
const AUTH_TIMEOUT = 2_000;

const cache = { at: 0, body: null };
const token = { value: "", until: 0 };

// Anonymous access is 400 credits/day per IP (4 per global query). Set
// OPENSKY_CLIENT_ID / OPENSKY_CLIENT_SECRET in Netlify for 4000/day.
async function accessToken() {
  const id = process.env.OPENSKY_CLIENT_ID;
  const secret = process.env.OPENSKY_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (token.value && Date.now() < token.until) return token.value;

  try {
    const response = await fetch(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
        signal: AbortSignal.timeout(AUTH_TIMEOUT),
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    token.value = data.access_token;
    token.until = Date.now() + (data.expires_in - 60) * 1000;
    return token.value;
  } catch {
    // No token just means we fall back to anonymous access.
    return null;
  }
}

const json = (body, { status = 200, sMaxAge = 60 } = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${Math.min(45, sMaxAge)}`,
      "netlify-cdn-cache-control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=900`,
    },
  });

async function currentSky(deadline) {
  const bearer = await accessToken();
  const upstream = await fetch("https://opensky-network.org/api/states/all", {
    headers: bearer ? { authorization: `Bearer ${bearer}` } : {},
    signal: AbortSignal.timeout(Math.max(1_000, deadline - Date.now())),
  });
  if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);

  const { time, states } = await upstream.json();
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

  // ponytail: even stride instead of a spatial sample — fine at globe scale,
  // revisit if someone zooms in far enough to notice the thinning.
  const stride = Math.ceil(airborne.length / MAX);
  const flights = stride > 1 ? airborne.filter((_, index) => index % stride === 0) : airborne;

  return { time, total: airborne.length, flights };
}

export default async () => {
  if (cache.body && Date.now() - cache.at < TTL) return json({ ...cache.body, source: "cache" });

  try {
    const body = await currentSky(Date.now() + BUDGET);
    cache.body = body;
    cache.at = Date.now();
    return json({ ...body, source: "live" });
  } catch (error) {
    console.warn("opensky unreachable:", error?.message ?? error, error?.cause?.message ?? "");
    // Rate limited, blocked or simply unreachable — an unhandled throw here
    // used to surface as a 502 and leave the globe empty. Serve the last good
    // sky this instance saw; failing that, say nothing is available and let
    // the page keep flying the snapshot it already shipped with. Either way
    // the CDN only holds the degraded answer briefly, so we recover quickly.
    if (cache.body) return json({ ...cache.body, source: "cache" }, { sMaxAge: 30 });
    return json({ flights: [], source: "unavailable" }, { sMaxAge: 15 });
  }
};
