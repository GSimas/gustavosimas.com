// Self-check for the falling-letters physics: drop a word, let it settle, and
// assert the pile is on the floor, inside the walls and no longer overlapping.
// Run with: npm run check:gravity
import { fadeLetters, gravityDefaults, stepGravity, type GravityLetter } from "../src/gravity.ts";

const width = 900;
const height = 500;
const step = 1 / 120;

const letters: GravityLetter[] = [..."gravidade"].map((ch, index) => {
  const r = 18;
  return {
    ch,
    wordId: 1,
    font: "serif",
    colour: "#fff",
    size: 42,
    r,
    mass: r * r,
    x: width / 2 - 80 + index * 20,
    y: -r - index * 38,
    vx: 0,
    vy: 60,
    angle: 0,
    va: 0,
    held: false,
    fade: 1,
  };
});

for (let frame = 0; frame < 120 * 8; frame += 1) stepGravity(letters, width, height, step, gravityDefaults);

const fail = (message: string) => {
  throw new Error(message);
};

for (const letter of letters) {
  if (!Number.isFinite(letter.x) || !Number.isFinite(letter.y)) fail(`"${letter.ch}" left the numbers behind`);
  if (letter.y > height - letter.r + 0.5) fail(`"${letter.ch}" fell through the floor`);
  if (letter.x < letter.r - 0.5 || letter.x > width - letter.r + 0.5) fail(`"${letter.ch}" escaped through a wall`);
  if (Math.abs(letter.vx) > 6 || Math.abs(letter.vy) > 6) fail(`"${letter.ch}" never came to rest`);
  if (Math.abs(letter.va) > 0.4) fail(`"${letter.ch}" is still spinning at rest (${letter.va.toFixed(2)} rad/s)`);
}

for (let i = 0; i < letters.length; i += 1) {
  for (let j = i + 1; j < letters.length; j += 1) {
    const a = letters[i];
    const b = letters[j];
    const overlap = a.r + b.r - Math.hypot(b.x - a.x, b.y - a.y);
    if (overlap > 2) fail(`"${a.ch}" and "${b.ch}" ended up inside each other (${overlap.toFixed(2)}px)`);
  }
}

const resting = letters.filter((letter) => letter.y > height - letter.r * 3).length;
if (resting < letters.length - 1) fail(`only ${resting} of ${letters.length} letters reached the pile`);

const settled = letters.length;

// Same word thrown hard sideways: the floor and the collisions may spin the
// letters, but never into a windmill, and never past the point of stopping.
const thrown = letters.map((letter) => ({ ...letter, x: 60, y: 120, vx: 1900, vy: 200, va: 9 }));
let fastest = 0;
for (let frame = 0; frame < 120 * 10; frame += 1) {
  stepGravity(thrown, width, height, step, gravityDefaults);
  for (const letter of thrown) fastest = Math.max(fastest, Math.abs(letter.va));
}
if (fastest > 4.01) fail(`a thrown letter spun at ${fastest.toFixed(2)} rad/s`);
for (const letter of thrown) {
  if (Math.abs(letter.va) > 0.4) fail(`"${letter.ch}" kept spinning after the throw (${letter.va.toFixed(2)} rad/s)`);
}

// Erasing fades the pile out instead of cutting it: still there mid-fade, gone
// once the fade completes.
fadeLetters(letters, () => true);
for (let frame = 0; frame < 24; frame += 1) stepGravity(letters, width, height, step, gravityDefaults);
if (letters.length !== settled) fail("the pile vanished before the fade finished");
if (letters.some((letter) => letter.fade >= 1)) fail("erasing did not start the fade");
for (let frame = 0; frame < 120; frame += 1) stepGravity(letters, width, height, step, gravityDefaults);
if (letters.length !== 0) fail(`${letters.length} letters survived the fade`);

console.log(`ok — ${settled} letters settled on the floor, survived a ${fastest.toFixed(1)} rad/s throw, then faded out`);
