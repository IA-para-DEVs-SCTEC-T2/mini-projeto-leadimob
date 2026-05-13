# Product Requirements Document — LeadImobi

## 1. Visão do Produto

**LeadImobi** é uma plataforma de qualificação inteligente de leads imobiliários que transforma o caos de múltiplos contatos em uma lista priorizada e acionável.

### Propósito
Centralizar e qualificar automaticamente leads imobiliários através de um índice de qualificação financeira baseado em padrões bancários, permitindo que corretores focalizem esforços nos clientes com maior probabilidade de fechamento.

### Contexto
Corretores de imóveis recebem alto volume de leads dispersos em múltiplos canais (e-mail, WhatsApp, portais imobiliários). Sem critério objetivo de qualificação, o tempo é gasto ineficientemente com contatos sem capacidade financeira real.

### Proposta de Valor
- **Eficiência**: Qualificação automática em tempo real (0s)
- **Objetividade**: Critério baseado em padrão bancário consolidado
- **Foco**: Priorização visual clara (Alto/Médio/Baixo)
- **Simplicidade**: Interface intuitiva, sem curva de aprendizado

### Público-Alvo
- Corretores de imóveis independentes
- Equipes de imobiliárias pequenas e médias
- Profissionais que recebem 10+ leads/dia

---

## 2. Problema Resolvido

### Dores do Usuário
1. **Dispersão de contatos**: Leads chegam por múltiplos canais sem centralização
2. **Falta de critério**: Sem método objetivo para priorizar abordagem
3. **Perda de tempo**: Contato com clientes sem capacidade de financiamento
4. **Baixa conversão**: Esforço desperdiçado em leads não qualificados
5. **Desgaste profissional**: Frustração com rejeições evitáveis

### Limitações Atuais
- Planilhas manuais (Excel/Google Sheets) sem automação
- Avaliação subjetiva baseada em intuição
- Sem histórico estruturado de leads
- Impossibilidade de análise de padrões

### Oportunidade Identificada
Aplicar critério bancário consolidado (comprometimento máximo de 30% da renda mensal) como algoritmo de qualificação automática, gerando índice objetivo e reproduzível.

---

## 3. Objetivos do Produto

### Objetivos Principais
1. Centralizar cadastro de leads imobiliários
2. Calcular automaticamente índice de qualificação financeira
3. Priorizar leads por capacidade de financiamento
4. Reduzir tempo de qualificação manual

### Metas Funcionais
- Cadastro de lead em < 1 minuto
- Cálculo de índice em tempo real (< 100ms)
- Visualização de lista priorizada instantânea
- Suporte a 1000+ leads sem degradação de performance

### Impacto Esperado
- ↑ 70% de eficiência em vendas
- ↓ 50% de tempo gasto com leads não qualificados
- ↑ 40% de taxa de conversão
- ↑ Satisfação do corretor com ferramenta

---

## 4. Funcionalidades

### 4.1 Cadastro de Lead

**Descrição**
Formulário estruturado para registro de novo lead com dados financeiros essenciais.

**Campos Obrigatórios**
- Nome completo
- E-mail
- Telefone
- Valor do imóvel desejado (R$)
- Renda mensal (R$)

**Valor Gerado**
- Centralização de dados do cliente
- Captura de informações necessárias para qualificação
- Validação de entrada em tempo real

**Dependências**
- Validação com Zod
- Persistência em banco de dados (Prisma)
- Cálculo automático de índice

---

### 4.2 Cálculo de Índice de Qualificação

**Descrição**
Algoritmo automático que calcula índice de qualificação financeira baseado em padrão bancário.

**Fórmula**
```
Índice = (Renda Mensal × 12 × 5) ÷ Valor do Imóvel × 100
```

**Lógica**
- Renda anual × 5 anos = capacidade de financiamento
- Dividido pelo valor do imóvel = percentual de comprometimento
- Multiplicado por 100 = índice em escala 0-100+

**Tratamento de Exceções**
- Se `Valor do Imóvel` = 0 ou nulo → índice inválido, lead não classificado
- Se `Renda Mensal` = 0 → índice = 0 (baixo)
- Valores negativos → rejeitar no schema de validação

**Valor Gerado**
- Qualificação objetiva baseada em critério consolidado
- Reproduzibilidade garantida
- Sem viés subjetivo

**Dependências**
- Validação de entrada (Zod)
- Regra de negócio no domain

---

### 4.3 Classificação de Prioridade

**Descrição**
Categorização visual do lead em três níveis de prioridade baseado no índice.

**Classificações**
| Nível | Intervalo | Cor | Significado |
|-------|-----------|-----|-------------|
| Alto | ≥ 80 | 🟢 Verde | Alta capacidade de financiamento |
| Médio | 40–79 | 🟡 Amarelo | Capacidade moderada |
| Baixo | < 40 | 🔴 Vermelho | Capacidade limitada |

**Valor Gerado**
- Identificação visual imediata de prioridade
- Facilita tomada de decisão rápida
- Reduz tempo de análise

**Dependências**
- Cálculo de índice
- Componente visual (badge)

---

### 4.4 Lista Priorizada de Leads

**Descrição**
Visualização centralizada de todos os leads ordenados por índice de qualificação (decrescente).

**Informações Exibidas**
- Nome do lead
- E-mail
- Telefone
- Valor do imóvel
- Renda mensal
- Índice de qualificação
- Classificação de prioridade (badge)
- Data de cadastro

**Ordenação**
- Padrão: Índice decrescente (maior para menor)
- Alternativa: Data de cadastro (mais recente primeiro)

**Valor Gerado**
- Visão consolidada de pipeline de leads
- Priorização automática
- Facilita contato assertivo

**Dependências**
- Persistência de leads
- Cálculo de índice
- Componente de listagem

---

### 4.5 Detalhes do Lead

**Descrição**
Visualização completa dos dados de um lead individual com histórico e ações.

**Informações Exibidas**
- Todos os dados cadastrais
- Índice de qualificação com explicação da fórmula
- Classificação de prioridade
- Data de cadastro
- Status de contato (futuro)

**Ações Disponíveis**
- Editar dados do lead
- Deletar lead
- Copiar dados para contato (futuro)

**Valor Gerado**
- Acesso rápido aos dados do cliente
- Contexto completo para abordagem
- Facilita personalização de contato

**Dependências**
- Persistência de leads
- Componente de detalhes

---

## 5. Regras de Negócio

### RN01 — Validação de Valor do Imóvel
- **Regra**: Valor do imóvel deve ser maior que zero
- **Condição**: Campo "Valor do Imóvel" na entrada
- **Resultado Esperado**: Se ≤ 0, rejeitar cadastro com mensagem de erro

### RN02 — Validação de Renda Mensal
- **Regra**: Renda mensal deve ser não-negativa
- **Condição**: Campo "Renda Mensal" na entrada
- **Resultado Esperado**: Se < 0, rejeitar cadastro; se = 0, aceitar com índice = 0

### RN03 — Cálculo de Índice
- **Regra**: Índice = (Renda × 12 × 5) ÷ Valor do Imóvel × 100
- **Condição**: Após validação de entrada
- **Resultado Esperado**: Índice calculado e armazenado com lead

### RN04 — Classificação de Prioridade
- **Regra**: Classificar baseado em intervalo de índice
- **Condição**: Após cálculo de índice
- **Resultado Esperado**: 
  - Índice ≥ 80 → Alto
  - Índice 40–79 → Médio
  - Índice < 40 → Baixo

### RN05 — Ordenação Padrão
- **Regra**: Leads exibidos em ordem decrescente de índice
- **Condição**: Ao listar leads
- **Resultado Esperado**: Lead com maior índice aparece primeiro

### RN06 — Validação de E-mail
- **Regra**: E-mail deve ser válido e único por lead
- **Condição**: Campo "E-mail" na entrada
- **Resultado Esperado**: Se inválido ou duplicado, rejeitar com mensagem

### RN07 — Validação de Telefone
- **Regra**: Telefone deve estar em formato válido
- **Condição**: Campo "Telefone" na entrada
- **Resultado Esperado**: Se inválido, rejeitar com mensagem

### RN08 — Imutabilidade de Índice
- **Regra**: Índice não deve ser recalculado automaticamente após cadastro
- **Condição**: Lead já cadastrado
- **Resultado Esperado**: Índice permanece constante até edição manual de dados

---

## 6. Fluxos Funcionais

### 6.1 Fluxo Principal — Cadastro e Qualificação

```
1. Corretor acessa página de cadastro
2. Preenche formulário com dados do lead
3. Sistema valida entrada (Zod)
4. Sistema calcula índice de qualificação
5. Sistema classifica prioridade
6. Lead é persistido no banco
7. Corretor é redirecionado para lista de leads
8. Lead aparece na posição correta (ordenado por índice)
9. Corretor visualiza classificação visual (badge)
```

**Tempo esperado**: < 1 minuto (incluindo preenchimento manual)

---

### 6.2 Fluxo Alternativo — Edição de Lead

```
1. Corretor acessa lista de leads
2. Clica em lead específico
3. Visualiza detalhes e dados
4. Clica em "Editar"
5. Formulário é preenchido com dados atuais
6. Corretor altera um ou mais campos
7. Sistema revalida entrada
8. Sistema recalcula índice (se dados financeiros alterados)
9. Lead é atualizado no banco
10. Corretor retorna à lista
11. Lead pode ter mudado de posição (novo índice)
```

---

### 6.3 Fluxo Alternativo — Visualização de Detalhes

```
1. Corretor acessa lista de leads
2. Clica em lead específico
3. Visualiza página de detalhes com:
   - Todos os dados cadastrais
   - Índice de qualificação
   - Explicação da fórmula
   - Classificação de prioridade
4. Corretor pode copiar dados para contato
5. Corretor retorna à lista
```

---

### 6.4 Fluxo Alternativo — Deleção de Lead

```
1. Corretor acessa detalhes do lead
2. Clica em "Deletar"
3. Sistema exibe confirmação
4. Corretor confirma deleção
5. Lead é removido do banco
6. Corretor retorna à lista
7. Lead não aparece mais na listagem
```

---

### 6.5 Exceções

**Exceção E01 — Valor do Imóvel Inválido**
- Condição: Usuário tenta cadastrar com valor ≤ 0
- Ação: Sistema exibe erro "Valor do imóvel deve ser maior que zero"
- Resultado: Cadastro não é persistido

**Exceção E02 — E-mail Duplicado**
- Condição: E-mail já existe no banco
- Ação: Sistema exibe aviso "Este e-mail já está cadastrado"
- Resultado: Cadastro não é persistido

**Exceção E03 — Erro de Persistência**
- Condição: Falha ao salvar no banco de dados
- Ação: Sistema exibe erro genérico "Erro ao salvar. Tente novamente"
- Resultado: Usuário pode tentar novamente

---

## 7. Requisitos Funcionais

### RF01 — Cadastro de Lead
O sistema deve permitir que o usuário cadastre um novo lead com os campos: Nome, E-mail, Telefone, Valor do Imóvel e Renda Mensal.

### RF02 — Validação de Entrada
O sistema deve validar todos os campos de entrada antes de persistir, rejeitando dados inválidos com mensagens claras.

### RF03 — Cálculo de Índice
O sistema deve calcular automaticamente o índice de qualificação usando a fórmula: (Renda × 12 × 5) ÷ Valor do Imóvel × 100.

### RF04 — Classificação de Prioridade
O sistema deve classificar o lead em Alto (≥80), Médio (40–79) ou Baixo (<40) baseado no índice.

### RF05 — Listagem de Leads
O sistema deve exibir todos os leads ordenados por índice em ordem decrescente.

### RF06 — Visualização de Detalhes
O sistema deve permitir visualizar detalhes completos de um lead individual, incluindo índice e explicação da fórmula.

### RF07 — Edição de Lead
O sistema deve permitir editar dados de um lead existente e recalcular o índice se necessário.

### RF08 — Deleção de Lead
O sistema deve permitir deletar um lead com confirmação prévia.

### RF09 — Persistência de Dados
O sistema deve persistir todos os leads em banco de dados relacional (PostgreSQL).

### RF10 — Tratamento de Exceções
O sistema deve tratar erros de validação, persistência e negócio com mensagens claras ao usuário.

---

## 8. Requisitos Não Funcionais

### RNF01 — Performance
- Cadastro de lead: < 500ms
- Cálculo de índice: < 100ms
- Listagem de leads: < 1s (até 1000 leads)
- Detalhes de lead: < 300ms

### RNF02 — Escalabilidade
- Suportar até 10.000 leads sem degradação significativa
- Arquitetura preparada para migração futura para API dedicada
- Banco de dados com índices otimizados

### RNF03 — Disponibilidade
- Uptime mínimo: 99% (v1)
- Recuperação de falhas: automática
- Sem perda de dados em caso de falha

### RNF04 — Segurança
- Validação de entrada contra injeção SQL (Prisma)
- Sem armazenamento de senhas (v1 sem autenticação)
- HTTPS obrigatório em produção
- Dados sensíveis (telefone, e-mail) não expostos em logs

### RNF05 — Usabilidade
- Interface intuitiva sem curva de aprendizado
- Feedback visual claro (cores, badges, mensagens)
- Responsivo em desktop (mobile futuro)
- Tempo de resposta perceptível (< 2s)

### RNF06 — Manutenibilidade
- Código estruturado em camadas (app, domain, services, infra)
- Tipagem forte com TypeScript
- Testes automatizados para domínio e serviços
- Documentação de arquitetura

### RNF07 — Observabilidade
- Logs estruturados de operações críticas
- Rastreamento de erros
- Métricas de uso (futuro)

### RNF08 — Compatibilidade
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Node.js 20.9.0+
- PostgreSQL 12+

---

## 9. Arquitetura Funcional

### 9.1 Módulos Principais

#### Módulo de Apresentação (app/)
**Responsabilidade**: Receber requisições HTTP e retornar respostas

**Componentes**
- Rotas de página (leads list, lead detail)
- Rotas de API (POST /leads, GET /leads, etc.)
- Server Actions para operações
- Componentes React (formulário, card, badge)

**Integrações**
- Recebe dados do usuário
- Chama services
- Retorna UI renderizada

---

#### Módulo de Domínio (domain/)
**Responsabilidade**: Conter regras de negócio puras

**Componentes**
- Entidade Lead (estrutura de dados)
- Regra de cálculo de índice
- Regra de classificação de prioridade

**Características**
- Sem dependências externas
- Funções puras
- Testável isoladamente

---

#### Módulo de Serviços (services/)
**Responsabilidade**: Orquestrar casos de uso

**Componentes**
- CreateLead: cadastro de novo lead
- ListLeads: listagem com ordenação
- RankLeads: ranking por índice
- UpdateLead: edição de lead
- DeleteLead: deleção de lead

**Integrações**
- Chama domain para regras
- Chama infra para persistência
- Retorna dados para app

---

#### Módulo de Infraestrutura (infra/)
**Responsabilidade**: Acesso a dados e integrações externas

**Componentes**
- PrismaClient (singleton)
- LeadRepository (CRUD)
- Futuras integrações (APIs, WhatsApp)

**Características**
- Abstração de banco de dados
- Operações de persistência
- Tratamento de erros de BD

---

#### Módulo de Validação (schemas/)
**Responsabilidade**: Contratos de entrada com Zod

**Componentes**
- LeadSchema: validação de lead
- Schemas específicos por operação

**Características**
- Validação declarativa
- Mensagens de erro claras
- Tipagem automática

---

### 9.2 Fluxo de Dados

```
Usuário (UI)
    ↓
app/ (Route Handler / Server Action)
    ↓
services/ (CreateLead, ListLeads, etc.)
    ↓
domain/ (Regras de negócio)
    ↓
infra/ (LeadRepository)
    ↓
PostgreSQL (Persistência)
```

---

### 9.3 Comunicação Entre Componentes

| De | Para | Tipo | Dados |
|---|---|---|---|
| app | services | Função | Entrada validada |
| services | domain | Função | Dados puros |
| services | infra | Método | Operação CRUD |
| infra | PostgreSQL | SQL | Query |
| domain | app | Retorno | Resultado calculado |

---

## 10. Critérios de Sucesso

### Métrica 1 — Tempo de Qualificação
- **Objetivo**: Reduzir tempo de qualificação manual
- **Métrica**: Tempo de cadastro + cálculo + visualização
- **Meta**: < 1 minuto (incluindo preenchimento)
- **Medição**: Cronômetro em teste de usuário

### Métrica 2 — Eficiência em Vendas
- **Objetivo**: Aumentar foco em leads qualificados
- **Métrica**: % de tempo gasto com leads de alta prioridade
- **Meta**: ↑ 70% vs. baseline
- **Medição**: Feedback do usuário, análise de uso

### Métrica 3 — Taxa de Conversão
- **Objetivo**: Melhorar taxa de fechamento
- **Métrica**: % de leads contatados que resultam em venda
- **Meta**: ↑ 40% vs. baseline
- **Medição**: Feedback do usuário após 30 dias

### Métrica 4 — Redução de Leads Não Qualificados
- **Objetivo**: Evitar contato com clientes sem capacidade
- **Métrica**: % de leads com índice < 40 que não resultam em venda
- **Meta**: ↓ 50% vs. baseline
- **Medição**: Análise de dados após 30 dias

### Métrica 5 — Satisfação do Usuário
- **Objetivo**: Validar usabilidade e valor
- **Métrica**: NPS (Net Promoter Score)
- **Meta**: ≥ 50
- **Medição**: Survey após 2 semanas de uso

### Métrica 6 — Performance
- **Objetivo**: Garantir responsividade
- **Métrica**: Tempo de resposta de operações críticas
- **Meta**: Cadastro < 500ms, Listagem < 1s
- **Medição**: Monitoramento de logs

### Métrica 7 — Confiabilidade
- **Objetivo**: Garantir disponibilidade
- **Métrica**: Uptime
- **Meta**: ≥ 99%
- **Medição**: Monitoramento de infraestrutura

---

## 11. Restrições

### Restrição Técnica RT01
**Descrição**: Prisma 7 requer driver adapter para PostgreSQL
**Impacto**: Todas as operações de BD devem usar `@prisma/adapter-pg`
**Mitigação**: Singleton em `src/infra/db/prisma.ts`

### Restrição Técnica RT02
**Descrição**: Next.js 16 com async params
**Impacto**: Todas as rotas devem usar `await params`
**Mitigação**: Usar `npx next typegen` para gerar tipos

### Restrição Técnica RT03
**Descrição**: Sem autenticação em v1
**Impacto**: Qualquer pessoa pode acessar e modificar dados
**Mitigação**: Implementar autenticação em v2

### Restrição Operacional RO01
**Descrição**: Sem integração com portais imobiliários em v1
**Impacto**: Cadastro manual de leads
**Mitigação**: Planejado para v2

### Restrição Operacional RO02
**Descrição**: Sem automação de contato (WhatsApp/e-mail) em v1
**Impacto**: Corretor deve contatar manualmente
**Mitigação**: Planejado para v2

---

## 12. Premissas

### Premissa P01
Corretores têm acesso a informações de renda e valor do imóvel no momento do contato inicial.

### Premissa P02
A fórmula de qualificação (30% de comprometimento máximo) é válida para o mercado imobiliário brasileiro.

### Premissa P03
Leads com índice ≥ 80 têm taxa de conversão significativamente maior que leads com índice < 40.

### Premissa P04
Corretores preferem interface simples a funcionalidades complexas em v1.

### Premissa P05
PostgreSQL é suficiente para volume de dados esperado em v1 (até 10.000 leads).

### Premissa P06
Usuários têm acesso a navegador moderno com JavaScript habilitado.

---

## 13. Riscos

### Risco Funcional RF01
**Descrição**: Fórmula de qualificação não reflete realidade do mercado
**Probabilidade**: Média
**Impacto**: Alto (produto não resolve problema)
**Mitigação**: Validar com corretores reais antes de launch; ajustar fórmula em v1.1

### Risco Funcional RF02
**Descrição**: Usuários não preenchem dados de renda corretamente
**Probabilidade**: Alta
**Impacto**: Médio (índice impreciso)
**Mitigação**: Adicionar validação e dicas de preenchimento; educação do usuário

### Risco Técnico RT01
**Descrição**: Performance degrada com > 10.000 leads
**Probabilidade**: Baixa
**Impacto**: Alto (produto fica inutilizável)
**Mitigação**: Implementar paginação; otimizar queries; monitorar performance

### Risco Técnico RT02
**Descrição**: Perda de dados por falha de banco
**Probabilidade**: Baixa
**Impacto**: Crítico (perda total de dados)
**Mitigação**: Backup automático; replicação de BD; plano de recuperação

### Risco Operacional RO01
**Descrição**: Baixa adoção por falta de integração com fluxo existente
**Probabilidade**: Média
**Impacto**: Alto (produto não é usado)
**Mitigação**: Integração com WhatsApp/portais em v2; feedback de usuários

### Risco Operacional RO02
**Descrição**: Concorrência com ferramentas existentes
**Probabilidade**: Alta
**Impacto**: Médio (reduz TAM)
**Mitigação**: Diferenciação por simplicidade; preço competitivo; suporte

---

## Apêndice A — Glossário

| Termo | Definição |
|-------|-----------|
| Lead | Potencial cliente interessado em imóvel |
| Índice de Qualificação | Percentual de comprometimento de renda com imóvel |
| Prioridade | Classificação de capacidade financeira (Alto/Médio/Baixo) |
| Corretor | Profissional que vende imóveis |
| Comprometimento | % da renda mensal necessária para financiar imóvel |
| Financiamento | Empréstimo para compra de imóvel |

---

## Apêndice B — Referências

- Padrão bancário de comprometimento máximo: 30% da renda mensal
- Fórmula de qualificação: (Renda × 12 × 5) ÷ Valor do Imóvel × 100
- Steering files: tech.md, structure.md, product.md, nextjs16.md, gitflow.md
