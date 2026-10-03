import { SectionMarker } from "./SectionMarker";
import { ErrorBoundary } from "./ErrorBoundary";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { MosaicPoem } from "./MosaicPoem";
import { repelTuning, stepRepel, type RepelLetter } from "./repel";
import { regenereGlyphs, regenereShape } from "./regenere";
import {
  fadeLetters,
  gravityDefaults,
  gravityMaxChars,
  gravityMaxWords,
  gravityRanges,
  stepGravity,
  unweld,
  weld,
  wordOf,
  type GravityLetter,
  type GravitySettings,
} from "./gravity";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Moon,
  Play,
  Search,
  Sun,
  X,
} from "lucide-react";
import type { Language } from "./content";
import { poems, creationExperiments, creationsCopy, type Poem } from "./content-creations";

const POEMS_PER_PAGE = 6;

// Diacritic-insensitive compare, so "pos-estruturalismo" finds "Pós-Estruturalismo".
const fold = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// --------------------------------------------------------------------------
// CREATIONS PAGE COMPONENT
// --------------------------------------------------------------------------
export default function Creations({
  navigate,
  language,
  setLanguage,
}: {
  navigate: (path: string) => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}) {
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("theme") as "dark" | "light") || "dark");
  const [active, setActive] = useState<Poem | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const reduceMotion = useReducedMotion();
  // The card that opened the lightbox gets focus back when it closes.
  const openerRef = useRef<HTMLElement | null>(null);
  const copy = creationsCopy[language];
  const isPt = language === "pt";

  const matches = useMemo(() => {
    const term = fold(query.trim());
    if (!term) return poems;
    return poems.filter((poem) =>
      fold([poem.title, poem.titleEn, poem.words, poem.year, isPt ? poem.note : poem.noteEn].join(" ")).includes(term),
    );
  }, [query, isPt]);

  const pageCount = Math.max(1, Math.ceil(matches.length / POEMS_PER_PAGE));
  // Clamp while rendering as well as in the effect below: the effect only runs
  // after paint, and a shrinking result set must never show an empty page.
  const currentPage = Math.min(page, pageCount - 1);
  const visiblePoems = matches.slice(currentPage * POEMS_PER_PAGE, (currentPage + 1) * POEMS_PER_PAGE);

  useEffect(() => {
    setPage(0);
  }, [query]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      // Keep Tab inside the dialog while it is open.
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".poem-lightbox-inner");
      const focusable = dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus();
    };
  }, [active]);

  const activeTitle = active ? (isPt ? active.title : active.titleEn) : "";

  return (
    <main className="cr-page">
      <nav className="cv-toolbar cr-toolbar">
        <button className="cv-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> {copy.back}
        </button>
        <div className="cv-toolbar-right">
          <button
            className="cv-theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={copy.themeAria}
            title={copy.themeAria}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="cv-language-toggle"
            onClick={() => setLanguage(isPt ? "en" : "pt")}
            aria-label={copy.languageAria}
            title={copy.languageAria}
          >
            <span className={!isPt ? "active" : ""}>EN</span>
            <span aria-hidden="true">/</span>
            <span className={isPt ? "active" : ""}>PT</span>
          </button>
        </div>
      </nav>

      <header className="cr-header">
        <p className="eyebrow">
          <span className="signal" /> {copy.kicker}
        </p>
        <m.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {copy.title}
        </m.h1>
        <p className="cr-lede">{copy.lede}</p>
      </header>

      {/* POEMAS INTERATIVOS */}
      <section className="cr-section">
        <SectionMarker number={copy.interactive.number} label={copy.interactive.label} />
        <div className="cr-section-head">
          <h2>
            {copy.interactive.title1}
            <br />
            <em>{copy.interactive.title2}</em>
          </h2>
          <p>{copy.interactive.subtitle}</p>
        </div>
        <div className="cr-live">
          <article className="cr-live-piece is-banner">
            <ErrorBoundary label="TouchPoem"><TouchPoem copy={copy.interactive} /></ErrorBoundary>
            <div className="cr-live-body">
              <h3>{copy.interactive.touchTitle}</h3>
              <p>{copy.interactive.touchNote}</p>
            </div>
          </article>
          <article className="cr-live-piece">
            <ErrorBoundary label="ClockPoem"><ClockPoem label={copy.interactive.clockLabel} aria={copy.interactive.clockAria} /></ErrorBoundary>
            <div className="cr-live-body">
              <h3>{copy.interactive.clockTitle}</h3>
              <p>{copy.interactive.clockNote}</p>
            </div>
          </article>
          <article className="cr-live-piece">
            <ErrorBoundary label="FlagPoem"><FlagPoem placeholder="balance sua bandeira" copy={copy.interactive} /></ErrorBoundary>
            <div className="cr-live-body">
              <h3>{copy.interactive.flagTitle}</h3>
              <p>{copy.interactive.flagNote}</p>
            </div>
          </article>
          <article className="cr-live-piece">
            <ErrorBoundary label="MosaicPoem"><MosaicPoem copy={copy.interactive} /></ErrorBoundary>
            <div className="cr-live-body">
              <h3>{copy.interactive.mosaicTitle}</h3>
              <p>{copy.interactive.mosaicNote}</p>
            </div>
          </article>
          <article className="cr-live-piece">
            <ErrorBoundary label="GravityPoem"><GravityPoem copy={copy.interactive} /></ErrorBoundary>
            <div className="cr-live-body">
              <h3>{copy.interactive.gravityTitle}</h3>
              <p>{copy.interactive.gravityNote}</p>
            </div>
          </article>
        </div>
      </section>

      {/* POEMAS VISUAIS */}
      <section className="cr-section">
        <SectionMarker number={copy.poems.number} label={copy.poems.label} />
        <div className="cr-section-head">
          <h2>
            {copy.poems.title1}
            <br />
            <em>{copy.poems.title2}</em>
          </h2>
          <p>{copy.poems.subtitle}</p>
        </div>
        <div className="poem-search">
          <div className="poem-search-field">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.poems.searchPlaceholder}
              aria-label={copy.poems.searchAria}
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label={copy.poems.searchClear}>
                <X size={14} />
              </button>
            ) : null}
          </div>
          <span className="poem-search-count" aria-live="polite">
            {matches.length} {matches.length === 1 ? copy.poems.counterOne : copy.poems.counter}
          </span>
        </div>
        {visiblePoems.length ? (
          <div className="poem-gallery" aria-label={copy.poems.galleryAria}>
            {visiblePoems.map((poem) => {
              const title = isPt ? poem.title : poem.titleEn;
              return (
                <button
                  key={poem.slug}
                  type="button"
                  className="poem-card"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setActive(poem);
                  }}
                  aria-label={`${copy.poems.open}: ${title}`}
                >
                  <span className="poem-frame" style={{ aspectRatio: poem.ratio }}>
                    {poem.media === "canvas" ? (
                      <ErrorBoundary label="RegenerePoem"><RegenerePoem className="poem-media" aria={isPt ? poem.note : poem.noteEn} /></ErrorBoundary>
                    ) : (
                      <PoemMedia poem={poem} play={!reduceMotion && poem.media === "video"} />
                    )}
                    {poem.media === "video" && reduceMotion ? (
                      <span className="poem-play" aria-hidden="true">
                        <Play size={16} />
                      </span>
                    ) : null}
                  </span>
                  <span className="poem-caption">
                    <strong>{title}</strong>
                    <span>{poem.media === "image" ? copy.poems.still : poem.year}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="poem-empty">{copy.poems.empty}</p>
        )}
        {pageCount > 1 ? (
          <nav className="poem-pager" aria-label={copy.poems.pagerAria}>
            <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 0}>
              <ChevronLeft size={14} aria-hidden="true" />
              {copy.poems.previous}
            </button>
            <span aria-live="polite">
              {copy.poems.page} {currentPage + 1} {copy.poems.pageOf} {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= pageCount - 1}
            >
              {copy.poems.next}
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </nav>
        ) : null}
      </section>

      {/* EXPERIMENTOS E LABORATÓRIOS */}
      <section className="cr-section">
        <SectionMarker number={copy.experiments.number} label={copy.experiments.label} />
        <div className="cr-section-head">
          <h2>
            {copy.experiments.title1}
            <br />
            <em>{copy.experiments.title2}</em>
          </h2>
          <p>{copy.experiments.subtitle}</p>
        </div>
        <div className="cr-experiments">
          {creationExperiments.map((experiment) => (
            <m.a
              key={experiment.href}
              className="cr-experiment"
              href={experiment.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -6 }}
            >
              <span className="cr-experiment-tag">{isPt ? experiment.tag : experiment.tagEn}</span>
              <h3>{isPt ? experiment.title : experiment.titleEn}</h3>
              <p>{isPt ? experiment.description : experiment.descriptionEn}</p>
              <span className="cr-experiment-link">
                {copy.experiments.open} <ArrowUpRight size={14} />
              </span>
            </m.a>
          ))}
          <article className="cr-experiment is-open">
            <span className="cr-experiment-tag">∞</span>
            <h3>{copy.experiments.openTitle}</h3>
            <p>{copy.experiments.openText}</p>
          </article>
        </div>
      </section>

      {/* RECICLOPÉDIA CONCRETA */}
      <section className="cr-section">
        <SectionMarker number={copy.zine.number} label={copy.zine.label} />
        <div className="cr-zine">
          <div className="cr-zine-cover">
            <img src="/assets/poemas/reciclopedia-concreta.jpg" alt={copy.zine.alt} loading="lazy" />
          </div>
          <div className="cr-zine-body">
            <h2>{copy.zine.title}</h2>
            <p>{copy.zine.text}</p>
            <button className="button primary" type="button" disabled>
              {copy.zine.open} <FileText size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="cr-footer">
        <span>Gustavo Simas</span>
        <span>{copy.footer}</span>
      </footer>

      <AnimatePresence>
        {active ? (
          <m.div
            className="poem-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activeTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
          >
            <m.div
              className="poem-lightbox-inner"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="poem-close" onClick={() => setActive(null)} aria-label={copy.poems.close} autoFocus>
                <X size={18} />
              </button>
              <div className="poem-lightbox-media" style={{ aspectRatio: active.ratio }}>
                {active.media === "canvas" ? (
                  <ErrorBoundary label="RegenerePoem"><RegenerePoem className="poem-canvas" aria={isPt ? active.note : active.noteEn} /></ErrorBoundary>
                ) : active.media === "image" ? (
                  <img src={`/assets/poemas/${active.slug}.jpg`} alt={isPt ? active.note : active.noteEn} />
                ) : (
                  <video
                    key={active.slug}
                    src={`/assets/poemas/${active.slug}.mp4`}
                    poster={`/assets/poemas/${active.slug}.jpg`}
                    autoPlay={!reduceMotion}
                    controls={!!reduceMotion}
                    muted
                    loop
                    playsInline
                  />
                )}
              </div>
              <div className="poem-lightbox-body">
                <span className="poem-lightbox-year">{active.year}</span>
                <h2>{activeTitle}</h2>
                <span className="poem-lightbox-label">{copy.poems.words}</span>
                <p className="poem-lightbox-words">
                  {active.words.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <span className="poem-lightbox-label">{copy.poems.about}</span>
                <p className="poem-lightbox-note">{isPt ? active.note : active.noteEn}</p>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

// The poster is always painted; the video is only mounted once the card comes
// near the viewport, so a gallery of seventeen loops never downloads at once.
function PoemMedia({ poem, play }: { poem: Poem; play: boolean }) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!play) return;
    const element = frameRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          setMounted(true);
          if (video) void video.play().catch(() => {});
        } else if (video) {
          video.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [play]);

  return (
    <span className="poem-layers" ref={frameRef}>
      <img className="poem-media" src={`/assets/poemas/${poem.slug}.jpg`} alt="" loading="lazy" />
      {play && mounted ? (
        <video
          ref={videoRef}
          className="poem-media is-video"
          src={`/assets/poemas/${poem.slug}.mp4`}
          poster={`/assets/poemas/${poem.slug}.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : null}
    </span>
  );
}

// --------------------------------------------------------------------------
// INTERACTIVE POEMS (LIVE CANVAS PIECES)
// --------------------------------------------------------------------------

// Letter placement traced from the original "O Tempo Não Para" video: a loose,
// hand-composed ring where radius and size vary letter by letter. Angles are
// degrees clockwise from twelve; radius and size are fractions of the dial.
const clockLayout = [
  { ch: "o", angle: 285.0, radius: 0.9, size: 0.4 },
  { ch: "t", angle: 303.5, radius: 0.79, size: 0.34 },
  { ch: "e", angle: 328.7, radius: 0.82, size: 0.33 },
  { ch: "m", angle: 342.8, radius: 0.61, size: 0.38 },
  { ch: "o", angle: 29.4, radius: 0.37, size: 0.3 },
  { ch: "p", angle: 83.2, radius: 0.77, size: 0.37 },
  { ch: "a", angle: 93.8, radius: 0.3, size: 0.32 },
  { ch: "r", angle: 141.6, radius: 0.37, size: 0.3 },
  { ch: "a", angle: 163.2, radius: 0.56, size: 0.33 },
  { ch: "p", angle: 189.6, radius: 0.85, size: 0.37 },
  { ch: "o", angle: 232.1, radius: 0.87, size: 0.33 },
  { ch: "ã", angle: 240.3, radius: 0.49, size: 0.32 },
  { ch: "n", angle: 249.7, radius: 0.79, size: 0.35 },
];

interface ClockLetter {
  ch: string;
  homeAngle: number;
  homeRadius: number;
  size: number;
  angle: number;
  radius: number;
  lead: number;
  pushArc: number;
  pushed: boolean;
  pushedFrom: number;
  caughtRevolution: number;
}

function createClockLetters(): ClockLetter[] {
  return clockLayout.map((letter, index) => {
    let wf = 0.55;
    if (letter.ch === "m") wf = 0.8;
    else if (letter.ch === "t" || letter.ch === "r") wf = 0.4;
    else if (letter.ch === "o" || letter.ch === "n") wf = 0.6;
    
    // Calculate angular half-width in degrees to use as lead
    const angularHalfWidth = (letter.size * wf * 0.5 / letter.radius) * (180 / Math.PI);

    return {
      ch: letter.ch,
      homeAngle: letter.angle,
      homeRadius: letter.radius,
      size: letter.size,
      angle: letter.angle,
      radius: letter.radius,
      lead: angularHalfWidth,
      pushArc: 40 + (index % 7) * 7,
      pushed: false,
      pushedFrom: 0,
      caughtRevolution: -1,
    };
  });
}

// Signed shortest angular distance, in degrees, within (-180, 180].
function angleDelta(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

// Brasília wall clock as an offset applied to the epoch, so the rest of the
// drawing code can read the shifted date with plain UTC getters.
function brasiliaOffset(): number {
  const now = Date.now();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(now))) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - Math.floor(now / 1000) * 1000;
}

function ClockPoem({ label, aria }: { label: string; aria: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [readout, setReadout] = useState("--:--:--");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const letters = createClockLetters();
    let offset = brasiliaOffset();
    let offsetCheckedAt = Date.now();
    let frame = 0;
    let visible = true;
    let lastSecond = -1;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "150px 0px" },
    );
    visibility.observe(canvas);

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;

      const now = Date.now();
      if (now - offsetCheckedAt > 60000) {
        offset = brasiliaOffset();
        offsetCheckedAt = now;
      }

      const shifted = now + offset;
      const secondOfDay = (shifted % 86400000) / 1000;
      const seconds = reduceMotion ? Math.floor(secondOfDay % 60) : secondOfDay % 60;
      const minutes = Math.floor(secondOfDay / 60) % 60;
      const hours = Math.floor(secondOfDay / 3600) % 24;
      const wholeSecond = Math.floor(secondOfDay);

      if (wholeSecond !== lastSecond) {
        lastSecond = wholeSecond;
        setReadout(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(Math.floor(seconds)).padStart(2, "0")}`,
        );
      } else if (reduceMotion) {
        return;
      }

      const secondAngle = seconds * 6;
      const minuteAngle = (minutes + seconds / 60) * 6;
      const hourAngle = ((hours % 12) + minutes / 60) * 30;
      const revolution = Math.floor(secondOfDay / 60);

      if (!reduceMotion) {
        for (const letter of letters) {
          if (!letter.pushed) {
            const delta = angleDelta(secondAngle, letter.angle);
            if (letter.caughtRevolution !== revolution && delta <= letter.lead && delta > -30) {
              letter.pushed = true;
              letter.pushedFrom = secondAngle;
              letter.caughtRevolution = revolution;
            }
          }

          if (letter.pushed) {
            letter.angle = (secondAngle + letter.lead) % 360;
            letter.radius += (letter.homeRadius * 0.74 - letter.radius) * 0.04;
            const swept = (((secondAngle - letter.pushedFrom) % 360) + 360) % 360;
            if (swept > letter.pushArc) letter.pushed = false;
          } else {
            letter.angle = (letter.angle + angleDelta(letter.angle, letter.homeAngle) * 0.014 + 360) % 360;
            letter.radius += (letter.homeRadius - letter.radius) * 0.02;
          }
        }
      }

      const width = canvas.width;
      const height = canvas.height;
      const centreX = width / 2;
      const centreY = height / 2;
      const radius = Math.min(width, height) * 0.46;

      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);

      context.beginPath();
      context.arc(centreX, centreY, radius, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.fill();

      context.save();
      context.clip();
      const hand = (angle: number, length: number, thickness: number, colour: string, tail = 0) => {
        const theta = (angle * Math.PI) / 180;
        context.beginPath();
        context.moveTo(centreX - Math.sin(theta) * radius * tail, centreY + Math.cos(theta) * radius * tail);
        context.lineTo(centreX + Math.sin(theta) * radius * length, centreY - Math.cos(theta) * radius * length);
        context.lineWidth = radius * thickness;
        context.strokeStyle = colour;
        context.lineCap = "butt";
        context.stroke();
      };

      hand(hourAngle, 0.51, 0.044, "#000000");
      hand(minuteAngle, 0.78, 0.016, "#000000");
      hand(secondAngle, 0.87, 0.014, "#e10600", 0.11);

      context.fillStyle = "#000000";
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (const letter of letters) {
        const theta = (letter.angle * Math.PI) / 180;
        const distance = letter.radius * radius;
        context.font = `900 ${letter.size * radius}px "Playfair Display", Georgia, serif`;
        context.fillText(letter.ch, centreX + Math.sin(theta) * distance, centreY - Math.cos(theta) * distance);
      }
      context.restore();

      context.beginPath();
      context.arc(centreX, centreY, radius * 0.042, 0, Math.PI * 2);
      context.fillStyle = "#000000";
      context.fill();
      context.beginPath();
      context.arc(centreX, centreY, radius * 0.018, 0, Math.PI * 2);
      context.fillStyle = "#e10600";
      context.fill();
    };

    let fontsReady = true;
    void document.fonts?.load('900 40px "Playfair Display"').catch(() => {
      fontsReady = false;
    });
    void fontsReady;

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
  }, [reduceMotion]);

  return (
    <figure className="live-poem">
      <canvas ref={canvasRef} className="live-canvas is-clock" role="img" aria-label={aria} />
      <figcaption className="live-readout">
        <span>{label}</span>
        <strong>{readout}</strong>
      </figcaption>
    </figure>
  );
}

// "Regenere", rebuilt from the original video as a live drawing. The drum's
// geometry lives in regenere.ts; this only paints it and keeps it turning.
function RegenerePoem({ className, aria }: { className: string; aria: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // The glyphs come back as transforms for type set at this size.
    const nominal = 100;
    const font = `200 ${nominal}px Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { rootMargin: "200px 0px" });
    visibility.observe(canvas);

    const inset = 0.94;
    const draw = (turn: number) => {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = "#fbfbfb";
      context.fillRect(0, 0, width, height);
      context.font = font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const offsetX = (width * (1 - inset)) / 2;
      const offsetY = (height * (1 - inset)) / 2;
      for (const glyph of regenereGlyphs(width * inset, height * inset, turn)) {
        const [a, b, c, d, x, y] = glyph.m;
        context.setTransform(
          (a / nominal) * ratio,
          (b / nominal) * ratio,
          (c / nominal) * ratio,
          (d / nominal) * ratio,
          (x + offsetX) * ratio,
          (y + offsetY) * ratio,
        );
        context.fillStyle = `rgba(17,17,17,${glyph.alpha.toFixed(3)})`;
        context.fillText(glyph.ch, 0, 0);
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
    };

    if (reduceMotion) {
      draw(0);
      void document.fonts?.load(`200 40px Inter`).then(() => draw(0)).catch(() => {});
      return () => {
        observer.disconnect();
        visibility.disconnect();
      };
    }

    let frame = requestAnimationFrame(function spin(now) {
      frame = requestAnimationFrame(spin);
      if (!visible) return;
      draw((-(now / 1000) * Math.PI * 2) / regenereShape.period);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={aria} />;
}

// "Não Toque É Arte": a neon museum warning that means it. The letters cycle
// through the spectrum and shove themselves away from the pointer, so the phrase
// can be read but never reached.
const touchLines = ["NÃO TOQUE", "É ARTE"];
type NeonLetter = RepelLetter & { hue: number };

function TouchPoem({ copy }: { copy: (typeof creationsCopy)["pt"]["interactive"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const font = (size: number) => `700 ${size}px Syne, Inter, system-ui, sans-serif`;
    let letters: NeonLetter[] = [];
    let width = 0;
    let height = 0;
    let size = 0;
    const pointer = { x: 0, y: 0, active: false };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const leading = 1.16;
      // Letters are drawn one by one, so kerning is lost; a touch of tracking
      // keeps the glow of neighbouring glyphs from merging.
      const tracking = 1.06;
      context.font = font(100);
      const widest = Math.max(...touchLines.map((line) => context.measureText(line).width * tracking));
      size = Math.min((width * 0.82) / (widest / 100), (height * 0.7) / (touchLines.length * leading));
      context.font = font(size);

      let index = 0;
      letters = touchLines.flatMap((line, row) => {
        const lineWidth = context.measureText(line).width * tracking;
        const y = height / 2 + (row - (touchLines.length - 1) / 2) * size * leading;
        let x = (width - lineWidth) / 2;
        return [...line].flatMap((ch) => {
          const advance = context.measureText(ch).width * tracking;
          const centre = x + advance / 2;
          x += advance;
          if (ch === " ") return [];
          const letter: NeonLetter = {
            ch,
            hx: centre,
            hy: y,
            size,
            phase: index * 0.55,
            hue: index * 26,
            x: centre,
            y,
            vx: 0,
            vy: 0,
            angle: 0,
            va: 0,
          };
          index += 1;
          return [letter];
        });
      });
    };
    layout();

    const observer = new ResizeObserver(layout);
    observer.observe(canvas);

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { rootMargin: "150px 0px" });
    visibility.observe(canvas);

    const track = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const release = () => {
      pointer.active = false;
    };
    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerdown", track);
    canvas.addEventListener("pointerleave", release);
    canvas.addEventListener("pointercancel", release);

    let frame = 0;
    let last = performance.now();
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || dt <= 0) return;

      const tuning = repelTuning(size);
      stepRepel(letters, pointer, dt, tuning);
      const drift = reduceMotion ? 0 : (now / 1000) * 22;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "#05050b";
      context.fillRect(0, 0, width, height);

      if (pointer.active) {
        const halo = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, tuning.radius);
        halo.addColorStop(0, `hsla(${(drift + 180) % 360}, 100%, 62%, 0.13)`);
        halo.addColorStop(1, "hsla(0, 0%, 0%, 0)");
        context.fillStyle = halo;
        context.fillRect(0, 0, width, height);
      }

      context.globalCompositeOperation = "lighter";
      context.font = font(size);
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (const letter of letters) {
        const hue = (drift + letter.hue) % 360;
        context.save();
        context.translate(letter.x, letter.y);
        context.rotate(letter.angle);
        context.shadowColor = `hsl(${hue}, 100%, 55%)`;
        context.shadowBlur = size * 0.5;
        context.fillStyle = `hsl(${hue}, 100%, 58%)`;
        context.fillText(letter.ch, 0, 0);
        context.shadowBlur = size * 0.16;
        context.fillStyle = `hsl(${hue}, 100%, 92%)`;
        context.fillText(letter.ch, 0, 0);
        context.restore();
      }
      context.globalCompositeOperation = "source-over";
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointermove", track);
      canvas.removeEventListener("pointerdown", track);
      canvas.removeEventListener("pointerleave", release);
      canvas.removeEventListener("pointercancel", release);
    };
  }, [reduceMotion]);

  return (
    <figure className="live-poem">
      <canvas ref={canvasRef} className="live-canvas is-neon" role="img" aria-label={copy.touchAria} />
      <figcaption className="live-readout">
        <span>{copy.touchLabel}</span>
      </figcaption>
    </figure>
  );
}

// Display faces with enough contrast to survive being read one glyph at a time.
const gravityFonts = [
  { id: "instrument", label: "Instrument", family: '"Instrument Serif", Georgia, serif', weight: 400 },
  { id: "bodoni", label: "Bodoni", family: '"Bodoni Moda", Didot, Georgia, serif', weight: 500 },
  { id: "cormorant", label: "Cormorant", family: '"Cormorant Garamond", Garamond, Georgia, serif', weight: 300 },
  { id: "syne", label: "Syne", family: "Syne, Inter, sans-serif", weight: 700 },
  { id: "space", label: "Space", family: '"Space Grotesk", Inter, sans-serif', weight: 400 },
] as const;

type GravityFontId = (typeof gravityFonts)[number]["id"];

interface GravityWord {
  id: number;
  text: string;
  font: GravityFontId;
  colour: string;
}

function GravityPoem({ copy }: { copy: (typeof creationsCopy)["pt"]["interactive"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lettersRef = useRef<GravityLetter[]>([]);
  const worldRef = useRef({ width: 0, height: 0 });
  const nextIdRef = useRef(1);
  const nextGroupRef = useRef(1);
  // The gap that welds, and the wider one that only shows the hint, both as a
  // fraction of the two letters' radii.
  const weldReach = 0.35;
  const previewReach = 3;
  const hintRef = useRef<{ a: GravityLetter; b: GravityLetter } | null>(null);
  const seededRef = useRef(false);
  const [words, setWords] = useState<GravityWord[]>([]);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [font, setFont] = useState<GravityFontId>("instrument");
  const [colour, setColour] = useState("#a8e935");
  const [physics, setPhysics] = useState<GravitySettings>(gravityDefaults);
  const physicsRef = useRef(physics);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    physicsRef.current = physics;
  }, [physics]);

  // Letters are spawned imperatively: React owns the word list, the canvas owns
  // the bodies, and the only bridge between them is the word id.
  const spawnWord = (word: GravityWord) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const { width, height } = worldRef.current;
    if (!width || !height) return;

    const choice = gravityFonts.find((option) => option.id === word.font) ?? gravityFonts[0];
    const size = Math.max(20, Math.min(58, Math.min(width, height) * 0.11));
    const spec = `${choice.weight} ${size}px ${choice.family}`;

    // Nothing on the page renders these faces, so the canvas has to ask for the
    // download itself — measuring before it lands would size the discs to a
    // fallback the letters are never drawn in.
    if (!document.fonts.check(spec)) {
      void document.fonts
        .load(spec, word.text)
        .catch(() => undefined)
        .then(() => {
          if (!lettersRef.current.some((letter) => letter.wordId === word.id)) spawnLetters(word, spec, size);
        });
      return;
    }
    spawnLetters(word, spec, size);
  };

  const spawnLetters = (word: GravityWord, spec: string, size: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const { width, height } = worldRef.current;
    if (!width || !height) return;

    context.font = spec;
    const characters = [...word.text].filter((ch) => ch.trim().length > 0);
    const widths = characters.map((ch) => context.measureText(ch).width);
    const span = widths.reduce((total, value) => total + value * 1.1, 0);
    let cursor = width / 2 - span / 2;

    characters.forEach((ch, index) => {
      const glyph = Math.max(widths[index], size * 0.45);
      const r = (Math.max(glyph, size * 0.72) / 2) * 0.92;
      const x = Math.max(r, Math.min(width - r, cursor + glyph * 0.55));
      cursor += glyph * 1.1;
      lettersRef.current.push({
        ch,
        wordId: word.id,
        font: spec,
        colour: word.colour,
        size,
        r,
        mass: r * r,
        advance: glyph,
        groupId: null,
        ox: 0,
        oy: 0,
        x,
        y: reduceMotion ? height - r - index * 0.5 : -r - index * (size * 0.9),
        vx: reduceMotion ? 0 : (Math.random() - 0.5) * 90,
        vy: reduceMotion ? 0 : 60,
        angle: reduceMotion ? 0 : (Math.random() - 0.5) * 0.7,
        va: reduceMotion ? 0 : (Math.random() - 0.5) * 2,
        held: false,
        fade: 1,
      });
    });
  };

  const dropLetters = (wordId: number) => {
    fadeLetters(lettersRef.current, (letter) => letter.wordId === wordId);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim().slice(0, gravityMaxChars);
    if (!text) return;

    if (editing !== null) {
      const word: GravityWord = { id: editing, text, font, colour };
      dropLetters(editing);
      spawnWord(word);
      setWords((previous) => previous.map((item) => (item.id === editing ? word : item)));
      setEditing(null);
    } else {
      const word: GravityWord = { id: nextIdRef.current, text, font, colour };
      nextIdRef.current += 1;
      spawnWord(word);
      setWords((previous) => {
        const next = [...previous, word];
        while (next.length > gravityMaxWords) {
          const oldest = next.shift();
          if (oldest) dropLetters(oldest.id);
        }
        return next;
      });
    }
    setDraft("");
  };

  const removeWord = (wordId: number) => {
    dropLetters(wordId);
    setWords((previous) => previous.filter((item) => item.id !== wordId));
    if (editing === wordId) {
      setEditing(null);
      setDraft("");
    }
  };

  const editWord = (word: GravityWord) => {
    setEditing(word.id);
    setDraft(word.text);
    setFont(word.font);
    setColour(word.colour);
  };

  const clearAll = () => {
    fadeLetters(lettersRef.current, () => true);
    setWords([]);
    setEditing(null);
    setDraft("");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let visible = true;
    let previous = performance.now();
    let carry = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      worldRef.current = { width, height };
      for (const letter of lettersRef.current) {
        letter.x = Math.max(letter.r, Math.min(width - letter.r, letter.x));
        letter.y = Math.min(height - letter.r, letter.y);
      }
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        previous = performance.now();
      },
      { rootMargin: "150px 0px" },
    );
    visibility.observe(canvas);

    // Dragging moves a whole welded word, not the one letter under the finger.
    let dragged: GravityLetter[] = [];
    let grips: Array<{ x: number; y: number }> = [];
    let pointer = { x: 0, y: 0, at: 0 };

    const toWorld = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    // The angle a word already reads at; a loose letter welds onto the upright.
    const axisOf = (letter: GravityLetter) => (letter.groupId === null ? 0 : letter.angle);

    const centreOf = (members: GravityLetter[]) => {
      let mass = 0;
      let x = 0;
      let y = 0;
      for (const member of members) {
        mass += member.mass;
        x += member.mass * member.x;
        y += member.mass * member.y;
      }
      return { x: x / mass, y: y / mass };
    };

    // Every candidate the drag could weld onto: each loose letter, and each
    // welded word once.
    const candidates = () => {
      const seen = new Set<number>();
      const groups: GravityLetter[][] = [];
      for (const letter of lettersRef.current) {
        if (letter.fade < 1 || letter.held) continue;
        if (letter.groupId === null) {
          groups.push([letter]);
          continue;
        }
        if (seen.has(letter.groupId)) continue;
        seen.add(letter.groupId);
        groups.push(wordOf(lettersRef.current, letter));
      }
      return groups;
    };

    /**
     * The closest end-to-end pairing between the dragged letters and anything
     * else on the floor. Which end depends on the side the drag came in from,
     * so a letter approaching from the right always reads after the word.
     */
    const nearestJoin = () => {
      if (!dragged.length) return null;
      const held = new Set(dragged);
      let best: { gap: number; lead: GravityLetter[]; follow: GravityLetter[]; a: GravityLetter; b: GravityLetter } | null =
        null;

      for (const target of candidates()) {
        if (target.some((member) => held.has(member))) continue;
        const angle = axisOf(target[0]);
        const ax = Math.cos(angle);
        const ay = Math.sin(angle);
        const along = (letter: GravityLetter) => letter.x * ax + letter.y * ay;
        const endOf = (members: GravityLetter[], last: boolean) =>
          members.reduce((pick, member) => ((along(member) > along(pick)) === last ? member : pick));

        const draggedCentre = centreOf(dragged);
        const targetCentre = centreOf(target);
        const after = (draggedCentre.x - targetCentre.x) * ax + (draggedCentre.y - targetCentre.y) * ay >= 0;
        const a = endOf(target, after);
        const b = endOf(dragged, !after);
        const gap = Math.hypot(b.x - a.x, b.y - a.y) - (a.r + b.r);
        if (best && gap >= best.gap) continue;
        best = after
          ? { gap, lead: target, follow: dragged, a, b }
          : { gap, lead: dragged, follow: target, a, b };
      }
      return best;
    };

    /**
     * Snap the merged word onto one row. The letters that were already resting
     * stay exactly where they are; the dragged ones click into the slots left
     * for them, which is what makes the weld read as a weld.
     */
    const settleWord = (members: GravityLetter[], anchor: GravityLetter[], angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      let mass = 0;
      let cx = 0;
      let cy = 0;
      for (const member of anchor) {
        mass += member.mass;
        cx += member.mass * (member.x - (member.ox * cos - member.oy * sin));
        cy += member.mass * (member.y - (member.ox * sin + member.oy * cos));
      }
      cx /= mass;
      cy /= mass;
      const { width, height } = worldRef.current;
      for (const member of members) {
        member.x = Math.max(member.r, Math.min(width - member.r, cx + member.ox * cos - member.oy * sin));
        member.y = Math.min(height - member.r, cy + member.ox * sin + member.oy * cos);
        member.angle = angle;
        member.vx = 0;
        member.vy = 0;
        member.va = 0;
      }
    };

    const grab = (members: GravityLetter[], x: number, y: number) => {
      dragged = members;
      grips = members.map((member) => ({ x: member.x - x, y: member.y - y }));
      for (const member of members) {
        member.held = true;
        member.vx = 0;
        member.vy = 0;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const { x, y } = toWorld(event);
      for (let index = lettersRef.current.length - 1; index >= 0; index -= 1) {
        const letter = lettersRef.current[index];
        if (letter.fade < 1) continue;
        if (Math.hypot(letter.x - x, letter.y - y) <= letter.r * 1.3) {
          grab(wordOf(lettersRef.current, letter), x, y);
          pointer = { x, y, at: performance.now() };
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch {
            // A pointer that has already gone cannot be captured; the drag
            // still works, it just ends when the pointer leaves the canvas.
          }
          event.preventDefault();
          return;
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragged.length) return;
      const { x, y } = toWorld(event);
      const now = performance.now();
      const elapsed = Math.max(8, now - pointer.at) / 1000;
      const vx = (x - pointer.x) / elapsed;
      const vy = (y - pointer.y) / elapsed;
      dragged.forEach((member, index) => {
        member.x = x + grips[index].x;
        member.y = y + grips[index].y;
        member.vx = vx;
        member.vy = vy;
      });
      pointer = { x, y, at: now };
      event.preventDefault();

      const join = nearestJoin();
      const reach = join ? (join.a.r + join.b.r) * weldReach : 0;
      hintRef.current = join && join.gap < reach * previewReach ? { a: join.a, b: join.b } : null;
      if (!join || join.gap > reach) return;

      // Contact: the two words become one and the drag carries on with it.
      const anchor = join.lead === dragged ? join.follow : join.lead;
      const angle = axisOf(anchor[0]);
      const members = weld(lettersRef.current, join.lead[0], join.follow[0], nextGroupRef.current);
      nextGroupRef.current += 1;
      settleWord(members, anchor, angle);
      hintRef.current = null;
      grab(members, x, y);
    };

    const onPointerUp = () => {
      if (!dragged.length) return;
      // A stale throw velocity would fling a letter the user merely parked.
      const stale = performance.now() - pointer.at > 120;
      for (const member of dragged) {
        if (stale) {
          member.vx = 0;
          member.vy = 0;
        }
        member.held = false;
      }
      dragged = [];
      grips = [];
      hintRef.current = null;
    };

    // Two clicks break a welded word back into loose letters.
    const onDoubleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      for (let index = lettersRef.current.length - 1; index >= 0; index -= 1) {
        const letter = lettersRef.current[index];
        if (letter.groupId === null || letter.fade < 1) continue;
        if (Math.hypot(letter.x - x, letter.y - y) <= letter.r * 1.3) {
          unweld(lettersRef.current, letter);
          return;
        }
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("dblclick", onDoubleClick);

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const { width, height } = worldRef.current;
      if (!visible) {
        previous = now;
        return;
      }

      carry = Math.min(0.25, carry + (now - previous) / 1000);
      previous = now;
      const step = 1 / 120;
      while (carry >= step) {
        stepGravity(lettersRef.current, width, height, step, physicsRef.current);
        carry -= step;
      }

      context.clearRect(0, 0, width, height);

      // The join about to happen, so the weld is something the reader can aim
      // for rather than something that just occurs.
      const hint = hintRef.current;
      if (hint) {
        context.save();
        context.strokeStyle = hint.b.colour;
        context.globalAlpha = 0.5;
        context.lineWidth = 1.5;
        context.setLineDash([4, 5]);
        context.beginPath();
        context.moveTo(hint.a.x, hint.a.y);
        context.lineTo(hint.b.x, hint.b.y);
        context.stroke();
        context.restore();
      }

      context.textAlign = "center";
      context.textBaseline = "middle";
      for (const letter of lettersRef.current) {
        context.save();
        context.globalAlpha = letter.fade;
        context.translate(letter.x, letter.y);
        context.rotate(letter.angle);
        context.scale(letter.fade, letter.fade);
        context.fillStyle = letter.colour;
        context.font = letter.font;
        context.fillText(letter.ch, 0, 0);
        context.restore();
      }
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("dblclick", onDoubleClick);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    const word: GravityWord = { id: nextIdRef.current, text: copy.gravitySeed, font: "instrument", colour: "#a8e935" };
    nextIdRef.current += 1;
    spawnWord(word);
    setWords([word]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className="live-poem">
      <canvas ref={canvasRef} className="live-canvas is-gravity" role="img" aria-label={copy.gravityAria} />
      <figcaption className="live-controls">
        <form className="gravity-compose" onSubmit={submit}>
          <div className="live-field">
            <label htmlFor="gravity-word">{copy.gravityInput}</label>
            <input
              id="gravity-word"
              type="text"
              value={draft}
              maxLength={gravityMaxChars}
              placeholder={copy.gravityPlaceholder}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>
          <button type="submit" className="live-export-button" disabled={!draft.trim()}>
            {editing === null ? copy.gravityAdd : copy.gravityUpdate}
          </button>
        </form>

        <div className="live-colours">
          <label className="gravity-font">
            <select value={font} onChange={(event) => setFont(event.target.value as GravityFontId)} aria-label={copy.gravityFont}>
              {gravityFonts.map((option) => (
                <option key={option.id} value={option.id} style={{ fontFamily: option.family }}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input type="color" value={colour} onChange={(event) => setColour(event.target.value)} />
            <span>{copy.gravityColour}</span>
          </label>
          <button type="button" className="live-reset" onClick={clearAll} disabled={!words.length}>
            {copy.gravityClear}
          </button>
        </div>

        <div className="gravity-sliders">
          {([
            { key: "pull", label: copy.gravityPull, format: (value: number) => String(Math.round(value)) },
            { key: "bounce", label: copy.gravityBounce, format: (value: number) => `${Math.round(value * 100)}%` },
            { key: "grip", label: copy.gravityGrip, format: (value: number) => `${Math.round(value * 100)}%` },
          ] as const).map(({ key, label, format }) => (
            <label key={key} className="gravity-slider">
              <span>
                {label} <strong>{format(physics[key])}</strong>
              </span>
              <input
                type="range"
                min={gravityRanges[key].min}
                max={gravityRanges[key].max}
                step={gravityRanges[key].step}
                value={physics[key]}
                onChange={(event) => setPhysics((previous) => ({ ...previous, [key]: Number(event.target.value) }))}
              />
            </label>
          ))}
          <button type="button" className="live-reset" onClick={() => setPhysics(gravityDefaults)}>
            {copy.gravityReset}
          </button>
        </div>

        <div className="gravity-words">
          {words.length ? (
            words.map((word) => (
              <span key={word.id} className={`gravity-chip ${editing === word.id ? "is-editing" : ""}`}>
                <button
                  type="button"
                  onClick={() => editWord(word)}
                  title={copy.gravityEdit}
                  style={{ fontFamily: gravityFonts.find((option) => option.id === word.font)?.family }}
                >
                  <em style={{ background: word.colour }} aria-hidden="true" />
                  {word.text}
                </button>
                <button type="button" onClick={() => removeWord(word.id)} aria-label={`${copy.gravityDelete}: ${word.text}`}>
                  <X size={12} />
                </button>
              </span>
            ))
          ) : (
            <span className="gravity-empty">{copy.gravityEmpty}</span>
          )}
        </div>
        <small className="gravity-hint">{copy.gravityHint}</small>
      </figcaption>
    </figure>
  );
}

const flagStripes = 7;
// One full pass of the wave, so exported loops close on themselves.
const flagPeriod = (Math.PI * 2) / 2.1;

interface FlagScene {
  texture: HTMLCanvasElement;
  length: number;
  cloth: number;
  background: string;
}

// The cloth is drawn flat into an offscreen canvas, then sampled column by
// column so the wave can bend it without distorting the letterforms.
function createFlagScene(
  width: number,
  height: number,
  text: string,
  light: string,
  dark: string,
  background: string,
): FlagScene {
  const shortest = Math.min(width, height);
  const length = shortest * 0.98;
  const cloth = length * 0.36;

  const sheet = document.createElement("canvas");
  sheet.width = Math.max(1, Math.round(length));
  sheet.height = Math.max(1, Math.round(cloth));
  const paint = sheet.getContext("2d");
  if (!paint) return { texture: sheet, length, cloth, background };

  const rowHeight = sheet.height / flagStripes;
  const fontSize = rowHeight * 0.6;
  const spaced = paint as CanvasRenderingContext2D & { letterSpacing?: string };
  paint.font = `600 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  spaced.letterSpacing = `${fontSize * 0.16}px`;
  paint.textBaseline = "middle";

  const unit = `${text.toUpperCase()}    `;
  const unitWidth = Math.max(paint.measureText(unit).width, 1);

  for (let row = 0; row < flagStripes; row += 1) {
    const top = row * rowHeight;
    const inverted = row % 2 === 1;
    paint.fillStyle = inverted ? dark : light;
    paint.fillRect(0, top, sheet.width, rowHeight + 1);
    paint.fillStyle = inverted ? light : dark;
    const start = -(((row * unitWidth) / 3) % unitWidth);
    for (let x = start; x < sheet.width; x += unitWidth) {
      paint.fillText(unit, x, top + rowHeight / 2);
    }
  }

  return { texture: sheet, length, cloth, background };
}

function paintFlag(context: CanvasRenderingContext2D, width: number, height: number, time: number, scene: FlagScene) {
  const { texture, length, cloth, background } = scene;

  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  // Edges of the cloth at a given point along its length.
  const edgesAt = (x: number) => {
    const phase = (x / length) * Math.PI * 3.1 - time * 2.1;
    const damping = 0.18 + 0.82 * (x / length);
    const shift = Math.sin(phase) * cloth * 0.34 * damping;
    const drawn = cloth * (1 + Math.cos(phase) * 0.24 * damping);
    return { top: -drawn / 2 + shift, bottom: drawn / 2 + shift };
  };

  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(-0.85);

  // The silhouette is clipped to the true envelope so the outline stays smooth
  // against any background; the column slices only have to cover it.
  const outline = 360;
  context.beginPath();
  for (let i = 0; i <= outline; i += 1) {
    const x = (i / outline) * length;
    const { top } = edgesAt(x);
    if (i === 0) context.moveTo(x - length / 2, top);
    else context.lineTo(x - length / 2, top);
  }
  for (let i = outline; i >= 0; i -= 1) {
    const x = (i / outline) * length;
    context.lineTo(x - length / 2, edgesAt(x).bottom);
  }
  context.closePath();
  context.clip();

  // A fixed slice count keeps the cost constant across screen densities;
  // the wave is low-frequency, so 240 samples read as a smooth cloth.
  const step = length / 240;
  for (let x = 0; x < length; x += step) {
    const near = edgesAt(x);
    const far = edgesAt(Math.min(x + step, length));
    const top = Math.min(near.top, far.top);
    const bottom = Math.max(near.bottom, far.bottom);
    context.drawImage(texture, x, 0, step, texture.height, x - length / 2, top, step + 0.8, bottom - top);
  }

  context.restore();
}

function flagFileName(text: string) {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `bandeira-${slug || "sem-titulo"}`;
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function supportedVideoType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    'video/mp4;codecs="avc1.42E01E"',
    "video/mp4",
    'video/webm;codecs="vp9"',
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

type FlagExport = "png" | "jpg" | "gif" | "video";

function FlagPoem({
  placeholder,
  copy,
}: {
  placeholder: string;
  copy: (typeof creationsCopy)["pt"]["interactive"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phrase, setPhrase] = useState("");
  const [light, setLight] = useState("#ffffff");
  const [dark, setDark] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [busy, setBusy] = useState<FlagExport | null>(null);
  const styleRef = useRef({ phrase, light, dark, background });
  const reduceMotion = useReducedMotion();
  const videoType = useMemo(supportedVideoType, []);
  const videoExtension = videoType?.startsWith("video/mp4") ? "mp4" : "webm";

  useEffect(() => {
    styleRef.current = { phrase, light, dark, background };
  }, [phrase, light, dark, background]);

  const currentText = () => (styleRef.current.phrase.trim() || placeholder).slice(0, 42);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let scene: FlagScene | null = null;
    let sceneKey = "";
    let frame = 0;
    let visible = true;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "150px 0px" },
    );
    visibility.observe(canvas);

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;

      const { light: lightNow, dark: darkNow, background: backgroundNow } = styleRef.current;
      const text = currentText();
      const key = `${text}|${lightNow}|${darkNow}|${backgroundNow}|${canvas.width}x${canvas.height}`;
      if (key !== sceneKey) {
        scene = createFlagScene(canvas.width, canvas.height, text, lightNow, darkNow, backgroundNow);
        sceneKey = key;
      }
      if (!scene) return;

      paintFlag(context, canvas.width, canvas.height, reduceMotion ? 1.15 : performance.now() / 1000, scene);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, reduceMotion]);

  const exportStill = async (kind: "png" | "jpg") => {
    const width = 1600;
    const height = 1400;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    const { light: lightNow, dark: darkNow, background: backgroundNow } = styleRef.current;
    const text = currentText();
    paintFlag(context, width, height, 1.15, createFlagScene(width, height, text, lightNow, darkNow, backgroundNow));
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, kind === "png" ? "image/png" : "image/jpeg", 0.92),
    );
    if (blob) saveBlob(blob, `${flagFileName(text)}.${kind}`);
  };

  const exportGif = async () => {
    const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
    const width = 560;
    const height = 490;
    const fps = 16;
    const total = Math.round(flagPeriod * fps);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const { light: lightNow, dark: darkNow, background: backgroundNow } = styleRef.current;
    const text = currentText();
    const scene = createFlagScene(width, height, text, lightNow, darkNow, backgroundNow);
    const encoder = GIFEncoder();
    const delay = Math.round(1000 / fps);
    let palette: number[][] | null = null;

    for (let index = 0; index < total; index += 1) {
      paintFlag(context, width, height, (index / total) * flagPeriod, scene);
      const { data } = context.getImageData(0, 0, width, height);
      if (!palette) palette = quantize(data, 32);
      encoder.writeFrame(applyPalette(data, palette), width, height, {
        palette,
        delay,
        ...(index === 0 ? { repeat: 0 } : {}),
      });
      if (index % 6 === 5) await new Promise((resolve) => window.setTimeout(resolve, 0));
    }

    encoder.finish();
    saveBlob(new Blob([encoder.bytes() as BlobPart], { type: "image/gif" }), `${flagFileName(text)}.gif`);
  };

  const exportVideo = async () => {
    if (!videoType) return;
    const width = 800;
    const height = 700;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;

    const { light: lightNow, dark: darkNow, background: backgroundNow } = styleRef.current;
    const text = currentText();
    const scene = createFlagScene(width, height, text, lightNow, darkNow, backgroundNow);
    paintFlag(context, width, height, 0, scene);

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: videoType, videoBitsPerSecond: 6000000 });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    const finished = new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: videoType }));
    });

    recorder.start();
    const startedAt = performance.now();
    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(watchdog);
        resolve();
      };
      // requestAnimationFrame stops in a backgrounded tab, so a wall-clock
      // watchdog guarantees the recorder is always released.
      const watchdog = window.setTimeout(finish, flagPeriod * 1000 + 2500);
      const tick = () => {
        const elapsed = (performance.now() - startedAt) / 1000;
        paintFlag(context, width, height, elapsed, scene);
        if (elapsed < flagPeriod) requestAnimationFrame(tick);
        else finish();
      };
      requestAnimationFrame(tick);
    });
    if (recorder.state !== "inactive") recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    saveBlob(await finished, `${flagFileName(text)}.${videoExtension}`);
  };

  const runExport = async (kind: FlagExport) => {
    if (busy) return;
    setBusy(kind);
    try {
      if (kind === "png" || kind === "jpg") await exportStill(kind);
      else if (kind === "gif") await exportGif();
      else await exportVideo();
    } finally {
      setBusy(null);
    }
  };

  const exports: Array<{ kind: FlagExport; label: string }> = [
    { kind: "png", label: "PNG" },
    { kind: "jpg", label: "JPG" },
    { kind: "gif", label: "GIF" },
    ...(videoType ? [{ kind: "video" as FlagExport, label: videoExtension.toUpperCase() }] : []),
  ];

  return (
    <figure className="live-poem">
      <canvas ref={canvasRef} className="live-canvas is-flag" role="img" aria-label={copy.flagAria} />
      <figcaption className="live-controls">
        <div className="live-field">
          <label htmlFor="flag-phrase">{copy.flagInput}</label>
          <input
            id="flag-phrase"
            type="text"
            value={phrase}
            maxLength={42}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setPhrase(event.target.value)}
          />
        </div>

        <div className="live-colours">
          <label>
            <input type="color" value={light} onChange={(event) => setLight(event.target.value)} />
            <span>{copy.flagLight}</span>
          </label>
          <label>
            <input type="color" value={dark} onChange={(event) => setDark(event.target.value)} />
            <span>{copy.flagDark}</span>
          </label>
          <label>
            <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
            <span>{copy.flagBackground}</span>
          </label>
          <button
            type="button"
            className="live-reset"
            onClick={() => {
              setLight("#ffffff");
              setDark("#000000");
              setBackground("#ffffff");
            }}
          >
            {copy.flagReset}
          </button>
        </div>

        <div className="live-exports">
          <span className="live-exports-label">{busy ? copy.flagExporting : copy.flagExport}</span>
          <div className="live-exports-row">
            {exports.map(({ kind, label }) => (
              <button
                key={kind}
                type="button"
                disabled={busy !== null}
                className={`live-export-button ${busy === kind ? "is-busy" : ""}`}
                onClick={() => void runExport(kind)}
              >
                <Download size={13} /> {label}
              </button>
            ))}
          </div>
          <small>{copy.flagHint}</small>
        </div>
      </figcaption>
    </figure>
  );
}
