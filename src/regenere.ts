// Geometry for the "Regenere" poem, rebuilt from the original video frame by
// frame. The word runs around a shallow cone twice over: two identical drums of
// eight columns, the second turned half a column and dropped half a row, which
// is what gives the piece its woven texture. Each ring is offset one letter from
// the one above, so the columns spell the word downwards while the rings spell
// it around — and since eight columns carry exactly eight letters, the wrap is
// seamless. The drum is see-through: the far side shows up faint and mirrored.
//
// Everything here is pure. Each glyph comes back as a 2D matrix built from the
// projected tangent and generator of the cone, so foreshortening, the lean of
// the side columns and the mirroring of the back all fall out of the projection
// rather than being faked.

export interface RegenereShape {
  word: string;
  /** Rows of letters down the drum. */
  rings: number;
  /** How much wider the bottom ring is than the top one. */
  flare: number;
  /** Radius over the distance to the cone's apex; sets how far the columns splay. */
  slope: number;
  /** Camera distance from the axis, in bottom-ring radii. The eye is level with
   *  the bottom ring, which is why that ring reads flat and the top one arcs. */
  distance: number;
  /** Letter height as a fraction of the radius it sits on. */
  size: number;
  /** Ink left on the letters facing away from the viewer. */
  shadow: number;
  /** Seconds for one full turn. */
  period: number;
}

export const regenereShape: RegenereShape = {
  word: "REGENERE",
  rings: 6,
  flare: 1.35,
  slope: 0.165,
  distance: 6.7,
  size: 0.235,
  shadow: 0.18,
  period: 15.3,
};

/** The word laid down twice, the second copy half a step round and half a row down. */
const starts = 2;

export interface RegenereGlyph {
  ch: string;
  /** Where the letter sits on the drum: ring down, column round. */
  ring: number;
  column: number;
  /** Transform for a glyph set at font size 1 with its middle at the origin. */
  m: [number, number, number, number, number, number];
  alpha: number;
  /** Distance towards the viewer; glyphs come back sorted back to front. */
  depth: number;
}

function span(shape: RegenereShape) {
  return shape.rings - 1 + (starts - 1) / starts;
}

/** A point on the cone: `row` counts rings down from the top, `angle` goes round. */
function surface(shape: RegenereShape, row: number, angle: number) {
  const bottom = span(shape);
  const radius = shape.flare ** (row / bottom - 1);
  // The apex is where the cone's radius would reach zero; heights are measured
  // from the bottom ring, which the camera is level with.
  const axis = (radius - 1) / shape.slope;
  return { radius, x: radius * Math.sin(angle), y: axis, z: radius * Math.cos(angle) };
}

function project(shape: RegenereShape, point: { x: number; y: number; z: number }) {
  const k = shape.distance / Math.max(0.05, shape.distance - point.z);
  return { x: point.x * k, y: point.y * k, k };
}

/** Half-width and vertical span of the whole drum, in projected units. */
export function regenereBounds(shape: RegenereShape) {
  let halfWidth = 0;
  let top = Infinity;
  let bottom = -Infinity;
  for (let row = 0; row <= span(shape) + 1e-9; row += 0.5) {
    for (let step = 0; step < 64; step += 1) {
      const point = surface(shape, row, (step / 64) * Math.PI * 2);
      const p = project(shape, point);
      // A letter is about as wide as it is tall and straddles its own point.
      const pad = (shape.size * point.radius * p.k) / 2;
      halfWidth = Math.max(halfWidth, Math.abs(p.x) + pad);
      top = Math.min(top, p.y - pad);
      bottom = Math.max(bottom, p.y + pad);
    }
  }
  return { halfWidth, top, bottom };
}

export function regenereGlyphs(
  width: number,
  height: number,
  turn: number,
  shape: RegenereShape = regenereShape,
): RegenereGlyph[] {
  const bounds = regenereBounds(shape);
  const scale = Math.min(width / (bounds.halfWidth * 2), height / (bounds.bottom - bounds.top));
  const originX = width / 2;
  const originY = height / 2 - ((bounds.top + bounds.bottom) / 2) * scale;
  const letters = [...shape.word];
  const columns = letters.length;
  const glyphs: RegenereGlyph[] = [];
  const step = 1e-3;

  for (let start = 0; start < starts; start += 1) {
    for (let column = 0; column < columns; column += 1) {
      const angle0 = turn + ((column + start / starts) / columns) * Math.PI * 2;
      for (let ring = 0; ring < shape.rings; ring += 1) {
        const row = ring + start / starts;
        const point = surface(shape, row, angle0);
        const p = project(shape, point);

        // Screen vectors for one drum unit along the ring and one row down it.
        const along = project(shape, surface(shape, row, angle0 + step / point.radius));
        const down = project(shape, surface(shape, row + step, angle0));
        const ax = ((along.x - p.x) / step) * scale;
        const ay = ((along.y - p.y) / step) * scale;
        const bx = ((down.x - p.x) / step) * scale;
        const by = ((down.y - p.y) / step) * scale;
        const drop = Math.hypot(bx, by);

        // How squarely this patch of the drum faces the camera.
        const dz = shape.distance - point.z;
        const facing = (Math.sin(angle0) * -point.x + Math.cos(angle0) * dz) / Math.hypot(point.x, dz);
        const size = shape.size * point.radius;

        glyphs.push({
          ch: letters[(((column - ring) % columns) + columns) % columns],
          ring,
          column: column * starts + start,
          m: [
            ax * size,
            ay * size,
            (bx / drop) * size * scale,
            (by / drop) * size * scale,
            originX + p.x * scale,
            originY + p.y * scale,
          ],
          // The near side is solid black right up to the silhouette, where the
          // glyph is a sliver anyway; only the far side is left as a ghost.
          alpha: shape.shadow + (1 - shape.shadow) * Math.min(1, Math.max(0, facing) / 0.25),
          depth: point.z,
        });
      }
    }
  }

  glyphs.sort((a, b) => a.depth - b.depth);
  return glyphs;
}
