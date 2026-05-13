# Plano de Implementação — LeadImobi Core

## Visão Geral

Implementação incremental da plataforma LeadImobi Core seguindo a arquitetura em camadas definida no design. A ordem respeita as dependências entre camadas: tipos e schemas primeiro (base), depois domínio (testável isoladamente), infraestrutura, serviços, utilitários, componentes e, por fim, rotas e Server Actions.

**Stack:** Next.js (App Router), TypeScript strict, Prisma ORM, PostgreSQL, Zod, Tailwind CSS, fast-check (PBT)

---

## Tarefas

- [x] 1. Setup do projeto e configuração base
  - [x] 1.1 Inicializar projeto Next.js com App Router e TypeScript strict
    - Criar projeto com `create-next-app` usando flags `--typescript --app --tailwind --eslint`
    - Configurar `tsconfig.json` com `"strict": true` e path aliases (`@/` apontando para `src/`)
    - Verificar que `next.config.ts` está configurado corretamente
    - _Requirements: LI-6.2.3_

  - [x] 1.2 Instalar e configurar dependências
    - Instalar Prisma: `prisma` (dev) e `@prisma/client`
    - Instalar Zod: `zod`
    - Instalar fast-check para PBT: `fast-check` (dev)
    - Instalar Jest e ts-jest para testes unitários: `jest`, `ts-jest`, `@types/jest` (dev)
    - Configurar `jest.config.ts` com preset `ts-jest` e path aliases
    - _Requirements: LI-5.1.1, LI-6.2.1_

  - [x] 1.3 Configurar Prisma e schema do banco de dados
    - Executar `npx prisma init` para criar `prisma/schema.prisma` e `.env`
    - Definir o model `Lead` no schema Prisma conforme especificado no design:
      - Campos: `id` (cuid), `nome`, `email`, `cpf` (unique), `telefone`, `valor_imovel` (Decimal 15,2), `renda_mensal` (Decimal 15,2), `score` (Decimal? 8,2), `priority` (String), `created_at` (DateTime now)
      - Mapear tabela para `"leads"` com `@@map`
    - Configurar `DATABASE_URL` no `.env` para PostgreSQL local
    - Executar `npx prisma migrate dev --name init` para criar a migration inicial
    - _Requirements: LI-1.3.1, LI-1.3.3, LI-6.1.1_

  - [x] 1.4 Criar estrutura de pastas do projeto
    - Criar diretórios: `src/domain/rules/`, `src/domain/entities/`, `src/services/`, `src/infra/db/`, `src/infra/repositories/`, `src/components/`, `src/schemas/`, `src/types/`, `src/lib/`
    - Criar diretório de testes: `src/__tests__/domain/`, `src/__tests__/services/`, `src/__tests__/lib/`, `src/__tests__/schemas/`
    - _Requirements: LI-6.1.1_

- [ ] 2. Camada `types/` — tipos compartilhados
  - [ ] 2.1 Criar `src/types/lead.ts` com todos os tipos compartilhados
    - Definir `type LeadPriority = 'Alto' | 'Medio' | 'Baixo' | 'NaoClassificado'`
    - Definir `interface Lead` com campos: `id`, `nome`, `email`, `telefone`, `valor_imovel`, `renda_mensal`, `score` (number | null), `priority`, `created_at`
    - Definir `interface CreateLeadInput` com campos: `nome`, `email`, `telefone`, `valor_imovel`, `renda_mensal`
    - Definir `type LeadScoreResult` como union discriminada: `{ valid: true; score: number; priority: LeadPriority } | { valid: false; priority: 'NaoClassificado' }`
    - Usar union discriminada (não interface plana) para habilitar type narrowing seguro: ao verificar `result.valid === true`, TypeScript infere `result.score` como `number` sem asserções de tipo
    - Garantir que nenhum tipo importa de `infra/`, `schemas/` ou libs externas
    - _Requirements: LI-6.1.2, LI-6.2.2, LI-5.2.1_

- [ ] 3. Camada `schemas/` — contratos Zod
  - [ ] 3.1 Criar `src/schemas/lead.schema.ts` com `CreateLeadSchema`
    - Definir `CreateLeadSchema` com `z.object()` contendo:
      - `nome`: `z.string().min(2).max(100)` com mensagem descritiva
      - `email`: `z.string().email()` com mensagem descritiva
      - `cpf`: `z.string().regex(/^\d{11}$/)` aceitando formatação com pontos e hífens (usar `.transform` para extrair apenas dígitos antes da regex)
      - `telefone`: `z.string().regex(/^\d{10,15}$/)` aceitando formatação com parênteses, espaços e hífens (usar `.transform` para extrair apenas dígitos antes da regex, ou usar regex que aceite formatação)
      - `valor_imovel`: `z.number().positive()` com mensagem descritiva
      - `renda_mensal`: `z.number().positive()` com mensagem descritiva
    - Exportar `CreateLeadInput` derivado via `z.infer<typeof CreateLeadSchema>`
    - Não importar nada de `domain/` ou `infra/`
    - _Requirements: LI-1.2.1, LI-1.2.2, LI-1.2.2A, LI-1.2.3, LI-1.2.4, LI-1.2.5, LI-1.2.7, LI-1.2.8, LI-5.1.1, LI-5.1.4_

  - [x] 3.2 Escrever testes de propriedade para `CreateLeadSchema` (Property 7 e 8)
    - **Property 7: Rejeição de entradas inválidas pelo schema Zod**
    - Usar `fc.record` com campos fora dos limites (nome vazio, email sem @, telefone com 9 dígitos, valor_imovel negativo, renda_mensal zero) e verificar que `safeParse` retorna `{ success: false }` com pelo menos um erro
    - **Property 8: Aceitação de entradas válidas pelo schema Zod**
    - Usar `fc.record` com campos dentro dos limites válidos e verificar que `safeParse` retorna `{ success: true }` com objeto tipado livre de erros
    - Anotar com `// Feature: leadimobi-core, Property 7: Rejeição de entradas inválidas` e `// Feature: leadimobi-core, Property 8: Aceitação de entradas válidas`
    - **Validates: Requirements LI-1.2.1, LI-1.2.2, LI-1.2.3, LI-1.2.4, LI-1.2.5, LI-1.2.8, LI-5.1.1**

  - [x] 3.3 Escrever testes unitários para `CreateLeadSchema`
    - Testar: nome com 1 caractere → erro; email sem `@` → erro; cpf com 10 dígitos → erro; cpf com 11 dígitos → sucesso; telefone com 9 dígitos → erro; `valor_imovel` negativo → erro; todos os campos válidos → sucesso com objeto tipado
    - _Requirements: LI-1.2.1, LI-1.2.2, LI-1.2.2A, LI-1.2.3, LI-1.2.4, LI-1.2.5_

- [ ] 4. Checkpoint — tipos e schemas
  - Garantir que todos os testes das tarefas 2 e 3 passam. Verificar que `types/lead.ts` e `schemas/lead.schema.ts` compilam sem erros TypeScript. Perguntar ao usuário se há dúvidas antes de prosseguir.

- [ ] 5. Camada `domain/` — regras de negócio puras
  - [ ] 5.1 Criar `src/domain/rules/calculate_lead_score.ts`
    - Implementar `function calculate_lead_score(renda_mensal: number, valor_imovel: number): LeadScoreResult`
    - Retornar `{ valid: false, priority: 'NaoClassificado' }` se `valor_imovel <= 0` ou `renda_mensal <= 0` (sem lançar exceção)
    - Calcular `score = Math.round(((renda_mensal * 12 * 5) / valor_imovel) * 100 * 100) / 100`
    - Classificar: `score >= 80` → `'Alto'`; `score >= 40` → `'Medio'`; `score < 40` → `'Baixo'`
    - Retornar `{ valid: true, score, priority }`
    - Importar apenas de `@/types/lead` — sem dependências de Zod, Prisma ou Next.js
    - _Requirements: LI-2.1.1, LI-2.1.2, LI-2.1.3, LI-2.1.4, LI-2.2.1, LI-2.2.2, LI-2.2.5, LI-2.3.1, LI-2.3.2, LI-2.3.3, LI-5.2.1, LI-5.2.2, LI-5.2.3_

  - [ ]* 5.2 Escrever testes de propriedade para `calculate_lead_score` (Properties 1, 2, 3 e 4)
    - **Property 1: Determinismo do cálculo**
    - Usar `fc.tuple(fc.float({ min: 0.01 }), fc.float({ min: 0.01 }))` e verificar que duas chamadas com os mesmos argumentos retornam resultado idêntico
    - Anotar com `// Feature: leadimobi-core, Property 1: Determinismo do cálculo`
    - **Property 2: Cobertura total e sem sobreposição da classificação**
    - Usar `fc.tuple(fc.float({ min: 0.01 }), fc.float({ min: 0.01 }))` e verificar que o resultado `valid: true` sempre retorna exatamente uma das três classificações (`Alto`, `Medio`, `Baixo`)
    - Anotar com `// Feature: leadimobi-core, Property 2: Cobertura total e sem sobreposição`
    - **Property 3: Tratamento seguro de entradas inválidas**
    - Usar `fc.oneof(fc.constant(0), fc.float({ max: 0 }))` para gerar `valor_imovel <= 0` ou `renda_mensal <= 0` e verificar que retorna `{ valid: false, priority: 'NaoClassificado' }` sem lançar exceção
    - Anotar com `// Feature: leadimobi-core, Property 3: Tratamento seguro de entradas inválidas`
    - **Property 4: Consistência da fórmula de cálculo**
    - Usar `fc.tuple(fc.float({ min: 0.01 }), fc.float({ min: 0.01 }))` e verificar que `score === Math.round((renda * 12 * 5 / valor * 100) * 100) / 100`
    - Anotar com `// Feature: leadimobi-core, Property 4: Consistência da fórmula`
    - **Validates: Requirements LI-2.1.1, LI-2.1.2, LI-2.1.4, LI-2.2.1, LI-2.2.2, LI-2.2.5, LI-2.3.4, LI-2.3.5**

  - [ ]* 5.3 Escrever testes unitários para `calculate_lead_score`
    - Testar casos concretos: Renda R$ 12.000 + Imóvel R$ 400.000 → score 90,00, priority `Alto`; Renda R$ 6.000 + Imóvel R$ 380.000 → score 94,74, priority `Alto`; Renda R$ 3.000 + Imóvel R$ 450.000 → score 24,00, priority `Baixo`; `valor_imovel = 0` → `{ valid: false, priority: 'NaoClassificado' }`; `renda_mensal = 0` → `{ valid: false, priority: 'NaoClassificado' }`
    - Testar fronteiras: score exatamente 80 → `Alto`; score exatamente 40 → `Medio`; score 39,99 → `Baixo`
    - _Requirements: LI-2.1.5, LI-2.1.6, LI-2.2.1, LI-2.2.5, LI-2.3.1, LI-2.3.2, LI-2.3.3_

  - [ ] 5.4 Criar `src/domain/entities/lead.ts`
    - Importar o tipo `Lead` e `LeadPriority` de `@/types/lead` — sem dependências de Prisma, Zod ou Next.js
    - Implementar `function normalize_email(email: string): string` que retorna o email em lowercase (invariante 1)
    - Implementar `function validate_lead_invariants(lead: Lead): boolean` que verifica:
      - `email === email.toLowerCase()` (email normalizado)
      - `score === null || score === Math.round(score * 100) / 100` (score arredondado a 2 casas)
      - Consistência entre `score` e `priority`:
        - `score >= 80` → `priority === 'Alto'`
        - `score >= 40 && score < 80` → `priority === 'Medio'`
        - `score > 0 && score < 40` → `priority === 'Baixo'`
        - `score === null` → `priority === 'NaoClassificado'`
    - Exportar `normalize_email` e `validate_lead_invariants` para uso em `services/create_lead.ts` e testes
    - _Requirements: LI-1.3.5, LI-2.1.2, LI-2.3.1, LI-2.3.2, LI-2.3.3, LI-5.2.2, LI-6.1.2_

- [ ] 6. Checkpoint — domínio
  - Garantir que todos os testes das tarefas 5.2 e 5.3 passam. Verificar que nenhum arquivo em `domain/` importa de `infra/`, `app/` ou `schemas/`. Perguntar ao usuário se há dúvidas antes de prosseguir.

- [ ] 7. Camada `infra/` — acesso a dados
  - [ ] 7.1 Criar `src/infra/db/prisma.ts` com singleton do Prisma Client
    - Implementar padrão singleton usando `global` para evitar múltiplas instâncias em hot-reload do Next.js
    - Exportar instância única `prisma` do `PrismaClient`
    - _Requirements: LI-1.3.1, LI-6.1.3_

  - [ ] 7.2 Criar `src/infra/repositories/lead_repository.ts`
    - Implementar `lead_repository` com os métodos:
      - `create(data: CreateLeadData): Promise<Lead>` — persiste lead via Prisma e retorna `Lead` mapeado
      - `find_all(): Promise<Lead[]>` — busca todos os leads e retorna array mapeado
      - `find_by_id(id: string): Promise<Lead | null>` — busca lead por ID e retorna mapeado ou null
    - Implementar `map_prisma_to_lead(prisma_lead)` para converter `Decimal` → `number` e `priority` → `LeadPriority`
    - Capturar erro Prisma `P2002` (CPF duplicado) e lançar erro tipado `{ error: 'CPF_ALREADY_EXISTS' }`
    - Capturar erros de conexão e lançar erro tipado `{ error: 'DATABASE_UNAVAILABLE' }`
    - Nunca expor detalhes internos do Prisma para camadas superiores
    - _Requirements: LI-1.3.1, LI-1.3.2, LI-1.3.3, LI-1.3.4, LI-1.3.5, LI-6.1.3_

- [x] 8. Camada `services/` — orquestração de casos de uso
  - [x] 8.1 Criar `src/services/rank_leads.ts`
    - Implementar `function rank_leads(leads: Lead[]): Lead[]` como função pura
    - Ordenar: leads com score válido por score decrescente; desempate por `created_at` crescente; leads `NaoClassificado` (score null) ao final
    - Não modificar o array original (retornar novo array)
    - Importar apenas de `@/types/lead` — sem dependências de infra ou frameworks
    - _Requirements: LI-3.1.1, LI-3.1.2, LI-3.1.4, LI-3.1.5_

  - [x] 8.2 Escrever testes de propriedade para `rank_leads` (Property 5)
    - **Property 5: Ordenação estável da lista priorizada**
    - Usar `fc.array(fc.record({ id: fc.string(), score: fc.option(fc.float({ min: 0 })), priority: fc.constantFrom('Alto', 'Medio', 'Baixo', 'NaoClassificado'), created_at: fc.date(), ... }))` e verificar as três invariantes: (a) nenhum lead com score válido aparece após `NaoClassificado`; (b) para dois leads com score válido, o de maior score aparece primeiro; (c) para dois leads com mesmo score, o de `created_at` mais antigo aparece primeiro
    - Anotar com `// Feature: leadimobi-core, Property 5: Ordenação estável da lista priorizada`
    - **Validates: Requirements LI-3.1.1, LI-3.1.2, LI-3.1.4**

  - [ ]* 8.3 Escrever testes unitários para `rank_leads`
    - Testar: lista com Alto, Baixo, Médio → retorna Alto, Médio, Baixo; `NaoClassificado` misturado → vai ao final; lista vazia → retorna array vazio; dois leads com mesmo score → desempate por `created_at` mais antigo primeiro
    - _Requirements: LI-3.1.1, LI-3.1.2, LI-3.1.4_

  - [ ] 8.4 Criar `src/services/create_lead.ts`
    - Implementar `async function create_lead(input: CreateLeadInput): Promise<Lead>`
    - Normalizar o email com `normalize_email(input.email)` antes de qualquer operação (invariante da entidade)
    - Chamar `calculate_lead_score(input.renda_mensal, input.valor_imovel)` para obter `{ score, priority }`
    - Montar objeto `CreateLeadData` com score (null se `valid: false`) e priority
    - Chamar `lead_repository.create(data)` e retornar o `Lead` criado
    - Propagar erros tipados do repositório (`EMAIL_ALREADY_EXISTS`, `DATABASE_UNAVAILABLE`) sem transformação
    - _Requirements: LI-1.1.2, LI-1.3.1, LI-1.3.2, LI-1.3.5, LI-2.2.3, LI-6.1.3_

  - [ ]* 8.5 Escrever testes de integração para `create_lead` com mock do repositório
    - Mockar `lead_repository` com Jest (`jest.mock`)
    - Testar: input válido com renda/imóvel → score calculado e persistido com priority correta; input com `valor_imovel = 0` → lead criado com `priority: 'NaoClassificado'` e `score: null`; repositório lança `EMAIL_ALREADY_EXISTS` → service propaga o erro
    - _Requirements: LI-1.1.2, LI-1.3.1, LI-1.3.5, LI-2.2.3_

  - [ ] 8.6 Criar `src/services/list_leads.ts`
    - Implementar `async function list_leads(): Promise<Lead[]>`
    - Chamar `lead_repository.find_all()` para obter todos os leads
    - Passar o array para `rank_leads(leads)` e retornar o resultado ordenado
    - _Requirements: LI-3.1.1, LI-3.1.5_

  - [ ]* 8.7 Escrever teste de integração para consistência da lista após criação (Property 9)
    - **Property 9: Consistência da lista após criação de lead**
    - Mockar `lead_repository` para simular `create` seguido de `find_all` retornando o lead criado
    - Verificar que o resultado de `list_leads()` após `create_lead(input)` contém o novo lead e que `rank_leads` o posiciona corretamente (score desc, created_at asc, NaoClassificado ao final)
    - Anotar com `// Feature: leadimobi-core, Property 9: Consistência da lista após criação de lead`
    - **Validates: Requirements LI-3.1.3**

- [ ] 9. Checkpoint — serviços e domínio integrados
  - Garantir que todos os testes das tarefas 8.2, 8.3 e 8.5 passam. Verificar que `services/` é a única camada que acessa `infra/`. Perguntar ao usuário se há dúvidas antes de prosseguir.

- [ ] 10. Camada `lib/` — formatadores
  - [ ] 10.1 Criar `src/lib/formatters.ts` com funções puras de formatação
    - Implementar `function format_currency(value: number): string` — formata para `"R$ X.XXX,XX"` usando `Intl.NumberFormat` com locale `'pt-BR'` e style `'currency'` currency `'BRL'`
    - Implementar `function format_score(value: number | null): string` — retorna valor com 2 casas decimais usando `toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })` ou `"—"` se null
    - Implementar `function format_date(date: Date): string` — formata para `"DD/MM/AAAA HH:MM"` usando `Intl.DateTimeFormat` com locale `'pt-BR'`
    - Sem dependências de estado, framework ou banco de dados
    - _Requirements: LI-4.2.1, LI-4.2.2, LI-4.2.3, LI-4.1.3_

  - [ ]* 10.2 Escrever testes de propriedade para `format_currency` (Property 6)
    - **Property 6: Round-trip de formatação monetária**
    - Usar `fc.float({ min: 0.01, max: 1_000_000 })` e verificar que o resultado começa com `"R$ "` e contém exatamente uma vírgula com exatamente dois dígitos após ela
    - Anotar com `// Feature: leadimobi-core, Property 6: Round-trip de formatação monetária`
    - **Validates: Requirements LI-4.2.1, LI-4.2.4**

  - [ ]* 10.3 Escrever testes unitários para `formatters.ts`
    - Testar: `format_currency(12000)` → `"R$ 12.000,00"`; `format_currency(400000)` → `"R$ 400.000,00"`; `format_score(90)` → `"90,00"`; `format_score(null)` → `"—"`; `format_date(new Date('2024-01-15T10:30:00'))` → `"15/01/2024 10:30"`
    - _Requirements: LI-4.2.1, LI-4.2.2, LI-4.1.3_

- [ ] 11. Camada `components/` — componentes de UI reutilizáveis
  - [ ] 11.1 Criar `src/components/priority_badge.tsx`
    - Implementar Server Component `PriorityBadge` com prop `priority: LeadPriority`
    - Mapear prioridade para classes Tailwind: `Alto` → badge verde (`bg-green-100 text-green-800`); `Medio` → badge amarelo (`bg-yellow-100 text-yellow-800`); `Baixo` → badge vermelho (`bg-red-100 text-red-800`); `NaoClassificado` → badge cinza (`bg-gray-100 text-gray-600`)
    - Renderizar texto: `Alto` → "Alto"; `Medio` → "Médio"; `Baixo` → "Baixo"; `NaoClassificado` → "Não classificado"
    - _Requirements: LI-3.2.1, LI-3.2.2, LI-3.2.3, LI-3.2.4, LI-2.2.4_

  - [ ] 11.2 Criar `src/components/lead_card.tsx`
    - Implementar Server Component `LeadCard` com prop `lead: Lead`
    - Exibir: Nome, E-mail, Telefone, Índice formatado com `format_score(lead.score)` e `PriorityBadge`
    - Envolver o card em link `<a href={/leads/${lead.id}>` para navegação ao detalhe
    - _Requirements: LI-3.2.5, LI-4.1.1_

  - [ ] 11.3 Criar `src/components/lead_form.tsx`
    - Implementar Client Component `LeadForm` com `'use client'`
    - Campos: Nome, E-mail, CPF, Telefone, Valor do Imóvel, Renda Mensal
    - Gerenciar estado de submissão com `useTransition` ou `useFormStatus`
    - Desabilitar botão de submissão enquanto `isPending === true`
    - Exibir erros de validação por campo (recebidos da Server Action) adjacentes ao campo, sem limpar o valor digitado
    - Incluir botão "Cancelar" que navega de volta para `/leads` sem persistir dados
    - Chamar Server Action `create_lead_action` ao submeter
    - _Requirements: LI-1.1.1, LI-1.1.4, LI-1.1.5, LI-1.2.6_

- [ ] 12. Camada `app/` — rotas e Server Actions
  - [ ] 12.1 Criar `src/app/leads/actions.ts` com Server Actions
    - Adicionar diretiva `'use server'` no topo do arquivo
    - Implementar `create_lead_action(formData: FormData)`:
      - Extrair campos do `FormData` e converter tipos (strings para numbers onde necessário)
      - Validar com `CreateLeadSchema.safeParse(data)`
      - Se inválido: retornar `{ success: false, errors: zodError.flatten().fieldErrors }`
      - Se válido: chamar `create_lead(input)` do service dentro de bloco `try/catch`
      - Se `CPF_ALREADY_EXISTS`: retornar `{ success: false, errors: { cpf: ['Este CPF já está cadastrado'] } }`
      - Se sucesso: chamar `redirect('/leads')` do Next.js
      - Em caso de erro não mapeado (bloco `catch` genérico): retornar `{ success: false, errors: { _form: ['Erro interno. Tente novamente.'] } }` e logar o erro no servidor com `console.error`
    - O redirect para `/leads` após cadastro bem-sucedido satisfaz LI-3.1.3: a lista recarregada pelo Server Component refletirá automaticamente o novo lead na posição correta da ordenação
    - _Requirements: LI-1.1.2, LI-1.1.3, LI-1.2.6, LI-1.3.4, LI-1.3.5, LI-3.1.3, LI-5.1.2, LI-5.1.3_

  - [ ] 12.2 Criar `src/app/leads/page.tsx` — lista priorizada
    - Implementar Server Component que chama `list_leads()` e renderiza a lista
    - Exibir contagem total e por classificação (Alto, Médio, Baixo, Não classificado) no topo
    - Renderizar cada lead com `LeadCard` e `PriorityBadge`
    - Exibir estado vazio com mensagem orientativa e botão "Cadastrar primeiro lead" quando lista estiver vazia
    - Exibir mensagem de erro descritiva com opção de tentar novamente em caso de falha ao carregar
    - _Requirements: LI-3.1.1, LI-3.1.3, LI-3.2.5, LI-3.2.6, LI-3.3.1, LI-3.3.2_

  - [ ] 12.3 Criar `src/app/leads/new/page.tsx` — página de cadastro
    - Implementar Server Component que renderiza o `LeadForm`
    - _Requirements: LI-1.1.1_

  - [ ] 12.4 Criar `src/app/leads/[id]/page.tsx` — página de detalhe
    - Implementar Server Component que recebe `params: { id: string }`
    - Chamar `lead_repository.find_by_id(id)`
    - Se não encontrado: chamar `notFound()` do Next.js para renderizar página 404 com link de retorno
    - Se encontrado: renderizar todos os dados do lead com formatação via `lib/formatters`:
      - `format_currency(lead.valor_imovel)` e `format_currency(lead.renda_mensal)`
      - `format_score(lead.score)`
      - `format_date(lead.created_at)`
    - Exibir `PriorityBadge` com a classificação do lead
    - Incluir link de retorno para `/leads`
    - _Requirements: LI-4.1.1, LI-4.1.2, LI-4.1.3, LI-4.1.4, LI-4.1.5, LI-4.2.1, LI-4.2.2_

  - [ ] 12.5 Criar `src/app/leads/route.ts` — API Route (opcional, para integrações futuras)
    - Implementar `GET /api/leads` que retorna `list_leads()` como JSON
    - Preparar estrutura para integrações v2+ sem implementação completa
    - _Requirements: LI-6.1.1_

- [ ] 13. Checkpoint final — integração completa
  - Garantir que todos os testes passam (`npx jest --runInBand`)
  - Verificar que o projeto compila sem erros TypeScript (`npx tsc --noEmit`)
  - Verificar que nenhum arquivo em `domain/` importa de `infra/`, `app/` ou `schemas/`
  - Verificar que `services/` é a única camada que acessa `lead_repository`
  - Verificar que todos os arquivos usam snake_case (arquivos e funções) e PascalCase (tipos e componentes)
  - Perguntar ao usuário se há dúvidas antes de considerar a implementação concluída.

---

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia os requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental a cada camada concluída
- Testes de propriedade (PBT) usam `fast-check` com mínimo de 100 iterações por propriedade
- Testes unitários cobrem casos concretos e pontos de fronteira
- A ordem das tarefas respeita as dependências entre camadas: `types` → `schemas` → `domain` → `infra` → `services` → `lib` → `components` → `app`
