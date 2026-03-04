# 🛒 Phase 5 : Système Panier Global - Terminée

## ✅ Statut : Implémentée avec Succès

**Date de complétion :** 13 février 2026  
**Version :** 0.5.0

---

## 🎯 Objectifs Atteints

✅ Context API avec useReducer  
✅ Gestion complète du panier (add, remove, increase, decrease, clear)  
✅ Persistence dans localStorage  
✅ CartDrawer élégant et responsive  
✅ Bouton panier dans Header avec compteur  
✅ Bouton "Ajouter au panier" fonctionnel  
✅ Gestion SSR propre  
✅ Typage TypeScript strict  

---

## 📁 Fichiers Créés

### State Management

```
context/
└── CartContext.tsx              ✨ Nouveau (280 lignes)
    - CartProvider
    - useCart hook
    - Reducer avec 8 actions
    - Persistence localStorage
    - Types TypeScript
```

### Composants

```
components/
├── CartDrawer.tsx               ✨ Nouveau (200 lignes)
│   - Drawer latéral
│   - Liste produits
│   - Contrôles quantité
│   - Total dynamique
│
├── AddToCartButton.tsx          ✨ Nouveau (70 lignes)
│   - Bouton avec feedback
│   - Gestion stock
│
└── Header.tsx                   🔄 Mis à jour
    - Bouton panier
    - Badge compteur
```

### Layout

```
app/
├── layout.tsx                   🔄 CartProvider intégré
└── produit/
    └── [slug]/
        └── page.tsx             🔄 Bouton fonctionnel
```

---

## 🛠️ Architecture du Panier

### CartContext (`context/CartContext.tsx`)

**Structure :**
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
```

**Actions disponibles :**
```typescript
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'INCREASE_QUANTITY'; payload: string }
  | { type: 'DECREASE_QUANTITY'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };
```

---

### Hook useCart

**Valeurs retournées :**
```typescript
{
  items: CartItem[];           // Liste des items
  isOpen: boolean;             // État du drawer
  itemCount: number;           // Nombre total d'items
  total: number;               // Total en euros
  addToCart: (product) => void;
  removeFromCart: (id) => void;
  increaseQuantity: (id) => void;
  decreaseQuantity: (id) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
```

---

## 💻 Utilisation

### 1. Utiliser le Hook

```tsx
'use client';

import { useCart } from '@/context/CartContext';

export default function MonComposant() {
  const { items, addToCart, total, itemCount } = useCart();

  return (
    <div>
      <p>Items dans le panier : {itemCount}</p>
      <p>Total : {total}€</p>
    </div>
  );
}
```

---

### 2. Ajouter un Produit au Panier

```tsx
'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/supabase';

export default function ProductButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      slug: product.slug,
    });
  };

  return (
    <button onClick={handleClick}>
      Ajouter au panier
    </button>
  );
}
```

---

### 3. Afficher le Panier

```tsx
'use client';

import { useCart } from '@/context/CartContext';

export default function CartSummary() {
  const { items, total, removeFromCart } = useCart();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <p>{item.name} x {item.quantity}</p>
          <button onClick={() => removeFromCart(item.id)}>
            Supprimer
          </button>
        </div>
      ))}
      <p>Total : {total}€</p>
    </div>
  );
}
```

---

## 🎨 Composants Créés

### 1. CartDrawer

**Fichier :** `components/CartDrawer.tsx`

**Fonctionnalités :**
- ✅ Drawer latéral (slide depuis la droite)
- ✅ Overlay semi-transparent
- ✅ Liste des produits avec images
- ✅ Contrôles quantité (+/-)
- ✅ Bouton supprimer
- ✅ Total dynamique
- ✅ Bouton "Commander" (désactivé)
- ✅ État vide avec CTA
- ✅ Responsive (full-width mobile, 384px desktop)

**Comportement :**
- Ouvre automatiquement à l'ajout d'un produit
- Ferme au clic sur overlay
- Ferme au clic sur lien produit
- Scroll si beaucoup de produits

---

### 2. AddToCartButton

**Fichier :** `components/AddToCartButton.tsx`

**Fonctionnalités :**
- ✅ Ajoute le produit au panier
- ✅ Feedback visuel (✓ Ajouté !)
- ✅ Gestion rupture de stock
- ✅ Animation de transition
- ✅ Accessible (aria-label)

**États :**
- Normal : "Ajouter au panier"
- Ajouté : "✓ Ajouté au panier !" (2 secondes)
- Rupture : "Rupture de stock" (désactivé)

---

### 3. Header avec Panier

**Fichier :** `components/Header.tsx`

**Ajouts :**
- ✅ Bouton panier (desktop + mobile)
- ✅ Badge compteur d'items
- ✅ Icône panier
- ✅ Toggle drawer au clic

**Badge :**
- Affiche le nombre total d'items
- Rond vert avec texte blanc
- Position absolute top-right

---

## 🔄 Fonctionnalités du Panier

### Actions Disponibles

**1. Ajouter au Panier**
```typescript
addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image_url: product.image_url,
  slug: product.slug,
});
```
- Si produit existe : quantité +1
- Sinon : ajoute avec quantité 1
- Ouvre automatiquement le drawer

---

**2. Supprimer du Panier**
```typescript
removeFromCart(productId);
```
- Retire complètement le produit

---

**3. Augmenter la Quantité**
```typescript
increaseQuantity(productId);
```
- Quantité +1

---

**4. Diminuer la Quantité**
```typescript
decreaseQuantity(productId);
```
- Quantité -1
- Minimum : 1 (ne supprime pas)

---

**5. Vider le Panier**
```typescript
clearCart();
```
- Supprime tous les items

---

**6. Ouvrir/Fermer le Drawer**
```typescript
openCart();
closeCart();
toggleCart();
```

---

## 💾 Persistence localStorage

### Fonctionnement

**Sauvegarde automatique :**
- À chaque modification du panier
- Clé : `azalis-cart`
- Format : JSON

**Chargement automatique :**
- Au montage du composant
- Restaure l'état du panier
- Gestion des erreurs

**Code :**
```typescript
// Sauvegarde
useEffect(() => {
  localStorage.setItem('azalis-cart', JSON.stringify(items));
}, [items]);

// Chargement
useEffect(() => {
  const saved = localStorage.getItem('azalis-cart');
  if (saved) {
    const items = JSON.parse(saved);
    dispatch({ type: 'LOAD_CART', payload: items });
  }
}, []);
```

---

## 🎨 Design du CartDrawer

### Layout

**Desktop :**
- Largeur : 384px (sm:w-96)
- Position : Droite
- Animation : Slide depuis la droite

**Mobile :**
- Largeur : 100%
- Position : Droite
- Animation : Slide depuis la droite

### Sections

1. **Header**
   - Titre "Panier (X)"
   - Bouton fermer (X)

2. **Contenu** (scrollable)
   - Liste des produits
   - Image miniature
   - Nom (lien vers produit)
   - Prix unitaire
   - Contrôles quantité (+/-)
   - Bouton supprimer

3. **Footer** (fixe en bas)
   - Total
   - Bouton "Commander"
   - Note temporaire

### État Vide

- Icône panier
- Message "Votre panier est vide"
- Bouton "Découvrir nos produits"

---

## 📊 Calculs Automatiques

### Nombre Total d'Items

```typescript
const itemCount = items.reduce((total, item) => total + item.quantity, 0);
```

**Exemple :**
- Produit A : quantité 2
- Produit B : quantité 3
- **Total : 5 items**

---

### Total du Panier

```typescript
const total = items.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
```

**Exemple :**
- Produit A : 29.99€ x 2 = 59.98€
- Produit B : 39.99€ x 1 = 39.99€
- **Total : 99.97€**

---

## 🔒 Gestion SSR

### Problème

React Context ne fonctionne pas avec Server Components.

### Solution

**CartProvider marqué `'use client'` :**
```tsx
'use client';

export function CartProvider({ children }) {
  // ...
}
```

**Intégration dans layout.tsx :**
```tsx
// app/layout.tsx (Server Component)
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

**Résultat :**
- ✅ Server Components fonctionnent
- ✅ Client Components ont accès au Context
- ✅ Pas d'erreur d'hydratation

---

## 🧪 Tests

### Test 1 : Ajouter au Panier

1. Aller sur `/produit/creme-visage-bio`
2. Cliquer sur "Ajouter au panier"
3. **Vérifier :**
   - ✅ Feedback "✓ Ajouté au panier !"
   - ✅ Drawer s'ouvre automatiquement
   - ✅ Produit apparaît dans le drawer
   - ✅ Badge compteur dans le header (1)

---

### Test 2 : Modifier la Quantité

1. Dans le drawer, cliquer sur "+"
2. **Vérifier :**
   - ✅ Quantité augmente
   - ✅ Total se met à jour
   - ✅ Badge compteur se met à jour

3. Cliquer sur "-"
4. **Vérifier :**
   - ✅ Quantité diminue (min 1)
   - ✅ Total se met à jour

---

### Test 3 : Supprimer du Panier

1. Cliquer sur l'icône poubelle
2. **Vérifier :**
   - ✅ Produit disparaît
   - ✅ Total se met à jour
   - ✅ Badge compteur se met à jour
   - ✅ Si vide : message "Panier vide"

---

### Test 4 : Persistence

1. Ajouter des produits au panier
2. Rafraîchir la page (F5)
3. **Vérifier :**
   - ✅ Panier conservé
   - ✅ Quantités conservées
   - ✅ Badge compteur correct

---

### Test 5 : Responsive

1. Tester sur mobile (< 768px)
2. **Vérifier :**
   - ✅ Bouton panier visible
   - ✅ Drawer full-width
   - ✅ Contrôles accessibles

---

## 📊 Métriques du Build

```
Route (app)                    Size     First Load JS
┌ ○ /                          188 B    101 kB
├ ○ /produits                  188 B    101 kB
├ ƒ /produit/[slug]            1.46 kB  103 kB
└ ○ /test-db                   142 B    87.5 kB

○  (Static)   Pré-rendu statique
ƒ  (Dynamic)  Rendu serveur à la demande
```

**Analyse :**
- ✅ Légère augmentation du bundle (+2 kB pour le Context)
- ✅ Performance toujours excellente
- ✅ Build réussi

---

## 🎨 Design du Panier

### CartDrawer

**Couleurs :**
- Background : `azalis-white`
- Items : `azalis-beige`
- Texte : `azalis-black`
- Accents : `azalis-green`

**Animations :**
- Slide depuis la droite (300ms)
- Hover effects sur boutons
- Transitions douces

**Responsive :**
- Mobile : 100% largeur
- Desktop : 384px largeur

---

### Badge Compteur

**Design :**
- Rond vert (`azalis-green`)
- Texte blanc
- Taille : 20px x 20px
- Position : top-right du bouton panier

**Affichage :**
- Caché si panier vide
- Affiche le nombre total d'items

---

## 🔧 Fonctions du Context

### addToCart(product)

**Comportement :**
1. Vérifie si le produit existe déjà
2. Si oui : quantité +1
3. Si non : ajoute avec quantité 1
4. Ouvre le drawer automatiquement
5. Sauvegarde dans localStorage

---

### removeFromCart(id)

**Comportement :**
1. Filtre le produit par ID
2. Met à jour l'état
3. Sauvegarde dans localStorage

---

### increaseQuantity(id)

**Comportement :**
1. Trouve le produit par ID
2. Quantité +1
3. Met à jour l'état
4. Sauvegarde dans localStorage

---

### decreaseQuantity(id)

**Comportement :**
1. Trouve le produit par ID
2. Quantité -1 (minimum 1)
3. Met à jour l'état
4. Sauvegarde dans localStorage

**Note :** Ne supprime pas le produit si quantité = 1

---

### clearCart()

**Comportement :**
1. Vide complètement le panier
2. Met à jour l'état
3. Sauvegarde dans localStorage

---

## 💡 Bonnes Pratiques Appliquées

### Séparation des Responsabilités

✅ **Context** : Gestion de l'état  
✅ **Composants** : UI et interactions  
✅ **Lib** : Logique métier (formatPrice, etc.)  

---

### Typage TypeScript

✅ **Types stricts** pour CartItem  
✅ **Actions typées** pour le reducer  
✅ **Props typées** pour les composants  
✅ **Pas de `any`**  

---

### Performance

✅ **useReducer** : Gestion d'état optimisée  
✅ **localStorage** : Persistence légère  
✅ **Pas de re-renders inutiles**  
✅ **Memoization** : Si nécessaire plus tard  

---

### Accessibilité

✅ **aria-label** sur tous les boutons  
✅ **Feedback visuel** (✓ Ajouté)  
✅ **Navigation clavier** fonctionnelle  
✅ **Contraste** des couleurs (WCAG AA)  

---

## 🚀 Prochaines Étapes

### Phase 6 : Formulaire de Commande

**À implémenter :**
1. Page `/commander`
2. Formulaire client (nom, email, téléphone, adresse)
3. Validation des champs
4. Récapitulatif du panier
5. Création de la commande dans Supabase
6. Page de confirmation
7. Vider le panier après commande

**Voir :** [ROADMAP.md](ROADMAP.md)

---

## 📚 Documentation

### Fichiers de Référence

- `context/CartContext.tsx` - Code source du Context
- `components/CartDrawer.tsx` - Code source du Drawer
- `components/AddToCartButton.tsx` - Bouton d'ajout

---

## ✅ Checklist

- [x] CartContext créé avec useReducer
- [x] Actions du panier implémentées
- [x] Persistence localStorage
- [x] CartDrawer créé
- [x] AddToCartButton créé
- [x] Header mis à jour avec bouton panier
- [x] Badge compteur fonctionnel
- [x] Page produit avec bouton fonctionnel
- [x] Gestion SSR propre
- [x] Build réussi
- [x] Tests manuels effectués

---

## 🎉 Conclusion

La **Phase 5 : Système Panier Global** est **terminée avec succès** !

Vous disposez maintenant de :
- ✅ Un système panier complet et fonctionnel
- ✅ Context API avec useReducer
- ✅ Persistence dans localStorage
- ✅ UI élégante et responsive
- ✅ Feedback utilisateur
- ✅ Typage TypeScript strict
- ✅ Code modulaire et maintenable

**Le projet AZALIS est prêt pour la Phase 6 : Formulaire de Commande**

---

**Version :** 0.5.0  
**Date :** 13 février 2026  
**Statut :** ✅ Phase 5 Terminée
