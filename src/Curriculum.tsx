import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Globe,
  Library,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Music,
  Music2,
  Search,
  Sun,
  Trophy,
  X,
} from "lucide-react";
import { projects, type Language } from "./content";
import { cvData, cvDataEn } from "./content-cv";

const cvCopy = {
  pt: {
    back: "Voltar ao geral",
    themeAria: "Alternar tema",
    languageAria: "Mudar idioma para inglês",
    lattes: "Currículo Lattes",
    print: "Salvar / Imprimir PDF",
    kicker: "Curriculum Vitae Acadêmico e Profissional · 2026",
    tabsAria: "Seções do currículo",
    tabs: [
      { id: "tudo", label: "Visão Geral Completa" },
      { id: "experiencia", label: "Experiência Profissional" },
      { id: "formacao", label: "Formação & Títulos" },
      { id: "premios", label: "Prêmios & Distinções" },
      { id: "publicacoes", label: "Produção Bibliográfica" },
      { id: "arte", label: "Produção Fonográfica & Cultural" },
      { id: "projetos", label: "Projetos de P&D" },
    ],
    summary: "Resumo / Perfil",
    experience: "Atuação Profissional",
    education: "Formação Acadêmica & Titulação",
    awards: "Prêmios, Títulos e Reconhecimentos",
    publications: "Produção Bibliográfica",
    publicationFilters: [
      { value: "Todos", label: "Todos" },
      { value: "Livro", label: "Livro" },
      { value: "Artigo Periódico", label: "Artigo Periódico" },
      { value: "Capítulo", label: "Capítulo" },
      { value: "Congresso", label: "Congresso" },
    ],
    publicationTypes: { Todos: "Todos", Livro: "Livro", "Artigo Periódico": "Artigo Periódico", Capítulo: "Capítulo", Congresso: "Congresso" } as Record<string, string>,
    searchPlaceholder: "Pesquisar publicações, periódicos ou termos...",
    searchAria: "Pesquisar publicações",
    openPublication: "Acessar publicação",
    artisticProduction: "Produção Artística, Fonográfica e Acessibilidade",
    projects: "Projetos de Pesquisa & Inovação Metodológica",
    publishedBooks: "Livros Publicados",
    books: ["Tecnogonia (Caravana, 2025)", "E o que eu faço com isso? (Labrador, 2025)", "Antologia Pandemias (Noveland, 2021)"],
    governanceSkills: "Especialidades em Governança & IA",
    technologies: "Tecnologias & Metodologias",
    certifications: "Formação Complementar",
    languages: "Idiomas",
    intellectualProperty: "Propriedade Intelectual",
    trademark: "Marca Registrada no Instituto Nacional da Propriedade Industrial (INPI), processo 922745829.",
    footerTitle: "Gustavo Simas da Silva — Curriculum Vitae",
    footerAreas: "Engenharia do Conhecimento · IA · Arte e Literatura",
    footerUpdated: "Atualizado em 2026 · Florianópolis/SC",
  },
  en: {
    back: "Back to overview",
    themeAria: "Toggle theme",
    languageAria: "Change language to Portuguese",
    lattes: "Lattes CV",
    print: "Save / Print PDF",
    kicker: "Academic and Professional Curriculum Vitae · 2026",
    tabsAria: "Curriculum vitae sections",
    tabs: [
      { id: "tudo", label: "Complete Overview" },
      { id: "experiencia", label: "Professional Experience" },
      { id: "formacao", label: "Education & Degrees" },
      { id: "premios", label: "Awards & Distinctions" },
      { id: "publicacoes", label: "Publications" },
      { id: "arte", label: "Music & Cultural Production" },
      { id: "projetos", label: "R&D Projects" },
    ],
    summary: "Summary / Profile",
    experience: "Professional Experience",
    education: "Education & Academic Degrees",
    awards: "Awards, Honors and Recognition",
    publications: "Publications",
    publicationFilters: [
      { value: "Todos", label: "All" },
      { value: "Livro", label: "Book" },
      { value: "Artigo Periódico", label: "Journal Article" },
      { value: "Capítulo", label: "Chapter" },
      { value: "Congresso", label: "Conference" },
    ],
    publicationTypes: { Todos: "All", Livro: "Book", "Artigo Periódico": "Journal Article", Capítulo: "Chapter", Congresso: "Conference" } as Record<string, string>,
    searchPlaceholder: "Search publications, journals or terms...",
    searchAria: "Search publications",
    openPublication: "Open publication",
    artisticProduction: "Artistic Production, Record Production & Accessibility",
    projects: "Research Projects & Methodological Innovation",
    publishedBooks: "Published Books",
    books: ["Technogony (Caravana, 2025)", "And What Do I Do with This? (Labrador, 2025)", "Pandemics Anthology (Noveland, 2021)"],
    governanceSkills: "Governance & AI Expertise",
    technologies: "Technologies & Methodologies",
    certifications: "Additional Education",
    languages: "Languages",
    intellectualProperty: "Intellectual Property",
    trademark: "Service trademark registered with Brazil's National Institute of Industrial Property (INPI), application 922745829.",
    footerTitle: "Gustavo Simas da Silva — Curriculum Vitae",
    footerAreas: "Knowledge Engineering · AI · Art and Literature",
    footerUpdated: "Updated in 2026 · Florianópolis/SC",
  },
};


// --------------------------------------------------------------------------
// CURRICULUM PAGE COMPONENT
// --------------------------------------------------------------------------
type CvTab = "tudo" | "experiencia" | "formacao" | "premios" | "publicacoes" | "arte" | "projetos";

export default function Curriculum({
  navigate,
  language,
  setLanguage,
}: {
  navigate: (path: string) => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}) {
  const [activeTab, setActiveTab] = useState<CvTab>("tudo");
  const [searchQuery, setSearchQuery] = useState("");
  const [pubFilter, setPubFilter] = useState<string>("Todos");
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("theme") as "dark" | "light") || "dark");
  const isPt = language === "pt";
  const data = isPt ? cvData : cvDataEn;
  const copy = cvCopy[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredPublications = useMemo(() => {
    return data.allPublications.filter((pub) => {
      const matchesType = pubFilter === "Todos" || pub.type === pubFilter;
      const matchesQuery =
        searchQuery === "" ||
        pub.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.year.includes(searchQuery);
      return matchesType && matchesQuery;
    });
  }, [data.allPublications, pubFilter, searchQuery]);

  return (
    <main className="cv-page" data-theme={theme}>
      <nav className="cv-toolbar">
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
          <a className="cv-link-button" href={data.profile.lattesUrl} target="_blank" rel="noreferrer">
            <Library size={14} /> {copy.lattes}
          </a>
          <a className="cv-link-button" href={data.profile.orcidUrl} target="_blank" rel="noreferrer">
            <Globe size={14} /> ORCID
          </a>
          <button className="cv-print-button" onClick={() => window.print()}>
            <Download size={16} /> {copy.print}
          </button>
        </div>
      </nav>

      <article className="cv-document">
        {/* HEADER */}
        <header className="cv-header">
          <div className="cv-header-main">
            <span className="cv-kicker">{copy.kicker}</span>
            <h1>{data.profile.name}</h1>
            <p className="cv-headline">{data.profile.titles}</p>
            <p className="cv-role-sub">{data.profile.role}</p>
          </div>
          <div className="cv-contact">
            <a href={`mailto:${data.profile.email}`}>
              <Mail size={14} /> {data.profile.email}
            </a>
            <span>
              <MapPin size={14} /> {data.profile.location}
            </span>
            <a href={data.profile.lattesUrl} target="_blank" rel="noreferrer">
              <Library size={14} /> Lattes ID: {data.profile.lattesId}
            </a>
            <a href={data.profile.orcidUrl} target="_blank" rel="noreferrer">
              <Globe size={14} /> ORCID: {data.profile.orcidId}
            </a>
            <a href={data.profile.linkedinUrl} target="_blank" rel="noreferrer">
              <Linkedin size={14} /> LinkedIn: /in/simasgs
            </a>
            <a href={data.profile.spotifyUrl} target="_blank" rel="noreferrer">
              <Music2 size={14} /> Spotify Artist
            </a>
          </div>
        </header>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div
          className="cv-interactive-tabs"
          role="tablist"
          aria-label={copy.tabsAria}
          onKeyDown={(event) => {
            // Arrow keys move between tabs, as the ARIA tabs pattern expects.
            const step = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity }[event.key];
            if (step === undefined) return;
            event.preventDefault();
            const ids = copy.tabs.map((tab) => tab.id);
            const index = ids.indexOf(activeTab);
            const next = step === -Infinity ? 0 : step === Infinity ? ids.length - 1 : (index + step + ids.length) % ids.length;
            setActiveTab(ids[next] as CvTab);
            document.getElementById(`cv-tab-${ids[next]}`)?.focus();
          }}
        >
          {copy.tabs.map((tab) => (
            <button
              key={tab.id}
              id={`cv-tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="cv-tabpanel"
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`cv-tab ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id as CvTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id="cv-tabpanel" aria-labelledby={`cv-tab-${activeTab}`} className="cv-tabpanel">
        {/* RESUMO / PERFIL */}
        {(activeTab === "tudo" || activeTab === "experiencia") && (
          <section className="cv-summary">
            <span>01</span>
            <div>
              <h2>{copy.summary}</h2>
              <p>{data.profile.bio}</p>
            </div>
          </section>
        )}

        <div className="cv-columns">
          <div className="cv-main-stream">
            {/* EXPERIÊNCIA PROFISSIONAL */}
            {(activeTab === "tudo" || activeTab === "experiencia") && (
              <section className="cv-section">
                <div className="cv-section-title">
                  <span>02</span>
                  <h2>{copy.experience}</h2>
                </div>
                <div className="cv-item-list">
                  {data.experience.map((item, idx) => (
                    <article className="cv-item" key={idx}>
                      <span className="cv-item-period">{item.period}</span>
                      <div className="cv-item-content">
                        <h3>{item.role}</h3>
                        <strong className="cv-item-company">
                          {item.company} · <small>{item.location}</small>
                        </strong>
                        <ul className="cv-bullet-list">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* FORMAÇÃO ACADÊMICA */}
            {(activeTab === "tudo" || activeTab === "formacao") && (
              <section className="cv-section">
                <div className="cv-section-title">
                  <span>03</span>
                  <h2>{copy.education}</h2>
                </div>
                <div className="cv-item-list">
                  {data.education.map((edu, idx) => (
                    <article className="cv-item" key={idx}>
                      <span className="cv-item-period">{edu.period}</span>
                      <div className="cv-item-content">
                        <h3>{edu.degree}</h3>
                        <strong className="cv-item-company">{edu.institution}</strong>
                        <p>{edu.details}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* PRÊMIOS E DISTINÇÕES */}
            {(activeTab === "tudo" || activeTab === "premios") && (
              <section className="cv-section">
                <div className="cv-section-title">
                  <span>04</span>
                  <h2>{copy.awards}</h2>
                </div>
                <div className="cv-awards-grid">
                  {data.awards.map((award, idx) => (
                    <div className="cv-award-card" key={idx}>
                      <div className="cv-award-header">
                        <Trophy size={16} className="cv-award-icon" />
                        <span className="cv-award-year">{award.year}</span>
                      </div>
                      <h4>{award.title}</h4>
                      <strong>{award.entity}</strong>
                      <p>{award.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PRODUÇÃO BIBLIOGRÁFICA COMPLETA */}
            {(activeTab === "tudo" || activeTab === "publicacoes") && (
              <section className="cv-section">
                <div className="cv-section-title">
                  <span>05</span>
                  <h2>{copy.publications}</h2>
                </div>

                {/* Filtro de publicações */}
                <div className="cv-pub-controls">
                  <div className="cv-pub-filters">
                    {copy.publicationFilters.map((filter) => (
                      <button
                        key={filter.value}
                        className={`cv-pub-filter-btn ${pubFilter === filter.value ? "active" : ""}`}
                        onClick={() => setPubFilter(filter.value)}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="cv-search-box">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder={copy.searchPlaceholder}
                      aria-label={copy.searchAria}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button className="cv-search-clear" onClick={() => setSearchQuery("")}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                <ol className="cv-publications">
                  {filteredPublications.map((item, i) => (
                    <li key={i} className="cv-publication-item">
                      <span className="cv-pub-index">{String(i + 1).padStart(2, "0")}</span>
                      <div className="cv-pub-body">
                        <div className="cv-pub-tag-row">
                          <span className={`cv-pub-tag ${item.type.toLowerCase().replace(/\s+/g, "-")}`}>{copy.publicationTypes[item.type]}</span>
                          <span className="cv-pub-year">{item.year}</span>
                        </div>
                        <p>{item.citation}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="cv-pub-link">
                            {copy.openPublication} <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* PRODUÇÃO ARTÍSTICA, FONOGRÁFICA E CULTURAL */}
            {(activeTab === "tudo" || activeTab === "arte") && (
              <section className="cv-section">
                <div className="cv-section-title">
                  <span>06</span>
                  <h2>{copy.artisticProduction}</h2>
                </div>
                <div className="cv-art-blocks">
                  {data.artisticProduction.map((art, idx) => (
                    <div className="cv-art-group" key={idx}>
                      <h3>{art.category}</h3>
                      <ul>
                        {art.items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROJETOS DE PESQUISA & METODOLOGIAS */}
            {(activeTab === "tudo" || activeTab === "projetos") && (
              <section className="cv-section">
                <div className="cv-section-title">
                  <span>07</span>
                  <h2>{copy.projects}</h2>
                </div>
                <div className="cv-item-list">
                  {data.projectsAndMethods.map((proj, idx) => (
                    <article className="cv-item" key={idx}>
                      <span className="cv-item-period">{proj.period}</span>
                      <div className="cv-item-content">
                        <h3>{proj.title}</h3>
                        <strong className="cv-item-company">{proj.role}</strong>
                        <p>{proj.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="cv-side">
            <CvSide label={copy.publishedBooks} items={copy.books} />
            <CvSide
              label={copy.governanceSkills}
              items={data.skills.governanceAndKnowledge}
            />
            <CvSide
              label={copy.technologies}
              items={data.skills.technical}
            />
            <CvSide
              label={copy.certifications}
              items={data.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`)}
            />
            <section className="cv-side-section">
              <span className="cv-side-label">{copy.languages}</span>
              <ul className="cv-lang-list">
                {data.skills.languages.map((l) => (
                  <li key={l.language}>
                    <strong>{l.language}:</strong> <span>{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="cv-side-section">
              <span className="cv-side-label">{copy.intellectualProperty}</span>
              <p className="cv-side-note">
                <strong>VI Mídia</strong> — {copy.trademark}
              </p>
            </section>
          </aside>
        </div>
        </div>

        <footer className="cv-document-footer">
          <span>{copy.footerTitle}</span>
          <span>{copy.footerAreas}</span>
          <span>{copy.footerUpdated}</span>
        </footer>
      </article>
    </main>
  );
}

function CvSide({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="cv-side-section">
      <span className="cv-side-label">{label}</span>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
