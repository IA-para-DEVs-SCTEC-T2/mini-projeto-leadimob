# Documento de Requisitos — Autenticação de Corretores

## Introdução

Este documento cobre os requisitos para implementação de autenticação mínima no LeadImobi, conforme issue [C-01]. O objetivo é garantir que cada corretor acesse apenas seus próprios leads, com cadastro e login via email e senha.

A autenticação utiliza **next-auth v5** com `CredentialsProvider`, sessão em JWT armazenado em cookie httpOnly. Não há integração com provedores externos (Google, GitHub) nesta versão.

---

## Glossário

- **Corretor**: Usuário da plataforma; profissional que cadastra e consulta leads.
- **Sessão**: Estado de autenticação do corretor, armazenado em cookie JWT httpOnly gerenciado pelo next-auth.
- **Credenciais**: Par email + senha usado para autenticar o corretor.
- **Auth_Service**: Componente de serviço responsável por criar corretores e verificar credenciais.
- **Auth_Repository**: Componente de infraestrutura responsável por persistir e recuperar corretores do banco.
- **Proteção de Rota**: Mecanismo que redireciona usuários não autenticados para a página de login.

---

## Requisitos

---

### AC-1 — Cadastro de Corretor

**User Story:** Como novo corretor, quero criar uma conta com nome, email e senha, para que eu possa acessar o sistema e cadastrar meus leads.

---

#### AC-1.1 — Formulário de Cadastro

##### Critérios de Aceitação

- **AC-1.1.1** THE Sistema SHALL exibir uma página de cadastro em `/auth/register` com campos: Nome, E-mail e Senha.
- **AC-1.1.2** WHEN o corretor submete o formulário com dados válidos, THE Auth_Service SHALL criar a conta e redirecionar para `/auth/login`.
- **AC-1.1.3** THE Sistema SHALL exibir mensagens de erro descritivas por campo quando a validação falhar, sem limpar os valores digitados.
- **AC-1.1.4** THE Lead_Form SHALL desabilitar o botão de submissão enquanto a operação estiver em andamento.
- **AC-1.1.5** THE Sistema SHALL exibir um link para a página de login para corretores que já possuem conta.

---

#### AC-1.2 — Validação do Cadastro

##### Critérios de Aceitação

- **AC-1.2.1** THE Validator SHALL validar o campo Nome como string com no mínimo 2 e no máximo 100 caracteres.
- **AC-1.2.2** THE Validator SHALL validar o campo E-mail como endereço de e-mail no formato RFC 5322.
- **AC-1.2.3** THE Validator SHALL validar o campo Senha como string com no mínimo 8 caracteres.
- **AC-1.2.4** IF o e-mail já estiver cadastrado, THEN THE Sistema SHALL retornar erro descritivo sem revelar se o e-mail existe no sistema (mensagem genérica: "Não foi possível criar a conta. Verifique os dados e tente novamente.").
- **AC-1.2.5** THE Sistema SHALL armazenar a senha como hash bcrypt (custo mínimo 10), nunca em texto plano.

---

#### AC-1.3 — Persistência do Corretor

##### Critérios de Aceitação

- **AC-1.3.1** THE Auth_Repository SHALL persistir o corretor no banco de dados com os campos: id (cuid), nome, email (unique), password_hash, created_at.
- **AC-1.3.2** THE Sistema SHALL garantir unicidade de email no nível do banco de dados.
- **AC-1.3.3** IF ocorrer erro de conexão com o banco durante o cadastro, THEN THE Sistema SHALL retornar mensagem de erro genérica sem expor detalhes de infraestrutura.

---

### AC-2 — Login de Corretor

**User Story:** Como corretor cadastrado, quero fazer login com meu email e senha, para que eu possa acessar meus leads.

---

#### AC-2.1 — Formulário de Login

##### Critérios de Aceitação

- **AC-2.1.1** THE Sistema SHALL exibir uma página de login em `/auth/login` com campos: E-mail e Senha.
- **AC-2.1.2** WHEN o corretor submete credenciais válidas, THE Sistema SHALL criar uma sessão autenticada e redirecionar para `/leads`.
- **AC-2.1.3** WHEN o corretor submete credenciais inválidas (email não encontrado ou senha incorreta), THE Sistema SHALL exibir mensagem de erro genérica sem indicar qual campo está errado (prevenção de enumeração de usuários).
- **AC-2.1.4** THE Sistema SHALL desabilitar o botão de submissão enquanto a autenticação estiver em andamento.
- **AC-2.1.5** THE Sistema SHALL exibir um link para a página de cadastro para novos corretores.

---

#### AC-2.2 — Sessão e Cookie

##### Critérios de Aceitação

- **AC-2.2.1** THE Sistema SHALL utilizar next-auth v5 com `CredentialsProvider` para gerenciar a autenticação.
- **AC-2.2.2** THE Sistema SHALL armazenar a sessão em cookie JWT httpOnly, gerenciado pelo next-auth.
- **AC-2.2.3** THE Sistema SHALL incluir o `corretor_id` e o `nome` do corretor no payload da sessão JWT.
- **AC-2.2.4** THE Sistema SHALL configurar o cookie de sessão com `secure: true` em produção e `sameSite: lax`.
- **AC-2.2.5** THE Sistema SHALL definir expiração da sessão em 7 dias.

---

### AC-3 — Proteção de Rotas

**User Story:** Como sistema, quero garantir que apenas corretores autenticados acessem as páginas de leads, para que os dados sejam protegidos.

---

#### AC-3.1 — Redirecionamento para Login

##### Critérios de Aceitação

- **AC-3.1.1** WHEN um usuário não autenticado tenta acessar qualquer rota sob `/leads/*`, THE Sistema SHALL redirecionar para `/auth/login`.
- **AC-3.1.2** THE Sistema SHALL implementar a proteção de rotas no arquivo `proxy.ts` (middleware do Next.js 16).
- **AC-3.1.3** WHEN um corretor autenticado tenta acessar `/auth/login` ou `/auth/register`, THE Sistema SHALL redirecionar para `/leads`.
- **AC-3.1.4** As rotas `/auth/login`, `/auth/register` e `/` SHALL ser acessíveis sem autenticação.

---

### AC-4 — Isolamento de Dados por Corretor

**User Story:** Como corretor, quero ver apenas os meus próprios leads, para que os dados de outros corretores não sejam visíveis para mim.

---

#### AC-4.1 — Vinculação de Leads ao Corretor

##### Critérios de Aceitação

- **AC-4.1.1** THE Sistema SHALL adicionar o campo `corretor_id` (FK para `Corretor`) ao model `Lead` no banco de dados.
- **AC-4.1.2** WHEN um novo lead é criado, THE Lead_Service SHALL associar o lead ao `corretor_id` da sessão autenticada.
- **AC-4.1.3** THE Lead_Repository SHALL filtrar todos os resultados de `find_all` pelo `corretor_id` da sessão.
- **AC-4.1.4** THE Lead_Repository SHALL verificar que o `corretor_id` da sessão corresponde ao lead antes de executar operações de `find_by_id`, `update` e `delete`.
- **AC-4.1.5** IF o corretor tenta acessar um lead que não lhe pertence, THEN THE Sistema SHALL retornar 404 (não revelar existência do recurso).

---

### AC-5 — Logout

**User Story:** Como corretor, quero encerrar minha sessão, para que minha conta fique protegida em dispositivos compartilhados.

---

#### AC-5.1 — Ação de Logout

##### Critérios de Aceitação

- **AC-5.1.1** THE Sistema SHALL exibir um botão ou link de logout no layout das páginas de leads.
- **AC-5.1.2** WHEN o corretor clica em logout, THE Sistema SHALL encerrar a sessão via next-auth `signOut` e redirecionar para `/auth/login`.
- **AC-5.1.3** THE Sistema SHALL exibir o nome do corretor autenticado no layout das páginas de leads.

---

## Resumo das Features

| ID     | Descrição                              |
|--------|----------------------------------------|
| AC-1   | Cadastro de Corretor                   |
| AC-1.1 | Formulário de Cadastro                 |
| AC-1.2 | Validação do Cadastro                  |
| AC-1.3 | Persistência do Corretor               |
| AC-2   | Login de Corretor                      |
| AC-2.1 | Formulário de Login                    |
| AC-2.2 | Sessão e Cookie                        |
| AC-3   | Proteção de Rotas                      |
| AC-3.1 | Redirecionamento para Login            |
| AC-4   | Isolamento de Dados por Corretor       |
| AC-4.1 | Vinculação de Leads ao Corretor        |
| AC-5   | Logout                                 |
| AC-5.1 | Ação de Logout                         |
