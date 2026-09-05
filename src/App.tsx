import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { mosaicGrid, mosaicStencil, type MosaicInk } from "./mosaic";
import {
  fadeLetters,
  gravityDefaults,
  gravityMaxChars,
  gravityMaxWords,
  gravityRanges,
  stepGravity,
  type GravityLetter,
  type GravitySettings,
} from "./gravity";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
  Play,
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
    href: "https://promptografia.scientata.com/",
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
    title: "Entreletras",
    category: "Tecnologia",
    year: "2026",
    description:
      "Jogo de palavras em português: você escreve uma horizontal e o dicionário responde com as verticais que cruzam cada letra. Dois modos — Trama, com a palavra escondida do dia, e Bistrô, livre e sem fim.",
    href: "https://entreletras.io/",
    visual: "entreletras",
    image: "/assets/entreletras-cover.svg",
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
  Entreletras: {
    title: "Entreletras",
    description: "A Portuguese word game: you write a horizontal word and the dictionary answers with the verticals crossing each of its letters. Two modes — Trama, with a hidden word of the day, and Bistrô, free and endless.",
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

interface Poem {
  slug: string;
  title: string;
  titleEn: string;
  year: string;
  media: "video" | "image";
  ratio: string;
  words: string;
  note: string;
  noteEn: string;
}

const poems: Poem[] = [
  {
    slug: "pos-estruturalismo",
    title: "Pós-Estruturalismo",
    titleEn: "Post-Structuralism",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "pós-estruturalismo",
    note: "A palavra é erguida como estrutura empilhada e depois desaba. As sílabas caem, se acumulam no chão e continuam legíveis em ruína: a demolição não apaga o sentido.",
    noteEn: "The word is raised as a stacked structure and then collapses. The syllables fall, pile up on the floor and remain legible in ruin: the demolition does not erase the meaning.",
  },
  {
    slug: "balance-sua-bandeira",
    title: "Balance Sua Bandeira",
    titleEn: "Wave Your Flag",
    year: "2025",
    media: "video",
    ratio: "1000 / 624",
    words: "balance sua bandeira",
    note: "A frase, repetida em faixas, é o próprio tecido de uma bandeira que tremula ao vento. O verso não descreve a bandeira — ele é a bandeira.",
    noteEn: "The phrase, repeated in stripes, is the very fabric of a flag rippling in the wind. The line does not describe the flag — it is the flag.",
  },
  {
    slug: "o-rio-e-o-movimento",
    title: "O Rio e o Movimento",
    titleEn: "The River and the Movement",
    year: "2025",
    media: "video",
    ratio: "1000 / 624",
    words: "o rio existe por conta do movimento\no movimento existe por conta do tempo",
    note: "Os dois versos escorrem em coluna sobre o azul chapado, num fluxo que não chega ao fim. O texto se comporta exatamente como aquilo que enuncia.",
    noteEn: "The two lines pour down a column over flat blue, in a flow that never reaches an end. The text behaves exactly like what it states.",
  },
  {
    slug: "tudo-o-que-eu-queria-te-dizer",
    title: "Tudo o Que Eu Queria Te Dizer",
    titleEn: "Everything I Wanted to Tell You",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "tudo o que eu queria te dizer",
    note: "A frase começa em serifa nítida e se decompõe em ruído da esquerda para a direita. Sobra o começo; o resto nunca chega inteiro.",
    noteEn: "The sentence begins in crisp serif and decomposes into noise from left to right. The beginning survives; the rest never arrives intact.",
  },
  {
    slug: "eu-senhor-do-meu-fim",
    title: "Eu Senhor do Meu Fim",
    titleEn: "I, Master of My End",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "eu senhor do meu fim",
    note: "A frase é impressa em fitas coloridas que se entrelaçam num trançado. Ler exige seguir cada tira até onde ela desaparece por baixo da outra: o domínio anunciado depende de uma trama que nunca se vê inteira.",
    noteEn: "The phrase is printed on coloured ribbons woven into a braid. Reading it means following each strip to where it vanishes beneath the next: the mastery announced depends on a weave never seen whole.",
  },
  {
    slug: "a-gente-se-cruza-na-estrada",
    title: "A Gente Se Cruza na Estrada",
    titleEn: "We Cross Paths on the Road",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "a gente se cruza na estrada",
    note: "A frase percorre um nó que se dobra sobre si mesmo. As linhas se cruzam, se sobrepõem e retornam — o encontro anunciado no verso acontece na geometria.",
    noteEn: "The phrase travels along a knot folding over itself. The lines cross, overlap and return — the encounter announced in the line happens in the geometry.",
  },
  {
    slug: "tudo-por-agua-abaixo",
    title: "Tudo Por Água Abaixo",
    titleEn: "All Down the Drain",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "tudo por água abaixo",
    note: "A frase desce em espiral por um funil sem fundo, encolhendo até o limite da legibilidade e recomeçando na borda.",
    noteEn: "The phrase spirals down a bottomless funnel, shrinking to the edge of legibility and starting over at the rim.",
  },
  {
    slug: "regenere",
    title: "Regenere",
    titleEn: "Regenerate",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "regenere",
    note: "As letras giram num cilindro sem emenda nem começo. O fim da palavra já é o seu recomeço, e o eixo nunca aparece.",
    noteEn: "The letters revolve on a cylinder with no seam and no beginning. The end of the word is already its restart, and the axis never appears.",
  },
  {
    slug: "rodar-e-rodar",
    title: "Rodar e Rodar",
    titleEn: "Spin and Spin",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "rodar e rodar",
    note: "Anéis concêntricos de texto branco e vermelho giram em sentidos opostos e produzem moiré. O olho não encontra ponto de repouso.",
    noteEn: "Concentric rings of white and red text spin in opposite directions and produce moiré. The eye finds no place to rest.",
  },
  {
    slug: "poesia-ou-design",
    title: "Poesia ou Design?",
    titleEn: "Poetry or Design?",
    year: "2025",
    media: "video",
    ratio: "1 / 1",
    words: "poesia ou design?",
    note: "A pergunta se repete em linhas finíssimas que giram no espaço, ora legíveis, ora comprimidas até virar pura textura. Meta-poema da série: a mesma matéria oscila entre as duas respostas.",
    noteEn: "The question repeats in hairline rows turning in space, now legible, now compressed into pure texture. The series' meta-poem: the same matter oscillates between both answers.",
  },
  {
    slug: "o-futuro-e-imenso",
    title: "O Futuro é Imenso",
    titleEn: "The Future Is Immense",
    year: "2025",
    media: "video",
    ratio: "384 / 734",
    words: "o futuro é imenso",
    note: "A frase se estilhaça em cópias vermelhas, verdes e azuis que se afastam do centro e voltam a coincidir. A separação dos canais de cor vira medida de amplitude.",
    noteEn: "The phrase shatters into red, green and blue copies that drift from the centre and fall back into register. Colour-channel separation becomes a measure of magnitude.",
  },
  {
    slug: "o-todo-e-muita-coisa",
    title: "O Todo é Muita Coisa",
    titleEn: "The Whole Is a Lot",
    year: "2025",
    media: "video",
    ratio: "384 / 734",
    words: "o todo é muita coisa",
    note: "Raios de luz irradiam de dentro das letras, ora ofuscando a frase, ora devolvendo-a à leitura. O excesso é o assunto e também a técnica.",
    noteEn: "Rays of light radiate from inside the letters, now blinding the phrase, now handing it back to be read. Excess is both the subject and the technique.",
  },
  {
    slug: "meu-sonho-meu-pesadelo",
    title: "O Meu Sonho Também é Meu Pesadelo",
    titleEn: "My Dream Is Also My Nightmare",
    year: "2025",
    media: "image",
    ratio: "1400 / 876",
    words: "o meu sonho também é meu pesadelo",
    note: "Imagem fixa. Metade da frase permanece em serifa estável; a outra metade é corroída por glitch. A imagem se parte exatamente onde a frase se inverte.",
    noteEn: "A still image. Half the sentence stays in stable serif; the other half is eaten by glitch. The image breaks exactly where the sentence turns on itself.",
  },
  {
    slug: "nome-proprio-i",
    title: "Nome Próprio I",
    titleEn: "Proper Noun I",
    year: "2025",
    media: "video",
    ratio: "1000 / 624",
    words: "gustavo simas",
    note: "Primeira das quatro variações sobre o próprio nome. Blocos alternados de preto e branco formam um tabuleiro que uma onda atravessa, deslocando as letras sem nunca desfazer a grade.",
    noteEn: "First of four variations on the artist's own name. Alternating black and white blocks form a board crossed by a wave that shifts the letters without ever undoing the grid.",
  },
  {
    slug: "nome-proprio-ii",
    title: "Nome Próprio II",
    titleEn: "Proper Noun II",
    year: "2025",
    media: "video",
    ratio: "1000 / 626",
    words: "gustavo simas",
    note: "Milhares de repetições em escala decrescente comprimem o nome até virar moiré. Quando as camadas se afastam, o nome volta a ser apenas um nome.",
    noteEn: "Thousands of repetitions at decreasing scale compress the name into moiré. As the layers pull apart, the name becomes just a name again.",
  },
  {
    slug: "nome-proprio-iii",
    title: "Nome Próprio III",
    titleEn: "Proper Noun III",
    year: "2025",
    media: "video",
    ratio: "1000 / 624",
    words: "gustavo simas",
    note: "A mesma grade da primeira variação, agora em vermelho, azul e branco sobre amarelo saturado. A ondulação que era sombra vira cor.",
    noteEn: "The same grid as the first variation, now in red, blue and white on saturated yellow. The ripple that was shadow becomes colour.",
  },
  {
    slug: "nome-proprio-iv",
    title: "Nome Próprio IV",
    titleEn: "Proper Noun IV",
    year: "2025",
    media: "video",
    ratio: "1000 / 626",
    words: "gustavo simas",
    note: "Última variação: o nome ocupa a tela inteira em pesos, inclinações e recortes que se substituem, alternando positivo e negativo até esgotar as formas possíveis.",
    noteEn: "Final variation: the name fills the whole frame in weights, slants and crops that replace one another, alternating positive and negative until the possible forms run out.",
  },
];

const POEMS_PER_PAGE = 6;

// Diacritic-insensitive compare, so "pos-estruturalismo" finds "Pós-Estruturalismo".
const fold = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const creationExperiments = [
  {
    title: "LIFE∞ — Infinite Life Lab",
    titleEn: "LIFE∞ — Infinite Life Lab",
    description: "Um laboratório do Jogo da Vida de Conway em tela infinita, para desenhar padrões, acompanhar métricas e observar emergência, auto-organização e vida artificial acontecerem sozinhas.",
    descriptionEn: "A Conway's Game of Life laboratory on an infinite canvas, for drawing patterns, tracking metrics and watching emergence, self-organization and artificial life happen on their own.",
    tag: "Vida artificial",
    tagEn: "Artificial life",
    href: "https://gameoflife.gustavosimas.com/",
  },
  {
    title: "LENIA∞ — Continuous Life Lab",
    titleEn: "LENIA∞ — Continuous Life Lab",
    description: "Um laboratório de Lenia e SmoothLife, autômatos celulares contínuos em 2D e 3D: kernel de anel, função de crescimento, câmera livre e renderização volumétrica para ver a vida emergir sem grade nem passo discreto.",
    descriptionEn: "A laboratory of Lenia and SmoothLife, continuous cellular automata in 2D and 3D: ring kernel, growth function, free camera and volumetric rendering to watch life emerge with no grid and no discrete step.",
    tag: "Vida artificial",
    tagEn: "Artificial life",
    href: "https://smoothlife.gustavosimas.com/",
  },
  {
    title: "PARTICLES∞ — Emergent Matter Lab",
    titleEn: "PARTICLES∞ — Emergent Matter Lab",
    description: "Um laboratório de vida por partículas: milhares de pontos coloridos que só sabem se atrair ou se repelir uns aos outros e, dessa regra mínima, formam células, membranas, enxames e organismos que ninguém programou.",
    descriptionEn: "A particle life laboratory: thousands of colored dots that only know how to attract or repel one another and, from that minimal rule, form cells, membranes, swarms and organisms nobody programmed.",
    tag: "Vida artificial",
    tagEn: "Artificial life",
    href: "https://particlelife.gustavosimas.com/",
  },
];

const creationsCopy = {
  pt: {
    back: "Voltar ao site",
    themeAria: "Alternar tema",
    languageAria: "Mudar idioma para inglês",
    kicker: "Laboratório",
    title: "Criações",
    lede: "O que não cabe exatamente no currículo. Experimentos, poemas visuais, brinquedos computacionais e ideias que existem porque eu quis ver como ficariam. Uma pesquisa contínua das possibilidades de expressão em diferentes mídias.",
    poems: {
      number: "02",
      label: "Poemas visuais animados",
      title1: "A palavra",
      title2: "como matéria.",
      subtitle: "Série de poemas digitais em que a frase deixa de ser suporte do sentido e vira corpo: bandeira, relógio, rio, estrutura que desaba. Clique em qualquer peça para vê-la inteira, com o texto e uma nota sobre o procedimento.",
      open: "Abrir peça",
      close: "Fechar",
      words: "Texto",
      about: "Procedimento",
      play: "Reproduzir",
      still: "Imagem fixa",
      galleryAria: "Galeria de poemas visuais",
      searchLabel: "Buscar",
      searchPlaceholder: "Título, texto ou ano",
      searchAria: "Buscar poemas visuais",
      searchClear: "Limpar busca",
      counter: "peças",
      counterOne: "peça",
      empty: "Nenhuma peça encontrada para esta busca.",
      previous: "Anteriores",
      next: "Próximas",
      page: "Página",
      pageOf: "de",
      pagerAria: "Paginação da galeria de poemas",
    },
    interactive: {
      number: "01",
      label: "Poemas interativos",
      title1: "Quatro poemas",
      title2: "que respondem.",
      subtitle: "Um relógio que marca o horário de Brasília em tempo real, com as letras sendo arrastadas pelo tempo, uma bandeira que balança a sua frase, uma palavra desenhada pela repetição de outra e um chão onde as palavras caem e se desmancham em letras.",
      clockTitle: "O Tempo Não Para",
      clockNote: "O tempo arrasta as palavras. “Não sei o que é o tempo. Não sei qual a verdadeira medida que ele tem, se tem alguma. A do relógio sei que é falsa: divide o tempo espacialmente, por fora” — Fernando Pessoa. Relógio no horário de Brasília.",
      clockLabel: "Horário de Brasília",
      clockAria: "Relógio em tempo real com as letras da frase o tempo não para sendo arrastadas pelo ponteiro dos segundos",
      flagTitle: "Balance Sua Bandeira",
      flagNote: "As palavras texto e tecido vêm da mesma raiz em latim, texere, que significa “tecer”, “entrelaçar” ou “construir”. Seu texto tremulando ao vento.",
      flagInput: "Escreva a sua palavra",
      flagHint: "Até 42 caracteres. Deixe em branco para ver a frase original.",
      flagLight: "Faixa clara",
      flagDark: "Faixa escura",
      flagBackground: "Fundo",
      flagReset: "Restaurar",
      flagExport: "Baixar a sua bandeira",
      flagExporting: "Gerando o arquivo…",
      flagAria: "Bandeira animada feita com a frase digitada pelo visitante",
      mosaicTitle: "Uma Palavra Dentro da Outra",
      mosaicNote: "Homenagem ao LUXO/LIXO de Augusto de Campos: uma palavra deixa de ser lida e passa a servir só de molde para outra. Escreva a palavra que aparece e a palavra que a preenche — a segunda se repete até desenhar cada letra da primeira, e o que se lê depende da distância de quem olha.",
      mosaicStencil: "Palavra que aparece",
      mosaicStencilPlaceholder: "LIXO",
      mosaicTile: "Palavra que preenche",
      mosaicTilePlaceholder: "LUXO",
      mosaicMode: "Modo de composição",
      mosaicModeFlow: "Palavra contínua",
      mosaicModeWhole: "Palavras inteiras",
      mosaicHint: "Até 12 caracteres em cada campo. Em «palavra contínua» o texto corre e é recortado pelas letras; em «palavras inteiras» nenhuma palavra é cortada. Deixe em branco para ver o par original.",
      mosaicAria: "Canvas com uma palavra grande desenhada pela repetição de outra palavra menor",
      gravityTitle: "A Gravidade da Palavra",
      gravityNote: "Toda palavra escrita aqui se desfaz ao cair: as letras se soltam umas das outras e passam a obedecer só à gravidade, ao atrito e ao acaso das colisões. Nenhuma volta a se juntar sozinha; o sentido se acumula no chão como entulho tipográfico. Escolha a fonte e a cor, edite ou apague o que já caiu, e arraste qualquer letra para jogá-la de novo ao ar.",
      gravitySeed: "gravidade",
      gravityInput: "Escreva uma palavra",
      gravityPlaceholder: "queda",
      gravityAdd: "Soltar",
      gravityUpdate: "Atualizar",
      gravityFont: "Fonte das letras",
      gravityColour: "Cor",
      gravityClear: "Limpar o chão",
      gravityEdit: "Editar palavra",
      gravityDelete: "Apagar palavra",
      gravityEmpty: "Nada caiu ainda.",
      gravityHint: "Até 28 caracteres por palavra · clique numa palavra para editar · arraste as letras para atirá-las.",
      gravityAria: "Canvas com física de gravidade onde as letras das palavras escritas caem, colidem e se empilham",
      gravityPull: "Gravidade",
      gravityBounce: "Quique",
      gravityGrip: "Atrito",
      gravityReset: "Física original",
    },
    experiments: {
      number: "03",
      label: "Experimentos e laboratórios",
      title1: "Experimentos de",
      title2: "vida artificial",
      subtitle: "Peças que funcionam operando algo que não estava previsto.",
      open: "Abrir experimento",
      openTitle: "Em aberto",
      openText: "Este espaço continua sendo escrito. Novos experimentos entram aqui conforme saem do papel.",
    },
    zine: {
      number: "04",
      label: "Publicação experimental",
      title: "Reciclopédia Concreta",
      text: "Um caderno de poesia visual reunindo peças tipográficas em página fixa, uma versão impressa de investigação similar a que aqui se move.",
      open: "Em breve...",
      alt: "Capa da Reciclopédia Concreta",
    },
    footer: "Criações · experimentos · poemas visuais",
  },
  en: {
    back: "Back to site",
    themeAria: "Switch theme",
    languageAria: "Mudar idioma para português",
    kicker: "Laboratory",
    title: "Creations",
    lede: "What doesn't quite fit in a CV. Experiments, visual poems, computational toys and ideas that exist because I wanted to see how they would turn out. A continuous investigation into the possibilities of expression across different media.",
    poems: {
      number: "02",
      label: "Animated visual poems",
      title1: "The word",
      title2: "as matter.",
      subtitle: "A series of digital poems in which the sentence stops carrying meaning and becomes a body: a flag, a clock, a river, a structure that collapses. Click any piece to see it whole, with its text and a note on the procedure.",
      open: "Open piece",
      close: "Close",
      words: "Text",
      about: "Procedure",
      play: "Play",
      still: "Still image",
      galleryAria: "Visual poems gallery",
      searchLabel: "Search",
      searchPlaceholder: "Title, text or year",
      searchAria: "Search visual poems",
      searchClear: "Clear search",
      counter: "pieces",
      counterOne: "piece",
      empty: "No piece matches this search.",
      previous: "Previous",
      next: "Next",
      page: "Page",
      pageOf: "of",
      pagerAria: "Poem gallery pagination",
    },
    interactive: {
      number: "01",
      label: "Interactive poems",
      title1: "Four poems",
      title2: "that answer back.",
      subtitle: "A clock running on real Brasília time, its letters dragged along by time itself, a flag that waves your own words, a word drawn by the repetition of another, and a floor where words fall and come apart into letters.",
      clockTitle: "O Tempo Não Para",
      clockNote: "Time drags the words along. “I do not know what time is. I do not know its true measure, if it has one. The clock’s I know to be false: it divides time spatially, from the outside” — Fernando Pessoa. A clock running on Brasília time.",
      clockLabel: "Brasília time",
      clockAria: "Real-time clock with the letters of the phrase o tempo não para dragged along by the second hand",
      flagTitle: "Balance Sua Bandeira",
      flagNote: "The words text and textile share the same Latin root, texere: to weave, to interlace, to build. Your text, rippling in the wind.",
      flagInput: "Write your own words",
      flagHint: "Up to 42 characters. Leave it empty for the original phrase.",
      flagLight: "Light stripe",
      flagDark: "Dark stripe",
      flagBackground: "Background",
      flagReset: "Reset",
      flagExport: "Download your flag",
      flagExporting: "Building the file…",
      flagAria: "Animated flag built from the phrase typed by the visitor",
      mosaicTitle: "One Word Inside Another",
      mosaicNote: "After Augusto de Campos' LUXO/LIXO: one word stops being read and becomes nothing but the mould of another. Write the word that shows and the word that fills it — the second repeats itself until it draws every letter of the first, and what you read depends on how far away you stand.",
      mosaicStencil: "Word that shows",
      mosaicStencilPlaceholder: "LIXO",
      mosaicTile: "Word that fills it",
      mosaicTilePlaceholder: "LUXO",
      mosaicMode: "Composition mode",
      mosaicModeFlow: "Running text",
      mosaicModeWhole: "Whole words",
      mosaicHint: "Up to 12 characters in each field. In \u201crunning text\u201d the words flow and get cut by the letters; in \u201cwhole words\u201d nothing is ever cut open. Leave them empty for the original pair.",
      mosaicAria: "Canvas with a large word drawn by the repetition of a smaller word",
      gravityTitle: "The Gravity of the Word",
      gravityNote: "Every word written here comes apart as it falls: the letters break loose from one another and start obeying nothing but gravity, friction and the chance of collisions. None of them reassembles on its own; meaning piles up on the floor as typographic rubble. Pick a typeface and a colour, edit or erase what has already fallen, and drag any letter to throw it back into the air.",
      gravitySeed: "gravity",
      gravityInput: "Write a word",
      gravityPlaceholder: "fall",
      gravityAdd: "Drop",
      gravityUpdate: "Update",
      gravityFont: "Letter typeface",
      gravityColour: "Colour",
      gravityClear: "Clear the floor",
      gravityEdit: "Edit word",
      gravityDelete: "Delete word",
      gravityEmpty: "Nothing has fallen yet.",
      gravityHint: "Up to 28 characters per word · click a word to edit it · drag the letters to throw them.",
      gravityAria: "Canvas with gravity physics where the letters of the words written fall, collide and pile up",
      gravityPull: "Gravity",
      gravityBounce: "Bounce",
      gravityGrip: "Friction",
      gravityReset: "Default physics",
    },
    experiments: {
      number: "03",
      label: "Experiments and labs",
      title1: "Experiments in",
      title2: "artificial life",
      subtitle: "Pieces that work by setting in motion something that was not foreseen.",
      open: "Open experiment",
      openTitle: "Open-ended",
      openText: "This space is still being written. New experiments land here as they leave the drawing board.",
    },
    zine: {
      number: "04",
      label: "Experimental publication",
      title: "Reciclopédia Concreta",
      text: "A visual poetry notebook gathering typographic pieces on the fixed page, a printed version of an investigation similar to the one that moves here.",
      open: "Coming soon...",
      alt: "Cover of Reciclopédia Concreta",
    },
    footer: "Creations · experiments · visual poems",
  },
};

const portfolioCopy = {
  pt: {
    brandTagline: "Conhecimento · tecnologia · imaginação",
    nav: ["Manifesto", "Portfólio", "Trajetória", "Publicações", "Currículo", "Criações"],
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
    portfolio: {
      label: "Portfólio de projetos",
      title1: "Portfólio de",
      title2: "projetos.",
      subtitle: "Alguns livros, pesquisas, plataformas, álbuns e experimentos conectados pelas perguntas que os originaram.",
      filterAria: "Filtrar trabalhos",
      searchPlaceholder: "Pesquisar projetos, tecnologias ou termos...",
      searchAria: "Pesquisar no portfólio",
      noResults: "Nenhum projeto encontrado para esta busca.",
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
    contact: { kicker: "Disponível para projetos, pesquisa e colaboração", title1: "Vamos imaginar", title2: "alguma coisa", title3: "juntos?", description: "Conhecimento, tecnologia, literatura, produção fonográfica e audiovisual para pensar o presente e inventar futuros." },
    footer: { location: "Florianópolis · Brasil", text: "© 2026 · Conhecimento · tecnologia · imaginação", top: "Voltar ao topo" },
    atlas: { aria: "Atlas dos três eixos", core: "Conhecimento", nodes: ["Investigar", "Sistematizar", "Criar"] },
  },
  en: {
    brandTagline: "Knowledge · technology · imagination",
    nav: ["Manifesto", "Portfolio", "Journey", "Publications", "CV", "Creations"],
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
    portfolio: {
      label: "Project portfolio",
      title1: "Project",
      title2: "portfolio.",
      subtitle: "Books, research, platforms, albums and experiments connected by the questions that originated them.",
      filterAria: "Filter projects",
      searchPlaceholder: "Search projects, technologies or terms...",
      searchAria: "Search portfolio",
      noResults: "No projects found matching this search.",
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
    email: "contato@gustavosimas.com",
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

  if (currentPath === "/curriculo") {
    return <Curriculum navigate={navigate} language={language} setLanguage={setLanguage} />;
  }

  if (currentPath === "/criacoes") {
    return <Creations navigate={navigate} language={language} setLanguage={setLanguage} />;
  }

  return <Portfolio navigate={navigate} language={language} setLanguage={setLanguage} />;
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
  const [projectSearch, setProjectSearch] = useState("");
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
    const q = projectSearch.trim().toLowerCase();
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
  }, [filter, projectSearch, language]);

  const navigation: Array<{ label: string; href: string; isRoute?: boolean }> = [
    { label: copy.nav[0], href: "#manifesto" },
    { label: copy.nav[1], href: "#trabalhos" },
    { label: copy.nav[2], href: "#trajetoria" },
    { label: copy.nav[3], href: "#publicacoes" },
    { label: copy.nav[4], href: "/curriculo", isRoute: true },
    { label: copy.nav[5], href: "/criacoes", isRoute: true },
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
        </div>
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
            <div className="portfolio-controls">
              <div className="filters" role="group" aria-label={copy.portfolio.filterAria}>
                {(["Todos", "Pesquisa", "Tecnologia", "Literatura", "Música", "Visual"] as const).map((item) => (
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
            <div className="project-grid">
              <AnimatePresence>
                {visibleProjects.map((project) => (
                  <ProjectCard key={project.title} project={project} language={language} />
                ))}
              </AnimatePresence>
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
            </div>
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
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("theme") as "dark" | "light") || "dark");
  const isPt = language === "pt";
  const data = isPt ? cvData : cvDataEn;
  const copy = cvCopy[language];

  useEffect(() => {
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

// --------------------------------------------------------------------------
// CREATIONS PAGE COMPONENT
// --------------------------------------------------------------------------
function Creations({
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
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
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
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {copy.title}
        </motion.h1>
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
          <article className="cr-live-piece">
            <ClockPoem label={copy.interactive.clockLabel} aria={copy.interactive.clockAria} />
            <div className="cr-live-body">
              <h3>{copy.interactive.clockTitle}</h3>
              <p>{copy.interactive.clockNote}</p>
            </div>
          </article>
          <article className="cr-live-piece">
            <FlagPoem placeholder="balance sua bandeira" copy={copy.interactive} />
            <div className="cr-live-body">
              <h3>{copy.interactive.flagTitle}</h3>
              <p>{copy.interactive.flagNote}</p>
            </div>
          </article>
          <article className="cr-live-piece is-wide">
            <MosaicPoem copy={copy.interactive} />
            <div className="cr-live-body">
              <h3>{copy.interactive.mosaicTitle}</h3>
              <p>{copy.interactive.mosaicNote}</p>
            </div>
          </article>
          <article className="cr-live-piece is-wide">
            <GravityPoem copy={copy.interactive} />
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
                  onClick={() => setActive(poem)}
                  aria-label={`${copy.poems.open}: ${title}`}
                >
                  <span className="poem-frame" style={{ aspectRatio: poem.ratio }}>
                    <PoemMedia poem={poem} play={!reduceMotion && poem.media === "video"} />
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
            <motion.a
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
            </motion.a>
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
          <motion.div
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
            <motion.div
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
                {active.media === "image" ? (
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
            </motion.div>
          </motion.div>
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

// PALAVRA DENTRO DA PALAVRA ---------------------------------------------
// After Augusto de Campos' LUXO/LIXO: the big word is never drawn, only used
// as a stencil. Two ways of filling it — "flow" tiles the small word over the
// whole canvas and clips it to the stencil, "whole" lays the small word on a
// grid and keeps only the cells the stencil covers, so every word stays intact.

const mosaicMaxChars = 12;
type MosaicMode = "flow" | "whole";

function MosaicPoem({ copy }: { copy: (typeof creationsCopy)["pt"]["interactive"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const [stencil, setStencil] = useState("");
  const [tile, setTile] = useState("");
  const [mode, setMode] = useState<MosaicMode>("flow");
  const reduceMotion = useReducedMotion();
  const wordsRef = useRef({ stencil: "", tile: "" });

  const clean = (value: string, fallback: string) => (value.trim() || fallback).toUpperCase().slice(0, mosaicMaxChars);

  useEffect(() => {
    wordsRef.current = {
      stencil: clean(stencil, copy.mosaicStencilPlaceholder),
      tile: clean(tile, copy.mosaicTilePlaceholder),
    };
  }, [stencil, tile, copy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const mask = maskRef.current ?? (maskRef.current = document.createElement("canvas"));
    const maskContext = mask.getContext("2d", { willReadFrequently: true });
    if (!maskContext) return;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let visible = true;
    let drift = 0;
    let painted = "";
    let previous = performance.now();

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      mask.width = canvas.width;
      mask.height = canvas.height;
      // Resizing wipes the canvas, so the still version has to be laid out again.
      painted = "";
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

    const stencilFont = (size: number) => `700 ${size}px Inter, ui-sans-serif, sans-serif`;
    const tileFont = (size: number) => `500 ${size}px "DM Mono", ui-monospace, monospace`;
    // The frame loop re-measures every pass, so a face that lands late simply
    // corrects itself on the next one — no need to wait on the download here.
    void document.fonts.load(stencilFont(120)).catch(() => undefined);
    void document.fonts.load(tileFont(16)).catch(() => undefined);

    // Clipped fill: the small word runs edge to edge and the stencil cuts it.
    const paintFlow = (word: string, size: number) => {
      // Small enough that a dozen or so rows cross the stencil: any coarser and
      // the big word stops being legible from across the room.
      const unit = Math.max(6, Math.min(14, size * 0.04));
      context.font = tileFont(unit);
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = "#eef2e8";
      const chunk = `${word} `;
      const chunkWidth = context.measureText(chunk).width || unit;
      const line = chunk.repeat(Math.ceil(width / chunkWidth) + 3);
      const step = unit * 1.15;
      for (let row = 0, y = step / 2; y < height + step; row += 1, y += step) {
        // Alternating directions keep neighbouring rows from locking into a
        // single sliding block, which reads as a texture instead of a word.
        const shift = row % 2 === 0 ? drift : -drift;
        context.fillText(line, (shift % chunkWidth) - 2 * chunkWidth, y);
      }
      context.globalCompositeOperation = "destination-in";
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.drawImage(mask, 0, 0);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.globalCompositeOperation = "source-over";
    };

    // Whole-word fill: a cell is either printed in full or left blank, so the
    // letters are spelled by which words are there — never by cutting one open.
    const paintWhole = (word: string, stencilLetters: number, ink: MosaicInk) => {
      // Measure the word once at a reference size: its width scales linearly, so
      // this is all the grid needs to work back from resolution to type size.
      const reference = 100;
      context.font = tileFont(reference);
      const perPixel = (context.measureText(word).width || reference) / reference;
      const grid = mosaicGrid(width, height, ink, stencilLetters, perPixel, ratio);

      context.font = tileFont(grid.size);
      context.textAlign = "center";
      context.textBaseline = "alphabetic";
      context.fillStyle = "#eef2e8";
      const tile = context.measureText(word);
      const lift = ((tile.actualBoundingBoxAscent ?? grid.size * 0.7) - (tile.actualBoundingBoxDescent ?? 0)) / 2;

      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      const covered = (x: number, y: number) => {
        const px = Math.round(x * ratio);
        const py = Math.round(y * ratio);
        if (px < 0 || py < 0 || px >= mask.width || py >= mask.height) return false;
        return pixels[(py * mask.width + px) * 4 + 3] > 40;
      };

      for (let row = 0; row < grid.rows; row += 1) {
        for (let column = 0; column < grid.columns; column += 1) {
          const x = grid.left + (column + 0.5) * grid.cell;
          const y = grid.top + (row + 0.5) * grid.rowHeight;
          // How much of the cell the stencil covers, not just its centre: one
          // centre sample drops whole words off the diagonals and keeps them on
          // the thinnest hairline, which is what shreds letters like M and X.
          let hits = 0;
          let probes = 0;
          for (let sx = -3; sx <= 3; sx += 1) {
            for (let sy = -2; sy <= 2; sy += 1) {
              probes += 1;
              if (covered(x + (sx * grid.cell) / 7.5, y + (sy * grid.rowHeight) / 5)) hits += 1;
            }
          }
          if (hits / probes >= 0.4) context.fillText(word, x, y + lift);
        }
      }
    };

    const draw = (now: number) => {
      const elapsed = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      frame = requestAnimationFrame(draw);
      if (!visible) return;

      const words = wordsRef.current;
      const flowing = mode === "flow" && !reduceMotion;
      const key = `${mode}|${words.stencil}|${words.tile}|${width}x${height}`;
      if (flowing) drift += elapsed * 16;
      else if (key === painted) return;
      painted = key;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      // The stencil, fitted to whichever of the two axes runs out first.
      maskContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      maskContext.clearRect(0, 0, width, height);
      maskContext.textAlign = "center";
      maskContext.textBaseline = "alphabetic";
      maskContext.fillStyle = "#000";
      const reference = 100;
      maskContext.font = stencilFont(reference);
      const measured = maskContext.measureText(words.stencil).width || reference;
      const { size, squeeze } = mosaicStencil(width, height, measured / reference);
      maskContext.font = stencilFont(size);
      // Centre the ink, not the em box: capitals sit high in the line, and
      // centring on the baseline would leave the word floating above the frame.
      const metrics = maskContext.measureText(words.stencil);
      const ascent = metrics.actualBoundingBoxAscent ?? size * 0.72;
      const descent = metrics.actualBoundingBoxDescent ?? 0;
      const drawn = (metrics.actualBoundingBoxLeft ?? 0) + (metrics.actualBoundingBoxRight ?? 0) || metrics.width;
      const ink: MosaicInk = { width: drawn * squeeze, height: ascent + descent };
      maskContext.save();
      maskContext.translate(width / 2, height / 2 + (ascent - descent) / 2);
      maskContext.scale(squeeze, 1);
      maskContext.fillText(words.stencil, 0, 0);
      maskContext.restore();

      if (mode === "whole") paintWhole(words.tile, words.stencil.length, ink);
      else paintFlow(words.tile, size);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
  }, [mode, reduceMotion]);

  const modes: Array<{ id: MosaicMode; label: string }> = [
    { id: "flow", label: copy.mosaicModeFlow },
    { id: "whole", label: copy.mosaicModeWhole },
  ];

  return (
    <figure className="live-poem">
      <canvas ref={canvasRef} className="live-canvas is-mosaic" role="img" aria-label={copy.mosaicAria} />
      <figcaption className="live-controls">
        <div className="mosaic-fields">
          <div className="live-field">
            <label htmlFor="mosaic-stencil">{copy.mosaicStencil}</label>
            <input
              id="mosaic-stencil"
              type="text"
              value={stencil}
              maxLength={mosaicMaxChars}
              placeholder={copy.mosaicStencilPlaceholder}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setStencil(event.target.value)}
            />
          </div>
          <div className="live-field">
            <label htmlFor="mosaic-tile">{copy.mosaicTile}</label>
            <input
              id="mosaic-tile"
              type="text"
              value={tile}
              maxLength={mosaicMaxChars}
              placeholder={copy.mosaicTilePlaceholder}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setTile(event.target.value)}
            />
          </div>
        </div>

        <div className="mosaic-modes" role="group" aria-label={copy.mosaicMode}>
          {modes.map((option) => (
            <button
              key={option.id}
              type="button"
              className="live-reset"
              aria-pressed={mode === option.id}
              onClick={() => setMode(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <small className="gravity-hint">{copy.mosaicHint}</small>
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

    let dragged: GravityLetter | null = null;
    let pointer = { x: 0, y: 0, at: 0 };

    const toWorld = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onPointerDown = (event: PointerEvent) => {
      const { x, y } = toWorld(event);
      for (let index = lettersRef.current.length - 1; index >= 0; index -= 1) {
        const letter = lettersRef.current[index];
        if (Math.hypot(letter.x - x, letter.y - y) <= letter.r * 1.3) {
          dragged = letter;
          letter.held = true;
          letter.vx = 0;
          letter.vy = 0;
          pointer = { x, y, at: performance.now() };
          canvas.setPointerCapture(event.pointerId);
          event.preventDefault();
          return;
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragged) return;
      const { x, y } = toWorld(event);
      const now = performance.now();
      const elapsed = Math.max(8, now - pointer.at) / 1000;
      dragged.vx = (x - pointer.x) / elapsed;
      dragged.vy = (y - pointer.y) / elapsed;
      dragged.x = x;
      dragged.y = y;
      pointer = { x, y, at: now };
      event.preventDefault();
    };

    const onPointerUp = () => {
      if (!dragged) return;
      // A stale throw velocity would fling a letter the user merely parked.
      if (performance.now() - pointer.at > 120) {
        dragged.vx = 0;
        dragged.vy = 0;
      }
      dragged.held = false;
      dragged = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

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

export default App;
