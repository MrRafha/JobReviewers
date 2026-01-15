# JobReviewers (MVP) — Plataforma anônima de reviews de empresas

> Um espaço para profissionais compartilharem experiências de trabalho **sem se revelar**, ajudando outras pessoas a decidirem se vale a pena entrar em determinada empresa.

## 🎯 Visão

Criar uma plataforma onde profissionais possam:

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

- citar nomes de pessoas (chefes, RH, colegas, gestores)
- expor dados pessoais (telefone, e-mail, CPF, endereço)
- fazer acusações criminais sem evidências
- publicar segredos internos, dados de clientes, ou documentos privados

Reviews podem criticar:

- processos
- cultura
- gestão
- carga de trabalho
- benefícios
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

## 🚀 Como começar (Para iniciantes)

### 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [Git](https://git-scm.com/)
- Um editor de código (recomendamos [VS Code](https://code.visualstudio.com/))
- Uma conta no [GitHub](https://github.com/)

### 🔧 Configuração Inicial

#### 1. Clone o repositório

```bash
git clone https://github.com/MrRafha/JobReviewers.git
cd JobReviewers
```

#### 2. Instale as dependências

```bash
npm install
```

Isso vai instalar todas as bibliotecas e ferramentas necessárias que estão listadas no `package.json`.

#### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (copie do `.env.example`):

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devreview"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**🔐 Importante:** Nunca commite o arquivo `.env`! Ele já está no `.gitignore`.

#### 4. Configure o banco de dados

```bash
# Gera o Prisma Client (necessário após clonar ou mudar o schema)
npx prisma generate

# Roda as migrations para criar as tabelas
npx prisma migrate dev

# (Opcional) Popula o banco com dados de exemplo
npx tsx prisma/seed.ts
```

#### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000 no seu navegador 🎉

---

## 🛠️ Ferramentas e Comandos Úteis

### Comandos disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Cria a versão de produção
npm run start        # Inicia o servidor de produção
npm run lint         # Verifica erros de código
npm run format       # Formata todo o código com Prettier
npm run format:check # Verifica se o código está formatado
```

### Prisma (Banco de Dados)

```bash
npx prisma studio          # Abre interface visual do banco
npx prisma migrate dev     # Cria nova migration
npx prisma generate        # Gera o Prisma Client
npx prisma db push         # Sincroniza schema sem criar migration
```

### Extensões recomendadas do VS Code

Quando abrir o projeto no VS Code, ele vai sugerir instalar:

- **Prettier** - Formatação automática de código
- **ESLint** - Verificação de erros
- **EditorConfig** - Configurações do editor
- **Prisma** - Syntax highlighting para schema

---

## 🌿 Workflow Git (Trabalhando em Equipe)

### Estrutura de Branches

- **`main`** - Branch protegida, apenas código revisado e aprovado
- **`development`** - Branch de desenvolvimento, onde o time trabalha

### Como trabalhar em uma nova feature

#### 1. Sempre comece atualizando a branch development

```bash
git checkout development
git pull origin development
```

#### 2. Crie uma branch para sua feature

```bash
git checkout -b feature/nome-da-feature
# Exemplos:
# git checkout -b feature/login-page
# git checkout -b feature/company-card
# git checkout -b fix/bug-review-form
```

#### 3. Faça suas alterações

Trabalhe normalmente no código. Use commits pequenos e descritivos:

```bash
git add .
git commit -m "feat: adiciona formulário de login"
git commit -m "fix: corrige validação de email"
git commit -m "style: ajusta espaçamento do header"
```

**Convenção de commits:**

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `style:` - Mudanças de estilo (CSS, formatação)
- `refactor:` - Refatoração de código
- `docs:` - Mudanças na documentação
- `test:` - Adiciona ou corrige testes
- `chore:` - Tarefas diversas (configs, deps)

#### 4. Envie sua branch para o GitHub

```bash
git push -u origin feature/nome-da-feature
```

#### 5. Abra um Pull Request (PR)

1. Acesse https://github.com/MrRafha/JobReviewers/pulls
2. Clique em "New Pull Request"
3. Selecione: `development` ← `feature/nome-da-feature`
4. Descreva o que foi feito
5. Solicite revisão de um colega

#### 6. Após aprovação, faça o merge

Após alguém revisar e aprovar, clique em "Merge" no GitHub.

#### 7. Limpeza (opcional)

```bash
# Volte para development
git checkout development
git pull

# Delete a branch local
git branch -d feature/nome-da-feature
```

### ⚠️ Nunca faça push direto na main!

A branch `main` está protegida. Mudanças só entram via Pull Request.

### 🔄 Mantendo sua branch atualizada

Se alguém fez mudanças na `development` enquanto você trabalhava:

```bash
# Na sua branch de feature
git checkout feature/sua-feature
git pull origin development
# Resolva conflitos se houver
git push
```

### 🆘 Comandos úteis

```bash
# Ver branches locais
git branch

# Ver branches remotas
git branch -r

# Ver status dos arquivos
git status

# Ver histórico de commits
git log --oneline

# Desfazer mudanças não commitadas
git checkout -- arquivo.ts

# Desfazer último commit (mantém as mudanças)
git reset --soft HEAD~1
```

---

## 📁 Estrutura do Projeto

```
devreview/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── companies/     # Endpoints de empresas
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── lib/                   # Utilitários e configs
│   └── prisma.ts          # Cliente Prisma
├── prisma/                # Banco de dados
│   ├── schema.prisma      # Schema do banco
│   ├── migrations/        # Histórico de migrations
│   └── seed.ts            # Dados iniciais
├── public/                # Arquivos estáticos
├── .vscode/               # Configurações do VS Code
│   ├── settings.json      # Formatação automática
│   └── extensions.json    # Extensões recomendadas
├── .env                   # Variáveis de ambiente (não commitar!)
├── .env.example           # Exemplo de variáveis
├── .gitignore             # Arquivos ignorados pelo Git
├── .prettierrc            # Configuração do Prettier
├── .editorconfig          # Configurações do editor
├── eslint.config.mjs      # Configuração do ESLint
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

---

## 🎓 Recursos para Aprender

### Next.js

- [Documentação oficial](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Prisma

- [Documentação](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Git

- [Pro Git Book](https://git-scm.com/book/pt-br/v2)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 🐛 Problemas Comuns

### "Module '@prisma/client' has no exported member 'PrismaClient'"

**Solução:**

```bash
npx prisma generate
```

### "Cannot find module or its declarations"

**Solução:** Reinicie o TypeScript Server no VS Code:

1. `Ctrl + Shift + P`
2. Digite "TypeScript: Restart TS Server"

### Conflitos no Git

**Solução:**

1. Faça backup das suas mudanças
2. Atualize a branch: `git pull origin development`
3. Resolva os conflitos nos arquivos marcados
4. `git add .` e `git commit`

---

## 📞 Dúvidas?

- Abra uma [Issue](https://github.com/MrRafha/JobReviewers/issues)
- Pergunte no grupo do time

---

## 📄 Licença

COPÍA NÃO COMÉDIA.
