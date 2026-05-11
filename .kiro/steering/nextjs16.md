# Next.js 16 — Regras e Mudanças Importantes

## Versão atual do projeto
**Next.js 16.2.6** (estável) — versão mínima exigida neste projeto.

---

## Requisitos de ambiente

| Requisito     | Versão mínima         |
|---------------|-----------------------|
| Node.js       | 20.9.0 (LTS)          |
| TypeScript    | 5.1.0                 |
| Browsers      | Chrome/Edge/Firefox 111+, Safari 16.4+ |

---

## Breaking Changes obrigatórios

### 1. APIs de Request são assíncronas (CRÍTICO)

`params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` **não podem mais ser acessados de forma síncrona**.

```ts
// ❌ ERRADO — Next.js 15 e anterior
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id
}

// ✅ CORRETO — Next.js 16
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

```ts
// ❌ ERRADO
const cookieStore = cookies()

// ✅ CORRETO
const cookieStore = await cookies()
```

Usar `npx next typegen` para gerar os tipos `PageProps`, `LayoutProps`, `RouteContext` automaticamente.

---

### 2. `middleware.ts` renomeado para `proxy.ts`

- `middleware.ts` está **deprecated** — renomear para `proxy.ts`
- A função exportada deve se chamar `proxy` (não `middleware`)
- O runtime é **Node.js** (não Edge) — se precisar de Edge, manter `middleware.ts` temporariamente
- Flags de config renomeadas: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`

```ts
// ✅ proxy.ts
export function proxy(request: Request) {
  // lógica de interceptação
}
```

---

### 3. Turbopack é o bundler padrão

- `next dev` e `next build` usam Turbopack por padrão
- Para manter Webpack: `next build --webpack`
- Configuração `experimental.turbopack` movida para nível raiz `turbopack`

```ts
// next.config.ts
const config = {
  turbopack: {
    // configurações Turbopack
  }
}
```

- Tilde (`~`) em imports Sass **não é suportado** no Turbopack — remover prefixo

---

### 4. Partial Prerendering (PPR) — novo modelo

- Flag `experimental.ppr` **removida**
- `experimental_ppr` em route segments **removido**
- Substituído por `cacheComponents`:

```ts
// next.config.ts
const config = {
  cacheComponents: true
}
```

---

### 5. `serverRuntimeConfig` e `publicRuntimeConfig` removidos

Usar variáveis de ambiente:

```ts
// ❌ REMOVIDO
serverRuntimeConfig: { mySecret: 'secret' }

// ✅ CORRETO — Server Component
const value = process.env.MY_SECRET

// ✅ CORRETO — Client (prefixo NEXT_PUBLIC_)
const value = process.env.NEXT_PUBLIC_MY_VALUE
```

---

### 6. Parallel Routes exigem `default.js` explícito

Todos os slots de parallel routes precisam de `default.js`. Build falha sem ele.

```ts
// app/@modal/default.js
export default function Default() {
  return null
}
```

---

### 7. `next/image` — mudanças de defaults

| Configuração            | Antes         | Agora         |
|-------------------------|---------------|---------------|
| `minimumCacheTTL`       | 60s           | 14400s (4h)   |
| `imageSizes` default    | inclui 16px   | sem 16px      |
| `qualities` default     | todos valores | apenas `[75]` |
| `maximumRedirects`      | ilimitado     | 3             |
| Local IP optimization   | permitido     | bloqueado por padrão |

- `next/legacy/image` **deprecated** — usar `next/image`
- `images.domains` **deprecated** — usar `images.remotePatterns`
- Imagens locais com query strings requerem `images.localPatterns.search`

---

### 8. `next lint` removido

- Comando `next lint` **removido**
- `next build` não executa mais linting automaticamente
- Usar ESLint ou Biome diretamente

---

### 9. `devIndicators` — opções removidas

Removidos de `devIndicators`: `appIsrStatus`, `buildActivity`, `buildActivityPosition`.

---

### 10. `experimental.dynamicIO` renomeado

```ts
// ❌ ANTES
experimental: { dynamicIO: true }

// ✅ AGORA
cacheComponents: true
```

---

## Novas APIs de Cache

### `revalidateTag()` — agora exige segundo argumento

```ts
// ❌ DEPRECATED (single argument)
revalidateTag('posts')

// ✅ CORRETO
revalidateTag('posts', 'max')
```

### `updateTag()` — nova API (Server Actions only)

Semântica read-your-writes: expira e recarrega dados imediatamente na mesma request.

```ts
import { updateTag } from 'next/cache'

async function submitForm() {
  'use server'
  await saveData()
  updateTag('user-data')
}
```

### `refresh()` — nova API (Server Actions only)

Atualiza dados não cacheados sem tocar no cache.

```ts
import { refresh } from 'next/cache'

async function refreshData() {
  'use server'
  refresh()
}
```

---

## React 19.2 (incluído no Next.js 16)

Novidades disponíveis:

- **View Transitions** — animar elementos em navegações
- **`useEffectEvent`** — extrair lógica não-reativa de Effects
- **`<Activity>`** — renderizar UI em background com `display: none` mantendo estado

---

## React Compiler (estável)

Memoização automática de componentes sem código manual.

```ts
// next.config.ts
const config = {
  reactCompiler: true // não habilitado por padrão
}
```

⚠️ Aumenta tempo de build pois depende de Babel. Habilitar apenas quando necessário.

---

## Turbopack File System Caching (beta)

Cache de artefatos em disco entre reinicializações — acelera compilações em projetos grandes.

```ts
// next.config.ts
const config = {
  turbopack: {
    persistentCaching: true
  }
}
```

---

## Melhorias de Roteamento

- **Layout deduplication**: layout compartilhado baixado uma vez ao prefetchar múltiplos links
- **Incremental prefetching**: prefetch apenas do que não está em cache
- Sem mudanças de código necessárias — melhoria automática de performance

---

## Diretórios separados para dev e build

- `next dev` → `.next/dev`
- `next build` → `.next/` (padrão)
- Permite execução concorrente de dev e build

---

## ESLint Flat Config

`@next/eslint-plugin-next` agora usa ESLint Flat Config por padrão (alinhado com ESLint v10).

---

## Resumo de migrações rápidas

| O que fazer                          | Comando / Ação                              |
|--------------------------------------|---------------------------------------------|
| Upgrade automático                   | `npx @next/codemod@latest upgrade`          |
| Gerar tipos async params             | `npx next typegen`                          |
| Migrar next lint → ESLint CLI        | `npx @next/codemod@canary next-lint-to-eslint-cli .` |
| Renomear middleware → proxy          | Renomear arquivo e função exportada         |
| Remover experimental.ppr             | Substituir por `cacheComponents: true`      |
