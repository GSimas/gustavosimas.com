import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// A fixed backdrop behind every route: the ecology of knowledge in three
// depths, one per verb of the site. Furthest back, the contour lines of an
// atlas (investigate); in the middle, a drifting network of ideas whose links
// form and dissolve (systematise); nearest, loose letters and symbols where
// poetry and science share a page (create). Each depth scrolls at its own
// rate, so the page reads as layers of the same territory.

const FAR = 0.06;
const MID = 0.18;
const NEAR = 0.42;
const LINK = 150;
const GLYPHS = "aeiouλ∂∑∞Ω§¶∴≈φπ{}<>/αβ01".split("");

type Node = { x: number; y: number; vx: number; vy: number; hue: 0 | 1 | 2; phase: number };
type Glyph = { x: number; y: number; char: string; size: number; spin: number; phase: number };
type Ridge = { x: number; y: number; r: number; seed: number };

// Wrap a world position into a band one tile tall that starts `margin` above
// the viewport, so things leave at the bottom and return at the top unseen.
const wrap = (value: number, tile: number, margin: number) => ((((value + margin) % tile) + tile) % tile) - margin;

export function AtlasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let glyphs: Glyph[] = [];
    let ridges: Ridge[] = [];
    let palette = { line: "", accents: ["", "", ""], ink: "", hidden: false };

    const readPalette = () => {
      const style = getComputedStyle(document.documentElement);
      const token = (name: string) => style.getPropertyValue(name).trim();
      palette = {
        line: token("--line-strong"),
        accents: [token("--green"), token("--cyan"), token("--violet")],
        ink: token("--faint"),
        // High contrast asks for a plain ground; the texture would fight it.
        hidden: document.documentElement.classList.contains("high-contrast"),
      };
    };

    const seed = () => {
      const area = width * height;
      // ponytail: density scales with area and is capped; the O(n²) link pass stays under ~6k pairs.
      const nodeCount = Math.min(110, Math.round(area / 16000));
      const tile = height + LINK * 2;
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * tile,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        hue: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        phase: Math.random() * Math.PI * 2,
      }));
      glyphs = Array.from({ length: Math.min(28, Math.round(area / 55000)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * (height + 160),
        char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        size: 14 + Math.random() * 26,
        spin: (Math.random() - 0.5) * 0.0002,
        phase: Math.random() * Math.PI * 2,
      }));
      const reach = Math.max(width, height) * 0.55;
      ridges = Array.from({ length: 3 }, (_, index) => ({
        x: width * (0.15 + 0.7 * Math.random()),
        y: (height + reach * 2) * (index / 3) + Math.random() * reach,
        r: reach,
        seed: Math.random() * 100,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seed();
    };

    const drawRidges = (scroll: number, time: number) => {
      context.strokeStyle = palette.line;
      context.lineWidth = 1;
      for (const ridge of ridges) {
        const tile = height + ridge.r * 2;
        const baseY = wrap(ridge.y - scroll * FAR, tile, ridge.r);
        for (const cy of [baseY, baseY - tile, baseY + tile]) {
          if (cy + ridge.r < 0 || cy - ridge.r > height) continue;
          for (let level = 1; level <= 9; level += 1) {
            const radius = (ridge.r * level) / 9;
            context.globalAlpha = 0.6 - level * 0.045;
            context.beginPath();
            for (let step = 0; step <= 96; step += 1) {
              const angle = (step / 96) * Math.PI * 2;
              const wobble =
                Math.sin(angle * 3 + ridge.seed + level * 0.4 + time * 0.00005) * 0.09 +
                Math.sin(angle * 5 - ridge.seed * 0.7 + level * 0.25) * 0.05;
              const r = radius * (1 + wobble);
              const px = ridge.x + Math.cos(angle) * r;
              const py = cy + Math.sin(angle) * r * 0.78;
              if (step === 0) context.moveTo(px, py);
              else context.lineTo(px, py);
            }
            context.stroke();
          }
        }
      }
    };

    const drawNetwork = (scroll: number, time: number, moving: boolean) => {
      const tile = height + LINK * 2;
      const points = nodes.map((node) => {
        if (moving) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
        }
        return { node, x: node.x, y: wrap(node.y - scroll * MID, tile, LINK) };
      });

      context.lineWidth = 0.8;
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK) continue;
          context.globalAlpha = (1 - distance / LINK) * 0.22;
          context.strokeStyle = palette.accents[points[i].node.hue];
          context.beginPath();
          context.moveTo(points[i].x, points[i].y);
          context.lineTo(points[j].x, points[j].y);
          context.stroke();
        }
      }

      for (const { node, x, y } of points) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0012 + node.phase);
        context.globalAlpha = 0.25 + pulse * 0.35;
        context.fillStyle = palette.accents[node.hue];
        context.beginPath();
        context.arc(x, y, 1.4 + pulse * 1.1, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawGlyphs = (scroll: number, time: number) => {
      context.fillStyle = palette.ink;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const tile = height + 160;
      for (const glyph of glyphs) {
        const y = wrap(glyph.y - scroll * NEAR, tile, 80);
        const drift = Math.sin(time * 0.0003 + glyph.phase) * 8;
        context.globalAlpha = 0.2 + 0.08 * Math.sin(time * 0.0007 + glyph.phase);
        context.font = `400 ${glyph.size}px "Playfair Display", Georgia, serif`;
        context.save();
        context.translate(glyph.x + drift, y);
        context.rotate(Math.sin(glyph.phase) * 0.4 + time * glyph.spin);
        context.fillText(glyph.char, 0, 0);
        context.restore();
      }
    };

    const draw = (time: number, moving: boolean) => {
      context.clearRect(0, 0, width, height);
      if (palette.hidden) return;
      const scroll = moving ? window.scrollY : 0;
      drawRidges(scroll, time);
      drawNetwork(scroll, time, moving);
      drawGlyphs(scroll, time);
      context.globalAlpha = 1;
    };

    readPalette();
    resize();

    let frame = 0;
    const loop = (time: number) => {
      draw(time, true);
      frame = requestAnimationFrame(loop);
    };
    // Reduced motion gets one still frame, redrawn only when the ground changes.
    const still = () => draw(0, false);
    if (reduceMotion) still();
    else frame = requestAnimationFrame(loop);

    const onResize = () => {
      resize();
      if (reduceMotion) still();
    };
    const themeWatcher = new MutationObserver(() => {
      readPalette();
      if (reduceMotion) still();
    });
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      themeWatcher.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="atlas-background" aria-hidden="true" />;
}
