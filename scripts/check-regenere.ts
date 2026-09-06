// Self-check for the "Regenere" drum: every letter has to land inside the frame,
// spell the word down its column and around its ring, mirror itself on the far
// side, and come back exactly where it started after one turn.
// Run with: npm run check:regenere
import { regenereGlyphs, regenereShape, type RegenereGlyph } from "../src/regenere.ts";

const fail = (message: string) => {
  throw new Error(message);
};
const width = 900;
const height = 900;
const word = [...regenereShape.word];
const columns = word.length * 2; // the word laid down twice, half a step apart

const at = (glyphs: RegenereGlyph[], ring: number, column: number) => {
  const found = glyphs.find((g) => g.ring === ring && g.column === column);
  if (!found) fail(`no letter at ring ${ring}, column ${column}`);
  return found!;
};

const frame = (turn: number) => regenereGlyphs(width, height, turn, regenereShape);
const first = frame(0);

// 1. The drum is complete and stays inside the frame.
if (first.length !== regenereShape.rings * columns) {
  fail(`expected ${regenereShape.rings * columns} letters, got ${first.length}`);
}
for (const g of first) {
  if (g.m.some((v) => !Number.isFinite(v)) || !Number.isFinite(g.alpha)) fail(`letter ${g.ch} is not finite`);
  const reach = (Math.abs(g.m[0]) + Math.abs(g.m[2]) + Math.abs(g.m[1]) + Math.abs(g.m[3])) / 2;
  if (g.m[4] < -reach || g.m[4] > width + reach || g.m[5] < -reach || g.m[5] > height + reach) {
    fail(`letter ${g.ch} fell outside the frame at ${g.m[4].toFixed(0)},${g.m[5].toFixed(0)}`);
  }
}

// 2. The word reads down every column and around every ring.
for (let column = 0; column < columns; column += 1) {
  const down = Array.from({ length: regenereShape.rings }, (_, ring) => at(first, ring, column).ch).join("");
  const expected = Array.from({ length: regenereShape.rings }, (_, ring) => {
    const index = ((Math.floor(column / 2) - ring) % word.length + word.length) % word.length;
    return word[index];
  }).join("");
  if (down !== expected) fail(`column ${column} reads ${down}, expected ${expected}`);
}
for (let ring = 0; ring < regenereShape.rings; ring += 1) {
  // Every second column repeats the letter (the two copies of the word), so the
  // ring spells the whole word once round with each letter doubled.
  const round = Array.from({ length: columns }, (_, column) => at(first, ring, column).ch);
  for (let i = 0; i < columns; i += 2) {
    if (round[i] !== round[i + 1]) fail(`ring ${ring} breaks between columns ${i} and ${i + 1}`);
  }
  const spelled = round.filter((_, i) => i % 2 === 0).join("");
  const rotations = word.map((_, i) => [...word.slice(i), ...word.slice(0, i)].join(""));
  if (!rotations.includes(spelled)) fail(`ring ${ring} reads ${spelled}, which is not ${regenereShape.word} come round`);
}

// 3. The near side is solid and upright, the far side faint and mirrored.
const nearest = first[first.length - 1];
const farthest = first[0];
const sense = (g: RegenereGlyph) => Math.sign(g.m[0] * g.m[3] - g.m[1] * g.m[2]);
if (sense(nearest) <= 0) fail("the letter facing the viewer came out mirrored");
if (sense(farthest) >= 0) fail("the letter on the far side did not come out mirrored");
if (nearest.alpha < 0.99) fail(`the front letter is only ${nearest.alpha.toFixed(2)} ink`);
if (Math.abs(farthest.alpha - regenereShape.shadow) > 1e-9) fail(`the back letter is ${farthest.alpha.toFixed(2)} ink`);

// 4. Letters grow towards the bottom, and the columns lean out to the sides.
const top = at(first, 0, 0);
const bottom = at(first, regenereShape.rings - 1, 0);
const growth = Math.hypot(bottom.m[2], bottom.m[3]) / Math.hypot(top.m[2], top.m[3]);
if (growth < 1.2 || growth > 1.6) fail(`letters grow ${growth.toFixed(2)}× down the drum`);

// 5. One turn brings the drum back exactly where it started — no seam, no start.
const looped = frame(Math.PI * 2);
for (const before of first) {
  const after = at(looped, before.ring, before.column);
  if (after.ch !== before.ch) fail("a letter changed after a full turn");
  for (let k = 0; k < 6; k += 1) {
    if (Math.abs(after.m[k] - before.m[k]) > 1e-6) fail("the drum drifted after a full turn");
  }
}

// 6. Nothing tears or flips at a quarter turn either.
for (const turn of [0.4, 1.1, 2.7, 4.9]) {
  const glyphs = frame(turn);
  if (glyphs.length !== first.length) fail(`lost letters at turn ${turn}`);
  if (glyphs.some((g) => g.m.some((v) => !Number.isFinite(v)))) fail(`turn ${turn} produced a broken letter`);
  if (!glyphs.some((g) => sense(g) > 0) || !glyphs.some((g) => sense(g) < 0)) {
    fail(`turn ${turn} shows only one side of the drum`);
  }
}

console.log(
  `ok — ${first.length} letters on ${columns} columns × ${regenereShape.rings} rings; ` +
    `word reads down and round, back side mirrored at ${regenereShape.shadow} ink, ` +
    `${growth.toFixed(2)}× growth to the bottom, seamless over one turn`,
);
