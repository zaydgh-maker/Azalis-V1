# 🎨 MISE À JOUR PALETTE COULEURS AZALIS - PROFONDEUR PREMIUM

**Date : 13 Février 2026**

---

## 📋 RÉSUMÉ

Mise à jour complète de la palette de couleurs pour apporter plus de **profondeur premium** et une **hiérarchie visuelle améliorée** sans modifier la structure.

---

## ✅ NOUVELLE PALETTE DE COULEURS

### Avant → Après

| Couleur | Ancienne valeur | Nouvelle valeur | Usage |
|---------|-----------------|-----------------|-------|
| **Vert principal** | `#6B7D6D` | `#4F6758` | Titres, boutons, accents |
| **Vert hover** | `#6B7D6D/90` | `#3E5246` | État hover boutons |
| **Beige clair** | `#F4EFE7` | `#F3EFE8` | Backgrounds alternés |
| **Texte gris** | `#1C1C1C/60-70` | `#5F5F5F` | Texte principal |
| **Accent subtil** | - | `#C7B9A3` | Nouvelle couleur d'accent |
| **Blanc cassé** | `#FAF9F7` | `#FAF9F7` | Inchangé |
| **Noir doux** | `#1C1C1C` | `#1C1C1C` | Inchangé |

### Configuration Tailwind

```typescript
colors: {
  'azalis-green': '#4F6758',        // Vert principal (plus profond)
  'azalis-green-hover': '#3E5246',  // Hover state
  'azalis-beige': '#F3EFE8',        // Beige clair
  'azalis-accent': '#C7B9A3',       // Accent subtil
  'azalis-white': '#FAF9F7',        // Blanc cassé
  'azalis-text': '#5F5F5F',         // Gris texte
  'azalis-black': '#1C1C1C',        // Noir doux
}
```

---

## 🎨 ALTERNANCE BACKGROUNDS - HOMEPAGE

| Section | Background |
|---------|-----------|
| Hero | `bg-azalis-white` (blanc cassé) |
| Section Transition | `bg-azalis-beige` |
| Section "Une formulation maîtrisée" | `bg-azalis-white` |
| Section Produits | `bg-azalis-beige` |
| Section "Pourquoi choisir AZALIS ?" | `bg-azalis-white` |

**Pattern** : Blanc → Beige → Blanc → Beige → Blanc

---

## 🔘 BOUTONS - NOUVELLE HIÉRARCHIE

### Bouton Principal
```css
background: #4F6758
color: white
hover: #3E5246
border-radius: 0.5rem (rounded-lg)
```

**Avant** : `bg-azalis-green hover:bg-azalis-green/90 rounded-sm`  
**Après** : `bg-azalis-green hover:bg-azalis-green-hover rounded-lg`

### Bouton Secondaire
```css
border: 1px solid #4F6758
color: #4F6758
hover background: #F3EFE8
border-radius: 0.5rem (rounded-lg)
```

**Avant** : `border border-azalis-green hover:bg-azalis-green/5 rounded-sm`  
**Après** : `border border-azalis-green hover:bg-azalis-beige rounded-lg`

---

## 📄 FICHIERS MODIFIÉS

### 1. `tailwind.config.ts`
- Palette complète mise à jour
- Ajout `azalis-green-hover`
- Ajout `azalis-accent`
- Ajout `azalis-text`

### 2. `app/page.tsx` (Homepage)
- Alternance backgrounds : blanc/beige
- Boutons mis à jour : `rounded-lg`, `hover:bg-azalis-green-hover`, `hover:bg-azalis-beige`

### 3. `components/ProductCard.tsx`
- Bouton "Découvrir" : `bg-azalis-green hover:bg-azalis-green-hover rounded-lg`

### 4. `app/produit/[slug]/page.tsx` (Page produit)
- Alternance backgrounds : blanc/beige
- Sections avec `bg-azalis-beige` (au lieu de `/15`)

### 5. `app/produits/page.tsx` (Liste produits)
- Section catalogue : `bg-azalis-beige` (au lieu de `/20`)

---

## 🎯 AMÉLIORATIONS VISUELLES

### Profondeur augmentée
✅ Vert principal plus profond (`#4F6758` vs `#6B7D6D`)  
✅ État hover distinct et visible (`#3E5246`)  
✅ Beige plus chaleureux et unifié (`#F3EFE8`)  
✅ Contraste amélioré pour la lisibilité  

### Hiérarchie renforcée
✅ Alternance claire blanc/beige  
✅ Boutons plus définis (rounded-lg)  
✅ Hover states cohérents  
✅ Bordures subtiles maintenues (`/10`)  

### Cohérence globale
✅ Palette unifiée sur tout le site  
✅ Plus de transparence inconsistante (`/20`, `/15`, `/5`)  
✅ Couleurs solides et prévisibles  
✅ Accessibilité maintenue  

---

## 📊 COMPARAISON AVANT/APRÈS

### Saturation
- **Avant** : Vert `#6B7D6D` (saturation moyenne)
- **Après** : Vert `#4F6758` (saturation réduite, plus premium)

### Contraste
- **Avant** : Beige `/20` ou `/15` (très léger, peu de profondeur)
- **Après** : Beige `#F3EFE8` (solide, plus de présence)

### Hover
- **Avant** : Opacité `/90` ou `/5` (peu visible)
- **Après** : Couleur dédiée `#3E5246` ou `#F3EFE8` (claire et visible)

---

## 🚀 IMPACT UTILISATEUR

**Perception :**
- Plus premium et sophistiqué
- Meilleure profondeur visuelle
- Hiérarchie plus évidente
- Palette plus cohérente

**Expérience :**
- Boutons plus clairs et réactifs
- Alternance de sections plus marquée
- Meilleure lisibilité générale
- Navigation visuelle facilitée

---

## 📝 NOTES TECHNIQUES

- Aucune modification de structure
- Aucune modification de contenu
- Aucune modification de layout
- Uniquement palette et hiérarchie visuelle
- Rétrocompatibilité maintenue
- Border-radius augmenté : `rounded-sm` → `rounded-lg`

---

**Statut : ✅ PALETTE PREMIUM APPLIQUÉE**

La nouvelle palette de couleurs apporte plus de profondeur, de cohérence et de sophistication à l'ensemble du site AZALIS.
