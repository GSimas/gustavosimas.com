// Self-check for the Medium feed parser, with the network mocked out.
// Run with: npm run check:posts
import assert from "node:assert/strict";
import { handlePosts, parseFeed } from "../netlify/functions/posts.ts";

const PIXEL = '<img src="https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=abc" width="1" height="1" alt="">';
const item = (title: string, date: string, html = "<p>Texto.</p>", link = `https://tudoemsimas.medium.com/${date.slice(0, 2)}?source=rss-1`) =>
  `<item><title><![CDATA[${title}]]></title><link>${link}</link><pubDate>${date}</pubDate><content:encoded><![CDATA[${html}]]></content:encoded></item>`;

const days = ["01", "02", "03", "04", "05", "06", "07"];
const many = days.map((day) => item(`Post ${day}`, `${day} Nov 2026 10:00:00 GMT`)).join("");
const newestFirst = parseFeed(many);
assert.deepEqual(newestFirst.map((post) => post.title), ["Post 07", "Post 06", "Post 05", "Post 04", "Post 03"], "the five newest, newest first");
assert.equal(newestFirst[0].date, "2026-11-07T10:00:00.000Z", "date becomes ISO");
assert.equal(newestFirst[0].link, "https://tudoemsimas.medium.com/07", "RSS tracking is dropped from the link");

const [rich] = parseFeed(
  item(
    "  Título com espaço ",
    "Wed, 04 Nov 2026 23:16:52 GMT",
    `<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*capa.jpeg" /></figure><p> </p><p><strong>Lula</strong> &amp; o &#8220;celular&#x201D;.</p><p>Depois.</p>${PIXEL}`,
  ),
);
assert.equal(rich.title, "Título com espaço", "title is trimmed");
assert.equal(rich.excerpt, "Lula & o “celular”.", "excerpt is the first paragraph with text, as plain text");
assert.equal(rich.image, "https://cdn-images-1.medium.com/max/320/1*capa.jpeg", "cover is resized");

const [pixelOnly] = parseFeed(item("Só o pixel", "04 Nov 2026 10:00:00 GMT", `<p>Sem imagem.</p>${PIXEL}`));
assert.equal(pixelOnly.image, null, "the tracking pixel never becomes a cover");

const [long] = parseFeed(item("Longo", "04 Nov 2026 10:00:00 GMT", `<p>${"palavra ".repeat(60)}</p>`));
assert.ok(long.excerpt.length <= 201 && long.excerpt.endsWith("palavra…"), "long excerpts are cut between words");

assert.deepEqual(
  parseFeed(
    item("Link ruim", "04 Nov 2026 10:00:00 GMT", "<p>x</p>", "javascript:alert(1)") +
      item("Data ruim", "ontem") +
      item("", "04 Nov 2026 10:00:00 GMT"),
  ),
  [],
  "items with an unsafe link, a bad date or no title are dropped",
);

const realFetch = globalThis.fetch;
const silence = console.error;
console.error = () => {};
try {
  globalThis.fetch = (async () => new Response(many)) as typeof fetch;
  const ok = await handlePosts();
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get("netlify-cdn-cache-control") ?? "", /s-maxage/);
  assert.equal(((await ok.json()) as { posts: unknown[] }).posts.length, 5);

  const failures: Array<() => Promise<Response>> = [
    async () => new Response("blocked", { status: 403 }),
    async () => new Response("<rss></rss>"),
    async () => {
      throw new Error("network down");
    },
  ];
  for (const failure of failures) {
    globalThis.fetch = failure as typeof fetch;
    const failed = await handlePosts();
    assert.equal(failed.status, 502, "a failed feed answers 502");
    assert.equal(failed.headers.get("cache-control"), "no-store", "a failure is never cached");
  }
} finally {
  globalThis.fetch = realFetch;
  console.error = silence;
}

console.log("check:posts ok");
