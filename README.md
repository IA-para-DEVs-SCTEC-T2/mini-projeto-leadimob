# LeadImobi

Plataforma de qualificação inteligente de leads imobiliários que transforma o caos de múltiplos contatos em uma lista priorizada e acionável.

---

## Objetivo

Centralizar e qualificar automaticamente leads imobiliários através de um **Índice de Qualificação Financeira** baseado em padrões bancários, permitindo que corretores focalizem esforços nos clientes com maior probabilidade de fechamento.

**Problema resolvido**: Corretores recebem alto volume de leads dispersos em múltiplos canais sem critério objetivo de qualificação, resultando em tempo gasto ineficientemente com contatos sem capacidade financeira real.

---

## Visão Geral

### Contexto
- **Público-alvo**: Corretores de imóveis independentes e equipes de imobiliárias pequenas/médias
- **Cenário de uso**: Profissionais que recebem 10+ leads/dia por e-mail, WhatsApp e portais imobiliários
- **Proposta de valor**: Qualificação automática em tempo real (0s) com critério objetivo baseado em padrão bancário

### Fluxo Principal
1. **Cadastro do Lead** — Corretor registra: Nome, E-mail, CPF, Telefone, Valor do Imóvel, Renda Mensal
2. **Cálculo Automático** — Sistema aplica fórmula: `(Renda × 12 × 5) ÷ Valor do Imóvel × 100`
3. **Lista Priorizada** — Leads ordenados por índice com classificação visual (Alto/Médio/Baixo)
4. **Contato Assertivo** — Corretor acessa dados já disponíveis e personaliza abordagem

---

## Funcionalidades

- **Cadastro de Leads** — Formulário estruturado com validação de CPF, e-mail e dados financeiros
- **Índice de Qualificação** — Cálculo automático baseado em critério bancário objetivo (comprometimento máximo de 30% da renda)
- **Classificação Visual** — Priorização automática: 🟢 Alto (≥80), 🟡 Médio (40-79), 🔴 Baixo (<40)
- **Lista Priorizada** — Visualização ordenada por capacidade de financiamento
- **Detalhes do Lead** — Acesso completo aos dados com explicação da fórmula de qualificação
- **Edição de Leads** — Atualização de dados com recálculo automático do score e prioridade
- **Exclusão de Leads** — Remoção segura com confirmação para evitar exclusões acidentais
- **Gestão CRUD Completa** — Criação, leitura, atualização e exclusão de leads com recálculo automático

---

## Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router (rotas e UI)
│   ├── leads/             # Páginas de leads
│   │   ├── [id]/          # Detalhes do lead
│   │   │   └── edit/      # Edição do lead
│   │   ├── new/           # Cadastro de novo lead
│   │   ├── actions.ts     # Server Actions
│   │   └── page.tsx       # Lista de leads
│   ├── globals.css        # Estilos globais
│   └── layout.tsx         # Layout principal
│
├── components/            # Componentes React reutilizáveis
│   ├── lead_card.tsx      # Card de lead na listagem
│   ├── lead_form.tsx      # Formulário de cadastro/edição
│   ├── lead_actions.tsx   # Botões de ação (editar/excluir)
│   ├── priority_badge.tsx # Badge de classificação visual
│   ├── search_filter.tsx  # Filtro de busca
│   └── sort_selector.tsx  # Seletor de ordenação
│
├── domain/               # Regras de negócio puras
│   ├── entities/         # Estruturas de dados
│   │   └── lead.ts       # Entidade Lead
│   └── rules/            # Lógica de negócio
│       └── calculate_lead_score.ts # Cálculo do índice
│
├── services/             # Casos de uso da aplicação
│   ├── create_lead.ts    # Cadastro de lead
│   ├── list_leads.ts     # Listagem com ordenação
│   ├── rank_leads.ts     # Ranking por índice
│   ├── update_lead.ts    # Edição de lead
│   └── delete_lead.ts    # Exclusão de lead
│
├── infra/               # Acesso a dados e integrações
│   ├── db/              # Configuração de banco
│   │   └── prisma.ts    # Singleton do PrismaClient
│   └── repositories/    # Operações CRUD
│       └── lead_repository.ts # Repositório de leads
│
├── schemas/             # Validação com Zod
│   └── lead.schema.ts   # Schema de validação de lead
│
├── types/               # Tipos TypeScript compartilhados
│   └── lead.ts          # Interfaces e tipos do domínio
│
├── lib/                 # Utilitários e helpers
│   └── formatters.ts    # Formatação de dados
│
└── __tests__/           # Testes automatizados
    ├── domain/          # Testes de regras de negócio
    ├── services/        # Testes de casos de uso
    ├── infra/           # Testes de repositórios
    ├── schemas/         # Testes de validação
    └── lib/             # Testes de utilitários
```

---

## Stack Tecnológica

### Frontend & Backend
- **Next.js 16.2.6** (App Router) — Renderização híbrida, Server Actions
- **React 19.2.4** — Interface de usuário
- **TypeScript 5** — Tipagem forte

### Banco de Dados
- **PostgreSQL** — Banco relacional
- **Prisma 7.8.0** — ORM com driver adapter (`@prisma/adapter-pg`)

### Validação & Estilização
- **Zod 4.4.3** — Validação de schemas
- **Tailwind CSS 4** — Estilização utilitária

### Testes
- **Jest 30.3.0** — Framework de testes
- **Fast-check 4.7.0** — Property-based testing

---

## Configuração do Ambiente

### Pré-requisitos
- Node.js 20.9.0+ (LTS)
- PostgreSQL 12+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd mini-projeto-leadimob
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Execute as migrações
npm run db:migrate

# Gere o cliente Prisma
npm run db:generate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
```

### Banco de Dados
```bash
npm run db:migrate      # Executa migrações
npm run db:migrate:prod # Migrações para produção
npm run db:reset        # Reset do banco (desenvolvimento)
npm run db:generate     # Gera cliente Prisma
npm run db:studio       # Interface visual do banco
npm run db:push         # Push do schema sem migração
npm run setup           # Setup completo (migrate + generate)
```

### Testes
```bash
npm run test           # Executa todos os testes
npm run test:watch     # Executa testes em modo watch
```

---

## Arquitetura

### Padrão em Camadas
- **app/**: Interface e rotas (Next.js App Router)
- **domain/**: Regras de negócio puras (independente de frameworks)
- **services/**: Casos de uso e orquestração
- **infra/**: Acesso a dados e integrações externas

### Fluxo de Dados
```
Usuário (UI) → app/ → services/ → domain/ → infra/ → PostgreSQL
```

### Princípios
- Separação de responsabilidades (SRP)
- Baixo acoplamento entre camadas
- Domain independente de frameworks
- Validação na entrada (Zod)
- Tipagem forte (TypeScript)

---

## Modelo de Dados

### Entidade Lead
```sql
CREATE TABLE leads (
  id           TEXT PRIMARY KEY,
  nome         TEXT NOT NULL,
  email        TEXT NOT NULL,
  cpf          TEXT UNIQUE NOT NULL,
  telefone     TEXT NOT NULL,
  valor_imovel DECIMAL(15,2) NOT NULL,
  renda_mensal DECIMAL(15,2) NOT NULL,
  score        DECIMAL(8,2),
  priority     TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

### Regras de Negócio
- **Índice de Qualificação**: `(Renda × 12 × 5) ÷ Valor do Imóvel × 100`
- **Classificação**: Alto (≥80), Médio (40-79), Baixo (<40), Não Classificado (dados inválidos)
- **Validações**: CPF único e válido, e-mail válido, valores > 0

---

## Testes

### Estratégia
- **Domain**: Foco principal (regras de negócio)
- **Services**: Fluxos principais
- **Schemas**: Validação de entrada
- **Infra**: Operações CRUD (com mocks)

### Execução
```bash
# Todos os testes
npm run test

# Testes específicos
npm run test -- domain
npm run test -- services
npm run test -- --watch
```

### Cobertura Obrigatória
- Cálculo do índice de qualificação
- Classificação de prioridade
- Validação de CPF
- Criação e listagem de leads

---

## Deployment

### Variáveis de Ambiente
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/leadimobi"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Build de Produção
```bash
npm run build
npm run start
```

### Migrações em Produção
```bash
npm run db:migrate:prod
```

---

## Roadmap

### v1.0 (Atual)
- ✅ Cadastro e qualificação de leads
- ✅ Lista priorizada com classificação visual
- ✅ CRUD completo de leads (criar, ler, atualizar, excluir)
- ✅ Validação de CPF e dados financeiros
- ✅ Recálculo automático de score ao editar

### v1.1 (Próximo)
- 🔄 Filtros e busca avançada
- 🔄 Exportação de dados
- 🔄 Métricas básicas

### v2.0 (Futuro)
- 📋 Sistema de autenticação
- 📋 Integração com WhatsApp
- 📋 API para portais imobiliários
- 📋 Dashboard de analytics

---

## Contribuição

### Fluxo GitFlow
- **main**: Código estável para produção
- **develop**: Branch principal de desenvolvimento
- **feature/**: Novas funcionalidades
- **hotfix/**: Correções urgentes

### Convenção de Commits
```
feat(scope): descrição
fix(scope): descrição
refactor(scope): descrição
docs(scope): descrição
test(scope): descrição
```

### Pull Requests
- Criar sempre a partir de `develop`
- Incluir testes para novas funcionalidades
- Seguir padrões de código estabelecidos
- Documentar mudanças significativas

---

## Suporte

### Documentação Adicional
- `docs/PRD.md` — Product Requirements Document
- `docs/uml_use_cases.md` — Casos de uso detalhados
- `.kiro/steering/` — Regras técnicas e arquiteturais

### Contato
Para dúvidas técnicas ou sugestões, abra uma issue no repositório.
