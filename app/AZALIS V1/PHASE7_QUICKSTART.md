# ⚡ Phase 7 : Intégration Stripe - Guide Rapide

## 🎯 Ce qui a été ajouté

### Nouveaux fichiers

1. **`/lib/stripe.ts`** : Configuration Stripe
2. **`/app/api/create-stripe-session/route.ts`** : API pour créer une session Stripe
3. **`/app/api/stripe-webhook/route.ts`** : API pour traiter les webhooks Stripe
4. **`STRIPE_SETUP.md`** : Documentation complète de configuration

### Modifications

- **`/app/checkout/page.tsx`** : Ajout du choix du mode de paiement (COD ou carte)
- **`/supabase/schema.sql`** : Ajout des colonnes Stripe et nouveaux statuts
- **`.env.example`** : Ajout des variables Stripe

---

## 🚀 Configuration Rapide

### 1. Installer Stripe CLI (optionnel mais recommandé)

**Windows** :

```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**macOS** :

```bash
brew install stripe/stripe-cli/stripe
```

### 2. Créer un compte Stripe

1. Aller sur https://dashboard.stripe.com/register
2. Créer un compte
3. Rester en **mode test** (en haut à gauche)

### 3. Récupérer les clés API

1. Aller sur https://dashboard.stripe.com/test/apikeys
2. Copier :
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 4. Configurer `.env.local`

Créer ou modifier `.env.local` :

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc...xyz
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
```

### 5. Configurer le webhook (en local)

**Terminal 1** : Lancer Next.js

```bash
npm run dev
```

**Terminal 2** : Lancer Stripe CLI

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Copier le `whsec_...` affiché et l'ajouter dans `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz
```

**Redémarrer Next.js** (Ctrl+C puis `npm run dev`)

### 6. Mettre à jour Supabase

Exécuter ce SQL dans Supabase :

```sql
-- Ajouter les colonnes Stripe
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Mettre à jour la contrainte de statut
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (
  status IN ('pending', 'paid', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'payment_failed')
);

-- Rendre customer_email optionnel
ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;
```

---

## 🧪 Tester le Paiement

### 1. Ajouter des produits au panier

1. Aller sur http://localhost:3000/produits
2. Ajouter des produits au panier

### 2. Accéder au checkout

1. Cliquer sur l'icône panier
2. Cliquer sur "Commander"

### 3. Remplir le formulaire

```
Nom : Test User
Téléphone : 0612345678
Ville : Casablanca
Adresse : Rue 123, Quartier Test, Immeuble 5, Appartement 12
```

### 4. Sélectionner "Paiement par carte bancaire"

### 5. Confirmer la commande

Vous êtes redirigé vers Stripe Checkout.

### 6. Utiliser une carte de test

**Carte de test réussie** :

```
Numéro : 4242 4242 4242 4242
Date : 12/34
CVC : 123
Code postal : 12345
```

### 7. Vérifier le résultat

1. ✅ Redirection vers `/confirmation`
2. ✅ Message de succès
3. ✅ Commande dans Supabase avec `status = 'paid'`
4. ✅ Stock mis à jour

### 8. Vérifier le webhook

Dans le terminal Stripe CLI, vous devriez voir :

```
--> checkout.session.completed [evt_abc123]
<-- [200] POST http://localhost:3000/api/stripe-webhook [evt_abc123]
```

---

## 💳 Cartes de Test

### Cartes qui réussissent

| Type | Numéro | Résultat |
|------|--------|----------|
| Visa | 4242 4242 4242 4242 | Succès |
| Visa (débit) | 4000 0566 5566 5556 | Succès |
| Mastercard | 5555 5555 5555 4444 | Succès |
| Amex | 3782 822463 10005 | Succès |

### Cartes qui échouent

| Type | Numéro | Résultat |
|------|--------|----------|
| Carte refusée | 4000 0000 0000 0002 | Échec (carte refusée) |
| Fonds insuffisants | 4000 0000 0000 9995 | Échec (fonds insuffisants) |
| Carte expirée | 4000 0000 0000 0069 | Échec (carte expirée) |

**Pour toutes les cartes** :

- Date d'expiration : N'importe quelle date future (ex: 12/34)
- CVC : N'importe quel 3 chiffres (ex: 123)
- Code postal : N'importe quel code (ex: 12345)

Plus de cartes : https://stripe.com/docs/testing#cards

---

## 🔍 Vérifier dans Stripe Dashboard

### 1. Paiements

1. Aller sur https://dashboard.stripe.com/test/payments
2. Voir le paiement de test
3. Cliquer dessus pour voir les détails

### 2. Webhooks

1. Aller sur https://dashboard.stripe.com/test/webhooks
2. Cliquer sur votre endpoint (si configuré)
3. Voir les "Recent deliveries"
4. Vérifier que les webhooks ont un statut "Succeeded"

---

## 🐛 Problèmes Courants

### Erreur : "Stripe n'est pas configuré"

**Cause** : Les variables d'environnement ne sont pas définies.

**Solution** :

1. Vérifier que `.env.local` existe
2. Vérifier que les clés sont correctes (commencent par `pk_test_` et `sk_test_`)
3. Redémarrer le serveur Next.js

### Erreur : "Invalid signature" dans le webhook

**Cause** : Le webhook secret est incorrect ou manquant.

**Solution** :

1. Vérifier que `STRIPE_WEBHOOK_SECRET` est défini dans `.env.local`
2. Si en local, relancer `stripe listen` et copier le nouveau secret
3. Redémarrer le serveur Next.js

### Le webhook n'est pas appelé

**Cause** : Stripe ne peut pas atteindre votre serveur.

**Solution en local** :

1. Utiliser Stripe CLI avec `stripe listen`
2. Vérifier que le serveur Next.js est lancé
3. Vérifier que l'URL est correcte : `localhost:3000/api/stripe-webhook`

### La commande n'est pas créée après le paiement

**Cause** : Le webhook n'a pas été traité correctement.

**Solution** :

1. Vérifier les logs du serveur Next.js
2. Vérifier les logs dans le terminal Stripe CLI
3. Vérifier que les colonnes `stripe_session_id` et `stripe_payment_intent_id` existent dans Supabase

### Erreur : "column does not exist" dans Supabase

**Cause** : Les colonnes Stripe n'ont pas été ajoutées à la table `orders`.

**Solution** :

Exécuter ce SQL dans Supabase :

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
```

---

## 📊 Comparaison des Modes de Paiement

### Paiement à la Livraison (COD)

**Avantages** :

- ✅ Pas de configuration supplémentaire
- ✅ Pas de frais de transaction
- ✅ Familier pour les clients

**Inconvénients** :

- ❌ Risque de refus à la livraison
- ❌ Nécessite de la monnaie
- ❌ Pas de paiement immédiat

**Statut initial** : `pending`

### Paiement par Carte (Stripe)

**Avantages** :

- ✅ Paiement immédiat
- ✅ Sécurisé (PCI Compliance)
- ✅ Pas de risque de refus
- ✅ Suivi dans Stripe Dashboard

**Inconvénients** :

- ❌ Frais de transaction (2.9% + 0.30€)
- ❌ Configuration requise
- ❌ Nécessite un compte Stripe

**Statut initial** : `paid`

---

## 🔄 Flux de Paiement

### Paiement à la Livraison

```
1. Client remplit le formulaire
2. Client sélectionne "Paiement à la livraison"
3. Client clique sur "Confirmer la commande"
4. API /api/create-order crée la commande
5. Commande créée avec status = 'pending'
6. Stock mis à jour
7. Redirection vers /confirmation
```

### Paiement par Carte

```
1. Client remplit le formulaire
2. Client sélectionne "Paiement par carte bancaire"
3. Client clique sur "Confirmer la commande"
4. API /api/create-stripe-session crée une session Stripe
5. Redirection vers Stripe Checkout
6. Client entre les informations de carte
7. Client clique sur "Payer"
8. Stripe traite le paiement
9. Webhook checkout.session.completed reçu
10. Commande créée avec status = 'paid'
11. Stock mis à jour
12. Redirection vers /confirmation
```

---

## 🎯 Checklist de Test

- [ ] Compte Stripe créé
- [ ] Clés API configurées dans `.env.local`
- [ ] Stripe CLI installé et connecté
- [ ] Webhook configuré (en local)
- [ ] Colonnes Stripe ajoutées dans Supabase
- [ ] Serveur Next.js lancé
- [ ] Stripe CLI lancé (`stripe listen`)
- [ ] Paiement COD testé et réussi
- [ ] Paiement carte testé et réussi
- [ ] Webhook reçu et traité (200)
- [ ] Commande créée dans Supabase
- [ ] Stock mis à jour
- [ ] Paiement visible dans Stripe Dashboard

---

## 📚 Ressources

### Documentation

- **STRIPE_SETUP.md** : Documentation complète de configuration
- **PHASE7_SUMMARY.md** : Documentation technique détaillée

### Liens Utiles

- **Stripe Dashboard (test)** : https://dashboard.stripe.com/test
- **Stripe API Keys** : https://dashboard.stripe.com/test/apikeys
- **Stripe Webhooks** : https://dashboard.stripe.com/test/webhooks
- **Stripe Testing** : https://stripe.com/docs/testing
- **Stripe CLI** : https://stripe.com/docs/stripe-cli

---

## 🎉 Félicitations !

Vous avez maintenant un **système de paiement complet** !

Les clients peuvent :

✅ Choisir entre paiement à la livraison et paiement par carte  
✅ Payer en ligne de manière sécurisée via Stripe  
✅ Recevoir une confirmation de commande  
✅ Voir leur commande enregistrée dans Supabase  

**Prochaine étape recommandée** : Phase 9 (Admin Dashboard) pour gérer les commandes et les remboursements ! 🚀
