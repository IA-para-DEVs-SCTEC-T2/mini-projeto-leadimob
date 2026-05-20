# Implementation Plan: Autenticação de Corretores — LeadImobi

## Overview

Implementação de autenticação mínima com next-auth v5 (`CredentialsProvider`), cadastro e login de corretores, proteção de rotas via `proxy.ts`, e isolamento de leads por corretor. Segue a arquitetura em camadas existente do projeto.

**Stack:** Next.js 16, next-auth v5 (beta), bcryptjs, Prisma, PostgreSQL, Zod, TypeScript strict

**Status:** A maior parte da infraestrutura de autenticação já foi implementada. As tarefas restantes focam na integração final e componentes de UI.

---

## Tasks

- [x] 1. Instalar dependências e configurar next-auth
  - [x] 1.1 Instalar next-auth v5 e bcryptjs
    - Executar `npm install next-auth@beta bcryptjs`
    - Executar `npm install --save-dev @types/bcryptjs`
    - Verificar que as dependências foram adicionadas ao `package.json`
    - _Requirements: AC-2.2.1_

  - [ ] 1.2 Configurar variáveis de ambiente para next-auth
    - Verificar se `AUTH_SECRET` existe no `.env` (gerar com `npx auth secret` se necessário)
    - Adicionar `AUTH_SECRET` ao `.env.example` com valor placeholder se não existir
    - _Requirements: AC-2.2.2, AC-2.2.4_

- [x] 2. Banco de dados — model Corretor e ajuste em Lead
  - [x] 2.1 Atualizar schema Prisma com model Corretor e FK em Lead
    - Model `Corretor` já existe com todos os campos necessários
    - Campo `corretor_id` já adicionado ao model `Lead` com relação
    - `@unique` removido de `email` e `cpf` em `Lead`
    - `@@unique([cpf, corretor_id])` já configurado em `Lead`
    - _Requirements: AC-1.3.1, AC-1.3.2, AC-4.1.1_

  - [x] 2.2 Migration já executada
    - Migration `add_corretor_auth` já aplicada
    - Cliente Prisma já gerado
    - _Requirements: AC-1.3.1, AC-4.1.1_

- [x] 3. Camada `types/` — tipos de Corretor e extensão do next-auth
  - [x] 3.1 Tipos de corretor já criados
    - `src/types/corretor.ts` já existe com todas as interfaces necessárias
    - _Requirements: AC-1.3.1_

  - [x] 3.2 Extensão de tipos do next-auth já criada
    - `src/types/next-auth.d.ts` já existe com extensões necessárias
    - _Requirements: AC-2.2.3_

- [x] 4. Camada `schemas/` — validação de corretor
  - [x] 4.1 Schemas de validação já criados
    - `src/schemas/corretor.schema.ts` já existe com `RegisterSchema` e `LoginSchema`
    - _Requirements: AC-1.2.1, AC-1.2.2, AC-1.2.3_

- [x] 5. Camada `infra/` — repositório de corretor
  - [x] 5.1 Repositório de corretor já implementado
    - `src/infra/repositories/corretor_repository.ts` já existe com todos os métodos
    - _Requirements: AC-1.3.1, AC-1.3.2, AC-1.3.3_

- [ ] 6. Camada `infra/` — ajustar lead_repository para isolamento por corretor
  - [ ] 6.1 Atualizar `src/infra/repositories/lead_repository.ts`
    - Verificar se `corretor_id` está sendo usado em todos os métodos
    - Atualizar `find_all(corretor_id: string)` para filtrar por `corretor_id`
    - Atualizar `find_by_id(id: string, corretor_id: string)` para incluir `corretor_id` no WHERE
    - Atualizar `update(id: string, corretor_id: string, data)` para incluir `corretor_id` no WHERE
    - Atualizar `delete(id: string, corretor_id: string)` para incluir `corretor_id` no WHERE
    - _Requirements: AC-4.1.2, AC-4.1.3, AC-4.1.4, AC-4.1.5_

- [x] 7. Camada `services/` — service de criação de corretor
  - [x] 7.1 Service de corretor já implementado
    - `src/services/create_corretor.ts` já existe
    - _Requirements: AC-1.2.5, AC-1.3.1_

- [ ] 8. Camada `services/` — ajustar services de lead para receber corretor_id
  - [ ] 8.1 Verificar `src/services/create_lead.ts`
    - Confirmar que aceita parâmetro `corretor_id: string`
    - Verificar se passa `corretor_id` para `repository.create(data)`
    - _Requirements: AC-4.1.2_

  - [ ] 8.2 Verificar `src/services/list_leads.ts`
    - Confirmar que aceita parâmetro `corretor_id: string`
    - Verificar se passa `corretor_id` para `repository.find_all(corretor_id)`
    - _Requirements: AC-4.1.3_

  - [ ] 8.3 Verificar `src/services/update_lead.ts`
    - Confirmar que aceita parâmetro `corretor_id: string`
    - Verificar se passa `corretor_id` para `repository.update(id, corretor_id, data)`
    - _Requirements: AC-4.1.4_

  - [ ] 8.4 Verificar `src/services/delete_lead.ts`
    - Confirmar que aceita parâmetro `corretor_id: string`
    - Verificar se passa `corretor_id` para `repository.delete(id, corretor_id)`
    - _Requirements: AC-4.1.4_

- [x] 9. Camada `lib/` — configuração do next-auth e helper de sessão
  - [x] 9.1 Configuração do next-auth já implementada
    - `src/lib/auth.ts` já existe com configuração completa
    - _Requirements: AC-2.2.1, AC-2.2.2, AC-2.2.3, AC-2.2.4, AC-2.2.5_

  - [x] 9.2 Helper de sessão já implementado
    - `src/lib/session.ts` já existe
    - _Requirements: AC-3.1.1_

- [x] 10. Rota de handlers do next-auth
  - [x] 10.1 Verificar `src/app/api/auth/[...nextauth]/route.ts`
    - Confirmar que importa `handlers` de `@/lib/auth`
    - Confirmar que exporta `GET` e `POST` dos handlers
    - _Requirements: AC-2.2.1_

- [x] 11. Proteção de rotas — proxy.ts
  - [x] 11.1 Implementar proteção de rotas no `proxy.ts`
    - Importar `auth` de `@/lib/auth`
    - Implementar função `proxy` que:
      - Para rotas `/leads/*`: redireciona para `/auth/login` se não autenticado
      - Para rotas `/auth/*`: redireciona para `/leads` se já autenticado
    - Configurar `matcher` para `['/leads/:path*', '/auth/:path*']`
    - _Requirements: AC-3.1.1, AC-3.1.2, AC-3.1.3, AC-3.1.4_

- [x] 12. Componentes de UI — autenticação
  - [x] 12.1 Criar `src/components/register_form.tsx` — Client Component
    - Campos: Nome, E-mail, Senha
    - Gerenciar estado com `useTransition`
    - Chamar Server Action `register_action` ao submeter
    - Exibir erros por campo sem limpar valores
    - Desabilitar botão durante `isPending`
    - Link para `/auth/login`
    - _Requirements: AC-1.1.1, AC-1.1.3, AC-1.1.4, AC-1.1.5_

  - [x] 12.2 Criar `src/components/login_form.tsx` — Client Component
    - Campos: E-mail, Senha
    - Chamar `signIn('credentials', { email, senha, redirectTo: '/leads' })` ao submeter
    - Exibir mensagem de erro genérica em caso de falha (`"Credenciais inválidas. Verifique e tente novamente."`)
    - Desabilitar botão durante submissão
    - Link para `/auth/register`
    - _Requirements: AC-2.1.1, AC-2.1.3, AC-2.1.4, AC-2.1.5_

  - [x] 12.3 Criar `src/components/logout_button.tsx` — Client Component
    - Botão que chama `signOut({ redirectTo: '/auth/login' })`
    - Receber prop `nome: string` para exibir o nome do corretor
    - _Requirements: AC-5.1.1, AC-5.1.2, AC-5.1.3_

- [x] 13. Camada `app/` — páginas de autenticação
  - [x] 13.1 Criar `src/app/auth/register/page.tsx`
    - Server Component que renderiza `RegisterForm`
    - _Requirements: AC-1.1.1_

  - [x] 13.2 Criar `src/app/auth/login/page.tsx`
    - Server Component que renderiza `LoginForm`
    - _Requirements: AC-2.1.1_

  - [x] 13.3 Criar `src/app/auth/actions.ts` — Server Action de cadastro
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
- [x] 14. Camada `app/` — atualizar Server Actions de leads para usar sessão
  - [x] 14.1 Atualizar `src/app/leads/actions.ts`
    - Importar `get_session` de `@/lib/session`
    - Em `create_lead_action`: chamar `get_session()` para obter `corretor_id`, passar para `create_lead(repository, input, corretor_id)`
    - Em `update_lead_action`: chamar `get_session()`, passar `corretor_id` para `update_lead(repository, id, input, corretor_id)`
    - Em `delete_lead_action`: chamar `get_session()`, passar `corretor_id` para `delete_lead(repository, id, corretor_id)`
    - _Requirements: AC-4.1.2, AC-4.1.4_

- [x] 15. Camada `app/` — atualizar páginas de leads para usar sessão
  - [x] 15.1 Atualizar `src/app/leads/page.tsx`
    - Chamar `get_session()` para obter `corretor_id` e `nome`
    - Passar `corretor_id` para `list_leads(repository, corretor_id)`
    - Renderizar `LogoutButton` com `nome` do corretor no header/layout
    - _Requirements: AC-4.1.3, AC-5.1.3_

  - [x] 15.2 Atualizar `src/app/leads/[id]/page.tsx`
    - Chamar `get_session()` para obter `corretor_id`
    - Passar `corretor_id` para `lead_repository.find_by_id(id, corretor_id)`
    - Se retornar `null`: chamar `notFound()`
    - _Requirements: AC-4.1.4, AC-4.1.5_

  - [x] 15.3 Atualizar `src/app/leads/[id]/edit/page.tsx`
    - Chamar `get_session()` para obter `corretor_id`
    - Passar `corretor_id` para `lead_repository.find_by_id(id, corretor_id)`
    - Se retornar `null`: chamar `notFound()`
    - _Requirements: AC-4.1.4, AC-4.1.5_

- [x] 16. Checkpoint final — verificação e testes
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
    { "id": 0, "tasks": ["1.2"] },
    { "id": 1, "tasks": ["6.1", "8.1", "8.2", "8.3", "8.4"] },
    { "id": 2, "tasks": ["10.1", "11.1"] },
    { "id": 3, "tasks": ["12.1", "12.2", "12.3"] },
    { "id": 4, "tasks": ["13.1", "13.2", "13.3"] },
    { "id": 5, "tasks": ["14.1"] },
    { "id": 6, "tasks": ["15.1", "15.2", "15.3"] },
    { "id": 7, "tasks": ["16"] }
  ]
}
```

## Notes

- **Status atual:** A maior parte da infraestrutura de autenticação já foi implementada
- `next-auth@beta` é a versão v5, compatível com Next.js 16 App Router
- A migration `add_corretor_auth` já foi aplicada
- `corretor_id` nunca vem do cliente — sempre extraído da sessão no servidor
- Mensagens de erro de login/cadastro são intencionalmente genéricas (segurança)
- O campo `email` do `Lead` deixa de ser `@unique` global — dois corretores podem ter leads com o mesmo email de cliente
- Foco nas tarefas restantes: integração final, componentes de UI e proteção de rotas

## Próximos Passos

1. **Verificar configuração de ambiente** (task 1.2)
2. **Ajustar repositórios e services** para isolamento por corretor (tasks 6.1, 8.x)
3. **Implementar proteção de rotas** no proxy.ts (task 11.1)
4. **Criar componentes de UI** para login/registro (tasks 12.x)
5. **Criar páginas de autenticação** (tasks 13.x)
6. **Integrar sessão nas páginas de leads** (tasks 14.1, 15.x)
7. **Testes finais** (task 16)