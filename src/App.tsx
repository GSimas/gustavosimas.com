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
  Orbit,
  Palette,
  Search,
  Sparkles,
  Sun,
  Trophy,
  Type,
  Volume2,
  X,
} from "lucide-react";

type Category = "Pesquisa" | "Tecnologia" | "Literatura" | "Música" | "Visual";

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
    href: "https://repositorio.ufsc.br/handle/123456789/264422",
    visual: "eco",
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
    href: "https://revistabrasileiradeestudoscts.emnuvens.com.br/cts/article/view/100",
    visual: "agency",
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
];

const highlightPublications = [
  {
    title: "Promptography and the reconfiguration of human creative agency",
    source: "Revista Brasileira de Estudos CTS",
    year: "2026",
    authors: "Da Silva, Gustavo Simas; Ulbricht, Vânia Ribas",
    link: "https://revistabrasileiradeestudoscts.emnuvens.com.br/cts/article/view/100",
  },
  {
    title: "Technonecromancy: Simulacra of Presence and the Politics of Death in the Age of Generative AI",
    source: "Trilogía Ciencia Tecnología Sociedad",
    year: "2026",
    authors: "Silva, Gustavo Simas da; Ulbricht, Vania Ribas",
    link: "https://revistas.itm.edu.co/index.php/trilogia/article/view/3194",
  },
  {
    title: "An ESG-AI Matrix for Innovation Ecosystems",
    source: "Sustainable Business International Journal",
    year: "2026",
    authors: "Silva, Gustavo Simas da; Ulbricht, V. R.",
    link: "https://periodicos.uff.br/sbijournal/article/view/63124",
  },
  {
    title: "A quantitative analysis of geographic, gender, and age distribution of Nobel Prize Laureates (1901-2025)",
    source: "International Journal of Knowledge Engineering and Management",
    year: "2025",
    authors: "Simas da Silva, Gustavo; Ribas Ulbricht, Vânia",
    link: "https://ijkem.emnuvens.com.br/ijkem/article/view/287",
  },
  {
    title: "Ecossistema de Conhecimento Organizacional: GC e Cultura de Aprendizagem",
    source: "Inteligência Empresarial e Economia dos Intangíveis",
    year: "2023",
    authors: "Da Silva, Gustavo Simas; Lima, L. S.; Ferraz, M. Z.",
    link: "https://repositorio.ufsc.br/handle/123456789/264422",
  },
  {
    title: "Human-AI Interaction: Anthropomorphization and User Engagement in Conversational Agents",
    source: "IHSI 2024 · Palermo, Itália",
    year: "2024",
    authors: "Simas, Gustavo; Ribas Ulbricht, Vânia",
    link: "https://orcid.org/0000-0003-3485-7910",
  },
];

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

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/$/, ""));

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, ""));
    };
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path.replace(/\/$/, ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCurriculum = currentPath === "/curriculo";

  return isCurriculum ? <Curriculum navigate={navigate} /> : <Portfolio navigate={navigate} />;
}

function Portfolio({ navigate }: { navigate: (path: string) => void }) {
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("theme") as "dark" | "light") || "dark");
  const [contrast, setContrast] = useState(false);
  const [fontSize, setFontSize] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState<"Todos" | Category>("Todos");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("high-contrast", contrast);
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    document.documentElement.style.setProperty("--font-scale", String(1 + fontSize * 0.1));
    localStorage.setItem("theme", theme);
  }, [theme, contrast, fontSize, reduceMotion]);

  const visibleProjects = useMemo(
    () => (filter === "Todos" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );

  const navigation: Array<{ label: string; href: string; isRoute?: boolean }> = [
    { label: "Manifesto", href: "#manifesto" },
    { label: "Eixos", href: "#eixos" },
    { label: "Portfólio", href: "#trabalhos" },
    { label: "Áudio", href: "#musica" },
    { label: "Trajetória", href: "#trajetoria" },
    { label: "Publicações", href: "#publicacoes" },
    { label: "Currículo", href: "/curriculo", isRoute: true },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Gustavo Simas — início">
          <span className="brand-mark">GS</span>
          <span>
            <strong>Gustavo Simas</strong>
            <small>Conhecimento · tecnologia · imaginação</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
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
        <div className="header-actions" aria-label="Preferências de visualização">
          <button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Alternar tema">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button className="icon-button" onClick={() => setContrast(!contrast)} aria-pressed={contrast} aria-label="Alto contraste">
            <Contrast />
          </button>
          <button className="icon-button" onClick={() => setFontSize((fontSize + 1) % 3)} aria-label="Aumentar fonte">
            <Type />
          </button>
          <button
            className="icon-button desktop-motion"
            onClick={() => setReduceMotion(!reduceMotion)}
            aria-pressed={reduceMotion}
            aria-label="Reduzir movimento"
          >
            <Orbit />
          </button>
          <button className="icon-button mobile-menu-button" onClick={() => setMenu(!menu)} aria-label="Abrir menu">
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
              <span className="signal" /> Florianópolis · Brasil · 2026
            </p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
              Pesquiso as
              <br />
              <em>tecnologias</em>
              <br />
              que nos criam.
            </motion.h1>
            <p className="hero-lede">
              Engenheiro do conhecimento, pesquisador, escritor, produtor fonográfico e artista multimídia. Minha prática atravessa ecossistemas de inovação, ecologia do conhecimento, inteligência artificial, literatura e audiovisual.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#trabalhos">
                Explorar trabalhos <ArrowDown size={16} />
              </a>
              <button
                className="button ghost"
                onClick={() => navigate("/curriculo")}
              >
                Currículo completo <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <Atlas />
          <div className="hero-index">
            <span>01 — Investigar</span>
            <span>02 — Sistematizar</span>
            <span>03 — Criar</span>
          </div>
        </section>

        {/* MANIFESTO SECTION */}
        <section id="manifesto" className="manifesto section-wrap section-spacing">
          <SectionMarker number="01" label="Manifesto" />
          <div className="manifesto-grid">
            <blockquote>
              Ciência e arte como modos de formular perguntas, revelar relações e <em>disputar o que o mundo pode ser</em>.
            </blockquote>
            <div>
              <p>
                Meu trabalho parte de uma pergunta persistente: como as tecnologias, os conhecimentos e as culturas se transformam mutuamente?
              </p>
              <p>
                Minha prática atravessa ecossistemas de inovação, ecologia do conhecimento, inteligência artificial, literatura e audiovisual. Transito entre pesquisa e criação porque algumas ideias pedem modelos conceituais; outras, poemas. Algumas se tornam sistemas e métodos, outras músicas, livros ou experiências sonoras.
              </p>
              <a href="#eixos" className="text-link">
                Ver os três eixos <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* EIXOS SECTION */}
        <section id="eixos" className="section-wrap section-spacing">
          <div className="section-heading">
            <div>
              <SectionMarker number="02" label="Eixos de atuação" />
              <h2>
                Três verbos.
                <br />
                <em>Uma mesma visão intelectual.</em>
              </h2>
            </div>
            <p>
              Os três verbos não funcionam como caixas isoladas. São movimentos complementares de uma mesma ecologia de pensamento e criação.
            </p>
          </div>
          <div className="axis-grid">
            <AxisCard
              number="01"
              icon={<Search />}
              title="Investigar"
              description="Produzir conceitos, perguntas e métodos para compreender conhecimento, inteligência artificial, aprendizagem e sociedade."
              tags={["Ecologia do conhecimento", "IA e sociedade", "Governança sociotécnica", "Pesquisa acadêmica"]}
            />
            <AxisCard
              number="02"
              icon={<BrainCircuit />}
              title="Sistematizar"
              description="Transformar pesquisa e estratégia em sistemas, modelos de dados, arquiteturas conceituais e metodologias de inovação úteis."
              tags={["Engenharia do conhecimento", "Governança de IA", "Metodologias de inovação", "Modelagem de dados"]}
            />
            <AxisCard
              number="03"
              icon={<Sparkles />}
              title="Criar"
              description="Explorar literatura, poesia, produção fonográfica e narrativas visuais como modos legítimos de conhecer e produzir mundo."
              tags={["Literatura e poesia", "Produção fonográfica", "Curadoria cultural", "Promptografia"]}
            />
          </div>
        </section>

        {/* PORTFOLIO / TRABALHOS */}
        <section id="trabalhos" className="works-section section-spacing">
          <div className="section-wrap">
            <div className="section-heading compact">
              <div>
                <SectionMarker number="03" label="Portfólio de projetos" />
                <h2>
                  Portfólio de
                  <br />
                  <em>projetos.</em>
                </h2>
              </div>
              <p>
                Alguns livros, pesquisas, plataformas, álbuns e experimentos conectados pelas perguntas que os originaram.
              </p>
            </div>
            <div className="filters" role="group" aria-label="Filtrar trabalhos">
              {(["Todos", "Pesquisa", "Tecnologia", "Literatura", "Música", "Visual"] as const).map((item) => (
                <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
            <motion.div layout className="project-grid">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project) => (
                  <ProjectCard key={project.title} project={project} />
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
                <Volume2 size={14} /> Áudio como outra forma de pesquisa
              </span>
              <h2>
                Escutar também
                <br />
                é uma forma
                <br />
                <em>de conhecer.</em>
              </h2>
              <p>
                Releituras instrumentais, paisagens sonoras, produção fonográfica e curadoria cultural fazem parte de uma prática que une técnica, memória, palavra e experimentação sonora.
              </p>
              <div className="sound-links">
                <a className="button primary" href="https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz" target="_blank" rel="noreferrer">
                  Ouvir no Spotify <ArrowUpRight size={15} />
                </a>
                <a className="button ghost" href="https://instagram.com/brasil.wav" target="_blank" rel="noreferrer">
                  Conhecer Berimbrasil <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="album-stack" aria-label="Projetos musicais">
              <div className="album-card image" title="Rancho de Amor à Ilha">
                <img src="/assets/ranchodoamor.jpg" alt="Capa do single Rancho de Amor à Ilha" />
                <span className="album-tag-overlay">Rancho de Amor à Ilha</span>
              </div>
              <div className="album-card image-berim" title="Berimbrasil">
                <img src="/assets/berimbrasil.jpg" alt="Capa do projeto Berimbrasil" />
                <span className="album-tag-overlay">Berimbrasil</span>
              </div>
              <div className="album-card violet">
                <small>Produção Fonográfica</small>
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
              <SectionMarker number="04" label="Trajetória" />
              <h2>
                Conhecimento é
                <br />
                <em>uma travessia.</em>
              </h2>
            </div>
            <p>Uma trajetória interdisciplinar articulada entre universidades, organizações de inovação, territórios e projetos autorais.</p>
          </div>
          <div className="trajectory-grid">
            <aside className="portrait-panel">
              <div className="portrait-frame">
                <img src="/assets/fotoperf.jpeg" alt="Retrato de Gustavo Simas" />
                <div className="portrait-caption">
                  <span>Gustavo Simas</span>
                  <span>Florianópolis · SC</span>
                </div>
              </div>
              <div className="credentials">
                <span>Analista de IA · Sebrae/SC</span>
                <span>Doutorando CAPES · PPGEGC/UFSC</span>
                <span>Mestre · Prêmio SBGC Melhor Dissertação</span>
                <span>Engenheiro Eletrônico · Produtor Fonográfico</span>
              </div>
            </aside>
            <div className="timeline">
              <Timeline
                year="2026 — Atual"
                title="Inteligência Artificial no Sebrae/SC & Doutorado"
                text="Atuação na estruturação da governança do Escritório de IA do Sebrae/SC, MLOps/LLMOps gerencial e conformidade, paralela à pesquisa de doutorado em ecologia do conhecimento na UFSC."
              />
              <Timeline
                year="2025"
                title="Tecnogonia, Poesia e Prêmio SBGC"
                text="Publicação de Tecnogonia (Editora Caravana) e do livro de poemas E o que eu faço com isso? (Editora Labrador). Conquista do Prêmio SBGC de Melhor Dissertação de Mestrado do Brasil."
              />
              <Timeline
                year="2023 — 2026"
                title="Impact Hub Brasil & Metodologia ALI"
                text="Analista de Inovação Sênior e de Dados, coautor da Metodologia ALI Ecossistemas para desenvolvimento territorial e avaliação de impacto socioambiental positivo."
              />
              <Timeline
                year="2020 — 2024"
                title="VI Mídia & Produção de Áudio Acessível"
                text="Cofundador e produtor fonográfico de conteúdos acessíveis (audiolivros, audiodescrição para público print disabled e síntese vocal com IA), com apoio do Programa Centelha (FAPESC)."
              />
              <Timeline
                year="2016 — 2021"
                title="Engenharia Eletrônica & Robótica na UFSC"
                text="Graduação em Engenharia Eletrônica com ênfase em Processamento Digital de Sinais (TCC em aparelhos auditivos) e pesquisa no Laboratório de Robótica Aplicada (LAR/UFSC)."
              />
            </div>
          </div>
        </section>

        {/* PESQUISA E PUBLICAÇÃO (CONHECER EM RELAÇÃO) */}
        <section id="publicacoes" className="research-section section-spacing">
          <div className="section-wrap research-grid">
            <div className="research-intro">
              <SectionMarker number="05" label="Pesquisa e publicação" />
              <h2>
                Conhecer
                <br />
                em <em>relação.</em>
              </h2>
              <p>
                Artigos científicos, livros e pesquisas em periódicos internacionais e anais de conferências sobre inteligência artificial, agência criativa, ecologia do conhecimento e inovação.
              </p>
              <div className="research-links">
                <a className="text-link" href="https://orcid.org/0000-0003-3485-7910" target="_blank" rel="noreferrer">
                  Ver ORCID <ArrowUpRight size={14} />
                </a>
                <a className="text-link" href="http://lattes.cnpq.br/3423329196677574" target="_blank" rel="noreferrer">
                  Ver Currículo Lattes <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <ol className="publication-list">
              {highlightPublications.map((item, i) => (
                <li key={item.title}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="publication-item-link"
                    title={`Abrir pesquisa: ${item.title}`}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p>{item.title}</p>
                      <small className="pub-meta">
                        {item.source} · {item.year}
                      </small>
                    </div>
                    <ArrowUpRight size={16} />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CAPACIDADES */}
        <section className="section-wrap section-spacing">
          <div className="section-heading compact">
            <div>
              <SectionMarker number="06" label="Capacidades" />
              <h2>
                O que posso
                <br />
                <em>colocar em movimento.</em>
              </h2>
            </div>
          </div>
          <div className="capability-grid">
            <Capability
              number="01"
              title="Conhecimento e estratégia"
              items={[
                "Governança de Inteligência Artificial",
                "Ecologia e engenharia do conhecimento",
                "Modelagem conceitual e ontologias",
                "Ecossistemas de inovação e impacto",
                "Cultura de aprendizagem contínua",
              ]}
            />
            <Capability
              number="02"
              title="Tecnologia e dados"
              items={[
                "MLOps e LLMOps gerencial",
                "Python, ciência de dados e BI",
                "TypeScript, React e aplicações web",
                "Processamento de sinais e áudio",
                "Prototipagem ágil de soluções",
              ]}
            />
            <Capability
              number="03"
              title="Criação e cultura"
              items={[
                "Ensaios, literatura e poesia",
                "Produção fonográfica e som",
                "Curadoria musical e digital",
                "Promptografia e IA generativa",
                "Acessibilidade e audiodescrição",
              ]}
            />
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="contact-section section-wrap section-spacing">
          <div className="contact-card">
            <span className="contact-kicker">
              <span className="signal" /> Disponível para projetos, pesquisa e colaboração
            </span>
            <h2>
              Vamos imaginar
              <br />
              <em>alguma coisa</em>
              <br />
              juntos?
            </h2>
            <a className="contact-email" href="mailto:gustavosimassilva@gmail.com">
              gustavosimassilva@gmail.com <ArrowUpRight />
            </a>
            <div className="contact-footer">
              <p>Conhecimento, tecnologia, literatura, produção fonográfica e audiovisual para pensar o presente e inventar futuros.</p>
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
            <small>Florianópolis · Brasil</small>
          </span>
        </a>
        <p>© 2026 · Conhecimento · tecnologia · imaginação</p>
        <a href="#top">
          Voltar ao topo <ArrowUpRight size={13} />
        </a>
      </footer>
    </div>
  );
}

function Atlas() {
  return (
    <motion.div className="hero-atlas" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} aria-label="Atlas dos três eixos">
      <div className="atlas-orbit orbit-a" />
      <div className="atlas-orbit orbit-b" />
      <div className="atlas-core">
        <Network size={34} />
        <span>Conhecimento</span>
      </div>
      <div className="atlas-node node-a">
        <Search />
        <span>Investigar</span>
      </div>
      <div className="atlas-node node-b">
        <BrainCircuit />
        <span>Sistematizar</span>
      </div>
      <div className="atlas-node node-c">
        <Palette />
        <span>Criar</span>
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
  tags: string[];
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

function ProjectCard({ project }: { project: Project }) {
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
          <img src={project.image} alt={`Capa de ${project.title}`} />
        ) : (
          <>
            <span>{project.category}</span>
            <strong>{project.title}</strong>
          </>
        )}
        <ExternalLink className="project-arrow" />
      </div>
      <div className="project-body">
        <div>
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
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

function Capability({ number, title, items }: { number: string; title: string; items: string[] }) {
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

function Curriculum({ navigate }: { navigate: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<CvTab>("tudo");
  const [searchQuery, setSearchQuery] = useState("");
  const [pubFilter, setPubFilter] = useState<string>("Todos");

  const filteredPublications = useMemo(() => {
    return cvData.allPublications.filter((pub) => {
      const matchesType = pubFilter === "Todos" || pub.type === pubFilter;
      const matchesQuery =
        searchQuery === "" ||
        pub.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.year.includes(searchQuery);
      return matchesType && matchesQuery;
    });
  }, [pubFilter, searchQuery]);

  return (
    <main className="cv-page">
      <nav className="cv-toolbar">
        <button className="cv-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Voltar ao atlas
        </button>
        <div className="cv-toolbar-right">
          <a className="cv-link-button" href={cvData.profile.lattesUrl} target="_blank" rel="noreferrer">
            <Library size={14} /> Currículo Lattes
          </a>
          <a className="cv-link-button" href={cvData.profile.orcidUrl} target="_blank" rel="noreferrer">
            <Globe size={14} /> ORCID
          </a>
          <button className="cv-print-button" onClick={() => window.print()}>
            <Download size={16} /> Salvar / Imprimir PDF
          </button>
        </div>
      </nav>

      <article className="cv-document">
        {/* HEADER */}
        <header className="cv-header">
          <div className="cv-header-main">
            <span className="cv-kicker">Curriculum Vitae Acadêmico e Profissional · 2026</span>
            <h1>{cvData.profile.name}</h1>
            <p className="cv-headline">{cvData.profile.titles}</p>
            <p className="cv-role-sub">{cvData.profile.role}</p>
          </div>
          <div className="cv-contact">
            <a href={`mailto:${cvData.profile.email}`}>
              <Mail size={14} /> {cvData.profile.email}
            </a>
            <span>
              <MapPin size={14} /> {cvData.profile.location}
            </span>
            <a href={cvData.profile.lattesUrl} target="_blank" rel="noreferrer">
              <Library size={14} /> ID Lattes: {cvData.profile.lattesId}
            </a>
            <a href={cvData.profile.orcidUrl} target="_blank" rel="noreferrer">
              <Globe size={14} /> ORCID: {cvData.profile.orcidId}
            </a>
            <a href={cvData.profile.linkedinUrl} target="_blank" rel="noreferrer">
              <Linkedin size={14} /> LinkedIn: /in/simasgs
            </a>
            <a href={cvData.profile.spotifyUrl} target="_blank" rel="noreferrer">
              <Music2 size={14} /> Spotify Artist
            </a>
          </div>
        </header>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="cv-interactive-tabs" role="tablist" aria-label="Seções do currículo">
          {[
            { id: "tudo", label: "Visão Geral Completa" },
            { id: "experiencia", label: "Experiência Profissional" },
            { id: "formacao", label: "Formação & Títulos" },
            { id: "premios", label: "Prêmios & Distinções" },
            { id: "publicacoes", label: "Produção Bibliográfica" },
            { id: "arte", label: "Produção Fonográfica & Cultural" },
            { id: "projetos", label: "Projetos de P&D" },
          ].map((tab) => (
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
              <h2>Resumo / Perfil</h2>
              <p>{cvData.profile.bio}</p>
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
                  <h2>Atuação Profissional</h2>
                </div>
                <div className="cv-item-list">
                  {cvData.experience.map((item, idx) => (
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
                  <h2>Formação Acadêmica & Titulação</h2>
                </div>
                <div className="cv-item-list">
                  {cvData.education.map((edu, idx) => (
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
                  <h2>Prêmios, Títulos e Reconhecimentos</h2>
                </div>
                <div className="cv-awards-grid">
                  {cvData.awards.map((award, idx) => (
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
                  <h2>Produção Bibliográfica</h2>
                </div>

                {/* Filtro de publicações */}
                <div className="cv-pub-controls">
                  <div className="cv-pub-filters">
                    {["Todos", "Livro", "Artigo Periódico", "Capítulo", "Congresso"].map((type) => (
                      <button
                        key={type}
                        className={`cv-pub-filter-btn ${pubFilter === type ? "active" : ""}`}
                        onClick={() => setPubFilter(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="cv-search-box">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Pesquisar publicações, periódicos ou termos..."
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
                          <span className={`cv-pub-tag ${item.type.toLowerCase().replace(/\s+/g, "-")}`}>{item.type}</span>
                          <span className="cv-pub-year">{item.year}</span>
                        </div>
                        <p>{item.citation}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="cv-pub-link">
                            Acessar publicação <ArrowUpRight size={12} />
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
                  <h2>Produção Artística, Fonográfica e Acessibilidade</h2>
                </div>
                <div className="cv-art-blocks">
                  {cvData.artisticProduction.map((art, idx) => (
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
                  <h2>Projetos de Pesquisa & Inovação Metodológica</h2>
                </div>
                <div className="cv-item-list">
                  {cvData.projectsAndMethods.map((proj, idx) => (
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
            <CvSide label="Livros Publicados" items={["Tecnogonia (Caravana, 2025)", "E o que eu faço com isso? (Labrador, 2025)", "Antologia Pandemias (Noveland, 2021)"]} />
            <CvSide
              label="Especialidades em Governança & IA"
              items={cvData.skills.governanceAndKnowledge}
            />
            <CvSide
              label="Tecnologias & Metodologias"
              items={cvData.skills.technical}
            />
            <CvSide
              label="Formação Complementar"
              items={cvData.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`)}
            />
            <section className="cv-side-section">
              <span className="cv-side-label">Idiomas</span>
              <ul className="cv-lang-list">
                {cvData.skills.languages.map((l) => (
                  <li key={l.language}>
                    <strong>{l.language}:</strong> <span>{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="cv-side-section">
              <span className="cv-side-label">Propriedade Intelectual</span>
              <p className="cv-side-note">
                <strong>VI Mídia</strong> — Marca Registrada no Instituto Nacional da Propriedade Industrial (INPI), processo 922745829.
              </p>
            </section>
          </aside>
        </div>

        <footer className="cv-document-footer">
          <span>Gustavo Simas da Silva — Currículo Vitae</span>
          <span>Engenharia do Conhecimento · IA · Arte e Literatura</span>
          <span>Atualizado em 2026 · Florianópolis/SC</span>
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
