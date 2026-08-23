import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  Contrast,
  Download,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Library,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
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

export type Lang = "pt" | "en";

export type Category = "Pesquisa" | "Tecnologia" | "Literatura" | "Música" | "Visual";

export interface Project {
  title: string;
  category: string;
  categoryKey: Category;
  year: string;
  description: string;
  href: string;
  visual: string;
  image?: string;
  featured?: boolean;
}

export function getProjects(lang: Lang): Project[] {
  const isPt = lang === "pt";
  return [
    {
      title: isPt ? "Tecnogonia: criando tecnologias que nos criam" : "Technogony: creating technologies that create us",
      category: isPt ? "Literatura" : "Literature",
      categoryKey: "Literatura",
      year: "2025",
      description: isPt
        ? "Ensaio sobre as tecnologias que criamos — e que, silenciosamente, também nos criam. Publicado pela Editora Caravana."
        : "Essay on the technologies we create — and that, silently, also create us. Published by Editora Caravana.",
      href: "https://caravanagrupoeditorial.com/livros/tecnogonia-criando-tecnologias-que-nos-criam/?v=2d3615d82bb9",
      visual: "tecnogonia",
      image: "/assets/tecnogonia.jpeg",
      featured: true,
    },
    {
      title: isPt ? "E o que eu faço com isso?" : "And what do I do with this?",
      category: isPt ? "Literatura" : "Literature",
      categoryKey: "Literatura",
      year: "2025",
      description: isPt
        ? "Livro de poesia: uma coleção de perguntas, afetos e fragmentos sobre o que fazemos com aquilo que nos atravessa. Editora Labrador."
        : "Poetry book: a collection of questions, affections, and fragments about what we do with what passes through us. Editora Labrador.",
      href: "https://www.instagram.com/tudoemsimas/",
      visual: "poesia",
      image: "/assets/eoqueeufacocomisso.jpg",
      featured: true,
    },
    {
      title: "ECO-CAOS",
      category: isPt ? "Pesquisa" : "Research",
      categoryKey: "Pesquisa",
      year: "2024",
      description: isPt
        ? "Metamodelo conceitual para ecossistemas de conhecimento e culturas de aprendizagem organizacional (PPGEGC/UFSC. Vencedor do Prêmio SBGC de Melhor Dissertação)."
        : "Conceptual metamodel for knowledge ecosystems and organizational learning cultures (PPGEGC/UFSC. Winner of the SBGC Best Master's Dissertation Award).",
      href: "https://dissertacao.gustavosimas.com",
      visual: "eco",
    },
    {
      title: isPt ? "Tecnonecromancia" : "Technonecromancy",
      category: isPt ? "Pesquisa" : "Research",
      categoryKey: "Pesquisa",
      year: "2026",
      description: isPt
        ? "Simulacros de presença e a política da morte na era da inteligência artificial generativa. Trilogía Ciencia Tecnología Sociedad (com Vânia Ulbricht)."
        : "Simulacra of presence and the politics of death in the age of generative artificial intelligence. Trilogía Ciencia Tecnología Sociedad (with Vânia Ulbricht).",
      href: "https://technonecromancy.gustavosimas.com/",
      visual: "necromancy",
    },
    {
      title: isPt ? "Trajetórias de Mulheres Negras no Ensino Superior" : "Trajectories of Black Women in Higher Education",
      category: isPt ? "Pesquisa" : "Research",
      categoryKey: "Pesquisa",
      year: "2025",
      description: isPt
        ? "Barreiras, conquistas e caminhos para avanço no ensino superior brasileiro. Aracê - Direitos Humanos em Revista (com Marcela Aguiar)."
        : "Barriers, achievements, and paths forward in Brazilian higher education. Aracê - Human Rights Journal (with Marcela Aguiar).",
      href: "https://trajetoriamulheresnegras.gustavosimas.com/",
      visual: "trajetorias",
    },
    {
      title: isPt ? "Interação Humano-IA: Antropomorfização no ChatGPT" : "Human-AI Interaction: Anthropomorphization in ChatGPT",
      category: isPt ? "Pesquisa" : "Research",
      categoryKey: "Pesquisa",
      year: "2024",
      description: isPt
        ? "Antropomorfização e engajamento do usuário em agentes conversacionais (IHSI 2024 · Palermo, Itália / PPGEGC-UFSC. Com Vânia Ulbricht)."
        : "Anthropomorphization and user engagement in conversational agents (IHSI 2024 · Palermo, Italy / PPGEGC-UFSC. With Vânia Ulbricht).",
      href: "https://ihsi2024.gustavosimas.com",
      visual: "ihsi",
    },
    {
      title: isPt ? "Agenda de Pesquisa em EGC na Sociedade do Conhecimento" : "Research Agenda for KM & Media in Knowledge Society",
      category: isPt ? "Pesquisa" : "Research",
      categoryKey: "Pesquisa",
      year: "2024",
      description: isPt
        ? "The Role of Knowledge Engineering, Management and Media in the Knowledge Society: A Research Agenda (ECKM 2024 / PPGEGC-UFSC)."
        : "The Role of Knowledge Engineering, Management and Media in the Knowledge Society: A Research Agenda (ECKM 2024 / PPGEGC-UFSC).",
      href: "https://eckm2024.gustavosimas.com/",
      visual: "eckm",
    },
    {
      title: isPt ? "Processamento de Sinais em Aparelhos Auditivos (TCC)" : "Signal Processing in Hearing Aids (BSc Thesis)",
      category: isPt ? "Tecnologia" : "Technology",
      categoryKey: "Tecnologia",
      year: "2021",
      description: isPt
        ? "Algoritmo adaptativo para redução de ruído e preservação de pistas acústicas biauriculares (Engenharia Eletrônica/UFSC. Orientação: Prof. Dr. Márcio Holsbach Costa; coorientação: Me. Diego Marques do Carmo)."
        : "Adaptive algorithm for noise reduction and binaural acoustic cue preservation (Electronics Engineering/UFSC. Advisor: Prof. Márcio Holsbach Costa, PhD; co-advisor: Diego Marques do Carmo, MEng).",
      href: "https://tcc.gustavosimas.com",
      visual: "dsp",
    },
    {
      title: isPt ? "Promptografia e Agência Criativa" : "Promptography and Creative Agency",
      category: isPt ? "Pesquisa" : "Research",
      categoryKey: "Pesquisa",
      year: "2026",
      description: isPt
        ? "Investigação sobre agência criativa humana, autoria e práticas visuais mediadas por IA generativa (Revista Brasileira de Estudos CTS)."
        : "Investigation into human creative agency, authorship, and visual practices mediated by generative AI (Brazilian Journal of STS Studies).",
      href: "https://revistabrasileiradeestudoscts.com/revista/article/view/37",
      visual: "agency",
    },
    {
      title: "Rancho de Amor à Ilha",
      category: isPt ? "Música" : "Music",
      categoryKey: "Música",
      year: "2026",
      description: isPt
        ? "Releitura instrumental e lofi do hino oficial de Florianópolis (composição de Zininho), em homenagem ao centenário da Ponte Hercílio Luz."
        : "Instrumental and lofi reimagining of the official anthem of Florianópolis (composed by Zininho), celebrating the Hercílio Luz Bridge centenary.",
      href: "https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz",
      visual: "ranchodoamor",
      image: "/assets/ranchodoamor.jpg",
    },
    {
      title: "Berimbrasil",
      category: isPt ? "Música" : "Music",
      categoryKey: "Música",
      year: isPt ? "Em curso" : "Ongoing",
      description: isPt
        ? "Curadoria e valorização da música brasileira em diálogo com memória, escuta e cultura digital (@brasil.wav)."
        : "Curation and appreciation of Brazilian music in dialogue with memory, listening, and digital culture (@brasil.wav).",
      href: "https://instagram.com/brasil.wav",
      visual: "brasil",
      image: "/assets/berimbrasil.jpg",
    },
    {
      title: "Tecnomágica",
      category: "Visual",
      categoryKey: "Visual",
      year: isPt ? "Em curso" : "Ongoing",
      description: isPt
        ? "Laboratório de promptografia, inteligência artificial, experimentação visual e imaginação técnica (@tecnomagica)."
        : "Laboratory of promptography, artificial intelligence, visual experimentation, and technical imagination (@tecnomagica).",
      href: "https://instagram.com/tecnomagica",
      visual: "prompt",
      image: "/assets/tecnomagica.jpg",
    },
    {
      title: isPt ? "VI Mídia Produtora" : "VI Mídia Production",
      category: isPt ? "Tecnologia" : "Technology",
      categoryKey: "Tecnologia",
      year: "2020 — 2024",
      description: isPt
        ? "Engenharia de áudio, design de som e produção fonográfica acessível para educação e entretenimento (audiolivros, audiodescrição e tecnologia assistiva)."
        : "Audio engineering, sound design, and accessible phonographic production for education and entertainment (audiobooks, audio description, and assistive tech).",
      href: "https://www.linkedin.com/in/simasgs/",
      visual: "vimidia",
      image: "/assets/mensagem-audiolivro.jpg",
    },
  ];
}

export function getHighlightPublications(lang: Lang) {
  const isPt = lang === "pt";
  return [
    {
      title: "Promptography and the reconfiguration of human creative agency",
      source: isPt ? "Revista Brasileira de Estudos CTS" : "Brazilian Journal of STS Studies",
      year: "2026",
      authors: "Da Silva, Gustavo Simas; Ulbricht, Vânia Ribas",
      link: "https://revistabrasileiradeestudoscts.com/revista/article/view/37",
    },
    {
      title: isPt
        ? "Tecnonecromancia: Simulacros de presença e a política da morte na era da inteligência artificial generativa"
        : "Technonecromancy: Simulacra of Presence and the Politics of Death in the Age of Generative AI",
      source: "Trilogía Ciencia Tecnología Sociedad",
      year: "2026",
      authors: "Silva, Gustavo Simas da; Ulbricht, Vania Ribas",
      link: "https://technonecromancy.gustavosimas.com/",
    },
    {
      title: "An ESG-AI Matrix for Innovation Ecosystems",
      source: "Sustainable Business International Journal",
      year: "2026",
      authors: "Silva, Gustavo Simas da; Ulbricht, V. R.",
      link: "https://periodicos.uff.br/sbijournal/article/view/69566",
    },
    {
      title: isPt
        ? "Trajetórias de mulheres negras no ensino superior: barreiras, conquistas e caminhos para avanço"
        : "Trajectories of Black Women in Higher Education: Barriers, Achievements and Paths Forward",
      source: "Aracê - Direitos Humanos em Revista",
      year: "2025",
      authors: "Aguiar, Marcela; Simas da Silva, Gustavo",
      link: "https://trajetoriamulheresnegras.gustavosimas.com/",
    },
    {
      title: isPt
        ? "Interação Humano-IA: Antropomorfização & Engajamento no ChatGPT"
        : "Human-AI Interaction: Anthropomorphization & User Engagement in ChatGPT",
      source: isPt ? "IHSI 2024 · Palermo, Itália" : "IHSI 2024 · Palermo, Italy",
      year: "2024",
      authors: "Simas, Gustavo; Ribas Ulbricht, Vânia",
      link: "https://ihsi2024.gustavosimas.com",
    },
    {
      title: "The Role of Knowledge Engineering, Management and Media in the Knowledge Society: A Research Agenda",
      source: "25th European Conference on Knowledge Management (ECKM 2024)",
      year: "2024",
      authors: "Simas da Silva, Gustavo; Ulbricht, Vânia Ribas",
      link: "https://eckm2024.gustavosimas.com/",
    },
    {
      title: isPt
        ? "Algoritmo adaptativo para redução de ruído e preservação de pistas acústicas biauriculares para aparelhos auditivos"
        : "Adaptive Algorithm for Noise Reduction and Binaural Acoustic Cue Preservation in Hearing Aids",
      source: isPt
        ? "Trabalho de Conclusão de Curso · Engenharia Eletrônica (UFSC)"
        : "BSc Graduation Thesis · Electronics Engineering (UFSC)",
      year: "2021",
      authors: "Simas da Silva, Gustavo; Costa, Márcio Holsbach; Carmo, Diego Marques do",
      link: "https://tcc.gustavosimas.com",
    },
    {
      title: isPt
        ? "ECO-CAOS: Metamodelo conceitual para ecossistemas de conhecimento e culturas de aprendizagem organizacional"
        : "ECO-CAOS: Conceptual Metamodel for Knowledge Ecosystems and Organizational Learning Cultures",
      source: isPt
        ? "PPGEGC/UFSC · Prêmio SBGC Melhor Dissertação"
        : "PPGEGC/UFSC · SBGC Best Dissertation Award",
      year: "2024",
      authors: "Simas da Silva, Gustavo; Ulbricht, Vânia Ribas",
      link: "https://dissertacao.gustavosimas.com",
    },
    {
      title: "A quantitative analysis of geographic, gender, and age distribution of Nobel Prize Laureates (1901-2025)",
      source: "International Journal of Knowledge Engineering and Management",
      year: "2025",
      authors: "Simas da Silva, Gustavo; Ribas Ulbricht, Vânia",
      link: "https://periodicos.ufsc.br/index.php/ijkem/article/view/109317?articlesBySimilarityPage=1",
    },
    {
      title: isPt
        ? "Ecossistema de Conhecimento Organizacional: GC e Cultura de Aprendizagem"
        : "Organizational Knowledge Ecosystem: KM and Learning Culture",
      source: "Inteligência Empresarial e Economia dos Intangíveis",
      year: "2023",
      authors: "Da Silva, Gustavo Simas; Lima, L. S.; Ferraz, M. Z.",
      link: "https://inteligenciaempresarial.emnuvens.com.br/rie/article/view/115",
    },
  ];
}

export function getCvData(lang: Lang) {
  const isPt = lang === "pt";
  return {
    profile: {
      name: "Gustavo Simas da Silva",
      titles: isPt
        ? "Doutorando e Mestre em Engenharia e Gestão do Conhecimento (UFSC) · Engenheiro Eletrônico (UFSC)"
        : "PhD Candidate & MSc in Knowledge Engineering and Management (UFSC) · Electronics Engineer (UFSC)",
      role: isPt
        ? "Analista Técnico II - Inteligência Artificial no Sebrae/SC · Pesquisador Bolsista CAPES (LaMiD/UFSC) · Escritor e Produtor Fonográfico"
        : "Technical Analyst II - Artificial Intelligence at Sebrae/SC · CAPES Research Fellow (LaMiD/UFSC) · Writer & Sound Producer",
      location: isPt ? "Florianópolis, Santa Catarina, Brasil" : "Florianópolis, Santa Catarina, Brazil",
      email: "gustavosimassilva@gmail.com",
      lattesUrl: "http://lattes.cnpq.br/3423329196677574",
      lattesId: "3423329196677574",
      orcidUrl: "https://orcid.org/0000-0003-3485-7910",
      orcidId: "0000-0003-3485-7910",
      linkedinUrl: "https://www.linkedin.com/in/simasgs",
      spotifyUrl: "https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz",
      githubUrl: "https://github.com/GSimas",
      bio: isPt
        ? "Energizar o saber, reduzir o desconhecimento e potencializar a inovação transformadora. Atua ao entender a complexidade gerenciando caos e ordem por meio de Engenharia, Gestão e Mídias do Conhecimento, Inovação, Tecnologia e Arte. Atualmente é Analista de IA no Sebrae/SC, pesquisador bolsista CAPES de doutorado no Laboratório de Mídias (LAMID/PPGEGC/UFSC), escritor e produtor fonográfico."
        : "Energizing knowledge, reducing unknowns, and empowering transformative innovation. Operating across complexity by navigating chaos and order through Knowledge Engineering, Management & Media, Innovation, Technology, and Art. Currently AI Analyst at Sebrae/SC, CAPES PhD research fellow at the Media Lab (LAMID/PPGEGC/UFSC), writer, and sound producer.",
    },
    experience: [
      {
        period: isPt ? "06/2026 — Presente" : "06/2026 — Present",
        role: isPt ? "Analista Técnico II — Inteligência Artificial" : "Technical Analyst II — Artificial Intelligence",
        company: "Sebrae Santa Catarina",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Estruturação e operação da governança do Escritório de IA do Sebrae/SC.",
              "Monitoramento, análise e validação da execução de projetos corporativos de IA nas áreas técnicas e meio, assegurando conformidade metodológica e qualidade.",
              "Apoio a áreas na elaboração de planos de projetos de IA, matrizes de risco, cronogramas, indicadores e resultados esperados.",
              "Acompanhamento de projetos estratégicos de IA de origem nacional alinhados ao Sebrae Nacional.",
              "Condução de avaliações técnicas e de conformidade de casos de uso de IA; desenho e padronização do ciclo de vida de soluções (do piloto à produção).",
              "Implantação e manutenção de métricas e monitoramento de desempenho de IA (MLOps/LLMOps em nível de gestão) e orquestração de capacitações para adoção institucional.",
            ]
          : [
              "Structuring and operationalizing the AI Office governance at Sebrae/SC.",
              "Monitoring, analyzing, and validating corporate AI project execution across technical and operations areas, ensuring methodological compliance and quality.",
              "Assisting departments in drafting AI project charters, risk matrices, roadmaps, KPIs, and deliverables.",
              "Tracking strategic nationwide AI initiatives aligned with Sebrae Nacional.",
              "Conducting technical and compliance assessments of AI use cases; designing and standardizing the solution lifecycle (from PoC to production).",
              "Deploying and maintaining AI performance monitoring metrics (managerial MLOps/LLMOps) and orchestrating institutional adoption training.",
            ],
      },
      {
        period: isPt ? "03/2025 — Presente" : "03/2025 — Present",
        role: isPt ? "Pesquisador Bolsista de Doutorado (CAPES)" : "PhD Research Fellow (CAPES)",
        company: isPt ? "Universidade Federal de Santa Catarina (UFSC)" : "Federal University of Santa Catarina (UFSC)",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Bolsista pesquisador CAPES no Laboratório de Mídias (LAMID) do Programa de Pós-Graduação em Engenharia, Gestão e Mídia do Conhecimento (PPGEGC/UFSC).",
              "Pesquisa avançada em ecologia do conhecimento, ciência de redes, cientometria, inteligência artificial e governança tecnológica.",
              "Investigação de aspectos sociotécnicos do conhecimento em rede (estruturação e impacto de tecnologias como IA em contextos organizacionais e acadêmicos).",
            ]
          : [
              "CAPES PhD research fellow at Media Lab (LAMID), Post-Graduate Program in Knowledge Engineering, Management and Media (PPGEGC/UFSC).",
              "Advanced research in knowledge ecology, network science, scientometrics, artificial intelligence, and sociotechnical governance.",
              "Investigating sociotechnical dimensions of networked knowledge (structures and impacts of AI across organizational and academic environments).",
            ],
      },
      {
        period: isPt ? "03/2025 — Presente" : "03/2025 — Present",
        role: isPt ? "Revisor Científico (Reviewer)" : "Scientific Peer Reviewer",
        company: "Science Publishing Group",
        location: isPt ? "Internacional" : "International",
        bullets: isPt
          ? [
              "Avaliação crítica por pares (peer review) de artigos científicos de ponta nas áreas de tecnologia, inteligência artificial e gestão do conhecimento.",
            ]
          : [
              "Critical peer review of scientific articles in technology, artificial intelligence, and knowledge management.",
            ],
      },
      {
        period: "01/2024 — 06/2026",
        role: isPt ? "Consultor em Inovação, Dados e Governança" : "Innovation, Data & Governance Consultant",
        company: isPt ? "Consultoria Autônoma / Negócios" : "Independent Consultant",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Consultoria em inovação, dados, inteligência artificial, gestão do conhecimento e governança tecnológica.",
              "Aplicação de metodologias para diagnóstico e planejamento organizacional, monitoramento de indicadores e gestão da mudança.",
            ]
          : [
              "Consulting in innovation, data, artificial intelligence, knowledge management, and technology governance.",
              "Applying frameworks for organizational diagnostics, strategic roadmapping, KPI monitoring, and change management.",
            ],
      },
      {
        period: "08/2023 — 04/2026",
        role: isPt ? "Analista de Inovação Sênior" : "Senior Innovation Analyst",
        company: "Impact Hub Brasil",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Pesquisa, Desenvolvimento e Inovação (P&D&I) para impacto socioambiental positivo.",
              "Desenvolvimento e implementação de metodologias para Ecossistemas Locais de Inovação e Impacto (coautor da Metodologia ALI Ecossistemas).",
              "Inteligência de negócios, pesquisas de tendências e tecnologias emergentes.",
              "Avaliação e monitoramento de impacto socioambiental com visão sistêmica e relatórios executivos.",
              "Gestão e engenharia do conhecimento para capturar, compartilhar e disseminar práticas organizacionais.",
            ]
          : [
              "Research, Development & Innovation (R&D&I) for positive socio-environmental impact.",
              "Development and rollout of methodologies for Local Innovation & Impact Ecosystems (co-author of the ALI Ecosystems Methodology).",
              "Business intelligence, trend forecasting, and emerging technology scouting.",
              "Assessment and tracking of socio-environmental impact with systemic analysis and executive reporting.",
              "Knowledge management and engineering to capture, systematize, and scale organizational best practices.",
            ],
      },
      {
        period: "12/2021 — 08/2023",
        role: isPt ? "Analista de Dados" : "Data Analyst",
        company: "Impact Hub Brasil",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Análise de dados na área de ecossistemas de inovação e impacto socioambiental.",
              "Estruturação de pipelines analíticos, inteligência de negócios, governança da informação organizacional e cultura de aprendizagem.",
            ]
          : [
              "Data analysis in innovation ecosystems and socio-environmental impact.",
              "Structuring analytical data pipelines, business intelligence dashboards, organizational information governance, and learning culture.",
            ],
      },
      {
        period: "04/2020 — 01/2024",
        role: isPt ? "Cofundador, Produtor Fonográfico e Engenheiro de Áudio" : "Co-founder, Sound Producer & Audio Engineer",
        company: "VI Mídia Produtora (Visão Inclusiva)",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Cofundador e produtor fonográfico de conteúdos acessíveis para educação e entretenimento.",
              "Produção de audiolivros, audiodescrição para público print disabled e síntese vocal com recursos de IA.",
              "Engenharia de áudio, design de som e processamento digital de sinais de voz.",
              "Titular de marca registrada de serviço homologada no INPI.",
            ]
          : [
              "Co-founder and sound producer of accessible content for education and entertainment.",
              "Production of audiobooks, audio descriptions for print-disabled audiences, and AI voice synthesis.",
              "Audio engineering, sound design, and digital speech signal processing.",
              "Owner of registered service trademark approved by the Brazilian Patent & Trademark Office (INPI).",
            ],
      },
      {
        period: "04/2020 — 01/2021",
        role: isPt ? "Editor e Revisor Literário" : "Literary Editor & Proofreader",
        company: "Editora Noveland",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Revisão textual e literária, avaliação e parecer de originais, coordenação editorial e gestão de marca.",
            ]
          : [
              "Textual and literary editing, manuscript assessment, editorial coordination, and publishing brand management.",
            ],
      },
      {
        period: "07/2018 — 02/2020",
        role: isPt ? "Bolsista de Iniciação Científica (P&D Robótica)" : "Undergraduate Research Fellow (Robotics R&D)",
        company: isPt ? "Laboratório de Robótica Aplicada (LAR/UFSC)" : "Applied Robotics Lab (LAR/UFSC)",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "P&D de Sistema Robotizado de Inspeção para Linhas de Distribuição de Energia Elétrica (convênio Celesc / Departamento de Engenharia Mecânica).",
              "Revisão sistemática de literatura, modelagem CAD/Solidworks, patentes, artigos científicos e desenvolvimento de interfaces/aplicações web (front-end).",
            ]
          : [
              "R&D of a Robotic Inspection System for Electric Power Distribution Lines (Celesc partnership / Mechanical Engineering Dept.).",
              "Systematic literature review, SolidWorks CAD modeling, patents, scientific papers, and web front-end interface development.",
            ],
      },
      {
        period: "01/2017 — 02/2018",
        role: isPt ? "Estagiário de Engenharia" : "Engineering Intern",
        company: "CIASC — Centro de Informática e Automação de SC",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Desenvolvimento de sistema de monitoramento preditivo para Data Center.",
              "Sensoriamento e alerta de variáveis críticas (temperatura, umidade, inundação, incêndio) com Zabbix, Arduino e Fluidodinâmica Computacional (CFD).",
            ]
          : [
              "Development of a predictive monitoring system for Data Centers.",
              "Sensing and alerting of critical environmental variables (temperature, humidity, flood, fire) using Zabbix, Arduino, and Computational Fluid Dynamics (CFD).",
            ],
      },
      {
        period: "02/2015 — 07/2015",
        role: isPt ? "Estagiário de Engenharia Clínica (GTMH)" : "Clinical Engineering Intern (GTMH)",
        company: isPt ? "Instituto de Engenharia Biomédica (IEB-UFSC / Carmela Dutra)" : "Biomedical Engineering Institute (IEB-UFSC / Carmela Dutra)",
        location: "Florianópolis, SC",
        bullets: isPt
          ? [
              "Gestão de Tecnologia de Equipamentos Médico-Hospitalares (GTMH), controle de qualidade, manutenção corretiva/preventiva e treinamento técnico.",
            ]
          : [
              "Healthcare Technology Management (HTM), medical equipment quality control, corrective/preventive maintenance, and clinical staff training.",
            ],
      },
    ],
    education: [
      {
        period: isPt ? "01/2025 — 03/2029 (Em andamento)" : "01/2025 — 03/2029 (In progress)",
        degree: isPt ? "Doutorado em Engenharia, Gestão e Mídia do Conhecimento" : "PhD in Knowledge Engineering, Management and Media",
        institution: isPt ? "Universidade Federal de Santa Catarina (UFSC)" : "Federal University of Santa Catarina (UFSC)",
        details: isPt
          ? "Bolsista CAPES. Orientadora: Profa. Dra. Vânia Ribas Ulbricht. Foco em Ecologia do Conhecimento, Ciência de Redes, Cientometria, Inteligência Artificial e Governança Sociotécnica."
          : "CAPES Fellow. Advisor: Prof. Vânia Ribas Ulbricht, PhD. Focus on Knowledge Ecology, Network Science, Scientometrics, Artificial Intelligence, and Sociotechnical Governance.",
      },
      {
        period: isPt ? "01/2025 — 03/2026 (Em andamento)" : "01/2025 — 03/2026 (In progress)",
        degree: isPt ? "MBA em Tecnologia para Negócios: AI, Data Science e Big Data" : "MBA in Business Technology: AI, Data Science & Big Data",
        institution: "PUCRS — Pontifícia Universidade Católica do RS",
        details: isPt
          ? "Especialização executiva (364 horas) em inteligência artificial aplicada a modelos de negócio, Big Data e tomada de decisão estratégica."
          : "Executive specialization (364 hours) in AI applied to business models, Big Data, and strategic decision-making.",
      },
      {
        period: isPt ? "02/2023 — 02/2025 (Concluído)" : "02/2023 — 02/2025 (Completed)",
        degree: isPt ? "Mestrado em Engenharia e Gestão do Conhecimento" : "MSc in Knowledge Engineering and Management",
        institution: isPt ? "Universidade Federal de Santa Catarina (UFSC)" : "Federal University of Santa Catarina (UFSC)",
        details: isPt
          ? "Dissertação: 'ECO-CAOS: um metamodelo conceitual para ecossistemas de conhecimento e culturas de aprendizagem organizacional'. Bolsista CAPES. Orientadora: Dra. Vânia Ribas Ulbricht. Vencedor do Prêmio SBGC de Melhor Dissertação do Brasil."
          : "Dissertation: 'ECO-CAOS: a conceptual metamodel for knowledge ecosystems and organizational learning cultures'. CAPES Fellow. Advisor: Vânia Ribas Ulbricht, PhD. Winner of the SBGC Best Master's Dissertation Award in Brazil.",
      },
      {
        period: isPt ? "02/2016 — 12/2021 (Concluído)" : "02/2016 — 12/2021 (Completed)",
        degree: isPt ? "Bacharelado em Engenharia Eletrônica" : "BSc in Electronics Engineering",
        institution: isPt ? "Universidade Federal de Santa Catarina (UFSC)" : "Federal University of Santa Catarina (UFSC)",
        details: isPt
          ? "TCC: 'Algoritmo Adaptativo para Redução de Ruído e Preservação de Pistas Acústicas Biauriculares para Aparelhos Auditivos'. Orientador: Prof. Dr. Márcio Holsbach Costa; coorientador: Me. Diego Marques do Carmo. Ênfase em Processamento Digital de Sinais e Áudio."
          : "Thesis: 'Adaptive Algorithm for Noise Reduction and Binaural Acoustic Cue Preservation in Hearing Aids'. Advisor: Prof. Márcio Holsbach Costa, PhD; co-advisor: Diego Marques do Carmo, MEng. Emphasis on Digital Signal Processing and Acoustics.",
      },
      {
        period: isPt ? "2012 — 2016 (Concluído)" : "2012 — 2016 (Completed)",
        degree: isPt ? "Curso Técnico em Eletrônica" : "Technical Degree in Electronics",
        institution: "Instituto Federal de Santa Catarina (IFSC)",
        details: isPt
          ? "Formação técnica de nível médio integrada, com fundamentação em circuitos, instrumentação e sistemas embarcados."
          : "Integrated secondary technical diploma with foundation in circuits, instrumentation, and embedded systems.",
      },
    ],
    certifications: [
      { name: "Data Product Manager Nanodegree", issuer: "Udacity", year: "2021-2022", hours: "160h" },
      { name: "Deep Learning Specialization", issuer: "Coursera / deeplearning.ai", year: "2018", hours: "300h" },
      { name: "Python Programming", issuer: "Coursera", year: "2018", hours: "300h" },
      { name: "Introduction to Linear Models and Matrix Algebra", issuer: "edX / HarvardX", year: "2023" },
      { name: "Digital Marketing Channels: Planning", issuer: "Coursera", year: "2018", hours: "300h" },
      { name: isPt ? "KM Brasil — Gestão do Conhecimento" : "KM Brasil — Knowledge Management", issuer: "SBGC", year: "2023" },
    ],
    awards: [
      {
        year: "2025",
        title: isPt ? "Prêmio SBGC — Melhor Dissertação de Mestrado" : "SBGC Award — Best Master's Dissertation",
        entity: isPt ? "Sociedade Brasileira de Gestão do Conhecimento (SBGC)" : "Brazilian Society of Knowledge Management (SBGC)",
        description: isPt
          ? "Reconhecimento nacional pela dissertação ECO-CAOS sobre ecossistemas de conhecimento e cultura de aprendizagem."
          : "National award for the ECO-CAOS master's dissertation on knowledge ecosystems and learning culture.",
      },
      {
        year: "2022",
        title: isPt ? "Seleção na Série 'Histórias do Cotidiano'" : "Selection in 'Everyday Stories' Cultural Series",
        entity: isPt ? "Biblioteca Universitária (BU/UFSC)" : "University Library (BU/UFSC)",
        description: isPt
          ? "Trabalho literário selecionado para acervo e divulgação cultural institucional."
          : "Literary work selected for institutional cultural collection and dissemination.",
      },
      {
        year: "2020",
        title: isPt ? "Aprovado no Programa Centelha" : "Approved in Centelha Innovation Grant",
        entity: "FAPESC / MCTI / Finep",
        description: isPt
          ? "Subvenção e fomento governamental à inovação tecnológica e empreendedorismo para a VI Mídia."
          : "Government grant fostering technological innovation and startup entrepreneurship for VI Mídia.",
      },
      {
        year: "2020",
        title: isPt ? "Seleção no Concurso de Fotografia Documentária" : "Selection in Documentary Photography Contest",
        entity: "Floripa Anônima",
        description: isPt
          ? "Registro documental da paisagem urbana e memória social da Ilha de Santa Catarina."
          : "Documentary photography of the urban landscape and social memory of Santa Catarina Island.",
      },
      {
        year: "2016",
        title: isPt ? "I Prêmio IFSC de Literatura — Seleção Fotográfica" : "1st IFSC Literature Award — Photography Selection",
        entity: isPt ? "Instituto Federal de Santa Catarina (IFSC)" : "Federal Institute of Santa Catarina (IFSC)",
        description: isPt
          ? "Premiação de ensaio visual e fotográfico autoral."
          : "Award for original visual and documentary photography essay.",
      },
      {
        year: "2015",
        title: isPt ? "Premiado no Concurso Literário Fragmentos do Medo" : "Awarded in Fragmentos do Medo Literary Contest",
        entity: "Três Macacos Premiações",
        description: isPt
          ? "Publicação em antologia de microcontos de circulação nacional."
          : "Publication in national flash-fiction anthology.",
      },
      {
        year: "2014",
        title: isPt ? "Premiado no I Concurso de Contos do IFSC" : "Awarded in 1st IFSC Short Story Contest",
        entity: isPt ? "Instituto Federal de Santa Catarina (IFSC)" : "Federal Institute of Santa Catarina (IFSC)",
        description: isPt
          ? "Primeiro lugar e menção honrosa na categoria prosa de ficção."
          : "First place and honorable mention in fiction prose.",
      },
      {
        year: "2015 — 2018",
        title: "Inspiration Award & Rookie All-Star Award",
        entity: "FIRST Robotics Competition (FRC 5800 Magic Island Robotics)",
        description: isPt
          ? "Prêmios de liderança, comunicação e impacto comunitário em engenharia robótica."
          : "Leadership, communication, and community impact awards in competitive robotics engineering.",
      },
      {
        year: "2009, 2010, 2011",
        title: isPt ? "Três Menções Honrosas consecutivas" : "Three Consecutive Honorable Mentions",
        entity: isPt ? "Olimpíada Brasileira de Matemática das Escolas Públicas (OBMEP)" : "Brazilian Public Schools Mathematics Olympiad (OBMEP)",
        description: isPt
          ? "Destaque acadêmico em raciocínio lógico e resolução de problemas matemáticos."
          : "Academic distinction in logical reasoning and mathematical problem solving.",
      },
    ],
    allPublications: [
      {
        type: isPt ? "Livro" : "Book",
        year: "2025",
        citation: "SIMAS DA SILVA, Gustavo. E o que eu faço com isso?. 1. ed. São Paulo: Labrador, 2025. 112p.",
        link: "https://www.instagram.com/tudoemsimas/",
      },
      {
        type: isPt ? "Livro" : "Book",
        year: "2025",
        citation: "SIMAS DA SILVA, Gustavo. Tecnogonia: criando tecnologias que nos criam. 1. ed. Belo Horizonte: Caravana Grupo Editorial, 2025.",
        link: "https://caravanagrupoeditorial.com/livros/tecnogonia-criando-tecnologias-que-nos-criam/?v=2d3615d82bb9",
      },
      {
        type: isPt ? "Livro" : "Book",
        year: "2021",
        citation: "ZIMMERMANN, D.; SILVA, Gustavo Simas da (Orgs.). Antologia Pandemias. 1. ed. Florianópolis: Noveland, 2021. v. 1. 310p.",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2026",
        citation: "SILVA, Gustavo Simas da; ULBRICHT, V. R. An ESG-AI Matrix for Innovation Ecosystems. Sustainable Business International Journal, v. 1, p. 1-30, 2026.",
        link: "https://periodicos.uff.br/sbijournal/article/view/69566",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2026",
        citation: "SILVA, Gustavo Simas da; ULBRICHT, Vania Ribas. Tecnonecromancia: Simulacros de presença e a política da morte na era da inteligência artificial generativa. Trilogía Ciencia Tecnología Sociedad, v. 18, n. 39, p. e3723, 2026. https://doi.org/10.22430/21457778.3723",
        link: "https://technonecromancy.gustavosimas.com/",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2026",
        citation: "DA SILVA, Gustavo Simas; ULBRICHT, Vânia Ribas. Promptography and the reconfiguration of human creative agency. Revista Brasileira de Estudos CTS, v. 1, p. 38-59, 2026.",
        link: "https://revistabrasileiradeestudoscts.com/revista/article/view/37",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "AGUIAR, M.; SIMAS DA SILVA, Gustavo. Trajetórias de mulheres negras no ensino superior: barreiras, conquistas e caminhos para avanço. Aracê - Direitos Humanos em Revista, v. 7, p. 35563-35591, 2025. https://doi.org/10.56238/arev7n7-024",
        link: "https://trajetoriamulheresnegras.gustavosimas.com/",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "SIMAS DA SILVA, Gustavo; LIMA, L. S.; ULBRICHT, V. R. Festival de aprendizagem como mobilizador do ecossistema de conhecimento organizacional. Caderno Pedagógico, v. 22, p. 1, 2025.",
        link: "https://ojs.studiespublicacoes.com.br/ojs/index.php/cadped/article/view/12975",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "DA SILVA, Gustavo Simas. Esperança e Psicopolítica em Superman (2025): Uma análise à luz das categorias de Byung-Chul Han. Lumen et Virtus, v. 16, p. 9548-9574, 2025.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "SILVA, Gustavo Simas da. Entre a dor pessoal e o sofrimento estrutural: uma crítica decolonial a Sociedade Paliativa de Byung-Chul Han. Lumen et Virtus, v. 16, p. 7889, 2025.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "SILVA, Gustavo Simas da; ULBRICHT, Vânia Ribas. Cidades inteligentes e sustentáveis? Uma análise comparativa dos índices CSC e IDSC em Florianópolis. Revista Políticas Públicas & Cidades, v. 14, p. e2686, 2025.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "SIMAS DA SILVA, Gustavo; RIBAS ULBRICHT, VÂNIA. A quantitative analysis of geographic, gender, and age distribution of Nobel Prize Laureates (1901-2025). International Journal of Knowledge Engineering and Management, v. 14, p. 1-17, 2025.",
        link: "https://periodicos.ufsc.br/index.php/ijkem/article/view/109317?articlesBySimilarityPage=1",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "DA SILVA, Gustavo Simas; ULBRICHT, Vânia Ribas. Padrões de Sustentabilidade: Uma análise de conceitos formais dos Objetivos de Desenvolvimento Sustentável nos estados brasileiros. Revista de Geopolítica, v. 16, p. e1096, 2025.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2025",
        citation: "SILVA, Gustavo Simas da. Narrativização como arquitetura temporal da memória. Revista Letras (Curitiba), v. 111, p. 1-50, 2025.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Artigo Periódico" : "Journal Article",
        year: "2023",
        citation: "DA SILVA, Gustavo Simas; LIMA, L. S.; FERRAZ, M. Z. Ecossistema de Conhecimento Organizacional: a visão sistêmica da interação entre Gestão do Conhecimento e Cultura de Aprendizagem. Inteligência Empresarial e Economia dos Intangíveis, v. 47, p. 1, 2023.",
        link: "https://inteligenciaempresarial.emnuvens.com.br/rie/article/view/115",
      },
      {
        type: isPt ? "Capítulo" : "Chapter",
        year: "2025",
        citation: "SILVA, Gustavo Simas da; ROSA, D. C.; FRANCO, L. H. R.; RAMOS, F. M.; ULBRICHT, V. R. Tecnologias para ouvir e comunicar: acesso, cultura e direitos de surdos e deficientes auditivos. In: Engenharia, Gestão e Inovação - Vol. 21. Poisson, 2025, p. 148-168.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Capítulo" : "Chapter",
        year: "2025",
        citation: "RAMOS, F. M.; SILVA, Gustavo Simas da; FRANCO, J. A. S.; FRANCO, L. H. R.; SILVA, M. D.; ULBRICHT, V. R. Envelhecimento e inclusão: a importância da libras na comunicação com idosos surdos. In: Ciências Humanas e Sociais - Vol. 8. Poisson, 2025, p. 125-135.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Capítulo" : "Chapter",
        year: "2024",
        citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, V. R.; VANZIN, T. Cidades Criativas UNESCO no Brasil e Economia Criativa em Ecossistemas Locais de Inovação: uma análise de indicadores. In: Ebook VIA TCDS 2. Florianópolis: Via Estação Conhecimento, 2024, v. 2, p. 15-40.",
        link: "https://via.ufsc.br/wp-content/uploads/ebook-VIA-TCDS-2-1.pdf",
      },
      {
        type: isPt ? "Capítulo" : "Chapter",
        year: "2024",
        citation: "SILVA, Gustavo Simas da; ULBRICHT, Vânia Ribas; VANZIN, Tarcísio. Gestão em Ecossistemas de Inovação: Modelo de banco de dados para governança ecossistêmica. In: Perspectivas em Engenharia, Mídias e Gestão do Conhecimento - Vol. 5. Arquétipos, 2024, p. 115-134.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Capítulo" : "Chapter",
        year: "2024",
        citation: "DA SILVA, Gustavo Simas; ULBRICHT, Vânia Ribas. Learning with Conversational AI: ChatGPT and Bard/Gemini in Education. Cognition and Exploratory Learning in the Digital Age. Cham: Springer Nature Switzerland, 2024, p. 101-117.",
        link: "https://link.springer.com/chapter/10.1007/978-3-031-65881-5_7",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2024",
        citation: "SIMAS, Gustavo; RIBAS ULBRICHT, VÂNIA. Human-AI Interaction: An Analysis of Anthropomorphization and User Engagement in Conversational Agents with a Focus on ChatGPT (Interação Humano-IA: Antropomorfização & Engajamento no ChatGPT). In: IHSI 2024 (Intelligent Human Systems Integration), Palermo, Itália, 2024.",
        link: "https://ihsi2024.gustavosimas.com",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2024",
        citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, Vânia Ribas. The Role of Knowledge Engineering, Management and Media in the Knowledge Society: A Research Agenda. In: 25th European Conference on Knowledge Management (ECKM 2024), Veszprém, Hungria, 2024.",
        link: "https://eckm2024.gustavosimas.com/",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2024",
        citation: "SIMAS DA SILVA, Gustavo; RIBAS ULBRICHT, VÂNIA. Design Feeling: a symmathetic approach for design processes. In: 15th International Conference on Applied Human Factors and Ergonomics (AHFE 2024), Nice, França, 2024.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2023",
        citation: "SIMAS DA SILVA, Gustavo. Towards Effective Ecosystems: A Framework for Mapping Knowledge Governance and Management Activities. In: 15th KMIS (Knowledge Management and Information Systems), Roma, Itália, 2023.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2023",
        citation: "SIMAS DA SILVA, Gustavo; VANZIN, T.; ULBRICHT, V. R. Entropy in Innovation and Creativity Measurement: An Integrative Review. In: XIII Congresso Internacional de Conhecimento e Inovação (ciKi), Florianópolis, 2023.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2023",
        citation: "SIMAS DA SILVA, Gustavo. Second Brain, GTD and Seek/Sense/Share: An Integration of Personal Knowledge Management Workflows. In: XIII Congresso Internacional de Conhecimento e Inovação (ciKi), Florianópolis, 2023.",
        link: "https://ciki.emnuvens.com.br/ciki/article/view/284",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2023",
        citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, V. R. ChatGPT and Bard in Education: A Comparative Review. In: CELDA 2023, Funchal, Portugal, 2023.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Congresso" : "Conference",
        year: "2023",
        citation: "SIMAS DA SILVA, Gustavo; ULBRICHT, V. R.; FERRAZ, M. Z.; LIMA, L. S. Ecossistema de Conhecimento Organizacional: visão sistêmica entre Gestão do Conhecimento e Cultura de Aprendizagem. In: 18º KM Brasil, 2023.",
        link: "https://orcid.org/0000-0003-3485-7910",
      },
      {
        type: isPt ? "Trabalho Acadêmico" : "Academic Thesis",
        year: "2024",
        citation: "SIMAS DA SILVA, Gustavo. ECO-CAOS: um metamodelo conceitual para ecossistemas de conhecimento e culturas de aprendizagem organizacional. 2024. Dissertação (Mestrado em Engenharia e Gestão do Conhecimento) - Universidade Federal de Santa Catarina. Orientadora: Profa. Dra. Vânia Ribas Ulbricht. Vencedor do Prêmio SBGC de Melhor Dissertação.",
        link: "https://dissertacao.gustavosimas.com",
      },
      {
        type: isPt ? "Trabalho Acadêmico" : "Academic Thesis",
        year: "2021",
        citation: "SIMAS DA SILVA, Gustavo. Algoritmo adaptativo para redução de ruído e preservação de pistas acústicas biauriculares para aparelhos auditivos. 2021. Trabalho de Conclusão de Curso (Graduação em Engenharia Eletrônica) - Universidade Federal de Santa Catarina. Orientador: Prof. Dr. Márcio Holsbach Costa; Coorientador: Me. Diego Marques do Carmo.",
        link: "https://tcc.gustavosimas.com",
      },
    ],
    artisticProduction: [
      {
        category: isPt ? "Música & Fonografia" : "Music & Phonography",
        items: isPt
          ? [
              "Rancho de Amor à Ilha (2026) — Releitura instrumental lofi do hino oficial de Florianópolis (composição original de Zininho), celebrando os 100 anos da Ponte Hercílio Luz.",
              "Berimbrasil (@brasil.wav) — Projeto de curadoria, valorização e difusão da música brasileira na cultura digital.",
              "Álbuns e Registros Fonográficos (2020-2024): ColoRio, CacofonIA, CacofonIA 2, Days, Slop, SinfonIA, Data! Data! Data!, Violando, Ruído, Marginal, Centauro, Radiola, Espectros, BON VIVANT, Frutaria, Rizomas, Ludic Dreams, Themes Songbook, Músicas Beta, Músicas Alfa, Quartos.",
              "Trilhas Sonoras Originais (2021): Heart of Darkness, 1984, O Marinheiro, Boats Against the Current, Triste Fim de Policarpo Quaresma, Hágil (com Gilberto Gil).",
            ]
          : [
              "Rancho de Amor à Ilha (2026) — Instrumental and lofi reimagining of Florianópolis' official anthem (composed by Zininho), celebrating the Hercílio Luz Bridge centenary.",
              "Berimbrasil (@brasil.wav) — Curation, appreciation, and diffusion project of Brazilian music in digital culture.",
              "Albums & Phonographic Releases (2020-2024): ColoRio, CacofonIA, CacofonIA 2, Days, Slop, SinfonIA, Data! Data! Data!, Violando, Ruído, Marginal, Centauro, Radiola, Espectros, BON VIVANT, Frutaria, Rizomas, Ludic Dreams, Themes Songbook, Músicas Beta, Músicas Alfa, Quartos.",
              "Original Soundtracks (2021): Heart of Darkness, 1984, O Marinheiro, Boats Against the Current, Triste Fim de Policarpo Quaresma, Hágil (with Gilberto Gil).",
            ],
      },
      {
        category: isPt ? "Audiolivros & Inclusão" : "Audiobooks & Accessibility",
        items: isPt
          ? [
              "A Mecânica das Palavras (2022) — Audiolivro acessível.",
              "Retrato do Artista Quando Coisa (Manoel de Barros, 2021) — Adaptação fonográfica acessível.",
              "O Guardador de Rebanhos & O Marinheiro & Mensagem (Fernando Pessoa, 2020-2021) — Produção de audiolivro e audiodescrição.",
              "O Grande Gatsby (F. Scott Fitzgerald, 2021) — Audiolivro em áudio imersivo.",
            ]
          : [
              "A Mecânica das Palavras (2022) — Accessible audiobook.",
              "Retrato do Artista Quando Coisa (Manoel de Barros, 2021) — Accessible phonographic adaptation.",
              "O Guardador de Rebanhos & O Marinheiro & Mensagem (Fernando Pessoa, 2020-2021) — Audiobook and audio description production.",
              "The Great Gatsby (F. Scott Fitzgerald, 2021) — Immersive audio adaptation.",
            ],
      },
      {
        category: isPt ? "Artes Visuais & Fotografia" : "Visual Arts & Photography",
        items: isPt
          ? [
              "Nemotom (2021) — Obra audiovisual e vídeo experimental.",
              "Floripa Anônima (2020) — Ensaio fotográfico documental.",
              "I Prêmio IFSC de Literatura (2017) — Série fotográfica premiada.",
            ]
          : [
              "Nemotom (2021) — Audiovisual work and experimental video.",
              "Floripa Anônima (2020) — Documentary photography essay.",
              "1st IFSC Literature Award (2017) — Award-winning photography series.",
            ],
      },
    ],
    projectsAndMethods: [
      {
        title: isPt ? "Laboratório de Mídia e Inclusão Digital (LaMiD / UFSC)" : "Media & Digital Inclusion Lab (LaMiD / UFSC)",
        period: isPt ? "2023 — Atual" : "2023 — Present",
        role: isPt ? "Pesquisador / Integrante" : "Researcher / Member",
        description: isPt
          ? "Levantamento, análise e sistematização das produções em acessibilidade digital e mídias do conhecimento como mediadores de inclusão sociotécnica para pessoas com deficiência."
          : "Survey, analysis, and systematization of digital accessibility and knowledge media initiatives as sociotechnical enablers of inclusion for persons with disabilities.",
      },
      {
        title: isPt ? "Metodologia ALI Ecossistemas" : "ALI Ecosystems Methodology",
        period: "2022",
        role: isPt ? "Coautor / Desenvolvedor" : "Co-author / Developer",
        description: isPt
          ? "Metodologia técnica para diagnóstico, governança e ativação de Ecossistemas Locais de Inovação no Brasil, adotada pelo Sebrae e rede Impact Hub."
          : "Technical methodology for diagnosing, governing, and activating Local Innovation Ecosystems across Brazil, adopted by Sebrae and the Impact Hub network.",
      },
      {
        title: isPt ? "Sistema Robotizado para Inspeção de Redes Elétricas (Celesc / LAR-UFSC)" : "Robotic System for Power Line Inspection (Celesc / LAR-UFSC)",
        period: "2018 — 2020",
        role: isPt ? "Pesquisador bolsista de Iniciação Científica" : "Undergraduate Research Fellow",
        description: isPt
          ? "Projeto conceitual, prototipagem, patentes e interface web de robô para inspeção de linhas de distribuição de energia elétrica."
          : "Conceptual design, prototyping, patents, and web UI for an autonomous robot inspecting electric power distribution grids.",
      },
      {
        title: isPt ? "Gestão de Tecnologia Médico-Hospitalar (CELEC / IEB-UFSC)" : "Clinical Technology Management (CELEC / IEB-UFSC)",
        period: "2015",
        role: isPt ? "Estagiário de Engenharia" : "Engineering Intern",
        description: isPt
          ? "Estudo comparativo e gestão de detectores de batimento cardíaco fetal na Maternidade Carmela Dutra."
          : "Comparative study and technical management of fetal Doppler heart rate monitors at Carmela Dutra Maternity Hospital.",
      },
    ],
    skills: {
      governanceAndKnowledge: isPt
        ? [
            "Governança de Inteligência Artificial",
            "Engenharia do Conhecimento",
            "Ecologia do Conhecimento",
            "Modelagem Conceitual de Sistemas",
            "Cultura de Aprendizagem Organizacional",
            "Ecossistemas Locais de Inovação (ELI)",
            "Gestão de Impacto Socioambiental",
          ]
        : [
            "Artificial Intelligence Governance",
            "Knowledge Engineering",
            "Knowledge Ecology",
            "Conceptual System Modeling",
            "Organizational Learning Culture",
            "Local Innovation Ecosystems (ELI)",
            "Socio-environmental Impact Management",
          ],
      technical: isPt
        ? [
            "MLOps e LLMOps (nível de gestão e ciclo de vida)",
            "Python (Pandas, NumPy, Scikit-Learn, PyTorch)",
            "TypeScript, React, Vite, Node.js",
            "Processamento Digital de Sinais (DSP de áudio/voz)",
            "Modelagem de Dados e Business Intelligence (BI)",
            "Tecnologia Assistiva e Acessibilidade Digital",
            "Engenharia de Prompt (Promptography)",
          ]
        : [
            "MLOps & LLMOps (lifecycle & governance)",
            "Python (Pandas, NumPy, Scikit-Learn, PyTorch)",
            "TypeScript, React, Vite, Node.js",
            "Digital Signal Processing (DSP / Audio & Voice)",
            "Data Modeling & Business Intelligence (BI)",
            "Assistive Technology & Digital Accessibility",
            "Prompt Engineering & Promptography",
          ],
      languages: isPt
        ? [
            { language: "Português", level: "Nativo" },
            { language: "Inglês", level: "Avançado / Fluente" },
            { language: "Espanhol", level: "Profissional" },
            { language: "Italiano", level: "Intermediário" },
            { language: "Francês", level: "Básico / Leitura" },
          ]
        : [
            { language: "Portuguese", level: "Native" },
            { language: "English", level: "Fluent / Advanced" },
            { language: "Spanish", level: "Professional" },
            { language: "Italian", level: "Intermediate" },
            { language: "French", level: "Basic / Reading" },
          ],
    },
  };
}

export const translations = {
  pt: {
    brandSubtitle: "Conhecimento · tecnologia · imaginação",
    nav: {
      manifesto: "Manifesto",
      axes: "Eixos",
      portfolio: "Portfólio",
      audio: "Áudio",
      trajectory: "Trajetória",
      publications: "Publicações",
      curriculum: "Currículo",
    },
    hero: {
      location: "Florianópolis · Brasil · 2026",
      titleLine1: "Pesquiso as",
      titleLine2: "tecnologias",
      titleLine3: "que nos criam.",
      lede: "Engenheiro do conhecimento, pesquisador, escritor, produtor fonográfico e artista multimídia. Minha prática atravessa ecossistemas de inovação, ecologia do conhecimento, inteligência artificial, literatura e audiovisual.",
      explore: "Explorar trabalhos",
      fullCv: "Currículo completo",
      index1: "01 — Investigar",
      index2: "02 — Sistematizar",
      index3: "03 — Criar",
    },
    atlas: {
      knowledge: "Conhecimento",
      investigate: "Investigar",
      systematize: "Sistematizar",
      create: "Criar",
    },
    manifesto: {
      label: "Manifesto",
      quote: "Ciência e arte como modos de formular perguntas, revelar relações e disputar o que o mundo pode ser.",
      p1: "Meu trabalho parte de uma pergunta persistente: como as tecnologias, os conhecimentos e as culturas se transformam mutuamente?",
      p2: "Minha prática atravessa ecossistemas de inovação, ecologia do conhecimento, inteligência artificial, literatura e audiovisual. Transito entre pesquisa e criação porque algumas ideias pedem modelos conceituais; outras, poemas. Algumas se tornam sistemas e métodos, outras músicas, livros ou experiências sonoras.",
      link: "Ver os três eixos",
    },
    axes: {
      label: "Eixos de atuação",
      title1: "Três verbos.",
      title2: "Uma mesma visão intelectual.",
      subtitle: "Os três verbos não funcionam como caixas isoladas. São movimentos complementares de uma mesma ecologia de pensamento e criação.",
      axis1Title: "Investigar",
      axis1Desc: "Produzir conceitos, perguntas e métodos para compreender conhecimento, inteligência artificial, aprendizagem e sociedade.",
      axis1Tags: ["Ecologia do conhecimento", "IA e sociedade", "Governança sociotécnica", "Pesquisa acadêmica"],
      axis2Title: "Sistematizar",
      axis2Desc: "Transformar pesquisa e estratégia em sistemas, modelos de dados, arquiteturas conceituais e metodologias de inovação úteis.",
      axis2Tags: ["Engenharia do conhecimento", "Governança de IA", "Metodologias de inovação", "Modelagem de dados"],
      axis3Title: "Criar",
      axis3Desc: "Explorar literatura, poesia, produção fonográfica e narrativas visuais como modos legítimos de conhecer e produzir mundo.",
      axis3Tags: ["Literatura e poesia", "Produção fonográfica", "Curadoria cultural", "Promptografia"],
    },
    portfolio: {
      label: "Portfólio de projetos",
      title1: "Portfólio de",
      title2: "projetos.",
      subtitle: "Alguns livros, pesquisas, plataformas, álbuns e experimentos conectados pelas perguntas que os originaram.",
      filters: ["Todos", "Pesquisa", "Tecnologia", "Literatura", "Música", "Visual"] as const,
    },
    audio: {
      eyebrow: "Áudio como outra forma de pesquisa",
      title1: "Escutar também",
      title2: "é uma forma",
      title3: "de conhecer.",
      p: "Releituras instrumentais, paisagens sonoras, produção fonográfica e curadoria cultural fazem parte de uma prática que une técnica, memória, palavra e experimentação sonora.",
      spotifyBtn: "Ouvir no Spotify",
      berimBtn: "Conhecer Berimbrasil",
      phonographyTag: "Produção Fonográfica",
    },
    trajectory: {
      label: "Trajetória",
      title1: "Conhecimento é",
      title2: "uma travessia.",
      subtitle: "Uma trajetória interdisciplinar articulada entre universidades, organizações de inovação, territórios e projetos autorais.",
      badges: [
        "Analista de IA · Sebrae/SC",
        "Doutorando CAPES · PPGEGC/UFSC",
        "Mestre · Prêmio SBGC Melhor Dissertação",
        "Engenheiro Eletrônico · Produtor Fonográfico",
      ],
      timeline: [
        {
          year: "2026 — Atual",
          title: "Inteligência Artificial no Sebrae/SC & Doutorado",
          text: "Atuação na estruturação da governança do Escritório de IA do Sebrae/SC, MLOps/LLMOps gerencial e conformidade, paralela à pesquisa de doutorado em ecologia do conhecimento na UFSC.",
        },
        {
          year: "2025",
          title: "Tecnogonia, Poesia e Prêmio SBGC",
          text: "Publicação de Tecnogonia (Editora Caravana) e do livro de poemas E o que eu faço com isso? (Editora Labrador). Conquista do Prêmio SBGC de Melhor Dissertação de Mestrado do Brasil.",
        },
        {
          year: "2025 — 2026",
          title: "MBA PUCRS",
          text: "MBA em Tecnologia para Negócios: AI, Data Science e Big Data na PUCRS, com foco em inteligência artificial aplicada a modelos de negócio, tomada de decisão estratégica e inovação orientada a dados.",
        },
        {
          year: "2023 — 2026",
          title: "Impact Hub & Metodologias de Inovação",
          text: "Analista de Inovação Sênior e de Dados, atuando no desenvolvimento e aplicação de metodologias de inovação territorial e ecossistêmica, incluindo Metodologia ELI, ALI Ecossistemas, ALI Produtividade e INDEI.",
        },
        {
          year: "2020 — 2024",
          title: "VI Mídia & Produção de Áudio Acessível",
          text: "Cofundador e produtor fonográfico de conteúdos acessíveis (audiolivros, audiodescrição para público print disabled e síntese vocal com IA), com apoio do Programa Centelha (FAPESC).",
        },
        {
          year: "2016 — 2021",
          title: "Engenharia Eletrônica & Robótica na UFSC",
          text: "Graduação em Engenharia Eletrônica com ênfase em Processamento Digital de Sinais (TCC em aparelhos auditivos) e pesquisa no Laboratório de Robótica Aplicada (LAR/UFSC).",
        },
        {
          year: "2012 — 2016",
          title: "Curso técnico em eletrônica IFSC & FRC 5800 Magic Island Robotics",
          text: "Formação técnica em eletrônica no IFSC e liderança na equipe FRC 5800 Magic Island Robotics, com participação e premiações em campeonatos internacionais de robótica FIRST Robotics Competition em Las Vegas, Orlando e China.",
        },
      ],
    },
    publications: {
      label: "Pesquisa e publicação",
      title1: "Conhecer",
      title2: "em relação.",
      p: "Artigos científicos, livros e pesquisas em periódicos internacionais e anais de conferências sobre inteligência artificial, agência criativa, ecologia do conhecimento e inovação.",
      orcid: "Ver ORCID",
      lattes: "Ver Currículo Lattes",
      openTitle: "Abrir pesquisa:",
    },
    capabilities: {
      label: "Capacidades",
      title1: "O que posso",
      title2: "colocar em movimento.",
      c1Title: "Governança de IA & Engenharia de Prompts",
      c1Items: [
        "Estruturação de governança institucional de IA",
        "Desenho do ciclo de vida de soluções de IA (piloto à produção)",
        "Prompt engineering & Promptography",
        "Supervisão gerencial de MLOps / LLMOps",
      ],
      c2Title: "Ecologia do Conhecimento & Metamodelação",
      c2Items: [
        "Modelagem de ecossistemas de conhecimento (ECO-CAOS)",
        "Cultura de aprendizagem contínua e compartilhamento",
        "Ciência de redes e cientometria aplicada",
        "Engenharia ontológica e fluxos de informação",
      ],
      c3Title: "Metodologias de Inovação & Ecossistemas Territoriais",
      c3Items: [
        "Metodologia ALI Ecossistemas (diagnóstico e ativação)",
        "Inteligência de ecossistemas locais de inovação (ELI)",
        "Governança ecossistêmica e orquestração de atores",
        "Avaliação de impacto socioambiental positivo",
      ],
      c4Title: "Produção Fonográfica, Multimídia & Editorial",
      c4Items: [
        "Engenharia de áudio e processamento digital de voz",
        "Produção de audiolivros imersivos e acessíveis",
        "Curadoria cultural e memória musical brasileira",
        "Publicações literárias (ensaios, contos e poesia)",
      ],
    },
    contact: {
      kicker: "Disponível para projetos, pesquisa e colaboração",
      title1: "Vamos imaginar",
      title2: "alguma coisa",
      title3: "juntos?",
      p: "Conhecimento, tecnologia, literatura, produção fonográfica e audiovisual para pensar o presente e inventar futuros.",
      footerQuote: "© 2026 · Conhecimento · tecnologia · imaginação",
      backToTop: "Voltar ao topo",
    },
    cv: {
      backBtn: "Voltar ao atlas",
      lattesBtn: "Currículo Lattes",
      orcidBtn: "ORCID",
      printBtn: "Salvar / Imprimir PDF",
      kicker: "Curriculum Vitae Acadêmico e Profissional · 2026",
      searchPlaceholder: "Pesquisar publicações, periódicos ou termos...",
      accessPub: "Acessar publicação",
      tabs: {
        tudo: "Visão Geral Completa",
        experiencia: "Experiência Profissional",
        formacao: "Formação & Títulos",
        premios: "Prêmios & Distinções",
        publicacoes: "Produção Bibliográfica",
        arte: "Produção Fonográfica & Cultural",
        projetos: "Projetos de P&D",
      },
      sections: {
        summary: "Resumo / Perfil",
        experience: "Atuação Profissional",
        education: "Formação Acadêmica & Titulação",
        awards: "Prêmios, Títulos e Reconhecimentos",
        publications: "Produção Bibliográfica",
        art: "Produção Artística, Fonográfica e Acessibilidade",
        projects: "Projetos de Pesquisa & Inovação Metodológica",
      },
      pubFilters: ["Todos", "Livro", "Artigo Periódico", "Capítulo", "Congresso", "Trabalho Acadêmico"],
      sidebar: {
        books: "Livros Publicados",
        gov: "Especialidades em Governança & IA",
        tech: "Tecnologias & Metodologias",
        certs: "Formação Complementar",
        languages: "Idiomas",
        ip: "Propriedade Intelectual",
        ipText: "Marca Registrada no Instituto Nacional da Propriedade Industrial (INPI), processo 922745829.",
      },
      footer: {
        line1: "Gustavo Simas da Silva — Currículo Vitae",
        line2: "Engenharia do Conhecimento · IA · Arte e Literatura",
        line3: "Atualizado em 2026 · Florianópolis/SC",
      },
    },
    headerAria: {
      theme: "Alternar tema",
      contrast: "Alto contraste",
      fontDec: "Diminuir fonte (-T)",
      fontInc: "Aumentar fonte (+T)",
      lang: "Mudar idioma (PT / EN)",
      menu: "Abrir menu",
    },
  },
  en: {
    brandSubtitle: "Knowledge · technology · imagination",
    nav: {
      manifesto: "Manifesto",
      axes: "Axes",
      portfolio: "Portfolio",
      audio: "Audio",
      trajectory: "Trajectory",
      publications: "Publications",
      curriculum: "Curriculum",
    },
    hero: {
      location: "Florianópolis · Brazil · 2026",
      titleLine1: "I research the",
      titleLine2: "technologies",
      titleLine3: "that create us.",
      lede: "Knowledge engineer, researcher, writer, sound producer, and multimedia artist. My practice traverses innovation ecosystems, knowledge ecology, artificial intelligence, literature, and audiovisual arts.",
      explore: "Explore works",
      fullCv: "Full curriculum",
      index1: "01 — Investigate",
      index2: "02 — Systematize",
      index3: "03 — Create",
    },
    atlas: {
      knowledge: "Knowledge",
      investigate: "Investigate",
      systematize: "Systematize",
      create: "Create",
    },
    manifesto: {
      label: "Manifesto",
      quote: "Science and art as modes of asking questions, revealing relations, and contesting what the world can become.",
      p1: "My work stems from a persistent question: how do technologies, knowledge systems, and cultures mutually transform each other?",
      p2: "My practice traverses innovation ecosystems, knowledge ecology, artificial intelligence, literature, and audiovisual arts. I move between research and creation because some ideas demand conceptual models; others, poems. Some become systems and methods; others, music, books, or sonic experiences.",
      link: "View the three axes",
    },
    axes: {
      label: "Core Axes",
      title1: "Three verbs.",
      title2: "A unified intellectual vision.",
      subtitle: "These three verbs do not operate as isolated silos. They are complementary movements of a single ecology of thought and creation.",
      axis1Title: "Investigate",
      axis1Desc: "Producing concepts, questions, and methods to understand knowledge, artificial intelligence, learning, and society.",
      axis1Tags: ["Knowledge ecology", "AI & society", "Sociotechnical governance", "Academic research"],
      axis2Title: "Systematize",
      axis2Desc: "Transforming research and strategy into systems, data models, conceptual architectures, and actionable innovation methodologies.",
      axis2Tags: ["Knowledge engineering", "AI governance", "Innovation methodologies", "Data modeling"],
      axis3Title: "Create",
      axis3Desc: "Exploring literature, poetry, sound production, and visual narratives as legitimate modes of inquiry and worldmaking.",
      axis3Tags: ["Literature & poetry", "Sound production", "Cultural curation", "Promptography"],
    },
    portfolio: {
      label: "Project Portfolio",
      title1: "Project",
      title2: "portfolio.",
      subtitle: "Books, research, platforms, albums, and experiments connected by the questions that sparked them.",
      filters: ["All", "Research", "Technology", "Literature", "Music", "Visual"] as const,
    },
    audio: {
      eyebrow: "Audio as another mode of research",
      title1: "Listening is",
      title2: "also a way",
      title3: "of knowing.",
      p: "Instrumental reinterpretations, soundscapes, phonographic production, and cultural curation form a practice linking technique, memory, language, and sonic experimentation.",
      spotifyBtn: "Listen on Spotify",
      berimBtn: "Discover Berimbrasil",
      phonographyTag: "Phonographic Production",
    },
    trajectory: {
      label: "Trajectory",
      title1: "Knowledge is",
      title2: "a crossing.",
      subtitle: "An interdisciplinary journey spanning universities, innovation organizations, territories, and authorial projects.",
      badges: [
        "AI Analyst · Sebrae/SC",
        "PhD Candidate CAPES · PPGEGC/UFSC",
        "MSc · SBGC Best Dissertation Award",
        "Electronics Engineer · Sound Producer",
      ],
      timeline: [
        {
          year: "2026 — Present",
          title: "Artificial Intelligence at Sebrae/SC & PhD",
          text: "Structuring AI Office governance at Sebrae/SC, managerial MLOps/LLMOps and compliance, alongside PhD research in knowledge ecology at UFSC.",
        },
        {
          year: "2025",
          title: "Technogony, Poetry & SBGC Award",
          text: "Publication of Technogony (Editora Caravana) and the poetry book E o que eu faço com isso? (Editora Labrador). Awarded the SBGC Best Master's Dissertation Award in Brazil.",
        },
        {
          year: "2025 — 2026",
          title: "MBA at PUCRS",
          text: "MBA in Business Technology: AI, Data Science & Big Data at PUCRS, focusing on AI applied to modern business models, strategic decision-making, and data-driven innovation.",
        },
        {
          year: "2023 — 2026",
          title: "Impact Hub & Innovation Methodologies",
          text: "Senior Innovation & Data Analyst, working on the development and deployment of territorial and ecosystem innovation frameworks, including ELI Methodology, ALI Ecosystems, ALI Productivity, and INDEI.",
        },
        {
          year: "2020 — 2024",
          title: "VI Mídia & Accessible Audio Production",
          text: "Co-founder and sound producer of accessible content (audiobooks, audio descriptions for print-disabled audiences, and AI voice synthesis), supported by the Centelha Program (FAPESC).",
        },
        {
          year: "2016 — 2021",
          title: "Electronics Engineering & Robotics at UFSC",
          text: "BSc in Electronics Engineering with emphasis on Digital Signal Processing (hearing aids thesis) and research at the Applied Robotics Lab (LAR/UFSC).",
        },
        {
          year: "2012 — 2016",
          title: "Technical Degree in Electronics IFSC & FRC 5800 Magic Island Robotics",
          text: "Technical degree in electronics at IFSC and leadership in the FRC 5800 Magic Island Robotics team, competing and winning awards at FIRST Robotics Competition international events in Las Vegas, Orlando, and China.",
        },
      ],
    },
    publications: {
      label: "Research & Publications",
      title1: "Knowing",
      title2: "in relation.",
      p: "Scientific papers, books, and research in international journals and conference proceedings on artificial intelligence, creative agency, knowledge ecology, and innovation.",
      orcid: "View ORCID",
      lattes: "View Lattes CV",
      openTitle: "Open research:",
    },
    capabilities: {
      label: "Capabilities",
      title1: "What I can",
      title2: "set in motion.",
      c1Title: "AI Governance & Prompt Engineering",
      c1Items: [
        "Institutional AI governance design & implementation",
        "AI solution lifecycle management (PoC to production)",
        "Prompt engineering & Promptography",
        "Managerial MLOps / LLMOps oversight",
      ],
      c2Title: "Knowledge Ecology & Metamodeling",
      c2Items: [
        "Knowledge ecosystem modeling (ECO-CAOS)",
        "Continuous learning culture & knowledge sharing",
        "Applied network science & scientometrics",
        "Ontological engineering & information flows",
      ],
      c3Title: "Innovation Methodologies & Territorial Ecosystems",
      c3Items: [
        "ALI Ecosystems Methodology (diagnosis & activation)",
        "Local Innovation Ecosystem (ELI) intelligence",
        "Ecosystem governance & stakeholder orchestration",
        "Positive socio-environmental impact assessment",
      ],
      c4Title: "Sound Production, Multimedia & Editorial Creation",
      c4Items: [
        "Audio engineering & digital voice signal processing",
        "Immersive & accessible audiobook production",
        "Cultural curation & Brazilian music memory",
        "Literary publications (essays, short stories & poetry)",
      ],
    },
    contact: {
      kicker: "Available for projects, research, and collaboration",
      title1: "Let's imagine",
      title2: "something",
      title3: "together?",
      p: "Knowledge, technology, literature, sound production, and audiovisual arts to rethink the present and invent futures.",
      footerQuote: "© 2026 · Knowledge · technology · imagination",
      backToTop: "Back to top",
    },
    cv: {
      backBtn: "Back to atlas",
      lattesBtn: "Lattes Curriculum",
      orcidBtn: "ORCID",
      printBtn: "Save / Print PDF",
      kicker: "Academic & Professional Curriculum Vitae · 2026",
      searchPlaceholder: "Search publications, journals, or terms...",
      accessPub: "Access publication",
      tabs: {
        tudo: "Full Overview",
        experiencia: "Professional Experience",
        formacao: "Education & Degrees",
        premios: "Awards & Honors",
        publicacoes: "Publications",
        arte: "Sound & Cultural Production",
        projetos: "R&D Projects",
      },
      sections: {
        summary: "Summary / Profile",
        experience: "Professional Experience",
        education: "Academic Education & Degrees",
        awards: "Awards, Honors & Distinctions",
        publications: "Bibliographical Production",
        art: "Artistic, Sound & Accessible Production",
        projects: "Research Projects & Methodological Innovation",
      },
      pubFilters: ["All", "Book", "Journal Article", "Chapter", "Conference", "Academic Thesis"],
      sidebar: {
        books: "Published Books",
        gov: "AI Governance & Knowledge Specialties",
        tech: "Technologies & Methodologies",
        certs: "Complementary Training",
        languages: "Languages",
        ip: "Intellectual Property",
        ipText: "Registered Trademark with the Brazilian National Institute of Industrial Property (INPI), application 922745829.",
      },
      footer: {
        line1: "Gustavo Simas da Silva — Curriculum Vitae",
        line2: "Knowledge Engineering · AI · Art & Literature",
        line3: "Updated in 2026 · Florianópolis/SC, Brazil",
      },
    },
    headerAria: {
      theme: "Toggle theme",
      contrast: "High contrast",
      fontDec: "Decrease font size (-T)",
      fontInc: "Increase font size (+T)",
      lang: "Change language (PT / EN)",
      menu: "Open menu",
    },
  },
};

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/$/, ""));
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("site_lang") as Lang) || "pt");
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("theme") as "dark" | "light") || "dark");
  const [contrast, setContrast] = useState(false);
  const [fontSize, setFontSize] = useState(0);

  const toggleLang = () => {
    const nextLang: Lang = lang === "pt" ? "en" : "pt";
    setLang(nextLang);
    localStorage.setItem("site_lang", nextLang);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("high-contrast", contrast);
    document.documentElement.style.setProperty("--font-scale", String(1 + fontSize * 0.1));
    localStorage.setItem("theme", theme);
  }, [theme, contrast, fontSize]);

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

  return isCurriculum ? (
    <Curriculum
      navigate={navigate}
      lang={lang}
      toggleLang={toggleLang}
      theme={theme}
      setTheme={setTheme}
      contrast={contrast}
      setContrast={setContrast}
      fontSize={fontSize}
      setFontSize={setFontSize}
    />
  ) : (
    <Portfolio
      navigate={navigate}
      lang={lang}
      toggleLang={toggleLang}
      theme={theme}
      setTheme={setTheme}
      contrast={contrast}
      setContrast={setContrast}
      fontSize={fontSize}
      setFontSize={setFontSize}
    />
  );
}

function Portfolio({
  navigate,
  lang,
  toggleLang,
  theme,
  setTheme,
  contrast,
  setContrast,
  fontSize,
  setFontSize,
}: {
  navigate: (path: string) => void;
  lang: Lang;
  toggleLang: () => void;
  theme: "dark" | "light";
  setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
  contrast: boolean;
  setContrast: React.Dispatch<React.SetStateAction<boolean>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState<string>("Todos");

  const t = translations[lang];
  const currentProjects = useMemo(() => getProjects(lang), [lang]);
  const highlightPublications = useMemo(() => getHighlightPublications(lang), [lang]);

  const filterOptions = t.portfolio.filters;

  // Reset filter when switching language if needed
  useEffect(() => {
    setFilter(t.portfolio.filters[0]);
  }, [lang, t.portfolio.filters]);

  const visibleProjects = useMemo(() => {
    if (filter === filterOptions[0]) return currentProjects;
    const filterIndex = filterOptions.indexOf(filter as any);
    const categoryKeyMap: Record<number, Category> = {
      1: "Pesquisa",
      2: "Tecnologia",
      3: "Literatura",
      4: "Música",
      5: "Visual",
    };
    const targetKey = categoryKeyMap[filterIndex];
    if (!targetKey) return currentProjects;
    return currentProjects.filter((project) => project.categoryKey === targetKey);
  }, [filter, filterOptions, currentProjects]);

  const navigation: Array<{ label: string; href: string; isRoute?: boolean }> = [
    { label: t.nav.manifesto, href: "#manifesto" },
    { label: t.nav.axes, href: "#eixos" },
    { label: t.nav.portfolio, href: "#trabalhos" },
    { label: t.nav.audio, href: "#musica" },
    { label: t.nav.trajectory, href: "#trajetoria" },
    { label: t.nav.publications, href: "#publicacoes" },
    { label: t.nav.curriculum, href: "/curriculo", isRoute: true },
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`Gustavo Simas — ${lang === "pt" ? "início" : "home"}`}>
          <span className="brand-mark">GS</span>
          <span>
            <strong>Gustavo Simas</strong>
            <small>{t.brandSubtitle}</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label={lang === "pt" ? "Navegação principal" : "Main navigation"}>
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
        <div className="header-actions" aria-label={lang === "pt" ? "Preferências de visualização" : "Display preferences"}>
          <button
            className="lang-toggle-button"
            onClick={toggleLang}
            aria-label={t.headerAria.lang}
            title={t.headerAria.lang}
          >
            <span className={lang === "pt" ? "lang-active" : ""}>PT</span>
            <span className="lang-sep">/</span>
            <span className={lang === "en" ? "lang-active" : ""}>EN</span>
          </button>
          <button
            className="icon-button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t.headerAria.theme}
            title={t.headerAria.theme}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button
            className="icon-button"
            onClick={() => setContrast(!contrast)}
            aria-pressed={contrast}
            aria-label={t.headerAria.contrast}
            title={t.headerAria.contrast}
          >
            <Contrast />
          </button>
          <button
            className="font-button"
            onClick={() => setFontSize((prev) => Math.max(prev - 1, -1))}
            disabled={fontSize <= -1}
            aria-label={t.headerAria.fontDec}
            title={t.headerAria.fontDec}
          >
            -T
          </button>
          <button
            className="font-button"
            onClick={() => setFontSize((prev) => Math.min(prev + 1, 3))}
            disabled={fontSize >= 3}
            aria-label={t.headerAria.fontInc}
            title={t.headerAria.fontInc}
          >
            +T
          </button>
          <button
            className="icon-button mobile-menu-button"
            onClick={() => setMenu(!menu)}
            aria-label={t.headerAria.menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
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
              <span className="signal" /> {t.hero.location}
            </p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
              {t.hero.titleLine1}
              <br />
              <em>{t.hero.titleLine2}</em>
              <br />
              {t.hero.titleLine3}
            </motion.h1>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-actions">
              <a className="button primary" href="#trabalhos">
                {t.hero.explore} <ArrowDown size={16} />
              </a>
              <button className="button ghost" onClick={() => navigate("/curriculo")}>
                {t.hero.fullCv} <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <Atlas lang={lang} />
          <div className="hero-index">
            <span>{t.hero.index1}</span>
            <span>{t.hero.index2}</span>
            <span>{t.hero.index3}</span>
          </div>
        </section>

        {/* MANIFESTO SECTION */}
        <section id="manifesto" className="manifesto section-wrap section-spacing">
          <SectionMarker number="01" label={t.manifesto.label} />
          <div className="manifesto-grid">
            <blockquote>{t.manifesto.quote}</blockquote>
            <div>
              <p>{t.manifesto.p1}</p>
              <p>{t.manifesto.p2}</p>
              <a href="#eixos" className="text-link">
                {t.manifesto.link} <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* EIXOS SECTION */}
        <section id="eixos" className="section-wrap section-spacing">
          <div className="section-heading">
            <div>
              <SectionMarker number="02" label={t.axes.label} />
              <h2>
                {t.axes.title1}
                <br />
                <em>{t.axes.title2}</em>
              </h2>
            </div>
            <p>{t.axes.subtitle}</p>
          </div>
          <div className="axis-grid">
            <AxisCard
              number="01"
              icon={<Search />}
              title={t.axes.axis1Title}
              description={t.axes.axis1Desc}
              tags={t.axes.axis1Tags}
            />
            <AxisCard
              number="02"
              icon={<BrainCircuit />}
              title={t.axes.axis2Title}
              description={t.axes.axis2Desc}
              tags={t.axes.axis2Tags}
            />
            <AxisCard
              number="03"
              icon={<Sparkles />}
              title={t.axes.axis3Title}
              description={t.axes.axis3Desc}
              tags={t.axes.axis3Tags}
            />
          </div>
        </section>

        {/* PORTFOLIO / TRABALHOS */}
        <section id="trabalhos" className="works-section section-spacing">
          <div className="section-wrap">
            <div className="section-heading compact">
              <div>
                <SectionMarker number="03" label={t.portfolio.label} />
                <h2>
                  {t.portfolio.title1}
                  <br />
                  <em>{t.portfolio.title2}</em>
                </h2>
              </div>
              <p>{t.portfolio.subtitle}</p>
            </div>
            <div className="filters" role="group" aria-label={lang === "pt" ? "Filtrar trabalhos" : "Filter works"}>
              {filterOptions.map((item) => (
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
                <Volume2 size={14} /> {t.audio.eyebrow}
              </span>
              <h2>
                {t.audio.title1}
                <br />
                {t.audio.title2}
                <br />
                <em>{t.audio.title3}</em>
              </h2>
              <p>{t.audio.p}</p>
              <div className="sound-links">
                <a className="button primary" href="https://open.spotify.com/artist/6WjZVnEMXM9OzuqDhdrvUz" target="_blank" rel="noreferrer">
                  {t.audio.spotifyBtn} <ArrowUpRight size={15} />
                </a>
                <a className="button ghost" href="https://instagram.com/brasil.wav" target="_blank" rel="noreferrer">
                  {t.audio.berimBtn} <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="album-stack" aria-label={lang === "pt" ? "Projetos musicais" : "Music projects"}>
              <div className="album-card image" title="Rancho de Amor à Ilha">
                <img src="/assets/ranchodoamor.jpg" alt="Capa do single Rancho de Amor à Ilha" />
                <span className="album-tag-overlay">Rancho de Amor à Ilha</span>
              </div>
              <div className="album-card image-berim" title="Berimbrasil">
                <img src="/assets/berimbrasil.jpg" alt="Capa do projeto Berimbrasil" />
                <span className="album-tag-overlay">Berimbrasil</span>
              </div>
              <div className="album-card violet">
                <small>{t.audio.phonographyTag}</small>
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
              <SectionMarker number="04" label={t.trajectory.label} />
              <h2>
                {t.trajectory.title1}
                <br />
                <em>{t.trajectory.title2}</em>
              </h2>
            </div>
            <p>{t.trajectory.subtitle}</p>
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
                {t.trajectory.badges.map((badge, bIdx) => (
                  <span key={bIdx}>{badge}</span>
                ))}
              </div>
            </aside>
            <div className="timeline">
              {t.trajectory.timeline.map((item, idx) => (
                <Timeline key={idx} year={item.year} title={item.title} text={item.text} />
              ))}
            </div>
          </div>
        </section>

        {/* PESQUISA E PUBLICAÇÃO (CONHECER EM RELAÇÃO) */}
        <section id="publicacoes" className="research-section section-spacing">
          <div className="section-wrap research-grid">
            <div className="research-intro">
              <SectionMarker number="05" label={t.publications.label} />
              <h2>
                {t.publications.title1}
                <br />
                <em>{t.publications.title2}</em>
              </h2>
              <p>{t.publications.p}</p>
              <div className="research-links">
                <a className="text-link" href="https://orcid.org/0000-0003-3485-7910" target="_blank" rel="noreferrer">
                  {t.publications.orcid} <ArrowUpRight size={14} />
                </a>
                <a className="text-link" href="http://lattes.cnpq.br/3423329196677574" target="_blank" rel="noreferrer">
                  {t.publications.lattes} <ArrowUpRight size={14} />
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
                    title={`${t.publications.openTitle} ${item.title}`}
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
              <SectionMarker number="06" label={t.capabilities.label} />
              <h2>
                {t.capabilities.title1}
                <br />
                <em>{t.capabilities.title2}</em>
              </h2>
            </div>
          </div>
          <div className="capability-grid">
            <Capability number="01" title={t.capabilities.c1Title} items={t.capabilities.c1Items} />
            <Capability number="02" title={t.capabilities.c2Title} items={t.capabilities.c2Items} />
            <Capability number="03" title={t.capabilities.c3Title} items={t.capabilities.c3Items} />
            <Capability number="04" title={t.capabilities.c4Title} items={t.capabilities.c4Items} />
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="contact-section section-wrap section-spacing">
          <div className="contact-card">
            <span className="contact-kicker">
              <span className="signal" /> {t.contact.kicker}
            </span>
            <h2>
              {t.contact.title1}
              <br />
              <em>{t.contact.title2}</em>
              <br />
              {t.contact.title3}
            </h2>
            <a className="contact-email" href="mailto:gustavosimassilva@gmail.com">
              gustavosimassilva@gmail.com <ArrowUpRight />
            </a>
            <div className="contact-footer">
              <p>{t.contact.p}</p>
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
            <small>{lang === "pt" ? "Florianópolis · Brasil" : "Florianópolis · Brazil"}</small>
          </span>
        </a>
        <p>{t.contact.footerQuote}</p>
        <a href="#top">
          {t.contact.backToTop} <ArrowUpRight size={13} />
        </a>
      </footer>
    </div>
  );
}

function Atlas({ lang }: { lang: Lang }) {
  const t = translations[lang].atlas;
  return (
    <motion.div
      className="hero-atlas"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      aria-label="Atlas dos três eixos"
    >
      <div className="atlas-orbit orbit-a" />
      <div className="atlas-orbit orbit-b" />
      <div className="atlas-core">
        <Network size={34} />
        <span>{t.knowledge}</span>
      </div>
      <div className="atlas-node node-a">
        <Search />
        <span>{t.investigate}</span>
      </div>
      <div className="atlas-node node-b">
        <BrainCircuit />
        <span>{t.systematize}</span>
      </div>
      <div className="atlas-node node-c">
        <Palette />
        <span>{t.create}</span>
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

function Curriculum({
  navigate,
  lang,
  toggleLang,
  theme,
  setTheme,
  contrast,
  setContrast,
  fontSize,
  setFontSize,
}: {
  navigate: (path: string) => void;
  lang: Lang;
  toggleLang: () => void;
  theme: "dark" | "light";
  setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
  contrast: boolean;
  setContrast: React.Dispatch<React.SetStateAction<boolean>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [activeTab, setActiveTab] = useState<CvTab>("tudo");
  const [searchQuery, setSearchQuery] = useState("");
  const t = translations[lang].cv;
  const cvData = useMemo(() => getCvData(lang), [lang]);
  const [pubFilter, setPubFilter] = useState<string>(() => t.pubFilters[0]);

  useEffect(() => {
    setPubFilter(t.pubFilters[0]);
  }, [lang, t.pubFilters]);

  const filteredPublications = useMemo(() => {
    return cvData.allPublications.filter((pub) => {
      const matchesType = pubFilter === t.pubFilters[0] || pub.type === pubFilter;
      const matchesQuery =
        searchQuery === "" ||
        pub.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.year.includes(searchQuery);
      return matchesType && matchesQuery;
    });
  }, [pubFilter, searchQuery, cvData.allPublications, t.pubFilters]);

  return (
    <main className="cv-page">
      <nav className="cv-toolbar">
        <button className="cv-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> {t.backBtn}
        </button>
        <div className="cv-toolbar-right">
          <button
            className="cv-lang-button"
            onClick={toggleLang}
            aria-label={translations[lang].headerAria.lang}
            title={translations[lang].headerAria.lang}
          >
            <span className={lang === "pt" ? "lang-active" : ""}>PT</span>
            <span className="lang-sep">/</span>
            <span className={lang === "en" ? "lang-active" : ""}>EN</span>
          </button>
          <button
            className="cv-icon-button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={translations[lang].headerAria.theme}
            title={translations[lang].headerAria.theme}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            className="cv-icon-button"
            onClick={() => setContrast(!contrast)}
            aria-pressed={contrast}
            aria-label={translations[lang].headerAria.contrast}
            title={translations[lang].headerAria.contrast}
          >
            <Contrast size={15} />
          </button>
          <button
            className="cv-font-button"
            onClick={() => setFontSize((prev) => Math.max(prev - 1, -1))}
            disabled={fontSize <= -1}
            aria-label={translations[lang].headerAria.fontDec}
            title={translations[lang].headerAria.fontDec}
          >
            -T
          </button>
          <button
            className="cv-font-button"
            onClick={() => setFontSize((prev) => Math.min(prev + 1, 3))}
            disabled={fontSize >= 3}
            aria-label={translations[lang].headerAria.fontInc}
            title={translations[lang].headerAria.fontInc}
          >
            +T
          </button>
          <a className="cv-link-button" href={cvData.profile.lattesUrl} target="_blank" rel="noreferrer">
            <Library size={14} /> {t.lattesBtn}
          </a>
          <a className="cv-link-button" href={cvData.profile.orcidUrl} target="_blank" rel="noreferrer">
            <Globe size={14} /> {t.orcidBtn}
          </a>
          <button className="cv-print-button" onClick={() => window.print()}>
            <Download size={16} /> {t.printBtn}
          </button>
        </div>
      </nav>

      <article className="cv-document">
        {/* HEADER */}
        <header className="cv-header">
          <div className="cv-header-main">
            <span className="cv-kicker">{t.kicker}</span>
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
            { id: "tudo", label: t.tabs.tudo },
            { id: "experiencia", label: t.tabs.experiencia },
            { id: "formacao", label: t.tabs.formacao },
            { id: "premios", label: t.tabs.premios },
            { id: "publicacoes", label: t.tabs.publicacoes },
            { id: "arte", label: t.tabs.arte },
            { id: "projetos", label: t.tabs.projetos },
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
              <h2>{t.sections.summary}</h2>
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
                  <h2>{t.sections.experience}</h2>
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
                  <h2>{t.sections.education}</h2>
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
                  <h2>{t.sections.awards}</h2>
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
                  <h2>{t.sections.publications}</h2>
                </div>

                {/* Filtro de publicações */}
                <div className="cv-pub-controls">
                  <div className="cv-pub-filters">
                    {t.pubFilters.map((type) => (
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
                      placeholder={t.searchPlaceholder}
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
                            {t.accessPub} <ArrowUpRight size={12} />
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
                  <h2>{t.sections.art}</h2>
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
                  <h2>{t.sections.projects}</h2>
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
            <CvSide
              label={t.sidebar.books}
              items={
                lang === "pt"
                  ? ["Tecnogonia (Caravana, 2025)", "E o que eu faço com isso? (Labrador, 2025)", "Antologia Pandemias (Noveland, 2021)"]
                  : ["Technogony (Caravana, 2025)", "And what do I do with this? (Labrador, 2025)", "Pandemics Anthology (Noveland, 2021)"]
              }
            />
            <CvSide label={t.sidebar.gov} items={cvData.skills.governanceAndKnowledge} />
            <CvSide label={t.sidebar.tech} items={cvData.skills.technical} />
            <CvSide
              label={t.sidebar.certs}
              items={cvData.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`)}
            />
            <section className="cv-side-section">
              <span className="cv-side-label">{t.sidebar.languages}</span>
              <ul className="cv-lang-list">
                {cvData.skills.languages.map((l) => (
                  <li key={l.language}>
                    <strong>{l.language}:</strong> <span>{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="cv-side-section">
              <span className="cv-side-label">{t.sidebar.ip}</span>
              <p className="cv-side-note">
                <strong>VI Mídia</strong> — {t.sidebar.ipText}
              </p>
            </section>
          </aside>
        </div>

        <footer className="cv-document-footer">
          <span>{t.footer.line1}</span>
          <span>{t.footer.line2}</span>
          <span>{t.footer.line3}</span>
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
