// Physics for the falling-letters poem: every glyph is a disc under gravity,
// solved with impulses so the letters bounce, roll and pile up on the floor.
//
// Letters dragged into each other weld into a word. A welded word is not a new
// body — it stays a set of discs, each carrying the slot it should occupy in the
// row (ox, oy). Every substep a shape-matching constraint finds the best-fit
// centre and rotation for those slots and pulls the letters back onto them, so
// the word behaves as one piece while collisions and the floor still get the
// last word on where that piece ends up.

export interface GravityLetter {
  ch: string;
  wordId: number;
  font: string;
  colour: string;
  size: number;
  r: number;
  mass: number;
  /** Width the glyph takes up in a row; sets the spacing of a welded word. */
  advance: number;
  /** Word this letter has been welded into, or null while it is loose. */
  groupId: number | null;
  /** Slot in that word's row, measured from the word's centre of mass. */
  ox: number;
  oy: number;
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
// How hard a welded word is pulled back into a straight row, per solver pass.
// Four passes at 120Hz add up to something that reads as rigid without the
// jitter a hard constraint would set off against the floor.
const gravityWeldStiffness = 0.4;
// Space between welded letters, as a multiple of their own advance width.
const gravityWeldTracking = 1.02;
// Breaking a word apart has to look like breaking: a sideways shove that grows
// towards the ends of the row, and enough lift to get the letters off the floor
// so the shove has somewhere to take them.
export const gravityBurstSpread = 300;
export const gravityBurstLift = 300;

/** Every letter welded into the same word as this one, in reading order. */
export function wordOf(letters: GravityLetter[], letter: GravityLetter): GravityLetter[] {
  if (letter.groupId === null) return [letter];
  return letters.filter((other) => other.groupId === letter.groupId).sort((a, b) => a.ox - b.ox);
}

/**
 * Lay members out on a single row and centre that row on their common centre of
 * mass, which is what the shape-matching constraint expects to solve against.
 */
export function layoutWord(members: GravityLetter[]) {
  let cursor = 0;
  const slots = members.map((member) => {
    const slot = cursor + member.advance / 2;
    cursor += member.advance * gravityWeldTracking;
    return slot;
  });
  let mass = 0;
  let centre = 0;
  members.forEach((member, index) => {
    mass += member.mass;
    centre += member.mass * slots[index];
  });
  centre /= mass || 1;
  members.forEach((member, index) => {
    member.ox = slots[index] - centre;
    member.oy = 0;
  });
}

/**
 * Weld two letters — and everything already welded to them — into one word,
 * `lead` reading before `follow`. Returns the members in their new order.
 */
export function weld(
  letters: GravityLetter[],
  lead: GravityLetter,
  follow: GravityLetter,
  groupId: number,
): GravityLetter[] {
  const members = [...wordOf(letters, lead), ...wordOf(letters, follow)];
  for (const member of members) member.groupId = groupId;
  layoutWord(members);
  return members;
}

/** Break a word back into loose letters, thrown clear of one another. */
export function unweld(letters: GravityLetter[], letter: GravityLetter) {
  const members = wordOf(letters, letter);

  let mass = 0;
  let cx = 0;
  for (const member of members) {
    mass += member.mass;
    cx += member.mass * member.x;
  }
  cx /= mass || 1;
  const reach = Math.max(1, ...members.map((member) => Math.abs(member.x - cx)));

  for (const member of members) {
    const offset = member.x - cx;
    // A letter sitting on the centre has no side to be thrown to; its slot in
    // the row still knows which way it was reading.
    const direction = Math.abs(offset) > 1 ? Math.sign(offset) : Math.sign(member.ox) || 1;
    const share = 0.35 + Math.abs(offset) / reach;

    member.groupId = null;
    member.ox = 0;
    member.oy = 0;
    member.held = false;
    member.vx += direction * gravityBurstSpread * share + (Math.random() - 0.5) * 70;
    member.vy -= gravityBurstLift * (0.65 + 0.35 * Math.random());
    member.va += (Math.random() - 0.5) * 3;
  }
}

// Pull each welded word back onto its row: best-fit centre and rotation for the
// slots the letters are meant to occupy, then a nudge of every letter — position
// and velocity both — towards the rigid motion that would put it there.
function solveWelds(letters: GravityLetter[], stiffness: number) {
  const words = new Map<number, GravityLetter[]>();
  for (const letter of letters) {
    if (letter.groupId === null || letter.fade < 1) continue;
    const members = words.get(letter.groupId);
    if (members) members.push(letter);
    else words.set(letter.groupId, [letter]);
  }

  for (const members of words.values()) {
    if (members.length < 2) {
      // A word down to its last letter is no longer a word.
      members[0].groupId = null;
      continue;
    }

    let mass = 0;
    let cx = 0;
    let cy = 0;
    let vx = 0;
    let vy = 0;
    for (const member of members) {
      mass += member.mass;
      cx += member.mass * member.x;
      cy += member.mass * member.y;
      vx += member.mass * member.vx;
      vy += member.mass * member.vy;
    }
    cx /= mass;
    cy /= mass;
    vx /= mass;
    vy /= mass;

    // Polar decomposition of the fit between the slots and where the letters
    // actually are: the angle that lines the row up with the least stretching.
    let across = 0;
    let along = 0;
    let spin = 0;
    let inertia = 0;
    for (const member of members) {
      const px = member.x - cx;
      const py = member.y - cy;
      across += member.mass * (member.ox * py - member.oy * px);
      along += member.mass * (member.ox * px + member.oy * py);
      spin += member.mass * (px * (member.vy - vy) - py * (member.vx - vx));
      inertia += member.mass * (px * px + py * py);
    }
    const angle = Math.atan2(across, along);
    const omega = inertia > 0 ? Math.max(-gravityMaxSpin, Math.min(gravityMaxSpin, spin / inertia)) : 0;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (const member of members) {
      const rx = member.ox * cos - member.oy * sin;
      const ry = member.ox * sin + member.oy * cos;
      if (!member.held) {
        member.x += (cx + rx - member.x) * stiffness;
        member.y += (cy + ry - member.y) * stiffness;
        member.vx += (vx - omega * ry - member.vx) * stiffness;
        member.vy += (vy + omega * rx - member.vy) * stiffness;
      }
      // The whole point of welding: the letters read along one baseline.
      member.angle = angle;
      member.va = omega;
    }
  }
}

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

    solveWelds(letters, gravityWeldStiffness);

    for (const letter of letters) {
      if (letter.held || letter.fade < 1) continue;
      const floor = height - letter.r;
      if (letter.y > floor) {
        letter.y = floor;
        if (letter.vy > 0) letter.vy = -letter.vy * bounce;
        letter.vx -= letter.vx * Math.min(1, 7 * grip * dt);
        // Contact with the ground turns sliding into rolling, never into a spin
        // faster than the letter is actually travelling. A welded letter takes
        // its rotation from the word instead, so it is left alone.
        if (letter.groupId === null) {
          const rolling = Math.max(-gravityMaxSpin, Math.min(gravityMaxSpin, letter.vx / letter.r));
          letter.va += (rolling - letter.va) * Math.min(1, 5 * dt);
        }
        if (Math.abs(letter.vy) < 24 && Math.abs(letter.vx) < 10) {
          letter.vy = 0;
          letter.vx = 0;
          if (letter.groupId === null) letter.va -= letter.va * Math.min(1, 14 * dt);
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

  const orphaned = new Set<number>();
  for (let index = letters.length - 1; index >= 0; index -= 1) {
    const letter = letters[index];
    letter.vx = Math.max(-4000, Math.min(4000, letter.vx));
    letter.vy = Math.max(-4000, Math.min(4000, letter.vy));
    letter.va = Math.max(-gravityMaxSpin, Math.min(gravityMaxSpin, letter.va));
    if (letter.fade < 1) {
      letter.fade -= dt / gravityFadeSeconds;
      if (letter.fade <= 0) {
        if (letter.groupId !== null) orphaned.add(letter.groupId);
        letters.splice(index, 1);
      }
    }
  }
  // A letter erased out of the middle of a word leaves a hole; close the row up
  // again so what is left still reads as one piece.
  for (const groupId of orphaned) {
    const members = letters.filter((letter) => letter.groupId === groupId).sort((a, b) => a.ox - b.ox);
    if (members.length < 2) {
      for (const member of members) member.groupId = null;
      continue;
    }
    layoutWord(members);
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
