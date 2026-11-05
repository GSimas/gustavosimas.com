// Latest posts from the Medium blog. The feed sends no CORS header, so the
// browser can't read it: this runs server-side (Netlify function in production,
// Vite middleware in dev) and hands the page a small JSON instead of 300 KB of XML.
import type { Post } from "../../src/content.ts";

const FEED = "https://medium.com/feed/@tudoemsimas";
const LIMIT = 5;
const EXCERPT_CHARS = 200;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

const decode = (text: string) =>
  text.replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (entity, dec, hex, name) =>
    dec ? String.fromCodePoint(Number(dec)) : hex ? String.fromCodePoint(parseInt(hex, 16)) : ENTITIES[name] ?? entity,
  );

const plainText = (html: string) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const field = (item: string, name: string) =>
  item.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))?.[1] ?? "";

// Only Medium's image CDN counts: every post also carries a tracking pixel as
// an <img>, which would become the cover of a post with no picture of its own.
const coverImage = (html: string) =>
  html.match(/<img[^>]*\bsrc="(https:\/\/cdn-images-1\.medium\.com\/[^"]+)"/)?.[1].replace(/\/max\/\d+\//, "/max/320/") ?? null;

function excerptOf(html: string) {
  for (const [, paragraph] of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
    const text = plainText(paragraph);
    if (text) return text.length > EXCERPT_CHARS ? `${text.slice(0, EXCERPT_CHARS).replace(/\s+\S*$/, "")}…` : text;
  }
  return "";
}

export function parseFeed(xml: string): Post[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => {
      const html = field(item, "content:encoded");
      return {
        title: plainText(field(item, "title")),
        link: field(item, "link").trim().split("?")[0], // drops Medium's RSS tracking
        date: field(item, "pubDate").trim(),
        excerpt: excerptOf(html),
        image: coverImage(html),
      };
    })
    .filter((post) => post.title && post.link.startsWith("https://") && !Number.isNaN(Date.parse(post.date)))
    .map((post) => ({ ...post, date: new Date(post.date).toISOString() }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, LIMIT);
}

export async function handlePosts(): Promise<Response> {
  try {
    const upstream = await fetch(FEED, { signal: AbortSignal.timeout(8_000) });
    if (!upstream.ok) throw new Error(`feed answered ${upstream.status}`);
    const posts = parseFeed(await upstream.text());
    if (posts.length === 0) throw new Error("feed has no posts");
    return Response.json(
      { posts },
      {
        headers: {
          // The CDN answers for an hour, then refreshes in the background, so a
          // new post shows up within about an hour and readers never wait on Medium.
          "cache-control": "public, max-age=300",
          "netlify-cdn-cache-control": "public, durable, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("posts:", error);
    return Response.json({ error: "feed unavailable" }, { status: 502, headers: { "cache-control": "no-store" } });
  }
}

export default handlePosts;

export const config = {
  path: "/api/posts",
  method: "GET",
};
