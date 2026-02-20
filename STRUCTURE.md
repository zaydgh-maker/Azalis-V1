# Structure du Projet AZALIS V1

## 📂 Organisation des Dossiers

### `/app` - Application Next.js (App Router)

```
app/
├── api/              # API Routes (endpoints backend)
├── layout.tsx        # Layout racine de l'application
├── page.tsx          # Page d'accueil (/)
└── globals.css       # Styles globaux et variables CSS
```

**Conventions :**
- Chaque dossier dans `/app` devient une route
- `page.tsx` = page accessible publiquement
- `layout.tsx` = layout partagé pour les routes enfants
- `loading.tsx` = état de chargement
- `error.tsx` = gestion d'erreurs

### `/components` - Composants React Réutilisables

```
components/
├── ui/               # Composants UI de base (Button, Input, Card, etc.)
├── layout/           # Composants de layout (Header, Footer, Nav)
└── features/         # Composants métier (ProductCard, CartItem, etc.)
```

**Conventions :**
- Un composant = un fichier
- Nommage en PascalCase
- Props typées avec TypeScript
- Export par défaut

**Exemple :**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, variant }: ButtonProps) {
  // ...
}
```

### `/lib` - Utilitaires et Helpers

```
lib/
├── utils.ts          # Fonctions utilitaires générales
├── api.ts            # Helpers pour les appels API
├── validation.ts     # Schémas de validation
└── constants.ts      # Constantes de l'application
```

**Conventions :**
- Fonctions pures et réutilisables
- Bien typées avec TypeScript
- Documentées avec JSDoc

### `/types` - Types TypeScript

```
types/
├── index.ts          # Types généraux exportés
├── product.ts        # Types liés aux produits
├── user.ts           # Types liés aux utilisateurs
└── order.ts          # Types liés aux commandes
```

**Conventions :**
- Interfaces pour les objets
- Types pour les unions/intersections
- Enums pour les valeurs fixes

### `/public` - Assets Statiques

```
public/
├── images/           # Images du site
├── icons/            # Icônes et logos
└── fonts/            # Polices personnalisées (si nécessaire)
```

**Conventions :**
- Accessible via `/` dans le code
- Optimiser les images avant ajout
- Utiliser Next.js Image pour les images

## 🎨 Conventions de Style

### Tailwind CSS

**Classes personnalisées disponibles :**
```css
/* Couleurs */
bg-sage           /* Vert sauge #6B7D6D */
bg-cream          /* Beige crème #F4EFE7 */
bg-soft-white     /* Blanc cassé #FAF9F7 */
text-soft-black   /* Noir doux #1C1C1C */

/* Variants */
sage-light        /* #8A9B8C */
sage-dark         /* #4A5A4C */
cream-light       /* #FAF9F7 */
cream-dark        /* #E8E0D5 */
```

**Approche Mobile-First :**
```tsx
// ✅ Bon
<div className="text-sm md:text-base lg:text-lg">

// ❌ Mauvais
<div className="lg:text-lg md:text-base text-sm">
```

### TypeScript

**Typage strict :**
```typescript
// ✅ Bon
interface Product {
  id: string;
  name: string;
  price: number;
}

// ❌ Mauvais
const product: any = { ... }
```

## 🚀 Workflow de Développement

### 1. Créer une nouvelle fonctionnalité

```bash
# 1. Créer les types nécessaires
types/feature.ts

# 2. Créer les composants
components/features/FeatureComponent.tsx

# 3. Créer la page ou l'API route
app/feature/page.tsx
# ou
app/api/feature/route.ts

# 4. Tester localement
npm run dev
```

### 2. Ajouter un nouveau composant UI

```bash
# 1. Créer le composant
components/ui/NewComponent.tsx

# 2. Ajouter les types
interface NewComponentProps { ... }

# 3. Documenter avec JSDoc
/**
 * Description du composant
 * @param prop1 - Description
 */

# 4. Exporter
export default function NewComponent() { ... }
```

### 3. Créer une API Route

```bash
# 1. Créer le fichier
app/api/endpoint/route.ts

# 2. Définir les handlers
export async function GET(request: Request) { ... }
export async function POST(request: Request) { ... }

# 3. Typer les réponses
return NextResponse.json<ResponseType>({ ... })
```

## 📋 Checklist Avant Commit

- [ ] Code compilé sans erreurs (`npm run build`)
- [ ] Pas d'erreurs ESLint (`npm run lint`)
- [ ] Types TypeScript corrects
- [ ] Composants documentés
- [ ] Styles responsive testés
- [ ] Imports organisés et propres

## 🔧 Scripts NPM

```bash
npm run dev      # Développement (localhost:3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Vérification ESLint
```

## 📝 Notes Importantes

### Performance
- Utiliser `next/image` pour les images
- Lazy loading des composants lourds
- Memoization avec `useMemo` et `useCallback` si nécessaire

### SEO
- Métadonnées dans chaque page
- Structure HTML sémantique
- Balises alt sur les images

### Accessibilité
- Labels sur les formulaires
- Contraste des couleurs suffisant
- Navigation au clavier fonctionnelle

---

**Dernière mise à jour :** Février 2026
