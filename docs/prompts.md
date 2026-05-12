# Prompts Utilizados na Sessão

Registro dos prompts utilizados durante a sessão de Code Review do PR #3 do projeto [mini-projeto-leadimob](https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob).

---

## Prompt 1 — Solicitação de Code Review

```
Realize Code Review técnico de Pull Request do GitHub utilizando a URL do projeto e o número do PR

Instrução:
Você é um engenheiro de software sênior especializado em revisão técnica de Pull Requests no GitHub.
Sua função é analisar um Pull Request específico a partir da URL do repositório e do número do PR,
revisar as alterações propostas e gerar uma avaliação técnica estruturada pronta para publicação via GitHub CLI.

Objetivo:
Executar revisão técnica completa do Pull Request informado, identificando problemas, inconsistências
e oportunidades de melhoria, com saída formatada para publicação direta no GitHub.

URL do Projeto:
https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob

Número do PR:
3

Regras:
- analisar exclusivamente o Pull Request informado
- considerar contexto do repositório
- revisar arquivos alterados
- identificar bugs e riscos
- avaliar legibilidade e manutenção
- apontar problemas objetivos
- sugerir melhorias acionáveis
- justificar tecnicamente cada observação
- gerar saída pronta para comentário/review no GitHub
- não aprovar automaticamente

Critérios de Análise:
- Correção: lógica implementada, comportamento esperado, edge cases
- Qualidade: organização, clareza, consistência
- Performance: otimizações, redundâncias
- Segurança: exposição indevida, validações
- Manutenibilidade: desacoplamento, duplicação, extensibilidade
- Padrões do Projeto: aderência à arquitetura existente, convenções do repositório

Formato Obrigatório da Saída:
## 🤖 Automated PR Review
## Informações Analisadas
**Projeto:** [URL]
**PR:** #[NUMERO]
## Resumo Geral
## Findings
### [SEVERIDADE] Título
**Arquivo:** caminho
**Problema:** descrição objetiva
**Impacto:** consequência técnica
**Sugestão:** ajuste recomendado
## Pontos Positivos
## Decisão Final (✅ APPROVE | ⚠️ APPROVE WITH CHANGES | ❌ REQUEST CHANGES)
## Comentário Final
```

---

## Prompt 2 — Publicação da Análise no PR

```
Publica essa análise no PR 3 do https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob.
```

---

## Prompt 3 — Registro dos Prompts

```
Cria uma pasta docs com um arquivo prompts.md e adiciona os prompts que utilizei nessa sessão.
```

---

## Prompt 4 — Correção dos pontos [MEDIUM] do Code Review

```
Realize a correção dos pontos [MEDIUM] apontados pelo no Code Review por IA.
```

---

## Prompt 5 — Correção dos pontos [LOW] do gitflow.md

```
Realize as correções das issues [LOW] gitflow.md
```

---

## Prompt 6 — Commit das alterações

```
Realize os commits das alterações.
```

---

## Prompt 7 — Atualização do prompts.md e commit

```
Adiciona no prompts.md os prompts novos utilizados nessa sessão e após realize o commit.
```

---

## Contexto da Sessão

| Item | Detalhe |
|------|---------|
| Repositório | `IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob` |
| PR analisado | #3 — Criação dos Arquivos da Pasta Steering |
| Branch | `feature/steering` → `develop` |
| Arquivos revisados | `gitflow.md`, `product.md`, `structure.md`, `tech.md` |
| Decisão | ⚠️ APPROVE WITH CHANGES |
| Comentário publicado | [#issuecomment-4380804849](https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob/pull/3#issuecomment-4380804849) |

---

# Prompts Utilizados na Sessão — Geração de Specs LeadImobi Core

Registro dos prompts utilizados durante a sessão de criação das specs do projeto LeadImobi Core.

---

## Prompt 8 — Geração das Specs do Projeto

```
Com base em mini-projeto-leadimob/tech.md, mini-projeto-leadimob/product.md e
mini-projeto-leadimob/structure.md, gere todas as specs do projeto utilizando o padrão de LI-1, LI-1.1.

IMPORTANTE:
- Modo specification only
- Não realizar implementação
- Não gerar código
- Não executar alterações estruturais
- Não criar componentes, funções ou arquivos executáveis

Entregue somente a documentação técnica e funcional necessária para posterior implementação.
```

---

## Prompt 9 — Geração do Design Técnico

```
Sim
```

*(Aprovação do documento de requisitos e solicitação de avanço para o design técnico)*

---

## Prompt 10 — Geração do Plano de Tarefas

```
Sim
```

*(Aprovação do documento de design e solicitação de avanço para o plano de tarefas)*

---

## Prompt 11 — Correção da Numeração dos Critérios de Aceitação

```
Não encontrei alguns Requirements. Por exemplo LI-4.2.1 ou LI-6.1.1
```

*(Solicitação de correção da numeração explícita dos critérios de aceitação no requirements.md)*

---

## Prompt 12 — Registro dos Prompts da Sessão

```
Adicionar no /Users/gabrieldasilva/Desktop/mini-projeto-leadimob/docs/prompts.md
os prompts que utilizei nessa sessão.
```

---

## Contexto da Sessão — Specs LeadImobi Core

| Item | Detalhe |
|------|---------|
| Feature | `leadimobi-core` |
| Workflow | Requirements-First |
| Arquivos gerados | `requirements.md`, `design.md`, `tasks.md` |
| Padrão de numeração | LI-1, LI-1.1, LI-1.1.1 |
| Features cobertas | LI-1 a LI-6 (22 sub-features, ~60 critérios de aceitação) |
| Correctness Properties | 8 propriedades PBT com `fast-check` |
| Correção aplicada | Numeração explícita `LI-X.Y.Z` em todos os critérios de aceitação |

---

# Prompts Utilizados na Sessão — Code Review e Correções das Specs

Registro dos prompts utilizados durante a sessão de code review e correção das specs do LeadImobi Core.

---

## Prompt 13 — Code Review das Specs (Análise Inicial)

```
# PROMPT ESTRUTURADO
Realizar Code Review técnico de Pull Request que altera arquivos da pasta `.specs`

[Instrução completa com critérios de análise para requirements.md, design.md e tasks.md,
validações cruzadas Requirement → Design → Task, classificação de severidade
CRITICAL/HIGH/MEDIUM/LOW e formato obrigatório de saída]
```

*(Análise técnica completa dos 3 arquivos de spec — 6 findings identificados: 2 MEDIUM, 4 LOW)*

---

## Prompt 14 — Publicação do Code Review no PR

```
Publica esse code review e realizar.
```

*(Review publicado em PR #4 — issuecomment-4392356945)*

---

## Prompt 15 — Correção das Issues MEDIUM e LOW

```
Realizar os ajustes das issues:
[MEDIUM] Inconsistência na fórmula de cálculo do índice,
[LOW] Requisito LI-3.1.3 sem task correspondente,
[LOW] Ausência de tratamento de erro genérico na Server Action
e [LOW] Property 5 não cobre o requisito LI-3.1.3.
```

*(4 issues corrigidas em requirements.md, design.md e tasks.md — commit 1bf05e3)*

---

## Prompt 16 — Correção [MEDIUM] Invariantes da Entidade Lead

```
Realize a correção [MEDIUM] Ausência de task para lead.ts entity no domínio
seguindo a sugestão de Definir no design.md os invariantes da entidade Lead
(ex: email sempre lowercase, score sempre arredondado, priority sempre consistente com score)
```

*(5 invariantes definidos no design.md + task 5.4 expandida com normalize_email e
validate_lead_invariants — commit d05c433)*

---

## Prompt 17 — Correção [MEDIUM] LeadScoreResult Inconsistente

```
Realize a correção [MEDIUM] LeadScoreResult inconsistente entre types/ e design.md
e realizar commit.
```

*(Interface plana removida, union discriminada mantida como definição única,
nota de type narrowing adicionada — commit b075b79)*

---

## Prompt 18 — Code Review de Verificação das Correções

```
Realize o Code Review para analisar se as correções resolveram as Findings.
```

*(Todos os 6 findings verificados como resolvidos — decisão: ✅ APPROVE)*

---

## Prompt 19 — Publicação do Review de Verificação e Registro de Prompts

```
Publica esse Code Review no PR e adicione os prompts utilizados nessa sessão
```

---

## Contexto da Sessão — Code Review e Correções das Specs

| Item | Detalhe |
|------|---------|
| PR | #4 — `feature/specs` → `develop` |
| Arquivos revisados | `requirements.md`, `design.md`, `tasks.md` |
| Findings identificados | 2 MEDIUM + 4 LOW |
| Findings resolvidos | 6/6 (100%) |
| Commits de correção | `1bf05e3`, `d05c433`, `b075b79` |
| Decisão final | ✅ APPROVE |
| Reviews publicados | [#4392356945](https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob/pull/4#issuecomment-4392356945) · [#4392399522](https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob/pull/4#issuecomment-4392399522) · [#4392428760](https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob/pull/4#issuecomment-4392428760) · [#4392450396](https://github.com/IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob/pull/4#issuecomment-4392450396) |

---

# Prompts Utilizados na Sessão — Criação de Issues no GitHub Project

Registro dos prompts utilizados durante a sessão de criação de issues a partir das specs do LeadImobi Core.

---

## Prompt 20 — Criação de Issues no GitHub Project

```
# PROMPT ESTRUTURADO
Criar issues no GitHub Project a partir do /Users/gabrieldasilva/Desktop/mini-projeto-leadimob/.kiro/specs/leadimobi-core/tasks.md
relacionando com /Users/gabrieldasilva/Desktop/mini-projeto-leadimob/.kiro/specs/leadimobi-core/requirements.md
utilizando GitHub CLI

# Instrução
Você é um agente técnico especializado em planejamento ágil, análise de requisitos e automação via GitHub CLI.
Sua função é:
1. Ler o conteúdo de /Users/gabrieldasilva/Desktop/mini-projeto-leadimob/.kiro/specs/leadimobi-core/tasks.md
2. Correlacionar cada tarefa com os requisitos descritos em /Users/gabrieldasilva/Desktop/mini-projeto-leadimob/.kiro/specs/leadimobi-core/requirements.md
3. Criar issues estruturadas no GitHub
4. Adicionar automaticamente as issues ao projeto:
   `https://github.com/orgs/IA-para-DEVs-SCTEC-T2/projects/10/views/1`
5. Utilizar exclusivamente GitHub CLI (`gh`)

# Objetivo
Transformar tarefas documentadas em issues rastreáveis, padronizadas e vinculadas ao contexto funcional definido nos requisitos do projeto.

# Regras
- utilizar apenas GitHub CLI
- criar uma issue por tarefa
- relacionar cada issue com ao menos um requisito
- manter títulos curtos e objetivos
- gerar descrições técnicas claras
- incluir critérios de aceite
- adicionar labels apropriadas
- evitar duplicidade de issues
- não criar issues sem contexto funcional
- utilizar markdown compatível com GitHub
- manter padronização entre todas as issues

# Estrutura da Issue
## Title
Título curto e objetivo

## Body
A issue deve conter:
## Contexto
Descrição resumida da necessidade

## Requisito Relacionado
Referência ao requisito do `#requirements.md`

## Objetivo
Resultado esperado da implementação

## Critérios de Aceite
- [ ] Critério 1
- [ ] Critério 2

## Observações Técnicas
Detalhes importantes para implementação
```

*(19 issues criadas e adicionadas ao GitHub Project #10)*

---

## Contexto da Sessão — Criação de Issues

| Item | Detalhe |
|------|---------|
| Projeto GitHub | `IA-para-DEVs-SCTEC-T2/mini-projeto-leadimob` |
| GitHub Project | #10 — [View](https://github.com/orgs/IA-para-DEVs-SCTEC-T2/projects/10/views/1) |
| Issues criadas | 19 issues (#12 a #30) |
| Labels utilizadas | Nenhuma (labels não existiam no repositório) |
| Estrutura | Contexto, Requisito Relacionado, Objetivo, Critérios de Aceite, Observações Técnicas |

### Issues Criadas

| Issue | Título |
|-------|--------|
| #12 | Setup do projeto e configuração base |
| #13 | Criar tipos compartilhados em types/lead.ts |
| #14 | Criar schema Zod de validação em schemas/lead.schema.ts |
| #15 | Implementar cálculo do índice de qualificação em domain/rules |
| #16 | Criar entidade Lead e validadores de invariante em domain/entities |
| #17 | Criar singleton do Prisma Client em infra/db/prisma.ts |
| #18 | Implementar repositório de leads em infra/repositories |
| #19 | Implementar serviço de ordenação de leads em services/rank_leads.ts |
| #20 | Implementar serviço de criação de leads em services/create_lead.ts |
| #21 | Implementar serviço de listagem de leads em services/list_leads.ts |
| #22 | Criar funções de formatação em lib/formatters.ts |
| #23 | Criar componente PriorityBadge em components/priority_badge.tsx |
| #24 | Criar componente LeadCard em components/lead_card.tsx |
| #25 | Criar componente LeadForm em components/lead_form.tsx |
| #26 | Criar Server Actions em app/leads/actions.ts |
| #27 | Criar página de lista de leads em app/leads/page.tsx |
| #28 | Criar página de cadastro em app/leads/new/page.tsx |
| #29 | Criar página de detalhe do lead em app/leads/[id]/page.tsx |
| #30 | Criar API Route GET /api/leads (opcional) |

---

# Prompts Utilizados na Sessão — Setup do Projeto e Configuração Base

Registro dos prompts utilizados durante a sessão de inicialização do projeto LeadImobi Core na branch `feature/setup-base`.

---

## Prompt 21 — Início da Task #12 (Setup do Projeto)

```
Nos temos uma automação que le as tasks dos #leadimobi-core e cria as issues em
Backlog · Mini Projeto LeadImobi, quero que comece a desenvolver a task
Setup do projeto e configuração base #12 APENAS, crie uma nova branch chamada setup,
para trabalharmos nessa tarefa
```

*(Solicitação de início da task #12 com criação de branch)*

---

## Prompt 22 — Escolha do Nome da Branch

```
Seria melhor outro nome?
```

*(Questionamento sobre o nome da branch `setup`)*

---

## Prompt 23 — Confirmação do Nome da Branch

```
feature/setup-base
```

*(Confirmação do nome da branch seguindo o padrão GitFlow — branch `feature/setup-base` criada)*

---

## Prompt 24 — Criação do Steering File do Next.js 16

```
A versão mais recente e estável do framework Next.js é a 16, crie um arquivo de steering
com as regras das novas mudanças, e depois continue com a task 1
```

*(Solicitação de documentação das mudanças do Next.js 16 como steering file antes de iniciar a implementação)*

---

## Prompt 25 — Remoção da Pasta nextapp-tmp

```
Pq tem duas pastas node_modules? uma na raiz outra em nextapp-tmp
```

*(Identificação de pasta temporária duplicada — `nextapp-tmp/` removida)*

---

## Prompt 26 — Limpeza da Instalação

```
Antes de continuar limpe a instalação, removendo arquivos desnecessários,
como a pagina do next, icones. CLAUDE.MD, AGENTS.MD, etc
```

*(Limpeza do projeto: remoção de SVGs padrão, CLAUDE.md, AGENTS.md, lab.js,
reset da page.tsx, layout.tsx e globals.css)*

---

## Prompt 27 — Verificação do Source Control

```
Ok. em source Control esta mais de 10k de arquivos para o github, esta correto isso?
```

*(Verificação do .gitignore — confirmado que node_modules está corretamente ignorado,
os 10k arquivos são untracked locais que não vão para o GitHub)*

---

## Prompt 28 — Exclusão do lab.js

```
O lab.js pode excluir
```

*(lab.js já havia sido deletado anteriormente — aparecia como "D" no git status
por ter existido no histórico)*

---

## Prompt 29 — Commit e Registro de Prompts

```
Pode continuar, podem antes de ir para 1.1, faça o commit do que foi feito até agora,
seguindo o padrão de commit de .kiro/steering/gitflow.md, e registre os prompts e como
foi executado em docs/prompts.md
```

*(Solicitação de commit das alterações de setup e atualização do prompts.md)*

---

## Contexto da Sessão — Setup do Projeto

| Item | Detalhe |
|------|---------|
| Branch | `feature/setup-base` |
| Issue | #12 — Setup do projeto e configuração base |
| Stack | Next.js 16.2.5, React 19.2.4, TypeScript 5, Tailwind CSS 4, Zod |
| Ações realizadas | Criação da branch, steering file Next.js 16, remoção de arquivos desnecessários, limpeza da instalação padrão |
| Arquivos removidos | `AGENTS.md`, `CLAUDE.md`, `lab.js`, `nextapp-tmp/`, SVGs padrão do Next.js |
| Arquivos criados | `.kiro/steering/nextjs16.md` |
| Arquivos modificados | `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` |
| Próximo passo | Task 1.1 — Inicializar projeto Next.js com App Router e TypeScript strict |

---

# Prompts Utilizados na Sessão — Correção de Vulnerabilidades

---

## Prompt 30 — Resolução das Vulnerabilidades npm

```
Ainda não va para a 1.3, antes vamos resolver as dependencias:
188 packages are looking for funding
run `npm fund` for details
5 moderate severity vulnerabilities
```

*(Solicitação de correção das 5 vulnerabilidades moderate antes de continuar a implementação)*

**Como foi executado:**
- Executado `npm audit` para identificar as vulnerabilidades
- Identificadas 2 origens:
  - `postcss < 8.5.10` — dependência interna do Next.js 16 (XSS via CSS stringify)
  - `@hono/node-server < 1.19.13` — dependência interna do `@prisma/dev` (middleware bypass)
- Descartado `npm audit fix --force` pois instalaria Next.js 9.3.3 (downgrade catastrófico)
- Solução: adicionado bloco `"overrides"` no `package.json` forçando versões corrigidas das dependências transitivas
- Resultado: `found 0 vulnerabilities` após `npm install`

---

## Prompt 31 — Commit da Correção de Vulnerabilidades

```
Faça o commit dessa tarefa seguindo o mini-projeto-leadimob/gitflow.md
e registre os prompts em docs/prompts.md
```

*(Solicitação de commit das correções de segurança e atualização do prompts.md)*

---

## Contexto da Sessão — Correção de Vulnerabilidades

| Item | Detalhe |
|------|---------|
| Branch | `feature/setup-base` |
| Vulnerabilidades encontradas | 5 moderate (2 grupos) |
| Vulnerabilidades resolvidas | 5/5 (100%) |
| Solução aplicada | `overrides` no `package.json` — sem downgrade de dependências principais |
| Arquivos modificados | `package.json`, `package-lock.json` |

---

# Prompts Utilizados na Sessão — Configuração do Prisma e Scripts do Projeto

Registro dos prompts utilizados durante a sessão de configuração do Prisma ORM e scripts do `package.json`.

---

## Prompt 32 — Início da Task 1.3 (Configurar Prisma)

```
comece a task 1.3 Configurar Prisma e schema do banco de dados,
precisa criar o .env para dados sensiveis
```

*(Execução da task 1.3: `npx prisma init`, definição do model `Lead` no schema Prisma,
criação do `.env` com `DATABASE_URL` usando placeholders, validação com `npx prisma validate`)*

---

## Prompt 33 — Questionamento sobre prisma.config.ts

```
Se não me engano essa versão do prisma não precisa de prisma.config.ts
```

*(Verificação da documentação oficial do Prisma 7 — confirmado que `prisma.config.ts` é
necessário na v7: `url` no `datasource` do `schema.prisma` foi deprecated, e o
`prisma.config.ts` é agora o lugar padrão para configurar a URL de conexão para o CLI)*

---

## Prompt 34 — Teste da Configuração e Criação do Banco

```
Faça um test se está tudo certo, se não existir o db deve ser criado
```

*(Executado `npx prisma migrate dev --name init` — banco `leadimobi` criado automaticamente
no PostgreSQL, migration `20260507184654_init` aplicada, tabela `leads` criada com sucesso)*

---

## Prompt 35 — Configuração dos Scripts do package.json

```
Configure o comando de inicialização e para rodar o prisma
```

*(Scripts adicionados ao `package.json`: `db:migrate`, `db:migrate:prod`, `db:reset`,
`db:generate`, `db:studio`, `db:push`, `setup`. Prisma Client gerado em `src/generated/prisma`)*

---

## Prompt 36 — Commit das Alterações Pendentes

```
Faça o commit de tudo pendente, seguindo o padrão de mini-projeto-leadimob/gitflow.md
e registre os prompts em docs/prompts.md
```

*(Commit das alterações da task 1.3: schema Prisma, migration, .env, prisma.config.ts,
scripts do package.json e atualização do prompts.md)*

---

## Contexto da Sessão — Configuração do Prisma

| Item | Detalhe |
|------|---------|
| Branch | `feature/setup-base` |
| Task | 1.3 — Configurar Prisma e schema do banco de dados |
| Arquivos criados | `prisma/schema.prisma`, `.env`, `prisma.config.ts`, `prisma/migrations/20260507184654_init/migration.sql` |
| Arquivos modificados | `package.json`, `package-lock.json`, `.kiro/specs/leadimobi-core/tasks.md` |
| Banco criado | `leadimobi` no PostgreSQL local (localhost:5432) |
| Prisma Client gerado | `src/generated/prisma` |
| Scripts adicionados | `db:migrate`, `db:migrate:prod`, `db:reset`, `db:generate`, `db:studio`, `db:push`, `setup` |

---

# Prompts Utilizados na Sessão — Estrutura de Pastas do Projeto

---

## Prompt 37 — Criação da Estrutura de Pastas (Task 1.4)

```
Sim
```

*(Confirmação para executar a task 1.4 — criação da estrutura de pastas do projeto)*

**Como foi executado:**
- Criados 13 diretórios com arquivos `.gitkeep` para rastreamento pelo git
- Camadas da aplicação: `src/domain/rules/`, `src/domain/entities/`, `src/services/`, `src/infra/db/`, `src/infra/repositories/`, `src/components/`, `src/schemas/`, `src/types/`, `src/lib/`
- Diretórios de testes: `src/__tests__/domain/`, `src/__tests__/services/`, `src/__tests__/lib/`, `src/__tests__/schemas/`
- Task 1 (Setup do projeto) marcada como concluída

---

## Prompt 38 — Commit da Estrutura de Pastas

```
Faça o commit de tudo pendente, seguindo o padrão de mini-projeto-leadimob/gitflow.md
e registre os prompts em docs/prompts.md
```

*(Commit da task 1.4 e encerramento da Task 1 — Setup do projeto e configuração base)*

---

## Contexto da Sessão — Estrutura de Pastas

| Item | Detalhe |
|------|---------|
| Branch | `feature/setup-base` |
| Task | 1.4 — Criar estrutura de pastas do projeto |
| Diretórios criados | 13 (9 de aplicação + 4 de testes) |
| Arquivos criados | `.gitkeep` em cada diretório |
| Status da Task 1 | ✅ Concluída (todas as sub-tasks 1.1 a 1.4 completas) |

---

## Prompt 39 — Task #13 Shared Lead Domain Types

Contexto:
Implementação dos tipos compartilhados do domínio de leads.

Objetivo:
Criar o arquivo `src/types/lead.ts` contendo contratos reutilizáveis do domínio de leads.

Requisitos:

* criar `LeadPriority`
* criar `Lead`
* criar `CreateLeadInput`
* criar `LeadScoreResult`
* utilizar TypeScript estrito
* evitar `any`
* manter nomenclatura orientada ao domínio
* manter implementação desacoplada de framework

Resultado:
Contratos compartilhados preparados para serviços de ranking, listagem e futura integração com repositories.

---

## Prompt 40 — Task #19 Lead Ranking Service

Contexto:
Implementação de um serviço puro de ranking de leads utilizando os tipos compartilhados do domínio.

Objetivo:
Criar `src/services/rank_leads.ts`.

Requisitos:

* importar os tipos compartilhados
* implementar lógica pura de ranking
* classificar leads por score de qualificação
* preservar imutabilidade
* evitar efeitos colaterais
* utilizar TypeScript estrito
* sem acoplamento com infraestrutura
* sem acesso ao Prisma
* sem `any`

Resultado:
Serviço puro de priorização de leads isolado da infraestrutura e reutilizável entre as camadas da aplicação.

---

## Prompt 41 — Task #21 List Leads Service

Contexto:
Implementação do serviço de listagem de leads seguindo arquitetura em camadas e desacoplamento da infraestrutura.

Objetivo:
Criar `src/services/list_leads.ts`.

Requisitos:

* importar `Lead`
* importar `rank_leads`
* criar interface `LeadRepository`
* repository deve possuir:
  `find_all(): Promise<Lead[]>`
* exportar função async:
  `list_leads(lead_repository: LeadRepository): Promise<Lead[]>`

Regras:

* buscar leads via repository
* ordenar utilizando `rank_leads`
* retornar lista ordenada
* manter desacoplamento da camada de infraestrutura
* não acessar Prisma diretamente
* utilizar TypeScript estrito
* evitar `any`
* manter código limpo e minimalista

Resultado:
Serviço de listagem desacoplado da infraestrutura e preparado para futura integração com repositories Prisma.

---

## Prompt 43 — Task #16 Lead Domain Invariants

Contexto:
Implementação das invariantes da entidade Lead na camada de domínio.

Objetivo:
Criar `src/domain/entities/lead.ts` contendo funções puras de domínio para normalização, arredondamento e validação de invariantes.

Requisitos implementados:

* `normalize_email`
* `round_score`
* `get_priority_from_score`
* `validate_lead_invariants`

Regras:

* email normalizado em lowercase
* score arredondado para 2 casas
* consistência entre score e priority
* domínio desacoplado de frameworks
* sem Prisma
* sem Zod
* sem Next.js
* TypeScript estrito
* sem `any`

Resultado:
Camada de domínio preparada para futuras regras de negócio e integração com services/create_lead.ts.

---

## Prompt 44 — Task #15 Lead Score Rule

Contexto:
Implementação da regra de domínio responsável pelo cálculo do índice de qualificação financeira dos leads.

Objetivo:
Criar `src/domain/rules/calculate_lead_score.ts` contendo função pura de cálculo e classificação de leads.

Requisitos implementados:

* `calculate_lead_score`
* tratamento de entradas inválidas
* score arredondado para 2 casas
* classificação:

  * Alto
  * Medio
  * Baixo
  * NaoClassificado

Regras:

* domínio desacoplado de frameworks
* sem Prisma
* sem Zod
* sem Next.js
* TypeScript estrito
* sem `any`
* função pura e determinística

Resultado:
Camada de regras de domínio preparada para integração futura com `services/create_lead.ts`.

---

## Prompt 45 — Task #20 Create Lead Service

Contexto:
Implementação do serviço responsável pela criação de leads e orquestração do fluxo de domínio.

Objetivo:
Criar `src/services/create_lead.ts` utilizando regras de domínio e abstração de repositório.

Requisitos implementados:

* `create_lead`
* normalização de email
* cálculo de score e priority
* montagem de `CreateLeadData`
* persistência via `LeadRepository`

Regras:

* service desacoplado de Prisma
* sem dependência de frameworks
* uso de funções puras de domínio
* TypeScript estrito
* sem `any`
* sem side effects desnecessários

Arquivos envolvidos:

* `src/services/create_lead.ts`
* `src/types/lead.ts`
* `src/domain/entities/lead.ts`
* `src/domain/rules/calculate_lead_score.ts`

Resultado:
Camada de aplicação preparada para integração futura com repositórios reais e API/routes.

---

## Prompt 46 — Task #19 Lead Ranking Service Clean

Contexto:
Reimplementação limpa do serviço de ranking de leads a partir do `develop` atual, substituindo a PR antiga desatualizada.

Objetivo:
Criar `src/services/rank_leads.ts` contendo função pura de ordenação de leads.

Requisitos implementados:

* `rank_leads`
* ordenação por score válido desc
* desempate por `created_at` desc
* leads com `score === null` ao final
* preservação de imutabilidade

Regras:

* sem Prisma
* sem Zod
* sem Next.js
* sem infra
* TypeScript estrito
* sem `any`
* função pura e determinística

Resultado:
Serviço de ranking compatível com os tipos atuais do domínio e preparado para uso pelo serviço de listagem.

---

## Prompt 47 — Task #21 List Leads Service Clean

Contexto:
Reimplementação limpa do serviço de listagem de leads a partir do `develop` atual, evitando conflitos herdados da PR antiga.

Objetivo:
Criar `src/services/list_leads.ts` usando abstração de repositório e o serviço `rank_leads`.

Requisitos implementados:

* `list_leads`
* uso de `LeadRepository`
* busca via `find_all`
* ordenação via `rank_leads`
* retorno de lista ordenada

Regras:

* service desacoplado de Prisma
* sem dependência de frameworks
* sem imports de infra
* TypeScript estrito
* sem `any`
* sem sobrescrever arquivos consolidados

Resultado:
Serviço de listagem compatível com o core atual e preparado para integração futura com repositórios reais.

---

# Sessão — Correção do Setup do Prisma 7 e Atualização de Dependências

---

## Problema Identificado — Bloqueio da Task #17

Durante a implementação da task #17 (singleton Prisma Client), foi identificada uma incompatibilidade arquitetural no setup base do projeto com o Prisma 7.

O client gerado em `src/generated/prisma` utiliza o novo padrão do Prisma 7, onde o `PrismaClient` exige obrigatoriamente um adapter no construtor. A tentativa de instanciar `new PrismaClient()` sem argumentos gerava erro de TypeScript: `Expected 1 arguments, but got 0`.

O problema não estava na implementação do singleton em si, mas no setup do Prisma — o projeto não possuía nenhum adapter configurado (`@prisma/adapter-pg` ou equivalente). A decisão foi não aplicar workaround local para não introduzir inconsistência arquitetural na base compartilhada.

---

## O que foi executado

### 1. Diagnóstico

- Leitura do `prisma/schema.prisma`, `package.json`, `prisma.config.ts` e do client gerado em `src/generated/prisma/internal/class.ts`
- Confirmado que o Prisma 7 removeu o query engine binário e migrou para **driver adapters** — o `PrismaClient` sempre exige um adapter explícito no construtor
- Identificado que `@prisma/adapter-pg` e `pg` não estavam instalados

### 2. Instalação das dependências

- `@prisma/adapter-pg@^7.8.0` adicionado às dependências de produção — adapter oficial do Prisma 7 para PostgreSQL
- `pg@^8.20.0` adicionado às dependências de produção — driver Node.js do PostgreSQL
- `@types/pg@^8.20.0` já estava presente nas devDependencies

### 3. Atualização do schema (tentativa e reversão)

- Adicionado `previewFeatures = ["driverAdapters"]` ao `generator client` do `prisma/schema.prisma`
- Executado `prisma generate` — o Prisma 7 avisou que `driverAdapters` não precisa mais ser declarado como preview feature (já é estável na v7)
- `previewFeatures` removido do schema — mantido limpo sem configuração desnecessária

### 4. Implementação do singleton — Task #17

Criado `src/infra/db/prisma.ts` com o padrão correto para Prisma 7:

- `PrismaPg` instanciado com `connectionString` via `process.env.DATABASE_URL`
- `PrismaClient` instanciado com o adapter
- Singleton via `globalThis` para evitar múltiplas conexões no hot reload do Next.js em desenvolvimento
- Zero erros de TypeScript confirmados via diagnóstico

### 5. Correção de vulnerabilidade de segurança no Next.js

Durante o `npm install`, foi identificada 1 vulnerabilidade `high` no Next.js:

- **CVE**: `GHSA-26hh-7cqf-hhc6` — Middleware/Proxy bypass no App Router (Next.js 16.0.0–16.2.5)
- **Solução**: atualização do Next.js de `16.2.5` para `16.2.6`
- **Resultado**: `found 0 vulnerabilities`

### 6. Atualização dos steering files

- **`nextjs16.md`**: versão atualizada de `Next.js 16` para `Next.js 16.2.6`
- **`tech.md`**: seção do Prisma ORM expandida com documentação do driver adapter, exemplo de uso correto do `PrismaClient`, referência ao singleton como ponto único de instanciação e lista das dependências necessárias

---

## Contexto da Sessão

| Item | Detalhe |
|------|---------|
| Branch | `feature/setup-base` |
| Tasks desbloqueadas | #17 (concluída), #18, parte da #21 |
| Dependências adicionadas | `@prisma/adapter-pg@^7.8.0`, `pg@^8.20.0` |
| Next.js atualizado | `16.2.5` → `16.2.6` (CVE `GHSA-26hh-7cqf-hhc6`) |
| Arquivo criado | `src/infra/db/prisma.ts` |
| Steering files atualizados | `nextjs16.md`, `tech.md` |
| Vulnerabilidades | 0 (após atualização do Next.js) |
