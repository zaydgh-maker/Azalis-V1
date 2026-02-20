# 🚀 Guide de Démarrage Rapide - AZALIS V1

## ✅ Projet Initialisé avec Succès !

Votre projet Next.js 14 est prêt à être utilisé.

## 📦 Ce qui a été configuré

- ✅ Next.js 14 avec App Router
- ✅ TypeScript (strict mode)
- ✅ Tailwind CSS avec palette personnalisée AZALIS
- ✅ ESLint
- ✅ Structure de dossiers professionnelle
- ✅ Page d'accueil minimaliste
- ✅ Composants de base (Button)
- ✅ Utilitaires (formatPrice, formatDate, cn)
- ✅ Types TypeScript de base
- ✅ Documentation complète

## 🎨 Palette de Couleurs AZALIS

```css
Vert sauge : #6B7D6D (sage)
Beige crème : #F4EFE7 (cream)
Blanc cassé : #FAF9F7 (soft-white)
Noir doux   : #1C1C1C (soft-black)
```

Utilisation dans Tailwind :
```tsx
<div className="bg-sage text-soft-white">
<div className="bg-cream text-soft-black">
```

## 🚀 Commandes Essentielles

### Développement

```bash
# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build Production

```bash
# Compiler pour la production
npm run build

# Lancer en mode production
npm start
```

### Linting

```bash
# Vérifier le code avec ESLint
npm run lint
```

## 📁 Structure des Dossiers

```
azalis-v1/
├── app/                    # Pages et routes (App Router)
│   ├── api/               # API endpoints
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
│   └── Button.tsx         # Exemple de composant
├── lib/                   # Utilitaires et helpers
│   └── utils.ts           # Fonctions utilitaires
├── types/                 # Types TypeScript
│   └── index.ts           # Types de base
├── public/                # Assets statiques
└── Documentation/
    ├── README.md          # Vue d'ensemble du projet
    ├── STRUCTURE.md       # Structure détaillée
    ├── ROADMAP.md         # Feuille de route
    ├── CONTRIBUTING.md    # Guide de contribution
    └── GIT_SETUP.md       # Configuration Git
```

## 🎯 Prochaines Étapes

### 1. Tester le Projet

```bash
# Le serveur de développement devrait déjà être lancé
# Sinon, lancez :
npm run dev
```

Visitez [http://localhost:3000](http://localhost:3000) pour voir la page d'accueil.

### 2. Créer Votre Premier Composant

```bash
# Créer un nouveau composant dans components/
# Par exemple : components/ui/Card.tsx
```

Exemple de composant :

```typescript
// components/ui/Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-soft-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-sage mb-4">{title}</h2>
      {children}
    </div>
  );
}
```

### 3. Créer une Nouvelle Page

```bash
# Créer un nouveau dossier dans app/
# Par exemple : app/products/page.tsx
```

Exemple de page :

```typescript
// app/products/page.tsx
export default function ProductsPage() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-sage mb-8">
        Nos Produits
      </h1>
      <p className="text-lg text-sage/80">
        Découvrez notre sélection de produits naturels.
      </p>
    </div>
  );
}
```

La page sera accessible sur [http://localhost:3000/products](http://localhost:3000/products)

### 4. Créer une API Route

```bash
# Créer une route API dans app/api/
# Par exemple : app/api/products/route.ts
```

Exemple d'API route :

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const products = [
    { id: '1', name: 'Produit 1', price: 2999 },
    { id: '2', name: 'Produit 2', price: 3999 },
  ];
  
  return NextResponse.json(products);
}
```

Accessible sur [http://localhost:3000/api/products](http://localhost:3000/api/products)

## 🔧 Configuration Git (Optionnel)

Si Git n'est pas encore configuré, suivez le guide dans `GIT_SETUP.md` :

```bash
# Initialiser Git
git init

# Premier commit
git add .
git commit -m "chore: initial project setup"
```

## 📚 Documentation Disponible

- **README.md** : Vue d'ensemble et installation
- **STRUCTURE.md** : Structure détaillée du projet et conventions
- **ROADMAP.md** : Feuille de route complète (12 phases)
- **CONTRIBUTING.md** : Guide de contribution et bonnes pratiques
- **GIT_SETUP.md** : Configuration et utilisation de Git
- **QUICKSTART.md** : Ce guide de démarrage rapide

## 💡 Conseils

### Développement

1. **Hot Reload** : Les modifications sont automatiquement rechargées
2. **TypeScript** : Utilisez des types stricts pour éviter les bugs
3. **Tailwind** : Approche mobile-first (sm, md, lg, xl)
4. **Composants** : Créez des composants réutilisables

### Organisation

1. **Un composant = un fichier**
2. **Types dans /types**
3. **Utilitaires dans /lib**
4. **Pages dans /app**

### Performance

1. Utilisez `next/image` pour les images
2. Lazy loading des composants lourds
3. Évitez les re-renders inutiles

## 🆘 Besoin d'Aide ?

### Erreurs Courantes

**Port 3000 déjà utilisé :**
```bash
# Utiliser un autre port
npm run dev -- -p 3001
```

**Erreurs TypeScript :**
```bash
# Vérifier les types
npm run build
```

**Erreurs ESLint :**
```bash
# Vérifier le code
npm run lint
```

### Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## ✨ Fonctionnalités Actuelles

### Page d'Accueil
- Design minimaliste et élégant
- Fond beige crème (#F4EFE7)
- Titre "AZALIS" centré
- Sous-titre "Le naturel sous contrôle"
- Responsive (mobile, tablet, desktop)

### Composants
- **Button** : Composant bouton avec variants (primary, secondary, outline) et tailles (sm, md, lg)

### Utilitaires
- **formatPrice** : Formate un prix en euros
- **formatDate** : Formate une date en français
- **cn** : Combine des classes CSS conditionnellement

### Types
- **Product** : Interface pour les produits
- **User** : Interface pour les utilisateurs
- **Order** : Interface pour les commandes

## 🎯 Objectif Atteint

✅ **Base propre et stable pour démarrer le développement**

Le projet est prêt pour :
- Ajouter de nouvelles pages
- Créer des composants
- Intégrer Supabase (Phase 3)
- Intégrer Stripe (Phase 5)
- Développer la logique métier

---

**Bon développement ! 🌿**

**Version :** 0.1.0  
**Date :** Février 2026
