# 🎯 Guide de Configuration Admin - Étape par Étape

## ⏱️ Temps estimé : 5 minutes

---

## 📍 Étape 1/5 : Ouvrir Supabase Dashboard

### Actions

1. Ouvrir votre navigateur
2. Aller sur : **https://app.supabase.com**
3. Se connecter à votre compte Supabase
4. Cliquer sur votre projet **AZALIS**

### ✅ Vérification

Vous devriez voir le dashboard de votre projet avec le menu de gauche.

---

## 📍 Étape 2/5 : Créer la Table `admin_users`

### Actions

1. Dans le menu de gauche, cliquer sur **"SQL Editor"** (icône 📝)
2. Cliquer sur **"New query"** (bouton vert en haut à droite)
3. Copier **tout le contenu** du fichier `supabase/admin-setup.sql`
4. Coller dans l'éditeur SQL
5. Cliquer sur **"Run"** (ou appuyer sur Ctrl+Enter)

### ✅ Vérification

Vous devriez voir en bas de l'écran :

```
Success. Rows returned: 1
```

Ou un message similaire indiquant que la table a été créée.

### 🐛 En cas d'erreur

Si vous voyez une erreur, c'est probablement que la table existe déjà. Pas de problème ! Passez à l'étape suivante.

---

## 📍 Étape 3/5 : Créer un Utilisateur Admin

### Actions

1. Dans le menu de gauche, cliquer sur **"Authentication"** (icône 🔐)
2. Cliquer sur **"Users"**
3. Cliquer sur **"Add user"** (bouton vert en haut à droite)
4. Remplir le formulaire :

| Champ | Valeur |
|-------|--------|
| **Email** | `admin@azalis.com` (ou votre email) |
| **Password** | Choisir un mot de passe sécurisé (min 8 caractères) |
| **Auto Confirm User** | ✅ **COCHER CETTE CASE** |

5. Cliquer sur **"Create user"**

### ✅ Vérification

Vous devriez voir le nouvel utilisateur dans la liste avec :
- Email : admin@azalis.com
- Status : Confirmed (vert)

### 📝 IMPORTANT : Copier l'UUID

1. Dans la liste des utilisateurs, trouver votre utilisateur
2. Dans la colonne **"ID"**, vous verrez un UUID (format : `12345678-1234-1234-1234-123456789abc`)
3. **Cliquer sur l'UUID pour le copier**
4. **Garder cet UUID pour l'étape suivante**

💡 **Astuce** : Vous pouvez aussi ouvrir un bloc-notes et coller l'UUID pour ne pas le perdre.

---

## 📍 Étape 4/5 : Ajouter l'Utilisateur dans `admin_users`

### Actions

1. Retourner dans **"SQL Editor"** (menu de gauche)
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

4. **Remplacer `VOTRE-UUID-ICI`** par l'UUID copié à l'étape précédente

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

### ✅ Vérification

Vous devriez voir :

```
Success. No rows returned
```

Cela signifie que l'insertion a réussi !

### 🔍 Vérifier que ça a fonctionné

Exécuter ce SQL :

```sql
SELECT * FROM admin_users;
```

Vous devriez voir une ligne avec votre utilisateur.

---

## 📍 Étape 5/5 : Tester la Connexion

### Actions

1. Ouvrir **PowerShell**
2. Aller dans le dossier du projet :

```powershell
cd "C:\AZALIS V1"
```

3. Lancer le serveur de développement :

```powershell
npm run dev
```

4. Ouvrir votre navigateur
5. Aller sur : **http://localhost:3000/admin/login**
6. Remplir le formulaire :
   - **Email** : `admin@azalis.com`
   - **Password** : Le mot de passe choisi à l'étape 3
7. Cliquer sur **"Se connecter"**

### ✅ Vérification

Vous devriez être **automatiquement redirigé** vers :

**http://localhost:3000/admin/dashboard**

Et voir :
- Statistiques en haut (commandes, CA, stock)
- Liste des commandes récentes
- Navigation admin (Dashboard, Commandes, Produits)

### 🎉 Succès !

Si vous voyez le dashboard, **félicitations** ! 🎊

Vous avez maintenant accès au panel admin !

---

## 🐛 Dépannage Rapide

### Erreur : "Vous n'avez pas les droits d'accès administrateur"

**Solution** : L'UUID n'est pas correct ou l'utilisateur n'est pas dans `admin_users`.

**Vérifier** :

```sql
-- Vérifier l'UUID de l'utilisateur
SELECT id, email FROM auth.users WHERE email = 'admin@azalis.com';

-- Vérifier dans admin_users
SELECT * FROM admin_users WHERE email = 'admin@azalis.com';
```

Si absent, réexécuter l'INSERT de l'étape 4 avec le bon UUID.

---

### Erreur : "Invalid login credentials"

**Solution** : Email ou mot de passe incorrect.

**Vérifier** :
1. Authentication > Users
2. Vérifier que l'email est correct
3. Réinitialiser le mot de passe si nécessaire

---

### Erreur : Page blanche ou erreur 500

**Solution** : Problème de configuration Supabase.

**Vérifier** :
1. `.env.local` contient les bonnes clés Supabase
2. Redémarrer le serveur (`Ctrl+C` puis `npm run dev`)

---

## 🎯 Que Faire Maintenant ?

### Tester les Fonctionnalités

1. **Dashboard** : Voir les statistiques
2. **Commandes** : Aller sur `/admin/orders`
   - Filtrer par statut
   - Exporter en CSV
   - Cliquer sur une commande pour voir les détails
   - Changer le statut
3. **Produits** : Aller sur `/admin/products`
   - Modifier le stock d'un produit
   - Supprimer un produit (attention !)

---

## 📚 Documentation

### Guides Disponibles

- **`ADMIN_SETUP.md`** : Guide détaillé avec dépannage
- **`PHASE8_QUICKSTART.md`** : Guide rapide
- **`PHASE8_SUMMARY.md`** : Documentation technique
- **`PHASE8_COMPLETE.md`** : Récapitulatif final

### Fichiers SQL

- **`supabase/admin-setup.sql`** : Script SQL complet
- **`supabase/schema.sql`** : Schéma complet de la base

---

## 🎊 Félicitations !

Vous avez configuré le panel admin avec succès ! 🚀

**Prochaine étape** : Gérer vos commandes et produits ! 📦

---

## 🆘 Besoin d'Aide ?

Si vous êtes bloqué à une étape :

1. Relire l'étape en question
2. Vérifier les messages d'erreur
3. Consulter `ADMIN_SETUP.md` (section Dépannage)
4. Vérifier les logs dans PowerShell et le navigateur (F12)

**Tout est documenté pour vous aider !** 📚
