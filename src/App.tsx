import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Compass,
  Contrast,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Github,
  Globe,
  GraduationCap,
  Headphones,
  Instagram,
  Layers,
  Library,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Music,
  Music2,
  Network,
  Palette,
  Search,
  Sparkles,
  Sun,
  Trophy,
  Volume2,
  X,
} from "lucide-react";

type Category = "Pesquisa" | "Tecnologia" | "Literatura" | "Música" | "Visual";
type Language = "pt" | "en";

interface Project {
  title: string;
  category: Category;
  year: string;
  description: string;
  href: string;
  visual: string;
  image?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Tecnogonia: criando tecnologias que nos criam",
    category: "Literatura",
    year: "2025",
    description:
      "Ensaio sobre as tecnologias que criamos — e que, silenciosamente, também nos criam. Publicado pela Editora Caravana.",
    href: "https://caravanagrupoeditorial.com/livros/tecnogonia-criando-tecnologias-que-nos-criam/?v=2d3615d82bb9",
    visual: "tecnogonia",
    image: "/assets/tecnogonia.jpeg",
    featured: true,
  },
  {
    title: "E o que eu faço com isso?",
    category: "Literatura",
    year: "2025",
    description:
      "Livro de poesia: uma coleção de perguntas, afetos e fragmentos sobre o que fazemos com aquilo que nos atravessa. Editora Labrador.",
    href: "https://www.instagram.com/tudoemsimas/",
    visual: "poesia",
    image: "/assets/eoqueeufacocomisso.jpg",
    featured: true,
  },
  {
    title: "ECO-CAOS",
    category: "Pesquisa",
    year: "2024",
    description:
      "Metamodelo conceitual para ecossistemas de conhecimento e culturas de aprendizagem organizacional (PPGEGC/UFSC. Vencedor do Prêmio SBGC de Melhor Dissertação).",
    href: "https://dissertacao.gustavosimas.com/",
    visual: "eco",
    image: "/assets/eco-caos-cover.svg",
  },
  {
    title: "Rancho de Amor à Ilha",
    category: "Música",
    year: "2026",
    description:
      "Releitura instrumental e lofi do hino oficial de Florianópolis (composição de Zininho), em homenagem ao centenário da Ponte Hercílio Luz.",
    href: "https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz",
    visual: "ranchodoamor",
    image: "/assets/ranchodoamor.jpg",
  },
  {
    title: "Berimbrasil",
    category: "Música",
    year: "Em curso",
    description:
      "Curadoria e valorização da música brasileira em diálogo com memória, escuta e cultura digital (@brasil.wav).",
    href: "https://instagram.com/brasil.wav",
    visual: "brasil",
    image: "/assets/berimbrasil.jpg",
  },
  {
    title: "Tecnomágica",
    category: "Visual",
    year: "Em curso",
    description:
      "Laboratório de promptografia, inteligência artificial, experimentação visual e imaginação técnica (@tecnomagica).",
    href: "https://instagram.com/tecnomagica",
    visual: "prompt",
    image: "/assets/tecnomagica.jpg",
  },
  {
    title: "Promptografia e Agência Criativa",
    category: "Pesquisa",
    year: "2026",
    description:
      "Investigação sobre agência criativa humana, autoria e práticas visuais mediadas por IA generativa (Revista Brasileira de Estudos CTS).",
    href: "https://promptografia.gustavosimas.com/",
    visual: "agency",
    image: "/assets/promptografia-cover.svg",
  },
  {
    title: "VI Mídia Produtora",
    category: "Tecnologia",
    year: "2020 — 2024",
    description:
      "Engenharia de áudio, design de som e produção fonográfica acessível para educação e entretenimento (audiolivros, audiodescrição e tecnologia assistiva).",
    href: "https://www.linkedin.com/in/simasgs/",
    visual: "vimidia",
    image: "/assets/mensagem-audiolivro.jpg",
  },
  {
    title: "Simetrics",
    category: "Tecnologia",
    year: "2026",
    description:
      "Plataforma de inteligência bibliométrica e cientométrica que transforma bases de até 10 mil documentos em indicadores, redes de conhecimento e mapas temáticos — com processamento local no navegador.",
    href: "https://simetrics.app/",
    visual: "simetrics",
    image: "/assets/simetrics-cover.svg",
  },
  {
    title: "LIFE∞ — Infinite Life Lab",
    category: "Tecnologia",
    year: "2026",
    description:
      "Laboratório interativo do Jogo da Vida de Conway em canvas infinito para criar padrões, acompanhar métricas e explorar emergência, auto-organização, complexidade e vida artificial.",
    href: "https://gameoflife.gustavosimas.com/",
    visual: "life-infinite",
    image: "/assets/life-infinite-cover.svg",
  },
  {
    title: "MDForge",
    category: "Tecnologia",
    year: "2026",
    description:
      "Conversor privado de arquivos e pastas para Markdown editável. Processa documentos em múltiplos formatos inteiramente no navegador, sem uploads ou armazenamento em servidores.",
    href: "https://mdforge.gustavosimas.com/",
    visual: "mdforge",
    image: "/assets/mdforge-cover.svg",
  },
  {
    title: "DataVizLab",
    category: "Tecnologia",
    year: "2026",
    description:
      "Plataforma com 78 métodos, recomendador e estúdio local para escolher, construir, auditar e exportar visualizações de dados claras, acessíveis e adequadas à pergunta analítica.",
    href: "https://datavizlab.gustavosimas.com/",
    visual: "datavizlab",
    image: "/assets/datavizlab-cover.svg",
  },
  {
    title: "TokenLab",
    category: "Tecnologia",
    year: "2026",
    description:
      "Analisador local para contar tokens, simular estratégias de chunking e estimar carga, sobreposição e requisições antes de indexar bases de conhecimento em pipelines de RAG.",
    href: "https://tokenlab.gustavosimas.com/",
    visual: "tokenlab",
    image: "/assets/tokenlab-cover.svg",
  },
];

const projectTranslationsEn: Record<string, { title: string; description: string }> = {
  "Tecnogonia: criando tecnologias que nos criam": {
    title: "Technogony: creating technologies that create us",
    description: "An essay on the technologies we create — and that, silently, also create us. Published by Editora Caravana.",
  },
  "E o que eu faço com isso?": {
    title: "And what do I do with this?",
    description: "A poetry collection of questions, affections and fragments about what we do with what moves through us. Editora Labrador.",
  },
  "ECO-CAOS": {
    title: "ECO-CAOS",
    description: "A conceptual metamodel for knowledge ecosystems and organizational learning cultures (PPGEGC/UFSC; winner of the SBGC Best Dissertation Award).",
  },
  "Rancho de Amor à Ilha": {
    title: "Rancho de Amor à Ilha",
    description: "An instrumental lo-fi reinterpretation of Florianópolis' official anthem, composed by Zininho, celebrating the centenary of the Hercílio Luz Bridge.",
  },
  Berimbrasil: {
    title: "Berimbrasil",
    description: "Curation and appreciation of Brazilian music through memory, listening and digital culture (@brasil.wav).",
  },
  "Tecnomágica": {
    title: "Technomagic",
    description: "A laboratory for promptography, artificial intelligence, visual experimentation and technical imagination (@tecnomagica).",
  },
  "Promptografia e Agência Criativa": {
    title: "Promptography and Creative Agency",
    description: "Research on human creative agency, authorship and visual practices mediated by generative AI (Brazilian Journal of STS Studies).",
  },
  "VI Mídia Produtora": {
    title: "VI Mídia Production",
    description: "Audio engineering, sound design and accessible phonographic production for education and entertainment, including audiobooks, audio description and assistive technology.",
  },
  Simetrics: {
    title: "Simetrics",
    description: "A bibliometric and scientometric intelligence platform that turns up to 10,000 documents into indicators, knowledge networks and thematic maps — processed locally in the browser.",
  },
  "LIFE∞ — Infinite Life Lab": {
    title: "LIFE∞ — Infinite Life Lab",
    description: "An interactive Conway's Game of Life laboratory on an infinite canvas for creating patterns, tracking metrics and exploring emergence, self-organization, complexity and artificial life.",
  },
  MDForge: {
    title: "MDForge",
    description: "A private converter for turning files and folders into editable Markdown. Multiple formats are processed entirely in the browser, with no server uploads or storage.",
  },
  DataVizLab: {
    title: "DataVizLab",
    description: "A platform with 78 methods, a recommender and a local studio for choosing, building, auditing and exporting clear, accessible visualizations suited to the analytical question.",
  },
  TokenLab: {
    title: "TokenLab",
    description: "A local analyzer for counting tokens, simulating chunking strategies and estimating load, overlap and requests before indexing knowledge bases in RAG pipelines.",
  },
};

const categoryLabels: Record<Language, Record<"Todos" | Category, string>> = {
  pt: { Todos: "Todos", Pesquisa: "Pesquisa", Tecnologia: "Tecnologia", Literatura: "Literatura", Música: "Música", Visual: "Visual" },
  en: { Todos: "All", Pesquisa: "Research", Tecnologia: "Technology", Literatura: "Literature", Música: "Music", Visual: "Visual" },
};

const highlightPublications = [
  {
    title: "Promptography and the reconfiguration of human creative agency",
    titleEn: "Promptography and the reconfiguration of human creative agency",
    source: "Revista Brasileira de Estudos CTS",
    sourceEn: "Brazilian Journal of STS Studies",
    year: "2026",
    authors: "Da Silva, Gustavo Simas; Ulbricht, Vânia Ribas",
    link: "https://revistabrasileiradeestudoscts.com/revista/article/view/37",
  },
  {
    title: "Tecnonecromancia: Simulacros de presença e a política da morte na era da inteligência artificial generativa",
    titleEn: "Technonecromancy: Simulacra of Presence and the Politics of Death in the Age of Generative AI",
    source: "Trilogía Ciencia Tecnología Sociedad",
    sourceEn: "Trilogía Ciencia Tecnología Sociedad",
    year: "2026",
    authors: "Silva, Gustavo Simas da; Ulbricht, Vania Ribas",
    link: "https://technonecromancy.gustavosimas.com/",
  },
  {
    title: "An ESG-AI Matrix for Innovation Ecosystems",
    titleEn: "An ESG-AI Matrix for Innovation Ecosystems",
    source: "Sustainable Business International Journal",
    sourceEn: "Sustainable Business International Journal",
    year: "2026",
    authors: "Silva, Gustavo Simas da; Ulbricht, V. R.",
    link: "https://periodicos.uff.br/sbijournal/article/view/69566",
  },
  {
    title: "A quantitative analysis of geographic, gender, and age distribution of Nobel Prize Laureates (1901-2025)",
    titleEn: "A quantitative analysis of geographic, gender, and age distribution of Nobel Prize Laureates (1901-2025)",
    source: "International Journal of Knowledge Engineering and Management",
    sourceEn: "International Journal of Knowledge Engineering and Management",
    year: "2025",
    authors: "Simas da Silva, Gustavo; Ribas Ulbricht, Vânia",
    link: "https://periodicos.ufsc.br/index.php/ijkem/article/view/109317?articlesBySimilarityPage=1",
  },
  {
    title: "Ecossistema de Conhecimento Organizacional: GC e Cultura de Aprendizagem",
    titleEn: "Organizational Knowledge Ecosystem: KM and Learning Culture",
    source: "Inteligência Empresarial e Economia dos Intangíveis",
    sourceEn: "Inteligência Empresarial e Economia dos Intangíveis",
    year: "2023",
    authors: "Da Silva, Gustavo Simas; Lima, L. S.; Ferraz, M. Z.",
    link: "https://inteligenciaempresarial.emnuvens.com.br/rie/article/view/115",
  },
  {
    title: "Interação Humano-IA: Antropomorfização & Engajamento no ChatGPT",
    titleEn: "Human-AI Interaction: Anthropomorphization & User Engagement in ChatGPT",
    source: "IHSI 2024 · Palermo, Itália",
    sourceEn: "IHSI 2024 · Palermo, Italy",
    year: "2024",
    authors: "Simas, Gustavo; Ribas Ulbricht, Vânia",
    link: "https://ihsi2024.gustavosimas.com",
  },
];

const portfolioCopy = {
  pt: {
    brandTagline: "Conhecimento · tecnologia · imaginação",
    nav: ["Manifesto", "Eixos", "Portfólio", "Áudio", "Trajetória", "Publicações", "Currículo"],
    header: {
      brandAria: "Gustavo Simas — início",
      navAria: "Navegação principal",
      preferencesAria: "Preferências de visualização",
      theme: "Alternar tema",
      contrast: "Alto contraste",
      decreaseText: "Diminuir tamanho do texto",
      increaseText: "Aumentar tamanho do texto",
      menu: "Abrir menu",
      closeMenu: "Fechar menu",
      language: "Mudar idioma para inglês",
    },
    hero: {
      location: "Florianópolis · Brasil · 2026",
      line1: "Pesquiso as",
      emphasis: "tecnologias",
      line3: "que nos criam.",
      lede: "Engenheiro do conhecimento, pesquisador, escritor e artista. Minha prática atravessa inovação, ecologia do conhecimento, inteligência artificial, literatura e audiovisual.",
      explore: "Explorar trabalhos",
      cv: "Currículo completo",
      index: ["Investigar", "Sistematizar", "Criar"],
    },
    manifesto: {
      label: "Manifesto",
      before: "Ciência e arte como modos de formular perguntas, revelar relações e ",
      emphasis: "disputar o que o mundo pode ser",
      first: "Meu trabalho parte de uma pergunta persistente: como as tecnologias, os conhecimentos e as culturas se transformam mutuamente?",
      second: "Minha prática atravessa ecossistemas de inovação, ecologia do conhecimento, inteligência artificial, literatura e audiovisual. Transito entre pesquisa e criação porque algumas ideias pedem modelos conceituais; outras, poemas. Algumas se tornam sistemas e métodos, outras músicas, livros ou experiências sonoras.",
      link: "Ver os três eixos",
    },
    axes: {
      label: "Eixos de atuação",
      title1: "Três verbos.",
      title2: "Uma mesma visão intelectual.",
      subtitle: "Os três verbos não funcionam como caixas isoladas. São movimentos complementares de uma mesma ecologia de pensamento e criação.",
      cards: [
        { title: "Investigar", description: "Produzir conceitos, perguntas e métodos para compreender conhecimento, inteligência artificial, aprendizagem e sociedade.", tags: ["Ecologia do conhecimento", "IA e sociedade", "Governança sociotécnica", "Pesquisa acadêmica"] },
        { title: "Sistematizar", description: "Transformar pesquisa e estratégia em sistemas, modelos de dados, arquiteturas conceituais e metodologias de inovação úteis.", tags: ["Engenharia do conhecimento", "Governança de IA", "Metodologias de inovação", "Modelagem de dados"] },
        { title: "Criar", description: "Explorar literatura, poesia, produção fonográfica e narrativas visuais como modos legítimos de conhecer e produzir mundo.", tags: ["Literatura e poesia", "Produção fonográfica", "Curadoria cultural", "Promptografia"] },
      ],
    },
    portfolio: { label: "Portfólio de projetos", title1: "Portfólio de", title2: "projetos.", subtitle: "Alguns livros, pesquisas, plataformas, álbuns e experimentos conectados pelas perguntas que os originaram.", filterAria: "Filtrar trabalhos" },
    audio: {
      kicker: "Áudio como outra forma de pesquisa",
      title1: "Escutar também",
      title2: "é uma forma",
      title3: "de conhecer.",
      description: "Releituras instrumentais, paisagens sonoras, produção fonográfica e curadoria cultural fazem parte de uma prática que une técnica, memória, palavra e experimentação sonora.",
      spotify: "Ouvir no Spotify",
      berim: "Conhecer Berimbrasil",
      projectsAria: "Projetos musicais",
      ranchAlt: "Capa do single Rancho de Amor à Ilha",
      berimAlt: "Capa do projeto Berimbrasil",
      production: "Produção Fonográfica",
    },
    trajectory: {
      label: "Trajetória",
      title1: "Conhecimento é",
      title2: "uma travessia.",
      subtitle: "Uma trajetória interdisciplinar articulada entre universidades, organizações de inovação, territórios e projetos autorais.",
      portraitAlt: "Retrato de Gustavo Simas",
      location: "Florianópolis · SC",
      badges: ["Analista de IA · Sebrae/SC", "Doutorando CAPES · PPGEGC/UFSC", "Mestre · Prêmio SBGC Melhor Dissertação", "Engenheiro Eletrônico · Produtor Fonográfico"],
      timeline: [
        { year: "2026 — Atual", title: "Inteligência Artificial no Sebrae/SC & Doutorado", text: "Atuação na estruturação da governança do Escritório de IA do Sebrae/SC, MLOps/LLMOps gerencial e conformidade, paralela à pesquisa de doutorado em ecologia do conhecimento na UFSC." },
        { year: "2025", title: "Tecnogonia, Poesia e Prêmio SBGC", text: "Publicação de Tecnogonia (Editora Caravana) e do livro de poemas E o que eu faço com isso? (Editora Labrador). Conquista do Prêmio SBGC de Melhor Dissertação de Mestrado do Brasil." },
        { year: "2025 — 2026", title: "MBA PUCRS", text: "MBA em Tecnologia para Negócios: AI, Data Science e Big Data na PUCRS, com foco em inteligência artificial aplicada a modelos de negócio, tomada de decisão estratégica e inovação orientada a dados." },
        { year: "2023 — 2026", title: "Impact Hub & Metodologias de Inovação", text: "Analista de Inovação Sênior e de Dados, atuando no desenvolvimento e aplicação de metodologias de inovação territorial e ecossistêmica, incluindo Metodologia ELI, ALI Ecossistemas, ALI Produtividade e INDEI." },
        { year: "2020 — 2024", title: "Releituras / VI Mídia & Produção de Áudio Acessível", text: "Cofundador e produtor fonográfico de conteúdos acessíveis (audiolivros, audiodescrição para público print disabled e síntese vocal com IA), com apoio do Programa Centelha (FAPESC)." },
        { year: "2016 — 2021", title: "Engenharia Eletrônica & Robótica na UFSC", text: "Graduação em Engenharia Eletrônica com ênfase em Processamento Digital de Sinais (TCC em aparelhos auditivos) e pesquisa no Laboratório de Robótica Aplicada (LAR/UFSC)." },
        { year: "2012 — 2016", title: "Curso técnico em eletrônica IFSC & FRC 5800 Magic Island Robotics", text: "Formação técnica em eletrônica no IFSC e mentoria na equipe FRC 5800 Magic Island Robotics, com participação e premiações em campeonatos internacionais de robótica FIRST Robotics Competition em Las Vegas, Orlando e China." },
      ],
    },
    research: { label: "Pesquisa e publicação", title1: "Conhecer", title2: "em relação.", description: "Artigos científicos, livros e pesquisas em periódicos internacionais e anais de conferências sobre inteligência artificial, agência criativa, ecologia do conhecimento e inovação.", orcid: "Ver ORCID", lattes: "Ver Currículo Lattes", open: "Abrir pesquisa" },
    capabilities: {
      label: "Capacidades", title1: "O que posso", title2: "colocar em movimento.",
      cards: [
        { title: "Conhecimento e estratégia", items: ["Governança de Inteligência Artificial", "Ecologia e engenharia do conhecimento", "Modelagem conceitual e ontologias", "Ecossistemas de inovação e impacto", "Cultura de aprendizagem contínua"] },
        { title: "Tecnologia e dados", items: ["MLOps e LLMOps gerencial", "Python, ciência de dados e BI", "TypeScript, React e aplicações web", "Processamento de sinais e áudio", "Prototipagem ágil de soluções"] },
        { title: "Criação e cultura", items: ["Ensaios, literatura e poesia", "Produção fonográfica e som", "Curadoria musical e digital", "Promptografia e IA generativa", "Acessibilidade e audiodescrição"] },
      ],
    },
    contact: { kicker: "Disponível para projetos, pesquisa e colaboração", title1: "Vamos imaginar", title2: "alguma coisa", title3: "juntos?", description: "Conhecimento, tecnologia, literatura, produção fonográfica e audiovisual para pensar o presente e inventar futuros." },
    footer: { location: "Florianópolis · Brasil", text: "© 2026 · Conhecimento · tecnologia · imaginação", top: "Voltar ao topo" },
    atlas: { aria: "Atlas dos três eixos", core: "Conhecimento", nodes: ["Investigar", "Sistematizar", "Criar"] },
  },
  en: {
    brandTagline: "Knowledge · technology · imagination",
    nav: ["Manifesto", "Axes", "Portfolio", "Audio", "Journey", "Publications", "CV"],
    header: {
      brandAria: "Gustavo Simas — home",
      navAria: "Main navigation",
      preferencesAria: "Display preferences",
      theme: "Switch theme",
      contrast: "High contrast",
      decreaseText: "Decrease text size",
      increaseText: "Increase text size",
      menu: "Open menu",
      closeMenu: "Close menu",
      language: "Mudar idioma para português",
    },
    hero: {
      location: "Florianópolis · Brazil · 2026",
      line1: "I research the",
      emphasis: "technologies",
      line3: "that create us.",
      lede: "Knowledge engineer, researcher, writer and artist. My practice spans innovation, knowledge ecology, artificial intelligence, literature and audiovisual media.",
      explore: "Explore projects",
      cv: "Full CV",
      index: ["Investigate", "Systematize", "Create"],
    },
    manifesto: {
      label: "Manifesto",
      before: "Science and art as ways to formulate questions, reveal relationships and ",
      emphasis: "contest what the world can become",
      first: "My work begins with a persistent question: how do technologies, knowledge and cultures transform one another?",
      second: "My practice spans innovation ecosystems, knowledge ecology, artificial intelligence, literature and audiovisual media. I move between research and creation because some ideas call for conceptual models; others, poems. Some become systems and methods, others music, books or sonic experiences.",
      link: "See the three axes",
    },
    axes: {
      label: "Fields of practice",
      title1: "Three verbs.",
      title2: "One intellectual vision.",
      subtitle: "The three verbs are not isolated boxes. They are complementary movements within the same ecology of thought and creation.",
      cards: [
        { title: "Investigate", description: "Develop concepts, questions and methods to understand knowledge, artificial intelligence, learning and society.", tags: ["Knowledge ecology", "AI and society", "Sociotechnical governance", "Academic research"] },
        { title: "Systematize", description: "Turn research and strategy into systems, data models, conceptual architectures and useful innovation methodologies.", tags: ["Knowledge engineering", "AI governance", "Innovation methodologies", "Data modeling"] },
        { title: "Create", description: "Explore literature, poetry, phonographic production and visual narratives as legitimate ways of knowing and making worlds.", tags: ["Literature and poetry", "Phonographic production", "Cultural curation", "Promptography"] },
      ],
    },
    portfolio: { label: "Project portfolio", title1: "Project", title2: "portfolio.", subtitle: "Books, research, platforms, albums and experiments connected by the questions that originated them.", filterAria: "Filter projects" },
    audio: {
      kicker: "Audio as another form of research",
      title1: "Listening is also",
      title2: "a way",
      title3: "of knowing.",
      description: "Instrumental reinterpretations, soundscapes, phonographic production and cultural curation are part of a practice joining technique, memory, language and sonic experimentation.",
      spotify: "Listen on Spotify",
      berim: "Discover Berimbrasil",
      projectsAria: "Music projects",
      ranchAlt: "Cover of the single Rancho de Amor à Ilha",
      berimAlt: "Cover of the Berimbrasil project",
      production: "Phonographic Production",
    },
    trajectory: {
      label: "Journey", title1: "Knowledge is", title2: "a crossing.", subtitle: "An interdisciplinary journey articulated across universities, innovation organizations, territories and authorial projects.", portraitAlt: "Portrait of Gustavo Simas", location: "Florianópolis · SC",
      badges: ["AI Analyst · Sebrae/SC", "CAPES PhD Researcher · PPGEGC/UFSC", "Master's · SBGC Best Dissertation Award", "Electronics Engineer · Music Producer"],
      timeline: [
        { year: "2026 — Present", title: "Artificial Intelligence at Sebrae/SC & PhD", text: "Work on structuring governance for Sebrae/SC's AI Office, managerial MLOps/LLMOps and compliance, alongside PhD research in knowledge ecology at UFSC." },
        { year: "2025", title: "Technogony, Poetry and the SBGC Award", text: "Publication of Technogony (Editora Caravana) and the poetry book And what do I do with this? (Editora Labrador). Winner of Brazil's SBGC Best Master's Dissertation Award." },
        { year: "2025 — 2026", title: "PUCRS MBA", text: "MBA in Technology for Business: AI, Data Science and Big Data at PUCRS, focused on AI applied to business models, strategic decision-making and data-driven innovation." },
        { year: "2023 — 2026", title: "Impact Hub & Innovation Methodologies", text: "Senior Innovation and Data Analyst developing and applying territorial and ecosystem innovation methodologies, including ELI, ALI Ecosystems, ALI Productivity and INDEI." },
        { year: "2020 — 2024", title: "Reinterpretations / VI Mídia & Accessible Audio Production", text: "Co-founder and music producer of accessible content — audiobooks, audio description for print-disabled audiences and AI voice synthesis — supported by the Centelha Program (FAPESC)." },
        { year: "2016 — 2021", title: "Electronics Engineering & Robotics at UFSC", text: "Degree in Electronics Engineering focused on Digital Signal Processing, with a thesis on hearing aids and research at UFSC's Applied Robotics Laboratory." },
        { year: "2012 — 2016", title: "Electronics at IFSC & FRC 5800 Magic Island Robotics", text: "Technical education in electronics at IFSC and mentoring for FRC 5800 Magic Island Robotics, with participation and awards in international FIRST Robotics Competition events in Las Vegas, Orlando and China." },
      ],
    },
    research: { label: "Research and publication", title1: "Knowing", title2: "in relation.", description: "Scientific articles, books and research in international journals and conference proceedings on artificial intelligence, creative agency, knowledge ecology and innovation.", orcid: "View ORCID", lattes: "View Lattes CV", open: "Open research" },
    capabilities: {
      label: "Capabilities", title1: "What I can", title2: "set in motion.",
      cards: [
        { title: "Knowledge and strategy", items: ["Artificial Intelligence governance", "Knowledge ecology and engineering", "Conceptual modeling and ontologies", "Innovation and impact ecosystems", "Continuous learning culture"] },
        { title: "Technology and data", items: ["Managerial MLOps and LLMOps", "Python, data science and BI", "TypeScript, React and web applications", "Signal and audio processing", "Agile solution prototyping"] },
        { title: "Creation and culture", items: ["Essays, literature and poetry", "Phonographic production and sound", "Music and digital curation", "Promptography and generative AI", "Accessibility and audio description"] },
      ],
    },
    contact: { kicker: "Available for projects, research and collaboration", title1: "Shall we imagine", title2: "something", title3: "together?", description: "Knowledge, technology, literature, phonographic production and audiovisual media to think through the present and invent futures." },
    footer: { location: "Florianópolis · Brazil", text: "© 2026 · Knowledge · technology · imagination", top: "Back to top" },
    atlas: { aria: "Atlas of the three axes", core: "Knowledge", nodes: ["Investigate", "Systematize", "Create"] },
  },
} as const;

function getInitialLanguage(): Language {
  const saved = localStorage.getItem("language");
  if (saved === "pt" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

// Dados completos e precisos extraídos do Lattes e LinkedIn
const cvData = {
  profile: {
    name: "Gustavo Simas da Silva",
    titles: "Doutorando e Mestre em Engenharia e Gestão do Conhecimento (UFSC) · Engenheiro Eletrônico (UFSC)",
    role: "Analista Técnico II - Inteligência Artificial no Sebrae/SC · Pesquisador Bolsista CAPES (LaMiD/UFSC) · Escritor e Produtor Fonográfico",
    location: "Florianópolis, Santa Catarina, Brasil",
    email: "gustavosimassilva@gmail.com",
    lattesUrl: "http://lattes.cnpq.br/3423329196677574",
    lattesId: "3423329196677574",
    orcidUrl: "https://orcid.org/0000-0003-3485-7910",
    orcidId: "0000-0003-3485-7910",
    linkedinUrl: "https://www.linkedin.com/in/simasgs",
    spotifyUrl: "https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz",
    githubUrl: "https://github.com/GSimas",
    bio: "Energizar o saber, reduzir o desconhecimento e potencializar a inovação transformadora. Atua ao entender a complexidade gerenciando caos e ordem por meio de Engenharia, Gestão e Mídias do Conhecimento, Inovação, Tecnologia e Arte. Atualmente é Analista de IA no Sebrae/SC, pesquisador bolsista CAPES de doutorado no Laboratório de Mídias (LAMID/PPGEGC/UFSC), escritor e produtor fonográfico.",
  },
  experience: [
    {
      period: "06/2026 — Presente",
      role: "Analista Técnico II — Inteligência Artificial",
      company: "Sebrae Santa Catarina",
      location: "Florianópolis, SC",
      bullets: [
        "Estruturação e operação da governança do Escritório de IA do Sebrae/SC.",
        "Monitoramento, análise e validação da execução de projetos corporativos de IA nas áreas técnicas e meio, assegurando conformidade metodológica e qualidade.",
        "Apoio a áreas na elaboração de planos de projetos de IA, matrizes de risco, cronogramas, indicadores e resultados esperados.",
        "Acompanhamento de projetos estratégicos de IA de origem nacional alinhados ao Sebrae Nacional.",
        "Condução de avaliações técnicas e de conformidade de casos de uso de IA; desenho e padronização do ciclo de vida de soluções (do piloto à produção).",
        "Implantação e manutenção de métricas e monitoramento de desempenho de IA (MLOps/LLMOps em nível de gestão) e orquestração de capacitações para adoção institucional.",
      ],
    },
    {
      period: "03/2025 — Presente",
      role: "Pesquisador Bolsista de Doutorado (CAPES)",
      company: "Universidade Federal de Santa Catarina (UFSC)",
      location: "Florianópolis, SC",
      bullets: [
        "Bolsista pesquisador CAPES no Laboratório de Mídias (LAMID) do Programa de Pós-Graduação em Engenharia, Gestão e Mídia do Conhecimento (PPGEGC/UFSC).",
        "Pesquisa avançada em ecologia do conhecimento, ciência de redes, cientometria, inteligência artificial e governança tecnológica.",
        "Investigação de aspectos sociotécnicos do conhecimento em rede (estruturação e impacto de tecnologias como IA em contextos organizacionais e acadêmicos).",
      ],
    },
    {
      period: "03/2025 — Presente",
      role: "Revisor Científico (Reviewer)",
      company: "Science Publishing Group",
      location: "Internacional",
      bullets: [
        "Avaliação crítica por pares (peer review) de artigos científicos de ponta nas áreas de tecnologia, inteligência artificial e gestão do conhecimento.",
      ],
    },
    {
      period: "01/2024 — 06/2026",
      role: "Consultor em Inovação, Dados e Governança",
      company: "Consultoria Autônoma / Negócios",
      location: "Florianópolis, SC",
      bullets: [
        "Consultoria em inovação, dados, inteligência artificial, gestão do conhecimento e governança tecnológica.",
        "Aplicação de metodologias para diagnóstico e planejamento organizacional, monitoramento de indicadores e gestão da mudança.",
      ],
    },
    {
      period: "08/2023 — 04/2026",
      role: "Analista de Inovação Sênior",
      company: "Impact Hub Brasil",
      location: "Florianópolis, SC",
      bullets: [
        "Pesquisa, Desenvolvimento e Inovação (P&D&I) para impacto socioambiental positivo.",
        "Desenvolvimento e implementação de metodologias para Ecossistemas Locais de Inovação e Impacto (coautor da Metodologia ALI Ecossistemas).",
        "Inteligência de negócios, pesquisas de tendências e tecnologias emergentes.",
        "Avaliação e monitoramento de impacto socioambiental com visão sistêmica e relatórios executivos.",
        "Gestão e engenharia do conhecimento para capturar, compartilhar e disseminar práticas organizacionais.",
      ],
    },
    {
      period: "12/2021 — 08/2023",
      role: "Analista de Dados",
      company: "Impact Hub Brasil",
      location: "Florianópolis, SC",
      bullets: [
        "Análise de dados na área de ecossistemas de inovação e impacto socioambiental.",
        "Estruturação de pipelines analíticos, inteligência de negócios, governança da informação organizacional e cultura de aprendizagem.",
      ],
    },
    {
      period: "04/2020 — 01/2024",
      role: "Cofundador, Produtor Fonográfico e Engenheiro de Áudio",
      company: "VI Mídia Produtora (Visão Inclusiva)",
      location: "Florianópolis, SC",
      bullets: [
        "Cofundador e produtor fonográfico de conteúdos acessíveis para educação e entretenimento.",
        "Produção de audiolivros, audiodescrição para público print disabled e síntese vocal com recursos de IA.",
        "Engenharia de áudio, design de som e processamento digital de sinais de voz.",
        "Titular de marca registrada de serviço homologada no INPI.",
      ],
    },
    {
      period: "04/2020 — 01/2021",
      role: "Editor e Revisor Literário",
      company: "Editora Noveland",
      location: "Florianópolis, SC",
      bullets: [
        "Revisão textual e literária, avaliação e parecer de originais, coordenação editorial e gestão de marca.",
      ],
    },
    {
      period: "07/2018 — 02/2020",
      role: "Bolsista de Iniciação Científica (P&D Robótica)",
      company: "Laboratório de Robótica Aplicada (LAR/UFSC)",
      location: "Florianópolis, SC",
      bullets: [
        "P&D de Sistema Robotizado de Inspeção para Linhas de Distribuição de Energia Elétrica (convênio Celesc / Departamento de Engenharia Mecânica).",
        "Revisão sistemática de literatura, modelagem CAD/Solidworks, patentes, artigos científicos e desenvolvimento de interfaces/aplicações web (front-end).",
      ],
    },
    {
      period: "01/2017 — 02/2018",
      role: "Estagiário de Engenharia",
      company: "CIASC — Centro de Informática e Automação de SC",
      location: "Florianópolis, SC",
      bullets: [
        "Desenvolvimento de sistema de monitoramento preditivo para Data Center.",
        "Sensoriamento e alerta de variáveis críticas (temperatura, umidade, inundação, incêndio) com Zabbix, Arduino e Fluidodinâmica Computacional (CFD).",
      ],
    },
    {
      period: "02/2015 — 07/2015",
      role: "Estagiário de Engenharia Clínica (GTMH)",
      company: "Instituto de Engenharia Biomédica (IEB-UFSC / Carmela Dutra)",
      location: "Florianópolis, SC",
      bullets: [
        "Gestão de Tecnologia de Equipamentos Médico-Hospitalares (GTMH), controle de qualidade, manutenção corretiva/preventiva e treinamento técnico.",
      ],
    },
  ],
  education: [
    {
      period: "01/2025 — 03/2029 (Em andamento)",
      degree: "Doutorado em Engenharia, Gestão e Mídia do Conhecimento",
      institution: "Universidade Federal de Santa Catarina (UFSC)",
      details:
        "Bolsista CAPES. Orientadora: Profa. Dra. Vânia Ribas Ulbricht. Foco em Ecologia do Conhecimento, Ciência de Redes, Cientometria, Inteligência Artificial e Governança Sociotécnica.",
    },
    {
      period: "01/2025 — 03/2026 (Em andamento)",
      degree: "MBA em Tecnologia para Negócios: AI, Data Science e Big Data",
      institution: "PUCRS — Pontifícia Universidade Católica do RS",
      details: "Especialização executiva (364 horas) em inteligência artificial aplicada a modelos de negócio, Big Data e tomada de decisão estratégica.",
    },
    {
      period: "02/2023 — 02/2025 (Concluído)",
      degree: "Mestrado em Engenharia e Gestão do Conhecimento",
      institution: "Universidade Federal de Santa Catarina (UFSC)",
      details:
        "Dissertação: 'ECO-CAOS: um metamodelo conceitual para ecossistemas de conhecimento e culturas de aprendizagem organizacional'. Bolsista CAPES. Orientadora: Dra. Vânia Ribas Ulbricht. Vencedor do Prêmio SBGC de Melhor Dissertação do Brasil.",
    },
    {
      period: "02/2016 — 12/2021 (Concluído)",
      degree: "Bacharelado em Engenharia Eletrônica",
      institution: "Universidade Federal de Santa Catarina (UFSC)",
      details:
        "TCC: 'Algoritmo Adaptativo para Redução de Ruído e Preservação de Pistas Acústicas Biauriculares para Aparelhos Auditivos'. Orientador: Prof. Dr. Márcio Holsbach Costa. Ênfase em Processamento Digital de Sinais e Áudio.",
    },
    {
      period: "2012 — 2016 (Concluído)",
      degree: "Curso Técnico em Eletrônica",
      institution: "Instituto Federal de Santa Catarina (IFSC)",
      details: "Formação técnica de nível médio integrada, com fundamentação em circuitos, instrumentação e sistemas embarcados.",
    },
  ],
  certifications: [
    { name: "Data Product Manager Nanodegree", issuer: "Udacity", year: "2021-2022", hours: "160h" },
    { name: "Deep Learning Specialization", issuer: "Coursera / deeplearning.ai", year: "2018", hours: "300h" },
    { name: "Python Programming", issuer: "Coursera", year: "2018", hours: "300h" },
    { name: "Introduction to Linear Models and Matrix Algebra", issuer: "edX / HarvardX", year: "2023" },
    { name: "Digital Marketing Channels: Planning", issuer: "Coursera", year: "2018", hours: "300h" },
    { name: "KM Brasil — Gestão do Conhecimento", issuer: "SBGC", year: "2023" },
  ],
  awards: [
    {
      year: "2025",
      title: "Prêmio SBGC — Melhor Dissertação de Mestrado",
      entity: "Sociedade Brasileira de Gestão do Conhecimento (SBGC)",
      description: "Reconhecimento nacional pela dissertação ECO-CAOS sobre ecossistemas de conhecimento e cultura de aprendizagem.",
    },
    {
      year: "2022",
      title: "Seleção na Série 'Histórias do Cotidiano'",
      entity: "Biblioteca Universitária (BU/UFSC)",
      description: "Trabalho literário selecionado para acervo e divulgação cultural institucional.",
    },
    {
      year: "2020",
      title: "Aprovado no Programa Centelha",
      entity: "FAPESC / MCTI / Finep",
      description: "Subvenção e fomento governamental à inovação tecnológica e empreendedorismo para a VI Mídia.",
    },
    {
      year: "2020",
      title: "Seleção no Concurso de Fotografia Documentária",
      entity: "Floripa Anônima",
      description: "Registro documental da paisagem urbana e memória social da Ilha de Santa Catarina.",
    },
    {
      year: "2016",
      title: "I Prêmio IFSC de Literatura — Seleção Fotográfica",
      entity: "Instituto Federal de Santa Catarina (IFSC)",
      description: "Premiação de ensaio visual e fotográfico autoral.",
    },
    {
      year: "2015",
      title: "Premiado no Concurso Literário Fragmentos do Medo",
      entity: "Três Macacos Premiações",
      description: "Publicação em antologia de microcontos de circulação nacional.",
    },
    {
      year: "2014",
      title: "Premiado no I Concurso de Contos do IFSC",
      entity: "Instituto Federal de Santa Catarina (IFSC)",
      description: "Primeiro lugar e menção honrosa na categoria prosa de ficção.",
    },
    {
      year: "2015 — 2018",
      title: "Inspiration Award & Rookie All-Star Award",
      entity: "FIRST Robotics Competition (Equipe FRC 5800 Magic Island Robotics)",
      description: "Prêmios de liderança, comunicação e impacto comunitário em engenharia robótica.",
    },
    {
      year: "2009, 2010, 2011",
      title: "Três Menções Honrosas consecutivas",
      entity: "Olimpíada Brasileira de Matemática das Escolas Públicas (OBMEP)",
      description: "Destaque acadêmico em raciocínio lógico e resolução de problemas matemáticos.",
    },
  ],
  allPublications: [
    {
      type: "Livro",
      year: "2025",
      citation: "SIMAS DA SILVA, Gustavo. E o que eu faço com isso?. 1. ed. São Paulo: Labrador, 2025. 112p.",
      link: "https://www.instagram.com/tudoemsimas/",
    },
    {
      type: "Livro",
      year: "2025",
      citation: "SIMAS DA SILVA, Gustavo. Tecnogonia: criando tecnologias que nos criam. 1. ed. Belo Horizonte: Caravana Grupo Editorial, 2025.",
      link: "https://caravanagrupoeditorial.com/livros/tecnogonia-criando-tecnologias-que-nos-criam/?v=2d3615d82bb9",
    },
    {
      type: "Livro",
      year: "2021",
      citation: "ZIMMERMANN, D.; SILVA, Gustavo Simas da (Orgs.). Antologia Pandemias. 1. ed. Florianópolis: Noveland, 2021. v. 1. 310p.",
    },
    {
      type: "Artigo Periódico",
      year: "2026",
      citation: "SILVA, Gustavo Simas da; ULBRICHT, V. R. An ESG-AI Matrix for Innovation Ecosystems. Sustainable Business International Journal, v. 1, p. 1-30, 2026.",
      link: "https://periodicos.uff.br/sbijournal/article/view/63124",
    },
    {
      type: "Artigo Periódico",
      year: "2026",
      citation: "SILVA, Gustavo Simas da; ULBRICHT, Vania Ribas. Technonecromancy: Simulacra of Presence and the Politics of Death in the Age of Generative Artificial Intelligence. Trilogía Ciencia Tecnología Sociedad, v. 18, p. 1-23, 2026.",
      link: "https://revistas.itm.edu.co/index.php/trilogia/article/view/3194",
    },
    {
      type: "Artigo Periódico",
      year: "2026",
      citation: "DA SILVA, Gustavo Simas; ULBRICHT, Vânia Ribas. Promptography and the reconfiguration of human creative agency. Revista Brasileira de Estudos CTS, v. 1, p. 38-59, 2026.",
      link: "https://revistabrasileiradeestudoscts.emnuvens.com.br/cts/article/view/100",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "AGUIAR, M.; SIMAS DA SILVA, Gustavo. Trajetórias de mulheres negras no ensino superior: barreiras, conquistas e caminhos para avanço. Aracê - Direitos Humanos em Revista, v. 7, p. 35563-35591, 2025.",
      link: "https://arace.emnuvens.com.br/arace/article/view/1012",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "SIMAS DA SILVA, Gustavo; LIMA, L. S.; ULBRICHT, V. R. Festival de aprendizagem como mobilizador do ecossistema de conhecimento organizacional. Caderno Pedagógico, v. 22, p. 1, 2025.",
      link: "https://ojs.studiespublicacoes.com.br/ojs/index.php/cadped/article/view/12975",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "DA SILVA, Gustavo Simas. Esperança e Psicopolítica em Superman (2025): Uma análise à luz das categorias de Byung-Chul Han. Lumen et Virtus, v. 16, p. 9548-9574, 2025.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "SILVA, Gustavo Simas da. Entre a dor pessoal e o sofrimento estrutural: uma crítica decolonial a Sociedade Paliativa de Byung-Chul Han. Lumen et Virtus, v. 16, p. 7889, 2025.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "SILVA, Gustavo Simas da; ULBRICHT, Vânia Ribas. Cidades inteligentes e sustentáveis? Uma análise comparativa dos índices CSC e IDSC em Florianópolis. Revista Políticas Públicas & Cidades, v. 14, p. e2686, 2025.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "SIMAS DA SILVA, Gustavo; RIBAS ULBRICHT, VÂNIA. A quantitative analysis of geographic, gender, and age distribution of Nobel Prize Laureates (1901-2025). International Journal of Knowledge Engineering and Management, v. 14, p. 1-17, 2025.",
      link: "https://ijkem.emnuvens.com.br/ijkem/article/view/287",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "DA SILVA, Gustavo Simas; ULBRICHT, Vânia Ribas. Padrões de Sustentabilidade: Uma análise de conceitos formais dos Objetivos de Desenvolvimento Sustentável nos estados brasileiros. Revista de Geopolítica, v. 16, p. e1096, 2025.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Artigo Periódico",
      year: "2025",
      citation: "SILVA, Gustavo Simas da. Narrativização como arquitetura temporal da memória. Revista Letras (Curitiba), v. 111, p. 1-50, 2025.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Artigo Periódico",
      year: "2023",
      citation: "DA SILVA, Gustavo Simas; LIMA, L. S.; FERRAZ, M. Z. Ecossistema de Conhecimento Organizacional: a visão sistêmica da interação entre Gestão do Conhecimento e Cultura de Aprendizagem. Inteligência Empresarial e Economia dos Intangíveis, v. 47, p. 1, 2023.",
      link: "https://repositorio.ufsc.br/handle/123456789/264422",
    },
    {
      type: "Capítulo",
      year: "2025",
      citation: "SILVA, Gustavo Simas da; ROSA, D. C.; FRANCO, L. H. R.; RAMOS, F. M.; ULBRICHT, V. R. Tecnologias para ouvir e comunicar: acesso, cultura e direitos de surdos e deficientes auditivos. In: Engenharia, Gestão e Inovação - Vol. 21. Poisson, 2025, p. 148-168.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Capítulo",
      year: "2025",
      citation: "RAMOS, F. M.; SILVA, Gustavo Simas da; FRANCO, J. A. S.; FRANCO, L. H. R.; SILVA, M. D.; ULBRICHT, V. R. Envelhecimento e inclusão: a importância da libras na comunicação com idosos surdos. In: Ciências Humanas e Sociais - Vol. 8. Poisson, 2025, p. 125-135.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Capítulo",
      year: "2024",
      citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, V. R.; VANZIN, T. Cidades Criativas UNESCO no Brasil e Economia Criativa em Ecossistemas Locais de Inovação: uma análise de indicadores. In: Ebook VIA TCDS 2. Florianópolis: Via Estação Conhecimento, 2024, v. 2, p. 15-40.",
      link: "https://via.ufsc.br/wp-content/uploads/ebook-VIA-TCDS-2-1.pdf",
    },
    {
      type: "Capítulo",
      year: "2024",
      citation: "SILVA, Gustavo Simas da; ULBRICHT, Vânia Ribas; VANZIN, Tarcísio. Gestão em Ecossistemas de Inovação: Modelo de banco de dados para governança ecossistêmica. In: Perspectivas em Engenharia, Mídias e Gestão do Conhecimento - Vol. 5. Arquétipos, 2024, p. 115-134.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Capítulo",
      year: "2024",
      citation: "DA SILVA, Gustavo Simas; ULBRICHT, Vânia Ribas. Learning with Conversational AI: ChatGPT and Bard/Gemini in Education. Cognition and Exploratory Learning in the Digital Age. Cham: Springer Nature Switzerland, 2024, p. 101-117.",
      link: "https://link.springer.com/chapter/10.1007/978-3-031-65881-5_7",
    },
    {
      type: "Congresso",
      year: "2024",
      citation: "SIMAS, Gustavo; RIBAS ULBRICHT, VÂNIA. Human-AI Interaction: An Analysis of Anthropomorphization and User Engagement in Conversational Agents with a Focus on ChatGPT. In: IHSI 2024 (Intelligent Human Systems Integration), Palermo, Itália, 2024.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Congresso",
      year: "2024",
      citation: "SIMAS DA SILVA, Gustavo; RIBAS ULBRICHT, VÂNIA. Design Feeling: a symmathetic approach for design processes. In: 15th International Conference on Applied Human Factors and Ergonomics (AHFE 2024), Nice, França, 2024.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Congresso",
      year: "2023",
      citation: "SIMAS DA SILVA, Gustavo. Towards Effective Ecosystems: A Framework for Mapping Knowledge Governance and Management Activities. In: 15th KMIS (Knowledge Management and Information Systems), Roma, Itália, 2023.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Congresso",
      year: "2023",
      citation: "SIMAS DA SILVA, Gustavo; VANZIN, T.; ULBRICHT, V. R. Entropy in Innovation and Creativity Measurement: An Integrative Review. In: XIII Congresso Internacional de Conhecimento e Inovação (ciKi), Florianópolis, 2023.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Congresso",
      year: "2023",
      citation: "SIMAS DA SILVA, Gustavo. Second Brain, GTD and Seek/Sense/Share: An Integration of Personal Knowledge Management Workflows. In: XIII Congresso Internacional de Conhecimento e Inovação (ciKi), Florianópolis, 2023.",
      link: "https://ciki.emnuvens.com.br/ciki/article/view/284",
    },
    {
      type: "Congresso",
      year: "2023",
      citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, V. R. ChatGPT and Bard in Education: A Comparative Review. In: CELDA 2023, Funchal, Portugal, 2023.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
    {
      type: "Congresso",
      year: "2023",
      citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, V. R.; FERRAZ, M. Z.; LIMA, L. S. Ecossistema de Conhecimento Organizacional: visão sistêmica entre Gestão do Conhecimento e Cultura de Aprendizagem. In: 18º KM Brasil, 2023.",
      link: "https://orcid.org/0000-0003-3485-7910",
    },
  ],
  artisticProduction: [
    {
      category: "Música & Fonografia",
      items: [
        "Rancho de Amor à Ilha (2026) — Releitura instrumental lofi do hino oficial de Florianópolis (composição original de Zininho), celebrando os 100 anos da Ponte Hercílio Luz.",
        "Berimbrasil (@brasil.wav) — Projeto de curadoria, valorização e difusão da música brasileira na cultura digital.",
        "Álbuns e Registros Fonográficos (2020-2024): ColoRio, CacofonIA, CacofonIA 2, Days, Slop, SinfonIA, Data! Data! Data!, Violando, Ruído, Marginal, Centauro, Radiola, Espectros, BON VIVANT, Frutaria, Rizomas, Ludic Dreams, Themes Songbook, Músicas Beta, Músicas Alfa, Quartos.",
        "Trilhas Sonoras Originais (2021): Heart of Darkness, 1984, O Marinheiro, Boats Against the Current, Triste Fim de Policarpo Quaresma, Hágil (com Gilberto Gil).",
      ],
    },
    {
      category: "Audiolivros & Inclusão",
      items: [
        "A Mecânica das Palavras (2022) — Audiolivro acessível.",
        "Retrato do Artista Quando Coisa (Manoel de Barros, 2021) — Adaptação fonográfica acessível.",
        "O Guardador de Rebanhos & O Marinheiro & Mensagem (Fernando Pessoa, 2020-2021) — Produção de audiolivro e audiodescrição.",
        "O Grande Gatsby (F. Scott Fitzgerald, 2021) — Audiolivro em áudio imersivo.",
      ],
    },
    {
      category: "Artes Visuais & Fotografia",
      items: [
        "Nemotom (2021) — Obra audiovisual e vídeo experimental.",
        "Floripa Anônima (2020) — Ensaio fotográfico documental.",
        "I Prêmio IFSC de Literatura (2017) — Série fotográfica premiada.",
      ],
    },
  ],
  projectsAndMethods: [
    {
      title: "Laboratório de Mídia e Inclusão Digital (LaMiD / UFSC)",
      period: "2023 — Atual",
      role: "Pesquisador / Integrante",
      description:
        "Levantamento, análise e sistematização das produções em acessibilidade digital e mídias do conhecimento como mediadores de inclusão sociotécnica para pessoas com deficiência.",
    },
    {
      title: "Metodologia ALI Ecossistemas",
      period: "2022",
      role: "Coautor / Desenvolvedor",
      description:
        "Metodologia técnica para diagnóstico, governança e ativação de Ecossistemas Locais de Inovação no Brasil, adotada pelo Sebrae e rede Impact Hub.",
    },
    {
      title: "Sistema Robotizado para Inspeção de Redes Elétricas (Celesc / LAR-UFSC)",
      period: "2018 — 2020",
      role: "Pesquisador bolsista de Iniciação Científica",
      description:
        "Projeto conceitual, prototipagem, patentes e interface web de robô para inspeção de linhas de distribuição de energia elétrica.",
    },
    {
      title: "Gestão de Tecnologia Médico-Hospitalar (CELEC / IEB-UFSC)",
      period: "2015",
      role: "Estagiário de Engenharia",
      description:
        "Estudo comparativo e gestão de detectores de batimento cardíaco fetal na Maternidade Carmela Dutra.",
    },
  ],
  skills: {
    governanceAndKnowledge: [
      "Governança de Inteligência Artificial",
      "Engenharia do Conhecimento",
      "Ecologia do Conhecimento",
      "Modelagem Conceitual de Sistemas",
      "Cultura de Aprendizagem Organizacional",
      "Ecossistemas Locais de Inovação (ELI)",
      "Gestão de Impacto Socioambiental",
    ],
    technical: [
      "MLOps e LLMOps (nível de gestão e ciclo de vida)",
      "Python (Pandas, NumPy, Scikit-Learn, PyTorch)",
      "TypeScript, React, Vite, Node.js",
      "Processamento Digital de Sinais (DSP de áudio/voz)",
      "Modelagem de Dados e Business Intelligence (BI)",
      "Tecnologia Assistiva e Acessibilidade Digital",
      "Engenharia de Prompt (Promptography)",
    ],
    languages: [
      { language: "Português", level: "Nativo" },
      { language: "Inglês", level: "Avançado / Fluente" },
      { language: "Espanhol", level: "Profissional" },
      { language: "Italiano", level: "Intermediário" },
      { language: "Francês", level: "Básico / Leitura" },
    ],
  },
};

const cvDataEn = {
  ...cvData,
  profile: {
    ...cvData.profile,
    titles: "PhD Candidate and Master in Knowledge Engineering and Management (UFSC) · Electronics Engineer (UFSC)",
    role: "Technical Analyst II — Artificial Intelligence at Sebrae/SC · CAPES Doctoral Research Fellow (LaMiD/UFSC) · Writer and Record Producer",
    location: "Florianópolis, Santa Catarina, Brazil",
    bio: "Energizing knowledge, reducing the unknown and advancing transformative innovation. His work approaches complexity by managing chaos and order through Knowledge Engineering, Management and Media, Innovation, Technology and Art. He is currently an AI Analyst at Sebrae/SC, a CAPES doctoral research fellow at the Media Laboratory (LaMiD/PPGEGC/UFSC), a writer and a record producer.",
  },
  experience: [
    {
      period: "06/2026 — Present",
      role: "Technical Analyst II — Artificial Intelligence",
      company: "Sebrae Santa Catarina",
      location: "Florianópolis, SC",
      bullets: [
        "Structuring and operating the governance of Sebrae/SC's AI Office.",
        "Monitoring, analyzing and validating corporate AI projects across technical and support areas, ensuring methodological compliance and quality.",
        "Supporting teams in developing AI project plans, risk matrices, schedules, indicators and expected results.",
        "Monitoring strategic nationwide AI projects aligned with Sebrae Nacional.",
        "Leading technical and compliance assessments of AI use cases and standardizing the solution lifecycle from pilot to production.",
        "Implementing AI performance metrics and monitoring (management-level MLOps/LLMOps) and coordinating training for institutional adoption.",
      ],
    },
    {
      period: "03/2025 — Present",
      role: "CAPES Doctoral Research Fellow",
      company: "Federal University of Santa Catarina (UFSC)",
      location: "Florianópolis, SC",
      bullets: [
        "CAPES research fellow at the Media Laboratory (LaMiD) within UFSC's Graduate Program in Knowledge Engineering, Management and Media (PPGEGC).",
        "Advanced research in knowledge ecology, network science, scientometrics, artificial intelligence and technology governance.",
        "Research on sociotechnical aspects of networked knowledge, including the structure and impact of technologies such as AI in organizational and academic settings.",
      ],
    },
    {
      period: "03/2025 — Present",
      role: "Scientific Reviewer",
      company: "Science Publishing Group",
      location: "International",
      bullets: ["Critical peer review of leading scientific papers in technology, artificial intelligence and knowledge management."],
    },
    {
      period: "01/2024 — 06/2026",
      role: "Innovation, Data and Governance Consultant",
      company: "Independent Consulting / Business",
      location: "Florianópolis, SC",
      bullets: [
        "Consulting in innovation, data, artificial intelligence, knowledge management and technology governance.",
        "Applying methodologies for organizational assessment and planning, indicator monitoring and change management.",
      ],
    },
    {
      period: "08/2023 — 04/2026",
      role: "Senior Innovation Analyst",
      company: "Impact Hub Brazil",
      location: "Florianópolis, SC",
      bullets: [
        "Research, Development and Innovation (R&D&I) for positive social and environmental impact.",
        "Development and implementation of methodologies for Local Innovation and Impact Ecosystems, including co-authorship of the ALI Ecosystems Methodology.",
        "Business intelligence and research on trends and emerging technologies.",
        "Assessment and monitoring of social and environmental impact through systems thinking and executive reporting.",
        "Knowledge management and engineering to capture, share and disseminate organizational practices.",
      ],
    },
    {
      period: "12/2021 — 08/2023",
      role: "Data Analyst",
      company: "Impact Hub Brazil",
      location: "Florianópolis, SC",
      bullets: [
        "Data analysis for innovation ecosystems and social and environmental impact.",
        "Design of analytical pipelines, business intelligence, organizational information governance and learning culture.",
      ],
    },
    {
      period: "04/2020 — 01/2024",
      role: "Co-founder, Record Producer and Audio Engineer",
      company: "VI Mídia Produtora (Visão Inclusiva)",
      location: "Florianópolis, SC",
      bullets: [
        "Co-founder and record producer of accessible educational and entertainment content.",
        "Production of audiobooks, audio description for print-disabled audiences and AI-assisted voice synthesis.",
        "Audio engineering, sound design and digital processing of voice signals.",
        "Owner of a service trademark registered with Brazil's National Institute of Industrial Property (INPI).",
      ],
    },
    {
      period: "04/2020 — 01/2021",
      role: "Literary Editor and Proofreader",
      company: "Noveland Publishing",
      location: "Florianópolis, SC",
      bullets: ["Textual and literary editing, manuscript assessment, editorial coordination and brand management."],
    },
    {
      period: "07/2018 — 02/2020",
      role: "Undergraduate Research Fellow (Robotics R&D)",
      company: "Applied Robotics Laboratory (LAR/UFSC)",
      location: "Florianópolis, SC",
      bullets: [
        "R&D of a robotic inspection system for electric power distribution lines through a Celesc/Mechanical Engineering Department partnership.",
        "Systematic literature review, CAD/SolidWorks modeling, patents, scientific papers and web interface/application development.",
      ],
    },
    {
      period: "01/2017 — 02/2018",
      role: "Engineering Intern",
      company: "CIASC — Santa Catarina Center for Information Technology and Automation",
      location: "Florianópolis, SC",
      bullets: [
        "Development of a predictive monitoring system for a data center.",
        "Sensing and alerts for critical variables such as temperature, humidity, flooding and fire using Zabbix, Arduino and Computational Fluid Dynamics (CFD).",
      ],
    },
    {
      period: "02/2015 — 07/2015",
      role: "Clinical Engineering Intern",
      company: "Institute of Biomedical Engineering (IEB-UFSC / Carmela Dutra)",
      location: "Florianópolis, SC",
      bullets: ["Healthcare Technology Management, quality control, corrective and preventive maintenance, and technical training."],
    },
  ],
  education: [
    {
      period: "01/2025 — 03/2029 (In progress)",
      degree: "PhD in Knowledge Engineering, Management and Media",
      institution: "Federal University of Santa Catarina (UFSC)",
      details: "CAPES fellow. Advisor: Prof. Vânia Ribas Ulbricht, PhD. Focus on Knowledge Ecology, Network Science, Scientometrics, Artificial Intelligence and Sociotechnical Governance.",
    },
    {
      period: "01/2025 — 03/2026 (In progress)",
      degree: "MBA in Technology for Business: AI, Data Science and Big Data",
      institution: "Pontifical Catholic University of Rio Grande do Sul (PUCRS)",
      details: "Executive specialization (364 hours) in artificial intelligence applied to business models, Big Data and strategic decision-making.",
    },
    {
      period: "02/2023 — 02/2025 (Completed)",
      degree: "Master's in Knowledge Engineering and Management",
      institution: "Federal University of Santa Catarina (UFSC)",
      details: "Thesis: 'ECO-CAOS: a conceptual metamodel for knowledge ecosystems and organizational learning cultures.' CAPES fellow. Advisor: Vânia Ribas Ulbricht, PhD. Winner of the SBGC Award for Brazil's Best Master's Thesis.",
    },
    {
      period: "02/2016 — 12/2021 (Completed)",
      degree: "Bachelor's in Electronics Engineering",
      institution: "Federal University of Santa Catarina (UFSC)",
      details: "Undergraduate thesis: 'Adaptive Algorithm for Noise Reduction and Preservation of Binaural Acoustic Cues for Hearing Aids.' Advisor: Prof. Márcio Holsbach Costa, PhD. Emphasis on Digital Signal and Audio Processing.",
    },
    {
      period: "2012 — 2016 (Completed)",
      degree: "Technical Diploma in Electronics",
      institution: "Federal Institute of Santa Catarina (IFSC)",
      details: "Integrated secondary-level technical education grounded in circuits, instrumentation and embedded systems.",
    },
  ],
  certifications: [
    { name: "Data Product Manager Nanodegree", issuer: "Udacity", year: "2021-2022", hours: "160h" },
    { name: "Deep Learning Specialization", issuer: "Coursera / deeplearning.ai", year: "2018", hours: "300h" },
    { name: "Python Programming", issuer: "Coursera", year: "2018", hours: "300h" },
    { name: "Introduction to Linear Models and Matrix Algebra", issuer: "edX / HarvardX", year: "2023" },
    { name: "Digital Marketing Channels: Planning", issuer: "Coursera", year: "2018", hours: "300h" },
    { name: "KM Brazil — Knowledge Management", issuer: "SBGC", year: "2023" },
  ],
  awards: [
    { year: "2025", title: "SBGC Award — Best Master's Thesis", entity: "Brazilian Society for Knowledge Management (SBGC)", description: "National recognition for the ECO-CAOS thesis on knowledge ecosystems and learning culture." },
    { year: "2022", title: "Selected for the 'Everyday Stories' Series", entity: "University Library (BU/UFSC)", description: "Literary work selected for the institutional collection and cultural outreach." },
    { year: "2020", title: "Selected for the Centelha Program", entity: "FAPESC / MCTI / Finep", description: "Government grant and support for VI Mídia's technology innovation and entrepreneurship." },
    { year: "2020", title: "Selected for the Documentary Photography Competition", entity: "Floripa Anônima", description: "Documentary record of the urban landscape and social memory of Santa Catarina Island." },
    { year: "2016", title: "1st IFSC Literature Award — Photography Selection", entity: "Federal Institute of Santa Catarina (IFSC)", description: "Award for an original visual and photographic essay." },
    { year: "2015", title: "Fragmentos do Medo Literary Competition Award", entity: "Três Macacos Premiações", description: "Publication in a nationally distributed flash-fiction anthology." },
    { year: "2014", title: "1st IFSC Short Story Competition Award", entity: "Federal Institute of Santa Catarina (IFSC)", description: "First place and honorable mention in the fiction prose category." },
    { year: "2015 — 2018", title: "Inspiration Award & Rookie All-Star Award", entity: "FIRST Robotics Competition (FRC Team 5800 Magic Island Robotics)", description: "Awards for leadership, communication and community impact in robotics engineering." },
    { year: "2009, 2010, 2011", title: "Three Consecutive Honorable Mentions", entity: "Brazilian Public School Mathematics Olympiad (OBMEP)", description: "Academic distinction in logical reasoning and mathematical problem-solving." },
  ],
  allPublications: cvData.allPublications,
  artisticProduction: [
    {
      category: "Music & Record Production",
      items: [
        "Rancho de Amor à Ilha (2026) — Instrumental lo-fi reinterpretation of Florianópolis's official anthem (original composition by Zininho), celebrating the 100th anniversary of the Hercílio Luz Bridge.",
        "Berimbrasil (@brasil.wav) — A project for curating, promoting and sharing Brazilian music in digital culture.",
        "Albums and Recordings (2020–2024): ColoRio, CacofonIA, CacofonIA 2, Days, Slop, SinfonIA, Data! Data! Data!, Violando, Ruído, Marginal, Centauro, Radiola, Espectros, BON VIVANT, Frutaria, Rizomas, Ludic Dreams, Themes Songbook, Músicas Beta, Músicas Alfa, Quartos.",
        "Original Soundtracks (2021): Heart of Darkness, 1984, O Marinheiro, Boats Against the Current, Triste Fim de Policarpo Quaresma, Hágil (with Gilberto Gil).",
      ],
    },
    {
      category: "Audiobooks & Inclusion",
      items: [
        "A Mecânica das Palavras (2022) — Accessible audiobook.",
        "Retrato do Artista Quando Coisa (Manoel de Barros, 2021) — Accessible audio adaptation.",
        "O Guardador de Rebanhos & O Marinheiro & Mensagem (Fernando Pessoa, 2020–2021) — Audiobook and audio-description production.",
        "The Great Gatsby (F. Scott Fitzgerald, 2021) — Immersive-audio audiobook.",
      ],
    },
    {
      category: "Visual Arts & Photography",
      items: [
        "Nemotom (2021) — Audiovisual work and experimental video.",
        "Floripa Anônima (2020) — Documentary photography essay.",
        "1st IFSC Literature Award (2017) — Award-winning photography series.",
      ],
    },
  ],
  projectsAndMethods: [
    { title: "Media and Digital Inclusion Laboratory (LaMiD / UFSC)", period: "2023 — Present", role: "Researcher / Member", description: "Surveying, analyzing and systematizing research on digital accessibility and knowledge media as mediators of sociotechnical inclusion for people with disabilities." },
    { title: "ALI Ecosystems Methodology", period: "2022", role: "Co-author / Developer", description: "Technical methodology for diagnosing, governing and activating Local Innovation Ecosystems in Brazil, adopted by Sebrae and the Impact Hub network." },
    { title: "Robotic System for Power Grid Inspection (Celesc / LAR-UFSC)", period: "2018 — 2020", role: "Undergraduate Research Fellow", description: "Conceptual design, prototyping, patents and web interface for a robot that inspects electric power distribution lines." },
    { title: "Healthcare Technology Management (CELEC / IEB-UFSC)", period: "2015", role: "Engineering Intern", description: "Comparative study and management of fetal heartbeat detectors at Carmela Dutra Maternity Hospital." },
  ],
  skills: {
    governanceAndKnowledge: [
      "Artificial Intelligence Governance",
      "Knowledge Engineering",
      "Knowledge Ecology",
      "Conceptual Systems Modeling",
      "Organizational Learning Culture",
      "Local Innovation Ecosystems (ELI)",
      "Social and Environmental Impact Management",
    ],
    technical: [
      "MLOps and LLMOps (management and lifecycle level)",
      "Python (Pandas, NumPy, Scikit-Learn, PyTorch)",
      "TypeScript, React, Vite, Node.js",
      "Digital Signal Processing (audio/voice DSP)",
      "Data Modeling and Business Intelligence (BI)",
      "Assistive Technology and Digital Accessibility",
      "Prompt Engineering (Promptography)",
    ],
    languages: [
      { language: "Portuguese", level: "Native" },
      { language: "English", level: "Advanced / Fluent" },
      { language: "Spanish", level: "Professional" },
      { language: "Italian", level: "Intermediate" },
      { language: "French", level: "Basic / Reading" },
    ],
  },
};

const cvCopy = {
  pt: {
    back: "Voltar ao atlas",
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
    back: "Back to the atlas",
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

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/$/, ""));
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, ""));
    };
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    localStorage.setItem("language", language);
  }, [language]);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path.replace(/\/$/, ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCurriculum = currentPath === "/curriculo";

  return isCurriculum ? (
    <Curriculum navigate={navigate} language={language} setLanguage={setLanguage} />
  ) : (
    <Portfolio navigate={navigate} language={language} setLanguage={setLanguage} />
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
  const copy = portfolioCopy[language];
  const isPt = language === "pt";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("high-contrast", contrast);
    document.documentElement.style.setProperty("--font-scale", String(1 + fontSize * 0.1));
    localStorage.setItem("theme", theme);
    localStorage.setItem("font-size-step", String(fontSize));
  }, [theme, contrast, fontSize]);

  const visibleProjects = useMemo(
    () => (filter === "Todos" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );

  const navigation: Array<{ label: string; href: string; isRoute?: boolean }> = [
    { label: copy.nav[0], href: "#manifesto" },
    { label: copy.nav[1], href: "#eixos" },
    { label: copy.nav[2], href: "#trabalhos" },
    { label: copy.nav[3], href: "#musica" },
    { label: copy.nav[4], href: "#trajetoria" },
    { label: copy.nav[5], href: "#publicacoes" },
    { label: copy.nav[6], href: "/curriculo", isRoute: true },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
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
          <button className="icon-button mobile-menu-button" onClick={() => setMenu(!menu)} aria-label={menu ? copy.header.closeMenu : copy.header.menu}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
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
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="signal" /> {copy.hero.location}
            </p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
              {copy.hero.line1}
              <br />
              <em>{copy.hero.emphasis}</em>
              <br />
              {copy.hero.line3}
            </motion.h1>
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
            <div className="filters" role="group" aria-label={copy.portfolio.filterAria}>
              {(["Todos", "Pesquisa", "Tecnologia", "Literatura", "Música", "Visual"] as const).map((item) => (
                <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                  {categoryLabels[language][item]}
                </button>
              ))}
            </div>
            <motion.div layout className="project-grid">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project) => (
                  <ProjectCard key={project.title} project={project} language={language} />
                ))}
              </AnimatePresence>
            </motion.div>
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
                <img src="/assets/ranchodoamor.jpg" alt={copy.audio.ranchAlt} />
                <span className="album-tag-overlay">Rancho de Amor à Ilha</span>
              </div>
              <div className="album-card image-berim" title="Berimbrasil">
                <img src="/assets/berimbrasil.jpg" alt={copy.audio.berimAlt} />
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
                <img src="/assets/fotoperf.jpeg" alt={copy.trajectory.portraitAlt} />
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
            <a className="contact-email" href="mailto:gustavosimassilva@gmail.com">
              gustavosimassilva@gmail.com <ArrowUpRight />
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
    <motion.div className="hero-atlas" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} aria-label={copy.aria}>
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
    </motion.div>
  );
}

function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-marker">
      <span>{number}</span>
      <span>{label}</span>
    </div>
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
    <motion.article className="axis-card" whileHover={{ y: -8 }}>
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
    </motion.article>
  );
}

function ProjectCard({ project, language }: { project: Project; language: Language }) {
  const translation = language === "en" ? projectTranslationsEn[project.title] : undefined;
  const title = translation?.title ?? project.title;
  const description = translation?.description ?? project.description;
  const category = categoryLabels[language][project.category];

  return (
    <motion.a
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`project-card ${project.featured ? "is-featured" : ""}`}
      href={project.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className={`project-visual visual-${project.visual}`}>
        {project.image ? (
          <img src={project.image} alt={language === "pt" ? `Capa de ${title}` : `Cover of ${title}`} />
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
    </motion.a>
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

// --------------------------------------------------------------------------
// CURRICULUM PAGE COMPONENT
// --------------------------------------------------------------------------
type CvTab = "tudo" | "experiencia" | "formacao" | "premios" | "publicacoes" | "arte" | "projetos";

function Curriculum({
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
  const isPt = language === "pt";
  const data = isPt ? cvData : cvDataEn;
  const copy = cvCopy[language];

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
    <main className="cv-page">
      <nav className="cv-toolbar">
        <button className="cv-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> {copy.back}
        </button>
        <div className="cv-toolbar-right">
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
        <div className="cv-interactive-tabs" role="tablist" aria-label={copy.tabsAria}>
          {copy.tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`cv-tab ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id as CvTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

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

export default App;
