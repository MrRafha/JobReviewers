# Design System — JobReviewers

> O design que transmite confiança através da simplicidade. Sistema visual focado na dupla azul-verde "Confiança" 💙💚

---

## 🎨 Paleta de Cores

### Paleta "Confiança" (Core)

Nossa identidade visual gira em torno de duas cores principais que representam confiança (azul) e positividade (verde):

```css
/* Backgrounds */
--bg-0: #f7f9fc /* App background - levemente azulado */ --bg-1: #ffffff
  /* Cards/Surface */ --bg-input: #f1f5f9 /* Inputs e campos */ /* Borders */
  --border: #e2e8f0 /* Dividers e contornos */ /* Text Hierarchy */
  --text-primary: #0f172a /* Títulos e texto principal */
  --text-secondary: #334155 /* Subtítulos */ --text-muted: #64748b
  /* Metadados e hints */;
```

### Cores de Marca (Brand)

```css
--brand-blue: #2563eb /* Confiança, principal */ --brand-blue-hover: #1d4ed8
  --brand-blue-bg: #dbeafe /* Badges e highlights */ --brand-green: #22c55e
  /* Ação, verificado, sucesso */ --brand-green-hover: #16a34a
  --brand-green-bg: #dcfce7 /* Background Escuro (Hero e seções de destaque) */
  --bg-dark: #2b2d31 /* Usado no hero e seções escuras */;
```

### Semânticas

```css
--success: #22c55e /* = brand-green */ --alert-orange: #f59e0b
  /* Apenas para avisos/ratings quando necessário */ --error: #ef4444
  /* Destrutivo */ --info: #2563eb /* = brand-blue */;
```

---

## 🔧 Componentes

### Botões

**Primary (Azul)**

- Background: `--brand-blue`
- Hover: `--brand-blue-hover`
- Text: `#FFFFFF`
- Radius: `16px` (rounded-2xl)
- Shadow: `shadow-lg`
- Uso: CTAs principais

**Success (Verde)**

- Background: `--brand-green`
- Hover: `--brand-green-hover`
- Text: `#FFFFFF`
- Radius: `16px`
- Uso: Confirmações, publicar review

**Secondary**

- Background: `--bg-1`
- Border: `--border`
- Text: `--text-primary`
- Hover: leve escurecimento do bg

**Danger**

- Background: `--error`
- Text: `#FFFFFF`
- Uso: Excluir, ocultar

### Cards

**CompanyCard**

- Background: `--bg-1` (branco)
- Border: `--border` (1px)
- Radius: `20px` (rounded-3xl)
- Shadow: `shadow-sm`
- Hover: `scale-[1.02]` + `shadow-md`
- Padding: `p-6`

**GlassmorphCard** (usado em Hero/Garantias)

- Background: `bg-white/10`
- Backdrop: `backdrop-blur-sm`
- Border: `border-white/20`
- Hover: `bg-white/15`
- Ícones: Fundo colorido sutil (azul/verde com 3% opacity)
- Uso: cards sobre background escuro (#2B2D31)

### Inputs

**Search Bar (Hero)**

- Background: `--bg-1` (branco)
- Border: `--border`
- Focus ring: `ring-white/50` (2px)
- Radius: `20px` (rounded-2xl)
- Shadow: `shadow-lg`
- Padding: `px-6 py-5`
- Icon: esquerda com `pl-12`

**Form Inputs**

- Background: `--bg-input`
- Border: `--border`
- Focus ring: `--brand-blue` com opacity
- Radius: `12px`

### Badges

**Verificado**: bg `--brand-green-bg` + text `--brand-green`  
**Info**: bg `--brand-blue-bg` + text `--brand-blue`  
**Neutro**: bg `--bg-0` + text `--text-secondary`

### Ratings (Estrelas)

- Ativa: `--alert-orange` (#F59E0B)
- Inativa: `--text-muted` com opacity

---

## 📐 Tipografia

Usamos uma combinação de fontes que equilibra personalidade (Sora) com legibilidade (Inter):

**Sora** → Títulos e headings (weights: 400, 500, 600, 700)  
**Inter** → Textos corridos, UI elements (weights: 300, 400, 500, 600, 700)

### Hierarquia

```
H1 (Sora):
  - text-4xl (36px) / font-bold
  - Uso: títulos principais de página

H2 (Sora):
  - text-2xl (24px) / font-semibold
Sistema baseado em Tailwind (múltiplos de 4px/0.25rem):

- **Container principal**: `max-w-7xl` (1280px) com `mx-auto`
- **Padding lateral**: `px-4 md:px-6` (16-24px responsivo)
- **Cards**: `p-6` (24px)
- **Gap entre elementos**: `gap-6` ou `gap-8` para grids
- **Margins verticais**: `mb-3` (títulos), `mb-6` (seções), `mb-12` (blocos grandes)

### Hero Section
- Altura: `h-[380px]`
- Background principal sempre `#F7F9FC` (levemente azulado)
- **Azul** para confiança, links, ações primárias
- **Verde** para sucesso, verificado, CTAs positivos
- Gradiente azul→verde **apenas** no hero e seções de destaque
- Glassmorphism (bg-white/10 + backdrop-blur) sobre gradientes
- Laranja **só** para ratings/estrelas e alertas críticos

### ❌ Evitar
- Laranja como cor principal (ficou no passado)
- Cores saturadas ocupando áreas grandes
- Gradientes em botões pequenos ou textos
- Mais de um gradiente visível ao mesmo tempo
- Ignorar a hierarquia de fontes (Sora para títulos, Inter para corpo)nt-normal
  - leading-relaxed para parágrafos longos
  - Uso: descrições, metadados

Subtitle/Hero (Inter):
  - text-xl (20px) / font-normal
  - tracking-wide para dar respiro
  - Uso: subtítulos de destaque
```

---

## 📏 Espaçamento

- Base: múltiplos de `8px`
- Container: max-width `1200px`
- Padding lateral: `16-24px`
- Cards: padding interno `16-20px`

---

## 🎯 Regras de Uso

### ✅ Fazer

- UI com base neutra (cinza/branco)
- Verde para positivo (verificado, sucesso)
- Laranja para atenção/ratings
- Gradiente apenas em CTAs e destaques
  Arquivo**: `/public/logo.png`  
  **Dimensões no Hero**: `h-20 w-28` (80x112px)  
  **Uso\*\*: Clicável, sempre linka para home (`/`)

Funciona bem sobre:

- Gradiente azul-verde (hero)
- Fundo branco/cinza claro
- Backgrounds escuros (tem contraste)

---

## 🏗️ Componentes Reutilizáveis

### CompanyCard

**Localização**: `/components/CompanyCard.tsx`

```tsx
interface CompanyCardProps {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
}
```

**Uso**: Grid de empresas na home, listagens

---

## 💻 Tokens CSS Atualizados

```css
:root {
  /* Backgrounds */
  --bg-0: #f7f9fc;
  --bg-1: #ffffff;
  --bg-input: #f1f5f9;
  --bg-dark: #2b2d31; /* Hero e seções escuras */
  --border: #e2e8f0;

  /* Text */
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;

  /* Brand Azul (Confiança) */
  --brand-blue: #2563eb;
  --brand-blue-hover: #1d4ed8;
  --brand-blue-bg: #dbeafe;

  /* Brand Verde (Ação/Sucesso) */
  --brand-green: #22c55e;
  --brand-green-hover: #16a34a;
  --brand-green-bg: #dcfce7;

  /* Semânticas */
  --alert-orange: #f59e0b;
  --error: #ef4444;

  /* Radius */
  --radius-xl: 20px;
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
}
```

---

## 📝 Notas de Implementação

- Fontes carregadas via `next/font/google` no layout
- Classes do Tailwind preferidas sobre CSS custom quando possível
- Background escuro: `bg-[#2B2D31]` para hero e seções de destaque
- Glows sutis: `bg-[#2563EB] opacity-[0.08] blur-[120px]` para assinatura visual
- Glassmorphism: `bg-white/10 backdrop-blur-sm border-white/20`
- Ícones com fundo colorido: `bg-[#2563EB]/[0.03]` ou `bg-[#22C55E]/[0.03]`
- Search sem botão visível (Enter key only) para UX minimalista
- 3 garantias de segurança: Anônimo, Moderado, Sem expor pessoas

**Última atualização**: Jan 2026 (protótipo home implementado)-brand-green: #22C55E;
--brand-orange: #F59E0B;
--brand-dark: #1F2937;

--error: #EF4444;
--info: #3B82F6;

--radius: 16px;
--radius-sm: 12px;
--radius-xs: 8px;
}

```

```
