// Physics for "Não Toque É Arte": the letters refuse to be touched. Each glyph
// is a mass tied to its position in the line by a spring; the pointer pushes it
// away with a force that grows as it gets closer, so the cursor can never reach
// the type. Let go and the line reassembles itself.

export interface RepelLetter {
  ch: string;
  /** Where the glyph belongs in the composition. */
  hx: number;
  hy: number;
  size: number;
  /** Hue offset, so the colour wave travels along the line. */
  phase: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  va: number;
}

export interface RepelTuning {
  /** Pointer influence radius, px. */
  radius: number;
  /** Peak push at the pointer, px/s². */
  strength: number;
  /** Pull back home, px/s² per px of offset. */
  spring: number;
  /** Velocity decay, 1/s. */
  damping: number;
  /** Hard cap on how far a glyph may stray from home, px. */
  maxOffset: number;
  /** How much of the push becomes spin, rad/s per px/s of sideways shove. */
  spin: number;
  /**
   * Angle the push is rotated by, rad. A purely radial push lets the pointer
   * bulldoze a glyph that sits straight ahead of it; swerving makes the letter
   * step out of the way instead.
   */
  swerve: number;
}

/** Tuning scaled to the type size, so the poem behaves the same on any canvas. */
export function repelTuning(scale: number): RepelTuning {
  return {
    radius: scale * 2.1,
    strength: scale * 130,
    spring: 26,
    damping: 6.5,
    maxOffset: scale * 1.5,
    spin: 0.0016,
    swerve: 0.62,
  };
}

export interface RepelPointer {
  x: number;
  y: number;
  active: boolean;
}

export function stepRepel(
  letters: RepelLetter[],
  pointer: RepelPointer,
  dt: number,
  tuning: RepelTuning,
): void {
  // Fixed substeps: a dropped frame must not turn into a bigger kick.
  const steps = Math.min(4, Math.max(1, Math.ceil(dt / (1 / 90))));
  const h = dt / steps;
  const decay = Math.exp(-tuning.damping * h);
  const spinDecay = Math.exp(-tuning.damping * 1.6 * h);

  for (let step = 0; step < steps; step += 1) {
    for (const letter of letters) {
      if (pointer.active) {
        let dx = letter.x - pointer.x;
        let dy = letter.y - pointer.y;
        let dist = Math.hypot(dx, dy);
        if (dist < tuning.radius) {
          if (dist < 1e-4) {
            // Pointer dead on the glyph: shove it along its own phase so the
            // direction is stable instead of jittering with float noise.
            dx = Math.cos(letter.phase);
            dy = Math.sin(letter.phase);
            dist = 1;
          } else {
            dx /= dist;
            dy /= dist;
          }
          const falloff = 1 - dist / tuning.radius;
          const push = tuning.strength * falloff * falloff * h;
          const turn = Math.sin(letter.phase) >= 0 ? tuning.swerve : -tuning.swerve;
          const cos = Math.cos(turn);
          const sin = Math.sin(turn);
          const px = dx * cos - dy * sin;
          const py = dx * sin + dy * cos;
          letter.vx += px * push;
          letter.vy += py * push;
          letter.va += (turn > 0 ? 1 : -1) * push * tuning.spin;
        }
      }

      letter.vx += (letter.hx - letter.x) * tuning.spring * h;
      letter.vy += (letter.hy - letter.y) * tuning.spring * h;
      letter.va += -letter.angle * tuning.spring * 0.55 * h;

      letter.vx *= decay;
      letter.vy *= decay;
      letter.va *= spinDecay;

      letter.x += letter.vx * h;
      letter.y += letter.vy * h;
      letter.angle += letter.va * h;

      const ox = letter.x - letter.hx;
      const oy = letter.y - letter.hy;
      const offset = Math.hypot(ox, oy);
      if (offset > tuning.maxOffset) {
        const k = tuning.maxOffset / offset;
        letter.x = letter.hx + ox * k;
        letter.y = letter.hy + oy * k;
        // Kill only the outward part, so it can still slide along the cap.
        const outward = (letter.vx * ox + letter.vy * oy) / offset;
        if (outward > 0) {
          letter.vx -= (outward * ox) / offset;
          letter.vy -= (outward * oy) / offset;
        }
      }
      letter.angle = Math.max(-0.5, Math.min(0.5, letter.angle));
    }
  }
}
