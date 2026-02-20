# 🚨 Diagnostic Approfondi - Bug Affichage Produits

**Date** : 13 Février 2026  
**Gravité** : 🔴 CRITIQUE  
**Statut** : 🔍 EN DIAGNOSTIC

---

## 📊 Contexte Confirmé

### ✅ Base de Données Supabase

- **Table** : `products`
- **Nombre de lignes** : **2 produits confirmés**
- **Requête SQL** : `SELECT * FROM products` → Retourne 2 lignes
- **Stock** : Les 2 produits ont `stock > 0`

### ❌ Symptôme

- **Homepage** (`/`) : 1 seul produit affiché
- **Page Produits** (`/produits`) : 1 seul produit affiché

---

## 🔍 Analyse Approfondie du Code

### 1️⃣ Fonction `getProductsInStock()` (lib/products.ts)

**Code analysé** :

```typescript
export async function getProductsInStock(): Promise<ProductResult<Product[]>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products in stock:', error);
      return {
        data: null,
        error: `Impossible de récupérer les produits en stock: ${error.message}`,
      };
    }

    return {
      data: data as Product[],
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching products in stock:', error);
    return {
      data: null,
      error: 'Une erreur inattendue est survenue.',
    };
  }
}
```

**Vérifications** :

- ✅ **Pas de `.single()`** : Correct
- ✅ **Pas de `.maybeSingle()`** : Correct
- ✅ **Pas de `.limit(1)`** : Correct
- ✅ **Pas de `data[0]`** : Retourne `data as Product[]` (tableau complet)
- ✅ **Pas de `reduce()` ou `transform()`** : Correct
- ✅ **Typage correct** : `Promise<ProductResult<Product[]>>` → Tableau

**Conclusion** : ✅ **La fonction est correcte**

---

### 2️⃣ Fonction Alternative `getAllProducts()` (lib/products.ts)

**Code analysé** :

```typescript
export async function getAllProducts(): Promise<ProductResult<Product[]>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return {
        data: null,
        error: `Impossible de récupérer les produits: ${error.message}`,
      };
    }

    return {
      data: data as Product[],
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return {
      data: null,
      error: 'Une erreur inattendue est survenue lors de la récupération des produits.',
    };
  }
}
```

**Vérifications** :

- ✅ **Pas de filtre stock** : Récupère tous les produits
- ✅ **Pas de `.single()`** : Correct
- ✅ **Retourne tableau complet** : `data as Product[]`
- ✅ **Typage correct** : `Promise<ProductResult<Product[]>>`

**Conclusion** : ✅ **La fonction est correcte**

---

### 3️⃣ Homepage (app/page.tsx)

**Code analysé** :

```typescript
export default async function Home() {
  // Récupérer les produits depuis Supabase
  const { data: products, error } = await getProductsInStock();

  // Afficher tous les produits en stock
  const featuredProducts = products || [];

  return (
    <>
      {/* Section Produits */}
      {featuredProducts.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
```

**Vérifications** :

- ✅ **Pas de `.slice()`** : Supprimé dans la correction précédente
- ✅ **Pas de `products[0]`** : Utilise tableau complet
- ✅ **Pas de destructuring incorrect** : `const { data: products, error }` correct
- ✅ **`.map()` correct** : Itère sur `featuredProducts`
- ✅ **Key unique** : `key={product.id}` correct
- ✅ **Typage** : `products` est de type `Product[] | null`

**Conclusion** : ✅ **Le code est correct**

---

### 4️⃣ Page Produits (app/produits/page.tsx)

**Code analysé** :

```typescript
export default async function ProductsPage() {
  // Récupérer tous les produits
  const { data: products, error } = await getAllProducts();

  return (
    <>
      {products && products.length > 0 && (
        <>
          <p>{products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
```

**Vérifications** :

- ✅ **Affiche le nombre** : `{products.length} produit(s)`
- ✅ **`.map()` correct** : Itère sur tous les produits
- ✅ **Key unique** : `key={product.id}`
- ✅ **Pas de limitation** : Aucun `.slice()` ou `.limit()`

**Conclusion** : ✅ **Le code est correct**

---

### 5️⃣ Composant ProductCard

**Code analysé** :

```typescript
export default function ProductCard({ product }: ProductCardProps) {
  const stockStatus = getStockStatus(product);

  return (
    <Link href={`/produit/${product.slug}`}>
      <div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span>{formatPrice(product.price)}</span>
        <span>{stockStatus.label}</span>
      </div>
    </Link>
  );
}
```

**Vérifications** :

- ✅ **Props correctes** : `{ product }: ProductCardProps`
- ✅ **Pas de modification** : Affiche le produit reçu
- ✅ **Pas de conditional render** : Affiche toujours

**Conclusion** : ✅ **Le composant est correct**

---

### 6️⃣ Recherche de `products[0]` ou `products?.[0]`

**Commande** : `grep -r "products\[0\]" --include="*.ts" --include="*.tsx"`

**Résultat** : ❌ **Aucune occurrence trouvée**

---

### 7️⃣ Typage TypeScript

**Interface `ProductResult`** :

```typescript
export interface ProductResult<T> {
  data: T | null;
  error: string | null;
}
```

**Fonction `getProductsInStock`** :

```typescript
export async function getProductsInStock(): Promise<ProductResult<Product[]>>
```

**Variable `products`** :

```typescript
const { data: products, error } = await getProductsInStock();
// Type de products: Product[] | null
```

**Vérifications** :

- ✅ **`products` est typé comme `Product[] | null`** : Correct
- ✅ **Pas typé comme `Product`** : Correct
- ✅ **TypeScript strict** : `tsconfig.json` avec `strict: true`

**Conclusion** : ✅ **Le typage est correct**

---

## 🐛 Hypothèses du Bug

### Hypothèse 1 : Problème RLS Supabase

**Symptôme** : RLS bloque la lecture du 2ème produit

**Vérification** :

Dans Supabase SQL Editor :

```sql
-- Désactiver temporairement RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Tester la requête
SELECT * FROM products WHERE stock > 0;

-- Réactiver RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

**Si 2 produits** : RLS est le problème  
**Si 1 produit** : Problème de données

---

### Hypothèse 2 : Un Seul Produit a `stock > 0`

**Vérification** :

```sql
SELECT id, name, slug, stock 
FROM products 
ORDER BY created_at DESC;
```

**Résultat attendu** : 2 lignes avec `stock > 0`

**Si 1 seule ligne** : Problème de données (pas de bug code)  
**Si 2 lignes** : Bug ailleurs

---

### Hypothèse 3 : Cache Next.js

**Symptôme** : Next.js cache l'ancienne version avec `.slice(0, 2)`

**Solution** :

```bash
# Supprimer le cache
rm -rf .next

# Rebuild
npm run build
npm run dev
```

---

### Hypothèse 4 : Problème de Rendu React

**Vérification** : Regarder les logs de debug ajoutés

**Debug ajouté dans `app/page.tsx`** :

```typescript
console.log('=== DEBUG HOMEPAGE ===');
console.log('products:', products);
console.log('products length:', products?.length);
console.log('products is array:', Array.isArray(products));
if (products) {
  products.forEach((p, index) => {
    console.log(`Product ${index}:`, { id: p.id, name: p.name, stock: p.stock });
  });
}
console.log('=====================');
```

**Ce qui va nous dire** :

- Si `products.length = 1` → **Problème backend/Supabase**
- Si `products.length = 2` → **Problème rendu React**

---

## 🔧 Actions de Debug à Effectuer

### Étape 1 : Vérifier les Logs

```bash
npm run dev
```

Dans le terminal, chercher :

```
=== DEBUG HOMEPAGE ===
products length: ?
```

**Si length = 1** : Problème Supabase/RLS  
**Si length = 2** : Problème rendu React

---

### Étape 2 : Vérifier la Base de Données

Dans Supabase SQL Editor :

```sql
-- Vérifier les 2 produits
SELECT id, name, slug, stock, created_at 
FROM products 
ORDER BY created_at DESC;
```

**Résultat attendu** : 2 lignes

---

### Étape 3 : Vérifier RLS

```sql
-- Voir les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'products';
```

**Politique attendue** : `Public can read products` avec `USING (true)`

---

### Étape 4 : Tester Sans RLS (Temporaire)

```sql
-- TEMPORAIRE - Désactiver RLS pour tester
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

Recharger la page.

**Si 2 produits s'affichent** : Problème RLS  
**Si 1 produit s'affiche** : Problème ailleurs

```sql
-- Réactiver RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

---

### Étape 5 : Vérifier le Cache

```bash
# Supprimer .next et node_modules/.cache
rm -rf .next
rm -rf node_modules/.cache

# Relancer
npm run dev
```

---

## 📊 Checklist de Diagnostic

- [ ] Logs de debug affichés dans le terminal
- [ ] `products.length` vérifié
- [ ] Les 2 produits existent en base (SQL)
- [ ] Les 2 produits ont `stock > 0`
- [ ] RLS testé (désactivé temporairement)
- [ ] Cache Next.js supprimé
- [ ] Page rechargée en navigation privée

---

## 🎯 Prochaines Étapes

1. **Lancer le serveur** : `npm run dev`
2. **Regarder les logs** dans le terminal
3. **Copier les logs** ici
4. **Analyser** :
   - Si `length = 1` → Problème Supabase
   - Si `length = 2` → Problème React

**Une fois les logs disponibles, je pourrai identifier la cause exacte.**

---

## 📝 Informations à Fournir

Pour continuer le diagnostic, fournir :

1. **Logs du terminal** : Section `=== DEBUG HOMEPAGE ===`
2. **Résultat SQL** : `SELECT * FROM products WHERE stock > 0;`
3. **Nombre de produits affichés** : Visuellement sur la page

---

**Statut** : ⏳ **En attente des logs de debug**
