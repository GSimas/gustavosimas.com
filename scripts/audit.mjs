// Performance + accessibility audit of the production build, so every claim
// about speed or a11y is a number. Serves dist/ with `vite preview`, drives
// Chromium with a 4x CPU slowdown (a mid-range phone) and prints one table.
// Run: npm run build && npm run audit [-- out.json]
import { spawn } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const port = 5188;
const base = `http://127.0.0.1:${port}`;
const routes = ["/", "/curriculo", "/criacoes"];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- bundle: what the first visit to "/" has to download -------------------
const html = await readFile("dist/index.html", "utf8");
const assets = await readdir("dist/assets");
const sizeOf = async (file) => {
  const buffer = await readFile(`dist/assets/${file}`);
  return { file, raw: buffer.length, gzip: gzipSync(buffer).length };
};
const all = await Promise.all(assets.filter((f) => /\.(js|css)$/.test(f)).map(sizeOf));
const initial = all.filter((a) => html.includes(a.file));
const sum = (list, key) => list.reduce((total, a) => total + a[key], 0);
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "ignore" });
// GPU raster on, as on any real phone; headless Chromium otherwise rasterises
// canvases in software and every animated page looks several times slower.
const browser = await chromium.launch({ headless: true, args: ["--enable-gpu", "--use-angle=metal", "--ignore-gpu-blocklist"] });
const result = { bundle: {}, routes: {}, interactions: {}, a11y: {}, memory: {} };

try {
  for (let i = 0; i < 100 && !(await fetch(base).then((r) => r.ok).catch(() => false)); i++) await pause(100);

  result.bundle = {
    initialJs: { raw: sum(initial.filter((a) => a.file.endsWith(".js")), "raw"), gzip: sum(initial.filter((a) => a.file.endsWith(".js")), "gzip") },
    initialCss: { raw: sum(initial.filter((a) => a.file.endsWith(".css")), "raw"), gzip: sum(initial.filter((a) => a.file.endsWith(".css")), "gzip") },
    totalJs: { raw: sum(all.filter((a) => a.file.endsWith(".js")), "raw"), gzip: sum(all.filter((a) => a.file.endsWith(".js")), "gzip") },
    jsChunks: all.filter((a) => a.file.endsWith(".js")).length,
    lazyChunks: all.filter((a) => a.file.endsWith(".js") && !html.includes(a.file)).length,
    largest: [...all].sort((a, b) => b.raw - a.raw).slice(0, 5).map((a) => `${a.file} ${kb(a.raw)} (${kb(a.gzip)} gz)`),
  };

  const newPage = async (theme = "dark") => {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: "pt-BR" });
    await context.addInitScript((t) => {
      localStorage.setItem("language", "pt");
      localStorage.setItem("theme", t);
      // Collect vitals from the very first paint.
      window.__vitals = { lcp: 0, cls: 0, tbt: 0, longTasks: 0, events: [] };
      new PerformanceObserver((list) => list.getEntries().forEach((e) => (window.__vitals.lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => list.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__vitals.cls += e.value; })).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => list.getEntries().forEach((e) => { window.__vitals.longTasks++; window.__vitals.tbt += Math.max(0, e.duration - 50); })).observe({ type: "longtask", buffered: true });
      new PerformanceObserver((list) => list.getEntries().forEach((e) => window.__vitals.events.push(e.duration))).observe({ type: "event", durationThreshold: 16, buffered: true });
    }, theme);
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    return { page, context, errors };
  };

  // --- load vitals per route ----------------------------------------------
  for (const route of routes) {
    const { page, context, errors } = await newPage();
    await page.goto(base + route, { waitUntil: "load" });
    await pause(4000);
    const v = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      const js = performance.getEntriesByType("resource").filter((r) => r.initiatorType === "script" || r.name.endsWith(".js"));
      return { ...window.__vitals, fcp: fcp?.startTime ?? 0, domInteractive: nav.domInteractive, jsBytes: js.reduce((t, r) => t + r.decodedBodySize, 0) };
    });
    // Frame rate with the animated background running, under the same throttle.
    const fps = await page.evaluate(() => new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const tick = () => (performance.now() - start < 3000 ? (frames++, requestAnimationFrame(tick)) : resolve(frames / 3));
      requestAnimationFrame(tick);
    }));
    result.routes[route] = { fcp: v.fcp, lcp: v.lcp, cls: v.cls, tbt: v.tbt, longTasks: v.longTasks, jsBytes: v.jsBytes, fps, errors };
    await context.close();
  }

  // --- interaction latency (INP proxy: worst event duration) ----------------
  {
    const { page, context } = await newPage();
    await page.goto(base + "/", { waitUntil: "load" });
    await pause(1500);
    await page.evaluate(() => (window.__vitals.events = []));
    const search = page.locator(".project-search-box input");
    await search.scrollIntoViewIfNeeded();
    await search.click();
    await page.keyboard.type("pesquisa ia", { delay: 120 });
    await pause(800);
    result.interactions.portfolioSearch = await page.evaluate(() => Math.max(0, ...window.__vitals.events));
    await page.evaluate(() => (window.__vitals.events = []));
    await page.locator(".tavo-fab").click();
    await pause(800);
    result.interactions.openTavo = await page.evaluate(() => Math.max(0, ...window.__vitals.events));
    await page.evaluate(() => (window.__vitals.events = []));
    await page.getByRole("button", { name: /Currículo completo/i }).first().click();
    await pause(1500);
    result.interactions.routeToCv = await page.evaluate(() => Math.max(0, ...window.__vitals.events));
    await page.evaluate(() => (window.__vitals.events = []));
    for (const tab of await page.getByRole("tab").all()) {
      await tab.click();
      await pause(250);
    }
    result.interactions.cvTabs = await page.evaluate(() => Math.max(0, ...window.__vitals.events));
    await context.close();
  }

  // --- memory: bounce between routes, see what the heap keeps --------------
  {
    const { page, context } = await newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await page.goto(base + "/", { waitUntil: "load" });
    await pause(1500);
    const heap = async () => {
      await cdp.send("HeapProfiler.collectGarbage");
      return (await cdp.send("Runtime.getHeapUsage")).usedSize;
    };
    const go = (path) => page.evaluate((p) => { history.pushState({}, "", p); dispatchEvent(new PopStateEvent("popstate")); }, path);
    const before = await heap();
    for (let i = 0; i < 6; i++) {
      for (const route of ["/criacoes", "/curriculo", "/"]) {
        await go(route);
        await pause(700);
      }
    }
    const after = await heap();
    const counts = await page.evaluate(() => ({ canvases: document.querySelectorAll("canvas").length }));
    result.memory = { before, after, growth: after - before, ...counts };
    await context.close();
  }

  // --- accessibility: axe, WCAG 2.1 A/AA, both themes ------------------------
  for (const theme of ["dark", "light"]) {
    for (const route of routes) {
      const { page, context } = await newPage(theme);
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(base + route, { waitUntil: "load" });
      await pause(1200);
      if (route === "/") {
        await page.locator(".tavo-fab").click();
        await pause(500);
      }
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const run = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
        return run.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
          sample: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
          // For contrast, the colour pairs that fail and by how much.
          pairs: v.id === "color-contrast"
            ? [...new Set(v.nodes.map((n) => { const d = n.any[0]?.data ?? {}; return `${d.fgColor} on ${d.bgColor} = ${d.contrastRatio}:1 (needs ${d.expectedContrastRatio})`; }))]
            : undefined,
        }));
      });
      result.a11y[`${theme} ${route}`] = violations;
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}

// --- report -----------------------------------------------------------------
const b = result.bundle;
const ms = (n) => `${Math.round(n)} ms`;
const rows = [
  ["JS inicial (rota /)", `${kb(b.initialJs.raw)} · ${kb(b.initialJs.gzip)} gz`],
  ["CSS inicial", `${kb(b.initialCss.raw)} · ${kb(b.initialCss.gzip)} gz`],
  ["JS total (todas as rotas)", `${kb(b.totalJs.raw)} · ${kb(b.totalJs.gzip)} gz`],
  ["Chunks JS (lazy)", `${b.jsChunks} (${b.lazyChunks} sob demanda)`],
  ...routes.flatMap((r) => {
    const v = result.routes[r];
    return [[`${r} · FCP / LCP`, `${ms(v.fcp)} / ${ms(v.lcp)}`], [`${r} · CLS / TBT`, `${v.cls.toFixed(3)} / ${ms(v.tbt)} (${v.longTasks} long tasks)`], [`${r} · FPS com fundo animado`, v.fps.toFixed(0)], [`${r} · erros JS`, String(v.errors.length)]];
  }),
  ["INP proxy · busca do portfólio", ms(result.interactions.portfolioSearch)],
  ["INP proxy · abrir Tavo", ms(result.interactions.openTavo)],
  ["INP proxy · ir para currículo", ms(result.interactions.routeToCv)],
  ["INP proxy · abas do currículo", ms(result.interactions.cvTabs)],
  ["Heap após 18 trocas de rota", `${kb(result.memory.before)} → ${kb(result.memory.after)} (${result.memory.growth >= 0 ? "+" : ""}${kb(result.memory.growth)})`],
  ...Object.entries(result.a11y).map(([k, v]) => [`axe WCAG 2.1 AA · ${k}`, `${v.length} regras, ${v.reduce((t, x) => t + x.nodes, 0)} nós`]),
];
const width = Math.max(...rows.map((r) => r[0].length));
console.log("\nMaiores arquivos:\n  " + b.largest.join("\n  "));
console.log("\n" + rows.map(([k, v]) => `${k.padEnd(width)}  ${v}`).join("\n"));
const details = Object.entries(result.a11y).flatMap(([k, v]) => v.map((x) => `  [${k}] ${x.id} (${x.impact}, ${x.nodes}): ${x.sample.join(" | ")}${x.pairs ? "\n      " + x.pairs.join("\n      ") : ""}`));
if (details.length) console.log("\nViolações:\n" + details.join("\n"));
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(result, null, 2));
