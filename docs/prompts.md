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
