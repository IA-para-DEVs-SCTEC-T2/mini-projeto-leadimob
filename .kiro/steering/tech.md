# LeadImobi — Stack Tecnológica

## Objetivo

Definir as tecnologias utilizadas e o motivo de cada escolha, garantindo consistência e escalabilidade do projeto.

---

## Frontend

### Next.js (App Router)

Motivos:
- Renderização híbrida (SSR + CSR)
- Server Actions simplificam backend leve
- Estrutura baseada em rotas moderna
- Ótima integração com React

---

## Backend

### Next.js (Route Handlers / Server Actions)

Motivos:
- Centraliza frontend e backend no mesmo ambiente
- Reduz latência (menos chamadas HTTP internas)
- Simplifica deploy e infraestrutura
- Ideal para produtos early-stage

---

## Banco de Dados

### PostgreSQL

Motivos:
- Confiável e amplamente usado
- Ótimo para dados estruturados
- Compatível com Prisma

---

### Prisma ORM (v7)

Motivos:
- Tipagem forte com TypeScript
- Produtividade alta
- Migrations simples
- Boa DX (Developer Experience)

#### Driver Adapter (Prisma 7)

O Prisma 7 removeu o query engine binário e migrou para **driver adapters**. O projeto utiliza `@prisma/adapter-pg` com o driver `pg` para conexão com PostgreSQL.

O `PrismaClient` **sempre** deve ser instanciado com um adapter:

```ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

O singleton está em `src/infra/db/prisma.ts` — **nunca instanciar `PrismaClient` diretamente fora desse arquivo**.

Dependências necessárias:
- `@prisma/adapter-pg` — adapter oficial Prisma 7 para PostgreSQL
- `pg` — driver Node.js do PostgreSQL
- `@types/pg` (devDependency) — tipos TypeScript para o `pg`

---

## Validação

### Zod

Motivos:
- Validação declarativa
- Integração com TypeScript
- Evita dados inválidos no sistema

---

## Estilização

### Tailwind CSS

Motivos:
- Rapidez no desenvolvimento
- Padronização visual
- Menos CSS manual

---

## Tipagem

### TypeScript

Motivos:
- Redução de bugs
- Melhor manutenção
- Autocomplete e DX

---

## Arquitetura

Padrão adotado:

- Separação por camadas:
  - app (interface)
  - services (fluxo)
  - domain (regras)
  - infra (dados)

Motivo:
- Escalabilidade
- Testabilidade
- Baixo acoplamento

---

## Padrões adotados

- Monolito modular
- Arquitetura em camadas
- Separação de responsabilidades (SRP)

---

## Estratégia de evolução

### v1
- Monolito com Next.js
- Banco único
- Sem integrações externas

### v2+
- API dedicada (se necessário)
- Integração com WhatsApp
- Integração com portais imobiliários
- Sistema de autenticação

---

## Observabilidade (futuro)

Sugestões:
- Logs estruturados
- Monitoramento de erros (ex: Sentry)
- Métricas de uso

---

## Trade-offs

- ✔ Uso de monolito modular (Next.js)
  → reduz complexidade inicial sem comprometer escalabilidade

- ⚠️ Backend e frontend compartilham o mesmo ambiente
  → separação lógica é garantida por arquitetura em camadas, mantendo baixo acoplamento e alta coesão

---

## Princípios técnicos

- Não over-engineer na v1
- Priorizar entrega de valor
- Evoluir conforme necessidade real