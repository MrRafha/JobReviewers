# Estrutura do Frontend — JobReviewers

> Organização de pastas e arquivos do projeto Next.js com App Router

---

## 📁 Estrutura de Diretórios

```
devreview/
├── app/                        # Next.js App Router (rotas)
│   ├── (auth)/                # Grupo de rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── companies/             # Rotas de empresas
│   │   ├── page.tsx          # Lista de empresas
│   │   └── [id]/             # Página da empresa
│   ├── reviews/               # Rotas de reviews
│   │   ├── new/              # Criar review
│   │   └── [id]/             # Ver/editar review
│   ├── admin/                 # Painel admin
│   │   ├── reports/          # Denúncias
│   │   └── dashboard/
│   ├── api/                   # API Routes
│   │   ├── companies/
│   │   ├── reviews/
│   │   ├── reports/
│   │   └── auth/
│   ├── globals.css            # Estilos globais + tokens CSS
│   ├── layout.tsx             # Layout raiz
│   └── page.tsx               # Home page
│
├── components/                 # Componentes React
│   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Toast.tsx
│   ├── features/              # Componentes de features
│   │   ├── CompanyCard.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── RatingStars.tsx
│   │   └── ReportModal.tsx
│   └── layout/                # Componentes de layout
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── hooks/                      # Custom React Hooks
│   ├── useAuth.ts
│   ├── useCompanies.ts
│   ├── useReviews.ts
│   └── useToast.ts
│
├── lib/                        # Bibliotecas e configs
│   ├── prisma.ts              # Cliente Prisma
│   ├── services/              # Camada de serviço
│   │   ├── companies.ts
│   │   ├── reviews.ts
│   │   └── reports.ts
│   └── validations/           # Schemas de validação (Zod)
│       ├── review.schema.ts
│       └── company.schema.ts
│
├── types/                      # TypeScript types
│   ├── index.ts               # Export central
│   ├── company.ts
│   ├── review.ts
│   └── user.ts
│
├── utils/                      # Funções utilitárias
│   ├── date.ts                # Formatação de datas
│   ├── rating.ts              # Cálculos de rating
│   └── validation.ts          # Helpers de validação
│
├── public/                     # Arquivos estáticos
│   ├── logo.svg
│   └── images/
│
└── docs/                       # Documentação
    ├── FRONTEND_STRUCTURE.md  # Este arquivo
    └── DESIGN_SYSTEM.md       # Design system

```

---

## 🗂️ Convenções de Organização

### `app/` - Rotas (App Router)

**Grupos de rotas**: Use `()` para agrupar rotas sem afetar a URL
- `(auth)/` - login, register (sem navbar)
- `(dashboard)/` - rotas autenticadas

**Rotas dinâmicas**: Use `[]` para parâmetros
- `companies/[id]/` - `/companies/123`
- `reviews/[id]/edit/` - `/reviews/456/edit`

**API Routes**: `app/api/**/route.ts`
- `GET`, `POST`, `PATCH`, `DELETE`

---

### `components/` - Componentes React

#### `ui/` - Componentes Base
Componentes genéricos e reutilizáveis (design system)

```tsx
// Button.tsx
export function Button({ variant, children, ...props }) { }
```

#### `features/` - Componentes de Funcionalidade
Componentes específicos do domínio

```tsx
// ReviewCard.tsx
export function ReviewCard({ review }: { review: Review }) { }
```

#### `layout/` - Componentes de Layout
Estrutura da página (Navbar, Footer, etc)

```tsx
// Navbar.tsx
export function Navbar() { }
```

---

### `hooks/` - Custom Hooks

Lógica reutilizável com hooks

```tsx
// useAuth.ts
export function useAuth() {
  const session = useSession();
  return { user: session?.user, isAuthenticated: !!session };
}
```

---

### `lib/` - Bibliotecas e Configurações

#### `services/` - Camada de Serviço
Lógica de negócio e acesso a dados

```tsx
// lib/services/companies.ts
export async function getCompanies() {
  return await prisma.company.findMany();
}
```

#### `validations/` - Schemas de Validação
Validação com Zod

```tsx
// lib/validations/review.schema.ts
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  pros: z.string().min(10),
  cons: z.string().min(10),
});
```

---

### `types/` - TypeScript Types

Definições de tipos centralizadas

```tsx
// types/company.ts
export interface Company {
  id: string;
  name: string;
  slug: string;
  reviews: Review[];
}
```

---

### `utils/` - Funções Utilitárias

Funções puras e helpers

```tsx
// utils/rating.ts
export function calculateAverageRating(reviews: Review[]): number {
  // ...
}
```

---

## 🎯 Fluxo de Dados

```
Page (app/) → Hook (hooks/) → Service (lib/services/) → Prisma (lib/prisma.ts)
                   ↓
            Component (components/)
```

---

## 📋 Padrões e Boas Práticas

### Nomenclatura

- **Componentes**: PascalCase (`ReviewCard.tsx`)
- **Hooks**: camelCase com `use` (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`Company`, `Review`)

### Imports

Ordem de imports:
1. React / Next.js
2. Bibliotecas externas
3. Componentes internos
4. Hooks
5. Utils / Types
6. Estilos

```tsx
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/date';
import type { Company } from '@/types';
```

### Server vs Client Components

**Server Components (padrão)**:
- Buscar dados
- Acessar backend diretamente
- Renderizar conteúdo estático

**Client Components (`"use client"`)**:
- Interatividade (onClick, onChange)
- Hooks (useState, useEffect)
- Browser APIs

---

## 🔄 Próximos Passos

### Fase 1: Setup Base
- [ ] Instalar shadcn/ui
- [ ] Configurar tokens CSS no `globals.css`
- [ ] Criar componentes base (Button, Card, Input)

### Fase 2: Componentes de Features
- [ ] CompanyCard
- [ ] ReviewCard
- [ ] ReviewForm
- [ ] RatingStars

### Fase 3: Páginas
- [ ] Home (lista de empresas)
- [ ] Página da empresa
- [ ] Criar review
- [ ] Painel admin

### Fase 4: Auth & Services
- [ ] Setup NextAuth
- [ ] Services de companies/reviews
- [ ] Middleware de autenticação

---

## 📚 Recursos

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/docs)
- [Zod Validation](https://zod.dev/)
