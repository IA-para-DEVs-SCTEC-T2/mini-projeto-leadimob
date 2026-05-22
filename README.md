# LeadImobi — Qualificação Inteligente de Leads Imobiliários

Plataforma que centraliza e qualifica automaticamente leads imobiliários através de um **Índice de Qualificação Financeira** baseado em padrões bancários, permitindo que corretores focalizem esforços nos clientes com maior probabilidade de fechamento.

---

## 📋 Descrição

**Problema**: Corretores recebem alto volume de leads dispersos em múltiplos canais (e-mail, WhatsApp, portais) sem critério objetivo de qualificação, resultando em tempo gasto ineficientemente com contatos sem capacidade financeira real.

**Solução**: LeadImobi centraliza o cadastro de leads e calcula automaticamente um índice de qualificação baseado em padrão bancário consolidado (comprometimento máximo de 30% da renda mensal). A lista é ordenada por esse índice, permitindo ao corretor priorizar o contato assertivo.

**Exemplo de uso**:

| Lead | Renda Mensal | Valor do Imóvel | Índice | Prioridade |
|------|-------------|----------------|--------|------------|
| Ana Costa | R$ 12.000 | R$ 400.000 | 90,00 | 🟢 Alto |
| Bruno Lima | R$ 6.000 | R$ 380.000 | 57,89 | 🟡 Médio |
| Carla Melo | R$ 3.000 | R$ 450.000 | 24,00 | 🔴 Baixo |

---

## 🛠️ Tecnologias Utilizadas

### Frontend & Backend
- **Next.js 16.2.6** — Framework React com App Router
- **React 19.2.4** — Biblioteca de UI
- **TypeScript 5** — Tipagem estática

### Banco de Dados
- **PostgreSQL** — Banco de dados relacional
- **Prisma 7.8.0** — ORM com driver adapter para PostgreSQL

### Autenticação
- **NextAuth.js v5** — Autenticação com sessão JWT
- **bcryptjs** — Hash seguro de senhas

### Validação & Estilização
- **Zod 3.23.8** — Validação de schemas
- **Tailwind CSS 4** — Estilização utilitária

### API REST & Documentação
- **zod-openapi 2.19.0** — Geração de especificação OpenAPI
- **Swagger UI** — Documentação interativa

### Qualidade de Código
- **ESLint 9** — Linting
- **Jest 30.3.0** — Testes automatizados
- **Fast-check 4.7.0** — Property-based testing

---

## ✨ Funcionalidades

### Autenticação de Corretores
- **Cadastro de Corretor** — Registro com nome, e-mail, telefone (opcional) e senha
- **Login** — Autenticação com e-mail e senha via JWT
- **Logout** — Encerramento seguro de sessão
- **Proteção de Rotas** — Acesso a leads restrito a corretores autenticados
- **Rate Limiting** — Proteção contra abuso nas rotas de criação

### Gestão de Leads
- **Cadastro de Leads** — Formulário com validação de CPF, e-mail e dados financeiros
- **Isolamento por Corretor** — Cada corretor vê apenas seus próprios leads
- **Cálculo Automático de Índice** — Fórmula: `(Renda × 12 × 5) ÷ Valor do Imóvel × 100`
- **Classificação Visual** — 🟢 Alto (≥80), 🟡 Médio (40-79), 🔴 Baixo (<40)
- **Lista Priorizada** — Leads ordenados por capacidade de financiamento
- **Detalhes do Lead** — Acesso completo aos dados com explicação da fórmula
- **Edição de Leads** — Atualização com recálculo automático de score
- **Exclusão de Leads** — Remoção segura com confirmação
- **API REST** — 5 endpoints documentados com Swagger UI
- **Validação Robusta** — CPF único por corretor, e-mail válido, valores positivos

---

## 📁 Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router (rotas e UI)
│   ├── api/               # Route Handlers (API REST)
│   │   ├── auth/          # NextAuth.js handlers
│   │   │   └── [...nextauth]/
│   │   ├── leads/         # GET/POST /api/leads
│   │   │   └── [id]/      # GET/PUT/DELETE /api/leads/{id}
│   │   ├── openapi.json/  # GET /api/openapi.json
│   │   └── docs/          # GET /api/docs (Swagger UI)
│   ├── auth/              # Páginas de autenticação
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de cadastro de corretor
│   │   └── actions.ts     # Server Actions de autenticação
│   └── leads/             # Páginas de leads (protegidas)
│       ├── page.tsx       # Lista de leads
│       ├── [id]/          # Detalhes do lead
│       ├── [id]/edit/     # Edição do lead
│       ├── novo/          # Cadastro de novo lead
│       └── actions.ts     # Server Actions de leads
│
├── components/            # Componentes React reutilizáveis
│   ├── lead_card.tsx      # Card de lead
│   ├── lead_form.tsx      # Formulário de lead
│   ├── login_form.tsx     # Formulário de login
│   ├── register_form.tsx  # Formulário de cadastro de corretor
│   ├── logout_button.tsx  # Botão de logout com nome do corretor
│   ├── priority_badge.tsx # Badge de classificação
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
│   ├── create_corretor.ts # Cadastro de corretor
│   ├── create_lead.ts    # Cadastro de lead
│   ├── list_leads.ts     # Listagem (filtrada por corretor)
│   ├── update_lead.ts    # Edição
│   ├── delete_lead.ts    # Exclusão
│   └── rank_leads.ts     # Ranking
│
├── infra/               # Acesso a dados
│   ├── db/              # Configuração de banco
│   │   └── prisma.ts    # Singleton do PrismaClient
│   └── repositories/    # Operações CRUD
│       ├── lead_repository.ts
│       └── corretor_repository.ts
│
├── schemas/             # Validação com Zod
│   ├── lead.schema.ts   # Schema de validação de lead
│   └── corretor.schema.ts # Schema de validação de corretor
│
├── types/               # Tipos TypeScript
│   ├── lead.ts          # Interfaces do domínio de lead
│   └── corretor.ts      # Interfaces do domínio de corretor
│
├── lib/                 # Utilitários
│   ├── auth.ts          # Configuração NextAuth.js
│   ├── formatters.ts    # Formatação de dados
│   └── openapi/         # Configuração OpenAPI
│
└── __tests__/           # Testes automatizados
    ├── domain/          # Testes de regras
    ├── services/        # Testes de casos de uso
    ├── infra/           # Testes de repositórios
    └── schemas/         # Testes de validação
```

---

## 🚀 Como Instalar

### Pré-requisitos
- Node.js 20.9.0+ (LTS)
- PostgreSQL 12+
- npm ou yarn

### Passos

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

Exemplo de `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/leadimobi"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configure o banco de dados**
```bash
npm run setup
# Executa migrações e gera cliente Prisma
```

5. **Inicie o servidor**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

> Ao acessar pela primeira vez, você será redirecionado para `/auth/login`. Crie uma conta em `/auth/register` para começar.

---

## ▶️ Como Executar

### Desenvolvimento
```bash
npm run dev          # Inicia servidor com hot reload
```

### Produção
```bash
npm run build        # Build otimizado
npm run start        # Inicia servidor de produção
```

### Banco de Dados
```bash
npm run db:migrate      # Executa migrações
npm run db:reset        # Reset do banco (desenvolvimento)
npm run db:studio       # Interface visual do banco
```

### Testes
```bash
npm run test           # Executa todos os testes
npm run test:watch     # Modo watch
```

### Linting
```bash
npm run lint           # Verifica código
npm run lint:fix       # Corrige automaticamente
```

---

## 🔐 Fluxo de Autenticação

### Cadastro de Corretor
```
POST /auth/register
```
Campos: `nome`, `email`, `telefone` (opcional), `senha` (mín. 8 caracteres)

Após o cadastro, o corretor é redirecionado para a página de login.

### Login
```
POST /auth/login
```
Campos: `email`, `senha`

Após o login, o corretor é redirecionado para `/leads` com uma sessão JWT válida por 7 dias.

### Proteção de Rotas

| Rota | Autenticado | Não Autenticado |
|------|-------------|-----------------|
| `/leads/*` | ✅ Acesso permitido | 🔄 Redireciona para `/auth/login` |
| `/auth/*` | 🔄 Redireciona para `/leads` | ✅ Acesso permitido |

### Isolamento de Dados

Cada corretor acessa **apenas seus próprios leads**. O `corretor_id` é vinculado automaticamente a cada lead no momento do cadastro, garantindo isolamento total entre contas.

---

## 🔌 Endpoints Principais

### Listar Leads
```
GET /api/leads
```
Retorna todos os leads do corretor autenticado, ordenados por score (decrescente).

**Resposta (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nome": "Ana Costa",
      "email": "ana@example.com",
      "cpf": "123.456.789-00",
      "telefone": "(11) 98765-4321",
      "valor_imovel": 400000,
      "renda_mensal": 12000,
      "score": 90.00,
      "priority": "Alto",
      "created_at": "2026-05-19T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

### Criar Lead
```
POST /api/leads
```
Cria um novo lead vinculado ao corretor autenticado.

**Corpo da Requisição**:
```json
{
  "nome": "Ana Costa",
  "email": "ana@example.com",
  "cpf": "12345678900",
  "telefone": "11987654321",
  "valor_imovel": 400000,
  "renda_mensal": 12000
}
```

**Resposta (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "Ana Costa",
    "email": "ana@example.com",
    "cpf": "123.456.789-00",
    "telefone": "(11) 98765-4321",
    "valor_imovel": 400000,
    "renda_mensal": 12000,
    "score": 90.00,
    "priority": "Alto",
    "created_at": "2026-05-19T10:30:00Z"
  }
}
```

**Erro de Validação (400)**:
```json
{
  "success": false,
  "errors": {
    "cpf": ["Este CPF já está cadastrado."],
    "email": ["E-mail inválido."]
  }
}
```

---

### Obter Lead
```
GET /api/leads/{id}
```
Retorna detalhes de um lead específico (somente do corretor autenticado).

---

### Atualizar Lead
```
PUT /api/leads/{id}
```
Atualiza dados do lead e recalcula score automaticamente.

**Corpo da Requisição**:
```json
{
  "nome": "Ana Costa Silva",
  "renda_mensal": 15000
}
```

**Resposta (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "Ana Costa Silva",
    "email": "ana@example.com",
    "cpf": "123.456.789-00",
    "telefone": "(11) 98765-4321",
    "valor_imovel": 400000,
    "renda_mensal": 15000,
    "score": 112.50,
    "priority": "Alto",
    "created_at": "2026-05-19T10:30:00Z"
  }
}
```

---

### Excluir Lead
```
DELETE /api/leads/{id}
```
Remove um lead do sistema.

**Resposta (204)**: Sem conteúdo

---

## 📚 Exemplos de Requisição

### cURL

**Listar leads**:
```bash
curl -X GET http://localhost:3000/api/leads \
  -H "Cookie: next-auth.session-token=<seu-token>"
```

**Criar lead**:
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<seu-token>" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "cpf": "98765432100",
    "telefone": "11987654321",
    "valor_imovel": 380000,
    "renda_mensal": 6000
  }'
```

**Obter lead**:
```bash
curl -X GET http://localhost:3000/api/leads/uuid-do-lead \
  -H "Cookie: next-auth.session-token=<seu-token>"
```

**Atualizar lead**:
```bash
curl -X PUT http://localhost:3000/api/leads/uuid-do-lead \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<seu-token>" \
  -d '{
    "renda_mensal": 7000
  }'
```

**Excluir lead**:
```bash
curl -X DELETE http://localhost:3000/api/leads/uuid-do-lead \
  -H "Cookie: next-auth.session-token=<seu-token>"
```

---

### JavaScript/Fetch

**Criar lead**:
```javascript
const response = await fetch('http://localhost:3000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@example.com',
    cpf: '98765432100',
    telefone: '11987654321',
    valor_imovel: 380000,
    renda_mensal: 6000
  })
});

const data = await response.json();
console.log(data);
```

---

### Python/Requests

**Listar leads**:
```python
import requests

response = requests.get(
    'http://localhost:3000/api/leads',
    cookies={'next-auth.session-token': '<seu-token>'}
)
leads = response.json()
print(leads)
```

**Criar lead**:
```python
import requests

payload = {
    'nome': 'João Silva',
    'email': 'joao@example.com',
    'cpf': '98765432100',
    'telefone': '11987654321',
    'valor_imovel': 380000,
    'renda_mensal': 6000
}

response = requests.post(
    'http://localhost:3000/api/leads',
    json=payload,
    cookies={'next-auth.session-token': '<seu-token>'}
)
print(response.json())
```

---

## 📖 Documentação Interativa

Acesse a documentação completa da API em:

```
http://localhost:3000/api/docs
```

A especificação OpenAPI 3.0.3 em JSON está disponível em:
```
http://localhost:3000/api/openapi.json
```

---

## 🧮 Fórmula de Qualificação

O índice de qualificação é calculado baseado em padrão bancário consolidado:

```
Índice = (Renda Mensal × 12 × 5) ÷ Valor do Imóvel × 100
```

**Classificação**:
- **Alto** (≥ 80) — Alta capacidade de financiamento
- **Médio** (40-79) — Capacidade moderada
- **Baixo** (< 40) — Capacidade limitada
- **Não Classificado** — Dados insuficientes ou inválidos

---

## 🏗️ Arquitetura

### Padrão em Camadas

```
Usuário (UI)
    ↓
app/ (Route Handlers / Server Actions)
    ↓
services/ (Casos de uso)
    ↓
domain/ (Regras de negócio)
    ↓
infra/ (Repositórios)
    ↓
PostgreSQL (Persistência)
```

### Modelo de Dados

```
Corretor (1) ──── (N) Lead
```

Cada corretor possui seus próprios leads. O CPF de um lead é único por corretor (não globalmente), permitindo que dois corretores cadastrem o mesmo cliente.

### Princípios

- **Separação de Responsabilidades** — Cada camada tem responsabilidade clara
- **Baixo Acoplamento** — Camadas independentes e testáveis
- **Domain Puro** — Sem dependências de frameworks
- **Validação na Entrada** — Zod valida antes de qualquer lógica
- **Tipagem Forte** — TypeScript em todo o código

---

## 🧪 Testes

### Estratégia

- **Domain** — Foco principal (regras de negócio puras)
- **Services** — Fluxos principais (casos de uso)
- **Schemas** — Validação de entrada
- **Infra** — Operações CRUD (com mocks)

### Execução

```bash
# Todos os testes
npm run test

# Testes específicos
npm run test -- domain
npm run test -- services

# Modo watch
npm run test:watch
```

### Cobertura Obrigatória

- ✅ Cálculo do índice de qualificação
- ✅ Classificação de prioridade
- ✅ Validação de CPF
- ✅ Criação e listagem de leads
- ✅ Edição e exclusão de leads

---

## 📋 Regras de Negócio

### Validações de Corretor

- **Nome** — Mínimo 2, máximo 100 caracteres
- **E-mail** — Deve ser válido e único no sistema
- **Telefone** — Opcional; se informado, deve ser válido
- **Senha** — Mínimo 8 caracteres; armazenada como hash bcrypt

### Validações de Lead

- **CPF** — Deve ser válido (algoritmo oficial) e único por corretor
- **E-mail** — Deve estar em formato válido
- **Telefone** — Deve estar em formato válido
- **Valor do Imóvel** — Deve ser maior que zero
- **Renda Mensal** — Deve ser maior que zero

### Cálculo de Score

- Se `Valor do Imóvel` ≤ 0 ou `Renda Mensal` ≤ 0 → Score inválido
- Score é arredondado para 2 casas decimais
- Score é recalculado automaticamente ao editar dados financeiros

### Ordenação

- Padrão: Leads ordenados por score decrescente (maior para menor)
- Leads com score inválido aparecem no final

### Isolamento de Dados

- Leads são sempre vinculados ao `corretor_id` da sessão ativa
- Operações de leitura, edição e exclusão verificam o `corretor_id` antes de executar
- Um corretor não pode acessar leads de outro corretor

---

## 🔒 Segurança

- **Autenticação JWT** — Sessões com expiração de 7 dias
- **Hash de Senhas** — bcrypt com salt de 10 rounds
- **Proteção de Rotas** — `proxy.ts` intercepta requisições não autenticadas
- **Rate Limiting** — Máximo de 10 requisições/minuto por IP nas rotas de criação
- **Validação de Entrada** — Zod previne dados malformados
- **Isolamento de Dados** — Cada corretor acessa apenas seus próprios leads
- **Sem SQL Injection** — Prisma usa queries parametrizadas

---

## � Observações Finais

### Segurança

- **Autenticação JWT** — Sessões com expiração de 7 dias
- **Hash de Senhas** — bcrypt com salt de 10 rounds
- **Proteção de Rotas** — `proxy.ts` intercepta requisições não autenticadas
- **Rate Limiting** — Máximo de 10 requisições/minuto por IP nas rotas de criação
- **Validação de Entrada** — Zod previne dados malformados
- **Isolamento de Dados** — Cada corretor acessa apenas seus próprios leads
- **Sem SQL Injection** — Prisma usa queries parametrizadas
- HTTPS obrigatório em produção

### Performance

- Cálculo de índice: < 100ms
- Listagem de leads: < 1s (até 1000 leads por corretor)
- Suporta até 10.000 leads por corretor sem degradação significativa

### Escalabilidade

- Arquitetura preparada para migração futura para API dedicada
- Banco de dados com índices otimizados
- Separação clara entre frontend e backend

---

## �🗺️ Roadmap

**v1.0** (Atual)
- ✅ Cadastro e qualificação de leads
- ✅ CRUD completo de leads
- ✅ Autenticação de corretores (login/cadastro/logout)
- ✅ Isolamento de dados por corretor
- ✅ API REST com Swagger UI
- ✅ Rate limiting

**v1.1** (Próximo)
- 🔄 Filtros e busca avançada
- 🔄 Exportação de dados

**v2.0** (Futuro)
- 📋 Integração com WhatsApp
- 📋 Integração com portais imobiliários
- 📋 Recuperação de senha por e-mail

---

## 📞 Suporte

Para dúvidas técnicas ou sugestões, abra uma issue no repositório.

**Documentação adicional**:
- `docs/PRD.md` — Product Requirements Document
- `docs/INSTALLATION.md` — Guia de instalação detalhado
- `docs/diagrams/` — Diagramas de casos de uso
- `.kiro/steering/` — Regras técnicas e arquiteturais

---

**Desenvolvido com ❤️ para corretores de imóveis**
