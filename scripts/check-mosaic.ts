import assert from 'node:assert/strict';
import { cleanMosaicWord, mosaicCoverage, mosaicGrid, mosaicTargets, mosaicView, sampleMosaicGlyph } from '../src/mosaic.ts';

// The composition must NEVER sacrifice its resolution on a smaller screen.
// The reading view must NEVER sacrifice physical text size to make it fit.
const words = ['A', 'I', 'EU', 'LIXO', 'AMOR', 'MEMÓRIA', 'AÇÃO', 'ESCAPAMENTO', 'CONHECIMENTO', 'PROMPTOGRAFI'];
const screens = [[280, 220], [328, 220], [560, 234], [720, 300], [958, 399], [1440, 600]];
let cases = 0;
for (const stencil of words) {
  for (const tile of words) {
    const grid = mosaicGrid(1056, 230, stencil.length, tile.length * 0.6);
    assert(grid.cell * stencil.length * mosaicTargets.cellsPerLetter <= 1056 + 1e-8);
    assert(grid.rowHeight * mosaicTargets.rows <= 230 + 1e-8);
    assert(grid.cell > grid.size * tile.length * 0.6, 'Word needs breathing room');
    for (const [width, height] of screens) {
      for (const ratio of [1, 1.25, 2, 3]) {
        const overview = mosaicView(width, height, grid.size, false);
        assert(1200 * overview.scale <= width + 1e-8);
        assert(500 * overview.scale <= height + 1e-8);
        const reading = mosaicView(width, height, grid.size, true);
        assert(grid.size * reading.scale >= 14 - 1e-8, `Unreadable ${stencil}/${tile}`);
        assert(reading.width >= width && reading.height >= height);
        assert(grid.size * reading.scale * ratio >= 14 - 1e-8);
        cases++;
      }
    }
  }
}
assert.equal(cleanMosaicWord('', 'LIXO'), 'LIXO');
assert.equal(cleanMosaicWord('   ', 'LUXO'), 'LUXO');
assert.equal(cleanMosaicWord('ac\u0327a\u0303o', 'LIXO'), 'AÇÃO');
assert.equal(cleanMosaicWord('  memória  ', 'LIXO'), 'MEMÓRIA');
assert.equal(cleanMosaicWord('\uFE0F\u0301', 'LIXO'), 'LIXO');
assert(mosaicGrid(0, 0, 1, 0).rowHeight > 0, 'Invisible glyph cannot cause an infinite loop');
assert.equal(cleanMosaicWord('\u200b\u0000', 'LIXO'), 'LIXO');
assert.equal(Array.from(cleanMosaicWord('ß'.repeat(12), 'LIXO')).length, 12);
assert.equal(cleanMosaicWord('abcdefghijklmnop', 'LIXO'), 'ABCDEFGHIJKL');

// Synthetic O with a counter: evaluate real occupied area, including empty
// centres, bounds and subpixel antialiasing. A filled counter is a regression.
const width = 120;
const height = 100;
const data = new Uint8ClampedArray(width * height * 4);
for (let y = 10; y < 90; y++) {
  for (let x = 10; x < 110; x++) {
    if (x < 30 || x >= 90 || y < 30 || y >= 70) data[(y * width + x) * 4 + 3] = 255;
  }
}
const coverage = mosaicCoverage(data, width, height);
assert.equal(coverage(0, 0, width, height), 5600);
assert.equal(coverage(30, 30, 90, 70), 0);
assert.equal(coverage(-100, -100, 200, 200), 5600);
assert.equal(coverage(15, 15, 25, 25), 100);
const grid = { cell: 10, rowHeight: 10 };
const sampled = sampleMosaicGlyph({ left: 0, right: 120, top: 0, bottom: 100 }, grid, coverage, 0);
assert.equal(sampled.fidelity, 1);
assert.equal(sampled.cells.length, 56);
for (const cell of sampled.cells) {
  assert(!(cell.x > 30 && cell.x < 90 && cell.y > 30 && cell.y < 70), 'Counter filled');
  assert(cell.x - 5 >= 0 && cell.x + 5 <= width, 'Escaped glyph region');
}
const translucent = new Uint8ClampedArray([0, 0, 0, 128]);
assert(Math.abs(mosaicCoverage(translucent, 1, 1)(0, 0, 1, 1) - 128 / 255) < 1e-8);
assert(Math.abs(mosaicCoverage(translucent, 1, 1)(0.25, 0.25, 0.75, 0.75) - 128 / 255 / 4) < 1e-8);
console.log(`ok — ${cases} screen/pair/DPR combinations; normalization, counters, sampling and 14px reading floor`);
