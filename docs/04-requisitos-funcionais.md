# 04 — Requisitos Funcionais

## 1. Objetivo

Facilitar o contacto comercial entre visitantes e a SAV-SCC, com o mínimo de fricção.

## 2. Conversões prioritárias

### A. WhatsApp
- Apresentar CTA visível no cabeçalho ou hero e em pontos relevantes da página.
- Configurar o link apenas quando o número oficial da empresa for fornecido.
- Usar uma mensagem inicial pré-preenchida apenas se for adequada e aprovada.
- Abrir o destino corretamente em telemóvel e desktop.
- Não publicar números de teste ou inventados.

### B. Marcação de reunião/audiência
- Definir primeiro o processo real de marcação.
- Possibilidades: iniciar conversa no WhatsApp, telefonar, enviar email ou usar ferramenta de agendamento.
- Não apresentar um calendário funcional sem integração e disponibilidade reais.
- Confirmar como a empresa recebe, confirma e acompanha os pedidos.

### C. Pedido de proposta/contacto
Se for necessário um formulário, manter os campos mínimos:
- Nome.
- Empresa (opcional, se fizer sentido).
- Contacto preferido.
- Serviço de interesse.
- Mensagem breve.

Recolher apenas os dados necessários e apresentar uma mensagem clara após o envio. A implementação deve incluir validação e tratamento de erros.

## 3. Contactos

Publicar apenas informação confirmada:
- Número oficial de WhatsApp/telefone.
- Email.
- Endereço ou área de atendimento.
- Horário, se aplicável.
- Links oficiais para redes sociais, se existirem.

## 4. Analítica e medição

Considerar, mediante decisão do responsável pelo projeto:
- Cliques no WhatsApp.
- Envios de formulário.
- Cliques para marcação de reunião.
- Origem do tráfego.

Qualquer ferramenta de analítica deve ser configurada de acordo com os requisitos aplicáveis de privacidade e consentimento.

## 5. Acessibilidade e robustez

- Links e botões com nomes acessíveis.
- Formulários com rótulos e mensagens de erro compreensíveis.
- Navegação por teclado.
- Estados de foco visíveis.
- Imagens com texto alternativo apropriado.
- Não depender apenas da cor para comunicar estados.

## 6. Segurança e privacidade

- Não expor segredos, tokens ou credenciais no código do cliente.
- Validar e sanitizar dados enviados por formulários.
- Evitar recolha desnecessária de dados pessoais.
- Definir armazenamento, acesso e retenção dos dados antes de implementar um backend.
- Não simular sucesso de envio se o formulário não estiver ligado a um serviço real.

## 7. Pendências funcionais

- Número oficial de WhatsApp.
- Email e outros contactos oficiais.
- Método real de marcação de reuniões.
- Necessidade de formulário e destino dos pedidos.
- Ferramentas de analítica pretendidas.
