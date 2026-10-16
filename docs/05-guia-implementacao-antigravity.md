# 05 — Guia de Implementação no Antigravity IDE

## 1. Objetivo

Orientar os agentes de código para implementar o website com base numa especificação comum, reduzindo suposições, retrabalho e inconsistências.

## 2. Regra de trabalho

Antes de alterar código:
1. Inspecionar a estrutura e as tecnologias existentes.
2. Identificar instruções do repositório e convenções já adotadas.
3. Resumir o plano de implementação.
4. Identificar dependências, riscos e dados em falta.
5. Implementar em etapas pequenas e verificáveis.

Se o projeto ainda não existir, propor a estrutura e as tecnologias antes de inicializar. Não assumir framework, biblioteca de UI, backend ou serviço de formulários sem verificar o contexto e justificar a escolha.

## 3. Fonte de verdade

Consultar os documentos desta pasta:
- `01-briefing-principal.md`
- `02-arquitetura-website.md`
- `03-direcao-visual.md`
- `04-requisitos-funcionais.md`
- `06-testes-e-criterios-aceitacao.md`
- `07-conteudos-e-pendencias.md`

Se houver conflito, não escolher silenciosamente. Identificar o conflito e pedir uma decisão ou documentar uma proposta.

## 4. Sequência de implementação recomendada

1. Inspeção técnica e plano.
2. Estrutura global, layout e navegação.
3. Design system mínimo: cores, tipografia, espaçamento e componentes.
4. Página inicial com conteúdo provisório claramente identificado.
5. Páginas/ secções de serviços.
6. Sobre nós e secções de confiança.
7. Contactos e conversões, apenas após receber os dados oficiais.
8. Responsividade, acessibilidade e otimização.
9. Testes e correções.
10. Atualização da documentação sobre o que foi implementado e o que continua pendente.

## 5. Regras para os agentes

- Não inventar factos empresariais, nomes de clientes, depoimentos, certificações, números, resultados ou contactos.
- Não usar texto Lorem Ipsum na versão final.
- Não copiar o website de referência.
- Reutilizar componentes e manter consistência visual.
- Evitar dependências desnecessárias.
- Não introduzir dados sensíveis ou credenciais no repositório.
- Não afirmar que uma integração funciona sem a testar.
- Preservar a identidade do logótipo.
- Garantir que os links e botões fazem aquilo que anunciam.
- Não eliminar funcionalidades existentes sem compreender o impacto.
- Documentar decisões técnicas relevantes.

## 6. Instrução inicial sugerida para um agente

> Analisa o repositório e lê a documentação do projeto SAV-SCC. Não comeces a implementar imediatamente. Primeiro, apresenta um resumo da estrutura atual, tecnologias identificadas, lacunas, riscos e um plano de implementação faseado. Distingue factos confirmados de suposições. Não inventes dados da empresa nem implementes integrações com contactos fictícios. Aguarda validação do plano antes de fazer alterações estruturais.

## 7. Entrega esperada de cada tarefa

Ao concluir uma tarefa, o agente deve indicar:
- Ficheiros criados ou alterados.
- Decisões relevantes.
- Testes executados e respetivos resultados.
- Pendências e limitações.
- Próxima tarefa recomendada.
