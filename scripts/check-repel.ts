// Self-check for "Não Toque É Arte": the letters must dodge the pointer and
// then put themselves back. Run with: npm run check:repel
import { repelTuning, stepRepel, type RepelLetter } from "../src/repel.ts";

const scale = 100;
const tuning = repelTuning(scale);
const fail = (message: string) => {
  throw new Error(message);
};

const line = (text: string): RepelLetter[] =>
  [...text].map((ch, index) => ({
    ch,
    hx: 120 + index * scale * 0.72,
    hy: 200,
    size: scale,
    phase: index * 0.7,
    x: 120 + index * scale * 0.72,
    y: 200,
    vx: 0,
    vy: 0,
    angle: 0,
    va: 0,
  }));

const offsetOf = (letter: RepelLetter) => Math.hypot(letter.x - letter.hx, letter.y - letter.hy);
const nearest = (letters: RepelLetter[], x: number, y: number) =>
  Math.min(...letters.map((letter) => Math.hypot(letter.x - x, letter.y - y)));

const settle = (letters: RepelLetter[], pointer: { x: number; y: number; active: boolean }, seconds: number, dt: number) => {
  let closest = Infinity;
  for (let t = 0; t < seconds; t += dt) {
    stepRepel(letters, pointer, dt, tuning);
    if (pointer.active) closest = Math.min(closest, nearest(letters, pointer.x, pointer.y));
    for (const letter of letters) {
      if (!Number.isFinite(letter.x) || !Number.isFinite(letter.y) || !Number.isFinite(letter.angle)) {
        fail(`letter ${letter.ch} went non-finite`);
      }
      if (offsetOf(letter) > tuning.maxOffset + 0.5) fail(`letter ${letter.ch} strayed past the cap`);
    }
  }
  return closest;
};

// 1. Shoved letters come home and stay there.
{
  const letters = line("NAOTOQUE");
  for (const letter of letters) {
    letter.vx = 900;
    letter.vy = -600;
  }
  settle(letters, { x: 0, y: 0, active: false }, 3, 1 / 60);
  const worst = Math.max(...letters.map(offsetOf));
  if (worst > 0.5) fail(`letters did not return home: ${worst.toFixed(2)}px off`);
}

// 2. A pointer parked on a glyph is held at arm's length.
const parkedClearance = (() => {
  const letters = line("NAOTOQUE");
  const target = letters[3];
  const pointer = { x: target.hx, y: target.hy, active: true };
  settle(letters, pointer, 2.5, 1 / 60);
  const clearance = nearest(letters, pointer.x, pointer.y);
  if (clearance < scale * 0.6) fail(`parked pointer got within ${clearance.toFixed(1)}px of a letter`);
  return clearance;
})();

// 3. A deliberate sweep across the whole line never lands on the type, at any
//    frame rate. 600px/s is a brisk but human mouse move.
const sweepClearance = (() => {
  let worst = Infinity;
  for (const dt of [1 / 120, 1 / 60, 1 / 30]) {
    const letters = line("NAOTOQUE");
    const pointer = { x: 0, y: 200, active: true };
    for (let t = 0; t < 2.4; t += dt) {
      pointer.x = t * 600;
      stepRepel(letters, pointer, dt, tuning);
      worst = Math.min(worst, nearest(letters, pointer.x, pointer.y));
    }
    settle(letters, { x: 0, y: 0, active: false }, 3, dt);
    const back = Math.max(...letters.map(offsetOf));
    if (back > 0.5) fail(`after a ${Math.round(1 / dt)}fps sweep the line stayed ${back.toFixed(2)}px scattered`);
  }
  if (worst < scale * 0.45) fail(`a sweep grazed a letter at ${worst.toFixed(1)}px`);
  return worst;
})();

// 4. Pointer dead on a home position still gets pushed off — no divide by zero.
{
  const letters = line("NAOTOQUE");
  const target = letters[0];
  const pointer = { x: target.hx, y: target.hy, active: true };
  stepRepel(letters, pointer, 1 / 60, tuning);
  if (offsetOf(target) <= 0) fail("a letter under the exact pointer did not move");
}

console.log(
  `ok — line returns home within 0.5px; parked pointer held ${parkedClearance.toFixed(0)}px away, ` +
    `worst sweep clearance ${sweepClearance.toFixed(0)}px at 30–120fps (type size ${scale}px)`,
);
