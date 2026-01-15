# Design System — JobReviewers

> Guia visual baseado no logo JR (verde/laranja). UI neutra e profissional para transmitir confiança e anonimato responsável.

---

## 🎨 Paleta de Cores

### Neutros (Base)

```css
--bg-0:           #F6F7F8  /* App background */
--bg-1:           #FFFFFF  /* Cards/Surface */
--border:         #E5E7EB  /* Dividers */

--text-primary:   #111827  /* Títulos */
--text-secondary: #6B7280  /* Subtítulos */
--text-muted:     #9CA3AF  /* Metadados */
--icon-default:   #374151  /* Ícones */
```

### Marca (Brand)

```css
--brand-green:    #22C55E  /* Positivo, verificado */
--brand-orange:   #F59E0B  /* Atenção, ratings */
--brand-dark:     #1F2937  /* Logo JR */
--brand-gradient: linear-gradient(90deg, #22C55E, #F59E0B)
```

### Semânticas

```css
--success:  #22C55E  /* = brand-green */
--warning:  #F59E0B  /* = brand-orange */
--error:    #EF4444  /* Destrutivo */
--info:     #3B82F6  /* Informativo */
```

---

## 🔧 Componentes

### Botões

**Primary**
- Background: `--brand-gradient`
- Text: `#FFFFFF`
- Radius: `12px`
- Uso: CTA principal ("Escrever Review")

**Secondary**
- Background: `--bg-1`
- Border: `--border`
- Text: `--text-primary`

**Danger**
- Background: `--error`
- Text: `#FFFFFF`
- Uso: Excluir, ocultar

### Cards

- Background: `--bg-1`
- Border: `--border`
- Radius: `16px`
- Shadow: `0 1px 3px rgba(0,0,0,0.05)`
- Destaque opcional: border-left `2-4px` verde/laranja

### Inputs

- Background: `--bg-1`
- Border: `--border`
- Focus ring: `--brand-green` com opacity
- Radius: `8px`

### Badges

**Verificado**: bg `green/15%` + text `--brand-green`  
**Aviso**: bg `orange/15%` + text `--brand-orange`  
**Neutro**: bg `--bg-0` + text `--text-secondary`

### Ratings (Estrelas)

- Ativa: `--brand-orange`
- Inativa: `--border`

---

## 📐 Tipografia

**Fonte**: Inter (ou system-ui)

```
H1: 32px / bold
H2: 24px / semibold
H3: 18px / semibold
Body: 14-16px / regular
Small: 12px (metadados)
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

### ❌ Evitar
- Verde/laranja como fundo principal
- Cores saturadas em áreas grandes
- Texto longo com cores da marca
- Gradientes excessivos

---

## 🖼️ Logo

**Full**: Navbar desktop  
**Icon (JR)**: Mobile, favicon, loading

Fundo preferencial: `--bg-0` ou branco

---

## 💻 Tokens CSS

```css
:root {
  --bg-0: #F6F7F8;
  --bg-1: #FFFFFF;
  --border: #E5E7EB;
  
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  
  --brand-green: #22C55E;
  --brand-orange: #F59E0B;
  --brand-dark: #1F2937;
  
  --error: #EF4444;
  --info: #3B82F6;
  
  --radius: 16px;
  --radius-sm: 12px;
  --radius-xs: 8px;
}
```
