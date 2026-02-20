# Roadmap AZALIS V1

## ✅ Phase 1 : Initialisation (Terminée)

- [x] Configuration Next.js 14 avec App Router
- [x] Configuration TypeScript
- [x] Configuration Tailwind CSS avec palette personnalisée
- [x] Structure de dossiers professionnelle
- [x] Page d'accueil minimaliste
- [x] Documentation complète (README, STRUCTURE)
- [x] Composants de base (Button)
- [x] Utilitaires de base (formatPrice, formatDate, cn)

## ✅ Phase 2 : Design System & UI (Terminée)

### Composants UI de Base
- [x] Button (variants, sizes, states)
- [ ] Input (text, email, password, number)
- [ ] Card (product card, info card)
- [ ] Modal/Dialog
- [ ] Dropdown/Select
- [ ] Checkbox/Radio
- [ ] Badge/Tag
- [ ] Toast/Notification
- [ ] Skeleton/Loading states

### Layout Components
- [x] Header avec navigation
- [x] Footer
- [x] Navigation mobile (hamburger menu)
- [ ] Breadcrumb
- [x] Container/Grid system

### Thème
- [x] Typographie premium (Playfair Display + Inter)
- [x] Palette AZALIS complète
- [x] Classes utilitaires CSS
- [ ] Mode sombre (optionnel)
- [x] Animations et transitions de base
- [x] Responsive breakpoints testés

## ✅ Phase 3 : Backend & Database (Supabase) (Terminée)

### Configuration
- [x] Créer projet Supabase
- [x] Configurer variables d'environnement
- [x] Installer client Supabase
- [x] Configurer Row Level Security (RLS)

### Schema Database
- [x] Table `products` (catalogue produits)
- [x] Table `orders` (commandes)
- [x] Index et contraintes de sécurité
- [x] Triggers et vues SQL
- [ ] Table `categories` (catégories de produits) - Phase future
- [ ] Table `order_items` (détails des commandes) - Phase future
- [ ] Table `users` (profils utilisateurs) - Phase future
- [ ] Table `addresses` (adresses de livraison) - Phase future
- [ ] Table `reviews` (avis produits) - Phase future

### Client Supabase
- [x] Client public (anon key)
- [x] Client admin (service_role key)
- [x] Types TypeScript
- [x] Helpers de base de données
- [x] Page de test de connexion

### Authentification
- [ ] Inscription utilisateur - Phase future
- [ ] Connexion/Déconnexion - Phase future
- [ ] Réinitialisation mot de passe - Phase future
- [ ] Vérification email - Phase future
- [ ] Profil utilisateur - Phase future
- [ ] Gestion des sessions - Phase future

## ✅ Phase 4 : Catalogue Produits Dynamique (Terminée)

### Catalogue Produits
- [x] Page liste des produits
- [x] Page détail produit
- [x] Composant ProductCard
- [x] Gestion des erreurs et 404
- [x] SEO dynamique
- [ ] Filtres (catégorie, prix, disponibilité) - Phase future
- [ ] Tri (prix, popularité, nouveautés) - Phase future
- [ ] Recherche produits - Phase future
- [ ] Galerie d'images produit - Phase future
- [ ] Avis et notes produits - Phase future

### Panier
- [x] Ajouter au panier
- [x] Modifier quantités
- [x] Supprimer du panier
- [x] Persister le panier (localStorage)
- [x] Calcul total et sous-totaux
- [x] Drawer panier (UI)
- [ ] Page panier dédiée (optionnel)
- [ ] Persister dans DB (phase future)

## ✅ Phase 6 : Checkout + Enregistrement Commande (Terminée)

### Checkout
- [x] Page checkout avec formulaire complet
- [x] Validation stricte côté client et serveur
- [x] Récapitulatif du panier
- [x] Paiement à la livraison (COD)
- [x] API route sécurisée pour créer les commandes
- [x] Recalcul du total côté serveur (sécurité)
- [x] Vérification du stock avant commande
- [x] Mise à jour automatique du stock
- [x] Page de confirmation élégante
- [x] Intégration avec le panier existant
- [x] Gestion d'erreurs robuste

## ✅ Phase 7 : Paiement (Stripe) (Terminée)

### Configuration
- [x] Créer compte Stripe
- [x] Configurer webhooks
- [x] Installer Stripe SDK (`stripe`, `@stripe/stripe-js`)
- [x] Mode test configuré
- [x] Variables d'environnement (publishable key, secret key, webhook secret)

### Intégration
- [x] Stripe Checkout Session
- [x] Gestion des paiements réussis (webhook `checkout.session.completed`)
- [x] Gestion des paiements échoués (webhook `payment_intent.payment_failed`)
- [x] Choix du mode de paiement (COD ou carte)
- [x] Recalcul du total côté serveur (sécurité)
- [x] Vérification du stock avant paiement
- [x] Mise à jour automatique du stock après paiement
- [x] Nouveaux statuts de commande (`paid`, `payment_failed`)
- [x] Colonnes Stripe dans Supabase (`stripe_session_id`, `stripe_payment_intent_id`)
- [ ] Envoi email confirmation (Phase 10)
- [ ] Historique des commandes (Phase 8)

## 👤 Phase 8 : Espace Client - À venir

### Mon Compte
- [ ] Dashboard utilisateur
- [ ] Modifier profil
- [ ] Changer mot de passe
- [ ] Gérer adresses
- [ ] Historique des commandes
- [ ] Détail d'une commande
- [ ] Suivi de livraison
- [ ] Télécharger factures

### Wishlist (Optionnel)
- [ ] Ajouter aux favoris
- [ ] Liste des favoris
- [ ] Partager wishlist

## ✅ Phase 8 : Admin Panel Sécurisé (Terminée)

### Authentification
- [x] Login admin avec Supabase Auth
- [x] Protection des routes avec middleware
- [x] Vérification du rôle admin
- [x] Table `admin_users` avec RLS
- [x] Helpers authentification

### Dashboard
- [x] Statistiques clés (commandes, CA, stock)
- [x] Commandes récentes
- [x] Navigation admin
- [x] Interface minimaliste

### Gestion Commandes
- [x] Liste des commandes
- [x] Détail commande
- [x] Changer statut commande
- [x] Filtres (statut, paiement, recherche)
- [x] Exporter commandes (CSV)

### Gestion Produits
- [x] Liste des produits
- [x] Modifier stock (inline)
- [x] Supprimer produit
- [ ] Créer nouveau produit (à venir)
- [ ] Modifier produit complet (à venir)
- [ ] Upload images (à venir)

### Statistiques
- [x] Chiffre d'affaires
- [x] Nombre de commandes
- [x] Produits avec stock faible
- [ ] Produits les plus vendus (à venir)
- [ ] Graphiques et analytics (à venir)

## 👤 Phase 9 : Espace Client - À venir

### Mon Compte
- [ ] Dashboard utilisateur
- [ ] Modifier profil
- [ ] Changer mot de passe
- [ ] Gérer adresses
- [ ] Historique des commandes
- [ ] Détail d'une commande
- [ ] Suivi de livraison
- [ ] Télécharger factures

### Wishlist (Optionnel)
- [ ] Ajouter aux favoris
- [ ] Liste des favoris
- [ ] Partager wishlist

## 📧 Phase 10 : Emails & Notifications - À venir

### Emails Transactionnels
- [ ] Confirmation d'inscription
- [ ] Confirmation de commande
- [ ] Expédition de commande
- [ ] Livraison effectuée
- [ ] Réinitialisation mot de passe

### Templates
- [ ] Design emails responsive
- [ ] Branding AZALIS
- [ ] Variables dynamiques

## 🚀 Phase 11 : Optimisation & SEO - À venir

### Performance
- [ ] Optimisation images (WebP, lazy loading)
- [ ] Code splitting
- [ ] Caching stratégies
- [ ] Lighthouse score > 90

### SEO
- [ ] Métadonnées dynamiques
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Schema.org markup
- [ ] Open Graph tags

### Accessibilité
- [ ] ARIA labels
- [ ] Navigation clavier
- [ ] Contraste couleurs (WCAG AA)
- [ ] Screen reader friendly

## 🧪 Phase 12 : Tests & Qualité - À venir

### Tests
- [ ] Tests unitaires (Jest)
- [ ] Tests d'intégration
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Tests de performance

### Qualité
- [ ] Husky (pre-commit hooks)
- [ ] Prettier configuration
- [ ] ESLint rules strictes
- [ ] TypeScript strict mode

## 🌍 Phase 13 : Déploiement - À venir

### Préparation
- [ ] Variables d'environnement production
- [ ] Configuration domaine
- [ ] SSL/HTTPS
- [ ] CDN pour assets

### Déploiement
- [ ] Vercel/Netlify setup
- [ ] CI/CD pipeline
- [ ] Monitoring (Sentry)
- [ ] Analytics (Google Analytics / Plausible)

### Post-Déploiement
- [ ] Tests en production
- [ ] Backup database
- [ ] Plan de rollback
- [ ] Documentation déploiement

## 🎁 Phase 14 : Fonctionnalités Avancées (Optionnel) - À venir

- [ ] Programme de fidélité
- [ ] Codes promo / Coupons
- [ ] Recommandations produits (IA)
- [ ] Chat support client
- [ ] Blog intégré
- [ ] Newsletter
- [ ] Multi-langues (i18n)
- [ ] Multi-devises
- [ ] Mode abonnement
- [ ] Comparateur de produits

---

**Note :** Cette roadmap est évolutive et peut être ajustée selon les priorités business.

**Dernière mise à jour :** Février 2026
