# Guide de Contribution - AZALIS V1

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd azalis-v1

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📝 Conventions de Code

### Structure des Commits

Utiliser le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

**Types :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, points-virgules manquants, etc.
- `refactor`: Refactoring du code
- `perf`: Amélioration des performances
- `test`: Ajout ou correction de tests
- `chore`: Maintenance, dépendances, config

**Exemples :**
```bash
feat(products): add product filtering by category
fix(cart): correct total calculation with discounts
docs(readme): update installation instructions
style(button): improve hover animation
refactor(api): simplify product fetching logic
```

### Branches

**Convention de nommage :**
```
<type>/<description-courte>
```

**Exemples :**
```bash
feature/product-catalog
fix/cart-total-calculation
docs/api-documentation
refactor/authentication-flow
```

**Workflow :**
```bash
# Créer une nouvelle branche depuis main
git checkout main
git pull origin main
git checkout -b feature/ma-nouvelle-feature

# Développer et commiter
git add .
git commit -m "feat(feature): add new feature"

# Pousser la branche
git push origin feature/ma-nouvelle-feature

# Créer une Pull Request sur GitHub/GitLab
```

## 🧪 Tests Avant Commit

Avant de commiter, vérifier que :

```bash
# 1. Le code compile sans erreur
npm run build

# 2. Pas d'erreurs ESLint
npm run lint

# 3. Le serveur de dev fonctionne
npm run dev
```

## 📋 Checklist Pull Request

- [ ] Le code compile sans erreurs
- [ ] Pas d'erreurs ESLint
- [ ] Les types TypeScript sont corrects
- [ ] Les composants sont documentés (JSDoc)
- [ ] Le code est responsive (mobile, tablet, desktop)
- [ ] Les imports sont organisés
- [ ] Pas de console.log oubliés
- [ ] Les variables d'environnement sont documentées dans `.env.example`
- [ ] Le README est à jour si nécessaire

## 🎨 Style Guide

### TypeScript

```typescript
// ✅ Bon - Types explicites
interface Product {
  id: string;
  name: string;
  price: number;
}

function getProduct(id: string): Product | null {
  // ...
}

// ❌ Mauvais - any et types implicites
function getProduct(id: any) {
  // ...
}
```

### React Components

```typescript
// ✅ Bon - Composant typé avec JSDoc
/**
 * Bouton réutilisable avec variants
 * @param variant - Style du bouton
 * @param children - Contenu du bouton
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export default function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={...}>{children}</button>;
}

// ❌ Mauvais - Props non typées
export default function Button({ variant, children }) {
  return <button>{children}</button>;
}
```

### Tailwind CSS

```tsx
// ✅ Bon - Mobile-first, classes organisées
<div className="
  flex flex-col gap-4
  p-4 md:p-6 lg:p-8
  bg-cream text-soft-black
  rounded-lg shadow-md
">

// ❌ Mauvais - Classes désorganisées
<div className="flex bg-cream rounded-lg p-4 flex-col text-soft-black gap-4 shadow-md md:p-6 lg:p-8">
```

### Imports

```typescript
// ✅ Bon - Imports organisés
// 1. React et Next.js
import { useState } from 'react';
import Image from 'next/image';

// 2. Bibliothèques externes
import { formatDate } from 'date-fns';

// 3. Composants internes
import Button from '@/components/ui/Button';
import ProductCard from '@/components/features/ProductCard';

// 4. Types
import type { Product } from '@/types';

// 5. Styles
import './styles.css';

// ❌ Mauvais - Imports désorganisés
import './styles.css';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import { useState } from 'react';
```

## 🐛 Signaler un Bug

Utiliser les GitHub Issues avec le template suivant :

```markdown
**Description du bug**
Description claire et concise du bug.

**Étapes pour reproduire**
1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Description de ce qui devrait se passer.

**Screenshots**
Si applicable, ajouter des screenshots.

**Environnement**
- OS: [e.g. Windows 11]
- Navigateur: [e.g. Chrome 120]
- Version Node: [e.g. 18.17.0]
```

## 💡 Proposer une Fonctionnalité

Utiliser les GitHub Issues avec le template suivant :

```markdown
**Problème à résoudre**
Description claire du problème que cette fonctionnalité résoudrait.

**Solution proposée**
Description de la solution envisagée.

**Alternatives considérées**
Autres solutions envisagées et pourquoi elles ne conviennent pas.

**Contexte additionnel**
Tout autre contexte ou screenshots pertinents.
```

## 📚 Ressources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev/)

### Outils
- [Cursor IDE](https://cursor.sh/)
- [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)

## 🤝 Code de Conduite

- Être respectueux et professionnel
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour le projet
- Faire preuve d'empathie envers les autres contributeurs

---

**Merci de contribuer à AZALIS V1 ! 🌿**
