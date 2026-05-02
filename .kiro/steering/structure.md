# LeadImobi — Estrutura do Projeto

## Objetivo
Definir como o código deve ser organizado para que o projeto permaneça simples, previsível e fácil de evoluir.

---

## Stack Base

- Next.js (App Router)
- Prisma (ORM)
- Zod (validação)
- TypeScript

---

## Organização por camadas

### app/
Responsável por receber requisições e retornar respostas.

Inclui:
- Rotas (pages e route handlers)
- Server Actions
- Renderização (Server/Client Components)

⚠️ Não deve conter regra de negócio complexa.

---

### domain/
Camada mais importante do sistema.

Contém:
- Entidades (Lead)
- Regras de negócio
- Cálculos (índice de qualificação)

Essa camada não depende de Next.js, banco ou libs externas.

---

### services/
Responsável por orquestrar casos de uso da aplicação.

Cada service deve representar uma ação do sistema:
- create_lead
- list_leads
- rank_leads

Faz a ponte entre:
- app → domain → infra

⚠️ Services não devem conter lógica de negócio complexa (isso pertence ao domain).

---

### infra/
Responsável por acesso a dados e integrações externas.

Inclui:
- Prisma Client
- Repositórios
- Futuras integrações (APIs, WhatsApp, etc.)

---

### components/
Componentes reutilizáveis da interface.

Exemplo:
- Formulário de lead
- Card de lead
- Badge de prioridade

---

### lib/
Funções utilitárias e helpers bem definidos.

Exemplo:
- Formatadores
- Funções puras reutilizáveis

---

## Estrutura de pastas
src/
├── app/
│ ├── leads/
│ │ ├── page.tsx
│ │ ├── actions.ts
│ │ └── route.ts
│
├── domain/
│ ├── entities/
│ │ └── lead.ts
│ └── rules/
│ └── calculate_lead_score.ts
│
├── services/
│ ├── create_lead.ts
│ ├── list_leads.ts
│ └── rank_leads.ts
│
├── infra/
│ ├── db/
│ │ └── prisma.ts
│ └── repositories/
│ └── lead_repository.ts
│
├── components/
│ ├── lead_form.tsx
│ ├── lead_card.tsx
│ └── priority_badge.tsx
│
├── schemas/
│ └── lead.schema.ts
│
├── types/
│ └── lead.ts
│
└── lib/
└── formatters.ts

---

## Regras de estrutura

- Cada módulo deve ter responsabilidade clara.
- Rotas não devem conter regra de negócio complexa.
- Serviços não devem conhecer detalhes do framework HTTP.
- Repositórios não devem conter lógica de negócio.
- Domínio deve ser independente de qualquer framework.
- Domain não pode acessar infra diretamente.
- Services são a única camada que conversa com repositórios.
- Funções devem ser pequenas e com nomes objetivos.

---

## Convenções de código

- Usar snake_case para arquivos e funções.
- Usar TypeScript sempre tipado (evitar `any`).
- Preferir composição a herança.
- Evitar arquivos genéricos como `helpers.ts`.
- Separar validação (Zod) da lógica de negócio.

---

## Validação de dados

- Toda entrada deve ser validada com Zod.
- Validação deve acontecer antes de qualquer lógica de negócio.
- Schemas Zod definem o contrato de entrada do sistema.
- Domain nunca deve depender de Zod diretamente.
- Nunca confiar diretamente em dados do usuário.

---

## Convenções de testes

- Testar domínio (principal foco)
- Testar serviços (fluxos principais)
- Evitar testes acoplados ao banco real
- Usar mocks para repositórios

Casos obrigatórios:
- Cálculo do índice
- Classificação (alto/médio/baixo)
- Criação de lead

---

## Princípios-chave

- Simplicidade > complexidade
- Clareza > abstração prematura
- Código fácil de ler > código "inteligente"