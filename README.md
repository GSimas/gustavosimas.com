# Gustavo Simas — atlas pessoal

Site pessoal e portfólio interativo de Gustavo Simas da Silva, reunindo pesquisa, tecnologia, literatura, música e experimentação visual.

## Recursos

- página inicial responsiva com os eixos Investigar, Construir e Criar;
- portfólio filtrável por pesquisa, tecnologia, literatura, música e visual;
- rota `/curriculo` com currículo detalhado e impressão em PDF;
- temas claro e escuro, alto contraste, ampliação de fonte e redução de movimento;
- animações com Motion e ícones Lucide;
- SEO, sitemap, robots, manifesto de web app e metadados sociais;
- TypeScript, React 19 e Vite;
- configuração pronta para deploy na Netlify.

## Instalação

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

Os arquivos finais serão gerados em `dist/`.

## Deploy na Netlify

O arquivo `netlify.toml` já contém a configuração necessária:

- comando de build: `npm run build`
- diretório de publicação: `dist`
- Node.js: 20

Importe o repositório na Netlify e publique. A regra de redirecionamento para SPA já está configurada, permitindo acesso direto a `/curriculo`.

## Conteúdo

- `src/App.tsx`: conteúdo, componentes e interações;
- `src/styles.css`: identidade visual, responsividade, acessibilidade e impressão;
- `public/assets`: fotografias e imagens do portfólio;
- `public`: favicon, manifesto, robots, sitemap e redirecionamentos.

## Poema interativo: legibilidade

A composição, as duas escalas de leitura e os testes de “Uma Palavra Dentro da Outra”
estão documentados em [MOSAIC.md](MOSAIC.md).

```bash
npm run check:mosaic
npm run check:mosaic:browser
```

## Tavo — assistente de IA

Botão flutuante presente em todas as páginas (`src/Tavo.tsx`). Responde sobre o Gustavo
com base no conteúdo do site (`src/content.ts`), na voz do guia de estilo, via DeepSeek.

- **Chave:** copie `.env.example` para `.env` e preencha `DEEPSEEK_API_KEY`. Na Netlify,
  cadastre a mesma variável em *Site configuration → Environment variables*.
- **Servidor:** `netlify/functions/tavo.ts` (rota `/api/tavo`). Em `npm run dev` a mesma
  função roda como middleware do Vite; a chave nunca chega ao navegador.
- **Guardrails:** só aceita a própria origem, rate limit (Netlify + memória), validação e
  limites de entrada, papel `system` bloqueado no cliente, raciocínio do modelo não é
  enviado ao navegador, marcador secreto contra vazamento do prompt, markdown renderizado
  sem HTML, tempo máximo de resposta e escopo/privacidade definidos no prompt.
- **Transparência (ISO/IEC 42001):** aviso fixo de que é uma IA, que pode errar, qual
  provedor processa as mensagens e o contato para confirmar informações; cada resposta é
  rotulada como gerada por IA.

- **Base extra:** `tavo/faq.md` (perguntas e respostas escritas à mão, com prioridade) e
  `tavo/links.md` (coleta automática de todos os links externos do site: GitHub via API,
  ORCID, Spotify, projetos e artigos; LinkedIn, Instagram e Lattes exigem login e ficam de
  fora). A coleta roda a cada deploy na Netlify; localmente, `npm run tavo:links`.

```bash
npm run check:tavo
```

## Auditoria de desempenho e acessibilidade

Mede o build de produção (bundle, FCP/LCP/CLS/TBT com CPU 4x mais lenta, latência de
interação, FPS, heap entre trocas de rota e violações WCAG 2.1 AA via axe-core):

```bash
npm run build && npm run audit
```

Medidas de carregamento variam entre execuções (as fontes vêm da rede); compare
tendências, não uma execução isolada.
