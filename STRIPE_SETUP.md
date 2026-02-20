# 💳 Configuration Stripe pour AZALIS V1

## 📋 Prérequis

- Compte Stripe (gratuit) : https://dashboard.stripe.com/register
- Stripe CLI (pour tester les webhooks en local) : https://stripe.com/docs/stripe-cli

---

## 1️⃣ Créer un compte Stripe

### Étape 1 : Inscription

1. Aller sur https://dashboard.stripe.com/register
2. Créer un compte avec votre email
3. Vérifier votre email
4. Compléter les informations de votre entreprise

### Étape 2 : Activer le mode test

Par défaut, Stripe démarre en **mode test**. Vous pouvez voir le mode actif en haut à gauche du dashboard :

- **Mode test** : Utilise des cartes de test, aucun vrai paiement
- **Mode production** : Utilise de vraies cartes, vrais paiements

⚠️ **Important** : Restez en mode test pendant le développement !

---

## 2️⃣ Récupérer les clés API

### Étape 1 : Accéder aux clés API

1. Aller sur https://dashboard.stripe.com/test/apikeys
2. Vous verrez deux types de clés :
   - **Publishable key** (pk_test_...) : Peut être exposée côté client
   - **Secret key** (sk_test_...) : NE JAMAIS exposer côté client

### Étape 2 : Copier les clés

**Publishable key** (clé publique) :

```
pk_test_51Abc...xyz
```

**Secret key** (clé secrète) :

```
sk_test_51Abc...xyz
```

### Étape 3 : Ajouter dans `.env.local`

Créer ou modifier le fichier `.env.local` à la racine du projet :

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc...xyz
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
```

⚠️ **Important** : Ne jamais commiter `.env.local` dans Git !

---

## 3️⃣ Configurer le Webhook

Les webhooks permettent à Stripe de notifier votre application quand un paiement est réussi.

### Option A : Tester en local avec Stripe CLI (Recommandé)

#### Étape 1 : Installer Stripe CLI

**Windows** :

```bash
# Avec Scoop
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Ou télécharger depuis : https://github.com/stripe/stripe-cli/releases
```

**macOS** :

```bash
brew install stripe/stripe-cli/stripe
```

**Linux** :

```bash
# Télécharger depuis : https://github.com/stripe/stripe-cli/releases
```

#### Étape 2 : Se connecter à Stripe

```bash
stripe login
```

Cela ouvrira votre navigateur pour autoriser l'accès.

#### Étape 3 : Lancer le serveur Next.js

```bash
npm run dev
```

#### Étape 4 : Écouter les webhooks

Dans un **nouveau terminal** :

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Vous verrez un message comme :

```
> Ready! Your webhook signing secret is whsec_abc123xyz (^C to quit)
```

#### Étape 5 : Copier le webhook secret

Copier le `whsec_abc123xyz` et l'ajouter dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz
```

#### Étape 6 : Redémarrer Next.js

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

✅ **Vous êtes prêt à tester en local !**

---

### Option B : Configurer un webhook en production

#### Étape 1 : Accéder aux webhooks

1. Aller sur https://dashboard.stripe.com/test/webhooks
2. Cliquer sur "Add endpoint"

#### Étape 2 : Configurer l'endpoint

**Endpoint URL** :

```
https://votre-domaine.com/api/stripe-webhook
```

**Events to send** :

Sélectionner les événements suivants :

- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

#### Étape 3 : Récupérer le webhook secret

1. Cliquer sur l'endpoint créé
2. Cliquer sur "Reveal" dans la section "Signing secret"
3. Copier le secret (commence par `whsec_`)

#### Étape 4 : Ajouter dans `.env.local`

```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz
```

---

## 4️⃣ Tester le paiement

### Étape 1 : Lancer l'application

```bash
npm run dev
```

### Étape 2 : Ajouter des produits au panier

1. Aller sur http://localhost:3000/produits
2. Ajouter des produits au panier

### Étape 3 : Accéder au checkout

1. Cliquer sur l'icône panier
2. Cliquer sur "Commander"

### Étape 4 : Remplir le formulaire

**Données de test** :

```
Nom : Test User
Téléphone : 0612345678
Ville : Casablanca
Adresse : Rue 123, Quartier Test, Immeuble 5, Appartement 12
```

### Étape 5 : Sélectionner "Paiement par carte"

### Étape 6 : Utiliser une carte de test

Stripe fournit des cartes de test : https://stripe.com/docs/testing

**Carte de test réussie** :

```
Numéro : 4242 4242 4242 4242
Date d'expiration : N'importe quelle date future (ex: 12/34)
CVC : N'importe quel 3 chiffres (ex: 123)
Code postal : N'importe quel code (ex: 12345)
```

**Autres cartes de test** :

| Carte | Numéro | Résultat |
|-------|--------|----------|
| Visa | 4242 4242 4242 4242 | Succès |
| Visa (débit) | 4000 0566 5566 5556 | Succès |
| Mastercard | 5555 5555 5555 4444 | Succès |
| Amex | 3782 822463 10005 | Succès |
| Carte refusée | 4000 0000 0000 0002 | Échec (carte refusée) |
| Fonds insuffisants | 4000 0000 0000 9995 | Échec (fonds insuffisants) |

### Étape 7 : Vérifier le paiement

1. ✅ Vous êtes redirigé vers Stripe Checkout
2. ✅ Entrez les informations de la carte de test
3. ✅ Cliquez sur "Payer"
4. ✅ Vous êtes redirigé vers `/confirmation`
5. ✅ La commande est créée dans Supabase avec `status = 'paid'`
6. ✅ Le stock est mis à jour

### Étape 8 : Vérifier dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/test/payments
2. Vous verrez le paiement de test

---

## 5️⃣ Vérifier les webhooks

### En local (avec Stripe CLI)

Dans le terminal où vous avez lancé `stripe listen`, vous verrez :

```
2024-02-13 10:30:45   --> checkout.session.completed [evt_abc123]
2024-02-13 10:30:45  <--  [200] POST http://localhost:3000/api/stripe-webhook [evt_abc123]
```

✅ **200** = Le webhook a été traité avec succès

### Dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/test/webhooks
2. Cliquer sur votre endpoint
3. Voir les "Recent deliveries"
4. Vérifier que les webhooks ont un statut "Succeeded"

---

## 6️⃣ Passer en production

### Étape 1 : Activer le mode production

1. Aller sur https://dashboard.stripe.com/settings/account
2. Compléter toutes les informations requises
3. Activer le compte

### Étape 2 : Récupérer les clés de production

1. Aller sur https://dashboard.stripe.com/apikeys (sans `/test`)
2. Copier les clés de production :
   - `pk_live_...`
   - `sk_live_...`

### Étape 3 : Configurer le webhook de production

1. Aller sur https://dashboard.stripe.com/webhooks (sans `/test`)
2. Créer un endpoint avec l'URL de production
3. Copier le webhook secret de production

### Étape 4 : Mettre à jour les variables d'environnement

**En production** (Vercel, Netlify, etc.) :

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

⚠️ **Important** : Ne jamais commiter les clés de production !

---

## 7️⃣ Sécurité

### ✅ Bonnes pratiques

- ✅ **Ne jamais exposer la secret key** côté client
- ✅ **Toujours vérifier la signature du webhook**
- ✅ **Recalculer le total côté serveur** (ne pas faire confiance au client)
- ✅ **Utiliser HTTPS en production**
- ✅ **Activer l'authentification 2FA** sur Stripe
- ✅ **Surveiller les paiements** dans le dashboard

### ❌ À éviter

- ❌ Commiter les clés API dans Git
- ❌ Utiliser les clés de production en développement
- ❌ Faire confiance au montant envoyé par le client
- ❌ Ignorer les webhooks
- ❌ Ne pas vérifier la signature du webhook

---

## 8️⃣ Dépannage

### Problème : "Stripe n'est pas configuré"

**Cause** : Les variables d'environnement ne sont pas définies.

**Solution** :

1. Vérifier que `.env.local` existe
2. Vérifier que les clés sont correctes
3. Redémarrer le serveur Next.js

### Problème : "Invalid signature" dans le webhook

**Cause** : Le webhook secret est incorrect ou manquant.

**Solution** :

1. Vérifier que `STRIPE_WEBHOOK_SECRET` est défini dans `.env.local`
2. Si en local, relancer `stripe listen` et copier le nouveau secret
3. Redémarrer le serveur Next.js

### Problème : Le webhook n'est pas appelé

**Cause** : Stripe ne peut pas atteindre votre serveur.

**Solution en local** :

1. Utiliser Stripe CLI avec `stripe listen`
2. Vérifier que le serveur Next.js est lancé
3. Vérifier que l'URL est correcte : `localhost:3000/api/stripe-webhook`

**Solution en production** :

1. Vérifier que l'URL du webhook est correcte
2. Vérifier que le serveur est accessible publiquement
3. Vérifier les logs dans Stripe Dashboard

### Problème : La commande n'est pas créée après le paiement

**Cause** : Le webhook n'a pas été traité correctement.

**Solution** :

1. Vérifier les logs du serveur Next.js
2. Vérifier les logs dans Stripe Dashboard > Webhooks
3. Vérifier que la table `orders` existe dans Supabase
4. Vérifier que les colonnes `stripe_session_id` et `stripe_payment_intent_id` existent

---

## 9️⃣ Ressources

### Documentation officielle

- **Stripe Docs** : https://stripe.com/docs
- **Stripe Testing** : https://stripe.com/docs/testing
- **Stripe Webhooks** : https://stripe.com/docs/webhooks
- **Stripe CLI** : https://stripe.com/docs/stripe-cli

### Cartes de test

- https://stripe.com/docs/testing#cards

### Dashboard

- **Mode test** : https://dashboard.stripe.com/test
- **Mode production** : https://dashboard.stripe.com

---

## ✅ Checklist

- [ ] Compte Stripe créé
- [ ] Mode test activé
- [ ] Clés API récupérées
- [ ] Variables d'environnement configurées
- [ ] Stripe CLI installé (pour tests locaux)
- [ ] Webhook configuré
- [ ] Paiement de test réussi
- [ ] Webhook reçu et traité
- [ ] Commande créée dans Supabase
- [ ] Stock mis à jour

---

## 🎉 Félicitations !

Vous avez maintenant un **système de paiement Stripe fonctionnel** !

Les clients peuvent :

✅ Choisir entre paiement à la livraison et paiement par carte  
✅ Payer en ligne de manière sécurisée via Stripe  
✅ Recevoir une confirmation de commande  
✅ Voir leur commande enregistrée dans Supabase  

**Prochaine étape** : Tester en production avec de vraies cartes ! 🚀
