/** Geometry shared by the renderer and its regression checks. Units are logical
 * pixels, independent of both the viewport and the device pixel ratio. */
export const mosaicMaxChars = 12;
export const mosaicTargets = {
  width: 1200,
  height: 500,
  cellsPerLetter: 12,
  rows: 22,
  readingSize: 14,
  minimumFidelity: 0.82,
  leading: 1.45,
  tracking: 1.18,
} as const;

export function cleanMosaicWord(value: string, fallback: string) {
  // Normalize before counting: a pasted decomposed accent is one character.
  const visible = value.normalize('NFC')
    .replace(/[\p{Cc}\p{Cf}\p{Default_Ignorable_Code_Point}]/gu, '')
    .replace(/^\p{M}+/u, '').trim();
  return Array.from((visible || fallback).toUpperCase()).slice(0, mosaicMaxChars).join('');
}

export function mosaicGrid(inkWidth: number, inkHeight: number, letters: number, advance: number) {
  const size = Math.min(
    Math.max(1, inkWidth) / (Math.max(1, letters) * mosaicTargets.cellsPerLetter * Math.max(0.01, advance) * mosaicTargets.tracking),
    Math.max(1, inkHeight) / (mosaicTargets.rows * mosaicTargets.leading),
    20,
  );
  return { size, cell: size * Math.max(0.01, advance) * mosaicTargets.tracking, rowHeight: size * mosaicTargets.leading };
}

export function mosaicView(width: number, height: number, tileSize: number, reading: boolean) {
  const fit = Math.min(width / mosaicTargets.width, height / mosaicTargets.height);
  const scale = reading ? Math.max(fit, mosaicTargets.readingSize / tileSize) : fit;
  return {
    scale,
    width: Math.max(width, mosaicTargets.width * scale),
    height: Math.max(height, mosaicTargets.height * scale),
  };
}

/** Summed alpha area: all pixels in each cell count, including counters and
 * diagonals. Unlike a handful of probes this cannot miss a thin white gap. */
export function mosaicCoverage(data: Uint8ClampedArray, width: number, height: number) {
  const stride = width + 1;
  const sums = new Float64Array(stride * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += data[(y * width + x) * 4 + 3] / 255;
      sums[(y + 1) * stride + x + 1] = sums[y * stride + x + 1] + row;
    }
  }
  // Bilinear interpolation of the integral gives exact fractional-pixel area.
  // Rounding cell edges can overcount ink at high zoom and erase small counters.
  const integral = (x: number, y: number) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = Math.min(width, x0 + 1), y1 = Math.min(height, y0 + 1);
    const dx = x - x0, dy = y - y0;
    const upper = sums[y0 * stride + x0] * (1 - dx) + sums[y0 * stride + x1] * dx;
    const lower = sums[y1 * stride + x0] * (1 - dx) + sums[y1 * stride + x1] * dx;
    return upper * (1 - dy) + lower * dy;
  };
  return (left: number, top: number, right: number, bottom: number) => {
    const x0 = Math.max(0, Math.min(width, left));
    const x1 = Math.max(x0, Math.min(width, right));
    const y0 = Math.max(0, Math.min(height, top));
    const y1 = Math.max(y0, Math.min(height, bottom));
    return integral(x1, y1) - integral(x0, y1) - integral(x1, y0) + integral(x0, y0);
  };
}

export interface MosaicCell { x: number; y: number; glyph: number }
export interface MosaicRegion { left: number; right: number; top: number; bottom: number }

/** Each letter has its own phase. Select the phase with the greatest overlap
 * (intersection / union), penalizing both missing strokes and filled counters.
 * Regions are disjoint: a whole word can never bridge two stencil letters. */
export function sampleMosaicGlyph(
  region: MosaicRegion,
  grid: { cell: number; rowHeight: number },
  coverage: (left: number, top: number, right: number, bottom: number) => number,
  glyph: number,
) {
  const { cell, rowHeight } = grid;
  const totalInk = coverage(region.left, region.top, region.right, region.bottom);
  let best = { cells: [] as MosaicCell[], fidelity: 0 };
  for (const phaseX of [0, 0.25, 0.5, 0.75]) {
    for (const phaseY of [0, 0.5]) {
      const cells: MosaicCell[] = [];
      let intersection = 0;
      let outside = 0;
      for (let y = region.top + phaseY * rowHeight; y + rowHeight <= region.bottom; y += rowHeight) {
        for (let x = region.left + phaseX * cell; x + cell <= region.right; x += cell) {
          const ink = coverage(x, y, x + cell, y + rowHeight);
          const area = cell * rowHeight;
          if (ink / area < 0.5) continue;
          cells.push({ x: x + cell / 2, y: y + rowHeight / 2, glyph });
          intersection += ink;
          outside += Math.max(0, area - ink);
        }
      }
      const fidelity = intersection / Math.max(1, totalInk + outside);
      if (fidelity > best.fidelity) best = { cells, fidelity };
    }
  }
  return best;
}
