# Documento de Requisitos — LeadImobi Core

## Introdução

O LeadImobi é uma plataforma de qualificação inteligente de leads imobiliários para corretores. O sistema centraliza o cadastro de leads, calcula automaticamente um Índice de Qualificação Financeira baseado em critério bancário objetivo e exibe uma lista priorizada que permite ao corretor focar nos contatos com maior probabilidade de fechamento.

Este documento cobre os requisitos funcionais e de qualidade da versão 1 (v1) do produto, organizado nas seguintes features principais:

- **LI-1** — Cadastro de Leads
- **LI-2** — Cálculo do Índice de Qualificação Financeira
- **LI-3** — Lista Priorizada de Leads
- **LI-4** — Visualização de Dados do Lead
- **LI-5** — Validação e Integridade de Dados
- **LI-6** — Arquitetura e Qualidade Técnica

---

## Glossário

- **Lead**: Potencial cliente (comprador de imóvel) cadastrado pelo corretor no sistema.
- **Corretor**: Usuário da plataforma; profissional de vendas imobiliárias que cadastra e consulta leads.
- **Índice**: O Índice de Qualificação Financeira calculado automaticamente pelo sistema para cada lead.
- **Índice_Calculator**: Componente de domínio responsável por calcular o Índice de Qualificação Financeira.
- **Lead_Repository**: Componente de infraestrutura responsável por persistir e recuperar leads do banco de dados.
- **Lead_Service**: Componente de serviço responsável por orquestrar os casos de uso relacionados a leads.
- **Lead_Form**: Componente de interface responsável por coletar os dados do lead via formulário.
- **Lead_List**: Componente de interface responsável por exibir a lista priorizada de leads.
- **Lead_Card**: Componente de interface responsável por exibir os dados resumidos de um lead na lista.
- **Lead_Detail**: Componente de interface responsável por exibir os dados completos de um lead.
- **Priority_Badge**: Componente de interface responsável por exibir visualmente a classificação de prioridade do lead.
- **Validator**: Componente de validação baseado em Zod responsável por verificar a integridade dos dados de entrada.
- **Sistema**: O LeadImobi como um todo, incluindo frontend, backend e banco de dados.
- **Renda_Mensal**: Valor numérico positivo em reais representando a renda mensal declarada do lead.
- **Valor_Imovel**: Valor numérico positivo em reais representando o valor do imóvel desejado pelo lead.
- **Prioridade_Alto**: Classificação atribuída a leads com Índice ≥ 80.
- **Prioridade_Medio**: Classificação atribuída a leads com Índice entre 40 e 79 (inclusive).
- **Prioridade_Baixo**: Classificação atribuída a leads com Índice < 40.
- **Lead_Nao_Classificado**: Estado de um lead cujo Valor_Imovel é zero ou nulo, impossibilitando o cálculo do Índice.

---

## Requisitos

---

### LI-1 — Cadastro de Leads

**User Story:** Como corretor, quero cadastrar leads com seus dados pessoais e financeiros, para que eu possa registrar novos contatos e ter o índice de qualificação calculado automaticamente.

---

#### LI-1.1 — Formulário de Cadastro

**User Story:** Como corretor, quero preencher um formulário estruturado com os dados do lead, para que o cadastro seja padronizado e completo.

##### Critérios de Aceitação

- **LI-1.1.1** THE Lead_Form SHALL exibir campos de entrada para os seguintes dados do lead: Nome, E-mail, CPF, Telefone, Valor do Imóvel e Renda Mensal.
- **LI-1.1.2** WHEN o corretor submete o formulário com todos os campos obrigatórios preenchidos corretamente, THE Lead_Service SHALL criar o lead e persistir os dados no banco de dados.
- **LI-1.1.3** WHEN o lead é criado com sucesso, THE Sistema SHALL exibir uma mensagem de confirmação ao corretor e redirecionar para a lista de leads.
- **LI-1.1.4** WHEN o corretor submete o formulário, THE Lead_Form SHALL desabilitar o botão de submissão até que a operação seja concluída, prevenindo submissões duplicadas.
- **LI-1.1.5** THE Lead_Form SHALL permitir que o corretor cancele o cadastro e retorne à lista de leads sem persistir dados.

---

#### LI-1.2 — Validação com Zod

**User Story:** Como corretor, quero receber feedback imediato sobre erros de preenchimento, para que eu possa corrigir os dados antes de submeter o formulário.

##### Critérios de Aceitação

- **LI-1.2.1** THE Validator SHALL validar o campo Nome como string não vazia com no mínimo 2 caracteres e no máximo 100 caracteres.
- **LI-1.2.2** THE Validator SHALL validar o campo E-mail como endereço de e-mail no formato RFC 5322.
- **LI-1.2.2A** THE Validator SHALL validar o campo CPF como string contendo exatamente 11 dígitos numéricos, permitindo formatação com pontos e hífens (ex: 000.000.000-00).
- **LI-1.2.3** THE Validator SHALL validar o campo Telefone como string contendo entre 10 e 15 dígitos numéricos, permitindo formatação com parênteses, espaços e hífens.
- **LI-1.2.4** THE Validator SHALL validar o campo Valor_Imovel como número positivo maior que zero, representado em reais.
- **LI-1.2.5** THE Validator SHALL validar o campo Renda_Mensal como número positivo maior que zero, representado em reais.
- **LI-1.2.6** WHEN o Validator identifica um campo inválido, THE Lead_Form SHALL exibir uma mensagem de erro descritiva adjacente ao campo correspondente, sem remover o valor digitado pelo corretor.
- **LI-1.2.7** WHEN todos os campos são válidos, THE Validator SHALL retornar um objeto Lead tipado e livre de erros de validação.
- **LI-1.2.8** IF o Validator recebe um campo obrigatório ausente ou nulo, THEN THE Validator SHALL retornar um erro descritivo identificando o campo ausente.

---

#### LI-1.3 — Persistência do Lead

**User Story:** Como corretor, quero que os dados do lead sejam armazenados de forma confiável, para que eu possa acessá-los posteriormente.

##### Critérios de Aceitação

- **LI-1.3.1** WHEN um lead válido é recebido pelo Lead_Service, THE Lead_Repository SHALL persistir o lead no banco de dados PostgreSQL via Prisma ORM.
- **LI-1.3.2** THE Lead_Repository SHALL armazenar junto ao lead o valor calculado do Índice e a classificação de prioridade no momento do cadastro.
- **LI-1.3.3** THE Lead_Repository SHALL armazenar a data e hora de criação do lead com precisão de segundos.
- **LI-1.3.4** IF ocorre um erro de conexão com o banco de dados durante a persistência, THEN THE Lead_Service SHALL retornar um erro estruturado ao chamador sem expor detalhes internos de infraestrutura.
- **LI-1.3.5** THE Sistema SHALL garantir que dois leads com o mesmo CPF não sejam cadastrados, retornando erro descritivo ao corretor em caso de duplicidade.

---

### LI-2 — Cálculo do Índice de Qualificação Financeira

**User Story:** Como corretor, quero que o sistema calcule automaticamente o índice de qualificação de cada lead, para que eu não precise fazer esse cálculo manualmente.

---

#### LI-2.1 — Fórmula de Qualificação

**User Story:** Como corretor, quero que o índice seja calculado com base em critério bancário objetivo, para que a qualificação seja confiável e padronizada.

##### Critérios de Aceitação

- **LI-2.1.1** WHEN um lead com Renda_Mensal e Valor_Imovel válidos é fornecido, THE Índice_Calculator SHALL calcular o Índice aplicando a fórmula: `Índice = ((Renda_Mensal × 12 × 5) ÷ Valor_Imovel) × 100`.
- **LI-2.1.2** THE Índice_Calculator SHALL retornar o Índice como número de ponto flutuante arredondado para duas casas decimais.
- **LI-2.1.3** THE Índice_Calculator SHALL ser implementado na camada `domain/`, sem dependência de frameworks, banco de dados ou bibliotecas externas.
- **LI-2.1.4** FOR ALL pares válidos de (Renda_Mensal, Valor_Imovel), THE Índice_Calculator SHALL produzir resultados determinísticos — a mesma entrada sempre produz a mesma saída.
- **LI-2.1.5** WHEN Renda_Mensal é R$ 12.000 e Valor_Imovel é R$ 400.000, THE Índice_Calculator SHALL retornar o valor 90,00.
- **LI-2.1.6** WHEN Renda_Mensal é R$ 6.000 e Valor_Imovel é R$ 380.000, THE Índice_Calculator SHALL retornar o valor aproximado de 94,74.

> **Nota de verificação:** `(6000 × 12 × 5) ÷ 380000 × 100 = 360000 ÷ 380000 × 100 ≈ 94,74`

---

#### LI-2.2 — Tratamento de Valor Zero ou Nulo

**User Story:** Como corretor, quero que leads sem valor de imóvel definido sejam sinalizados como não classificados, para que eu saiba que precisam de complementação de dados.

##### Critérios de Aceitação

- **LI-2.2.1** IF o Valor_Imovel fornecido ao Índice_Calculator for zero, THEN THE Índice_Calculator SHALL retornar um resultado inválido sem lançar exceção de divisão por zero.
- **LI-2.2.2** IF o Valor_Imovel fornecido ao Índice_Calculator for nulo ou ausente, THEN THE Índice_Calculator SHALL retornar um resultado inválido sem lançar exceção.
- **LI-2.2.3** WHEN o Índice_Calculator retorna resultado inválido, THE Lead_Service SHALL classificar o lead como Lead_Nao_Classificado.
- **LI-2.2.4** WHEN um lead é classificado como Lead_Nao_Classificado, THE Lead_List SHALL exibi-lo sem badge de prioridade e com indicação visual de "Não classificado".
- **LI-2.2.5** THE Índice_Calculator SHALL tratar Renda_Mensal zero ou nula da mesma forma que Valor_Imovel zero ou nulo, retornando resultado inválido.

---

#### LI-2.3 — Classificação por Faixa de Prioridade

**User Story:** Como corretor, quero que cada lead receba uma classificação de prioridade baseada no índice, para que eu possa identificar rapidamente os melhores contatos.

##### Critérios de Aceitação

- **LI-2.3.1** WHEN o Índice calculado é maior ou igual a 80, THE Índice_Calculator SHALL classificar o lead como Prioridade_Alto.
- **LI-2.3.2** WHEN o Índice calculado está entre 40 e 79 (inclusive nos dois extremos), THE Índice_Calculator SHALL classificar o lead como Prioridade_Medio.
- **LI-2.3.3** WHEN o Índice calculado é menor que 40 e maior que zero, THE Índice_Calculator SHALL classificar o lead como Prioridade_Baixo.
- **LI-2.3.4** THE Índice_Calculator SHALL garantir que todo lead com Índice válido receba exatamente uma das três classificações: Prioridade_Alto, Prioridade_Medio ou Prioridade_Baixo.
- **LI-2.3.5** FOR ALL valores de Índice válidos, a classificação retornada pelo Índice_Calculator SHALL ser consistente com as faixas definidas nos critérios LI-2.3.1, LI-2.3.2 e LI-2.3.3 acima (propriedade de cobertura total e sem sobreposição).

---

### LI-3 — Lista Priorizada de Leads

**User Story:** Como corretor, quero visualizar todos os leads ordenados pelo índice de qualificação, para que eu possa priorizar meu tempo de atendimento de forma eficiente.

---

#### LI-3.1 — Ordenação por Índice

**User Story:** Como corretor, quero que a lista de leads seja ordenada automaticamente do maior para o menor índice, para que os melhores leads apareçam sempre no topo.

##### Critérios de Aceitação

- **LI-3.1.1** WHEN o corretor acessa a página de leads, THE Lead_List SHALL exibir todos os leads cadastrados ordenados pelo Índice em ordem decrescente (maior índice primeiro).
- **LI-3.1.2** WHEN dois ou mais leads possuem o mesmo valor de Índice, THE Lead_List SHALL ordená-los por data de criação em ordem crescente (mais antigo primeiro) como critério de desempate.
- **LI-3.1.3** WHEN um novo lead é cadastrado, THE Lead_List SHALL refletir a nova ordenação incluindo o lead recém-criado na posição correta.
- **LI-3.1.4** WHEN a lista contém leads Lead_Nao_Classificado, THE Lead_List SHALL exibi-los ao final da lista, após todos os leads com Índice válido.
- **LI-3.1.5** THE Lead_Service SHALL realizar a ordenação dos leads antes de retorná-los ao componente de interface, mantendo a camada `app/` livre de lógica de ordenação.

---

#### LI-3.2 — Classificação Visual (Alto / Médio / Baixo)

**User Story:** Como corretor, quero identificar visualmente a prioridade de cada lead na lista, para que eu possa tomar decisões rápidas sem precisar analisar os números.

##### Critérios de Aceitação

- **LI-3.2.1** WHEN um lead com Prioridade_Alto é exibido na Lead_List, THE Priority_Badge SHALL renderizar um badge verde com o texto "Alto".
- **LI-3.2.2** WHEN um lead com Prioridade_Medio é exibido na Lead_List, THE Priority_Badge SHALL renderizar um badge amarelo com o texto "Médio".
- **LI-3.2.3** WHEN um lead com Prioridade_Baixo é exibido na Lead_List, THE Priority_Badge SHALL renderizar um badge vermelho com o texto "Baixo".
- **LI-3.2.4** WHEN um lead Lead_Nao_Classificado é exibido na Lead_List, THE Priority_Badge SHALL renderizar um badge cinza com o texto "Não classificado".
- **LI-3.2.5** THE Lead_Card SHALL exibir para cada lead: Nome, E-mail, CPF, Telefone, valor do Índice formatado com duas casas decimais e o Priority_Badge correspondente.
- **LI-3.2.6** THE Lead_List SHALL exibir o número total de leads cadastrados e a contagem por classificação (Alto, Médio, Baixo, Não classificado).

---

#### LI-3.3 — Estado Vazio da Lista

**User Story:** Como corretor, quero receber uma orientação clara quando não há leads cadastrados, para que eu saiba o que fazer a seguir.

##### Critérios de Aceitação

- **LI-3.3.1** WHEN a Lead_List é carregada e não há leads cadastrados, THE Lead_List SHALL exibir uma mensagem orientativa indicando que nenhum lead foi cadastrado e apresentar um botão de ação para cadastrar o primeiro lead.
- **LI-3.3.2** WHEN ocorre um erro ao carregar a lista de leads, THE Lead_List SHALL exibir uma mensagem de erro descritiva e uma opção para tentar novamente.

---

### LI-4 — Visualização de Dados do Lead

**User Story:** Como corretor, quero visualizar todos os dados de um lead específico, para que eu possa personalizar minha abordagem de contato com informações completas.

---

#### LI-4.1 — Página de Detalhe do Lead

**User Story:** Como corretor, quero acessar uma página dedicada com todos os dados de um lead, para que eu tenha as informações necessárias no momento do contato.

##### Critérios de Aceitação

- **LI-4.1.1** WHEN o corretor clica em um lead na Lead_List, THE Sistema SHALL navegar para a página de detalhe do lead correspondente.
- **LI-4.1.2** THE Lead_Detail SHALL exibir todos os dados do lead: Nome, E-mail, CPF, Telefone, Valor_Imovel formatado em reais, Renda_Mensal formatada em reais, Índice formatado com duas casas decimais e classificação de prioridade com Priority_Badge.
- **LI-4.1.3** THE Lead_Detail SHALL exibir a data de cadastro do lead formatada no padrão brasileiro (DD/MM/AAAA HH:MM).
- **LI-4.1.4** THE Lead_Detail SHALL disponibilizar um link de retorno para a Lead_List.
- **LI-4.1.5** IF o identificador do lead na URL não corresponde a nenhum lead cadastrado, THEN THE Sistema SHALL exibir uma página de erro 404 com mensagem descritiva e link de retorno para a Lead_List.

---

#### LI-4.2 — Formatação de Dados Financeiros

**User Story:** Como corretor, quero que os valores financeiros sejam exibidos de forma legível, para que eu possa interpretar os dados rapidamente.

##### Critérios de Aceitação

- **LI-4.2.1** THE Sistema SHALL formatar todos os valores monetários (Renda_Mensal e Valor_Imovel) no padrão brasileiro: `R$ X.XXX,XX`.
- **LI-4.2.2** THE Sistema SHALL formatar o Índice sempre com duas casas decimais, sem símbolo de moeda.
- **LI-4.2.3** THE Sistema SHALL implementar as funções de formatação na camada `lib/`, como funções puras reutilizáveis sem dependência de estado ou framework.
- **LI-4.2.4** FOR ALL valores monetários positivos, a função de formatação SHALL produzir uma string no padrão `R$ X.XXX,XX` (propriedade de formato consistente).

---

### LI-5 — Validação e Integridade de Dados

**User Story:** Como corretor, quero que o sistema rejeite dados inválidos antes de processá-los, para que a base de leads mantenha integridade e os cálculos sejam confiáveis.

---

#### LI-5.1 — Contrato de Entrada via Zod

**User Story:** Como desenvolvedor, quero que toda entrada de dados seja validada por schemas Zod antes de qualquer lógica de negócio, para que o domínio receba apenas dados estruturalmente corretos.

##### Critérios de Aceitação

- **LI-5.1.1** THE Validator SHALL definir um schema Zod para o objeto de criação de lead contendo os campos: nome (string), email (string), cpf (string), telefone (string), valor_imovel (number) e renda_mensal (number).
- **LI-5.1.2** WHEN dados de entrada são recebidos pela camada `app/`, THE Validator SHALL executar a validação Zod antes de invocar qualquer função da camada `services/` ou `domain/`.
- **LI-5.1.3** IF a validação Zod falha, THEN THE Sistema SHALL retornar os erros de validação ao corretor sem invocar a camada de domínio.
- **LI-5.1.4** THE Sistema SHALL manter os schemas Zod na camada `schemas/`, sem importá-los diretamente na camada `domain/`.
- **LI-5.1.5** THE Sistema SHALL derivar os tipos TypeScript das entidades de lead a partir dos schemas Zod, garantindo consistência entre validação e tipagem.

---

#### LI-5.2 — Independência do Domínio

**User Story:** Como desenvolvedor, quero que a camada de domínio seja independente de frameworks e bibliotecas externas, para que as regras de negócio sejam testáveis de forma isolada.

##### Critérios de Aceitação

- **LI-5.2.1** THE Índice_Calculator SHALL receber como parâmetros apenas tipos primitivos TypeScript (number) ou tipos definidos em `types/`, sem dependência de Zod, Prisma ou Next.js.
- **LI-5.2.2** THE Sistema SHALL garantir que nenhum arquivo da camada `domain/` importe módulos de `infra/`, `app/`, `schemas/` ou bibliotecas de terceiros com estado.
- **LI-5.2.3** THE Índice_Calculator SHALL ser testável com chamadas de função pura, sem necessidade de mocks de banco de dados ou framework.

---

### LI-6 — Arquitetura e Qualidade Técnica

**User Story:** Como desenvolvedor, quero que o sistema siga as convenções arquiteturais definidas, para que o código seja manutenível, testável e evolutivo.

---

#### LI-6.1 — Separação de Camadas

**User Story:** Como desenvolvedor, quero que cada camada tenha responsabilidade clara e bem delimitada, para que mudanças em uma camada não impactem desnecessariamente as demais.

##### Critérios de Aceitação

- **LI-6.1.1** THE Sistema SHALL organizar o código nas camadas: `app/` (rotas e Server Actions), `domain/` (entidades e regras), `services/` (orquestração de casos de uso), `infra/` (Prisma e repositórios), `components/` (UI reutilizável), `schemas/` (validação Zod), `types/` (tipos compartilhados) e `lib/` (utilitários).
- **LI-6.1.2** THE Sistema SHALL garantir que a camada `domain/` não importe de `infra/`, `app/` ou `schemas/`.
- **LI-6.1.3** THE Sistema SHALL garantir que a camada `services/` seja a única camada que acessa diretamente os repositórios da camada `infra/`.
- **LI-6.1.4** THE Sistema SHALL garantir que a camada `app/` não contenha lógica de negócio complexa, delegando cálculos e regras para `domain/` via `services/`.
- **LI-6.1.5** THE Sistema SHALL nomear todos os arquivos e funções em snake_case, conforme convenção do projeto.

---

#### LI-6.2 — Tipagem TypeScript

**User Story:** Como desenvolvedor, quero que todo o código seja fortemente tipado, para que erros de tipo sejam detectados em tempo de compilação.

##### Critérios de Aceitação

- **LI-6.2.1** THE Sistema SHALL tipar todos os parâmetros de funções, retornos e variáveis sem uso de `any`.
- **LI-6.2.2** THE Sistema SHALL definir os tipos compartilhados `Lead` e `LeadPriority` na camada `types/`, reutilizáveis por todas as camadas.
- **LI-6.2.3** THE Sistema SHALL compilar sem erros de TypeScript em modo estrito (`strict: true`).

---

#### LI-6.3 — Convenções de Nomenclatura e Código

**User Story:** Como desenvolvedor, quero que o código siga convenções consistentes, para que a base de código seja previsível e fácil de navegar.

##### Critérios de Aceitação

- **LI-6.3.1** THE Sistema SHALL usar snake_case para nomes de arquivos (ex: `calculate_lead_score.ts`, `lead_repository.ts`).
- **LI-6.3.2** THE Sistema SHALL usar snake_case para nomes de funções (ex: `calculate_index`, `create_lead`).
- **LI-6.3.3** THE Sistema SHALL usar PascalCase para nomes de tipos, interfaces e componentes React (ex: `Lead`, `LeadPriority`, `LeadCard`).
- **LI-6.3.4** THE Sistema SHALL evitar arquivos genéricos como `helpers.ts` ou `utils.ts`, preferindo nomes descritivos que indiquem a responsabilidade (ex: `formatters.ts`, `calculate_lead_score.ts`).

---

## Resumo das Features e Sub-features

| ID     | Descrição                                      |
|--------|------------------------------------------------|
| LI-1   | Cadastro de Leads                              |
| LI-1.1 | Formulário de Cadastro                         |
| LI-1.2 | Validação com Zod                              |
| LI-1.3 | Persistência do Lead                           |
| LI-2   | Cálculo do Índice de Qualificação Financeira   |
| LI-2.1 | Fórmula de Qualificação                        |
| LI-2.2 | Tratamento de Valor Zero ou Nulo               |
| LI-2.3 | Classificação por Faixa de Prioridade          |
| LI-3   | Lista Priorizada de Leads                      |
| LI-3.1 | Ordenação por Índice                           |
| LI-3.2 | Classificação Visual (Alto / Médio / Baixo)    |
| LI-3.3 | Estado Vazio da Lista                          |
| LI-4   | Visualização de Dados do Lead                  |
| LI-4.1 | Página de Detalhe do Lead                      |
| LI-4.2 | Formatação de Dados Financeiros                |
| LI-5   | Validação e Integridade de Dados               |
| LI-5.1 | Contrato de Entrada via Zod                    |
| LI-5.2 | Independência do Domínio                       |
| LI-6   | Arquitetura e Qualidade Técnica                |
| LI-6.1 | Separação de Camadas                           |
| LI-6.2 | Tipagem TypeScript                             |
| LI-6.3 | Convenções de Nomenclatura e Código            |
