# Changelog - AZALIS V1

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### À venir
- Espace client
- Emails transactionnels
- Optimisation & SEO

## [0.8.0] - 2026-02-13

### ✨ Ajouté

#### Admin Panel Sécurisé
- **Middleware** (`middleware.ts`) :
  - Protection des routes `/admin/*` côté serveur
  - Vérification de l'authentification avec Supabase Auth
  - Vérification du rôle admin dans la table `admin_users`
  - Redirection automatique vers login si non autorisé
  
- **Helpers Authentification** (`lib/supabase-auth.ts`) :
  - `createServerAuthClient()` : Client Supabase pour Server Components
  - `getServerUser()` : Récupérer l'utilisateur connecté
  - `isAdmin()` : Vérifier si l'utilisateur est admin
  - `getUserRole()` : Récupérer le rôle de l'utilisateur
  
- **Page Login Admin** (`app/admin/login/page.tsx`) :
  - Formulaire email + mot de passe
  - Connexion via Supabase Auth
  - Vérification du rôle admin
  - Messages d'erreur clairs
  - Suspense boundary pour useSearchParams()
  
- **Dashboard Admin** (`app/admin/dashboard/page.tsx`) :
  - Statistiques clés (commandes, CA, stock faible)
  - Commandes récentes
  - Protection serveur-side
  
- **Gestion des Commandes** :
  - Liste complète (`app/admin/orders/page.tsx`)
  - Filtres (statut, paiement, recherche)
  - Export CSV
  - Détail avec changement de statut (`app/admin/orders/[id]/page.tsx`)
  
- **Gestion des Produits** (`app/admin/products/page.tsx`) :
  - Liste avec grille responsive
  - Modifier le stock (inline)
  - Supprimer un produit

#### Composants Admin
- **AdminNav** : Navigation avec logo, liens, infos utilisateur, déconnexion
- **StatsCards** : Cartes de statistiques colorées
- **OrdersTable** : Tableau des commandes avec badges statuts
- **OrdersListClient** : Liste avec filtres et export CSV
- **OrderDetailClient** : Détail avec changement de statut
- **ProductsListClient** : Liste produits avec actions

#### Base de Données
- **Table `admin_users`** :
  - Stockage des utilisateurs admin avec rôles
  - Rôles : `admin` et `super_admin`
  - Lien avec `auth.users` via foreign key
  
- **Row Level Security (RLS)** :
  - Politiques strictes sur `admin_users`
  - Seuls les admins peuvent lire
  - Seuls les super_admins peuvent modifier
  
- **Fonction Helper** :
  - `is_admin(user_id)` : Vérifier si un utilisateur est admin
  
- **Trigger** :
  - Mise à jour automatique de `updated_at`

### 🔄 Modifié

- **`lib/utils.ts`** :
  - `formatDate()` accepte maintenant `Date | string`
  - Ajout de l'heure et des minutes dans le format

### 📚 Documentation

- **ADMIN_SETUP.md** : Guide complet de configuration admin
- **PHASE8_SUMMARY.md** : Documentation technique complète
- **PHASE8_QUICKSTART.md** : Guide rapide
- **CHANGELOG.md** : Ajout de la version 0.8.0

### 🔒 Sécurité

- Protection multi-niveaux (middleware + server components + RLS)
- Authentification Supabase Auth
- Vérification des rôles
- Pas d'accès public aux routes admin

## [0.7.0] - 2026-02-13

### ✨ Ajouté

#### Intégration Stripe Complète
- **Configuration Stripe** (`lib/stripe.ts`) :
  - Client serveur avec secret key (pour API routes uniquement)
  - Clé publique pour Stripe.js côté client
  - Webhook secret pour validation
  - Helpers `isStripeConfigured()` et `isStripeWebhookConfigured()`
  - Gestion des placeholders pour éviter les erreurs de build
  
- **API Create Stripe Session** (`app/api/create-stripe-session/route.ts`) :
  - Validation stricte côté serveur
  - Recalcul du total à partir des prix Supabase (sécurité)
  - Vérification du stock avant paiement
  - Création de session Stripe Checkout
  - Line items avec images produits
  - Métadonnées client (nom, téléphone, ville, adresse)
  - Expiration de session (30 minutes)
  - Gestion d'erreurs robuste
  
- **API Webhook Stripe** (`app/api/stripe-webhook/route.ts`) :
  - Vérification de la signature webhook
  - Traitement de `checkout.session.completed`
  - Traitement de `payment_intent.succeeded`
  - Traitement de `payment_intent.payment_failed`
  - Création de commande avec status = 'paid'
  - Mise à jour automatique du stock
  - Logs détaillés pour debug
  
- **Documentation Stripe** (`STRIPE_SETUP.md`) :
  - Guide complet de configuration
  - Instructions pour Stripe CLI
  - Cartes de test
  - Dépannage
  - Sécurité

#### Nouveaux Statuts de Commande
- `paid` : Paiement réussi (carte)
- `payment_failed` : Paiement échoué (carte)

#### Colonnes Supabase
- `stripe_session_id` : ID de la session Stripe Checkout
- `stripe_payment_intent_id` : ID du PaymentIntent Stripe

### 🔄 Modifié

- **Page Checkout** (`app/checkout/page.tsx`) :
  - Ajout du choix du mode de paiement (COD ou carte)
  - Deux cartes cliquables avec radio buttons
  - Badge "Sécurisé" pour le paiement par carte
  - Icônes Visa et Mastercard
  - Redirection vers Stripe Checkout si carte sélectionnée
  - Création de commande directe si COD sélectionné
  
- **Schéma Supabase** (`supabase/schema.sql`) :
  - Ajout des colonnes `stripe_session_id` et `stripe_payment_intent_id`
  - Ajout des statuts `paid` et `payment_failed`
  - `customer_email` rendu optionnel (pour COD)
  
- **Variables d'environnement** (`.env.example`) :
  - Ajout de `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Ajout de `STRIPE_SECRET_KEY`
  - Ajout de `STRIPE_WEBHOOK_SECRET`
  - Instructions pour récupérer les clés

### 📚 Documentation

- **PHASE7_SUMMARY.md** : Documentation complète de la Phase 7
- **PHASE7_QUICKSTART.md** : Guide rapide pour tester Stripe
- **STRIPE_SETUP.md** : Guide de configuration Stripe
- **CHANGELOG.md** : Ajout de la version 0.7.0

### 🔒 Sécurité

- Recalcul du total côté serveur (ne jamais faire confiance au client)
- Vérification de la signature webhook
- Validation stricte des données
- Pas d'exposition de la secret key côté client
- PCI Compliance géré par Stripe

## [0.6.0] - 2026-02-13

### ✨ Ajouté

#### Système de Checkout Complet
- **Page Checkout** (`app/checkout/page.tsx`) :
  - Formulaire de commande complet
  - Validation stricte côté client
  - Récapitulatif du panier
  - Paiement à la livraison (COD)
  - Redirection automatique si panier vide
  - Messages d'erreur contextuels
  - États de chargement avec spinner
  
- **API Route Sécurisée** (`app/api/create-order/route.ts`) :
  - Validation stricte côté serveur
  - Recalcul du total à partir des prix Supabase (sécurité)
  - Vérification du stock avant commande
  - Création de la commande dans Supabase
  - Mise à jour automatique du stock
  - Gestion d'erreurs robuste
  - Types TypeScript stricts
  
- **Page Confirmation** (`app/confirmation/page.tsx`) :
  - Message de succès élégant
  - Affichage du numéro de commande
  - Prochaines étapes détaillées
  - Boutons d'action (accueil, produits)
  - Compte à rebours avec redirection automatique (10s)
  - Suspense boundary pour useSearchParams()

#### Validation Formulaire
- **Champs validés** :
  - Nom complet (min 3 caractères)
  - Téléphone (format marocain : 0612345678 ou +212612345678)
  - Ville (min 3 caractères)
  - Adresse complète (min 10 caractères)
  - Mode de paiement (COD par défaut)
  
- **Validation côté serveur** :
  - Vérification des types
  - Regex pour formats
  - Longueurs minimales
  - Messages d'erreur détaillés

#### Sécurité
- Recalcul du total côté serveur (ne jamais faire confiance au client)
- Vérification du stock avant validation
- Sanitization des inputs (trim, replace)
- Gestion d'erreurs avec try/catch
- Pas d'exposition de la service role key

### 🔄 Modifié

- **CartDrawer** :
  - Bouton "Commander" maintenant fonctionnel
  - Redirection vers `/checkout` au clic
  - Fermeture automatique du drawer
  
- **lib/supabase.ts** :
  - Ajout de `createServerClient()` pour les API routes
  - Alias pour plus de clarté

### 📚 Documentation

- **PHASE6_SUMMARY.md** : Documentation complète de la Phase 6
- **PHASE6_QUICKSTART.md** : Guide rapide pour tester le checkout
- **ROADMAP.md** : Mise à jour avec Phase 6 terminée
- **CHANGELOG.md** : Ajout de la version 0.6.0

### 🐛 Corrigé

- Erreur Suspense boundary dans la page de confirmation
- Build Next.js réussi sans erreurs

## [0.5.0] - 2026-02-13

### ✨ Ajouté

#### Système Panier Global
- **CartContext** (`context/CartContext.tsx`) :
  - Context API avec useReducer
  - 8 actions (add, remove, increase, decrease, clear, open, close, toggle, load)
  - Calculs automatiques (itemCount, total)
  - Persistence dans localStorage
  - Gestion SSR propre
  - Types TypeScript stricts
  
- **CartDrawer** (`components/CartDrawer.tsx`) :
  - Drawer latéral responsive (384px desktop, 100% mobile)
  - Overlay semi-transparent
  - Liste des produits avec images
  - Contrôles quantité (+/-)
  - Bouton supprimer
  - Total dynamique
  - État vide avec CTA
  - Bouton "Commander" (désactivé temporairement)
  
- **AddToCartButton** (`components/AddToCartButton.tsx`) :
  - Bouton avec feedback visuel (✓ Ajouté !)
  - Gestion rupture de stock
  - Animation de transition
  
- **Badge Panier** :
  - Compteur d'items dans le Header
  - Badge rond vert avec nombre
  - Responsive (desktop + mobile)

#### Fonctionnalités
- Ajout de produits au panier
- Modification des quantités
- Suppression d'items
- Calcul du total automatique
- Persistence entre les sessions
- Ouverture automatique du drawer à l'ajout

### 🔄 Modifié
- Header : Ajout bouton panier avec badge compteur
- Page produit : Bouton "Ajouter au panier" fonctionnel
- Layout : Intégration CartProvider et CartDrawer

### 📝 Documentation
- PHASE5_SUMMARY.md : Documentation complète Phase 5

## [0.4.0] - 2026-02-13

### ✨ Ajouté

#### Catalogue Produits Dynamique
- **Fonctions de récupération** (`lib/products.ts`) :
  - `getAllProducts()` - Tous les produits
  - `getProductsInStock()` - Produits en stock uniquement
  - `getProductBySlug()` - Produit par slug
  - `getProductById()` - Produit par ID
  - Helpers : `formatPrice()`, `isInStock()`, `getStockStatus()`
  
- **Composant ProductCard** :
  - Carte produit élégante et responsive
  - Badge stock (limité, rupture)
  - Image avec fallback
  - Hover effects
  - Link vers page produit
  
- **Pages** :
  - Homepage dynamique avec 2 produits mis en avant
  - `/produits` - Catalogue complet avec grille responsive
  - `/produit/[slug]` - Page produit dynamique par slug
  - `/produit/[slug]/not-found.tsx` - 404 personnalisée
  
- **Navigation** :
  - Lien "Produits" ajouté au Header
  - Fil d'Ariane sur page produit
  - Liens de retour catalogue

#### Gestion des Erreurs
- Gestion produit introuvable (404)
- Gestion erreurs Supabase
- Gestion aucun produit disponible
- Messages d'erreur clairs

#### SEO
- Métadonnées dynamiques pour pages produits
- Titres et descriptions personnalisés

### 🔄 Modifié
- Homepage : Affichage dynamique des produits
- Header : Ajout lien "Produits"

### 📝 Documentation
- PHASE4_SUMMARY.md : Documentation complète Phase 4

## [0.3.0] - 2026-02-13

### ✨ Ajouté

#### Backend & Database (Supabase)
- **Schéma SQL complet** :
  - Table `products` avec contraintes et index
  - Table `orders` avec validation email et statuts
  - Triggers pour `updated_at` automatique
  - Vues SQL (`products_in_stock`, `orders_stats`)
  
- **Row Level Security (RLS)** :
  - Politiques pour `products` (lecture publique, admin pour modifications)
  - Politiques pour `orders` (création publique, lecture admin uniquement)
  - Sécurité production-ready
  
- **Client Supabase** (`lib/supabase.ts`) :
  - Client public avec anon key (côté client)
  - Client admin avec service_role key (API Routes uniquement)
  - Types TypeScript complets (Product, Order, CreateOrderInput, CreateProductInput)
  - 7 helpers de base de données
  
- **Helpers de Base de Données** :
  - `getProductsInStock()` - Récupérer produits en stock
  - `getProductBySlug()` - Récupérer un produit par slug
  - `createOrder()` - Créer une commande (public)
  - `createProduct()` - Créer un produit (admin)
  - `updateOrderStatus()` - Mettre à jour statut commande (admin)
  - `getAllOrders()` - Récupérer toutes les commandes (admin)
  
- **Page de Test** :
  - `/test-db` - Vérification connexion Supabase
  - Tests RLS
  - Affichage variables d'environnement
  
#### Configuration
- Installation `@supabase/supabase-js`
- Variables d'environnement Supabase dans `.env.example`
- Dossier `supabase/` avec `schema.sql`

#### Documentation
- **SUPABASE_SETUP.md** (15 Ko) - Guide complet de configuration
- **PHASE3_SUMMARY.md** (18 Ko) - Documentation Phase 3
- Exemples d'utilisation complets

### 🔒 Sécurité
- Row Level Security activé sur toutes les tables
- Validation des données (contraintes SQL + TypeScript)
- Séparation stricte anon key / service_role key
- Index optimisés pour les performances

## [0.2.0] - 2026-02-13

### ✨ Ajouté

#### Design System Premium
- Palette AZALIS raffinée :
  - azalis-green (#6B7D6D)
  - azalis-beige (#F4EFE7)
  - azalis-white (#FAF9F7)
  - azalis-black (#1C1C1C)
- Typographie élégante :
  - Playfair Display (serif) pour les titres
  - Inter (sans-serif) pour le texte
  - Weights multiples (300-700)

#### Composants Globaux
- **Header** : Navigation responsive avec menu mobile
- **Footer** : Footer minimaliste avec liens et copyright
- **Container** : Container centré avec 5 tailles (sm, md, lg, xl, full)

#### Composants UI
- **Button** : 3 variants (primary, secondary, ghost), 3 tailles
- **Section** : Section avec background, padding et container automatiques

#### Layout Global
- Structure HTML optimisée (header, main, footer)
- Background beige global
- Header sticky avec backdrop blur
- Footer automatique en bas de page
- Responsive mobile-first

#### Pages
- **Homepage** : Hero Section premium avec CTA
- **À propos** : Page exemple avec sections structurées

#### CSS Global
- Classes utilitaires personnalisées (btn-primary, btn-secondary, link-elegant)
- Espacements généreux (section-padding, content-spacing)
- Reset CSS amélioré

### 🔄 Modifié
- Layout global restructuré avec Header/Footer intégrés
- Tailwind config étendue avec nouvelles couleurs et fonts
- Homepage redesignée avec Hero Section élégante

### 📝 Documentation
- PHASE2_SUMMARY.md : Documentation complète de la Phase 2

## [0.1.0] - 2026-02-13

### ✨ Ajouté

#### Configuration Initiale
- Configuration Next.js 14 avec App Router
- Configuration TypeScript avec mode strict
- Configuration Tailwind CSS avec palette personnalisée AZALIS
- Configuration ESLint avec next/core-web-vitals
- Configuration PostCSS avec autoprefixer

#### Structure du Projet
- Structure de dossiers professionnelle :
  - `/app` - Pages et routes (App Router)
  - `/components` - Composants React réutilisables
  - `/lib` - Utilitaires et helpers
  - `/types` - Types TypeScript
  - `/public` - Assets statiques

#### Design System
- Palette de couleurs personnalisée :
  - Vert sauge (#6B7D6D)
  - Beige crème (#F4EFE7)
  - Blanc cassé (#FAF9F7)
  - Noir doux (#1C1C1C)
- Configuration Tailwind avec classes personnalisées
- Police Inter de Google Fonts

#### Pages
- Page d'accueil minimaliste avec :
  - Titre "AZALIS" centré
  - Sous-titre "Le naturel sous contrôle"
  - Design responsive (mobile, tablet, desktop)
  - Fond beige crème élégant

#### Composants
- **Button** : Composant bouton réutilisable
  - Variants : primary, secondary, outline
  - Tailles : sm, md, lg
  - États : hover, disabled
  - Typé avec TypeScript

#### Utilitaires
- **formatPrice** : Formate un prix en euros (fr-FR)
- **formatDate** : Formate une date en français
- **cn** : Combine des classes CSS conditionnellement

#### Types TypeScript
- **Product** : Interface pour les produits
- **User** : Interface pour les utilisateurs
- **Order** : Interface pour les commandes

#### Documentation
- **README.md** : Vue d'ensemble, stack technique, commandes
- **STRUCTURE.md** : Structure détaillée et conventions
- **ROADMAP.md** : Feuille de route complète (12 phases)
- **CONTRIBUTING.md** : Guide de contribution et bonnes pratiques
- **GIT_SETUP.md** : Configuration et utilisation de Git
- **QUICKSTART.md** : Guide de démarrage rapide
- **CHANGELOG.md** : Ce fichier

#### Configuration
- `.gitignore` : Fichiers à ignorer par Git
- `.env.example` : Template pour les variables d'environnement
- `package.json` : Dépendances et scripts npm
- `tsconfig.json` : Configuration TypeScript
- `tailwind.config.ts` : Configuration Tailwind
- `postcss.config.js` : Configuration PostCSS
- `.eslintrc.json` : Configuration ESLint
- `next.config.js` : Configuration Next.js

### 🎨 Style

- Approche mobile-first pour le responsive design
- Design minimaliste et élégant
- Animations et transitions douces
- Accessibilité (ARIA, contraste, navigation clavier)

### 📝 Documentation

- Documentation complète en français
- Exemples de code dans tous les guides
- Conventions de nommage et de structure
- Workflow Git recommandé
- Checklist avant commit et PR

### 🔧 Technique

- TypeScript en mode strict
- ESLint configuré avec les règles Next.js
- Tailwind CSS avec JIT mode
- Next.js 14 avec App Router
- React 18.2
- Support des variables d'environnement

---

## Format du Changelog

### Types de Changements

- **✨ Ajouté** : Nouvelles fonctionnalités
- **🔄 Modifié** : Changements dans les fonctionnalités existantes
- **⚠️ Déprécié** : Fonctionnalités bientôt supprimées
- **🗑️ Supprimé** : Fonctionnalités supprimées
- **🐛 Corrigé** : Corrections de bugs
- **🔒 Sécurité** : Corrections de vulnérabilités

### Versioning

- **MAJOR** (X.0.0) : Changements incompatibles avec les versions précédentes
- **MINOR** (0.X.0) : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** (0.0.X) : Corrections de bugs rétrocompatibles

---

**Légende :**
- [Non publié] : Changements en cours de développement
- [Version] - Date : Version publiée

**Dernière mise à jour :** 13 février 2026
