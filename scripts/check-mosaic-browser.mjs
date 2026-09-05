// Real fonts, masks and interactions. Starts an isolated Vite server and always
// closes it. Run npm run check:mosaic:browser (install browsers once beforehand).
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, firefox, webkit } from 'playwright';

const port = 5187;
const url = `http://127.0.0.1:${port}`;
const output = process.env.MOSAIC_SCREENSHOTS || '/tmp/mosaic-regression';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '';
server.stdout.on('data', data => { serverLog += data; });
server.stderr.on('data', data => { serverLog += data; });
const browsers = { chromium, firefox, webkit };
let browser;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(serverLog);
    if (await fetch(url).then(r => r.ok).catch(() => false)) break;
    if (attempt === 99) throw new Error(`Vite did not start: ${serverLog}`);
    await pause(100);
  }
  await mkdir(output, { recursive: true });
  for (const engine of (process.env.MOSAIC_BROWSERS || 'chromium').split(',')) {
    browser = await browsers[engine].launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, locale: 'pt-BR', reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => localStorage.setItem('language', 'pt'));
    await page.goto(`${url}/criacoes`, { waitUntil: 'domcontentloaded' });
    const whole = page.getByRole('button', { name: 'Palavras inteiras', exact: true });
    const reading = page.getByRole('button', { name: 'Ler preenchimento', exact: true });
    const overview = page.getByRole('button', { name: 'Visão geral', exact: true });
    const canvas = page.locator('.is-mosaic');
    const viewport = page.locator('.mosaic-viewport');
    await whole.click();
    await page.waitForFunction(() => document.querySelector('.is-mosaic')?.dataset.ready === 'true');
    await page.evaluate(() => document.fonts.ready);

    const stats = await page.evaluate(async () => {
      const { buildMosaicLayout, mosaicTileFont } = await import('/src/mosaic-renderer.ts');
      const pairs = [
        ['AMOR', 'ESPANTO'], ['LIXO', 'LUXO'], ['EU', 'ALMA'], ['A', 'A'],
        ['I', 'CONHECIMENTO'], ['AÇÃO', 'MEMÓRIA'], ['ÓRGÃO', 'CORAÇÃO'],
        ['ESCAPAMENTO', 'A'], ['CONHECIMENTO', 'ESCAPAMENTO'],
        ['WWWWWWWWWWWW', 'MMMMMMMMMMMM'], ['IIIIIIIIIIII', 'WWWWWWWWWWWW'],
        ['B8O0QDR', 'VAZIO'], ['NMXVWZ', 'INTERIOR'], ['.,:!?', 'PONTO'],
        ['A A', 'ESPAÇO'], ['ÁÉÍÓÚÂÊÔÃÕÇÜ', 'ACENTUAÇÃO'],
        ['LIXO', 'J'], ['Ó', 'Á'], ['B', 'Ç'],
      ];
      return pairs.map(([stencil, tile]) => {
        const start = performance.now();
        const layout = buildMosaicLayout(stencil, tile);
        const violations = [];
        const measuring = document.createElement('canvas').getContext('2d');
        measuring.font = mosaicTileFont(100);
        measuring.textAlign = 'center';
        const ink = measuring.measureText(tile);
        if (Math.max(ink.actualBoundingBoxLeft, ink.actualBoundingBoxRight) * layout.size / 100 > layout.cell / 2) violations.push('tile wider than cell');
        if ((ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent) * layout.size / 100 > layout.rowHeight) violations.push('tile taller than row');
        for (const cell of layout.cells) {
          const region = layout.regions[cell.glyph];
          if (cell.x - layout.cell / 2 < region.left - 1e-6 || cell.x + layout.cell / 2 > region.right + 1e-6) violations.push('letter bridge');
          if (cell.y - layout.rowHeight / 2 < 0 || cell.y + layout.rowHeight / 2 > 500) violations.push('canvas clipping');
        }
        const visibleLetters = Array.from(stencil).map((letter, index) => letter.trim() ? index : -1).filter(i => i >= 0);
        for (const index of visibleLetters) if (!layout.cells.some(cell => cell.glyph === index)) violations.push(`missing glyph ${index}`);
        return { stencil, tile, violations, fidelity: Math.min(...visibleLetters.map(i => layout.fidelity[i])), cells: layout.cells.length, ms: performance.now() - start };
      });
    });
    await writeFile(`${output}/${engine}-metrics.json`, JSON.stringify(stats, null, 2));
    console.log(`${engine}: minimum silhouette IoU ${Math.min(...stats.map(s => s.fidelity)).toFixed(3)}, maximum layout time ${Math.max(...stats.map(s => s.ms)).toFixed(0)}ms`);
    for (const stat of stats) {
      assert.deepEqual(stat.violations, [], `${stat.stencil}/${stat.tile}`);
      assert(stat.fidelity >= 0.82, `${stat.stencil}/${stat.tile} lost its silhouette: ${stat.fidelity}`);
      assert(stat.cells > 0 && stat.cells < 30000);
    }

    // Screenshots are part of the check, not a substitute for the assertions.
    for (const [stencil, tile, width] of [
      ['amor', 'espanto', 1440], ['ação', 'memória', 768],
      ['conhecimento', 'escapamento', 390], ['I', 'WWWWWWWWWWWW', 320],
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await overview.click();
      await page.locator('#mosaic-stencil').fill(stencil);
      await page.locator('#mosaic-tile').fill(tile);
      await page.waitForTimeout(450);
      await page.locator('.mosaic-poem').screenshot({ path: `${output}/${engine}-${width}-${stencil}-overview.png` });
      assert(await page.locator('.mosaic-poem').evaluate(e => e.getBoundingClientRect().right <= innerWidth && e.scrollWidth <= e.clientWidth + 1), `Poem overflow at ${width}px`);
      await reading.click();
      await page.waitForTimeout(150);
      assert(Number(await canvas.getAttribute('data-tile-size')) >= 14 - 1e-6, 'Reading font shrank');
      await page.locator('.mosaic-poem').screenshot({ path: `${output}/${engine}-${width}-${stencil}-reading.png` });
      const backing = await canvas.evaluate(e => ({ width: e.width, height: e.height, rect: e.getBoundingClientRect().toJSON(), ratio: devicePixelRatio }));
      assert(backing.width <= Math.ceil(backing.rect.width * backing.ratio));
      assert(backing.height <= Math.ceil(backing.rect.height * backing.ratio));
      await viewport.focus();
      const before = await viewport.evaluate(e => e.scrollLeft);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      assert(await viewport.evaluate(e => e.scrollLeft) > before, 'Keyboard panning failed');
      const initialImage = await canvas.evaluate(e => e.toDataURL());
      await viewport.evaluate(e => { e.scrollLeft += 150; e.scrollTop += 30; });
      await page.waitForTimeout(100);
      assert(await canvas.evaluate(e => e.toDataURL()) !== initialImage, `Panning did not redraw at ${width}px`);
      await overview.click();
      await page.waitForTimeout(100);
      assert.equal(await viewport.evaluate(e => e.scrollLeft), 0);
    }

    // Blank/decomposed/long input and a static font event must update the canvas.
    await page.locator('#mosaic-stencil').fill('ac\u0327a\u0303o');
    await page.locator('#mosaic-tile').fill('');
    await page.waitForTimeout(250);
    assert.match(await canvas.getAttribute('aria-label'), /AÇÃO.*LUXO/);
    await page.locator('#mosaic-stencil').fill('abcdefghijklmnop');
    assert.equal(await page.locator('#mosaic-stencil').inputValue(), 'abcdefghijkl');
    await page.locator('#mosaic-stencil').fill('');
    await page.waitForTimeout(250);
    assert.match(await canvas.getAttribute('aria-label'), /LIXO.*LUXO/);
    await page.evaluate(() => {
      const canvas = document.querySelector('.is-mosaic');
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      document.fonts.dispatchEvent(new Event('loadingdone'));
    });
    await page.waitForTimeout(250);
    assert(await canvas.evaluate(e => e.getContext('2d').getImageData(0, 0, e.width, e.height).data.some((n, i) => i % 4 === 3 && n > 0)), 'Late font left a blank static canvas');
    await page.getByRole('button', { name: 'Palavra contínua', exact: true }).click();
    await viewport.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const staticImage = await canvas.evaluate(e => e.toDataURL());
    await page.waitForTimeout(200);
    assert(await canvas.evaluate(e => e.toDataURL()) === staticImage, 'Reduced motion was ignored');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(100);
    const movingImage = await canvas.evaluate(e => e.toDataURL());
    await page.waitForTimeout(200);
    assert(await canvas.evaluate(e => e.toDataURL()) !== movingImage, 'Flow did not animate');
    await reading.click();
    await viewport.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const readingImage = await canvas.evaluate(e => e.toDataURL());
    await page.waitForTimeout(200);
    assert(await canvas.evaluate(e => e.toDataURL()) === readingImage, 'Reading mode must pause motion');
    await page.locator('.cr-toolbar .cv-theme-toggle').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('.cr-toolbar .cv-language-toggle').click();
    assert(await page.getByRole('button', { name: 'Read the filling', exact: true }).isVisible());
    await page.locator('.mosaic-poem').screenshot({ path: `${output}/${engine}-light-en.png` });

    // Actual browser backing stores at fractional and high DPR, with web fonts
    // unavailable. Neither zoom nor the physical font floor depends on DPR.
    for (const ratio of engine === 'chromium' ? [1.25, 2, 3] : [2]) {
      const fallback = await browser.newPage({ viewport: { width: 390, height: 850 }, deviceScaleFactor: ratio, reducedMotion: 'reduce' });
      await fallback.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
      await fallback.addInitScript(() => localStorage.setItem('language', 'pt'));
      await fallback.goto(`${url}/criacoes`, { waitUntil: 'domcontentloaded' });
      await fallback.getByRole('button', { name: 'Palavras inteiras', exact: true }).click();
      await fallback.locator('#mosaic-stencil').fill('memória');
      await fallback.locator('#mosaic-tile').fill('conhecimento');
      await fallback.waitForTimeout(350);
      await fallback.getByRole('button', { name: 'Ler preenchimento', exact: true }).click();
      await fallback.waitForTimeout(150);
      const details = await fallback.locator('.is-mosaic').evaluate(e => ({
        size: Number(e.dataset.tileSize), width: e.width, cssWidth: e.getBoundingClientRect().width,
        visible: e.getContext('2d').getImageData(0, 0, e.width, e.height).data.some((n, i) => i % 4 === 3 && n > 0),
      }));
      assert(details.size >= 14 - 1e-6 && details.visible, `Fallback at DPR ${ratio} is unreadable`);
      assert(Math.abs(details.width - details.cssWidth * ratio) <= 1, 'DPR backing store mismatch');
      await fallback.locator('.mosaic-poem').screenshot({ path: `${output}/${engine}-fallback-dpr${ratio}.png` });
      await fallback.close();
    }
    assert.deepEqual(errors, [], 'Browser errors');
    await browser.close(); browser = undefined;
    console.log(`ok — ${engine}: 19 raster pairs, 4 responsive/reading cases, keyboard, pan, input, late/failed fonts, DPR, theme/language and motion`);
  }
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
