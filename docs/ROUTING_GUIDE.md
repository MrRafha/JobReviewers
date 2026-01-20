# Estrutura de Rotas — Next.js App Router

> Como organizar páginas no projeto usando App Router

---

## 🗺️ Como Funciona

**Regra simples**: Cada pasta = segmento de URL | Cada `page.tsx` = página acessível

```
app/
├── page.tsx              → /              (home)
├── about/
│   └── page.tsx          → /about
├── companies/
│   ├── page.tsx          → /companies     (lista)
│   └── [id]/
│       └── page.tsx      → /companies/123 (detalhes)
└── reviews/
    ├── new/
    │   └── page.tsx      → /reviews/new
    └── [id]/
        ├── page.tsx      → /reviews/456
        └── edit/
            └── page.tsx  → /reviews/456/edit
```

---

## 📄 Páginas do JobReviewers

### 1. Home (Lista de Empresas)

**Arquivo**: `app/page.tsx`  
**URL**: `/`

```tsx
export default function HomePage() {
  // Lista todas as empresas
  return <div>Home - Lista de Empresas</div>;
}
```

---

### 2. Detalhes da Empresa

**Arquivo**: `app/companies/[id]/page.tsx`  
**URL**: `/companies/google` ou `/companies/123`

```tsx
export default function CompanyPage({ params }: { params: { id: string } }) {
  // Mostra empresa + seus reviews
  return <div>Empresa: {params.id}</div>;
}
```

**Como criar**:

```bash
mkdir -p app/companies/[id]
# Crie: app/companies/[id]/page.tsx
```

---

### 3. Criar Review

**Arquivo**: `app/reviews/new/page.tsx`  
**URL**: `/reviews/new?companyId=123`

```tsx
export default function NewReviewPage() {
  // Formulário para criar review
  return <div>Criar Review</div>;
}
```

**Como criar**:

```bash
mkdir -p app/reviews/new
# Crie: app/reviews/new/page.tsx
```

---

### 4. Editar Review (15 min após criar)

**Arquivo**: `app/reviews/[id]/edit/page.tsx`  
**URL**: `/reviews/456/edit`

```tsx
export default function EditReviewPage({ params }: { params: { id: string } }) {
  // Form de edição (apenas 15 min)
  return <div>Editar Review {params.id}</div>;
}
```

**Como criar**:

```bash
mkdir -p app/reviews/[id]/edit
# Crie: app/reviews/[id]/edit/page.tsx
```

---

### 5. Login

**Arquivo**: `app/(auth)/login/page.tsx`  
**URL**: `/login`

```tsx
export default function LoginPage() {
  return <div>Login</div>;
}
```

> **Nota**: `(auth)` é um **route group** - agrupa rotas sem afetar a URL

**Como criar**:

```bash
mkdir -p "app/(auth)/login"
# Crie: app/(auth)/login/page.tsx
```

---

### 6. Registro

**Arquivo**: `app/(auth)/register/page.tsx`  
**URL**: `/register`

```tsx
export default function RegisterPage() {
  return <div>Registro</div>;
}
```

---

### 7. Painel Admin - Denúncias

**Arquivo**: `app/admin/reports/page.tsx`  
**URL**: `/admin/reports`

```tsx
export default function AdminReportsPage() {
  // Lista de denúncias (apenas admin)
  return <div>Painel Admin - Denúncias</div>;
}
```

**Como criar**:

```bash
mkdir -p app/admin/reports
# Crie: app/admin/reports/page.tsx
```

---

## 🎨 Layouts Personalizados

Cada rota pode ter seu próprio layout criando um `layout.tsx`:

### Layout de Auth (sem Navbar)

**Arquivo**: `app/(auth)/layout.tsx`

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children} {/* Login ou Register */}
    </div>
  );
}
```

### Layout Admin (com Sidebar)

**Arquivo**: `app/admin/layout.tsx`

```tsx
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

---

## 📝 Arquivos Especiais

### `page.tsx`

A página visível na URL

### `layout.tsx`

Layout compartilhado (navbar, footer, etc)

### `loading.tsx`

Estado de loading automático

```tsx
// app/companies/loading.tsx
export default function Loading() {
  return <div>Carregando empresas...</div>;
}
```

### `error.tsx`

Tratamento de erros

```tsx
// app/companies/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Erro ao carregar empresas</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

### `not-found.tsx`

Página 404 customizada

```tsx
// app/companies/[id]/not-found.tsx
export default function NotFound() {
  return <div>Empresa não encontrada</div>;
}
```

---

## 🚀 Exemplo Completo: Página de Empresa

**Estrutura**:

```
app/companies/[id]/
├── page.tsx           # Página principal
├── loading.tsx        # Loading state
├── error.tsx          # Error boundary
└── not-found.tsx      # 404
```

**`page.tsx`**:

```tsx
import { notFound } from "next/navigation";

import { ReviewCard } from "@/components/features/ReviewCard";
import { getCompanyById } from "@/lib/services/companies";

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await getCompanyById(params.id);

  if (!company) {
    notFound(); // Mostra not-found.tsx
  }

  return (
    <div>
      <h1>{company.name}</h1>
      <p>
        {company.city}, {company.state}
      </p>

      <h2>Reviews</h2>
      {company.reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

---

## 🔗 Navegação Entre Páginas

Use o componente `Link` do Next.js:

```tsx
import Link from 'next/link';

// Link simples
<Link href="/companies">Ver Empresas</Link>

// Link dinâmico
<Link href={`/companies/${company.id}`}>{company.name}</Link>

// Link com query params
<Link href={`/reviews/new?companyId=${company.id}`}>Avaliar</Link>
```

---

## ✅ Checklist de Páginas MVP

### Páginas Públicas

- [ ] `/` - Home (lista de empresas)
- [ ] `/companies/[id]` - Detalhes da empresa + reviews

### Autenticação

- [ ] `/login` - Login
- [ ] `/register` - Registro

### Usuário Logado

- [ ] `/reviews/new` - Criar review
- [ ] `/reviews/[id]/edit` - Editar review (15 min)

### Admin

- [ ] `/admin/reports` - Lista de denúncias
- [ ] `/admin/dashboard` - Dashboard (opcional)

---

## 📚 Comandos Úteis

```bash
# Criar estrutura de uma página
mkdir -p app/companies/[id]
touch app/companies/[id]/page.tsx

# Criar com layout
mkdir -p app/admin
touch app/admin/layout.tsx
touch app/admin/page.tsx

# Criar route group
mkdir -p "app/(auth)/login"
touch "app/(auth)/login/page.tsx"
```

---

## 🎯 Resumo

| URL                 | Arquivo                          | Descrição     |
| ------------------- | -------------------------------- | ------------- |
| `/`                 | `app/page.tsx`                   | Home          |
| `/companies/123`    | `app/companies/[id]/page.tsx`    | Empresa       |
| `/reviews/new`      | `app/reviews/new/page.tsx`       | Criar review  |
| `/reviews/456/edit` | `app/reviews/[id]/edit/page.tsx` | Editar review |
| `/login`            | `app/(auth)/login/page.tsx`      | Login         |
| `/register`         | `app/(auth)/register/page.tsx`   | Registro      |
| `/admin/reports`    | `app/admin/reports/page.tsx`     | Admin         |
