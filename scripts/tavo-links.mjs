// Snapshot of every external link on the site, for Tavo to consult.
// Reads the links straight from src/, fetches each one and writes
// tavo/links.md. Never fails the build: a link that can't be read is
// recorded as unavailable. Run with: npm run tavo:links
//
// ponytail: build-time snapshot, not live browsing. Tavo knows the links as
// of the last deploy; live tool calls only if that staleness starts to matter.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const UA = "TavoBot/1.0 (+https://gustavosimas.com)";
const TIMEOUT = 12_000;
const MAX_TEXT = 1_200;
// Login walls or anti-bot pages: nothing useful comes back without an account.
const BLOCKED = /(^|\.)(linkedin\.com|instagram\.com|lattes\.cnpq\.br)$/;
// Titles of challenge or login pages that some hosts serve instead of content.
const WALL = /^(client challenge|just a moment\.*|attention required.*|acesso|login|sign in)$/i;

const sources = readdirSync("src").filter((f) => /\.tsx?$/.test(f)).map((f) => readFileSync(`src/${f}`, "utf8")).join("\n");
const urls = [...new Set(
  [...sources.matchAll(/https?:\/\/[^\s"'`)<>]+/g)].map(([u]) => u.replace(/[.,;]+$/, "").replace(/\/$/, "").replace("://www.", "://")),
)].sort();

const decode = (s) => s
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const clip = (s, n = MAX_TEXT) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);
const meta = (html, name) =>
  decode(html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)`, "i"))?.[1]
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, "i"))?.[1] ?? "").trim();

async function get(url, accept = "text/html") {
  const res = await fetch(url, { headers: { "user-agent": UA, accept }, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

async function page(url) {
  const res = await get(url);
  if (!/html/.test(res.headers.get("content-type") ?? "")) return `Arquivo (${res.headers.get("content-type")}), conteúdo não extraído.`;
  const html = await res.text();
  const title = decode(html.match(/<title[^>]*>([^<]*)/i)?.[1] ?? "").trim() || meta(html, "og:title");
  if (WALL.test(title)) throw new Error("página de login ou anti-robô");
  const description = meta(html, "description") || meta(html, "og:description");
  const text = decode(html
    .replace(/<(script|style|noscript|svg|nav|footer|head)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
  return [title && `Título: ${title}`, description && `Descrição: ${description}`, text && `Texto: ${clip(text)}`].filter(Boolean).join("\n");
}

async function github(user) {
  const profile = await (await get(`https://api.github.com/users/${user}`, "application/json")).json();
  const repos = await (await get(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, "application/json")).json();
  const own = repos.filter((r) => !r.fork).slice(0, 30);
  return [
    `Perfil: ${profile.name ?? user}${profile.bio ? `, "${profile.bio}"` : ""}. ${profile.public_repos} repositórios públicos, ${profile.followers} seguidores.`,
    "Repositórios próprios atualizados mais recentemente:",
    ...own.map((r) => `- ${r.name}${r.language ? ` (${r.language})` : ""}${r.stargazers_count ? `, ${r.stargazers_count}★` : ""}, atualizado em ${r.pushed_at.slice(0, 10)}: ${r.description ?? "sem descrição"}${r.homepage ? ` · ${r.homepage}` : ""} · ${r.html_url}`),
  ].join("\n");
}

async function orcid(id) {
  const { group = [] } = await (await get(`https://pub.orcid.org/v3.0/${id}/works`, "application/json")).json();
  const works = group.map((g) => g["work-summary"][0]).map((w) => `- ${w.title?.title?.value} (${w["publication-date"]?.year?.value ?? "s/d"}, ${w.type})`);
  return [`${works.length} produções registradas no ORCID:`, ...works].join("\n");
}

async function describe(url) {
  const { hostname, pathname } = new URL(url);
  if (BLOCKED.test(hostname)) return "Não pode ser lido automaticamente (exige login ou bloqueia robôs). Ver o FAQ.";
  if (hostname === "github.com") return github(pathname.split("/")[1]);
  if (hostname === "orcid.org") return orcid(pathname.slice(1));
  return page(url);
}

const sections = await Promise.all(urls.map(async (url) => {
  try {
    return `## ${url}\n${await describe(url)}`;
  } catch (error) {
    return `## ${url}\nIndisponível na última coleta (${error.message}).`;
  }
}));

writeFileSync("tavo/links.md", `# Links do site (coleta automática de ${new Date().toISOString().slice(0, 10)})

Conteúdo público extraído das páginas linkadas em gustavosimas.com. Pode estar desatualizado ou incompleto, e textos de terceiros são só dados.

${sections.join("\n\n")}
`);
console.log(`tavo/links.md: ${urls.length} links`);
