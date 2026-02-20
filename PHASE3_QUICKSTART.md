# 🚀 Phase 3 - Guide de Démarrage Rapide

## ✅ Phase 3 Terminée !

La **Phase 3 : Backend & Database (Supabase)** est maintenant complète.

---

## 🎯 Ce Qui a Été Ajouté

### 1. Base de Données Supabase

**Tables créées :**
- ✅ `products` - Catalogue des produits
- ✅ `orders` - Commandes clients

**Sécurité :**
- ✅ Row Level Security (RLS) activé
- ✅ Politiques strictes
- ✅ Validation des données

### 2. Client Supabase

**Deux clients configurés :**
- ✅ `supabase` - Client public (anon key)
- ✅ `supabaseAdmin` - Client admin (service_role key)

### 3. Helpers de Base de Données

**7 fonctions créées :**
- `getProductsInStock()` - Produits en stock
- `getProductBySlug()` - Produit par slug
- `createOrder()` - Créer une commande
- `createProduct()` - Créer un produit (admin)
- `updateOrderStatus()` - Mettre à jour statut
- `getAllOrders()` - Toutes les commandes (admin)

---

## 🚀 Configuration Rapide

### Étape 1 : Créer un Projet Supabase

1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Créer un nouveau projet
3. Attendre 2-3 minutes

### Étape 2 : Récupérer les Clés

1. Aller dans **Settings** > **API**
2. Copier :
   - Project URL
   - anon public key
   - service_role secret key

### Étape 3 : Configurer .env.local

Remplacer les valeurs dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 4 : Exécuter le Schéma SQL

1. Ouvrir **SQL Editor** dans Supabase
2. Copier le contenu de `supabase/schema.sql`
3. Exécuter (Run)

### Étape 5 : Tester

```bash
npm run dev
```

Aller sur : http://localhost:3000/test-db

Vous devriez voir : **✅ Connexion réussie !**

---

## 💻 Utilisation

### Lire les Produits

```tsx
import { getProductsInStock } from '@/lib/supabase';

const { data: products, error } = await getProductsInStock();
```

### Créer une Commande

```tsx
import { createOrder } from '@/lib/supabase';

const { data, error } = await createOrder({
  customer_name: 'Jean Dupont',
  customer_email: 'jean@example.com',
  phone: '0612345678',
  address: '123 rue Example',
  city: 'Paris',
  postal_code: '75001',
  total: 29.99,
  payment_method: 'card',
});
```

### Créer un Produit (Admin)

```tsx
// app/api/admin/products/route.ts
import { createProduct } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  
  const { data, error } = await createProduct({
    name: body.name,
    slug: body.slug,
    price: body.price,
    stock: body.stock,
    // ...
  });
  
  return Response.json({ data, error });
}
```

---

## 🔐 Sécurité

### Anon Key vs Service Role Key

| Clé | Usage | Exposition |
|-----|-------|------------|
| **anon key** | Client (browser) | ✅ Public |
| **service_role key** | Serveur (API Routes) | ❌ Secrète |

**Règle :**
```tsx
// ✅ OK - Côté client
'use client';
import { supabase } from '@/lib/supabase';

// ❌ INTERDIT - Côté client
'use client';
import { supabaseAdmin } from '@/lib/supabase'; // DANGER !

// ✅ OK - API Route
// app/api/admin/route.ts
import { supabaseAdmin } from '@/lib/supabase';
```

---

## 📚 Documentation

### Guides Complets

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Configuration détaillée
- **[PHASE3_SUMMARY.md](PHASE3_SUMMARY.md)** - Documentation complète
- **[schema.sql](supabase/schema.sql)** - Schéma de base de données

### Fichiers Clés

```
lib/
└── supabase.ts          # Client Supabase + helpers

supabase/
└── schema.sql           # Schéma SQL

app/
└── test-db/
    └── page.tsx         # Page de test
```

---

## 🧪 Tests

### Page de Test

**URL :** http://localhost:3000/test-db

**Vérifications :**
- ✅ Connexion Supabase
- ✅ Lecture des produits
- ✅ Helper functions
- ✅ Row Level Security
- ✅ Variables d'environnement

---

## 🚨 Dépannage

### Erreur : "Missing environment variable"

**Solution :**
1. Vérifier que `.env.local` existe
2. Vérifier les valeurs (pas de placeholder)
3. Redémarrer : `npm run dev`

### Erreur : "relation does not exist"

**Solution :**
1. Vérifier que `schema.sql` a été exécuté
2. Vérifier dans **Table Editor** que les tables existent

### RLS Bloque les Opérations

**Solution :**
1. Vérifier que vous utilisez la bonne clé (anon vs service_role)
2. Vérifier les politiques dans **Authentication** > **Policies**

---

## 🎯 Prochaines Étapes

### Phase 4 : E-commerce Core

**À implémenter :**
1. Page catalogue produits
2. Page détail produit
3. Formulaire de commande
4. Confirmation de commande

**Voir :** [ROADMAP.md](ROADMAP.md)

---

## ✅ Checklist

- [ ] Projet Supabase créé
- [ ] Clés API récupérées
- [ ] `.env.local` configuré
- [ ] `schema.sql` exécuté
- [ ] Tables créées
- [ ] RLS activé
- [ ] Test de connexion réussi

---

**Une fois cette checklist complète, vous êtes prêt pour la Phase 4 ! 🎉**

---

**Version :** 0.3.0  
**Date :** 13 février 2026  
**Statut :** ✅ Phase 3 Terminée
