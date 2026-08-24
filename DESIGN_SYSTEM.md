# Global Imobiliária — Sistema de Design Visual

## Filosofia

A identidade visual da Global Imobiliária transmite **confiança, profissionalismo, qualidade premium e modernidade** através de uma linguagem visual consistente, limpa e acessível.

---

## CORES

### Paleta Principal

- **Primary Blue (Azul Institucional)**: `#006cd0` (brand-600)
  - Utilizado em: botões principais, links, elementos de navegação ativos, ícones de destaque, títulos de CTA
  - Comunica: confiança, profissionalismo, institucionalidade

### Neutros

- **Background**: Branco (`#ffffff`)
- **Surface 1**: Cinza muito claro (`#f9fafb` / slate-50)
- **Text Primary**: Cinza muito escuro (`#111827` / slate-900)
- **Text Secondary**: Cinza médio (`#4b5563` / slate-600)
- **Text Tertiary**: Cinza claro (`#9ca3af` / slate-400)
- **Borders**: Cinza 200 (`#e5e7eb` / slate-200)

### Estados de Comunicação

- **Sucesso / Publicado**: Verde esmeralda (`#059669` / emerald-600)
  - Badges: fundo emerald-100, texto emerald-700
  - Significado: ativo, autorizado, confirmado

- **Atenção / Pendente**: Amarelo âmbar (`#d97706` / amber-600)
  - Badges: fundo amber-100, texto amber-700
  - Significado: requer ação, em processamento

- **Erro / Rejeitado**: Vermelho (`#dc2626` / red-600)
  - Badges: fundo red-100, texto red-700
  - Significado: bloqueado, inválido, requer correção

- **Informação**: Azul claro (`#2563eb` / blue-600)
  - Badges: fundo blue-100, texto blue-700
  - Significado: informativo, secundário

- **Arquivado / Inativo**: Cinza (`#6b7280` / slate-600)
  - Badges: fundo slate-100, texto slate-700
  - Significado: desativado, histórico

### Cores de Ações

- **Ouro/Secundário** (btn-gold): `#d98e2b` — usado em CTAs secundários com destaque
- **Perigo** (btn-danger): `#dc2626` — ações destrutivas

---

## TIPOGRAFIA

### Família de Fontes

- **Display (Títulos)**: Playfair Display — serif premium e elegante, transmite sofisticación e confianza
- **Sans-serif (Corpo)**: Inter — moderna, limpa e altamente legible
- **Mono** (referências, códigos): Fonte monoespacial do sistema

### Hierarquia

```
Display-1: 5xl (48px) / 6xl (60px)
    font-family: Playfair Display
    font-weight: bold
    text-slate-900
    tracking-tight
    Uso: Hero sections, headlines principais

Display-2: 4xl (36px) / 5xl (48px)
    font-family: Playfair Display
    font-weight: bold
    text-slate-900
    tracking-tight
    Uso: Títulos de seção, headlines

Display-3: 3xl (30px) / 4xl (36px)
    font-family: Playfair Display
    font-weight: bold
    text-slate-900
    tracking-tight
    Uso: Títulos de subsecção

H1: 4xl (36px) / 5xl (48px)
    font-family: Playfair Display
    font-weight: bold
    text-slate-900
    tracking-tight
    Uso: Título principal de página

H2: 3xl (30px) / 4xl (36px)
    font-family: Playfair Display
    font-weight: bold
    text-slate-900
    tracking-tight
    Uso: Títulos de seção

H3: 2xl (24px)
    font-family: Playfair Display
    font-weight: bold
    text-slate-900
    tracking-tight
    Uso: Títulos de subsecção

H4: xl (20px)
    font-family: Playfair Display
    font-weight: semibold
    text-slate-900
    Uso: Títulos em cards

Body: base (16px)
    font-family: Inter
    font-weight: normal
    text-slate-900
    line-height: relaxed
    Uso: Texto principal, conteúdo

Small: sm (14px)
    font-family: Inter
    font-weight: normal
    text-slate-600
    Uso: Texto secundário, descrições

Label: sm (14px)
    font-family: Inter
    font-weight: medium
    text-slate-700
    Uso: Labels de formulários

Meta: xs (12px)
    font-family: Inter
    text-slate-500
    Uso: Informações auxiliares, timestamps
```

---

## COMPONENTES

### Botões

#### Primary Button (`.btn-primary`)
```
Fundo: brand-600 (#006cd0)
Texto: branco
Padding: 2.5 (py) × 4 (px)
Border Radius: lg (8px)
Hover: brand-700
Active: brand-800
Focus: ring-2 ring-offset-2 ring-brand-500
Sombra: shadow-sm com hover:shadow-md
Fonte: semibold, 14px
```

#### Secondary Button (`.btn-secondary`)
```
Fundo: white
Texto: slate-700
Borda: 1px slate-300
Padding: 2.5 (py) × 4 (px)
Border Radius: lg (8px)
Hover: bg-slate-50
Active: bg-slate-100
Focus: ring-slate-400
```

#### Ghost Button (`.btn-ghost`)
```
Fundo: transparent
Texto: slate-700
Hover: bg-slate-100
Sem borda
```

#### Danger Button (`.btn-danger`)
```
Fundo: red-600
Texto: branco
Hover: red-700
Ações destrutivas
```

### Cards (`.card`)
```
Borda: 1px slate-200
Fundo: white
Border Radius: xl (12px)
Padding: varia (p-5 a p-8)
Sombra: shadow-sm (sempre presente)
Hover: shadow-md (transição suave)
Transição: 200ms
```

### Inputs e Formulários

#### Input (`.input`)
```
Borda: 1px slate-300
Fundo: white
Padding: 2.5 (py) × 3.5 (px)
Border Radius: lg (8px)
Texto: slate-900
Placeholder: slate-400
Focus: border-brand-500, ring-2 ring-brand-500/20
Sombra: shadow-sm
```

#### Label (`.label`)
```
Tamanho: sm (14px)
Peso: medium
Cor: slate-700
Margin-bottom: 1.5 (6px)
```

### Badges (Status)

```
Border Radius: full (rounded-full)
Padding: 1 (py) × 3 (px)
Tamanho: xs (12px)
Peso: semibold

.badge-green    → bg-emerald-100, text-emerald-700
.badge-yellow   → bg-amber-100, text-amber-700
.badge-red      → bg-red-100, text-red-700
.badge-blue     → bg-blue-100, text-blue-700
.badge-gray     → bg-slate-100, text-slate-700
.badge-purple   → bg-purple-100, text-purple-700
```

---

## ESPAÇAMENTO

- **Xs**: 0.25rem (4px)
- **Sm**: 0.5rem (8px)
- **Base**: 1rem (16px)
- **Lg**: 1.5rem (24px)
- **Xl**: 2rem (32px)
- **2Xl**: 3rem (48px)
- **3Xl**: 4rem (64px)

### Padrões de Spacing

- **Entre elementos**: lg (24px)
- **Dentro de cards**: lg a xl (24px a 32px)
- **Padding de página**: lg a 2xl (24px a 48px)
- **Gap entre grid**: 6 (24px)

---

## SOMBRAS

- **sm**: `0 1px 2px 0 rgba(0,0,0,0.05)` (padrão)
- **md**: `0 4px 6px -1px rgba(0,0,0,0.1)` (hover em cards)
- **lg**: `0 10px 15px -3px rgba(0,0,0,0.1)` (modais, overlays)

**Transição**: 200ms ease-in-out

---

## LAYOUTS

### Container Principal
```
Max-width: 7xl (80rem)
Padding horizontal: 4 (16px) / 6 (24px) / 8 (32px)
Class: `.container-page`
```

### Hero Section
```
Fundo: Gradiente brand-900 → brand-700
Padding: 24px (py) a 32px (py)
Texto: white
Texto secundário: brand-100
```

### Seções Alternadas
- Seção 1: bg-white
- Seção 2: bg-slate-50
- Padrão: Alternância para leitura visual

### Grid de Cards
- 1 coluna: mobile
- 2 colunas: tablet (sm:)
- 3 colunas: desktop (lg:)
- Gap: 6 (24px)

---

## ESTADOS DE INTERAÇÃO

### Hover
- Botões primários: darken +1 shade
- Cards: shadow-sm → shadow-md
- Links: text color +1 shade
- Transição: 200ms

### Focus
- Ring: 2px offset
- Ring color: brand-500 (primários), slate-400 (secundários)
- Focus-visible no teclado

### Active
- Botões: darken +2 shades
- Transição: imediata (0ms)

### Disabled
- Opacity: 50%
- Cursor: not-allowed

---

## EXEMPLO DE USO CONSISTENTE

### Página de Detalhe de Imóvel

```tsx
<div className="min-h-screen bg-white py-12">
  <div className="container-page">
    <h1 className="text-4xl font-bold text-slate-900">
      Encontre seu imóvel perfeito
    </h1>
    <p className="mt-3 text-lg text-slate-600">
      Descrição secundária
    </p>

    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Título da seção
        </h2>
        <p className="mt-4 text-base text-slate-700">
          Conteúdo principal
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Texto secundário
        </p>
      </div>
    </div>

    <button className="btn-primary mt-8">
      Ação principal
    </button>
  </div>
</div>
```

---

## ACESSIBILIDADE

- **Contraste**: Todos os textos têm razão de contraste ≥ 4.5:1
- **Focus**: Visible em todos os elementos interativos
- **Semântica**: Uso correto de tags h1-h6, labels em inputs
- **Cores**: Não é a única forma de comunicação (usar ícones + cores)

---

## IMPLEMENTAÇÃO

1. **Globais**: Cores, tipografia e componentes base em `globals.css`
2. **Tailwind**: Usa classes do Tailwind com tema customizado
3. **Consistência**: Todas as páginas herdam os mesmos estilos
4. **Manutenção**: Alterações centralizadas em um único arquivo

---

**Última atualização**: Agosto 2026
**Aplicado a**: Global Imobiliária MVP
