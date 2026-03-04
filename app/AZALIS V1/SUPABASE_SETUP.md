# 🗄️ Configuration Supabase - AZALIS V1

Guide complet pour configurer Supabase pour le projet AZALIS.

---

## 📋 Prérequis

- Compte Supabase (gratuit) : [supabase.com](https://supabase.com)
- Node.js et npm installés
- Projet AZALIS V1 cloné

---

## 🚀 Étape 1 : Créer un Projet Supabase

### 1.1 Créer le Projet

1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Cliquer sur **"New Project"**
3. Remplir les informations :
   - **Name** : `azalis-v1` (ou votre choix)
   - **Database Password** : Générer un mot de passe fort (le sauvegarder !)
   - **Region** : Choisir la région la plus proche (ex: Europe West)
   - **Pricing Plan** : Free (suffisant pour V1)
4. Cliquer sur **"Create new project"**
5. Attendre 2-3 minutes que le projet soit créé

### 1.2 Récupérer les Clés API

1. Dans le dashboard Supabase, aller dans **Settings** (⚙️)
2. Cliquer sur **API** dans le menu latéral
3. Vous verrez 3 clés importantes :

```
Project URL:           https://xxxxx.supabase.co
anon public:           eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role secret:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **ATTENTION** : Ne jamais partager la `service_role` key !

---

## 🔑 Étape 2 : Configurer les Variables d'Environnement

### 2.1 Créer le fichier .env.local

```bash
# À la racine du projet
cp .env.example .env.local
```

### 2.2 Remplir les Variables

Ouvrir `.env.local` et remplir avec vos valeurs :

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Différence entre les Clés

| Clé | Usage | Exposition | Permissions |
|-----|-------|------------|-------------|
| **anon key** | Client (browser) | ✅ Publique | Limitées par RLS |
| **service_role key** | Serveur (API Routes) | ❌ Secrète | Accès complet |

**Règle d'or :**
- ✅ `NEXT_PUBLIC_*` = Peut être exposé côté client
- ❌ Sans `NEXT_PUBLIC_` = Serveur uniquement, JAMAIS côté client

---

## 🗃️ Étape 3 : Créer le Schéma de Base de Données

### 3.1 Ouvrir l'Éditeur SQL

1. Dans le dashboard Supabase, aller dans **SQL Editor** (icône 📝)
2. Cliquer sur **"New query"**

### 3.2 Exécuter le Schéma

1. Copier le contenu du fichier `supabase/schema.sql`
2. Coller dans l'éditeur SQL
3. Cliquer sur **"Run"** (ou Ctrl+Enter)

Vous devriez voir :

```
Success. No rows returned
```

### 3.3 Vérifier la Création

Dans le menu **Table Editor**, vous devriez voir :
- ✅ `products` (0 rows)
- ✅ `orders` (0 rows)

---

## 🔒 Étape 4 : Vérifier Row Level Security (RLS)

### 4.1 Vérifier que RLS est Activé

1. Aller dans **Authentication** > **Policies**
2. Vous devriez voir les tables avec RLS activé :
   - ✅ `products` - RLS enabled
   - ✅ `orders` - RLS enabled

### 4.2 Vérifier les Politiques

**Pour `products` :**
- ✅ Public can read products (SELECT)
- ✅ Service role can insert products (INSERT)
- ✅ Service role can update products (UPDATE)
- ✅ Service role can delete products (DELETE)

**Pour `orders` :**
- ✅ Public can insert orders (INSERT)
- ✅ Service role can read orders (SELECT)
- ✅ Service role can update orders (UPDATE)
- ✅ Service role can delete orders (DELETE)

---

## 🧪 Étape 5 : Tester la Connexion

### 5.1 Créer une Page de Test

Créer `app/test-db/page.tsx` :

```tsx
import { supabase } from '@/lib/supabase';

export default async function TestDBPage() {
  // Test de connexion
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Connexion Supabase</h1>
      
      {error ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">Erreur : {error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-700">✅ Connexion réussie !</p>
          <p className="mt-2">Produits trouvés : {products?.length || 0}</p>
        </div>
      )}
    </div>
  );
}
```

### 5.2 Tester

1. Lancer le serveur : `npm run dev`
2. Aller sur : `http://localhost:3000/test-db`
3. Vous devriez voir : **✅ Connexion réussie ! Produits trouvés : 0**

---

## 📦 Étape 6 : Ajouter des Produits de Test (Optionnel)

### 6.1 Via l'Interface Supabase

1. Aller dans **Table Editor** > **products**
2. Cliquer sur **"Insert row"**
3. Remplir les champs :
   - **name** : Crème Visage Bio
   - **slug** : creme-visage-bio
   - **description** : Crème hydratante naturelle
   - **price** : 29.99
   - **stock** : 50
4. Cliquer sur **"Save"**

### 6.2 Via SQL

Ou exécuter dans l'éditeur SQL :

```sql
INSERT INTO products (name, slug, description, price, stock, image_url, ingredients, benefits) VALUES
(
    'Crème Visage Bio',
    'creme-visage-bio',
    'Crème hydratante naturelle pour le visage.',
    29.99,
    50,
    '/images/products/creme-visage.jpg',
    'Aloe vera, huile de jojoba, beurre de karité',
    'Hydrate en profondeur, apaise les peaux sensibles'
);
```

### 6.3 Vérifier

Rafraîchir la page `/test-db` :
- Vous devriez voir : **Produits trouvés : 1**

---

## 🔐 Sécurité : Comprendre les Clés

### Anon Key (Public)

**Peut être exposée côté client**

```tsx
// ✅ OK - Côté client
'use client';
import { supabase } from '@/lib/supabase';

export default function ProductList() {
  const { data } = await supabase.from('products').select('*');
  // ...
}
```

**Protégée par RLS :**
- ✅ Peut lire les produits (policy "Public can read")
- ❌ Ne peut PAS modifier les produits (pas de policy)
- ✅ Peut créer des commandes (policy "Public can insert")
- ❌ Ne peut PAS lire les commandes (pas de policy)

### Service Role Key (Secrète)

**NE JAMAIS exposer côté client**

```tsx
// ✅ OK - API Route (serveur)
// app/api/admin/products/route.ts
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const { data } = await supabaseAdmin
    .from('products')
    .insert({ ... });
  // ...
}
```

```tsx
// ❌ INTERDIT - Composant client
'use client';
import { supabaseAdmin } from '@/lib/supabase'; // ❌ DANGER !

export default function AdminPanel() {
  // ❌ La service_role key serait exposée au client !
}
```

**Bypass RLS :**
- ✅ Accès complet à toutes les tables
- ✅ Peut tout lire, créer, modifier, supprimer
- ⚠️ Doit être utilisée avec précaution

---

## 📊 Étape 7 : Vérifier les Index et Performances

### 7.1 Vérifier les Index

Dans l'éditeur SQL :

```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Vous devriez voir :
- ✅ `idx_products_slug`
- ✅ `idx_products_created_at`
- ✅ `idx_products_stock`
- ✅ `idx_orders_status`
- ✅ `idx_orders_created_at`
- ✅ `idx_orders_customer_email`

### 7.2 Tester une Requête

```sql
EXPLAIN ANALYZE
SELECT * FROM products WHERE slug = 'creme-visage-bio';
```

Vous devriez voir l'utilisation de l'index `idx_products_slug`.

---

## 🧹 Étape 8 : Nettoyage (si nécessaire)

### Supprimer Toutes les Données

```sql
TRUNCATE products, orders CASCADE;
```

### Réinitialiser le Schéma

```sql
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Puis réexécuter schema.sql
```

---

## 🚨 Dépannage

### Erreur : "relation does not exist"

**Cause :** Les tables n'ont pas été créées.

**Solution :**
1. Vérifier que `schema.sql` a été exécuté
2. Vérifier dans **Table Editor** que les tables existent

### Erreur : "new row violates row-level security policy"

**Cause :** RLS bloque l'opération.

**Solution :**
1. Vérifier que vous utilisez la bonne clé (anon vs service_role)
2. Vérifier les politiques RLS dans **Authentication** > **Policies**

### Erreur : "Missing environment variable"

**Cause :** Variables d'environnement non configurées.

**Solution :**
1. Vérifier que `.env.local` existe
2. Vérifier que les variables sont bien remplies
3. Redémarrer le serveur : `npm run dev`

### Les Variables ne Sont Pas Chargées

**Cause :** Next.js ne recharge pas automatiquement `.env.local`.

**Solution :**
1. Arrêter le serveur (Ctrl+C)
2. Relancer : `npm run dev`

---

## 📚 Ressources

### Documentation Officielle

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

### Fichiers du Projet

- `supabase/schema.sql` - Schéma de base de données
- `lib/supabase.ts` - Configuration client Supabase
- `.env.example` - Template des variables d'environnement

---

## ✅ Checklist de Configuration

- [ ] Projet Supabase créé
- [ ] Clés API récupérées
- [ ] `.env.local` créé et rempli
- [ ] `schema.sql` exécuté
- [ ] Tables créées (products, orders)
- [ ] RLS activé et politiques vérifiées
- [ ] Test de connexion réussi
- [ ] Produits de test ajoutés (optionnel)

---

**Une fois cette checklist complète, votre backend Supabase est prêt ! 🎉**

---

**Version :** 1.0.0  
**Date :** 13 février 2026  
**Projet :** AZALIS V1
