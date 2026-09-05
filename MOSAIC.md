# Legibilidade de “Uma Palavra Dentro da Outra”

## Problema e critérios

O modo de palavras inteiras usava cerca de 3,5 colunas por letra e permitia
imprimir uma palavra quando apenas 40% das sondagens da célula tocavam o molde.
Palavras de preenchimento longas produziam células largas: diagonais sumiam,
contraformas (os vazios de A, O, R etc.) se fechavam e letras vizinhas se uniam.
O piso da fonte dependia do DPR; os testes aceitavam composições sem resolução
suficiente quando esse piso era atingido. O carregamento tardio de fontes também
não invalidava a composição estática.

O plano implementado separa quatro responsabilidades:

1. **Compor a palavra maior com resolução suficiente**, antes de adaptá-la à tela.
2. **Preservar palavras inteiras e a separação entre letras**, medindo os glifos reais.
3. **Oferecer duas escalas de leitura**, sem prometer que doze palavras compridas
   caberão confortavelmente dentro de cada letra em uma tela de 320 pixels.
4. **Verificar geometria, rasterização e interação**, incluindo casos extremos,
   fontes substitutas e diferenças entre motores de navegador.

## Mecanismo

- Composição lógica de 1200 × 500, independente da tela e do DPR; Inter 900 para
  um molde espesso, sem deformação horizontal, e DM Mono 500 no preenchimento.
- Medição individual de largura, ascendentes, descendentes e saliências dos glifos.
  Um espaço explícito separa as regiões de letras vizinhas.
- Resolução inicial de pelo menos 12 colunas por letra e 22 linhas na altura da
  tinta. Espaçamento horizontal de 18% e entrelinhas de 1,45 em.
- A área alfa completa de cada célula é medida por uma tabela de áreas acumuladas.
  A interpolação da tabela trata coordenadas fracionárias sem arredondamentos
  que poderiam preencher indevidamente um vazio.
- Oito alinhamentos da grade são comparados por letra. A escolha maximiza a
  interseção sobre união (IoU) entre o molde e as células ocupadas, penalizando
  tanto traços perdidos quanto áreas externas preenchidas.
- Se alguma letra tiver IoU inferior a 0,82, a grade é refinada em 20%, até três
  vezes. Há um limite de trabalho para entradas arbitrárias; a métrica é um
  indicador geométrico, não uma prova universal de reconhecimento humano.
- Na **visão geral**, o desenho inteiro cabe na área disponível. Quando os textos
  menores ficam abaixo de 4 pixels, a silhueta exata aparece sob o mosaico com
  intensidade progressiva, para preservar a leitura e o contraste da palavra
  maior. As palavras inteiras continuam sendo desenhadas sem recorte pelo molde.
- **Ler preenchimento** calcula a ampliação necessária para fonte mínima de
  **14 pixels CSS**, em qualquer DPR. O usuário percorre a composição por rolagem,
  toque ou setas com a área focada; a animação fica pausada. As bordas do visor
  podem ocultar parte do desenho, como em qualquer área rolável.
- O par também aparece como texto HTML, com rótulos e anúncio acessível. O canvas
  recebe descrição que acompanha o conteúdo e o modo selecionados.
- O modo contínuo mantém o recorte pelo molde, por definição; a garantia de
  palavras sem recortes internos se aplica ao modo **Palavras inteiras**.

## Desempenho e ciclo de vida

A máscara é construída em 2× (2400 × 1000) apenas após mudanças de texto ou fonte.
A tabela de áreas é temporária. A ampliação não aumenta a máscara nem o backing
store do canvas: só a região visível ganha pixels e somente suas palavras são
pintadas. Isso evita canvases com dezenas de milhares de pixels de largura.

Mudanças de texto são agrupadas em 80 ms; fontes tardias invalidam inclusive a
versão estática. Falhas de fontes usam as famílias substitutas. O modo inteiro e
a leitura ampliada só redesenham quando há mudanças; a animação para fora da tela.
A preferência de redução de movimento é acompanhada em tempo real. Observadores,
ouvintes, temporizadores e frames são removidos ao desmontar o componente.

A área ampliada não participa da largura mínima do grid da página. Suas dimensões
não têm transições: isso evita que o Firefox limite a rolagem inicial pelas
medidas anteriores, inclusive com a regra global de redução de movimento.

## Verificação reproduzível

Para os scripts TypeScript, use Node 22.18+ (a validação desta mudança usa Node 24).

```sh
npm install
npm run build
npm run check:mosaic
npm run check:gravity
npx playwright install chromium firefox webkit
MOSAIC_BROWSERS=chromium,firefox,webkit npm run check:mosaic:browser
```

O teste de navegador inicia e encerra seu próprio Vite na porta 5187. Sem a
variável `MOSAIC_BROWSERS`, usa Chromium. Capturas e métricas são gravadas em
`/tmp/mosaic-regression`; o diretório pode ser alterado por `MOSAIC_SCREENSHOTS`.

- **2.400 combinações geométricas**: dez palavras maiores × dez preenchimentos ×
  seis tamanhos × quatro DPRs; resolução, espaçamento, encaixe da visão geral e
  tamanho mínimo da leitura ampliada.
- Normalização NFC, entradas vazias, espaços, caracteres invisíveis, expansão de
  maiúsculas, limite de 12 caracteres e áreas fracionárias. Um O sintético verifica
  que a contraforma permanece vazia e que nenhuma célula escapa da região.
- **19 pares rasterizados por navegador**, com medições reais: AMOR/ESPANTO,
  LIXO/LUXO, palavras de 12 caracteres, repetições de I e W, acentos, cedilha,
  pontuação, espaços e preenchimentos de uma letra. Verifica IoU ≥ 0,82 em cada
  glifo visível, representação de todas as letras e ausência de células que
  unam letras ou de palavras maiores que suas células.
- Interação em larguras de **1440, 768, 390 e 320 pixels**: visão geral, leitura,
  rolagem, setas, retorno ao início, limite do backing store e confinamento da
  largura do poema.
- Redução de movimento, animação contínua, pausa na ampliação, atualização após
  evento de fonte tardia, campos vazios, acentos decompostos, limite de entrada,
  tema claro e idioma inglês.
- Fontes externas bloqueadas em todos os motores; backing stores reais com DPR
  1,25, 2 e 3 no Chromium e DPR 2 no Firefox e WebKit.

As capturas devem ser inspecionadas junto com as métricas. Os testes de IoU
comparam a silhueta das células com a fonte; o apoio de contraste e a leitura
ampliada tratam os limites perceptivos que essa comparação não consegue medir.

## Resultado da validação desta mudança

Build de produção, 2.400 combinações geométricas, regressão do poema de gravidade
e bateria completa dos três navegadores passaram. As capturas de AMOR/ESPANTO,
palavras longas no celular, leitura com acentos e fontes substitutas foram
inspecionadas visualmente.

| Motor | Pares rasterizados | Menor IoU entre os glifos | Maior tempo de composição observado |
| --- | ---: | ---: | ---: |
| Chromium | 19 | 0,833 | 24 ms |
| Firefox | 19 | 0,823 | 42 ms |
| WebKit | 19 | 0,828 | 69 ms |

Tempos medidos na máquina local durante a bateria; não são um limite garantido
para outros dispositivos. A leitura ampliada manteve o mínimo de 14 pixels CSS
nos cenários testados, inclusive com fontes externas bloqueadas.
