# ✅ Phase 8 Terminée - Instructions de Configuration

## 🎉 La Phase 8 est complète !

Le panel admin est **prêt à être utilisé** après une configuration rapide.

---

## ⚡ Configuration Express (5 minutes)

### 🎯 Ce que vous devez faire MAINTENANT

Pour que le panel admin fonctionne, vous devez :

1. ✅ Créer la table `admin_users` dans Supabase
2. ✅ Créer votre premier utilisateur admin
3. ✅ Tester la connexion

**C'est simple et rapide !** Suivez les étapes ci-dessous.

---

## 📋 Étape 1 : Ouvrir Supabase Dashboard

1. Ouvrir votre navigateur
2. Aller sur : **https://app.supabase.com**
3. Se connecter
4. Cliquer sur votre projet **AZALIS**

---

## 📋 Étape 2 : Exécuter le Script SQL

### Dans Supabase Dashboard :

1. Cliquer sur **"SQL Editor"** dans le menu de gauche (icône 📝)
2. Cliquer sur **"New query"** (bouton vert)
3. Ouvrir le fichier **`supabase/admin-setup.sql`** dans votre éditeur de code
4. **Copier tout le contenu** du fichier
5. **Coller** dans l'éditeur SQL de Supabase
6. Cliquer sur **"Run"** (ou Ctrl+Enter)

### ✅ Résultat attendu

Vous devriez voir en bas :

```
Success. Rows returned: 1
```

Ou un message similaire. C'est bon signe ! ✅

---

## 📋 Étape 3 : Créer Votre Utilisateur Admin

### Dans Supabase Dashboard :

1. Cliquer sur **"Authentication"** dans le menu de gauche (icône 🔐)
2. Cliquer sur **"Users"**
3. Cliquer sur **"Add user"** (bouton vert en haut à droite)
4. Remplir le formulaire :

```
Email : admin@azalis.com
Password : [Choisir un mot de passe sécurisé]
Auto Confirm User : ✅ COCHER CETTE CASE
```

5. Cliquer sur **"Create user"**

### 📝 Copier l'UUID

1. Dans la liste des utilisateurs, vous verrez votre nouvel utilisateur
2. Dans la colonne **"ID"**, il y a un UUID (ex: `12345678-1234-1234-1234-123456789abc`)
3. **Cliquer sur l'UUID pour le copier**

💡 **Astuce** : Gardez cet UUID dans un bloc-notes pour l'étape suivante.

---

## 📋 Étape 4 : Lier l'Utilisateur à admin_users

### Dans Supabase Dashboard :

1. Retourner dans **"SQL Editor"**
2. Cliquer sur **"New query"**
3. Copier ce SQL :

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    'VOTRE-UUID-ICI',
    'admin@azalis.com',
    'super_admin'
);
```

4. **Remplacer `VOTRE-UUID-ICI`** par l'UUID que vous avez copié

**Exemple avec un UUID réel** :

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    '12345678-1234-1234-1234-123456789abc',
    'admin@azalis.com',
    'super_admin'
);
```

5. Cliquer sur **"Run"**

### ✅ Résultat attendu

```
Success. No rows returned
```

C'est parfait ! ✅

---

## 📋 Étape 5 : Tester la Connexion

### Dans PowerShell :

```powershell
cd "C:\AZALIS V1"
npm run dev
```

### Dans votre navigateur :

1. Aller sur : **http://localhost:3000/admin/login**
2. Remplir le formulaire :
   - **Email** : `admin@azalis.com`
   - **Password** : Le mot de passe que vous avez choisi
3. Cliquer sur **"Se connecter"**

### ✅ Résultat attendu

Vous êtes **automatiquement redirigé** vers :

**http://localhost:3000/admin/dashboard**

Et vous voyez :
- 📊 Statistiques en haut
- 📦 Liste des commandes récentes
- Navigation admin (Dashboard, Commandes, Produits)

### 🎉 Succès !

**Félicitations !** Votre panel admin fonctionne ! 🎊

---

## 🎯 Que Faire Maintenant ?

### Tester les Fonctionnalités

1. **Dashboard** : Voir les statistiques
   - http://localhost:3000/admin/dashboard

2. **Commandes** : Gérer les commandes
   - http://localhost:3000/admin/orders
   - Filtrer par statut
   - Exporter en CSV
   - Cliquer sur une commande pour voir les détails
   - Changer le statut

3. **Produits** : Gérer les produits
   - http://localhost:3000/admin/products
   - Modifier le stock
   - Supprimer un produit

---

## 🐛 Problèmes ?

### ❌ "Vous n'avez pas les droits d'accès administrateur"

**Cause** : L'utilisateur n'est pas dans `admin_users`.

**Solution** : Vérifier dans SQL Editor :

```sql
SELECT * FROM admin_users WHERE email = 'admin@azalis.com';
```

Si vide, réexécuter l'INSERT de l'étape 4.

---

### ❌ "Invalid login credentials"

**Cause** : Email ou mot de passe incorrect.

**Solution** :
1. Vérifier l'email dans Authentication > Users
2. Réinitialiser le mot de passe si nécessaire

---

### ❌ Erreur PowerShell : "VALUES n'est pas reconnu"

**Cause** : Vous essayez d'exécuter du SQL dans PowerShell.

**Solution** : Exécuter le SQL dans **Supabase Dashboard** (SQL Editor), **PAS dans PowerShell** !

---

## 📚 Documentation Disponible

### Guides de Configuration (Choisir un seul)

1. **`ADMIN_SETUP.md`** - Guide détaillé avec dépannage (recommandé)
2. **`ADMIN_CONFIGURATION_GUIDE.md`** - Guide visuel étape par étape
3. **`SQL_COMMANDS.md`** - Référence SQL rapide

### Documentation Technique

- **`PHASE8_SUMMARY.md`** - Documentation complète
- **`PHASE8_QUICKSTART.md`** - Guide rapide
- **`PHASE8_FINAL.md`** - Récapitulatif final

---

## 🔗 Liens Rapides

### Supabase

- **Dashboard** : https://app.supabase.com
- **SQL Editor** : https://app.supabase.com/project/_/sql
- **Authentication** : https://app.supabase.com/project/_/auth/users

### Admin Panel (Local)

- **Login** : http://localhost:3000/admin/login
- **Dashboard** : http://localhost:3000/admin/dashboard
- **Commandes** : http://localhost:3000/admin/orders
- **Produits** : http://localhost:3000/admin/products

---

## 🎊 Félicitations !

Une fois la configuration terminée, vous aurez un **panel admin professionnel** ! 🚀

**Besoin d'aide ?** Consultez `ADMIN_SETUP.md` pour un guide détaillé.
