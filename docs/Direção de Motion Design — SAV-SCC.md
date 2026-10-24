# Direção de Motion Design — Website SAV-SCC, SU, Lda.

Documento de direção criativa para entrega ao Antigravity. Não altera o design system, os layouts, os textos nem a estrutura das páginas: acrescenta apenas movimento ao que já foi aprovado.

## 1. Princípio e linguagem de movimento

O movimento da SAV-SCC deve ser o de um relatório bem encadernado a abrir-se: preciso, calmo e sem ruído. Cinco regras sustentam tudo o resto:

1. **Revelar, não animar.** Cada elemento aparece uma única vez, pela ordem em que se lê.
2. **Um gesto por secção.** Um movimento principal (título, imagem ou grelha) e, no máximo, um secundário discreto.
3. **Só transform, opacity e clip-path.** Sem rotações, bounce, elasticidade ou 3D.
4. **Mesma curva e mesmas durações em todo o site**, para a experiência parecer uma só.
5. **Conteúdo primeiro.** O texto está sempre no DOM, legível sem JavaScript e com redução de movimento ativa.

## 2. Tokens de movimento

| Token | Valor | Utilização |
| --- | --- | --- |
| --ease-out | cubic-bezier(0.22, 1, 0.36, 1) | Entradas de títulos, blocos e listas (arranque rápido, aterragem longa, ao estilo Apple) |
| --ease-in-out | cubic-bezier(0.65, 0, 0.35, 1) | Máscaras de imagem e linhas que se desenham |
| --ease-ui | cubic-bezier(0.4, 0, 0.2, 1) | Hover, foco e mudanças de estado |
| --dur-micro | 180 ms | Hover e press |
| --dur-ui | 300 ms | Troca de estado, ciclo |
| --dur-enter | 800 ms | Blocos e subtítulos |
| --dur-hero | 1000 ms | Título do hero |
| --dur-mask | 1200 ms (máscara) e 1600 ms (escala interior) | Imagens |
| --rise-title / --rise-block / --rise-small | 24 px / 32 px / 12 px (mobile: 16 / 20 / 8) | Distância de subida |
| --stagger-card / --stagger-row | 100 ms / 60 ms | Cadeias de elementos; máximo de 5 por cadeia |
| Gatilho | IntersectionObserver, threshold 0.2, rootMargin 0 0 -10% 0 | Cada elemento anima uma vez e deixa de ser observado |
| Parallax | coeficiente 0.08 a 0.12; máximo ±40 px (hero até +72 px) | Só em ecrãs com 1024 px ou mais e ponteiro fino |

## 3. Padrões reutilizáveis

Nomes sugeridos para o atributo data-reveal, para o Antigravity aplicar de forma consistente.

- **P1 · lines (título por linhas).** Cada linha do título fica numa máscara com overflow hidden. O texto sobe de 105 % para 0, 900 ms, ease-out, com 90 ms entre linhas. O subtítulo sobe 24 px com fade (800 ms), 250 ms depois da última linha.
- **P2 · rise (bloco que sobe).** Opacidade 0 para 1 e translateY 32 px para 0, 800 ms, ease-out.
- **P3 · mask (máscara de imagem).** A moldura abre de baixo para cima (clip-path de inset(100% 0 0 0) para inset(0)), 1200 ms, ease-in-out. A imagem interior assenta de scale 1.12 para 1, 1600 ms, ease-out. O raio de 6 px mantém-se.
- **P4 · parallax.** Imagem dentro de moldura com overflow hidden, escala base 1.1, translateY proporcional à posição da moldura no viewport. Nunca em texto.
- **P5 · rule (linha que se desenha).** scaleX (ou scaleY nas verticais) de 0 para 1, origem à esquerda ou ao topo, 700 a 900 ms, ease-in-out. Aplica-se às linhas das etiquetas, listas e divisórias.
- **P6 · stagger.** Filhos com P2 e atraso incremental de 100 ms (cartões) ou 60 ms (linhas de lista).
- **P7 · ui.** Feedback de botões, ligações, campos e cartões (secção 6).
- **P8 · type.** Typewriter, de uso único (secção 5.2).

## 4. Proposta por página e secção

Legenda: **E** = essencial, **O** = opcional.

### 4.1 Homepage

| Elemento | Efeito e comportamento | Gatilho | Duração e intensidade | Objetivo |
| --- | --- | --- | --- | --- |
| **E** Hero: imagem de Maputo | A imagem assenta de scale 1.06 para 1; depois parallax de scroll, translateY de 0 a +72 px ao longo da altura do hero | Ao carregar; parallax contínuo no scroll (desktop) | 2400 ms, ease-out; parallax suave | Profundidade imediata sem competir com o texto |
| **E** Hero: etiqueta, título, subtítulo, botões | Etiqueta com linha a desenhar (0 ms); título P1 em 2 linhas (150 ms); subtítulo a 450 ms; botões sobem 16 px a 650 ms, 100 ms entre si | Ao carregar; uma vez | Cerca de 1,6 s no total | Leitura na ordem certa: o quê, a promessa, a ação |
| **E** Hero: faixa das três âncoras | Linha superior desenha-se e as três âncoras surgem com subida de 12 px | Ao carregar, a 900 ms; uma vez | 700 ms, ease-out | Fecha o hero e convida a continuar |
| **E** Serviços (resumo) | Título P1; blocos ou faixas P6 | Ao entrar no viewport; uma vez | 100 ms entre blocos | Ritmo de leitura |
| **E** Proposta de Valor: quatro pilares desencontrados | Entram com P6 e param nas posições finais desencontradas (0 / 48 / 16 / 64 px). Hover: sobe 4 px e a sombra alarga | Ao entrar; uma vez. Hover contínuo | Entrada 800 ms; hover 250 ms | Reforça a composição editorial |
| **E** Ciclo de Inteligência Financeira | Título P1; linha de progresso desenha-se; troca de etapa conforme secção 5.1 | Ao entrar; interação do utilizador | 900 ms; 300 ms por troca | Torna o método intuitivo |
| **E** Sobre (resumo) | Imagem com P3 e texto com P2 | Ao entrar; uma vez | 1200 ms | Humaniza sem texto a mais |
| **E** CTA final | O cartão assenta de scale 0.98 para 1 com fade; botões com feedback | Ao entrar; uma vez | 800 ms | Dá peso ao convite final |
| **O** Navbar | O sublinhado dos itens cresce da esquerda ao passar o rato, sem mudar cores, tamanhos ou tipografia | Hover | 250 ms | Feedback discreto (confirmar, pois toca num elemento aprovado) |
| Rodapé | Sem animação | — | — | Zona de consulta, deve estar sempre estável |

### 4.2 Serviços

| Elemento | Efeito e comportamento | Gatilho | Duração e intensidade | Objetivo |
| --- | --- | --- | --- | --- |
| **E** Cabeçalho | Título P1 e subtítulo | Ao carregar; uma vez | 1000 ms | Mesma assinatura do hero |
| **O** Imagem desfocada do cabeçalho | Parallax até +48 px | Scroll (desktop) | Suave | Continuidade com o hero da homepage |
| **E** Bandas 01 a 04: texto | Etiqueta com linha a desenhar; título, parágrafos e botão com P2 e 80 ms entre si | Ao entrar em cada banda; uma vez | 800 ms | Cada serviço tem a sua entrada |
| **E** Fotografias das bandas 01 e 03 | P3 | Ao entrar; uma vez | 1200 ms | Revelação elegante das imagens |
| **E** Painéis marinho das bandas 02 e 04 | Painel com P2; o número grande aparece só com fade, sem deslocação | Ao entrar; uma vez | 800 ms | Variação sem ruído |
| **O** Lista do âmbito | Itens com 50 ms entre si (máx. 5); os ticks desenham-se (stroke) | Ao entrar; uma vez | 300 ms por tick | Pormenor de qualidade |
| **O** Parallax interior das fotografias | ±20 px | Scroll (desktop) | Muito discreto | Profundidade |

### 4.3 Proposta de Valor

| Elemento | Efeito e comportamento | Gatilho | Duração e intensidade | Objetivo |
| --- | --- | --- | --- | --- |
| **E** Cabeçalho | Igual ao de Serviços | Ao carregar | 1000 ms | Coerência |
| **E** O ponto de partida | Título P1. Painel cinzento com P2; painel marinho com P2 150 ms depois; o círculo com a palavra vs. cresce de scale 0.85 para 1 com fade, a 450 ms | Ao entrar; uma vez | 800 ms | O contraste lê-se em sequência: antes, depois |
| **E** Ciclo | Ver secção 5.1 | Interação | 300 ms | Componente partilhado com a homepage |
| **E** Quatro pilares 2×2 | A linha marinho superior de cada pilar desenha-se; número, título e texto com P2; 100 ms entre pilares, por ordem de leitura | Ao entrar; uma vez | 800 ms | Ordem de leitura clara |
| **O** CTA com fotografia desfocada | O cartão assenta (scale 0.98 para 1); parallax da imagem ±24 px | Ao entrar; scroll | 800 ms | Fecho com profundidade |

### 4.4 Sobre Nós

| Elemento | Efeito e comportamento | Gatilho | Duração e intensidade | Objetivo |
| --- | --- | --- | --- | --- |
| **E** Cabeçalho | Título P1. O lema em serifa usa o typewriter (secção 5.2); a frase seguinte surge com fade | Ao carregar; uma vez por sessão | Cerca de 3,6 s | Único momento de typewriter do site |
| **E** Identidade: fotografia | P3 | Ao entrar; uma vez | 1200 ms | Peça central da página |
| **O** Identidade: parallax interior | ±24 px | Scroll (desktop) | Muito discreto | Profundidade |
| **E** Identidade: texto | Título P1; três parágrafos com P2 e 80 ms entre si | Ao entrar; uma vez | 800 ms | Ritmo de leitura |
| **E** Missão e Visão | Títulos em serifa com P1 (uma linha); divisória vertical desenha-se (scaleY, 900 ms); textos com P2, a Visão 150 ms depois | Ao entrar; uma vez | 900 ms | Dar peso às duas afirmações centrais |
| **E** Sete valores | Cada linha anima quando entra no viewport: linha superior (P5, 700 ms), depois número, nome e descrição com subida de 12 px (600 ms). Sem stagger acumulado | Por linha; uma vez | 600 a 700 ms | Lista longa sem atrasar a leitura |
| **E** Público-Alvo | Fotografia P3; quatro itens com P6 e a barra vertical a desenhar-se (scaleY) | Ao entrar; uma vez | 100 ms entre itens | Narrativa clara |
| **E** Abordagem | Numerais I e II com fade; as duas colunas com P2, 150 ms entre si | Ao entrar; uma vez | 800 ms | Fecho calmo |
| **E** CTA final | Como na homepage | Ao entrar; uma vez | 800 ms | Coerência |

### 4.5 Contactos

| Elemento | Efeito e comportamento | Gatilho | Duração e intensidade | Objetivo |
| --- | --- | --- | --- | --- |
| **E** Cabeçalho | Título P1 | Ao carregar | 1000 ms | Assinatura comum |
| **E** Quatro blocos de contacto | P6 com 100 ms entre blocos, começando a 500 ms, com o WhatsApp primeiro. Hover: sobe 4 px; a seta dos botões desloca-se 4 px | Ao carregar (estão junto à dobra); uma vez | 800 ms; hover 250 ms | Os meios de contacto são a primeira coisa a surgir |
| **O** Bloco de localização | A imagem de fundo ganha scale 1.04 ao passar o rato | Hover | 600 ms | Convida ao clique no Google Maps |
| **E** Formulário | O cartão entra com P2. Os campos não têm animação de entrada, para não atrasar o preenchimento. Foco: borda passa a #0B2545 com anel de 3 px (rgba 11,37,69,0.12) | Ao entrar; foco | 200 ms | Feedback claro de preenchimento |
| **E** Faixa do slogan | P2 simples, sem typewriter | Ao entrar; uma vez | 800 ms | Evitar repetir o efeito |

## 5. Componentes com movimento próprio

### 5.1 Ciclo de Inteligência Financeira (homepage e Proposta de Valor)

- O painel tem altura fixa, para a página não saltar entre etapas.
- **Troca de etapa, sensível à direção:** o conteúdo atual sai em 180 ms (opacidade 1 para 0 e deslocação de 12 px no sentido oposto ao clique). O novo conteúdo entra em 360 ms (opacidade 0 para 1 e deslocação de 24 px para 0, no sentido do clique), ease-out. Dentro do painel, etiqueta da etapa, título (60 ms depois) e texto (120 ms depois).
- **Nós e linha de progresso:** o nó ativo preenche em 300 ms; a linha enche até ao nó ativo em 500 ms (ease-in-out); a etiqueta ativa muda de cor em 200 ms.
- **Pontos:** o ponto ativo alarga de 6 px para 28 px em 300 ms.
- **Botão Anterior desativado:** opacidade 0.45 e sem hover.
- **Teclado e acessibilidade:** setas esquerda e direita mudam de etapa; o painel tem aria-live polite; o foco é visível.
- **Sem** avanço automático, sem loop e sem scroll-jacking.

### 5.2 Typewriter (uso único)

- **Onde:** o lema do cabeçalho de Sobre Nós: “Rigor que gera confiança. Informação que apoia decisões. Consultoria que acrescenta valor.”
- **Comportamento:** começa 500 ms depois do título; 28 ms por caractere; pausa de 400 ms no fim de cada frase; cursor fino (2 px, #A9B6C6) que pisca e desaparece 1,2 s depois de terminar. Total de cerca de 3,6 s.
- **Salvaguardas:** o texto completo existe sempre no DOM (aria-label); o espaço está reservado, sem salto de layout; corre uma vez por sessão (sessionStorage); com redução de movimento o texto aparece estático.
- **Porquê aqui:** frase curta, em serifa, que resume a marca, e é subtítulo (não prejudica a leitura de nada).
- **Não usar** no hero, no rodapé, em Contactos nem em qualquer parágrafo.

## 6. Feedback em elementos interativos

- **Botão primário:** hover com fundo mais claro (marinho passa de #0B2545 para #13294B; branco passa para #EEF0F2), translateY de -1 px e sombra suave, 180 ms; a seta desloca-se 4 px; press com scale 0.98 (100 ms); foco visível com anel de 2 px e afastamento de 3 px, sem animação.
- **Botão secundário (contorno):** hover com preenchimento a 6 % em 180 ms.
- **Ligações com seta:** o sublinhado cresce da esquerda em 250 ms e a seta desloca-se 4 px.
- **Cartões e blocos:** hover sobe 4 px e a sombra alarga, 250 ms; sem inclinação 3D.
- **Campos:** ver Contactos.
- **Toque:** sem hover; apenas o press com scale 0.98.

## 7. Transições entre páginas (opcional)

Transição entre documentos com View Transitions (cross-fade de cerca de 220 ms do conteúdo), mantendo a navbar e o rodapé estáveis. É melhoria progressiva: nos browsers sem suporte nada muda. Não pode atrasar a navegação nem esconder conteúdo.

## 8. Efeitos a evitar

- Typewriter no título principal, em parágrafos ou em mais do que um sítio.
- Parallax em texto, cartões, formulário ou em mobile.
- Scroll-jacking e secções fixas durante o scroll.
- Contadores animados (não temos estatísticas confirmadas).
- Fade em todos os elementos e cadeias com mais de 5 itens.
- Rotação, bounce, elasticidade, flip ou inclinação 3D.
- Avanço automático ou carrossel no ciclo.
- Animações em loop, como pulso no botão do WhatsApp ou ícones a flutuar.
- Partículas, gradientes animados ou brilhos.
- Revelar texto por palavras ou letras em parágrafos.
- Qualquer animação no rodapé.
- Efeitos que alterem cores ou tipografia da marca.
- Qualquer animação que atrase a primeira pintura do hero em mais de 100 ms.

## 9. Acessibilidade e desempenho

- **Redução de movimento:** tudo passa a fade de 150 ms ou fica estático; parallax e typewriter desligados; as máscaras passam a fade.
- **Sem JavaScript:** o conteúdo está visível. Os estados iniciais escondidos só existem com a classe js no elemento html.
- **Propriedades:** apenas transform, opacity e clip-path. will-change só durante a animação.
- **Execução:** um único IntersectionObserver e um único listener de scroll (passive, com requestAnimationFrame), ativo só enquanto a moldura está visível.
- **Estabilidade:** CLS igual a 0. As transformações não alteram o fluxo; as imagens têm aspect-ratio; o typewriter reserva o espaço.
- **Hero:** começa a animar até 100 ms depois do DOMContentLoaded e nunca espera pelas imagens (fundo marinho como placeholder).
- **Mobile:** durações 15 % mais curtas, distâncias 33 % menores, sem parallax e sem hover.
- **Dependências:** nenhuma. CSS com variáveis e cerca de 2 KB de JavaScript. Atributos sugeridos: data-reveal (lines, rise, mask, rule, stagger), data-delay, data-parallax e data-type.

## 10. Ordem de implementação e critérios

1. **Base:** tokens, observer, P1, P2, P3 e feedback de botões, aplicados em todas as páginas.
2. **Momentos principais:** hero (imagem e parallax), ciclo, pilares, lista de valores, blocos de Contactos.
3. **Opcionais:** typewriter, ticks, parallax secundário, transições entre páginas.

**Critérios de aceitação:** nada se move quando o utilizador não está a ver; cada secção fica completa em menos de 1,8 s; a leitura nunca é bloqueada; a pontuação de desempenho não desce; com redução de movimento o site fica totalmente estático.

## 11. Pontos a confirmar

- A estrutura exata da homepage implementada (a lista da secção 4.1 baseia-se nas secções que vi).
- Se a navbar aceita a micro-interação do sublinhado, porque toca num elemento aprovado.
- Se mantém o typewriter apenas em Sobre Nós, ou nenhum.
- Os textos das etapas 2 a 4 do ciclo (só vi a etapa 1).
- Se o site é HTML estático (parece, pelo endereço .html), caso em que a implementação é só com CSS e JavaScript simples.
