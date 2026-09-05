import {
  mosaicCoverage, mosaicGrid, mosaicTargets, sampleMosaicGlyph,
  type MosaicCell, type MosaicRegion,
} from './mosaic';

export type MosaicMode = 'flow' | 'whole';
export const mosaicStencilFont = (size: number) => `900 ${size}px Inter, ui-sans-serif, sans-serif`;
export const mosaicTileFont = (size: number) => `500 ${size}px "DM Mono", ui-monospace, monospace`;
const W = mosaicTargets.width;
const H = mosaicTargets.height;
const maskRatio = 2;

export interface MosaicLayout {
  mask: HTMLCanvasElement;
  cells: MosaicCell[];
  regions: MosaicRegion[];
  fidelity: number[];
  size: number;
  flowSize: number;
  cell: number;
  rowHeight: number;
  tile: string;
  lift: number;
  inkTop: number;
  inkLeft: number;
}

/** Build only on word/font changes. The same composition serves every screen.
 * Canvas backing stores never grow with the reading zoom. */
export function buildMosaicLayout(stencil: string, tile: string): MosaicLayout {
  const mask = document.createElement('canvas');
  mask.width = W * maskRatio;
  mask.height = H * maskRatio;
  const ctx = mask.getContext('2d', { willReadFrequently: true })!;
  const letters = Array.from(stencil);
  ctx.font = mosaicStencilFont(100);
  const metrics = letters.map((letter) => ctx.measureText(letter));
  const advances = metrics.map((metric) => Math.max(metric.width, metric.actualBoundingBoxLeft + metric.actualBoundingBoxRight));
  const ascentAt100 = Math.max(...metrics.map((metric) => metric.actualBoundingBoxAscent));
  const descentAt100 = Math.max(...metrics.map((metric) => metric.actualBoundingBoxDescent));
  // Explicit tracking reserves a real blank column between adjacent letters.
  const tracking = 12;
  const advance = advances.reduce((sum, width) => sum + width, 0) + tracking * (letters.length - 1);
  const fontScale = Math.min((W * 0.88) / advance, (H * 0.76) / Math.max(1, ascentAt100 + descentAt100));
  const size = fontScale * 100;
  const inkWidth = advance * fontScale;
  const inkHeight = (ascentAt100 + descentAt100) * fontScale;
  const left = (W - inkWidth) / 2;
  const top = (H - inkHeight) / 2;
  const baseline = top + ascentAt100 * fontScale;
  ctx.scale(maskRatio, maskRatio);
  ctx.font = mosaicStencilFont(size);
  ctx.fillStyle = '#eef2e8';
  ctx.textBaseline = 'alphabetic';
  const regions: MosaicRegion[] = [];
  let x = left;
  for (let index = 0; index < letters.length; index++) {
    // Include real ink overhangs (accents, J, italic fallback) in the region.
    const width = advances[index] * fontScale;
    const glyphLeft = Math.max(0, metrics[index].actualBoundingBoxLeft) * fontScale;
    ctx.fillText(letters[index], x + glyphLeft, baseline);
    regions.push({ left: x, right: x + width, top: Math.max(0, top - 8), bottom: Math.min(H, top + inkHeight + 8) });
    x += width + tracking * fontScale;
  }
  ctx.font = mosaicTileFont(100);
  const tileMetrics = ctx.measureText(tile);
  const tileAdvance = Math.max(tileMetrics.width, tileMetrics.actualBoundingBoxLeft + tileMetrics.actualBoundingBoxRight) / 100;
  let grid = mosaicGrid(inkWidth, inkHeight, letters.length, tileAdvance);
  const pixels = ctx.getImageData(0, 0, mask.width, mask.height);
  const area = mosaicCoverage(pixels.data, mask.width, mask.height);
  const coverage = (l: number, t: number, r: number, b: number) => area(l * maskRatio, t * maskRatio, r * maskRatio, b * maskRatio) / (maskRatio * maskRatio);
  let samples = regions.map((region, index) => sampleMosaicGlyph(region, grid, coverage, index));
  // Refine difficult diagonals/counters instead of accepting a coarse result.
  // The ceiling bounds work for arbitrary user input and fallback glyphs.
  for (let pass = 0; pass < 3 && samples.some((sample, index) =>
    letters[index].trim() && sample.fidelity < mosaicTargets.minimumFidelity); pass++) {
    grid = { size: grid.size * 0.8, cell: grid.cell * 0.8, rowHeight: grid.rowHeight * 0.8 };
    samples = regions.map((region, index) => sampleMosaicGlyph(region, grid, coverage, index));
  }
  return {
    mask, regions, cells: samples.flatMap((sample) => sample.cells),
    fidelity: samples.map((sample) => sample.fidelity),
    ...grid, tile,
    flowSize: Math.max(9, Math.min(16, size * 0.045)),
    lift: (tileMetrics.actualBoundingBoxAscent - tileMetrics.actualBoundingBoxDescent) / 100 * grid.size / 2,
    inkTop: top, inkLeft: left,
  };
}

export function paintMosaic(
  ctx: CanvasRenderingContext2D, layout: MosaicLayout, mode: MosaicMode,
  view: { width: number; height: number; scale: number; left: number; top: number; ratio: number },
  drift = 0,
) {
  const { width, height, scale, left, top, ratio } = view;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(ratio * scale, 0, 0, ratio * scale, -left * ratio, -top * ratio);
  ctx.fillStyle = '#eef2e8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const minX = left / scale;
  const maxX = (left + width) / scale;
  const minY = top / scale;
  const maxY = (top + height) / scale;
  if (mode === 'whole') {
    ctx.font = mosaicTileFont(layout.size);
    for (const cell of layout.cells) {
      if (cell.x + layout.cell / 2 < minX || cell.x - layout.cell / 2 > maxX ||
          cell.y + layout.rowHeight / 2 < minY || cell.y - layout.rowHeight / 2 > maxY) continue;
      ctx.fillText(layout.tile, cell.x, cell.y + layout.lift);
    }
  } else {
    ctx.font = mosaicTileFont(layout.flowSize);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const chunk = `${layout.tile} `;
    const chunkWidth = ctx.measureText(chunk).width;
    const rowHeight = layout.flowSize * mosaicTargets.leading;
    const line = chunk.repeat(Math.ceil((maxX - minX) / chunkWidth) + 3);
    for (let row = Math.floor(minY / rowHeight); row * rowHeight < maxY + rowHeight; row++) {
      const shift = ((row % 2 ? -drift : drift) % chunkWidth + chunkWidth) % chunkWidth;
      const x = Math.floor(minX / chunkWidth) * chunkWidth + shift - chunkWidth;
      ctx.fillText(line, x, (row + 0.5) * rowHeight);
    }
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(layout.mask, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
  // When the miniature words become subpixel texture, preserve the macro word
  // with its exact silhouette underneath. Whole tiles remain uncut; this guide
  // fades away at a readable scale and never replaces the enlarged typography.
  const screenSize = (mode === 'whole' ? layout.size : layout.flowSize) * scale;
  const support = Math.max(0, Math.min(1, (4 - screenSize) / 2));
  if (support > 0) {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.globalAlpha = 0.55 * support;
    ctx.drawImage(layout.mask, 0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
