# ⚡ Phase 8 : Admin Panel - Guide Rapide

## 🎯 Ce qui a été ajouté

### Nouveaux fichiers

1. **`/middleware.ts`** : Protection des routes admin
2. **`/lib/supabase-auth.ts`** : Helpers authentification
3. **`/app/admin/login/page.tsx`** : Page de connexion
4. **`/app/admin/dashboard/page.tsx`** : Dashboard avec stats
5. **`/app/admin/orders/page.tsx`** : Liste des commandes
6. **`/app/admin/orders/[id]/page.tsx`** : Détail commande
7. **`/app/admin/products/page.tsx`** : Liste des produits
8. **Composants admin** : Navigation, tables, filtres, etc.

### Modifications

- **`/supabase/schema.sql`** : Table `admin_users` + RLS
- **`/lib/utils.ts`** : `formatDate()` accepte string
- **`package.json`** : Ajout de `@supabase/ssr`

---

## 🚀 Configuration Rapide (5 minutes)

### 1. Créer la table `admin_users`

**Dans Supabase Dashboard** (https://app.supabase.com) :

1. SQL Editor → New query
2. Copier le SQL de `ADMIN_SETUP.md` (section "Étape 1")
3. Run

### 2. Créer un utilisateur admin

**Dans Supabase Dashboard** :

1. Authentication → Users → Add user
2. Email : `admin@azalis.com`
3. Password : Choisir un mot de passe
4. ✅ Cocher "Auto Confirm User"
5. Create user
6. **Copier l'UUID**

### 3. Ajouter dans `admin_users`

**Dans SQL Editor** :

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    'VOTRE-UUID-ICI',
    'admin@azalis.com',
    'super_admin'
);
```

### 4. Tester

```bash
npm run dev
```

Aller sur http://localhost:3000/admin/login

Se connecter avec l'email et le mot de passe.

✅ Vous êtes redirigé vers `/admin/dashboard`

---

## 📊 Fonctionnalités Disponibles

### Dashboard

- **Statistiques** : Total commandes, en attente, payées, CA, stock faible
- **Commandes récentes** : 10 dernières commandes

### Gestion des Commandes

- **Liste** : Toutes les commandes avec filtres
- **Filtres** : Statut, paiement, recherche (nom, téléphone, ville, ID)
- **Export CSV** : Toutes les colonnes
- **Détail** : Infos client, paiement, changement de statut

### Gestion des Produits

- **Liste** : Grille responsive avec images
- **Modifier stock** : Inline avec input + boutons
- **Supprimer** : Avec confirmation

---

## 🔒 Sécurité

### Protection Multi-Niveaux

1. **Middleware** : Vérifie auth + rôle avant accès
2. **Server Components** : Vérification dans chaque page
3. **Supabase RLS** : Politiques sur `admin_users`

### Rôles

- **`super_admin`** : Tous les droits (gérer admins)
- **`admin`** : Gérer commandes et produits

---

## 🎨 Interface

### Navigation

- Logo AZALIS + badge "Admin"
- Liens : Dashboard, Commandes, Produits
- Lien vers le site
- Infos utilisateur + Déconnexion

### Design

- **Fond** : Beige clair
- **Cartes** : Blanc cassé
- **Accent** : Vert sauge
- **Responsive** : Mobile-first

---

## 🐛 Problèmes Courants

### "Vous n'avez pas les droits d'accès administrateur"

**Solution** : Vérifier que l'utilisateur est dans `admin_users`

```sql
SELECT * FROM admin_users WHERE email = 'admin@azalis.com';
```

### "Invalid login credentials"

**Solution** : Vérifier l'email et le mot de passe dans Authentication > Users

### Redirection infinie

**Solution** : Supprimer les cookies (F12 > Application > Cookies)

---

## 📚 Documentation Complète

- **`ADMIN_SETUP.md`** : Guide de configuration détaillé
- **`PHASE8_SUMMARY.md`** : Documentation technique complète

---

## ✅ Checklist

- [ ] Table `admin_users` créée
- [ ] Utilisateur créé dans Authentication
- [ ] Utilisateur ajouté dans `admin_users`
- [ ] Connexion testée
- [ ] Dashboard accessible
- [ ] Commandes listées
- [ ] Produits listés

---

## 🎉 C'est Prêt !

Vous avez maintenant un **panel admin sécurisé** ! 🚀

**Prochaine étape** : Gérer vos premières commandes ! 📦
