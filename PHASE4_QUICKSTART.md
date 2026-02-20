# 🚀 Phase 4 - Guide de Démarrage Rapide

## ✅ Phase 4 Terminée !

La **Phase 4 : Catalogue Produits Dynamique** est maintenant complète.

---

## 🎯 Ce Qui a Été Ajouté

### 1. Fonctions de Récupération

**Fichier :** `lib/products.ts`

```tsx
import { getAllProducts, getProductBySlug } from '@/lib/products';

// Tous les produits
const { data: products, error } = await getAllProducts();

// Produit par slug
const { data: product, error } = await getProductBySlug('creme-visage-bio');
```

### 2. Composant ProductCard

```tsx
import ProductCard from '@/components/ProductCard';

<ProductCard product={product} />
```

### 3. Pages Créées

- ✅ **Homepage** (`/`) - 2 produits mis en avant
- ✅ **Catalogue** (`/produits`) - Tous les produits
- ✅ **Produit** (`/produit/[slug]`) - Page dynamique
- ✅ **404** - Page personnalisée

---

## 🧪 Tester

### 1. Lancer le Serveur

```bash
npm run dev
```

### 2. Visiter les Pages

**Homepage :**  
http://localhost:3000

**Catalogue :**  
http://localhost:3000/produits

**Produit (exemple) :**  
http://localhost:3000/produit/creme-visage-bio

**404 :**  
http://localhost:3000/produit/inexistant

---

## 📦 Ajouter des Produits de Test

### Via Supabase Dashboard

1. Aller dans **Table Editor** > **products**
2. Cliquer sur **"Insert row"**
3. Remplir :
   - **name** : Crème Visage Bio
   - **slug** : creme-visage-bio
   - **description** : Crème hydratante naturelle
   - **price** : 29.99
   - **stock** : 50
   - **ingredients** : Aloe vera, huile de jojoba
   - **benefits** : Hydrate en profondeur
4. Sauvegarder

### Via SQL

```sql
INSERT INTO products (name, slug, description, price, stock, image_url, ingredients, benefits) VALUES
('Crème Visage Bio', 'creme-visage-bio', 'Crème hydratante naturelle pour le visage.', 29.99, 50, '/images/products/creme-visage.jpg', 'Aloe vera, huile de jojoba, beurre de karité', 'Hydrate en profondeur, apaise les peaux sensibles'),
('Sérum Éclat Naturel', 'serum-eclat-naturel', 'Sérum concentré pour un teint lumineux.', 39.99, 30, '/images/products/serum-eclat.jpg', 'Vitamine C, acide hyaluronique', 'Illumine le teint, réduit les taches');
```

---

## 💻 Utilisation

### Afficher des Produits

```tsx
// app/ma-page/page.tsx
import { getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function MaPage() {
  const { data: products } = await getAllProducts();

  return (
    <div className="grid grid-cols-3 gap-8">
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Créer une Page Produit

```tsx
// app/promo/[slug]/page.tsx
import { getProductBySlug } from '@/lib/products';
import { notFound } from 'next/navigation';

export default async function PromoPage({ params }) {
  const { data: product } = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Prix : {product.price}€</p>
    </div>
  );
}
```

---

## 🎨 Composants Disponibles

### ProductCard

**Props :**
- `product` : Objet Product

**Fonctionnalités :**
- Image avec fallback
- Badge stock
- Prix formaté
- Link vers page produit

---

## 🔧 Helpers

### formatPrice(price)

```tsx
import { formatPrice } from '@/lib/products';

formatPrice(29.99) // "29,99 €"
```

### getStockStatus(product)

```tsx
import { getStockStatus } from '@/lib/products';

const status = getStockStatus(product);
// { label: "En stock", color: "green" }
```

---

## 📚 Documentation

### Guides Complets

- **[PHASE4_SUMMARY.md](PHASE4_SUMMARY.md)** - Documentation détaillée
- **[lib/products.ts](lib/products.ts)** - Code source commenté

---

## 🚨 Notes Importantes

### Boutons Désactivés

Les boutons "Ajouter au panier" sont **désactivés** pour l'instant.

**Raison :** Pas de logique panier (Phase future).

### Server Components

Toutes les pages utilisent **Server Components** :
- ✅ Pas de fetch côté client
- ✅ SEO optimisé
- ✅ Performance

### Supabase Requis

Pour voir les produits, **Supabase doit être configuré** :
1. Voir [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. Ajouter des produits de test

---

## 🎯 Prochaines Étapes

### Phase 5 : Formulaire de Commande

**À implémenter :**
1. Formulaire de commande
2. Validation des champs
3. Création dans Supabase
4. Page de confirmation

**Voir :** [ROADMAP.md](ROADMAP.md)

---

## ✅ Checklist

- [ ] Supabase configuré
- [ ] Produits de test ajoutés
- [ ] Homepage affiche les produits
- [ ] Catalogue accessible
- [ ] Page produit fonctionne
- [ ] 404 personnalisée fonctionne

---

**Version :** 0.4.0  
**Date :** 13 février 2026  
**Statut :** ✅ Phase 4 Terminée
