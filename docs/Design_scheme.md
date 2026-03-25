
````md
# 🎯 Design System — JobReviewers (v2)

> Transparência com responsabilidade.  
Sistema visual focado em **clareza, confiança e legibilidade** para um produto centrado em reviews.


## 🎨 Paleta de Cores

### 🌿 Base (Light UI)

```css
/* Background */
--bg-base: #FAFAFA;        /* Fundo principal (off-white) */
--bg-surface: #FFFFFF;     /* Cards e superfícies */
--bg-subtle: #F8FAFC;      /* Seções leves (quase invisível) */

/* Borders */
--border: #E2E8F0;

/* Text */
--text-primary: #0F172A;
--text-secondary: #475569;
--text-muted: #94A3B8;
````

---

### 🔵 Cores de Marca

```css
--brand-primary: #2563EB;       /* Azul - confiança */
--brand-primary-hover: #1D4ED8;

--brand-accent: #7C3AED;        /* Roxo - tecnologia / destaque */

--brand-success: #10B981;       /* Verde - verificado */
--brand-success-bg: #DCFCE7;
```

---

### ⚠️ Semânticas

```css
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #2563EB;
```


## 🧠 Direção Visual

### Conceito

> Uma única superfície contínua com elementos emergindo dela.

### Princípios

* Fundo único (sem “quebras” pesadas)
* Separação por:

  * espaçamento
  * tipografia
  * contraste leve
* Cards com leve elevação
* Design focado em leitura (reviews são o core)

## 🔧 Componentes

### 🔘 Botões

#### Primary

* Background: `--brand-primary`
* Hover: `--brand-primary-hover`
* Text: `#FFFFFF`
* Radius: `12px`
* Height: `48px`
* Uso: CTAs principais

---

#### Secondary

* Background: transparente
* Border: `1px solid --border`
* Text: `--text-primary`
* Hover: leve bg `#F1F5F9`

---

#### Ghost

* Background: transparente
* Text: `--text-secondary`
* Hover: `#F8FAFC`

---

#### Danger

* Background: `--error`
* Text: `#FFFFFF`

---

### 🧱 Cards

#### Default Card

* Background: `--bg-surface`
* Border: `1px solid --border`
* Radius: `20px`
* Padding: `24px`
* Shadow:

```css
0 10px 30px rgba(0, 0, 0, 0.05)
```

---

#### Highlight Card (Review principal)

* Padding: `28px`
* Shadow:

```css
0 20px 50px rgba(0, 0, 0, 0.08)
```

👉 Usado para:

* preview de review
* foco do produto

---

### 🏷 Badges

* **Verificado**

  * bg: `--brand-success-bg`
  * text: `--brand-success`

* **Info**

  * bg: `#EEF2FF`
  * text: `--brand-primary`

* **Neutro**

  * bg: `#F1F5F9`
  * text: `--text-secondary`

---

### ⭐ Ratings

* Ativo: `#F59E0B`
* Inativo: `#CBD5F5`

---

### 🔍 Inputs

#### Default

* Background: `--bg-surface`
* Border: `--border`
* Radius: `12px`
* Focus:

```css
ring: 2px solid rgba(37, 99, 235, 0.2)
```

---

## 📐 Tipografia

### Fontes

* **Sora** → títulos
* **Inter** → corpo

---

### Hierarquia

```
H1:
48px / bold / Sora

H2:
32px / semibold / Sora

H3:
24px / semibold / Sora

Body:
16px / regular / Inter

Small:
14px / Inter

Micro:
12px / Inter
```

---

## 📏 Layout e Espaçamento

### Grid

* Max width: `1200px`
* 12 colunas
* gutter: `24px`

---

### Espaçamento

* Seções: `96px – 120px`
* Elementos: `16 / 24 / 32px`

---

### Container

```css
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;
```

---

## 🌈 Background Strategy

### Base

```css
background: #FAFAFA;
```

---

### Gradientes sutis (opcional)

```css
background:
radial-gradient(circle at 20% 0%, #e0e7ff, transparent 40%),
radial-gradient(circle at 80% 20%, #ede9fe, transparent 40%),
#FAFAFA;
```

---

### CTA Section

```css
background: linear-gradient(to right, #EEF2FF, #F5F3FF);
```

---

## 🎯 Regras de Uso

### ✅ Fazer

* Priorizar legibilidade
* Usar azul para ação/confiança
* Usar verde para validação
* Usar espaços ao invés de blocos pesados
* Destacar reviews como elemento principal

---

### ❌ Evitar

* Seções com fundo pesado e separado
* Muitos gradientes
* UI fragmentada
* Cores saturadas demais
* Estilo “landing genérica”

---

## 🧩 Componentes-chave do produto

### Review Card (CORE)

Deve conter:

* Empresa
* Nota
* Cargo
* Modelo (remoto/presencial)
* Prós
* Contras
* Conselho
* Badge verificado

👉 Elemento mais importante do sistema

---

### Company Card

```tsx
interface CompanyCardProps {
  name: string;
  rating: number;
  reviewCount: number;
  location?: string;
}
```


## 🏗 Organização no Figma

### Página 1 — Foundations

* Colors
* Typography
* Spacing

### Página 2 — Components

* Buttons
* Cards
* Badges
* Inputs
* Review Card

### Página 3 — Landing

* Hero
* Problema
* Solução
* Como funciona
* Review preview
* Segurança
* CTA

---

## 📝 Notas de Implementação

* Tailwind como base
* Evitar CSS custom desnecessário
* Sombras leves
* Transições suaves:

```css
transition: all 0.2s ease;
```

---

## 🧠 Filosofia Final

> O design não deve chamar mais atenção que o conteúdo.

O objetivo do JobReviewers é parecer:

* confiável
* útil
* honesto
* claro

---

**Última atualização:** Março 2026

```

---

Se quiser, posso agora:
👉 transformar isso em **tailwind.config.js pronto**  
👉 ou já integrar com seu projeto Next.js direto

Só falar 🚀
```
