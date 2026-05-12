# 🛒 E-commerce API

API REST completa de e-commerce desenvolvida com NestJS, Prisma ORM e PostgreSQL.  
O sistema possui autenticação JWT, controle de acesso por roles (ADMIN e USER), gerenciamento de produtos, categorias, carrinho de compras, checkout e histórico de pedidos.

---

# 🚀 Tecnologias Utilizadas

- Node.js 20
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Neon PostgreSQL Cloud
- JWT Authentication
- Bcrypt
- Swagger
- REST Client / Insomnia

---

# ⚙️ Instalação e Execução

## Clone o repositório

```bash
git clone https://github.com/douglasmf/ecommerce-api.git

cd ecommerce-api
```

---

## Instale as dependências

```bash
npm install
```

---

## Crie o arquivo `.env`

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/database?sslmode=require"

JWT_SECRET="secretKey"
```

---

## Execute as migrations

```bash
npx prisma migrate dev
```

---

## Gere o Prisma Client

```bash
npx prisma generate
```

---

## Execute a seed inicial

```bash
npx prisma db seed
```

A seed cria automaticamente um usuário administrador inicial.

---

## Inicie o servidor

```bash
npm run start:dev
```

---

# 🌐 API disponível em

```bash
http://localhost:3000
```

---

# 📘 Swagger

Documentação Swagger disponível em:

```bash
http://localhost:3000/api
```

---

# 🔐 Autenticação

A API utiliza autenticação JWT Bearer Token.

Fluxo:

- Registrar usuário
- Realizar login
- Receber token JWT
- Utilizar token nas rotas protegidas

---

# 👤 Roles do Sistema

## USER

Permissões:

- visualizar produtos
- gerenciar próprio carrinho
- finalizar compras
- visualizar histórico de pedidos

---

## ADMIN

Permissões:

- criar produtos
- atualizar produtos
- deletar produtos
- gerenciar categorias
- visualizar usuários
- deletar usuários

---

# 🗄️ Estrutura do Banco de Dados

## User

| Campo | Tipo |
|---|---|
| id | integer |
| name | string |
| email | string |
| password | string |
| role | enum |
| createdAt | datetime |

---

## Product

| Campo | Tipo |
|---|---|
| id | integer |
| name | string |
| description | string |
| price | decimal |
| image | string |
| categoryId | integer |
| createdAt | datetime |

---

## Category

| Campo | Tipo |
|---|---|
| id | integer |
| name | string |

---

## CartItem

| Campo | Tipo |
|---|---|
| id | integer |
| userId | integer |
| productId | integer |
| quantity | integer |

---

## Order

| Campo | Tipo |
|---|---|
| id | integer |
| userId | integer |
| total | decimal |
| createdAt | datetime |

---

## OrderItem

| Campo | Tipo |
|---|---|
| id | integer |
| orderId | integer |
| productId | integer |
| quantity | integer |
| price | decimal |

---

# 🔗 Relacionamentos

- Um usuário pode possuir vários itens no carrinho
- Um usuário pode possuir vários pedidos
- Um pedido possui vários itens
- Um produto pertence a uma categoria
- Uma categoria possui vários produtos

---

# 🧠 Arquitetura do Projeto

O projeto segue arquitetura modular utilizando o padrão recomendado pelo NestJS.

---

## Controllers

Responsáveis por:

- receber requisições HTTP
- validar entrada de dados
- retornar respostas da API

---

## Services

Responsáveis por:

- regras de negócio
- integração com Prisma ORM
- validações de domínio

---

## Guards

Responsáveis por:

- autenticação JWT
- autorização baseada em roles

---

## DTOs

Responsáveis por:

- validação dos dados
- tipagem das requisições
- integração com Swagger

---

## Prisma ORM

Responsável por:

- modelagem do banco
- migrations
- consultas SQL
- relacionamentos

---

# 🔒 Segurança Implementada

- Hash de senha com bcrypt
- JWT Authentication
- Rotas protegidas com Guards
- Controle de acesso por roles
- ValidationPipe global
- DTO Validation
- Remoção automática de campos inválidos

---

# 🔗 Endpoints da API

# Auth

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /auth/register | Registrar usuário |
| POST | /auth/login | Realizar login |

---

# Users

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /users/profile | Perfil do usuário |
| GET | /users | Listar usuários (ADMIN) |
| GET | /users/:id | Buscar usuário (ADMIN) |
| DELETE | /users/:id | Remover usuário (ADMIN) |

---

# Categories

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /categories | Criar categoria |
| GET | /categories | Listar categorias |
| PATCH | /categories/:id | Atualizar categoria |
| DELETE | /categories/:id | Remover categoria |

---

# Products

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /products | Criar produto |
| GET | /products | Listar produtos |
| GET | /products/:id | Buscar produto |
| PATCH | /products/:id | Atualizar produto |
| DELETE | /products/:id | Remover produto |

---

# Cart

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /cart | Adicionar item ao carrinho |
| GET | /cart | Listar carrinho |
| PATCH | /cart/:id | Atualizar quantidade |
| DELETE | /cart/:id | Remover item |

---

# Orders

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /orders/checkout | Finalizar compra |
| GET | /orders | Histórico de pedidos |
| GET | /orders/:id | Detalhes do pedido |

---

# 🧪 Testes

As requisições foram testadas utilizando:

- REST Client
- Swagger
- Insomnia

Fluxos testados:

- autenticação
- autorização
- CRUD de produtos
- CRUD de categorias
- carrinho
- checkout
- histórico de pedidos

---

# ☁️ Banco de Dados Cloud

A API utiliza PostgreSQL hospedado no:

- Neon PostgreSQL Cloud

---

# 📦 Funcionalidades Implementadas

## Autenticação

- login JWT
- registro de usuário
- proteção de rotas

---

## Produtos

- CRUD completo
- filtro por nome
- filtro por categoria

---

## Categorias

- CRUD completo
- relacionamento com produtos

---

## Carrinho

- adicionar item
- atualizar quantidade
- remover item
- listar carrinho

---

## Pedidos

- checkout
- criação automática do pedido
- histórico de compras
- detalhes do pedido

---

# 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para demonstrar conhecimentos em:

- desenvolvimento backend moderno
- NestJS
- TypeScript
- APIs REST
- autenticação JWT
- arquitetura modular
- Prisma ORM
- PostgreSQL
- controle de acesso
- documentação Swagger
- integração com banco cloud

---

# 👨‍💻 Autor

Douglas Monteiro  
Desenvolvedor Front-end Júnior / Full Stack Júnior

Projeto desenvolvido para fins de estudo e portfólio.
