import { lazy, startTransition, Suspense, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { AtlasBackground } from "./AtlasBackground";
import { ErrorBoundary } from "./ErrorBoundary";
import { SectionMarker } from "./SectionMarker";
import { Tavo } from "./Tavo";

// The CV and the creations lab are their own chunks: the home page no longer
// downloads them, and once the browser is idle they are fetched in advance so
// following a link to either still feels instant.
const loadCurriculum = () => import("./Curriculum");
const loadCreations = () => import("./Creations");
const Curriculum = lazy(loadCurriculum);
const Creations = lazy(loadCreations);
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Contrast,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Library,
  Linkedin,
  Menu,
  Moon,
  Music2,
  Network,
  Palette,
  Search,
  Sparkles,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import {
  projects,
  projectTranslationsEn,
  categoryLabels,
  highlightPublications,
  portfolioCopy,
  type Category,
  type Language,
  type Project,
} from "./content";

// Pages of the portfolio roll sideways: the one leaving slides out the way the
// reader is heading, the one arriving comes in from the opposite edge.
const projectPageRoll = {
  enter: (direction: number) => ({ x: direction === 0 ? 0 : direction > 0 ? "100%" : "-100%", opacity: 0 }),
  settled: { x: 0, opacity: 1 },
  leave: (direction: number) => ({ x: direction === 0 ? 0 : direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

function getInitialLanguage(): Language {
  const saved = localStorage.getItem("language");
  if (saved === "pt" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/$/, ""));
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const onLocationChange = () => {
      startTransition(() => setCurrentPath(window.location.pathname.replace(/\/$/, "")));
    };
    window.addEventListener("popstate", onLocationChange);
    const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 2000));
    idle(() => {
      void loadCurriculum();
      void loadCreations();
    });
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    localStorage.setItem("language", language);
  }, [language]);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    // A transition keeps the current page on screen until the next one's
    // chunk is ready, instead of flashing an empty fallback.
    startTransition(() => setCurrentPath(path.replace(/\/$/, "")));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Page = currentPath === "/curriculo" ? Curriculum : currentPath === "/criacoes" ? Creations : Portfolio;

  return (
    <>
      {/* WCAG 2.4.1: keyboard users can jump past the header straight to the page. */}
      <a
        className="skip-link"
        href="#conteudo"
        onClick={(event) => {
          event.preventDefault();
          const main = document.querySelector("main");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
        }}
      >
        {language === "pt" ? "Pular para o conteúdo" : "Skip to content"}
      </a>
      <ErrorBoundary fallback={null} label="background">
        <AtlasBackground />
      </ErrorBoundary>
      <ErrorBoundary resetKey={currentPath} onRetry={() => window.location.reload()} label="page">
        <Suspense fallback={null}>
          <Page navigate={navigate} language={language} setLanguage={setLanguage} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={null} label="tavo">
        <Tavo language={language} navigate={navigate} />
      </ErrorBoundary>
    </>
  );
}

function Portfolio({
  navigate,
  language,
  setLanguage,
}: {
  navigate: (path: string) => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}) {
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("theme") as "dark" | "light") || "dark");
  const [contrast, setContrast] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const storedStep = Number(localStorage.getItem("font-size-step"));
    return Number.isInteger(storedStep) ? Math.min(3, Math.max(0, storedStep)) : 0;
  });
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState<"Todos" | Category>("Todos");
  const [projectPage, setProjectPage] = useState(0);
  // Which way the pages roll: +1 forwards, -1 back, 0 when the list itself
  // changed under the reader and there is nothing to roll away from.
  const [projectDirection, setProjectDirection] = useState(0);
  // Cards per row, as the grid itself lays them out: three at full width, two
  // from 1100px down, one on a phone.
  const [projectColumns, setProjectColumns] = useState(3);
  const [projectSearch, setProjectSearch] = useState("");
  // The field echoes every keystroke at once; the grid catches up at low
  // priority, so typing never waits on cards re-rendering.
  const deferredSearch = useDeferredValue(projectSearch);
  const copy = portfolioCopy[language];
  const isPt = language === "pt";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("high-contrast", contrast);
    document.documentElement.style.setProperty("--font-scale", String(1 + fontSize * 0.1));
    localStorage.setItem("theme", theme);
    localStorage.setItem("font-size-step", String(fontSize));
  }, [theme, contrast, fontSize]);

  const visibleProjects = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = filter === "Todos" || project.category === filter;
      if (!matchesCategory) return false;
      if (!q) return true;

      const trans = language === "en" ? projectTranslationsEn[project.title] : undefined;
      const title = trans?.title || project.title;
      const desc = trans?.description || project.description;
      const cat = categoryLabels[language][project.category];
      const origCat = project.category;

      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.year.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        origCat.toLowerCase().includes(q)
      );
    });
  }, [filter, deferredSearch, language]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1101px)");
    const medium = window.matchMedia("(min-width: 821px)");
    const read = () => setProjectColumns(wide.matches ? 3 : medium.matches ? 2 : 1);
    read();
    wide.addEventListener("change", read);
    medium.addEventListener("change", read);
    return () => {
      wide.removeEventListener("change", read);
      medium.removeEventListener("change", read);
    };
  }, []);

  // Two rows per page. The grid is twelve columns wide and a featured card takes
  // six of them against a normal card's four, so the pages are packed the way
  // the grid itself wraps — by columns, not by how many cards there are — which
  // is what keeps every page exactly two rows tall.
  const projectPages = useMemo(() => {
    const span = (project: Project) => {
      if (projectColumns === 1) return 12;
      if (projectColumns === 2) return 6;
      return project.featured ? 6 : 4;
    };
    const pages: Project[][] = [];
    let current: Project[] = [];
    let rows = 0;
    let used = 0;
    for (const project of visibleProjects) {
      const cost = span(project);
      if (used + cost > 12) {
        rows += 1;
        used = 0;
      }
      if (rows >= 2) {
        pages.push(current);
        current = [];
        rows = 0;
      }
      current.push(project);
      used += cost;
    }
    if (current.length) pages.push(current);
    return pages;
  }, [visibleProjects, projectColumns]);

  const projectPageCount = Math.max(1, projectPages.length);
  const currentProjectPage = Math.min(projectPage, projectPageCount - 1);
  const pagedProjects = projectPages[currentProjectPage] ?? [];

  // A new filter or search starts its results from the top, without rolling.
  useEffect(() => {
    setProjectPage(0);
    setProjectDirection(0);
  }, [filter, deferredSearch, projectColumns]);

  const turnProjectPage = (to: number) => {
    setProjectDirection(to > currentProjectPage ? 1 : -1);
    setProjectPage(to);
  };

  const navigation: Array<{ label: string; href: string; isRoute?: boolean }> = [
    { label: copy.nav[0], href: "#manifesto" },
    { label: copy.nav[1], href: "#trabalhos" },
    { label: copy.nav[2], href: "#trajetoria" },
    { label: copy.nav[3], href: "/curriculo", isRoute: true },
    { label: copy.nav[4], href: "/criacoes", isRoute: true },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#top" aria-label={copy.header.brandAria}>
            <span className="brand-mark">GS</span>
            <span>
              <strong>Gustavo Simas</strong>
              <small>{copy.brandTagline}</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label={copy.header.navAria}>
            {navigation.map(({ label, href, isRoute }) =>
              isRoute ? (
                <a
                  key={href}
                  href={href}
                  className="nav-highlight"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(href);
                  }}
                >
                  {label}
                </a>
              ) : (
                <a key={href} href={href}>
                  {label}
                </a>
              ),
            )}
          </nav>
          <div className="header-actions" aria-label={copy.header.preferencesAria}>
            <button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={copy.header.theme}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <button className="icon-button" onClick={() => setContrast(!contrast)} aria-pressed={contrast} aria-label={copy.header.contrast}>
              <Contrast />
            </button>
            <button
              className="language-toggle"
              onClick={() => setLanguage(isPt ? "en" : "pt")}
              aria-label={copy.header.language}
              title={copy.header.language}
            >
              <span className={isPt ? "active" : ""}>PT</span>
              <span aria-hidden="true">/</span>
              <span className={!isPt ? "active" : ""}>EN</span>
            </button>
            <button
              className="icon-button text-size-button"
              onClick={() => setFontSize((current) => Math.max(0, current - 1))}
              disabled={fontSize === 0}
              aria-label={copy.header.decreaseText}
              title={copy.header.decreaseText}
            >
              -T
            </button>
            <button
              className="icon-button text-size-button"
              onClick={() => setFontSize((current) => Math.min(3, current + 1))}
              disabled={fontSize === 3}
              aria-label={copy.header.increaseText}
              title={copy.header.increaseText}
            >
              +T
            </button>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? copy.header.closeMenu : copy.header.menu}
              aria-expanded={menu}
              aria-controls="mobile-nav"
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
          <AnimatePresence>
            {menu && (
              <m.nav id="mobile-nav" className="mobile-nav" aria-label={copy.header.navAria} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {navigation.map(({ label, href, isRoute }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => {
                      setMenu(false);
                      if (isRoute) {
                        e.preventDefault();
                        navigate(href);
                      }
                    }}
                  >
                    {label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </m.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="signal" /> {copy.hero.location}
            </p>
            <m.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
              {copy.hero.line1}
              <br />
              <em>{copy.hero.emphasis}</em>
              <br />
              {copy.hero.line3}
            </m.h1>
            <p className="hero-lede">{copy.hero.lede}</p>
            <div className="hero-actions">
              <a className="button primary" href="#trabalhos">
                {copy.hero.explore} <ArrowDown size={16} />
              </a>
              <button
                className="button ghost"
                onClick={() => navigate("/curriculo")}
              >
                {copy.hero.cv} <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <Atlas copy={copy.atlas} />
          <div className="hero-index">
            {copy.hero.index.map((item, index) => (
              <span key={item}>{String(index + 1).padStart(2, "0")} — {item}</span>
            ))}
          </div>
        </section>

        {/* MANIFESTO SECTION */}
        <section id="manifesto" className="manifesto section-wrap section-spacing">
          <SectionMarker number="01" label={copy.manifesto.label} />
          <div className="manifesto-grid">
            <blockquote>
              {copy.manifesto.before}<em>{copy.manifesto.emphasis}</em>.
            </blockquote>
            <div>
              <p>{copy.manifesto.first}</p>
              <p>{copy.manifesto.second}</p>
              <a href="#eixos" className="text-link">
                {copy.manifesto.link} <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* EIXOS SECTION */}
        <section id="eixos" className="section-wrap section-spacing">
          <div className="section-heading">
            <div>
              <SectionMarker number="02" label={copy.axes.label} />
              <h2>
                {copy.axes.title1}
                <br />
                <em>{copy.axes.title2}</em>
              </h2>
            </div>
            <p>{copy.axes.subtitle}</p>
          </div>
          <div className="axis-grid">
            <AxisCard
              number="01"
              icon={<Search />}
              title={copy.axes.cards[0].title}
              description={copy.axes.cards[0].description}
              tags={copy.axes.cards[0].tags}
            />
            <AxisCard
              number="02"
              icon={<BrainCircuit />}
              title={copy.axes.cards[1].title}
              description={copy.axes.cards[1].description}
              tags={copy.axes.cards[1].tags}
            />
            <AxisCard
              number="03"
              icon={<Sparkles />}
              title={copy.axes.cards[2].title}
              description={copy.axes.cards[2].description}
              tags={copy.axes.cards[2].tags}
            />
          </div>
        </section>

        {/* PORTFOLIO / TRABALHOS */}
        <section id="trabalhos" className="works-section section-spacing">
          <div className="section-wrap">
            <div className="section-heading compact">
              <div>
                <SectionMarker number="03" label={copy.portfolio.label} />
                <h2>
                  {copy.portfolio.title1}
                  <br />
                  <em>{copy.portfolio.title2}</em>
                </h2>
              </div>
              <p>{copy.portfolio.subtitle}</p>
            </div>
            <div className="portfolio-controls">
              <div className="filters" role="group" aria-label={copy.portfolio.filterAria}>
                {(["Todos", "Pesquisa", "Tecnologia", "Literatura", "Audiovisual", "Jogos"] as const).map((item) => (
                  <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                    {categoryLabels[language][item]}
                  </button>
                ))}
              </div>
              <div className="project-search-box">
                <Search size={14} />
                <input
                  type="text"
                  placeholder={copy.portfolio.searchPlaceholder}
                  aria-label={copy.portfolio.searchAria}
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                />
                {projectSearch && (
                  <button
                    className="project-search-clear"
                    onClick={() => setProjectSearch("")}
                    aria-label={isPt ? "Limpar busca" : "Clear search"}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="project-viewport">
              <AnimatePresence initial={false} mode="popLayout" custom={projectDirection}>
                <m.div
                  key={currentProjectPage}
                  className="project-grid"
                  custom={projectDirection}
                  variants={projectPageRoll}
                  initial="enter"
                  animate="settled"
                  exit="leave"
                  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {pagedProjects.map((project) => (
                    <ProjectCard key={project.title} project={project} language={language} />
                  ))}
                </m.div>
              </AnimatePresence>
            </div>
            {visibleProjects.length === 0 && (
              <div className="portfolio-empty-state">
                <p>{copy.portfolio.noResults}</p>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => {
                    setFilter("Todos");
                    setProjectSearch("");
                  }}
                >
                  {isPt ? "Limpar filtros e busca" : "Clear filters and search"}
                </button>
              </div>
            )}
            {projectPageCount > 1 ? (
              <nav className="poem-pager" aria-label={copy.portfolio.pagerAria}>
                <button
                  type="button"
                  onClick={() => turnProjectPage(currentProjectPage - 1)}
                  disabled={currentProjectPage === 0}
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                  {copy.portfolio.previous}
                </button>
                <span aria-live="polite">
                  {copy.portfolio.page} {currentProjectPage + 1} {copy.portfolio.pageOf} {projectPageCount}
                </span>
                <button
                  type="button"
                  onClick={() => turnProjectPage(currentProjectPage + 1)}
                  disabled={currentProjectPage >= projectPageCount - 1}
                >
                  {copy.portfolio.next}
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </nav>
            ) : null}
          </div>
        </section>

        {/* MÚSICA & ÁUDIO SECTION */}
        <section id="musica" className="section-wrap section-spacing">
          <div className="sound-card">
            <div className="sound-wave" aria-hidden="true">
              {Array.from({ length: 54 }, (_, i) => (
                <span key={i} style={{ height: `${18 + ((i * 37) % 88)}%` }} />
              ))}
            </div>
            <div className="sound-content">
              <span className="eyebrow">
                <Volume2 size={14} /> {copy.audio.kicker}
              </span>
              <h2>
                {copy.audio.title1}
                <br />
                {copy.audio.title2}
                <br />
                <em>{copy.audio.title3}</em>
              </h2>
              <p>{copy.audio.description}</p>
              <div className="sound-links">
                <a className="button primary" href="https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz" target="_blank" rel="noreferrer">
                  {copy.audio.spotify} <ArrowUpRight size={15} />
                </a>
                <a className="button ghost" href="https://instagram.com/brasil.wav" target="_blank" rel="noreferrer">
                  {copy.audio.berim} <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="album-stack" aria-label={copy.audio.projectsAria}>
              <div className="album-card image" title="Rancho de Amor à Ilha">
                <img src="/assets/ranchodoamor.jpg" alt={copy.audio.ranchAlt} loading="lazy" decoding="async" />
                <span className="album-tag-overlay">Rancho de Amor à Ilha</span>
              </div>
              <div className="album-card image-berim" title="Berimbrasil">
                <img src="/assets/berimbrasil.jpg" alt={copy.audio.berimAlt} loading="lazy" decoding="async" />
                <span className="album-tag-overlay">Berimbrasil</span>
              </div>
              <div className="album-card violet">
                <small>{copy.audio.production}</small>
                <strong>GS</strong>
                <span>Gustavo Simas</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRAJETÓRIA */}
        <section id="trajetoria" className="section-wrap section-spacing">
          <div className="section-heading">
            <div>
              <SectionMarker number="04" label={copy.trajectory.label} />
              <h2>
                {copy.trajectory.title1}
                <br />
                <em>{copy.trajectory.title2}</em>
              </h2>
            </div>
            <p>{copy.trajectory.subtitle}</p>
          </div>
          <div className="trajectory-grid">
            <aside className="portrait-panel">
              <div className="portrait-frame">
                <img src="/assets/fotoperf.jpeg" alt={copy.trajectory.portraitAlt} loading="lazy" decoding="async" />
                <div className="portrait-caption">
                  <span>Gustavo Simas</span>
                  <span>{copy.trajectory.location}</span>
                </div>
              </div>
              <div className="credentials">
                {copy.trajectory.badges.map((badge) => <span key={badge}>{badge}</span>)}
              </div>
            </aside>
            <div className="timeline">
              {copy.trajectory.timeline.map((item) => (
                <Timeline key={`${item.year}-${item.title}`} year={item.year} title={item.title} text={item.text} />
              ))}
            </div>
          </div>
        </section>

        {/* PESQUISA E PUBLICAÇÃO (CONHECER EM RELAÇÃO) */}
        <section id="publicacoes" className="research-section section-spacing">
          <div className="section-wrap research-grid">
            <div className="research-intro">
              <SectionMarker number="05" label={copy.research.label} />
              <h2>
                {copy.research.title1}
                <br />
                <em>{copy.research.title2}</em>
              </h2>
              <p>{copy.research.description}</p>
              <div className="research-links">
                <a className="text-link" href="https://orcid.org/0000-0003-3485-7910" target="_blank" rel="noreferrer">
                  {copy.research.orcid} <ArrowUpRight size={14} />
                </a>
                <a className="text-link" href="http://lattes.cnpq.br/3423329196677574" target="_blank" rel="noreferrer">
                  {copy.research.lattes} <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <ol className="publication-list">
              {highlightPublications.map((item, i) => {
                const title = isPt ? item.title : item.titleEn;
                const source = isPt ? item.source : item.sourceEn;
                return (
                <li key={item.link}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="publication-item-link"
                    title={`${copy.research.open}: ${title}`}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p>{title}</p>
                      <small className="pub-meta">
                        {source} · {item.year}
                      </small>
                    </div>
                    <ArrowUpRight size={16} />
                  </a>
                </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* CAPACIDADES */}
        <section className="section-wrap section-spacing">
          <div className="section-heading compact">
            <div>
              <SectionMarker number="06" label={copy.capabilities.label} />
              <h2>
                {copy.capabilities.title1}
                <br />
                <em>{copy.capabilities.title2}</em>
              </h2>
            </div>
          </div>
          <div className="capability-grid">
            {copy.capabilities.cards.map((card, index) => (
              <Capability
                key={card.title}
                number={String(index + 1).padStart(2, "0")}
                title={card.title}
                items={card.items}
              />
            ))}
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="contact-section section-wrap section-spacing">
          <div className="contact-card">
            <span className="contact-kicker">
              <span className="signal" /> {copy.contact.kicker}
            </span>
            <h2>
              {copy.contact.title1}
              <br />
              <em>{copy.contact.title2}</em>
              <br />
              {copy.contact.title3}
            </h2>
            <a className="contact-email" href="mailto:contato@gustavosimas.com">
              contato@gustavosimas.com <ArrowUpRight />
            </a>
            <div className="contact-footer">
              <p>{copy.contact.description}</p>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/simasgs/" target="_blank" rel="noreferrer">
                  <Linkedin /> LinkedIn
                </a>
                <a href="http://lattes.cnpq.br/3423329196677574" target="_blank" rel="noreferrer">
                  <Library /> Lattes
                </a>
                <a href="https://orcid.org/0000-0003-3485-7910" target="_blank" rel="noreferrer">
                  <Globe /> ORCID
                </a>
                <a href="https://github.com/GSimas" target="_blank" rel="noreferrer">
                  <Github /> GitHub
                </a>
                <a href="https://instagram.com/tudoemsimas" target="_blank" rel="noreferrer">
                  <Instagram /> Instagram
                </a>
                <a href="https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz" target="_blank" rel="noreferrer">
                  <Music2 /> Spotify
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a className="brand" href="#top">
          <span className="brand-mark">GS</span>
          <span>
            <strong>Gustavo Simas</strong>
            <small>{copy.footer.location}</small>
          </span>
        </a>
        <p>{copy.footer.text}</p>
        <a href="#top">
          {copy.footer.top} <ArrowUpRight size={13} />
        </a>
      </footer>
    </div>
  );
}

function Atlas({ copy }: { copy: (typeof portfolioCopy)[Language]["atlas"] }) {
  return (
    <m.div className="hero-atlas" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} aria-label={copy.aria}>
      <div className="atlas-orbit orbit-a" />
      <div className="atlas-orbit orbit-b" />
      <div className="atlas-core">
        <Network size={34} />
        <span>{copy.core}</span>
      </div>
      <div className="atlas-node node-a">
        <Search />
        <span>{copy.nodes[0]}</span>
      </div>
      <div className="atlas-node node-b">
        <BrainCircuit />
        <span>{copy.nodes[1]}</span>
      </div>
      <div className="atlas-node node-c">
        <Palette />
        <span>{copy.nodes[2]}</span>
      </div>
      <span className="coordinate top">27°35&apos;S</span>
      <span className="coordinate bottom">48°32&apos;W</span>
    </m.div>
  );
}

function AxisCard({
  number,
  icon,
  title,
  description,
  tags,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: readonly string[];
}) {
  return (
    <m.article className="axis-card" whileHover={{ y: -8 }}>
      <div className="axis-top">
        <span>{number}</span>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tag-list">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </m.article>
  );
}

function ProjectCard({ project, language }: { project: Project; language: Language }) {
  const translation = language === "en" ? projectTranslationsEn[project.title] : undefined;
  const title = translation?.title ?? project.title;
  const description = translation?.description ?? project.description;
  const category = categoryLabels[language][project.category];

  return (
    <m.a
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`project-card ${project.featured ? "is-featured" : ""}`}
      href={project.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`project-visual visual-${project.visual}`}>
        {project.image ? (
          <img src={project.image} alt={language === "pt" ? `Capa de ${title}` : `Cover of ${title}`} loading="lazy" decoding="async" />
        ) : (
          <>
            <span>{category}</span>
            <strong>{title}</strong>
          </>
        )}
        <ExternalLink className="project-arrow" />
      </div>
      <div className="project-body">
        <div>
          <span>{category}</span>
          <span>{project.year}</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </m.a>
  );
}

function Timeline({ year, title, text }: { year: string; title: string; text: string }) {
  return (
    <article>
      <span className="timeline-year">{year}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function Capability({ number, title, items }: { number: string; title: string; items: readonly string[] }) {
  return (
    <article className="capability-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span>↳</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default App;
