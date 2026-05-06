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
