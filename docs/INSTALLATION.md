# LeadImobi — Guia de Instalação

Este documento explica como preparar o ambiente e executar a API LeadImobi localmente.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito | Versão Mínima | Como Verificar |
|-----------|---------------|----------------|
| Node.js | 20.9.0 (LTS) | `node --version` |
| npm | 10.0.0 | `npm --version` |
| PostgreSQL | 12+ | `psql --version` |
| Git | 2.0+ | `git --version` |

### Instalação dos Pré-requisitos

#### macOS (com Homebrew)
```bash
# Instalar Node.js
brew install node

# Instalar PostgreSQL
brew install postgresql@15

# Iniciar PostgreSQL
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Iniciar PostgreSQL
sudo systemctl start postgresql
```

#### Windows
- Baixe Node.js em: https://nodejs.org/ (versão LTS)
- Baixe PostgreSQL em: https://www.postgresql.org/download/windows/
- Siga os instaladores padrão

---

## 🔧 Configuração do Banco de Dados

### 1. Criar Banco de Dados

Abra o terminal PostgreSQL:

```bash
psql -U postgres
```

Dentro do prompt PostgreSQL, execute:

```sql
CREATE DATABASE leadimobi;
\q
```

### 2. Verificar Conexão

```bash
psql -U postgres -d leadimobi -c "SELECT 1;"
```

Se retornar `1`, a conexão está funcionando.

---

## 📥 Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/mini-projeto-leadimob.git
cd mini-projeto-leadimob
```

---

## 📂 Acessar a Pasta do Projeto

```bash
cd mini-projeto-leadimob
```

Verifique se está no diretório correto:

```bash
ls -la
```

Você deve ver arquivos como `package.json`, `next.config.ts`, `prisma/`, etc.

---

## 📦 Instalar Dependências

```bash
npm install
```

Este comando:
- Baixa todas as dependências listadas em `package.json`
- Instala Next.js, Prisma, Zod, Tailwind CSS e outras bibliotecas
- Cria a pasta `node_modules/`

**Tempo estimado**: 2-5 minutos (depende da velocidade da internet)

---

## 🔐 Configurar Variáveis de Ambiente

### 1. Copiar Arquivo de Exemplo

```bash
cp .env.example .env
```

### 2. Editar o Arquivo `.env`

Abra o arquivo `.env` em seu editor de texto favorito:

```bash
# macOS/Linux
nano .env

# ou use seu editor favorito
code .env
```

### 3. Preencher a Variável `DATABASE_URL`

Substitua a linha:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/leadimobi?schema=public"
```

Por:

```
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/leadimobi?schema=public"
```

**Onde**:
- `postgres` — usuário padrão do PostgreSQL
- `sua_senha` — senha que você definiu ao instalar PostgreSQL
- `localhost:5432` — host e porta padrão do PostgreSQL
- `leadimobi` — nome do banco de dados criado anteriormente

### Exemplo Completo

Se você criou o banco sem senha (desenvolvimento local):

```
DATABASE_URL="postgresql://postgres@localhost:5432/leadimobi?schema=public"
```

Se você definiu uma senha:

```
DATABASE_URL="postgresql://postgres:minha_senha_segura@localhost:5432/leadimobi?schema=public"
```

---

## 🗄️ Configurar Banco de Dados

### 1. Executar Migrações

```bash
npm run setup
```

Este comando:
- Executa todas as migrações Prisma
- Cria as tabelas no banco de dados
- Gera o cliente Prisma atualizado

**Saída esperada**:
```
✔ Generated Prisma Client (v7.8.0) to ./node_modules/@prisma/client in 234ms

Running migrations to the same database that's used by Prisma introspection.

Prisma Migrate applied the following migration(s):

migrations/
  ✔ 20260507184654_init
  ✔ 20260513000000_add_cpf_field
  ✔ 20260516000331_convert_priority_to_enum

All migrations have been successfully applied.
```

### 2. Verificar Banco de Dados

```bash
npm run db:studio
```

Isso abre uma interface visual do banco em `http://localhost:5555`.

Você deve ver as tabelas:
- `leads` — Tabela principal com dados dos leads

---

## ▶️ Executar em Modo de Desenvolvimento

### Iniciar o Servidor

```bash
npm run dev
```

**Saída esperada**:
```
  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000
  - Environments: .env

✓ Ready in 2.5s
```

### Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

Você deve ver a página inicial com a lista de leads (vazia no início).

### Parar o Servidor

Pressione `Ctrl + C` no terminal.

---

## 🚀 Executar em Modo Padrão (Produção)

### 1. Build da Aplicação

```bash
npm run build
```

**Saída esperada**:
```
  ▲ Next.js 16.2.6

  ✓ Compiled successfully
  ✓ Linting and checking validity of types
  ✓ Collecting page data
  ✓ Generating static pages (3/3)
  ✓ Finalizing page optimization

Route (kind)                 Size     First Load JS
┌ ○ /                        0 B            73 kB
├ ○ /api/docs               0 B            73 kB
├ ○ /leads                  0 B            73 kB
├ ○ /leads/[id]             0 B            73 kB
├ ○ /leads/[id]/edit        0 B            73 kB
└ ○ /leads/new              0 B            73 kB

✓ Build successful
```

### 2. Iniciar o Servidor de Produção

```bash
npm run start
```

**Saída esperada**:
```
  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000

✓ Ready in 1.2s
```

### 3. Acessar a Aplicação

```
http://localhost:3000
```

---

## ✅ Validar se a API Está Funcionando

### 1. Verificar a Página Principal

Acesse no navegador:

```
http://localhost:3000
```

Você deve ver a página de leads (vazia inicialmente).

### 2. Testar a API com cURL

#### Listar Leads (deve retornar lista vazia)

```bash
curl -X GET http://localhost:3000/api/leads
```

**Resposta esperada**:
```json
{
  "success": true,
  "data": [],
  "total": 0
}
```

#### Criar um Lead de Teste

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "telefone": "11987654321",
    "valor_imovel": 400000,
    "renda_mensal": 12000
  }'
```

**Resposta esperada**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-aqui",
    "nome": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-01",
    "telefone": "(11) 98765-4321",
    "valor_imovel": 400000,
    "renda_mensal": 12000,
    "score": 90.00,
    "priority": "Alto",
    "created_at": "2026-05-19T10:30:00Z"
  }
}
```

#### Listar Leads Novamente

```bash
curl -X GET http://localhost:3000/api/leads
```

Agora deve retornar o lead criado.

### 3. Acessar a Documentação Interativa

Abra no navegador:

```
http://localhost:3000/api/docs
```

Você deve ver a interface Swagger UI com todos os endpoints documentados.

### 4. Testar com Postman ou Insomnia

Se preferir uma interface gráfica:

1. Baixe [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/download)
2. Importe a especificação OpenAPI:
   ```
   http://localhost:3000/api/openapi.json
   ```
3. Teste os endpoints diretamente

---

## 🐛 Problemas Comuns e Soluções

### Erro: `connect ECONNREFUSED 127.0.0.1:5432`

**Problema**: PostgreSQL não está rodando.

**Solução**:

```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
# Abra Services (services.msc) e inicie o PostgreSQL
```

---

### Erro: `FATAL: role "postgres" does not exist`

**Problema**: Usuário PostgreSQL não foi criado corretamente.

**Solução**:

```bash
# Verifique os usuários existentes
psql -U postgres -l

# Se não conseguir conectar, reinstale PostgreSQL
# macOS
brew uninstall postgresql@15
brew install postgresql@15

# Linux
sudo apt-get remove postgresql postgresql-contrib
sudo apt-get install postgresql postgresql-contrib
```

---

### Erro: `database "leadimobi" does not exist`

**Problema**: Banco de dados não foi criado.

**Solução**:

```bash
# Criar o banco
psql -U postgres -c "CREATE DATABASE leadimobi;"

# Verificar se foi criado
psql -U postgres -l | grep leadimobi
```

---

### Erro: `Error: P1000: Authentication failed`

**Problema**: Senha do PostgreSQL está incorreta no `.env`.

**Solução**:

1. Verifique a senha que você definiu ao instalar PostgreSQL
2. Atualize a variável `DATABASE_URL` no arquivo `.env`
3. Teste a conexão:

```bash
psql -U postgres -d leadimobi -c "SELECT 1;"
```

---

### Erro: `Port 3000 is already in use`

**Problema**: Outra aplicação está usando a porta 3000.

**Solução**:

```bash
# Encontre o processo usando a porta 3000
lsof -i :3000

# Mate o processo (macOS/Linux)
kill -9 <PID>

# Ou use uma porta diferente
PORT=3001 npm run dev
```

---

### Erro: `npm ERR! code ERESOLVE`

**Problema**: Conflito de dependências.

**Solução**:

```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstale
npm install
```

---

### Erro: `Prisma Client not found`

**Problema**: Cliente Prisma não foi gerado.

**Solução**:

```bash
npm run db:generate
```

---

### Erro: `ENOENT: no such file or directory, open '.env'`

**Problema**: Arquivo `.env` não existe.

**Solução**:

```bash
cp .env.example .env
# Edite o arquivo com suas configurações
```

---

### Aplicação Inicia mas Não Conecta ao Banco

**Problema**: Variável `DATABASE_URL` está incorreta.

**Solução**:

1. Verifique o formato da URL:
   ```
   postgresql://usuario:senha@host:porta/banco?schema=public
   ```

2. Teste a conexão manualmente:
   ```bash
   psql postgresql://usuario:senha@localhost:5432/leadimobi
   ```

3. Se funcionar, a URL está correta. Atualize o `.env` e reinicie.

---

### Erro: `EACCES: permission denied`

**Problema**: Permissões insuficientes.

**Solução**:

```bash
# Corrija as permissões
sudo chown -R $USER:$USER .

# Ou use sudo (não recomendado)
sudo npm install
```

---

### Testes Falhando

**Problema**: Banco de testes não está configurado.

**Solução**:

```bash
# Certifique-se de que o banco principal está funcionando
npm run test

# Se ainda falhar, limpe e reconfigure
npm run db:reset
npm run setup
npm run test
```

---

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. **Explore a Interface**
   - Acesse `http://localhost:3000`
   - Crie alguns leads de teste
   - Veja o cálculo automático do score

2. **Teste a API**
   - Acesse `http://localhost:3000/api/docs`
   - Teste os endpoints no Swagger UI

3. **Leia a Documentação**
   - `README.md` — Visão geral do projeto
   - `docs/PRD.md` — Requisitos do produto
   - `docs/uml_use_cases.md` — Casos de uso

4. **Execute os Testes**
   ```bash
   npm run test
   ```

5. **Explore o Código**
   - Estrutura em `src/`
   - Regras de negócio em `src/domain/`
   - Serviços em `src/services/`

---

## 🆘 Suporte

Se encontrar problemas não listados aqui:

1. Verifique os logs do servidor (terminal onde rodou `npm run dev`)
2. Consulte a documentação do [Next.js](https://nextjs.org/docs)
3. Consulte a documentação do [Prisma](https://www.prisma.io/docs/)
4. Abra uma issue no repositório

---

## ✨ Dicas Úteis

### Modo Watch para Testes

```bash
npm run test:watch
```

Executa testes automaticamente quando você salva arquivos.

### Visualizar Banco de Dados

```bash
npm run db:studio
```

Abre interface visual em `http://localhost:5555`.

### Resetar Banco (Desenvolvimento)

```bash
npm run db:reset
```

⚠️ **Cuidado**: Isso deleta todos os dados!

### Linting Automático

```bash
npm run lint:fix
```

Corrige automaticamente problemas de código.

### Build Otimizado

```bash
npm run build
```

Cria versão otimizada para produção em `.next/`.

---

**Pronto para começar! 🚀**

Se tudo funcionou, você agora tem a API LeadImobi rodando localmente.
