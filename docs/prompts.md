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
