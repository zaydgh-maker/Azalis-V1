# ⚡ Phase 6 : Checkout - Guide Rapide

## 🎯 Ce qui a été ajouté

### Nouvelles pages

1. **`/checkout`** : Page de commande avec formulaire
2. **`/confirmation`** : Page de confirmation après commande

### Nouvelle API

- **`POST /api/create-order`** : Crée une commande dans Supabase

### Modifications

- **`CartDrawer`** : Bouton "Commander" maintenant fonctionnel
- **`lib/supabase.ts`** : Ajout de `createServerClient()`

---

## 🚀 Comment tester

### 1. Ajouter des produits au panier

```bash
# Lancer le serveur de dev
npm run dev
```

1. Aller sur http://localhost:3000/produits
2. Cliquer sur un produit
3. Cliquer sur "Ajouter au panier"
4. Répéter pour plusieurs produits

### 2. Accéder au checkout

1. Cliquer sur l'icône panier (en haut à droite)
2. Cliquer sur "Commander"
3. Vous êtes redirigé vers `/checkout`

### 3. Remplir le formulaire

**Données de test valides** :

```
Nom : Ahmed Benali
Téléphone : 0612345678
Ville : Casablanca
Adresse : Rue 123, Quartier Maarif, Immeuble 5, Appartement 12
```

**Données invalides pour tester la validation** :

```
Nom : AB (trop court)
Téléphone : 123 (format invalide)
Ville : AB (trop court)
Adresse : Rue 1 (trop court)
```

### 4. Confirmer la commande

1. Cliquer sur "Confirmer la commande"
2. ✅ Redirection vers `/confirmation`
3. ✅ Message de succès avec numéro de commande
4. ✅ Panier vidé automatiquement
5. ✅ Redirection automatique après 10 secondes

---

## 📋 Vérifier dans Supabase

### 1. Ouvrir Supabase Dashboard

1. Aller sur https://supabase.com
2. Ouvrir votre projet
3. Aller dans "Table Editor"

### 2. Vérifier la table `orders`

```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

Vous devriez voir :

- `customer_name` : "Ahmed Benali"
- `phone` : "0612345678"
- `city` : "Casablanca"
- `address` : "Rue 123, Quartier Maarif..."
- `total` : Le total calculé côté serveur
- `payment_method` : "cash_on_delivery"
- `status` : "pending"

### 3. Vérifier le stock des produits

```sql
SELECT id, name, stock FROM products;
```

Le stock doit avoir été **réduit** automatiquement après la commande.

---

## 🔍 Structure du formulaire

### Champs requis

| Champ | Validation | Exemple |
|-------|-----------|---------|
| Nom | Min 3 caractères | "Ahmed Benali" |
| Téléphone | Format marocain | "0612345678" ou "+212612345678" |
| Ville | Min 3 caractères | "Casablanca" |
| Adresse | Min 10 caractères | "Rue 123, Quartier Maarif, Immeuble 5, Appartement 12" |
| Paiement | Fixe | "Paiement à la livraison" |

### Validation téléphone

**Formats acceptés** :

- `0612345678` (format local)
- `0712345678` (format local)
- `0512345678` (format local)
- `+212612345678` (format international)

**Regex** : `/^(\+212|0)[5-7][0-9]{8}$/`

---

## 🛠️ Flux de traitement

### Côté Client (`/checkout/page.tsx`)

1. Afficher le formulaire + récapitulatif du panier
2. Valider les champs à la soumission
3. Envoyer les données à `/api/create-order`
4. Afficher les erreurs ou rediriger vers `/confirmation`

### Côté Serveur (`/api/create-order/route.ts`)

1. **Valider les données** (types, formats, longueurs)
2. **Récupérer les produits** depuis Supabase
3. **Vérifier le stock** pour chaque produit
4. **Recalculer le total** côté serveur (sécurité)
5. **Créer la commande** dans la table `orders`
6. **Mettre à jour le stock** des produits
7. **Retourner le succès** avec l'ID de commande

---

## 🔒 Sécurité

### Pourquoi recalculer le total côté serveur ?

**Problème** : Un utilisateur malveillant pourrait modifier le total côté client (via les DevTools) et payer moins cher.

**Solution** : Le serveur **ne fait jamais confiance au client** et recalcule toujours le total à partir des prix stockés dans Supabase.

```typescript
// ❌ MAUVAIS : Faire confiance au total du client
const total = data.total; // Peut être manipulé !

// ✅ BON : Recalculer le total côté serveur
let calculatedTotal = 0;
for (const item of data.items) {
  const product = await getProductFromDB(item.id);
  calculatedTotal += product.price * item.quantity;
}
```

### Vérification du stock

Avant de créer la commande, on vérifie que le stock est suffisant :

```typescript
if (product.stock < item.quantity) {
  return NextResponse.json(
    { error: `Stock insuffisant pour ${product.name}` },
    { status: 400 }
  );
}
```

---

## 🎨 Personnalisation

### Modifier les champs du formulaire

**Fichier** : `app/checkout/page.tsx`

**Ajouter un champ "Email"** :

```tsx
// 1. Ajouter au state
const [formData, setFormData] = useState({
  customer_name: '',
  email: '', // Nouveau champ
  phone: '',
  city: '',
  address: '',
  payment_method: 'cash_on_delivery',
});

// 2. Ajouter la validation
const validateForm = (): string | null => {
  // ...
  if (!formData.email.trim()) {
    return 'L\'email est requis';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return 'Email invalide';
  }
  // ...
};

// 3. Ajouter le champ dans le JSX
<div>
  <label htmlFor="email">Email <span className="text-red-500">*</span></label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    placeholder="Ex: ahmed@example.com"
  />
</div>
```

**Fichier** : `app/api/create-order/route.ts`

```typescript
// 1. Ajouter au type
interface OrderRequestData {
  customer_name: string;
  email: string; // Nouveau champ
  phone: string;
  // ...
}

// 2. Ajouter la validation
function validateOrderData(data: any) {
  // ...
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'L\'email est requis' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Email invalide' });
    }
  }
  // ...
}

// 3. Ajouter à l'insertion Supabase
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert({
    customer_name: data.customer_name.trim(),
    customer_email: data.email.trim(), // Nouveau champ
    phone: data.phone.replace(/\s/g, ''),
    // ...
  });
```

**Fichier** : `supabase/schema.sql`

```sql
-- Ajouter la colonne email à la table orders
ALTER TABLE orders ADD COLUMN customer_email TEXT;
```

---

## 📚 Prochaines étapes

### Option 1 : Admin Dashboard (Recommandé)

Créer un dashboard admin pour :

- Voir toutes les commandes
- Changer le statut des commandes
- Gérer les produits (CRUD)
- Voir les statistiques

### Option 2 : Espace Client

Permettre aux clients de :

- Créer un compte
- Voir l'historique de leurs commandes
- Suivre la livraison

### Option 3 : Intégration Stripe

Ajouter le paiement par carte :

- Configuration Stripe
- Checkout Stripe
- Webhooks
- Gestion des remboursements

---

## 🐛 Problèmes courants

### Erreur : "Panier vide"

**Cause** : Vous essayez d'accéder à `/checkout` sans produits dans le panier.

**Solution** : Ajoutez des produits au panier avant d'accéder au checkout.

### Erreur : "Stock insuffisant"

**Cause** : Le stock du produit est inférieur à la quantité demandée.

**Solution** : Réduisez la quantité dans le panier ou augmentez le stock dans Supabase.

### Erreur : "Numéro de téléphone invalide"

**Cause** : Le format du téléphone ne correspond pas au regex.

**Solution** : Utilisez un format valide :

- `0612345678`
- `0712345678`
- `0512345678`
- `+212612345678`

### Erreur : "Erreur lors de la création de la commande"

**Cause** : Problème de connexion à Supabase ou erreur SQL.

**Solution** :

1. Vérifiez que Supabase est configuré (`.env.local`)
2. Vérifiez que la table `orders` existe
3. Vérifiez les logs dans la console du serveur

---

## ✅ Checklist de test

- [ ] Ajouter des produits au panier
- [ ] Cliquer sur "Commander" dans le drawer
- [ ] Remplir le formulaire avec des données valides
- [ ] Soumettre la commande
- [ ] Vérifier la redirection vers `/confirmation`
- [ ] Vérifier que le panier est vidé
- [ ] Vérifier la commande dans Supabase
- [ ] Vérifier que le stock a été mis à jour
- [ ] Tester avec des données invalides (nom court, téléphone invalide, etc.)
- [ ] Tester avec un panier vide (redirection automatique)
- [ ] Tester avec un stock insuffisant

---

## 🎉 Félicitations !

Vous avez maintenant un **système de checkout fonctionnel** !

Les clients peuvent :

✅ Remplir un formulaire de commande  
✅ Voir le récapitulatif de leur panier  
✅ Créer une commande dans Supabase  
✅ Recevoir une confirmation  
✅ Payer à la livraison

**Prochaine étape recommandée** : Créer un dashboard admin pour gérer les commandes.
