# 🎨 AZALIS Design System

Guide complet du design system AZALIS pour maintenir la cohérence visuelle.

---

## 🎯 Philosophie Design

**Minimalisme Premium**
- Élégance et simplicité
- Espacements généreux
- Typographie raffinée
- Palette naturelle et apaisante

---

## 🎨 Palette de Couleurs

### Couleurs Principales

```css
┌─────────────────────────────────────────────────────┐
│  AZALIS GREEN   #6B7D6D   ████████████████████████ │
│  Vert sauge élégant - Titres, boutons, accents     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  AZALIS BEIGE   #F4EFE7   ████████████████████████ │
│  Beige crème doux - Background principal            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  AZALIS WHITE   #FAF9F7   ████████████████████████ │
│  Blanc cassé raffiné - Sections, cartes             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  AZALIS BLACK   #1C1C1C   ████████████████████████ │
│  Noir doux premium - Texte principal                │
└─────────────────────────────────────────────────────┘
```

### Usage des Couleurs

| Couleur | Usage Principal | Usage Secondaire |
|---------|----------------|------------------|
| **Green** | Titres H1-H6, Boutons CTA, Logo | Liens, Icônes, Accents |
| **Beige** | Background body, Sections alternées | - |
| **White** | Sections principales, Cartes, Header/Footer | Boutons secondaires |
| **Black** | Texte corps, Navigation | Titres alternatifs |

### Classes Tailwind

```tsx
// Backgrounds
bg-azalis-green
bg-azalis-beige
bg-azalis-white

// Texte
text-azalis-green
text-azalis-black
text-azalis-black/70    // 70% opacité

// Bordures
border-azalis-green
border-azalis-green/10  // 10% opacité
```

---

## ✍️ Typographie

### Polices

**Playfair Display (Serif)**
- **Usage :** Titres, headings, logo
- **Weights :** 400, 500, 600, 700
- **Classe :** `font-serif`
- **Caractère :** Élégant, classique, premium

**Inter (Sans-Serif)**
- **Usage :** Corps de texte, navigation, boutons
- **Weights :** 300, 400, 500, 600, 700
- **Classe :** `font-sans`
- **Caractère :** Moderne, lisible, polyvalent

### Hiérarchie Typographique

```tsx
// H1 - Titre principal (Hero)
<h1 className="text-5xl md:text-7xl font-serif font-semibold text-azalis-green">
  AZALIS
</h1>

// H2 - Titre de section
<h2 className="text-3xl md:text-4xl font-serif font-semibold text-azalis-green">
  Titre de section
</h2>

// H3 - Sous-titre
<h3 className="text-2xl md:text-3xl font-serif font-semibold text-azalis-green">
  Sous-titre
</h3>

// Paragraphe principal
<p className="text-lg md:text-xl text-azalis-black/70">
  Texte principal
</p>

// Paragraphe secondaire
<p className="text-base text-azalis-black/70">
  Texte secondaire
</p>

// Petit texte
<p className="text-sm text-azalis-black/60">
  Petit texte
</p>
```

### Tailles de Police

| Élément | Mobile | Desktop | Classe |
|---------|--------|---------|--------|
| H1 Hero | 3rem (48px) | 4.5rem (72px) | `text-5xl md:text-7xl` |
| H1 Page | 2.25rem (36px) | 3rem (48px) | `text-4xl md:text-5xl` |
| H2 | 1.875rem (30px) | 2.25rem (36px) | `text-3xl md:text-4xl` |
| H3 | 1.5rem (24px) | 1.875rem (30px) | `text-2xl md:text-3xl` |
| Body Large | 1.125rem (18px) | 1.25rem (20px) | `text-lg md:text-xl` |
| Body | 1rem (16px) | 1rem (16px) | `text-base` |
| Small | 0.875rem (14px) | 0.875rem (14px) | `text-sm` |

---

## 📏 Espacements

### Système d'Espacement

**Principe :** Espacements généreux pour un design aéré et premium.

### Espacements de Sections

```tsx
// Padding large (sections principales)
py-20 md:py-28 lg:py-32

// Padding moyen
py-16 md:py-20

// Padding petit
py-12

// Classes utilitaires
section-padding  // py-16 md:py-24 lg:py-32
```

### Espacements de Contenu

```tsx
// Espacement vertical entre éléments
space-y-8       // 2rem (32px)
space-y-6       // 1.5rem (24px)
space-y-4       // 1rem (16px)

// Classes utilitaires
content-spacing // space-y-6 md:space-y-8
```

### Marges et Paddings Standards

| Usage | Classe | Valeur |
|-------|--------|--------|
| Section principale | `py-20 md:py-32` | 5rem / 8rem |
| Container padding | `px-4 sm:px-6 lg:px-8` | 1rem / 1.5rem / 2rem |
| Espacement contenu | `space-y-6 md:space-y-8` | 1.5rem / 2rem |
| Gap grid | `gap-6 md:gap-8` | 1.5rem / 2rem |

---

## 🔘 Composants

### Button

**Variants disponibles :**

```tsx
// Primary (défaut)
<Button variant="primary" size="md">
  Découvrir
</Button>
// Rendu : Fond vert, texte blanc

// Secondary
<Button variant="secondary" size="md">
  En savoir plus
</Button>
// Rendu : Border vert, texte vert, hover fond vert

// Ghost
<Button variant="ghost" size="sm">
  Annuler
</Button>
// Rendu : Transparent, texte vert, hover fond vert léger
```

**Tailles :**
- `sm` : px-4 py-2 text-sm
- `md` : px-8 py-4 text-base (défaut)
- `lg` : px-10 py-5 text-lg

**Props :**
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- Tous les props HTML button

### Container

**Tailles disponibles :**

```tsx
// Small (768px)
<Container size="sm">Contenu</Container>

// Medium (1024px)
<Container size="md">Contenu</Container>

// Large (1280px) - défaut
<Container size="lg">Contenu</Container>

// Extra Large (1400px)
<Container size="xl">Contenu</Container>

// Full width
<Container size="full">Contenu</Container>
```

### Section

**Backgrounds :**

```tsx
// Beige (défaut body)
<Section background="beige">Contenu</Section>

// White (sections principales)
<Section background="white">Contenu</Section>

// Transparent
<Section background="transparent">Contenu</Section>
```

**Paddings :**

```tsx
// Large (sections principales)
<Section padding="lg">Contenu</Section>

// Medium
<Section padding="md">Contenu</Section>

// Small
<Section padding="sm">Contenu</Section>

// None
<Section padding="none">Contenu</Section>
```

---

## 🎭 Patterns de Design

### Hero Section

```tsx
<Section background="white" padding="lg">
  <Container size="md">
    <div className="text-center space-y-8">
      <h1 className="text-5xl md:text-7xl font-serif font-semibold text-azalis-green">
        AZALIS
      </h1>
      <p className="text-lg md:text-xl text-azalis-black/70">
        Le naturel sous contrôle
      </p>
      <Button variant="primary" size="md">
        Découvrir
      </Button>
    </div>
  </Container>
</Section>
```

### Section de Contenu

```tsx
<Section background="beige" padding="lg">
  <Container size="md">
    <h2 className="text-3xl md:text-4xl font-serif text-azalis-green mb-8">
      Titre de section
    </h2>
    <div className="space-y-6">
      <p className="text-base md:text-lg text-azalis-black/70">
        Paragraphe 1
      </p>
      <p className="text-base md:text-lg text-azalis-black/70">
        Paragraphe 2
      </p>
    </div>
  </Container>
</Section>
```

### Grid de Produits

```tsx
<Section background="white" padding="lg">
  <Container size="lg">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Produits ici */}
    </div>
  </Container>
</Section>
```

---

## 📱 Responsive Design

### Breakpoints Tailwind

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Tablette portrait |
| `md` | 768px | Tablette landscape |
| `lg` | 1024px | Desktop petit |
| `xl` | 1280px | Desktop large |
| `2xl` | 1536px | Desktop très large |

### Mobile-First Approach

```tsx
// ✅ Bon - Mobile d'abord
<div className="text-base md:text-lg lg:text-xl">

// ❌ Mauvais - Desktop d'abord
<div className="text-xl lg:text-lg md:text-base">
```

### Patterns Responsive Courants

```tsx
// Texte responsive
text-base md:text-lg lg:text-xl

// Padding responsive
px-4 sm:px-6 lg:px-8
py-12 md:py-16 lg:py-20

// Grid responsive
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Flex responsive
flex-col md:flex-row

// Espacement responsive
gap-4 md:gap-6 lg:gap-8
space-y-4 md:space-y-6
```

---

## 🎨 Classes Utilitaires Personnalisées

### Boutons

```css
.btn-primary
/* px-8 py-4 bg-azalis-green text-azalis-white hover:bg-azalis-green/90 */

.btn-secondary
/* px-8 py-4 border-2 border-azalis-green text-azalis-green hover:bg-azalis-green hover:text-azalis-white */
```

### Liens

```css
.link-elegant
/* text-azalis-green hover:text-azalis-green/80 underline-offset-4 hover:underline */
```

### Espacements

```css
.section-padding
/* py-16 md:py-24 lg:py-32 */

.content-spacing
/* space-y-6 md:space-y-8 */
```

---

## ✨ Animations et Transitions

### Transitions Standards

```tsx
// Durée standard
transition-colors duration-200

// Durée longue
transition-all duration-300

// Hover states
hover:bg-azalis-green/90
hover:text-azalis-green
hover:underline
```

### Effets Visuels

```tsx
// Backdrop blur (header)
backdrop-blur-sm

// Ombre douce
shadow-md

// Bordure subtile
border border-azalis-green/10
```

---

## 📐 Layout Global

### Structure HTML

```html
<html>
  <body class="bg-azalis-beige text-azalis-black">
    <div class="min-h-screen flex flex-col">
      <Header />      <!-- Sticky top -->
      <main class="flex-1">
        {children}
      </main>
      <Footer />      <!-- Auto bottom -->
    </div>
  </body>
</html>
```

### Container Système

```tsx
// Page full-width avec sections
<>
  <Section>
    <Container>Contenu</Container>
  </Section>
</>

// Page avec container global
<Container>
  <section>Contenu</section>
</Container>
```

---

## 🎯 Bonnes Pratiques

### DO ✅

- Utiliser `font-serif` pour les titres
- Utiliser `font-sans` pour le texte
- Espacements généreux (py-20, space-y-8)
- Mobile-first responsive
- Opacité pour texte secondaire (/70, /60)
- Container pour centrer le contenu
- Section pour structurer les pages

### DON'T ❌

- Mélanger serif et sans-serif dans les titres
- Espacements trop serrés
- Couleurs hors palette
- Oublier les breakpoints responsive
- Texte noir pur (#000000)
- Contenu sans container

---

## 📚 Ressources

### Fichiers de Référence

- `tailwind.config.ts` - Configuration Tailwind
- `app/globals.css` - Classes utilitaires
- `components/ui/` - Composants UI
- `PHASE2_SUMMARY.md` - Documentation complète

### Outils

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Fonts](https://fonts.google.com/)
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- [Inter](https://fonts.google.com/specimen/Inter)

---

**Version :** 1.0.0  
**Date :** 13 février 2026  
**Maintenu par :** Équipe AZALIS
