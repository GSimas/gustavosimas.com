// Home page content, shared by the pages and Tavo's knowledge base
// (netlify/functions/tavo.ts): one source, so the assistant never drifts from
// what the site says.

export type Category = "Pesquisa" | "Tecnologia" | "Literatura" | "Audiovisual" | "Jogos";
export type Language = "pt" | "en";

export interface Project {
  title: string;
  category: Category;
  year: string;
  description: string;
  href: string;
  visual: string;
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Tecnogonia: criando tecnologias que nos criam",
    category: "Literatura",
    year: "2025",
    description:
      "Ensaio sobre as tecnologias que criamos — e que, silenciosamente, também nos criam. Publicado pela Editora Caravana.",
    href: "https://tecnogonia.gustavosimas.com",
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
    href: "https://eoqueeufacocomisso.gustavosimas.com",
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
    category: "Audiovisual",
    year: "2026",
    description:
      "Releitura instrumental e lofi do hino oficial de Florianópolis (composição de Zininho), em homenagem ao centenário da Ponte Hercílio Luz.",
    href: "https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz",
    visual: "ranchodoamor",
    image: "/assets/ranchodoamor.jpg",
  },
  {
    title: "Berimbrasil",
    category: "Audiovisual",
    year: "Em curso",
    description:
      "Curadoria e valorização da música brasileira em diálogo com memória, escuta e cultura digital (@brasil.wav).",
    href: "https://instagram.com/brasil.wav",
    visual: "brasil",
    image: "/assets/berimbrasil.jpg",
  },
  {
    title: "Tecnomágica",
    category: "Audiovisual",
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
    href: "https://promptografia.scientata.com/",
    visual: "agency",
    image: "/assets/promptografia-cover.svg",
  },
  {
    title: "Trajetórias de mulheres negras no ensino superior",
    category: "Pesquisa",
    year: "2025",
    description:
      "Revisão narrativa sobre raça, gênero, classe e regionalidade nas trajetórias de mulheres negras no ensino superior brasileiro: as barreiras para entrar e permanecer, as estratégias de resistir e o que a estrutura move quando elas chegam (Revista Aracê, com Marcela Aguiar).",
    href: "https://trajetoriamulheresnegras.scientata.com/",
    visual: "trajetorias",
    image: "/assets/trajetorias-cover.svg",
  },
  {
    title: "Interação Humano-IA: Antropomorfização & Engajamento no ChatGPT",
    category: "Pesquisa",
    year: "2024",
    description:
      "Revisão de escopo sobre atribuir traços humanos a agentes conversacionais: o que a antropomorfização do ChatGPT ganha em engajamento, confiança e aceitação, e o que cobra em excesso de confiança, privacidade e acurácia (AHFE/IHSI 2024, com Vânia Ulbricht).",
    href: "https://ihsi2024.scientata.com/",
    visual: "ihsi",
    image: "/assets/ihsi2024-cover.svg",
  },
  {
    title: "The Role of Knowledge Engineering, Management and Media in the Knowledge Society",
    category: "Pesquisa",
    year: "2024",
    description:
      "Agenda de pesquisa para a intersecção entre engenharia, gestão e mídia do conhecimento em organizações intensivas em conhecimento, a partir de uma revisão de escopo em cinco etapas que contrasta paradigmas ocidentais e orientais (ECKM 2024, com Flávia Conti e Willian Andrade).",
    href: "https://eckm2024.scientata.com/",
    visual: "eckm",
    image: "/assets/eckm2024-cover.svg",
  },
  {
    title: "Algoritmo adaptativo para aparelhos auditivos",
    category: "Pesquisa",
    year: "2021",
    description:
      "Trabalho de conclusão em Engenharia Eletrônica (UFSC): um algoritmo que reduz ruído em aparelhos auditivos sem apagar as pistas acústicas que dizem de onde o som vem — e o compromisso que essa preservação cobra.",
    href: "https://tcc.gustavosimas.com/",
    visual: "biauricular",
    image: "/assets/tcc-biauricular-cover.svg",
  },
  {
    title: "VI Mídia Produtora",
    category: "Audiovisual",
    year: "2020 — 2024",
    description:
      "Engenharia de áudio, design de som e produção fonográfica acessível para educação e entretenimento (audiolivros, audiodescrição e tecnologia assistiva).",
    href: "https://www.linkedin.com/in/simasgs/",
    visual: "vimidia",
    image: "/assets/mensagem-audiolivro.jpg",
  },
  {
    title: "Scientata",
    category: "Tecnologia",
    year: "2026",
    description:
      "Ecossistema para pesquisa científica que reúne ferramentas, narrativas digitais interativas, conteúdo e consultoria.",
    href: "https://scientata.com/",
    visual: "scientata",
    image: "/assets/scientata-cover.svg",
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
    title: "DataVizLab",
    category: "Tecnologia",
    year: "2026",
    description:
      "Plataforma com 78 métodos, recomendador e estúdio local para escolher, construir, auditar e exportar visualizações de dados claras, acessíveis e adequadas à pergunta analítica.",
    href: "https://datavizlab.scientata.com/",
    visual: "datavizlab",
    image: "/assets/datavizlab-cover.svg",
  },
  {
    title: "TokenLab",
    category: "Tecnologia",
    year: "2026",
    description:
      "Analisador local para contar tokens, simular estratégias de chunking e estimar carga, sobreposição e requisições antes de indexar bases de conhecimento em pipelines de RAG.",
    href: "https://tokenlab.scientata.com/",
    visual: "tokenlab",
    image: "/assets/tokenlab-cover.svg",
  },
  {
    title: "RAPI 2025",
    category: "Tecnologia",
    year: "2026",
    description:
      "Dashboard interativo do 9º Relatório Anual de Progresso dos Indicadores de Florianópolis: 206 indicadores de sustentabilidade ambiental, urbana e fiscal pela metodologia CES/BID, acompanhados desde 2017, com explorador e leitura assistida por IA.",
    href: "https://rapi2025.scientata.com/",
    visual: "rapi",
    image: "/assets/rapi-cover.svg",
  },
  {
    title: "Dashboard Folha de Coqueiros",
    category: "Tecnologia",
    year: "2026",
    description:
      "Inteligência de dados territoriais sobre o acervo de um jornal de bairro: 864 matérias categorizadas por IA, rede de atores, diagramas de enlace causal e assistente editorial para ler o território.",
    href: "https://folhadecoqueiros.netlify.app/",
    visual: "folha-coqueiros",
    image: "/assets/folha-coqueiros-cover.svg",
  },
  {
    title: "Entreletras",
    category: "Jogos",
    year: "2026",
    description:
      "Jogo de palavras em português: você escreve uma horizontal e o dicionário responde com as verticais que cruzam cada letra. Dois modos — Trama, com a palavra escondida do dia, e Bistrô, livre e sem fim.",
    href: "https://entreletras.io/",
    visual: "entreletras",
    image: "/assets/entreletras-cover.svg",
  },
  {
    title: "Colorima",
    category: "Jogos",
    year: "2026",
    description:
      "Jogo de reflexo cognitivo sobre o efeito Stroop invertido: em vez de ler a palavra é preciso inibir a leitura e responder à cor em que ela está escrita. Três modos — clássico, rush contra o tempo e zen, sem placar.",
    href: "https://colorima.gustavosimas.com/",
    visual: "colorima",
    image: "/assets/colorima-cover.svg",
  },
  {
    title: "LIFE∞ — Infinite Life Lab",
    category: "Jogos",
    year: "2026",
    description:
      "Laboratório interativo do Jogo da Vida de Conway em canvas infinito para criar padrões, acompanhar métricas e explorar emergência, auto-organização, complexidade e vida artificial.",
    href: "https://gameoflife.gustavosimas.com/",
    visual: "life-infinite",
    image: "/assets/life-infinite-cover.svg",
  },
];

export const projectTranslationsEn: Record<string, { title: string; description: string }> = {
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
  "Trajetórias de mulheres negras no ensino superior": {
    title: "Black women's paths through higher education",
    description: "A narrative review of race, gender, class and region in the paths Black women take through Brazilian higher education: the barriers to getting in and staying, the strategies for holding on, and what the structure itself moves once they arrive (Revista Aracê, with Marcela Aguiar).",
  },
  "Interação Humano-IA: Antropomorfização & Engajamento no ChatGPT": {
    title: "Human-AI Interaction: Anthropomorphization & Engagement in ChatGPT",
    description: "A scoping review of what happens when we lend human traits to conversational agents: what anthropomorphizing ChatGPT gains in engagement, trust and acceptance, and what it costs in overreliance, privacy and accuracy (AHFE/IHSI 2024, with Vânia Ulbricht).",
  },
  "The Role of Knowledge Engineering, Management and Media in the Knowledge Society": {
    title: "The Role of Knowledge Engineering, Management and Media in the Knowledge Society",
    description: "A research agenda for the intersection of knowledge engineering, management and media in knowledge-intensive organizations, drawn from a five-stage scoping review that sets Western and Eastern paradigms against each other (ECKM 2024, with Flávia Conti and Willian Andrade).",
  },
  "Algoritmo adaptativo para aparelhos auditivos": {
    title: "An adaptive algorithm for hearing aids",
    description: "An undergraduate thesis in Electronic Engineering (UFSC): an algorithm that cuts noise in hearing aids without erasing the acoustic cues that tell you where a sound is coming from — and the trade-off that preservation demands.",
  },
  "VI Mídia Produtora": {
    title: "VI Mídia Production",
    description: "Audio engineering, sound design and accessible phonographic production for education and entertainment, including audiobooks, audio description and assistive technology.",
  },
  Scientata: {
    title: "Scientata",
    description: "An ecosystem for scientific research bringing together tools, interactive digital narratives, content and consultancy.",
  },
  Simetrics: {
    title: "Simetrics",
    description: "A bibliometric and scientometric intelligence platform that turns up to 10,000 documents into indicators, knowledge networks and thematic maps — processed locally in the browser.",
  },
  "LIFE∞ — Infinite Life Lab": {
    title: "LIFE∞ — Infinite Life Lab",
    description: "An interactive Conway's Game of Life laboratory on an infinite canvas for creating patterns, tracking metrics and exploring emergence, self-organization, complexity and artificial life.",
  },
  DataVizLab: {
    title: "DataVizLab",
    description: "A platform with 78 methods, a recommender and a local studio for choosing, building, auditing and exporting clear, accessible visualizations suited to the analytical question.",
  },
  TokenLab: {
    title: "TokenLab",
    description: "A local analyzer for counting tokens, simulating chunking strategies and estimating load, overlap and requests before indexing knowledge bases in RAG pipelines.",
  },
  "RAPI 2025": {
    title: "RAPI 2025",
    description: "An interactive dashboard for Florianópolis' 9th Annual Indicator Progress Report: 206 environmental, urban and fiscal sustainability indicators under the IDB's CES methodology, tracked since 2017, with an explorer and AI-assisted reading.",
  },
  "Dashboard Folha de Coqueiros": {
    title: "Folha de Coqueiros Dashboard",
    description: "Territorial data intelligence over a neighbourhood newspaper's archive: 864 articles categorised by AI, an actor network, causal loop diagrams and an editorial assistant for reading the territory.",
  },
  Colorima: {
    title: "Colorima",
    description: "A cognitive reflex game built on the inverted Stroop effect: instead of reading the word you have to hold the reading back and answer the colour it is printed in. Three modes — classic, a rush against the clock, and zen, with no score.",
  },
  Entreletras: {
    title: "Entreletras",
    description: "A Portuguese word game: you write a horizontal word and the dictionary answers with the verticals crossing each of its letters. Two modes — Trama, with a hidden word of the day, and Bistrô, free and endless.",
  },
};

export const categoryLabels: Record<Language, Record<"Todos" | Category, string>> = {
  pt: { Todos: "Todos", Pesquisa: "Pesquisa", Tecnologia: "Tecnologia", Literatura: "Literatura", Audiovisual: "Audiovisual", Jogos: "Jogos" },
  en: { Todos: "All", Pesquisa: "Research", Tecnologia: "Technology", Literatura: "Literature", Audiovisual: "Audiovisual", Jogos: "Games" },
};

export const highlightPublications = [
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
    link: "https://tecnonecromancia.scientata.com/",
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
    link: "https://ihsi2024.scientata.com",
  },
];
export const portfolioCopy = {
  pt: {
    brandTagline: "Conhecimento · tecnologia · imaginação",
    nav: ["Manifesto", "Portfólio", "Trajetória", "Currículo", "Criações"],
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
      line1: "Entre Arte",
      emphasis: "e Ciência,",
      line3: "criando inovações",
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
    portfolio: {
      label: "Portfólio de projetos",
      title1: "Portfólio de",
      title2: "projetos.",
      subtitle: "Alguns livros, pesquisas, plataformas, álbuns e experimentos conectados pelas perguntas que os originaram.",
      filterAria: "Filtrar trabalhos",
      searchPlaceholder: "Pesquisar projetos, tecnologias ou termos...",
      searchAria: "Pesquisar no portfólio",
      noResults: "Nenhum projeto encontrado para esta busca.",
      previous: "Anterior",
      next: "Próximo",
      page: "Página",
      pageOf: "de",
      pagerAria: "Paginação do portfólio",
    },
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
    contact: { kicker: "Disponível para projetos, pesquisa e colaboração", title1: "Vamos imaginar", title2: "alguma coisa", title3: "juntos?", description: "Conhecimento, tecnologia e arte para pensar o presente e inventar futuros." },
    footer: { location: "Florianópolis · Brasil", text: "© 2026 · Conhecimento · tecnologia · imaginação", top: "Voltar ao topo" },
    atlas: { aria: "Atlas dos três eixos", core: "Conhecimento", nodes: ["Investigar", "Sistematizar", "Criar"] },
  },
  en: {
    brandTagline: "Knowledge · technology · imagination",
    nav: ["Manifesto", "Portfolio", "Journey", "CV", "Creations"],
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
      line1: "Between Art",
      emphasis: "and Science,",
      line3: "creating innovations",
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
    portfolio: {
      label: "Project portfolio",
      title1: "Project",
      title2: "portfolio.",
      subtitle: "Books, research, platforms, albums and experiments connected by the questions that originated them.",
      filterAria: "Filter projects",
      searchPlaceholder: "Search projects, technologies or terms...",
      searchAria: "Search portfolio",
      noResults: "No projects found matching this search.",
      previous: "Previous",
      next: "Next",
      page: "Page",
      pageOf: "of",
      pagerAria: "Portfolio pagination",
    },
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
    contact: { kicker: "Available for projects, research and collaboration", title1: "Shall we imagine", title2: "something", title3: "together?", description: "Knowledge, technology and art to think through the present and invent futures." },
    footer: { location: "Florianópolis · Brazil", text: "© 2026 · Knowledge · technology · imagination", top: "Back to top" },
    atlas: { aria: "Atlas of the three axes", core: "Knowledge", nodes: ["Investigate", "Systematize", "Create"] },
  },
} as const;
