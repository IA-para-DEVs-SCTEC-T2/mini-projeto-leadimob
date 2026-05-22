# LeadImobi — Guia de Instalação

Este documento explica como preparar o ambiente e executar o LeadImobi localmente.

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

Este comando instala Next.js, Prisma, NextAuth.js, bcryptjs, Zod, Tailwind CSS e todas as outras dependências.

**Tempo estimado**: 2-5 minutos (depende da velocidade da internet)

> Este comando:
> - Baixa todas as dependências listadas em `package.json`
> - Instala Next.js, Prisma, Zod, Tailwind CSS e outras bibliotecas
> - Cria a pasta `node_modules/`

---

## 🔐 Configurar Variáveis de Ambiente

### 1. Copiar Arquivo de Exemplo

```bash
cp .env.example .env
```

### 2. Editar o Arquivo `.env`

```bash
# macOS/Linux
nano .env

# ou use seu editor favorito
code .env
```

### 3. Preencher as Variáveis

```env
# Conexão com o banco de dados PostgreSQL
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/leadimobi?schema=public"

# Chave secreta para assinar tokens JWT (NextAuth.js)
# Gere uma chave segura com: openssl rand -base64 32
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# URL base da aplicação
NEXTAUTH_URL="http://localhost:3000"
```

#### Gerar `NEXTAUTH_SECRET`

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

> ⚠️ **Importante**: `NEXTAUTH_SECRET` é obrigatório. Sem ele, a autenticação não funcionará.

#### Exemplo Completo de `.env`

```env
DATABASE_URL="postgresql://postgres:minha_senha@localhost:5432/leadimobi?schema=public"
NEXTAUTH_SECRET="K7xP2mN9qR4vL8wJ3hF6yT1cB5nA0eD"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🗄️ Configurar Banco de Dados

### 1. Executar Migrações

```bash
npm run setup
```

Este comando:
- Executa todas as migrações Prisma
- Cria as tabelas `corretores` e `leads` no banco de dados
- Gera o cliente Prisma atualizado

**Saída esperada**:
```
✔ Generated Prisma Client (v7.x.x) to ./node_modules/@prisma/client

Running migrations...

Prisma Migrate applied the following migration(s):

migrations/
  ✔ 20260507184654_init
  ✔ 20260513000000_add_cpf_field
  ✔ 20260516000331_convert_priority_to_enum
  ✔ 20260517230645_add_corretor_auth
  ✔ 20260521000119_add_telefone_corretor

All migrations have been successfully applied.
```

### 2. Verificar Banco de Dados (opcional)

```bash
npm run db:studio
```

Isso abre uma interface visual do banco em `http://localhost:5555`.

Você deve ver as tabelas:
- `corretores` — Contas dos corretores
- `leads` — Leads cadastrados por cada corretor

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

Você será redirecionado para `/auth/login`. Como ainda não tem conta, clique em **"Criar conta"** para se cadastrar.

### Parar o Servidor

Pressione `Ctrl + C` no terminal.

---

## 🚀 Executar em Modo de Produção

### 1. Build da Aplicação

```bash
npm run build
```

### 2. Iniciar o Servidor de Produção

```bash
npm run start
```

---

## ✅ Validar se a Aplicação Está Funcionando

### 1. Criar uma Conta de Corretor

Acesse no navegador:

```
http://localhost:3000/auth/register
```

Preencha:
- Nome: `João Silva`
- E-mail: `joao@example.com`
- Senha: `minhasenha123`

Após o cadastro, você será redirecionado para a página de login.

### 2. Fazer Login

Acesse:

```
http://localhost:3000/auth/login
```

Use as credenciais que você acabou de criar. Após o login, você será redirecionado para `/leads`.

### 3. Cadastrar um Lead de Teste

Na página de leads, clique em **"Novo Lead"** e preencha:

- Nome: `Ana Costa`
- E-mail: `ana@example.com`
- CPF: `529.982.247-25`
- Telefone: `(11) 98765-4321`
- Valor do Imóvel: `400000`
- Renda Mensal: `12000`

O lead deve aparecer na lista com score **90,00** e prioridade **🟢 Alto**.

### 4. Testar a API com cURL

**Listar leads** (requer cookie de sessão):
```bash
curl -X GET http://localhost:3000/api/leads \
  -H "Cookie: next-auth.session-token=<seu-token>"
```

### 5. Acessar a Documentação Interativa

```
http://localhost:3000/api/docs
```

---

## 🐛 Problemas Comuns e Soluções

### Erro: `NEXTAUTH_SECRET is not set`

**Problema**: Variável `NEXTAUTH_SECRET` não está configurada.

**Solução**:
```bash
# Gere uma chave segura
openssl rand -base64 32

# Adicione ao .env
NEXTAUTH_SECRET="chave-gerada-aqui"
```

---

### Erro: `connect ECONNREFUSED 127.0.0.1:5432`

**Problema**: PostgreSQL não está rodando.

**Solução**:
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

---

### Erro: `database "leadimobi" does not exist`

**Problema**: Banco de dados não foi criado.

**Solução**:
```bash
psql -U postgres -c "CREATE DATABASE leadimobi;"
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
# macOS/Linux — encontre e mate o processo
lsof -i :3000
kill -9 <PID>

# Ou use uma porta diferente
PORT=3001 npm run dev
```

---

### Erro: `Prisma Client not found`

**Problema**: Cliente Prisma não foi gerado.

**Solução**:
```bash
npm run db:generate
```

---

### Login não funciona após configurar `.env`

**Problema**: Servidor ainda está usando variáveis antigas em cache.

**Solução**: Pare o servidor (`Ctrl + C`) e reinicie com `npm run dev`.

---

### Erro: `npm ERR! code ERESOLVE`

**Problema**: Conflito de dependências.

**Solução**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
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

### Erro: `ENOENT: no such file or directory, open '.env'`

**Problema**: Arquivo `.env` não existe.

**Solução**:
```bash
cp .env.example .env
# Edite o arquivo com suas configurações
```

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

---

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. **Crie sua conta de corretor** em `/auth/register`
2. **Faça login** em `/auth/login`
3. **Explore a Interface**
   - Cadastre alguns leads de teste
   - Veja o cálculo automático do score
4. **Teste a API**
   - Acesse `http://localhost:3000/api/docs`
   - Teste os endpoints no Swagger UI
5. **Leia a Documentação**
   - `README.md` — Visão geral do projeto
   - `docs/PRD.md` — Requisitos do produto
   - `docs/diagrams/uml_use_cases.md` — Casos de uso
6. **Execute os Testes**
   ```bash
   npm run test
   ```
7. **Explore o Código**
   - Estrutura em `src/`
   - Regras de negócio em `src/domain/`
   - Serviços em `src/services/`

---

## 🆘 Suporte

Se encontrar problemas não listados aqui:

1. Verifique os logs do servidor (terminal onde rodou `npm run dev`)
2. Consulte a documentação do [Next.js](https://nextjs.org/docs)
3. Consulte a documentação do [Prisma](https://www.prisma.io/docs/)
4. Consulte a documentação do [NextAuth.js](https://authjs.dev/)
5. Abra uma issue no repositório

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

⚠️ **Cuidado**: Isso deleta todos os dados, incluindo contas de corretores e leads!

### Executar Testes

```bash
npm run test
```

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

Se tudo funcionou, você agora tem o LeadImobi rodando localmente com autenticação de corretores.
