# AZALIS V1

> E-commerce de produits naturels et éco-responsables

## 🎯 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm

## 🎨 Palette de Couleurs

```css
Vert sauge: #6B7D6D
Beige crème: #F4EFE7
Blanc cassé: #FAF9F7
Noir doux: #1C1C1C
```

## 📁 Structure du Projet

```
azalis-v1/
├── app/                    # App Router Next.js 14
│   ├── api/               # API Routes
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et helpers
├── types/                 # Types TypeScript
├── public/                # Assets statiques
├── tailwind.config.ts     # Configuration Tailwind
├── tsconfig.json          # Configuration TypeScript
└── next.config.js         # Configuration Next.js
```

## 🚀 Installation

### Prérequis

- Node.js 18.17 ou supérieur
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

## 💻 Commandes Disponibles

### Développement

Lance le serveur de développement sur [http://localhost:3000](http://localhost:3000)

```bash
npm run dev
```

### Build Production

Compile l'application pour la production

```bash
npm run build
```

### Démarrer en Production

Lance l'application compilée

```bash
npm start
```

### Linting

Vérifie le code avec ESLint

```bash
npm run lint
```

## 🏗️ Architecture

### Approche Mobile-First

Le projet utilise une approche mobile-first avec Tailwind CSS. Les breakpoints sont :

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Container Centré

Le layout principal utilise un container centré avec une largeur maximale de `7xl` (1280px) et des paddings responsives.

### Composants

Les composants suivent une structure claire :

- **Composants UI** : Boutons, cartes, inputs, etc.
- **Composants Layout** : Header, Footer, Navigation
- **Composants Métier** : Produits, panier, checkout

## 📝 Conventions de Code

### TypeScript

- Utiliser des types explicites
- Éviter `any`
- Préférer les interfaces pour les objets

### Composants React

- Composants fonctionnels avec TypeScript
- Props typées avec des interfaces
- Utiliser les hooks React appropriés

### Styling

- Classes Tailwind en priorité
- Variables CSS pour les couleurs personnalisées
- Mobile-first responsive design

## ✅ Fonctionnalités Complètes

- ✅ Catalogue de produits dynamique (Supabase)
- ✅ Panier d'achat avec persistence (localStorage)
- ✅ Checkout avec validation
- ✅ Paiement à la livraison (COD)
- ✅ Paiement par carte (Stripe)
- ✅ Webhooks Stripe
- ✅ Admin panel sécurisé
- ✅ Gestion des commandes
- ✅ Gestion des produits
- ✅ Export CSV

## 🔐 Admin Panel

### Accès

**URL** : http://localhost:3000/admin/login

### Configuration

⚠️ **Configuration requise** : Voir `ADMIN_SETUP.md`

**Étapes rapides** :
1. Exécuter `supabase/admin-setup.sql` dans Supabase Dashboard
2. Créer un utilisateur dans Authentication > Users
3. Ajouter l'utilisateur dans `admin_users`
4. Se connecter sur `/admin/login`

### Fonctionnalités

- 📊 Dashboard avec statistiques
- 📦 Gestion des commandes (liste, détails, statuts)
- 🛍️ Gestion des produits (stock, suppression)
- 🔍 Filtres et recherche
- 📥 Export CSV

## 🔜 Prochaines Étapes

- [ ] Emails & notifications
- [ ] Espace client
- [ ] Optimisation & SEO
- [ ] Tests & qualité
- [ ] Déploiement

## 📄 License

Propriétaire - AZALIS 2026

---

**Version**: 0.8.0  
**Dernière mise à jour**: Février 2026

---

## 📚 Documentation

- **`ADMIN_SETUP.md`** - Configuration admin panel
- **`STRIPE_SETUP.md`** - Configuration Stripe
- **`ROADMAP.md`** - Feuille de route complète
- **`CHANGELOG.md`** - Historique des versions
- **`PHASE8_INSTRUCTIONS.md`** - Instructions de configuration
