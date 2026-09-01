// Physics for the falling-letters poem: every glyph is a disc under gravity,
// solved with impulses so the letters bounce, roll and pile up on the floor.

export interface GravityLetter {
  ch: string;
  wordId: number;
  font: string;
  colour: string;
  size: number;
  r: number;
  mass: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  va: number;
  held: boolean;
  // 1 while the letter is on the floor for good; counts down to 0 once its word
  // is erased, so the canvas loses it as a fade instead of a jump cut.
  fade: number;
}

export interface GravitySettings {
  pull: number;
  bounce: number;
  grip: number;
}

export const gravityDefaults: GravitySettings = { pull: 2200, bounce: 0.22, grip: 0.5 };

export const gravityRanges = {
  pull: { min: 300, max: 5200, step: 50 },
  bounce: { min: 0, max: 0.7, step: 0.02 },
  grip: { min: 0.05, max: 1, step: 0.05 },
};

export const gravityMaxWords = 12;
export const gravityMaxChars = 28;
export const gravityFadeSeconds = 0.5;
// A glyph spinning faster than this reads as a glitch rather than a fall.
const gravityMaxSpin = 4;

// ponytail: each glyph is a disc and every pair is tested each substep — plenty
// for a dozen words; swap for boxes and a broad-phase grid if the pile grows.
export function stepGravity(
  letters: GravityLetter[],
  width: number,
  height: number,
  dt: number,
  settings: GravitySettings,
) {
  const { pull, bounce, grip } = settings;

  for (const letter of letters) {
    if (letter.held) continue;
    // A letter being erased drifts up as it dissolves instead of falling.
    letter.vy += (letter.fade < 1 ? -pull * 0.22 : pull) * dt;
    letter.x += letter.vx * dt;
    letter.y += letter.vy * dt;
    letter.angle += letter.va * dt;
    letter.va -= letter.va * Math.min(1, 2.4 * dt);
  }

  for (let iteration = 0; iteration < 4; iteration += 1) {
    for (let i = 0; i < letters.length; i += 1) {
      const a = letters[i];
      if (a.fade < 1) continue;
      for (let j = i + 1; j < letters.length; j += 1) {
        const b = letters[j];
        if (b.fade < 1) continue;
        const reach = a.r + b.r;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        if (dist >= reach) continue;
        if (dist < 0.0001) {
          dx = 0;
          dy = -1;
          dist = 0.0001;
        }
        const nx = dx / dist;
        const ny = dy / dist;
        const inverseA = a.held ? 0 : 1 / a.mass;
        const inverseB = b.held ? 0 : 1 / b.mass;
        const inverseSum = inverseA + inverseB;
        if (inverseSum === 0) continue;

        // Positional correction first, so a settled pile stops sinking.
        const push = ((reach - dist) / inverseSum) * 0.55;
        a.x -= nx * push * inverseA;
        a.y -= ny * push * inverseA;
        b.x += nx * push * inverseB;
        b.y += ny * push * inverseB;

        const rvx = b.vx - a.vx;
        const rvy = b.vy - a.vy;
        const closing = rvx * nx + rvy * ny;
        if (closing > 0) continue;
        const impulse = (-(1 + bounce) * closing) / inverseSum;
        a.vx -= nx * impulse * inverseA;
        a.vy -= ny * impulse * inverseA;
        b.vx += nx * impulse * inverseB;
        b.vy += ny * impulse * inverseB;

        const tx = -ny;
        const ty = nx;
        const sliding = rvx * tx + rvy * ty;
        const limit = grip * impulse;
        const tangent = Math.max(-limit, Math.min(limit, -sliding / inverseSum));
        a.vx -= tx * tangent * inverseA;
        a.vy -= ty * tangent * inverseA;
        b.vx += tx * tangent * inverseB;
        b.vy += ty * tangent * inverseB;
        // Torque from the tangential impulse. A disc's inertia would give a
        // factor of 2 here; a glyph is neither a disc nor free to windmill, so
        // it is damped down to a fraction of that.
        a.va -= (0.5 * tangent * inverseA) / a.r;
        b.va -= (0.5 * tangent * inverseB) / b.r;
      }
    }

    for (const letter of letters) {
      if (letter.held || letter.fade < 1) continue;
      const floor = height - letter.r;
      if (letter.y > floor) {
        letter.y = floor;
        if (letter.vy > 0) letter.vy = -letter.vy * bounce;
        letter.vx -= letter.vx * Math.min(1, 7 * grip * dt);
        // Contact with the ground turns sliding into rolling, never into a spin
        // faster than the letter is actually travelling.
        const rolling = Math.max(-gravityMaxSpin, Math.min(gravityMaxSpin, letter.vx / letter.r));
        letter.va += (rolling - letter.va) * Math.min(1, 5 * dt);
        if (Math.abs(letter.vy) < 24 && Math.abs(letter.vx) < 10) {
          letter.vy = 0;
          letter.vx = 0;
          letter.va -= letter.va * Math.min(1, 14 * dt);
        }
      }
      if (letter.x < letter.r) {
        letter.x = letter.r;
        if (letter.vx < 0) letter.vx = -letter.vx * bounce;
      } else if (letter.x > width - letter.r) {
        letter.x = width - letter.r;
        if (letter.vx > 0) letter.vx = -letter.vx * bounce;
      }
    }
  }

  for (let index = letters.length - 1; index >= 0; index -= 1) {
    const letter = letters[index];
    letter.vx = Math.max(-4000, Math.min(4000, letter.vx));
    letter.vy = Math.max(-4000, Math.min(4000, letter.vy));
    letter.va = Math.max(-gravityMaxSpin, Math.min(gravityMaxSpin, letter.va));
    if (letter.fade < 1) {
      letter.fade -= dt / gravityFadeSeconds;
      if (letter.fade <= 0) letters.splice(index, 1);
    }
  }
}

// Erasing never removes a letter outright: it starts the fade the step loop
// finishes.
export function fadeLetters(letters: GravityLetter[], match: (letter: GravityLetter) => boolean) {
  for (const letter of letters) {
    if (letter.fade === 1 && match(letter)) {
      letter.fade = 0.999;
      letter.held = false;
      letter.vx *= 0.4;
      letter.vy = -Math.abs(letter.vy) * 0.2 - 20;
    }
  }
}
