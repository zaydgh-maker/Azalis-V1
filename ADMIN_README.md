# 🔐 Admin Panel AZALIS - Guide Complet

## 🎯 Vue d'Ensemble

Le panel admin AZALIS est une interface sécurisée pour gérer votre boutique en ligne.

**URL** : http://localhost:3000/admin/login (en développement)

---

## ⚡ Démarrage Rapide

### 1. Configuration (À faire une seule fois)

**Temps estimé** : 5 minutes

#### Étape 1 : Créer la table `admin_users`

Dans **Supabase Dashboard** (https://app.supabase.com) :

1. SQL Editor → New query
2. Copier le contenu de `supabase/admin-setup.sql`
3. Run

#### Étape 2 : Créer un utilisateur admin

1. Authentication → Users → Add user
2. Email : `admin@azalis.com`
3. Password : Votre mot de passe
4. ✅ Cocher "Auto Confirm User"
5. Create user
6. **Copier l'UUID**

#### Étape 3 : Ajouter dans `admin_users`

Dans SQL Editor :

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    'VOTRE-UUID-ICI',
    'admin@azalis.com',
    'super_admin'
);
```

### 2. Connexion

```bash
npm run dev
```

Aller sur : http://localhost:3000/admin/login

---

## 📊 Fonctionnalités

### Dashboard (`/admin/dashboard`)

**Statistiques** :
- 📦 Total commandes
- ⏳ En attente
- ✅ Payées
- 💰 Chiffre d'affaires
- ⚠️ Stock faible

**Commandes récentes** :
- 10 dernières commandes
- Accès rapide

---

### Commandes (`/admin/orders`)

**Liste** :
- Toutes les commandes
- Filtres : statut, paiement, recherche
- Export CSV

**Détail** (`/admin/orders/[id]`) :
- Infos client
- Infos paiement
- Changement de statut
- Métadonnées

**Statuts disponibles** :
1. `pending` → En attente
2. `paid` → Payée
3. `confirmed` → Confirmée
4. `preparing` → En préparation
5. `shipped` → Expédiée
6. `delivered` → Livrée
7. `cancelled` → Annulée

---

### Produits (`/admin/products`)

**Liste** :
- Grille responsive
- Image, nom, prix, stock

**Actions** :
- Modifier le stock (inline)
- Supprimer un produit

---

## 🔒 Sécurité

### Protection

- ✅ Middleware Next.js
- ✅ Server Components
- ✅ Supabase RLS
- ✅ Vérification du rôle

### Rôles

- **`super_admin`** : Tous les droits
- **`admin`** : Commandes + Produits

---

## 🛠️ Gestion des Admins

### Ajouter un admin

```sql
-- 1. Créer l'utilisateur dans Authentication > Users
-- 2. Copier son UUID
-- 3. Exécuter :

INSERT INTO admin_users (id, email, role)
VALUES (
    'uuid-du-nouvel-admin',
    'manager@azalis.com',
    'admin'
);
```

### Changer le rôle

```sql
UPDATE admin_users
SET role = 'super_admin'
WHERE email = 'manager@azalis.com';
```

### Supprimer un admin

```sql
DELETE FROM admin_users
WHERE email = 'manager@azalis.com';
```

---

## 📥 Export CSV

### Utilisation

1. Aller sur `/admin/orders`
2. Appliquer des filtres (optionnel)
3. Cliquer sur "📥 Exporter en CSV"
4. Le fichier est téléchargé : `azalis-commandes-YYYY-MM-DD.csv`

### Colonnes exportées

- ID
- Client
- Email
- Téléphone
- Ville
- Adresse
- Total
- Paiement
- Statut
- Date

---

## 🐛 Dépannage

### Problème : Impossible de se connecter

**Solutions** :

1. Vérifier l'email et le mot de passe
2. Vérifier que l'utilisateur est dans `admin_users` :
   ```sql
   SELECT * FROM admin_users WHERE email = 'admin@azalis.com';
   ```
3. Vérifier que l'utilisateur est confirmé dans Authentication > Users

---

### Problème : "Vous n'avez pas les droits"

**Solutions** :

1. Vérifier que l'UUID est correct :
   ```sql
   SELECT id FROM auth.users WHERE email = 'admin@azalis.com';
   ```
2. Vérifier que l'UUID est dans `admin_users`
3. Réexécuter l'INSERT si nécessaire

---

### Problème : Redirection infinie

**Solutions** :

1. Supprimer les cookies (F12 > Application > Cookies)
2. Redémarrer le serveur
3. Se reconnecter

---

## 📚 Documentation

### Configuration

- **`ADMIN_SETUP.md`** - Guide détaillé
- **`ADMIN_CONFIGURATION_GUIDE.md`** - Guide visuel
- **`SQL_COMMANDS.md`** - Référence SQL

### Technique

- **`PHASE8_SUMMARY.md`** - Documentation complète
- **`PHASE8_QUICKSTART.md`** - Guide rapide

---

## ✅ Checklist de Production

Avant de déployer en production :

- [ ] Changer les mots de passe par défaut
- [ ] Utiliser des emails professionnels
- [ ] Activer l'authentification 2FA sur Supabase
- [ ] Configurer les sauvegardes Supabase
- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier les politiques RLS
- [ ] Configurer HTTPS
- [ ] Surveiller les logs

---

## 🎉 Félicitations !

Vous avez un **admin panel professionnel** ! 🚀

**Prochaine étape** : Gérer vos commandes et améliorer la communication avec les clients ! 📧
