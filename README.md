# Global Imobiliária — MVP

Marketplace imobiliário digital da Global Holding para o mercado angolano.

## Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (REST, `/api/v1`)
- **Base de dados**: PostgreSQL 16
- **ORM**: Prisma
- **Autenticação**: JWT (jose) + bcryptjs
- **Validação**: Zod
- **Testes**: Vitest

## Arranque

### 1. Pré-requisitos

- Node.js 18+
- Docker (para PostgreSQL)

### 2. Configuração

```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com as suas credenciais
# DATABASE_URL, AUTH_SECRET, APP_URL
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Iniciar PostgreSQL

```bash
docker compose up -d
```

### 5. Migrar e semear

```bash
npm run db:migrate
npm run db:seed
```

### 6. Iniciar o servidor

```bash
npm run dev
```

Aceder em `http://localhost:3000`.

## Estrutura

```
app/
├── (public)/          # Marketplace público
├── (auth)/            # Login, registo, recuperar password
├── dashboard/         # Painel do utilizador
├── admin/             # Painel administrativo
└── api/v1/            # REST API
    ├── auth/          # register, login, logout, forgot-password, reset-password
    ├── users/
    ├── properties/
    ├── favorites/
    ├── contacts/
    ├── visits/
    ├── notifications/
    └── admin/
components/
├── forms/             # Formulários client-side
├── layout/
├── property/
├── marketplace/
├── dashboard/
└── admin/
lib/
├── auth/              # password, session
├── api/               # helpers de resposta
├── validation/        # schemas Zod
├── permissions/       # RBAC
└── db.ts              # Prisma Client
prisma/
├── schema.prisma      # Modelo completo
└── seed.ts            # Roles BUYER TENANT OWNER AGENT ADMIN
services/
└── auth/              # Lógica de negócio de autenticação
types/
tests/
```

## Estado atual (BLOCO 1–6)

### Concluído

- ✅ **BLOCO 1 — Configuração**: Next.js 15 + TypeScript strict + Tailwind CSS v4
- ✅ **BLOCO 2 — PostgreSQL + Prisma**: Schema validado, migração aplicada
- ✅ **BLOCO 3 — Schema completo**: Users, Roles, Properties, PropertyImages, Favorites, Contacts, VisitRequests, PropertyReviews, Notifications com índices
- ✅ **BLOCO 4 — Seed de roles**: BUYER, TENANT, OWNER, AGENT, ADMIN
- ✅ **BLOCO 5 — Autenticação**: Registo, login, logout, forgot-password, reset-password com JWT + bcrypt
- ✅ **BLOCO 6 — RBAC**: Permissões por role, proteção de rotas administrativas, ownership checks

### Verificado

- ✅ Build de produção compila com sucesso
- ✅ Smoke tests passam: homepage, login, registo, autenticação API, redirecionamentos

### Próximos blocos

- **BLOCO 7 — Properties**: CRUD, transições de estado, submissão para revisão
- **BLOCO 8 — Property Images**: Upload, validação, cobertura
- **BLOCO 9 — Marketplace**: Pesquisa, filtros, paginação
- **BLOCO 10 — Favorites**
- **BLOCO 11 — Contacts**
- **BLOCO 12 — Visit Requests**
- **BLOCO 13 — Dashboard**
- **BLOCO 14 — Admin**
- **BLOCO 15 — Notifications**

## API (autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/register` | Criar conta |
| POST | `/api/v1/auth/login` | Iniciar sessão |
| POST | `/api/v1/auth/logout` | Terminar sessão |
| POST | `/api/v1/auth/forgot-password` | Pedir recuperação |
| POST | `/api/v1/auth/reset-password` | Redefinir palavra-passe |

## Segurança

- Palavras-passe com hash bcrypt (12 rounds)
- Sessões JWT httpOnly
- RBAC implementado no backend
- Validação de inputs com Zod
- Secrets apenas em variáveis de ambiente
- Nunca confiar em permissões do frontend