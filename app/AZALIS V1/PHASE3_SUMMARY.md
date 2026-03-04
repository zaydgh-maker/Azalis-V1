# 🗄️ Phase 3 : Backend & Database (Supabase) - Terminée

## ✅ Statut : Implémentée avec Succès

**Date de complétion :** 13 février 2026  
**Version :** 0.3.0

---

## 🎯 Objectifs Atteints

✅ Schéma SQL complet et sécurisé  
✅ Row Level Security (RLS) configuré  
✅ Client Supabase configuré (public + admin)  
✅ Variables d'environnement documentées  
✅ Types TypeScript pour la base de données  
✅ Helpers de base de données  
✅ Page de test de connexion  
✅ Documentation complète  

---

## 🗃️ Schéma de Base de Données

### Tables Créées

#### 1. Table `products`

**Colonnes :**
```sql
id              UUID PRIMARY KEY (auto-généré)
name            TEXT NOT NULL (3-200 caractères)
slug            TEXT UNIQUE NOT NULL (3-200 caractères)
description     TEXT (max 2000 caractères)
price           NUMERIC(10,2) NOT NULL (≥ 0)
stock           INTEGER NOT NULL DEFAULT 0 (≥ 0)
image_url       TEXT (max 500 caractères)
ingredients     TEXT (max 2000 caractères)
benefits        TEXT (max 2000 caractères)
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

**Index :**
- `idx_products_slug` - Recherche par slug
- `idx_products_created_at` - Tri par date
- `idx_products_stock` - Produits en stock

**Contraintes :**
- Nom : 3-200 caractères
- Slug : unique, 3-200 caractères
- Prix : ≥ 0
- Stock : ≥ 0

---

#### 2. Table `orders`

**Colonnes :**
```sql
id              UUID PRIMARY KEY (auto-généré)
customer_name   TEXT NOT NULL (2-100 caractères)
customer_email  TEXT NOT NULL (format email valide)
phone           TEXT NOT NULL (10-20 caractères)
address         TEXT NOT NULL (5-200 caractères)
city            TEXT NOT NULL (2-100 caractères)
postal_code     TEXT NOT NULL (4-10 caractères)
total           NUMERIC(10,2) NOT NULL (> 0)
payment_method  TEXT NOT NULL ('card' | 'cash_on_delivery')
status          TEXT NOT NULL DEFAULT 'pending'
notes           TEXT (max 500 caractères)
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

**Index :**
- `idx_orders_status` - Filtrage par statut
- `idx_orders_created_at` - Tri par date
- `idx_orders_customer_email` - Recherche par email

**Contraintes :**
- Email : format valide (regex)
- Total : > 0
- Payment method : 'card' ou 'cash_on_delivery'
- Status : 'pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'

---

### Fonctionnalités Automatiques

**Trigger `updated_at` :**
- Met à jour automatiquement `updated_at` lors d'une modification
- Appliqué sur `products` et `orders`

**Vues SQL :**
- `products_in_stock` : Produits avec stock > 0
- `orders_stats` : Statistiques des commandes par statut

---

## 🔒 Row Level Security (RLS)

### Politiques pour `products`

| Opération | Qui | Politique |
|-----------|-----|-----------|
| **SELECT** | Public | ✅ Tout le monde peut lire |
| **INSERT** | Admin | ✅ Service role uniquement |
| **UPDATE** | Admin | ✅ Service role uniquement |
| **DELETE** | Admin | ✅ Service role uniquement |

**Exemple :**
```tsx
// ✅ OK - Lecture publique avec anon key
const { data } = await supabase.from('products').select('*');

// ❌ BLOQUÉ - Insertion avec anon key
const { error } = await supabase.from('products').insert({ ... });
// Error: new row violates row-level security policy

// ✅ OK - Insertion avec service_role key (API Route)
const { data } = await supabaseAdmin.from('products').insert({ ... });
```

---

### Politiques pour `orders`

| Opération | Qui | Politique |
|-----------|-----|-----------|
| **SELECT** | Admin | ✅ Service role uniquement |
| **INSERT** | Public | ✅ Tout le monde peut créer |
| **UPDATE** | Admin | ✅ Service role uniquement |
| **DELETE** | Admin | ✅ Service role uniquement |

**Exemple :**
```tsx
// ✅ OK - Création de commande avec anon key
const { data } = await supabase.from('orders').insert({
  customer_name: 'Jean Dupont',
  customer_email: 'jean@example.com',
  // ...
});

// ❌ BLOQUÉ - Lecture avec anon key
const { error } = await supabase.from('orders').select('*');
// Error: permission denied

// ✅ OK - Lecture avec service_role key (API Route)
const { data } = await supabaseAdmin.from('orders').select('*');
```

---

## 🔑 Configuration Supabase

### Fichiers Créés

```
lib/
└── supabase.ts          # Configuration client Supabase

supabase/
└── schema.sql           # Schéma de base de données

app/
└── test-db/
    └── page.tsx         # Page de test de connexion

Documentation/
├── SUPABASE_SETUP.md    # Guide de configuration
└── PHASE3_SUMMARY.md    # Ce fichier
```

---

### Client Supabase (`lib/supabase.ts`)

**Deux clients configurés :**

#### 1. Client Public (`supabase`)

```typescript
import { supabase } from '@/lib/supabase';

// Utilisation côté client ou serveur
const { data } = await supabase
  .from('products')
  .select('*');
```

**Caractéristiques :**
- ✅ Peut être utilisé côté client (browser)
- ✅ Protégé par RLS
- ✅ Permissions limitées
- ✅ Utilise `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

#### 2. Client Admin (`supabaseAdmin`)

```typescript
import { supabaseAdmin } from '@/lib/supabase';

// ⚠️ API Routes uniquement !
export async function POST(request: Request) {
  const { data } = await supabaseAdmin
    .from('products')
    .insert({ ... });
}
```

**Caractéristiques :**
- ❌ NE JAMAIS utiliser côté client
- ✅ Bypass RLS
- ✅ Accès complet
- ✅ Utilise `SUPABASE_SERVICE_ROLE_KEY`

---

### Types TypeScript

**Interfaces créées :**

```typescript
// Produit complet
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  ingredients: string | null;
  benefits: string | null;
  created_at: string;
  updated_at: string;
}

// Commande complète
interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  payment_method: 'card' | 'cash_on_delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Input pour créer une commande
interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  payment_method: 'card' | 'cash_on_delivery';
  notes?: string;
}

// Input pour créer un produit
interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  ingredients?: string;
  benefits?: string;
}
```

---

## 🛠️ Helpers de Base de Données

### Fonctions Publiques

**1. Récupérer les produits en stock**

```typescript
import { getProductsInStock } from '@/lib/supabase';

const { data, error } = await getProductsInStock();
// Retourne tous les produits avec stock > 0
```

**2. Récupérer un produit par slug**

```typescript
import { getProductBySlug } from '@/lib/supabase';

const { data, error } = await getProductBySlug('creme-visage-bio');
// Retourne un seul produit
```

**3. Créer une commande**

```typescript
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
  notes: 'Livraison rapide SVP',
});
```

---

### Fonctions Admin (Server-Side Only)

**1. Créer un produit**

```typescript
// app/api/admin/products/route.ts
import { createProduct } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  
  const { data, error } = await createProduct({
    name: body.name,
    slug: body.slug,
    description: body.description,
    price: body.price,
    stock: body.stock,
    image_url: body.image_url,
    ingredients: body.ingredients,
    benefits: body.benefits,
  });
  
  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
  
  return Response.json({ data });
}
```

**2. Mettre à jour le statut d'une commande**

```typescript
import { updateOrderStatus } from '@/lib/supabase';

const { data, error } = await updateOrderStatus(
  'order-id-here',
  'shipped'
);
```

**3. Récupérer toutes les commandes**

```typescript
import { getAllOrders } from '@/lib/supabase';

const { data, error } = await getAllOrders();
// Retourne toutes les commandes (admin uniquement)
```

---

## 🔐 Variables d'Environnement

### Fichier `.env.local`

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Différence entre les Clés

| Variable | Exposition | Usage | Permissions |
|----------|------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Public | URL du projet | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Public | Client (browser) | Limitées par RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Secrète | API Routes | Accès complet |

**Règle d'or :**
```typescript
// ✅ OK - Variables publiques
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ❌ DANGER - Variable secrète côté client
'use client';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // ❌ Exposé au client !
```

---

## 🧪 Test de Connexion

### Page de Test

**URL :** `http://localhost:3000/test-db`

**Tests effectués :**
1. ✅ Connexion à Supabase
2. ✅ Lecture des produits
3. ✅ Helper functions
4. ✅ Row Level Security (RLS)
5. ✅ Variables d'environnement

**Résultats attendus :**
- ✅ Connexion réussie
- ✅ Produits trouvés (ou 0 si table vide)
- ✅ RLS bloque la lecture des commandes avec anon key

---

## 📚 Documentation

### Guides Créés

| Fichier | Taille | Description |
|---------|--------|-------------|
| **SUPABASE_SETUP.md** | 15 Ko | Guide complet de configuration |
| **PHASE3_SUMMARY.md** | Ce fichier | Documentation Phase 3 |
| **schema.sql** | 8 Ko | Schéma de base de données |

---

## 🚀 Utilisation

### Exemple Complet : Page Produits

```tsx
// app/products/page.tsx
import { getProductsInStock } from '@/lib/supabase';
import Section from '@/components/ui/Section';
import Container from '@/components/Container';

export default async function ProductsPage() {
  const { data: products, error } = await getProductsInStock();

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  return (
    <Section background="white" padding="lg">
      <Container>
        <h1 className="text-4xl font-serif text-azalis-green mb-8">
          Nos Produits
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h2 className="font-serif text-xl text-azalis-green">
                {product.name}
              </h2>
              <p className="text-azalis-black/70 mt-2">
                {product.description}
              </p>
              <p className="text-lg font-semibold mt-4">
                {product.price}€
              </p>
              <p className="text-sm text-azalis-black/60">
                Stock : {product.stock}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

---

### Exemple : API Route Admin

```typescript
// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createProduct } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Création du produit
    const { data, error } = await createProduct({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: parseFloat(body.price),
      stock: parseInt(body.stock) || 0,
      image_url: body.image_url,
      ingredients: body.ingredients,
      benefits: body.benefits,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🔒 Sécurité

### Points Clés

✅ **Row Level Security activé**
- Toutes les tables protégées
- Politiques strictes
- Accès public limité

✅ **Validation des données**
- Contraintes SQL (CHECK)
- Types TypeScript
- Validation côté serveur

✅ **Séparation des clés**
- Anon key : public, limité
- Service role : serveur, complet
- Jamais exposer service_role côté client

✅ **Index optimisés**
- Requêtes rapides
- Performance garantie

---

## 📊 Métriques

### Base de Données

- **Tables** : 2 (products, orders)
- **Index** : 6
- **Politiques RLS** : 8
- **Triggers** : 2
- **Vues** : 2

### Code

- **Fichiers TypeScript** : 1 (lib/supabase.ts)
- **Fichiers SQL** : 1 (schema.sql)
- **Helpers** : 7 fonctions
- **Types** : 4 interfaces

---

## 🎯 Prochaines Étapes

### Phase 4 : E-commerce Core

**À implémenter :**
- [ ] Page catalogue produits
- [ ] Page détail produit
- [ ] Formulaire de commande
- [ ] Confirmation de commande

**Voir :** [ROADMAP.md](ROADMAP.md)

---

## ✅ Checklist de Configuration

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Clés API récupérées
- [ ] `.env.local` créé et rempli
- [ ] `schema.sql` exécuté dans Supabase
- [ ] Tables créées (products, orders)
- [ ] RLS activé et politiques vérifiées
- [ ] Page de test accessible (`/test-db`)
- [ ] Test de connexion réussi
- [ ] Produits de test ajoutés (optionnel)

---

## 🎉 Conclusion

La **Phase 3 : Backend & Database (Supabase)** est **terminée avec succès** !

Vous disposez maintenant de :
- ✅ Une base de données PostgreSQL sécurisée
- ✅ Row Level Security configuré
- ✅ Client Supabase opérationnel
- ✅ Types TypeScript complets
- ✅ Helpers de base de données
- ✅ Documentation complète

**Le projet AZALIS est prêt pour la Phase 4 : E-commerce Core**

---

**Version :** 0.3.0  
**Date :** 13 février 2026  
**Statut :** ✅ Phase 3 Terminée
