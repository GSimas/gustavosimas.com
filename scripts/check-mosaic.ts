// Self-check for the whole-word grid of "Uma Palavra Dentro da Outra": for every
// pairing of big word and filler word, assert the grid still samples the stencil
// finely enough for its letters to read, covers the canvas, and stays symmetric.
// Run with: npm run check:mosaic
import { mosaicGrid, mosaicMinSize, mosaicStencil, mosaicTargets, type MosaicInk } from "../src/mosaic.ts";

// DM Mono is monospaced: every glyph advances the same fraction of the type size.
const monoAdvance = 0.6;
const widthOf = (word: string) => word.length * monoAdvance;

// Inter 700 capitals, near enough for a layout check.
const stencilAdvance = 0.62;
const capHeight = 0.72;

// What the canvas does before the grid is asked for anything.
function stencilInk(word: string, canvasWidth: number, canvasHeight: number): MosaicInk {
  const perPixel = word.length * stencilAdvance;
  const { size, squeeze } = mosaicStencil(canvasWidth, canvasHeight, perPixel);
  return { width: size * perPixel * squeeze, height: size * capHeight };
}

// Width, height and pixel ratio of the canvas as the page actually lays it out.
const canvases: Array<[string, number, number, number]> = [
  ["desktop@1x", 958, 399, 1],
  ["desktop@2x", 958, 399, 2],
  ["laptop", 720, 300, 2],
  ["tablet", 560, 233, 2],
  ["phone", 328, 137, 2],
];

const stencils = ["LIXO", "AMOR", "EU", "A", "ESCAPAMENTO", "PROMPTOGRAFIA".slice(0, 12)];
const tiles = ["LUXO", "ALMA", "ESCAPAMENTO", "A", "NÓS", "CONHECIMENTO"];

let checked = 0;
let starved = 0;
let worstColumns = Infinity;
let worstRows = Infinity;

for (const [label, canvasWidth, canvasHeight, pixelRatio] of canvases) {
  for (const stencil of stencils) {
    const ink = stencilInk(stencil, canvasWidth, canvasHeight);
    for (const tile of tiles) {
      const grid = mosaicGrid(canvasWidth, canvasHeight, ink, stencil.length, widthOf(tile), pixelRatio);
      const where = `${label} ${stencil}/${tile}`;
      checked += 1;

      // The filler word has to stay a word.
      assert(grid.size >= mosaicMinSize(pixelRatio), `${where}: type size ${grid.size.toFixed(2)} below the floor`);
      assert(grid.size <= mosaicTargets.maxSize, `${where}: type size ${grid.size.toFixed(2)} above the ceiling`);

      // The grid has to cover the canvas, or the drawing gets a bald edge.
      assert(grid.left <= 0 && grid.top <= 0, `${where}: grid starts inside the canvas`);
      assert(grid.left + grid.columns * grid.cell >= canvasWidth - 1e-9, `${where}: grid stops short on the right`);
      assert(grid.top + grid.rows * grid.rowHeight >= canvasHeight - 1e-9, `${where}: grid stops short at the bottom`);

      // A cell centred on each axis, so both halves of a letter are sampled alike.
      const columnOffset = (canvasWidth / 2 - (grid.left + grid.cell / 2)) % grid.cell;
      const rowOffset = (canvasHeight / 2 - (grid.top + grid.rowHeight / 2)) % grid.rowHeight;
      assert(near(columnOffset, 0, grid.cell), `${where}: no column centred on the axis`);
      assert(near(rowOffset, 0, grid.rowHeight), `${where}: no row centred on the axis`);

      // Whole words only: a word must fit inside its own cell.
      assert(grid.cell >= grid.size * widthOf(tile), `${where}: cell narrower than the word it holds`);

      if (grid.starved) {
        // Some pairings simply do not fit: a twelve-letter word on a phone is
        // drawn small, and a long filler word needs wide cells. What the grid
        // owes then is the best it is allowed to do — type at the floor — not a
        // resolution the frame cannot hold.
        starved += 1;
        assert(grid.size === grid.minSize, `${where}: starved without reaching the floor`);
        continue;
      }

      // The resolution the whole mode lives or dies by.
      const wantedColumns = Math.max(mosaicTargets.minColumns, stencil.length * mosaicTargets.cellsPerLetter);
      assert(
        grid.sampledColumns >= Math.floor(wantedColumns) - 1,
        `${where}: only ${grid.sampledColumns} columns across the stencil, wanted ${wantedColumns.toFixed(1)}`,
      );
      assert(
        grid.sampledRows >= mosaicTargets.rows - 1,
        `${where}: only ${grid.sampledRows} rows across the stencil, wanted ${mosaicTargets.rows}`,
      );
      worstColumns = Math.min(worstColumns, grid.sampledColumns / stencil.length);
      worstRows = Math.min(worstRows, grid.sampledRows);
    }
  }
}

// Pairings that have to read, whatever else happens — the awkward ones first.
const mustRead: Array<[string, string]> = [
  ["AMOR", "ESCAPAMENTO"],
  ["LIXO", "LUXO"],
  ["ESCAPAMENTO", "LUXO"],
  ["EU", "ALMA"],
  ["PROMPTOGRAF", "AR"],
  ["CORPO", "MEMÓRIA"],
];
for (const [label, canvasWidth, canvasHeight, pixelRatio] of canvases.slice(0, 4)) {
  for (const [stencil, tile] of mustRead) {
    const ink = stencilInk(stencil, canvasWidth, canvasHeight);
    const grid = mosaicGrid(canvasWidth, canvasHeight, ink, stencil.length, widthOf(tile), pixelRatio);
    const perLetter = grid.sampledColumns / stencil.length;
    const where = `${label} ${stencil}/${tile}`;
    assert(perLetter >= 3, `${where}: ${perLetter.toFixed(1)} columns per letter, needs 3`);
    assert(grid.sampledColumns >= 10, `${where}: ${grid.sampledColumns} columns across the word, needs 10`);
    assert(grid.sampledRows >= 10, `${where}: ${grid.sampledRows} rows, needs 10`);
  }
}

console.log(
  `ok — ${checked} pairings, worst case ${worstColumns.toFixed(1)} columns per letter ` +
    `and ${worstRows} rows across the big word; the size floor bound in ${starved}`,
);

function near(value: number, target: number, period: number) {
  const distance = Math.abs(((value - target) % period) + period) % period;
  return distance < 1e-6 || Math.abs(distance - period) < 1e-6;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL — ${message}`);
    process.exit(1);
  }
}
