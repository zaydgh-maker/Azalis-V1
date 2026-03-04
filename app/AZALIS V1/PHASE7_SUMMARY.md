# 💳 Phase 7 : Intégration Stripe - Documentation Complète

## ✅ Objectifs de la Phase 7

Implémenter le **paiement par carte bancaire** via Stripe de manière sécurisée, en complément du paiement à la livraison.

### Fonctionnalités implémentées

- ✅ Configuration Stripe (client serveur + clé publique)
- ✅ API route pour créer une session Stripe Checkout
- ✅ Webhook Stripe pour traiter les événements de paiement
- ✅ Mise à jour du checkout avec choix du mode de paiement
- ✅ Recalcul du total côté serveur (sécurité)
- ✅ Vérification du stock avant paiement
- ✅ Mise à jour automatique du stock après paiement
- ✅ Gestion des statuts de commande (paid, payment_failed)
- ✅ Documentation complète pour la configuration

---

## 📁 Fichiers Créés

### 1. `/lib/stripe.ts`

**Configuration du client Stripe.**

#### Fonctionnalités

- **Client serveur** : Avec secret key (pour API routes uniquement)
- **Clé publique** : Pour initialiser Stripe.js côté client
- **Webhook secret** : Pour valider les webhooks
- **Helpers** : `isStripeConfigured()`, `isStripeWebhookConfigured()`

#### Structure

```typescript
import Stripe from 'stripe';

// Client serveur (NE JAMAIS exposer côté client)
export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
  appInfo: {
    name: 'AZALIS V1',
    version: '0.7.0',
  },
});

// Clé publique (peut être exposée côté client)
export const STRIPE_PUBLISHABLE_KEY = stripePublishableKey || '';

// Secret webhook (NE JAMAIS exposer côté client)
export const STRIPE_WEBHOOK_SECRET = stripeWebhookSecret || '';

// Helpers
export function isStripeConfigured(): boolean { /* ... */ }
export function isStripeWebhookConfigured(): boolean { /* ... */ }
```

#### Sécurité

- ✅ **Secret key** : Jamais exposée côté client
- ✅ **Webhook secret** : Jamais exposé côté client
- ✅ **Validation** : Vérification que les clés sont configurées
- ✅ **Placeholder** : Valeur par défaut pour éviter les erreurs de build

---

### 2. `/app/api/create-stripe-session/route.ts`

**API route pour créer une session Stripe Checkout.**

#### Flux de traitement

1. **Vérifier que Stripe est configuré**
2. **Parser les données** (nom, téléphone, ville, adresse, items)
3. **Valider les données** côté serveur
4. **Récupérer les produits** depuis Supabase
5. **Vérifier le stock** pour chaque produit
6. **Préparer les line items** pour Stripe
7. **Créer la session Stripe Checkout**
8. **Retourner l'URL de la session**

#### Sécurité

- ✅ **Validation stricte** : Tous les champs sont validés
- ✅ **Recalcul du total** : À partir des prix Supabase (ne pas faire confiance au client)
- ✅ **Vérification du stock** : Impossible de commander plus que disponible
- ✅ **Métadonnées** : Informations client stockées dans la session
- ✅ **Expiration** : Session expire après 30 minutes

#### Exemple de requête

```typescript
POST /api/create-stripe-session

Body:
{
  "customer_name": "Ahmed Benali",
  "phone": "0612345678",
  "city": "Casablanca",
  "address": "Rue 123, Quartier Maarif, Immeuble 5, Appartement 12",
  "items": [
    { "id": "uuid-product-1", "quantity": 2 },
    { "id": "uuid-product-2", "quantity": 1 }
  ]
}

Response:
{
  "sessionId": "cs_test_abc123",
  "url": "https://checkout.stripe.com/c/pay/cs_test_abc123"
}
```

#### Line items Stripe

```typescript
const lineItems = [{
  price_data: {
    currency: 'mad', // Dirham marocain
    product_data: {
      name: product.name,
      images: product.image_url ? [product.image_url] : [],
    },
    unit_amount: Math.round(product.price * 100), // Stripe utilise les centimes
  },
  quantity: item.quantity,
}];
```

---

### 3. `/app/api/stripe-webhook/route.ts`

**API route pour recevoir et traiter les webhooks Stripe.**

#### Événements traités

- **`checkout.session.completed`** : Session Checkout complétée
  - Créer la commande dans Supabase
  - Mettre à jour le stock
  - Statut : `paid`

- **`payment_intent.succeeded`** : Paiement réussi
  - Mettre à jour le statut de la commande : `paid`

- **`payment_intent.payment_failed`** : Paiement échoué
  - Mettre à jour le statut de la commande : `payment_failed`

#### Sécurité

- ✅ **Vérification de la signature** : Avec `stripe.webhooks.constructEvent()`
- ✅ **Validation du secret** : Comparaison avec `STRIPE_WEBHOOK_SECRET`
- ✅ **Gestion d'erreurs** : Try/catch partout
- ✅ **Logs** : Console.log pour debug

#### Flux de traitement (checkout.session.completed)

```typescript
1. Vérifier la signature du webhook
2. Récupérer les métadonnées de la session
3. Calculer le total (Stripe utilise les centimes)
4. Créer la commande dans Supabase avec status = 'paid'
5. Récupérer les line items de la session
6. Mettre à jour le stock pour chaque produit
7. Retourner un succès (200) à Stripe
```

#### Exemple de webhook

```json
{
  "id": "evt_abc123",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_abc123",
      "amount_total": 29900,
      "customer_email": "ahmed@example.com",
      "metadata": {
        "customer_name": "Ahmed Benali",
        "phone": "0612345678",
        "city": "Casablanca",
        "address": "Rue 123, Quartier Maarif, Immeuble 5, Appartement 12",
        "payment_method": "card"
      }
    }
  }
}
```

---

## 🔄 Fichiers Modifiés

### 1. `/app/checkout/page.tsx`

**Ajout du choix du mode de paiement.**

#### Changements

```typescript
// État du formulaire
const [formData, setFormData] = useState({
  customer_name: '',
  phone: '',
  city: '',
  address: '',
  payment_method: 'cash_on_delivery' as 'cash_on_delivery' | 'card', // Nouveau type
});

// Soumission du formulaire
const handleSubmit = async (e: React.FormEvent) => {
  // ...
  
  // Si paiement par carte, créer une session Stripe
  if (formData.payment_method === 'card') {
    const response = await fetch('/api/create-stripe-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    // Rediriger vers Stripe Checkout
    if (result.url) {
      window.location.href = result.url;
    }
  } else {
    // Paiement à la livraison : créer la commande directement
    // ... (code existant)
  }
};
```

#### UI

**Deux options de paiement** :

1. **Paiement à la livraison** :
   - Icône : 💵
   - Description : "Payez en espèces lors de la réception de votre commande"
   - Comportement : Créer la commande directement dans Supabase

2. **Paiement par carte** :
   - Badge : "Sécurisé"
   - Description : "Payez en ligne de manière sécurisée via Stripe"
   - Icônes : Visa, Mastercard
   - Comportement : Rediriger vers Stripe Checkout

**Design** :

- Cartes cliquables avec bordure verte
- Fond beige pour l'option sélectionnée
- Hover effect pour l'option non sélectionnée
- Radio buttons pour la sélection

---

### 2. `/supabase/schema.sql`

**Ajout des colonnes Stripe et nouveaux statuts.**

#### Changements

```sql
CREATE TABLE orders (
  -- ... colonnes existantes ...
  
  -- Statut de la commande (nouveaux statuts ajoutés)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'paid', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'payment_failed')
  ),
  
  -- Stripe IDs (pour les paiements par carte)
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- ... autres colonnes ...
);
```

#### Nouveaux statuts

| Statut | Description |
|--------|-------------|
| `pending` | Commande créée, en attente de confirmation (COD) |
| `paid` | Paiement réussi (carte) |
| `confirmed` | Commande confirmée par l'admin |
| `preparing` | Commande en préparation |
| `shipped` | Commande expédiée |
| `delivered` | Commande livrée |
| `cancelled` | Commande annulée |
| `payment_failed` | Paiement échoué (carte) |

#### Colonnes Stripe

- **`stripe_session_id`** : ID de la session Stripe Checkout (ex: `cs_test_abc123`)
- **`stripe_payment_intent_id`** : ID du PaymentIntent Stripe (ex: `pi_abc123`)

**Pourquoi ?** : Pour pouvoir retrouver la commande dans Stripe et gérer les remboursements.

---

### 3. `.env.example`

**Ajout des variables Stripe.**

```bash
# Stripe
# Récupérer ces valeurs depuis : https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Webhook Stripe
# Récupérer depuis : https://dashboard.stripe.com/test/webhooks
# En local, utiliser Stripe CLI : stripe listen --forward-to localhost:3000/api/stripe-webhook
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## 🔒 Sécurité

### Validation Multi-Niveaux

1. **Côté client** (UX) :
   - Champs `required` HTML
   - Validation JavaScript avant soumission
   - Messages d'erreur immédiats

2. **Côté serveur** (Sécurité) :
   - Validation stricte de tous les champs
   - Vérification des types
   - Regex pour formats (téléphone)
   - Longueurs minimales/maximales

### Protection des Données

- ✅ **Recalcul du total côté serveur** : Le client ne peut pas manipuler les prix
- ✅ **Vérification du stock** : Impossible de commander plus que disponible
- ✅ **Validation des IDs produits** : Vérification que les produits existent
- ✅ **Vérification de la signature webhook** : Impossible de falsifier un webhook
- ✅ **Pas d'exposition de secrets** : Secret key et webhook secret jamais exposés

### Stripe Security

- ✅ **HTTPS obligatoire** : Stripe ne fonctionne qu'en HTTPS (sauf localhost)
- ✅ **PCI Compliance** : Stripe gère la conformité PCI-DSS
- ✅ **3D Secure** : Authentification forte pour les cartes européennes
- ✅ **Fraud Detection** : Stripe Radar détecte les fraudes automatiquement

---

## 🧪 Tests Manuels

### Scénario 1 : Paiement par Carte Réussi

1. Ajouter des produits au panier
2. Cliquer sur "Commander" dans le drawer
3. Remplir le formulaire avec des données valides
4. Sélectionner "Paiement par carte bancaire"
5. Cliquer sur "Confirmer la commande"
6. ✅ Redirection vers Stripe Checkout
7. Entrer les informations de la carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
8. Cliquer sur "Payer"
9. ✅ Redirection vers `/confirmation` avec `orderId`
10. ✅ Message de succès affiché
11. ✅ Commande créée dans Supabase avec `status = 'paid'`
12. ✅ Stock mis à jour

### Scénario 2 : Paiement par Carte Échoué

1. Répéter les étapes 1-6 du scénario 1
2. Entrer une carte de test qui échoue :
   - Numéro : `4000 0000 0000 0002` (carte refusée)
3. Cliquer sur "Payer"
4. ✅ Message d'erreur Stripe : "Votre carte a été refusée"
5. ✅ Pas de commande créée dans Supabase
6. ✅ Stock non modifié

### Scénario 3 : Paiement à la Livraison (existant)

1. Ajouter des produits au panier
2. Cliquer sur "Commander" dans le drawer
3. Remplir le formulaire avec des données valides
4. Sélectionner "Paiement à la livraison" (par défaut)
5. Cliquer sur "Confirmer la commande"
6. ✅ Redirection vers `/confirmation` avec `orderId`
7. ✅ Commande créée dans Supabase avec `status = 'pending'`
8. ✅ Stock mis à jour

### Scénario 4 : Webhook Stripe

1. Lancer Stripe CLI : `stripe listen --forward-to localhost:3000/api/stripe-webhook`
2. Effectuer un paiement de test (scénario 1)
3. ✅ Dans le terminal Stripe CLI, voir :
   ```
   --> checkout.session.completed [evt_abc123]
   <-- [200] POST http://localhost:3000/api/stripe-webhook [evt_abc123]
   ```
4. ✅ Dans les logs Next.js, voir :
   ```
   Received Stripe event: checkout.session.completed
   Handling checkout.session.completed: cs_test_abc123
   Order created successfully: uuid-order-123
   Stock updated for product uuid-product-1: 10 -> 8
   ```

---

## 📚 Documentation Créée

### `STRIPE_SETUP.md`

Documentation complète pour configurer Stripe :

1. **Créer un compte Stripe**
2. **Récupérer les clés API**
3. **Configurer le webhook**
   - Option A : Tester en local avec Stripe CLI (recommandé)
   - Option B : Configurer un webhook en production
4. **Tester le paiement**
5. **Vérifier les webhooks**
6. **Passer en production**
7. **Sécurité**
8. **Dépannage**
9. **Ressources**

---

## 🎨 Design et UX

### Page Checkout

**Modifications** :

- **Deux options de paiement** : Cartes cliquables avec radio buttons
- **Badges** : "Sécurisé" pour le paiement par carte
- **Icônes** : Visa et Mastercard pour rassurer
- **Hover effects** : Bordure verte au survol
- **États actifs** : Fond beige pour l'option sélectionnée

### Stripe Checkout

- **Design Stripe** : Interface de paiement sécurisée et responsive
- **Personnalisation** : Logo et couleurs AZALIS (à configurer dans Stripe Dashboard)
- **Langues** : Français automatique (détection du navigateur)
- **Mobile-friendly** : Optimisé pour mobile

---

## 🚀 Prochaines Étapes

### Phase 8 : Espace Client (Optionnel)

- [ ] Authentification utilisateur
- [ ] Historique des commandes
- [ ] Suivi de livraison
- [ ] Gestion du profil

### Phase 9 : Admin Dashboard (Recommandé)

- [ ] Gestion des produits (CRUD)
- [ ] Gestion des commandes
  - Liste des commandes
  - Changement de statut
  - Détails commande
  - Remboursements Stripe
- [ ] Statistiques
  - Chiffre d'affaires
  - Produits les plus vendus
  - Commandes par statut

### Phase 10 : Emails & Notifications

- [ ] Email de confirmation de commande
- [ ] Email de changement de statut
- [ ] SMS de livraison (optionnel)

---

## 📊 Métriques de Qualité

### ✅ Code

- TypeScript strict
- Validation robuste (client + serveur)
- Gestion d'erreurs complète
- Code commenté et documenté
- Séparation des responsabilités

### ✅ Performance

- Server Components
- Images optimisées (Next.js Image)
- Build réussi : 0 erreur, 0 warning
- Stripe Checkout optimisé

### ✅ Sécurité

- Validation serveur stricte
- Recalcul du total côté serveur
- Vérification de la signature webhook
- Pas d'exposition de secrets
- PCI Compliance (géré par Stripe)

### ✅ UX

- Deux options de paiement claires
- Interface Stripe sécurisée
- Messages d'erreur explicites
- États de chargement
- Responsive (mobile-first)

---

## 🎯 Résumé

La **Phase 7** est **complète et fonctionnelle** ! 🎉

Vous disposez maintenant d'un **système de paiement complet** permettant aux clients de :

1. ✅ Choisir entre paiement à la livraison et paiement par carte
2. ✅ Payer en ligne de manière sécurisée via Stripe
3. ✅ Recevoir une confirmation de commande
4. ✅ Voir leur commande enregistrée dans Supabase avec le bon statut

Le système est **prêt pour la production** avec :

- Validation stricte côté client et serveur
- Recalcul du total côté serveur (sécurité)
- Vérification du stock
- Mise à jour automatique du stock
- Gestion des webhooks Stripe
- Gestion d'erreurs robuste
- UX soignée et responsive
- Documentation complète

**Prochaine étape recommandée** : Phase 9 (Admin Dashboard) pour gérer les commandes et les remboursements Stripe.
