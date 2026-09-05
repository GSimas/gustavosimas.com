// Grid geometry for the whole-word mode of "Uma Palavra Dentro da Outra".
//
// In that mode the big word is spelled by which cells of a grid carry the small
// word and which stay empty, so how well it reads comes down to one number: how
// many cells cross its letters. A long filler word makes wide cells and, left to
// itself, would draw the stencil with four columns of mush — which is why the
// type size here is derived from the resolution the stencil needs, and never the
// other way round.

export interface MosaicInk {
  /** Width of the stencil's ink, not of the canvas. */
  width: number;
  /** Height of the stencil's ink: cap height, near enough, for capitals. */
  height: number;
}

export interface MosaicGrid {
  /** Type size for the filler word. */
  size: number;
  /** Column pitch. */
  cell: number;
  /** Row pitch. */
  rowHeight: number;
  columns: number;
  rows: number;
  /** Left edge of the first column; negative, so the grid overhangs the canvas. */
  left: number;
  /** Top edge of the first row; negative, for the same reason. */
  top: number;
  /** Cells that fall across the stencil — the resolution it is drawn at. */
  sampledColumns: number;
  sampledRows: number;
  /** True when the type size floor stopped the grid reaching its target. */
  starved: boolean;
  /** The floor that applied, so a caller can report why a grid came out coarse. */
  minSize: number;
}

export const mosaicTargets = {
  /** Columns wanted per letter of the big word. Below ~3 its letters stop reading. */
  cellsPerLetter: 3.5,
  /** Never ask for fewer than this many columns, however short the big word. */
  minColumns: 12,
  /** Rows wanted across the height of the big word. */
  rows: 12,
  /**
   * Device pixels a filler word needs per em to still be read. The floor on the
   * type size falls out of this and the canvas' pixel ratio, so a dense screen
   * is allowed the finer grid it can actually show.
   */
  legiblePixels: 9,
  /** Floor on that floor, in CSS pixels, whatever the screen claims. */
  minSize: 4.5,
  /** Ceiling, so a two-letter filler word doesn't turn into a headline. */
  maxSize: 20,
  /** Row pitch as a multiple of the type size. */
  leading: 1.12,
  /** Column pitch as a multiple of the filler word's width. */
  tracking: 1.06,
  /**
   * How far the big word may be condensed horizontally. A long word fitted to
   * the width alone comes out short, leaving most of the frame empty and the
   * grid with too few rows to draw it; condensing lets it claim the height back.
   */
  squeeze: 0.58,
  /** And how far a short word may be stretched to claim the width back. */
  stretch: 1.3,
} as const;

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

/**
 * Type size and horizontal scale for the big word. It takes all the height the
 * frame allows and is then condensed or stretched, within limits, to use the
 * width as well — a word that fills the frame is a word the grid can resolve.
 */
export function mosaicStencil(canvasWidth: number, canvasHeight: number, widthPerPixel: number) {
  const fromWidth = (canvasWidth * 0.88) / Math.max(widthPerPixel, 0.01);
  const fromHeight = canvasHeight * 0.82;
  const size = Math.min(fromHeight, fromWidth / mosaicTargets.squeeze);
  return { size, squeeze: clamp(fromWidth / size, mosaicTargets.squeeze, mosaicTargets.stretch) };
}

/** Smallest type size worth drawing at this pixel ratio. */
export function mosaicMinSize(pixelRatio: number) {
  return Math.max(mosaicTargets.minSize, mosaicTargets.legiblePixels / Math.max(pixelRatio, 1));
}

/**
 * @param widthPerPixel width of the filler word at a type size of 1px.
 * @param stencilLetters length of the big word, which sets the columns needed.
 */
export function mosaicGrid(
  canvasWidth: number,
  canvasHeight: number,
  ink: MosaicInk,
  stencilLetters: number,
  widthPerPixel: number,
  pixelRatio = 1,
): MosaicGrid {
  const targets = mosaicTargets;
  const minSize = mosaicMinSize(pixelRatio);
  const wantedColumns = Math.max(targets.minColumns, stencilLetters * targets.cellsPerLetter);

  const perColumn = Math.max(widthPerPixel, 0.01) * targets.tracking;
  const fromColumns = ink.width / wantedColumns / perColumn;
  const fromRows = ink.height / targets.rows / targets.leading;
  const wanted = Math.min(fromColumns, fromRows);
  const size = clamp(wanted, minSize, targets.maxSize);

  const cell = Math.max(1, size * perColumn);
  const rowHeight = Math.max(1, size * targets.leading);

  // Both axes carry a cell centred on the canvas' own centre, so the grid is
  // symmetric about the stencil and a letter's two halves are sampled alike.
  const span = (extent: number, pitch: number) => {
    const middle = extent / 2;
    const before = Math.ceil((middle - pitch / 2) / pitch);
    const start = middle - before * pitch - pitch / 2;
    return { start, count: Math.max(1, Math.ceil((extent - start) / pitch)) };
  };
  const horizontal = span(canvasWidth, cell);
  const vertical = span(canvasHeight, rowHeight);

  return {
    size,
    cell,
    rowHeight,
    columns: horizontal.count,
    rows: vertical.count,
    left: horizontal.start,
    top: vertical.start,
    sampledColumns: Math.floor(ink.width / cell),
    sampledRows: Math.floor(ink.height / rowHeight),
    minSize,
    starved: wanted < minSize,
  };
}
