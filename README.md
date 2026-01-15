# DevReview (MVP) — Plataforma anônima de reviews de empresas

> Um espaço para desenvolvedores compartilharem experiências profissionais **sem se revelar**, ajudando outras pessoas a decidirem se vale a pena entrar em determinada empresa.

## 🎯 Visão

Criar uma plataforma onde devs possam:

- avaliar empresas de forma **anônima/pseudônima**
- compartilhar experiências sobre rotina, cultura, gestão e processo seletivo
- reduzir “furadas” e ajudar na tomada de decisão de carreira

## 🔐 Princípios do produto

- **Anonimato com responsabilidade**: o usuário é pseudônimo publicamente.
- **Credibilidade**: contas precisam confirmar e-mail para publicar.
- **Segurança / anti-doxxing**: proibir dados pessoais e nomes de indivíduos.
- **Moderação**: denúncias e ocultação de reviews.

---

## ✅ MVP 0.1 (primeira versão publicada)

### Funcionalidades

**Usuário**

- Criar conta / login
- Confirmar e-mail (obrigatório para publicar)
- Perfil simples (apelido)

**Empresas**

- Lista de empresas
- Página da empresa com reviews e métricas agregadas

**Reviews**

- Criar review (com campos estruturados)
- Editar por 15 minutos
- Denunciar review

**Admin**

- Painel admin (listagem de denúncias)
- Ocultar review

### O que NÃO entra no MVP

- comentários
- respostas da empresa
- likes/dislikes
- upload de anexos
- “postar sem login”

---

## 🧱 Modelo de anonimato

- Publicamente: **apelido** (ex.: `Dev_8321`)
- Privadamente: e-mail para autenticação e recuperação de conta
- Badges:
  - ✅ `Conta verificada` (e-mail confirmado)
  - 🔒 `Vínculo verificado` (pós-MVP)

---

## 🧭 Regras de publicação (política de conteúdo)

É **proibido**:

- citar nomes de pessoas (chefes, RH, colegas, donos)
- expor dados pessoais (telefone, e-mail, CPF, endereço)
- fazer acusações criminais sem evidências
- publicar segredos internos, dados de clientes, ou documentos privados

Reviews podem criticar:

- processos
- cultura
- gestão
- carga de trabalho
- salário (somente em **faixas**)

---

## 🧰 Stack recomendada (MVP)

- **Frontend**: Next.js (App Router) + Tailwind + shadcn/ui
- **Backend**: API Routes (Next) ou serviço separado
- **DB**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth (Auth.js) / Clerk
- **Deploy**: Vercel
- **DB host**: Neon / Supabase

---

## 🗃️ Banco de Dados (schema simplificado)

### `users`

- id (uuid)
- email
- handle (apelido)
- verifiedEmail (bool)
- role (`USER` | `ADMIN`)
- createdAt

### `companies`

- id
- name
- slug
- city
- state
- createdAt

### `reviews`

- id
- companyId
- userId
- roleArea (frontend/back/etc)
- seniority (jr/pl/sr)
- contractType (clt/pj/estagio)
- workMode (remoto/hibrido/presencial)
- year (ex.: 2024)
- ratingOverall (1–5)
- pros
- cons
- hidden (bool)
- createdAt

### `reports`

- id
- reviewId
- reporterUserId
- reason
- createdAt
- resolvedAt

---

## 🔌 Endpoints (MVP)

### Companies

- `GET /api/companies`
- `GET /api/companies/:id`

### Reviews

- `POST /api/reviews`
- `GET /api/companies/:id/reviews`
- `PATCH /api/reviews/:id` (editar — até 15 min)
- `DELETE /api/reviews/:id` (admin oculta)

### Reports

- `POST /api/reports`
- `GET /api/admin/reports`

---

## 🧪 Roadmap (14 dias)

**Semana 1**

- Setup repo + deploy
- Prisma + migrations
- Auth + perfil
- CRUD companies/reviews

**Semana 2**

- denúncias + painel admin
- anti-spam (rate limit)
- filtro anti-doxxing
- seed de empresas iniciais

---

## 🧑‍💻 Como rodar localmente (template)

```bash
# 1) instalar deps
npm install

# 2) env
cp .env.example .env

# 3) prisma
npx prisma migrate dev

# 4) dev
npm run dev
```

---

## 📄 Licença

COPÍA NÃO COMÉDIA.
