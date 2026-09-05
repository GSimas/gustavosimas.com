import { useEffect, useMemo, useRef, useState } from 'react';
import { cleanMosaicWord, mosaicMaxChars, mosaicTargets, mosaicView } from './mosaic';
import { buildMosaicLayout, mosaicStencilFont, mosaicTileFont, paintMosaic, type MosaicLayout, type MosaicMode } from './mosaic-renderer';

interface MosaicCopy {
  mosaicStencil: string; mosaicTile: string;
  mosaicStencilPlaceholder: string; mosaicTilePlaceholder: string;
  mosaicMode: string; mosaicModeFlow: string; mosaicModeWhole: string;
  mosaicHint: string; mosaicAria: string;
  mosaicOverview: string; mosaicReading: string; mosaicReadingHint: string;
}

export function MosaicPoem({ copy }: { copy: MosaicCopy }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [stencil, setStencil] = useState('');
  const [tile, setTile] = useState('');
  const [mode, setMode] = useState<MosaicMode>('flow');
  const [reading, setReading] = useState(false);
  const [layout, setLayout] = useState<MosaicLayout | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1, ratio: 1 });
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    // The installed Motion hook snapshots this preference at mount. Listen here
    // so changing the OS setting also pauses an already-running poem.
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const words = useMemo(() => ({
    stencil: cleanMosaicWord(stencil, copy.mosaicStencilPlaceholder),
    tile: cleanMosaicWord(tile, copy.mosaicTilePlaceholder),
  }), [stencil, tile, copy.mosaicStencilPlaceholder, copy.mosaicTilePlaceholder]);

  useEffect(() => {
    let disposed = false;
    let timer = 0;
    const rebuild = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!disposed) setLayout(buildMosaicLayout(words.stencil, words.tile));
      }, 80);
    };
    rebuild();
    // Redraw static/reduced-motion compositions too when a late font arrives.
    void Promise.allSettled([
      document.fonts.load(mosaicStencilFont(100), words.stencil),
      document.fonts.load(mosaicTileFont(100), words.tile),
    ]).then(() => { if (!disposed) rebuild(); });
    document.fonts.addEventListener('loadingdone', rebuild);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      document.fonts.removeEventListener('loadingdone', rebuild);
    };
  }, [words]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const resize = () => setDimensions({
      width: Math.max(1, viewport.clientWidth),
      height: Math.max(1, viewport.clientHeight),
      ratio: Math.min(3, window.devicePixelRatio || 1),
    });
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    window.addEventListener('resize', resize);
    resize();
    return () => { observer.disconnect(); window.removeEventListener('resize', resize); };
  }, []);

  const tileSize = layout ? (mode === 'whole' ? layout.size : layout.flowSize) : 14;
  const view = mosaicView(dimensions.width, dimensions.height, tileSize, reading);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !layout) return;
    // Begin at the first printed word, not in a magnified empty margin.
    const first = layout.cells[0];
    const frame = requestAnimationFrame(() => {
      // Firefox can otherwise clamp the scroll against the previous spacer size.
      viewport.firstElementChild?.getBoundingClientRect();
      viewport.scrollTo({
        left: reading ? Math.max(0, (first ? first.x - layout.cell / 2 : layout.inkLeft) * view.scale - 24) : 0,
        top: reading ? Math.max(0, (first ? first.y - layout.rowHeight / 2 : layout.inkTop) * view.scale - 24) : 0,
        behavior: 'instant',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [reading, layout, mode, view.scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !viewport || !context || !layout) return;
    const { width, height, ratio } = dimensions;
    // Only the visible viewport gets a backing store, even at the largest zoom.
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    let frame = 0;
    let visible = true;
    let drift = 0;
    let previous = performance.now();
    const animate = mode === 'flow' && !reduceMotion && !reading;
    const draw = (now: number) => {
      frame = 0;
      if (!visible) return;
      if (animate) drift += Math.min(0.05, (now - previous) / 1000) * 16;
      previous = now;
      paintMosaic(context, layout, mode, {
        ...dimensions, scale: view.scale,
        left: viewport.scrollLeft - (view.width - mosaicTargets.width * view.scale) / 2,
        top: viewport.scrollTop - (view.height - mosaicTargets.height * view.scale) / 2,
      }, drift);
      if (animate) frame = requestAnimationFrame(draw);
    };
    const invalidate = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previous = performance.now();
      if (visible) invalidate();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(viewport);
    viewport.addEventListener('scroll', invalidate, { passive: true });
    invalidate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener('scroll', invalidate);
    };
  }, [layout, mode, reading, reduceMotion, dimensions, view.scale, view.width, view.height]);

  return (
    <figure className="live-poem mosaic-poem">
      <div ref={viewportRef} className={`mosaic-viewport${reading ? ' is-reading' : ''}`}
        tabIndex={reading ? 0 : undefined} role="region" aria-label={reading ? copy.mosaicReadingHint : copy.mosaicAria}
        onKeyDown={(event) => {
          if (!reading || event.altKey || event.ctrlKey || event.metaKey) return;
          const viewport = event.currentTarget;
          const step = Math.max(40, viewport.clientWidth * 0.12);
          const movement: Record<string, [number, number]> = {
            ArrowLeft: [-step, 0], ArrowRight: [step, 0],
            ArrowUp: [0, -step], ArrowDown: [0, step],
            PageUp: [0, -viewport.clientHeight * 0.85], PageDown: [0, viewport.clientHeight * 0.85],
          };
          const delta = movement[event.key];
          if (delta) {
            event.preventDefault();
            viewport.scrollBy({ left: delta[0], top: delta[1], behavior: 'instant' });
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            viewport.scrollTo({
              left: event.key === 'Home' ? 0 : viewport.scrollWidth,
              top: event.key === 'Home' ? 0 : viewport.scrollHeight,
              behavior: 'instant',
            });
          }
        }}>
        <div className="mosaic-space" style={{ width: view.width, height: view.height }}>
          <canvas ref={canvasRef} className="live-canvas is-mosaic" role="img"
            style={{ width: dimensions.width, height: dimensions.height }}
            data-tile-size={tileSize * view.scale} data-ready={Boolean(layout)}
            aria-label={`${copy.mosaicStencil}: ${words.stencil}. ${copy.mosaicTile}: ${words.tile}. ${mode === 'whole' ? copy.mosaicModeWhole : copy.mosaicModeFlow}.`} />
        </div>
      </div>
      <figcaption className="live-controls">
        <div className="mosaic-reading-bar">
          <p className="mosaic-pair" aria-live="polite" aria-atomic="true">
            <span>{copy.mosaicStencil}: <strong>{words.stencil}</strong></span>
            <span>{copy.mosaicTile}: <strong>{words.tile}</strong></span>
          </p>
          <div className="mosaic-modes" role="group" aria-label={copy.mosaicReading}>
            <button type="button" className="live-reset" aria-pressed={!reading} onClick={() => setReading(false)}>{copy.mosaicOverview}</button>
            <button type="button" className="live-reset" aria-pressed={reading} onClick={() => setReading(true)}>{copy.mosaicReading}</button>
          </div>
        </div>
        {reading && <small className="mosaic-reading-hint">{copy.mosaicReadingHint}</small>}
        <div className="mosaic-fields">
          <div className="live-field">
            <label htmlFor="mosaic-stencil">{copy.mosaicStencil}</label>
            <input id="mosaic-stencil" type="text" value={stencil} placeholder={copy.mosaicStencilPlaceholder}
              autoComplete="off" spellCheck={false}
              onChange={(event) => setStencil(Array.from(event.target.value.normalize('NFC')).slice(0, mosaicMaxChars).join(''))} />
          </div>
          <div className="live-field">
            <label htmlFor="mosaic-tile">{copy.mosaicTile}</label>
            <input id="mosaic-tile" type="text" value={tile} placeholder={copy.mosaicTilePlaceholder}
              autoComplete="off" spellCheck={false}
              onChange={(event) => setTile(Array.from(event.target.value.normalize('NFC')).slice(0, mosaicMaxChars).join(''))} />
          </div>
        </div>
        <div className="mosaic-modes" role="group" aria-label={copy.mosaicMode}>
          {(['flow', 'whole'] as const).map((option) => (
            <button key={option} type="button" className="live-reset" aria-pressed={mode === option} onClick={() => setMode(option)}>
              {option === 'flow' ? copy.mosaicModeFlow : copy.mosaicModeWhole}
            </button>
          ))}
        </div>
        <small className="gravity-hint">{copy.mosaicHint}</small>
      </figcaption>
    </figure>
  );
}
