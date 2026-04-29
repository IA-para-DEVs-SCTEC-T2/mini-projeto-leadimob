# LeadImobi — Visão Geral do Produto

## Visão

LeadImobi é uma plataforma de **qualificação inteligente de leads imobiliários** para corretores. O produto resolve um problema crítico do mercado: corretores recebem dezenas de contatos diários por e-mail e WhatsApp, mas perdem tempo abordando leads sem real capacidade de financiamento. O LeadImobi transforma esse caos em uma lista priorizada, permitindo que o corretor foque exclusivamente nos clientes com maior probabilidade de fechamento.

---

## Problema

Corretores de imóveis recebem alto volume de leads dispersos em múltiplos canais (e-mail, WhatsApp, portais imobiliários). Sem um critério objetivo de qualificação, o tempo é gasto de forma ineficiente com contatos que não possuem renda compatível com o imóvel desejado. Isso resulta em baixa conversão, desgaste profissional e perda de oportunidades reais.

---

## Solução

O LeadImobi centraliza o cadastro de leads e calcula automaticamente um **Índice de Qualificação Financeira** baseado em padrões bancários. A lista de leads é ordenada por esse índice, permitindo ao corretor priorizar o contato assertivo.

### Fluxo do Produto

1. **Cadastro do Lead** — o corretor registra: Nome, E-mail, Telefone, Valor do Imóvel desejado e Renda Mensal.
2. **Cálculo do Índice** — o sistema aplica a fórmula:

   `Índice = (Renda × 12 × 5) ÷ Valor do Imóvel × 100`

   Baseada no padrão bancário de comprometimento máximo de 30% da renda mensal (equivalente a financiamento em até 5 anos de renda anual).

3. **Lista Priorizada** — leads são exibidos ordenados pelo índice, com classificação visual:
   - 🟢 **Alto** (≥ 80) — alta capacidade de financiamento
   - 🟡 **Médio** (40–79) — capacidade moderada
   - 🔴 **Baixo** (< 40) — capacidade limitada

4. **Contato Assertivo** — o corretor acessa os dados do cliente já disponíveis e personaliza a abordagem.

---

## Métricas-Alvo

| Métrica | Meta |
|---|---|
| Tempo de qualificação | 0s (automático no cadastro) |
| Aumento de eficiência em vendas | ↑ 70% |
| Identificação de leads de alta prioridade | Automática, em tempo real |

---

## Exemplo de Uso

| Lead | Renda Mensal | Valor do Imóvel | Índice | Prioridade |
|------|-------------|----------------|--------|------------|
| Ana Costa | R$ 12.000 | R$ 400.000 | 90 | 🟢 Alto |
| Bruno Lima | R$ 6.000 | R$ 380.000 | 57 | 🟡 Médio |
| Carla Melo | R$ 3.000 | R$ 450.000 | 24 | 🔴 Baixo |

---

## Funcionalidades Principais

- **Cadastro de Leads** — formulário estruturado com campos financeiros essenciais (Nome, E-mail, Telefone, Valor do Imóvel, Renda Mensal).
- **Índice de Qualificação** — cálculo automático baseado em critério bancário objetivo.
- **Priorização Automática** — ordenação e classificação visual (Alto / Médio / Baixo) em tempo real.
- **Contato Assertivo** — dados do lead disponíveis no momento do contato, sem necessidade de buscas adicionais.

---

## Fora do Escopo (v1)

- Integração direta com portais imobiliários (OLX, Viva Real, ZAP)
- Automação de disparo de mensagens via WhatsApp ou e-mail
- CRM completo com pipeline de negociações
- Análise de crédito com bureaus externos (SPC, Serasa)

---

## Público-Alvo

**Corretor de Imóveis Independente ou de Imobiliária** que recebe alto volume de leads e precisa de um critério objetivo e rápido para priorizar seu tempo de atendimento.

---

## Critérios de Sucesso

- O corretor consegue cadastrar um lead e visualizar seu índice em menos de 1 minuto.
- A lista priorizada reflete corretamente a fórmula de qualificação financeira.
- O corretor reporta redução no tempo gasto com leads não qualificados após adoção do produto.