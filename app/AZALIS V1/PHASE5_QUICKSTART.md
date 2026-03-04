# 🚀 Phase 5 - Guide de Démarrage Rapide

## ✅ Phase 5 Terminée !

La **Phase 5 : Système Panier Global** est maintenant complète.

---

## 🎯 Ce Qui a Été Ajouté

### 1. Context Panier

**Fichier :** `context/CartContext.tsx`

```tsx
import { useCart } from '@/context/CartContext';

const { items, addToCart, total, itemCount } = useCart();
```

### 2. CartDrawer

**Fichier :** `components/CartDrawer.tsx`

- Drawer latéral élégant
- Liste des produits
- Contrôles quantité
- Total dynamique

### 3. Bouton Panier

**Header :**
- Icône panier
- Badge compteur
- Toggle drawer

### 4. Bouton Ajouter au Panier

**Page produit :**
- Bouton fonctionnel
- Feedback visuel
- Gestion stock

---

## 🧪 Tester

### 1. Lancer le Serveur

```bash
npm run dev
```

### 2. Tester le Panier

1. **Aller sur un produit :**  
   http://localhost:3000/produit/creme-visage-bio

2. **Cliquer sur "Ajouter au panier"**
   - ✅ Feedback "✓ Ajouté !"
   - ✅ Drawer s'ouvre
   - ✅ Badge compteur (1)

3. **Modifier la quantité**
   - Cliquer sur "+" ou "-"
   - Total se met à jour

4. **Supprimer**
   - Cliquer sur l'icône poubelle

5. **Rafraîchir la page**
   - Panier conservé (localStorage)

---

## 💻 Utilisation

### Utiliser le Hook

```tsx
'use client';

import { useCart } from '@/context/CartContext';

export default function MonComposant() {
  const {
    items,          // Liste des items
    itemCount,      // Nombre total
    total,          // Total en €
    addToCart,
    removeFromCart,
    toggleCart,
  } = useCart();

  return (
    <div>
      <p>Panier : {itemCount} items</p>
      <p>Total : {total}€</p>
      <button onClick={toggleCart}>
        Ouvrir le panier
      </button>
    </div>
  );
}
```

---

### Ajouter au Panier

```tsx
'use client';

import { useCart } from '@/context/CartContext';

export default function ProductButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      slug: product.slug,
    })}>
      Ajouter au panier
    </button>
  );
}
```

---

## 🎨 Composants Disponibles

### AddToCartButton

```tsx
import AddToCartButton from '@/components/AddToCartButton';

<AddToCartButton product={product} />
```

**Fonctionnalités :**
- Ajoute au panier
- Feedback visuel
- Gère rupture de stock

---

### CartDrawer

```tsx
import CartDrawer from '@/components/CartDrawer';

// Déjà intégré dans app/layout.tsx
<CartDrawer />
```

**Fonctionnalités :**
- Affiche le panier
- Modifier quantités
- Supprimer items
- Total dynamique

---

## 🔧 Actions Disponibles

```tsx
const {
  addToCart,        // Ajouter un produit
  removeFromCart,   // Supprimer un produit
  increaseQuantity, // Quantité +1
  decreaseQuantity, // Quantité -1
  clearCart,        // Vider le panier
  openCart,         // Ouvrir le drawer
  closeCart,        // Fermer le drawer
  toggleCart,       // Toggle le drawer
} = useCart();
```

---

## 💾 Persistence

### localStorage

**Clé :** `azalis-cart`

**Sauvegarde automatique :**
- À chaque modification
- Format JSON

**Chargement automatique :**
- Au montage de l'app
- Restaure l'état

---

## 📚 Documentation

| Fichier | Taille | Description |
|---------|--------|-------------|
| **PHASE5_SUMMARY.md** | 22 Ko | Documentation complète |
| **PHASE5_QUICKSTART.md** | Ce fichier | Guide rapide |

---

## 🎯 Prochaines Étapes

### Phase 6 : Formulaire de Commande

**À implémenter :**
1. Page `/commander`
2. Formulaire client
3. Validation des champs
4. Création commande Supabase
5. Page de confirmation
6. Vider le panier après commande

**Voir :** [ROADMAP.md](ROADMAP.md)

---

## ✨ Points Forts

### Architecture
✅ Context API propre  
✅ useReducer pour l'état  
✅ Séparation logique/UI  
✅ Types TypeScript stricts  

### UX
✅ Feedback visuel  
✅ Drawer élégant  
✅ Badge compteur  
✅ Animations douces  

### Performance
✅ localStorage léger  
✅ Pas de re-renders inutiles  
✅ Build optimisé  

---

## 🎉 Conclusion

La **Phase 5 : Système Panier Global** est **terminée avec succès** !

Vous disposez maintenant de :
- ✅ Un panier fonctionnel et élégant
- ✅ Gestion d'état avec Context API
- ✅ Persistence localStorage
- ✅ UI responsive et accessible
- ✅ Code propre et maintenable

**Le projet AZALIS est prêt pour la Phase 6 : Formulaire de Commande**

---

**Version :** 0.5.0  
**Date :** 13 février 2026  
**Statut :** ✅ Phase 5 Terminée

**Bon développement ! 🌿**
