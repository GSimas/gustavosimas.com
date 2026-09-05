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
