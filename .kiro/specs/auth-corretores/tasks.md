# Implementation Plan: Autenticação de Corretores — LeadImobi

## Overview

Implementação de autenticação mínima com next-auth v5 (`CredentialsProvider`), cadastro e login de corretores, proteção de rotas via `proxy.ts`, e isolamento de leads por corretor. Segue a arquitetura em camadas existente do projeto.

**Stack:** Next.js 16, next-auth v5 (beta), bcryptjs, Prisma, PostgreSQL, Zod, TypeScript strict

---

## Tasks

- [x] 1. Instalar dependências e configurar next-auth
  - [x] 1.1 Instalar next-auth v5 e bcryptjs
    - Executar `npm install next-auth@beta bcryptjs`
    - Executar `npm install --save-dev @types/bcryptjs`
    - Verificar que as dependências foram adicionadas ao `package.json`
    - _Requirements: AC-2.2.1_

  - [x] 1.2 Criar variáveis de ambiente para next-auth
    - Adicionar `AUTH_SECRET` ao `.env` (gerar com `npx auth secret` ou valor aleatório seguro)
    - Adicionar `AUTH_SECRET` ao `.env.example` com valor placeholder
    - _Requirements: AC-2.2.2, AC-2.2.4_

- [x] 2. Banco de dados — model Corretor e ajuste em Lead
  - [x] 2.1 Atualizar schema Prisma com model Corretor e FK em Lead
    - Adicionar model `Corretor` com campos: `id` (cuid), `nome`, `email` (@unique), `password_hash`, `created_at` (now), `leads Lead[]`, `@@map("corretores")`
    - Adicionar campo `corretor_id String` e relação `corretor Corretor @relation(...)` ao model `Lead`
    - Remover `@unique` de `email` e `cpf` em `Lead` (não são mais únicos globalmente)
    - Adicionar `@@unique([cpf, corretor_id])` em `Lead` (CPF único por corretor)
    - _Requirements: AC-1.3.1, AC-1.3.2, AC-4.1.1_

  - [x] 2.2 Criar e executar migration
    - Executar `npx prisma migrate dev --name add_corretor_auth`
    - Verificar que a migration foi criada em `prisma/migrations/`
    - Executar `npx prisma generate` para atualizar o cliente gerado
    - _Requirements: AC-1.3.1, AC-4.1.1_

- [x] 3. Camada `types/` — tipos de Corretor e extensão do next-auth
  - [x] 3.1 Criar `src/types/corretor.ts`
    - Definir `interface Corretor` com campos: `id`, `nome`, `email`, `created_at`
    - Definir `interface CorretorWithHash extends Corretor` com campo `password_hash`
    - Definir `interface CreateCorretorInput` com campos: `nome`, `email`, `senha`
    - Sem dependências de Prisma, Zod ou next-auth
    - _Requirements: AC-1.3.1_

  - [x] 3.2 Criar `src/types/next-auth.d.ts` — extensão de tipos do next-auth
    - Declarar módulo `next-auth` estendendo `Session.user` com campo `corretor_id: string`
    - Declarar módulo `next-auth/jwt` estendendo `JWT` com campo `corretor_id?: string`
    - _Requirements: AC-2.2.3_

- [x] 4. Camada `schemas/` — validação de corretor
  - [x] 4.1 Criar `src/schemas/corretor.schema.ts`
    - Definir `RegisterSchema` com `z.object()`: `nome` (min 2, max 100), `email` (email), `senha` (min 8)
    - Definir `LoginSchema` com `z.object()`: `email` (email), `senha` (min 1)
    - Exportar tipos `RegisterInput` e `LoginInput` via `z.infer<>`
    - _Requirements: AC-1.2.1, AC-1.2.2, AC-1.2.3_

- [ ] 5. Camada `infra/` — repositório de corretor
  - [x] 5.1 Criar `src/infra/repositories/corretor_repository.ts`
    - Implementar `corretor_repository` com métodos:
      - `create(data: { nome: string; email: string; password_hash: string }): Promise<Corretor>`
      - `find_by_email(email: string): Promise<CorretorWithHash | null>`
      - `find_by_id(id: string): Promise<Corretor | null>`
    - Capturar erro Prisma `P2002` (email duplicado) e lançar `{ error: 'EMAIL_ALREADY_EXISTS' }`
    - Capturar erros de conexão e lançar `{ error: 'DATABASE_UNAVAILABLE' }`
    - Nunca retornar `password_hash` nos métodos `find_by_id` e `create` (apenas em `find_by_email` para uso interno do authorize)
    - _Requirements: AC-1.3.1, AC-1.3.2, AC-1.3.3_

- [ ] 6. Camada `infra/` — ajustar lead_repository para isolamento por corretor
  - [ ] 6.1 Atualizar `src/infra/repositories/lead_repository.ts`
    - Adicionar `corretor_id: string` ao tipo `CreateLeadData`
    - Atualizar `create` para incluir `corretor_id` no INSERT
    - Atualizar `find_all(corretor_id: string)` para filtrar por `corretor_id` no WHERE
    - Atualizar `find_by_id(id: string, corretor_id: string)` para incluir `corretor_id` no WHERE
    - Atualizar `update(id: string, corretor_id: string, data)` para incluir `corretor_id` no WHERE
    - Atualizar `delete(id: string, corretor_id: string)` para incluir `corretor_id` no WHERE
    - _Requirements: AC-4.1.2, AC-4.1.3, AC-4.1.4, AC-4.1.5_

- [ ] 7. Camada `services/` — service de criação de corretor
  - [ ] 7.1 Criar `src/services/create_corretor.ts`
    - Implementar `async function create_corretor(repository, input: CreateCorretorInput): Promise<Corretor>`
    - Fazer hash da senha: `bcrypt.hash(input.senha, 10)`
    - Chamar `repository.create({ nome, email, password_hash })`
    - Propagar `EMAIL_ALREADY_EXISTS` sem transformação
    - _Requirements: AC-1.2.5, AC-1.3.1_

- [ ] 8. Camada `services/` — ajustar services de lead para receber corretor_id
  - [ ] 8.1 Atualizar `src/services/create_lead.ts`
    - Adicionar parâmetro `corretor_id: string` à função
    - Passar `corretor_id` para `repository.create(data)`
    - _Requirements: AC-4.1.2_

  - [ ] 8.2 Atualizar `src/services/list_leads.ts`
    - Adicionar parâmetro `corretor_id: string` à função
    - Passar `corretor_id` para `repository.find_all(corretor_id)`
    - _Requirements: AC-4.1.3_

  - [ ] 8.3 Atualizar `src/services/update_lead.ts`
    - Adicionar parâmetro `corretor_id: string` à função
    - Passar `corretor_id` para `repository.update(id, corretor_id, data)`
    - _Requirements: AC-4.1.4_

  - [ ] 8.4 Atualizar `src/services/delete_lead.ts`
    - Adicionar parâmetro `corretor_id: string` à função
    - Passar `corretor_id` para `repository.delete(id, corretor_id)`
    - _Requirements: AC-4.1.4_

- [ ] 9. Camada `lib/` — configuração do next-auth e helper de sessão
  - [ ] 9.1 Criar `src/lib/auth.ts` — configuração central do next-auth
    - Configurar `NextAuth` com `CredentialsProvider`
    - Implementar `authorize`: busca corretor por email, compara senha com bcrypt, retorna `{ id, name, email }` ou `null`
    - Implementar callback `jwt`: adiciona `corretor_id` ao token quando `user` está presente
    - Implementar callback `session`: adiciona `corretor_id` ao `session.user` a partir do token
    - Configurar `pages.signIn: '/auth/login'`
    - Configurar `session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }`
    - Exportar `{ handlers, auth, signIn, signOut }`
    - _Requirements: AC-2.2.1, AC-2.2.2, AC-2.2.3, AC-2.2.4, AC-2.2.5_

  - [ ] 9.2 Criar `src/lib/session.ts` — helper de sessão para Server Components
    - Implementar `async function get_session()` que chama `auth()` e redireciona para `/auth/login` se não autenticado
    - Retornar a sessão tipada com `corretor_id`
    - _Requirements: AC-3.1.1_

- [ ] 10. Rota de handlers do next-auth
  - [ ] 10.1 Criar `src/app/api/auth/[...nextauth]/route.ts`
    - Importar `handlers` de `@/lib/auth`
    - Exportar `GET` e `POST` dos handlers
    - _Requirements: AC-2.2.1_

- [ ] 11. Proteção de rotas — proxy.ts
  - [ ] 11.1 Atualizar `proxy.ts` na raiz do projeto
    - Importar `auth` de `@/lib/auth`
    - Implementar função `proxy` que:
      - Para rotas `/leads/*`: redireciona para `/auth/login` se não autenticado
      - Para rotas `/auth/*`: redireciona para `/leads` se já autenticado
    - Configurar `matcher` para `['/leads/:path*', '/auth/:path*']`
    - _Requirements: AC-3.1.1, AC-3.1.2, AC-3.1.3, AC-3.1.4_

- [ ] 12. Componentes de UI — autenticação
  - [ ] 12.1 Criar `src/components/register_form.tsx` — Client Component
    - Campos: Nome, E-mail, Senha
    - Gerenciar estado com `useTransition`
    - Chamar Server Action `register_action` ao submeter
    - Exibir erros por campo sem limpar valores
    - Desabilitar botão durante `isPending`
    - Link para `/auth/login`
    - _Requirements: AC-1.1.1, AC-1.1.3, AC-1.1.4, AC-1.1.5_

  - [ ] 12.2 Criar `src/components/login_form.tsx` — Client Component
    - Campos: E-mail, Senha
    - Chamar `signIn('credentials', { email, senha, redirectTo: '/leads' })` ao submeter
    - Exibir mensagem de erro genérica em caso de falha (`"Credenciais inválidas. Verifique e tente novamente."`)
    - Desabilitar botão durante submissão
    - Link para `/auth/register`
    - _Requirements: AC-2.1.1, AC-2.1.3, AC-2.1.4, AC-2.1.5_

  - [ ] 12.3 Criar `src/components/logout_button.tsx` — Client Component
    - Botão que chama `signOut({ redirectTo: '/auth/login' })`
    - Receber prop `nome: string` para exibir o nome do corretor
    - _Requirements: AC-5.1.1, AC-5.1.2, AC-5.1.3_

- [ ] 13. Camada `app/` — páginas de autenticação
  - [ ] 13.1 Criar `src/app/auth/register/page.tsx`
    - Server Component que renderiza `RegisterForm`
    - _Requirements: AC-1.1.1_

  - [ ] 13.2 Criar `src/app/auth/login/page.tsx`
    - Server Component que renderiza `LoginForm`
    - _Requirements: AC-2.1.1_

  - [ ] 13.3 Criar `src/app/auth/actions.ts` — Server Action de cadastro
    - Adicionar diretiva `'use server'`
    - Implementar `register_action(formData: FormData)`:
      - Extrair `nome`, `email`, `senha` do FormData
      - Validar com `RegisterSchema.safeParse(data)`
      - Se inválido: retornar `{ success: false, errors: zodError.flatten().fieldErrors }`
      - Se válido: chamar `create_corretor(corretor_repository, input)` em try/catch
      - Se `EMAIL_ALREADY_EXISTS`: retornar `{ success: false, errors: { _form: ['Não foi possível criar a conta. Verifique os dados e tente novamente.'] } }`
      - Se sucesso: `redirect('/auth/login')`
      - Erro genérico: retornar `{ success: false, errors: { _form: ['Erro interno. Tente novamente.'] } }` e logar
    - _Requirements: AC-1.1.2, AC-1.2.4, AC-1.3.3_

- [ ] 14. Camada `app/` — atualizar Server Actions de leads para usar sessão
  - [ ] 14.1 Atualizar `src/app/leads/actions.ts`
    - Importar `get_session` de `@/lib/session`
    - Em `create_lead_action`: chamar `get_session()` para obter `corretor_id`, passar para `create_lead(repository, input, corretor_id)`
    - Em `update_lead_action`: chamar `get_session()`, passar `corretor_id` para `update_lead(repository, id, input, corretor_id)`
    - Em `delete_lead_action`: chamar `get_session()`, passar `corretor_id` para `delete_lead(repository, id, corretor_id)`
    - _Requirements: AC-4.1.2, AC-4.1.4_

- [ ] 15. Camada `app/` — atualizar páginas de leads para usar sessão
  - [ ] 15.1 Atualizar `src/app/leads/page.tsx`
    - Chamar `get_session()` para obter `corretor_id` e `nome`
    - Passar `corretor_id` para `list_leads(repository, corretor_id)`
    - Renderizar `LogoutButton` com `nome` do corretor no header/layout
    - _Requirements: AC-4.1.3, AC-5.1.3_

  - [ ] 15.2 Atualizar `src/app/leads/[id]/page.tsx`
    - Chamar `get_session()` para obter `corretor_id`
    - Passar `corretor_id` para `lead_repository.find_by_id(id, corretor_id)`
    - Se retornar `null`: chamar `notFound()`
    - _Requirements: AC-4.1.4, AC-4.1.5_

  - [ ] 15.3 Atualizar `src/app/leads/[id]/edit/page.tsx`
    - Chamar `get_session()` para obter `corretor_id`
    - Passar `corretor_id` para `lead_repository.find_by_id(id, corretor_id)`
    - Se retornar `null`: chamar `notFound()`
    - _Requirements: AC-4.1.4, AC-4.1.5_

- [ ] 16. Checkpoint final — verificação e testes
  - Verificar que o projeto compila sem erros TypeScript (`npx tsc --noEmit`)
  - Verificar que a migration foi aplicada corretamente
  - Testar manualmente: cadastro → login → criar lead → ver apenas leads próprios → logout
  - Verificar que acessar `/leads` sem sessão redireciona para `/auth/login`
  - Verificar que acessar `/auth/login` com sessão ativa redireciona para `/leads`

---

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3", "4"] },
    { "wave": 4, "tasks": ["5", "6", "7", "8"] },
    { "wave": 5, "tasks": ["9"] },
    { "wave": 6, "tasks": ["10", "11", "12"] },
    { "wave": 7, "tasks": ["13"] },
    { "wave": 8, "tasks": ["14", "15"] },
    { "wave": 9, "tasks": ["16"] }
  ]
}
```

## Notes

- `next-auth@beta` é a versão v5, compatível com Next.js 16 App Router
- A migration `add_corretor_auth` é destrutiva para dados existentes em dev — usar `prisma migrate reset` se necessário
- `corretor_id` nunca vem do cliente — sempre extraído da sessão no servidor
- Mensagens de erro de login/cadastro são intencionalmente genéricas (segurança)
- O campo `email` do `Lead` deixa de ser `@unique` global — dois corretores podem ter leads com o mesmo email de cliente
