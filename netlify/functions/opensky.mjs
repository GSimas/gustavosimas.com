// OpenSky answers with access-control-allow-origin: https://opensky-network.org,
// so the browser cannot call it directly. This proxies it and trims the payload
// from ~1 MB to the six fields the globe actually draws.
const TTL = 60_000;
const MAX = 2000;

const cache = { at: 0, body: null };
const token = { value: "", until: 0 };

// Anonymous access is 400 credits/day per IP (4 per global query). Set
// OPENSKY_CLIENT_ID / OPENSKY_CLIENT_SECRET in Netlify for 4000/day.
async function accessToken() {
  const id = process.env.OPENSKY_CLIENT_ID;
  const secret = process.env.OPENSKY_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (token.value && Date.now() < token.until) return token.value;

  const response = await fetch(
    "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
    },
  );
  if (!response.ok) return null;
  const data = await response.json();
  token.value = data.access_token;
  token.until = Date.now() + (data.expires_in - 60) * 1000;
  return token.value;
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=45",
      "netlify-cdn-cache-control": "public, s-maxage=60, stale-while-revalidate=900",
    },
  });

export default async () => {
  if (cache.body && Date.now() - cache.at < TTL) return json(cache.body);

  const bearer = await accessToken();
  const upstream = await fetch("https://opensky-network.org/api/states/all", {
    headers: bearer ? { authorization: `Bearer ${bearer}` } : {},
  });

  if (!upstream.ok) {
    // Rate limited or down: serve the stale snapshot so the globe keeps flying.
    if (cache.body) return json(cache.body);
    return json({ error: upstream.status }, 503);
  }

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

  cache.body = { time, total: airborne.length, flights };
  cache.at = Date.now();
  return json(cache.body);
};
