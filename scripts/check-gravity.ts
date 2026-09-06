// Self-check for the falling-letters physics: drop a word, let it settle, and
// assert the pile is on the floor, inside the walls and no longer overlapping.
// Run with: npm run check:gravity
import { fadeLetters, gravityDefaults, stepGravity, unweld, weld, wordOf, type GravityLetter } from "../src/gravity.ts";

const width = 900;
const height = 500;
const step = 1 / 120;

const glyph = (ch: string, index: number): GravityLetter => {
  const r = 18;
  return {
    ch,
    wordId: 1,
    font: "serif",
    colour: "#fff",
    size: 42,
    r,
    mass: r * r,
    advance: r * 2,
    groupId: null,
    ox: 0,
    oy: 0,
    x: width / 2 - 80 + index * 20,
    y: -r - index * 38,
    vx: 0,
    vy: 60,
    angle: 0,
    va: 0,
    held: false,
    fade: 1,
  };
};

const letters: GravityLetter[] = [..."gravidade"].map(glyph);

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

// Welding: five letters dragged together spell one word, and that word has to
// behave as a single piece — falling, landing and staying legible in a row.
const spelled = [..."vaidade"].map(glyph);
spelled.forEach((letter, index) => {
  letter.x = 120 + index * 90;
  letter.y = 60;
  letter.vy = 0;
});
let word = [spelled[0]];
for (let index = 1; index < spelled.length; index += 1) {
  word = weld(spelled, word[0], spelled[index], 1);
}
if (word.length !== spelled.length) fail(`the weld lost letters (${word.length} of ${spelled.length})`);
if (word.map((letter) => letter.ch).join("") !== "vaidade") fail(`the weld scrambled the word into "${word.map((l) => l.ch).join("")}"`);
if (wordOf(spelled, spelled[3]).length !== spelled.length) fail("a member could not find the word it belongs to");

for (let frame = 0; frame < 120 * 6; frame += 1) stepGravity(spelled, width, height, step, gravityDefaults);

const ordered = wordOf(spelled, spelled[0]);
if (ordered.map((letter) => letter.ch).join("") !== "vaidade") fail("the word stopped reading in order after the fall");
for (const letter of ordered) {
  if (!Number.isFinite(letter.x) || !Number.isFinite(letter.y)) fail(`welded "${letter.ch}" left the numbers behind`);
  if (letter.y > height - letter.r + 0.5) fail(`welded "${letter.ch}" fell through the floor`);
  if (Math.abs(letter.vx) > 6 || Math.abs(letter.vy) > 6) fail(`welded "${letter.ch}" never came to rest`);
}
// The letters have to still be a row: even spacing, one baseline, one angle.
const angle = ordered[0].angle;
for (let index = 1; index < ordered.length; index += 1) {
  const previous = ordered[index - 1];
  const letter = ordered[index];
  const reach = Math.hypot(letter.x - previous.x, letter.y - previous.y);
  const wanted = letter.ox - previous.ox;
  if (Math.abs(reach - wanted) > 3) fail(`"${previous.ch}${letter.ch}" drifted ${Math.abs(reach - wanted).toFixed(2)}px out of the row`);
  if (Math.abs(letter.angle - angle) > 0.02) fail(`"${letter.ch}" is not on the word's baseline`);
}

// And breaking it apart has to give the letters back to gravity — thrown clear
// of one another, not left in the tidy row they were welded into.
const spread = (group: GravityLetter[]) => {
  const xs = group.map((letter) => letter.x);
  return Math.max(...xs) - Math.min(...xs);
};
const before = spread(ordered);
unweld(spelled, ordered[0]);
if (spelled.some((letter) => letter.groupId !== null)) fail("the word stayed welded after being broken apart");
for (let frame = 0; frame < 120 * 3; frame += 1) stepGravity(spelled, width, height, step, gravityDefaults);
if (spelled.some((letter) => !Number.isFinite(letter.x))) fail("a letter broke loose into nowhere");
const after = spread(spelled);
if (after < before * 1.4) fail(`breaking the word barely moved it (${before.toFixed(0)}px wide, then ${after.toFixed(0)}px)`);
for (const letter of spelled) {
  if (letter.y > height - letter.r + 0.5) fail(`"${letter.ch}" was thrown through the floor`);
  if (letter.x < letter.r - 0.5 || letter.x > width - letter.r + 0.5) fail(`"${letter.ch}" was thrown through a wall`);
  if (Math.abs(letter.vx) > 6 || Math.abs(letter.vy) > 6) fail(`"${letter.ch}" never settled after the burst`);
}

console.log(
  `ok — ${settled} letters settled on the floor, survived a ${fastest.toFixed(1)} rad/s throw, then faded out; ` +
    `${ordered.length} welded letters fell as one word, then burst from ${before.toFixed(0)}px to ${after.toFixed(0)}px wide`,
);
