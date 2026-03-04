# 🔐 Configuration Admin Panel - Guide Complet

## 📋 Prérequis

- Projet Supabase créé et configuré
- Variables d'environnement Supabase dans `.env.local`
- Application Next.js lancée (`npm run dev`)

---

## 🚀 Configuration en 5 Étapes

### Étape 1 : Créer la Table `admin_users`

#### 1.1 Ouvrir Supabase Dashboard

1. Aller sur https://app.supabase.com
2. Sélectionner votre projet AZALIS
3. Dans le menu de gauche, cliquer sur **"SQL Editor"** (icône 📝)
4. Cliquer sur **"New query"**

#### 1.2 Exécuter le SQL

Copier et coller ce SQL dans l'éditeur :

```sql
-- ============================================
-- TABLE ADMIN USERS
-- ============================================

-- Créer la table admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    -- Identifiant unique (lié à auth.users)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations admin
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON admin_users;

-- Politique : Seuls les admins peuvent lire la table admin_users
CREATE POLICY "Admins can read admin_users"
ON admin_users
FOR SELECT
USING (
    auth.uid() IN (SELECT id FROM admin_users)
);

-- Politique : Seuls les super_admins peuvent modifier admin_users
CREATE POLICY "Super admins can manage admin_users"
ON admin_users
FOR ALL
USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin')
);

-- ============================================
-- FONCTION HELPER
-- ============================================

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Cliquer sur "Run" (ou Ctrl+Enter)**

✅ Vous devriez voir : "Success. No rows returned"

---

### Étape 2 : Créer un Utilisateur Admin

#### 2.1 Créer l'utilisateur dans Supabase Auth

1. Dans le menu de gauche, cliquer sur **"Authentication"**
2. Cliquer sur **"Users"**
3. Cliquer sur **"Add user"** (bouton vert en haut à droite)
4. Remplir le formulaire :
   - **Email** : `admin@azalis.com` (ou votre email)
   - **Password** : Choisir un mot de passe sécurisé (minimum 8 caractères)
   - **Auto Confirm User** : ✅ **IMPORTANT : Cocher cette case**
5. Cliquer sur **"Create user"**

#### 2.2 Copier l'UUID de l'utilisateur

1. Dans la liste des utilisateurs, trouver l'utilisateur que vous venez de créer
2. **Copier l'UUID** dans la colonne "ID" (format : `12345678-1234-1234-1234-123456789abc`)

**💡 Astuce** : Cliquer sur l'UUID pour le copier automatiquement

---

### Étape 3 : Ajouter l'Utilisateur dans `admin_users`

#### 3.1 Retourner dans SQL Editor

1. Dans le menu de gauche, cliquer sur **"SQL Editor"**
2. Cliquer sur **"New query"**

#### 3.2 Exécuter le SQL

Copier et coller ce SQL **en remplaçant `VOTRE-UUID-ICI`** par l'UUID copié à l'étape précédente :

```sql
-- Remplacer 'VOTRE-UUID-ICI' par l'UUID de votre utilisateur
INSERT INTO admin_users (id, email, role)
VALUES (
    'VOTRE-UUID-ICI',
    'admin@azalis.com',
    'super_admin'
);
```

**Exemple avec un UUID réel** :

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    '12345678-1234-1234-1234-123456789abc',
    'admin@azalis.com',
    'super_admin'
);
```

**Cliquer sur "Run"**

✅ Vous devriez voir : "Success. No rows returned"

---

### Étape 4 : Vérifier la Configuration

#### 4.1 Vérifier dans SQL Editor

Exécuter ce SQL :

```sql
SELECT * FROM admin_users;
```

Vous devriez voir une ligne avec :
- `id` : L'UUID de votre utilisateur
- `email` : admin@azalis.com
- `role` : super_admin
- `created_at` : Date et heure actuelles

#### 4.2 Vérifier la connexion Auth

Exécuter ce SQL :

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@azalis.com';
```

Vous devriez voir votre utilisateur dans la table `auth.users`.

---

### Étape 5 : Tester la Connexion Admin

#### 5.1 Lancer l'application

Dans PowerShell :

```powershell
cd "C:\AZALIS V1"
npm run dev
```

#### 5.2 Accéder à la page de login

1. Ouvrir votre navigateur
2. Aller sur http://localhost:3000/admin/login

#### 5.3 Se connecter

Remplir le formulaire :
- **Email** : `admin@azalis.com`
- **Password** : Le mot de passe choisi à l'étape 2.1

Cliquer sur **"Se connecter"**

✅ **Succès** : Vous êtes redirigé vers `/admin/dashboard`

❌ **Erreur** : Voir la section "Dépannage" ci-dessous

---

## 🎉 Félicitations !

Vous avez maintenant accès au panel admin ! 🚀

Vous pouvez :
- ✅ Voir le dashboard avec les statistiques
- ✅ Gérer les commandes (liste, détails, changement de statut)
- ✅ Filtrer et exporter les commandes en CSV
- ✅ Gérer les produits (modifier stock, supprimer)

---

## 🐛 Dépannage

### Erreur : "Vous n'avez pas les droits d'accès administrateur"

**Cause** : L'utilisateur n'est pas dans la table `admin_users`.

**Solution** :

1. Vérifier que l'UUID est correct :
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'admin@azalis.com';
   ```
2. Vérifier que l'utilisateur est dans `admin_users` :
   ```sql
   SELECT * FROM admin_users WHERE email = 'admin@azalis.com';
   ```
3. Si absent, réexécuter l'INSERT de l'étape 3

---

### Erreur : "Invalid login credentials"

**Cause** : Email ou mot de passe incorrect.

**Solution** :

1. Vérifier l'email dans Supabase Dashboard (Authentication > Users)
2. Réinitialiser le mot de passe :
   - Authentication > Users
   - Cliquer sur l'utilisateur
   - Cliquer sur "Reset password"
   - Entrer un nouveau mot de passe
   - Cocher "Auto Confirm User"
   - Cliquer sur "Update user"

---

### Erreur : "User not confirmed"

**Cause** : L'utilisateur n'a pas été confirmé automatiquement.

**Solution** :

1. Aller dans Authentication > Users
2. Cliquer sur l'utilisateur
3. Vérifier que "Email Confirmed" est à `true`
4. Si `false`, cliquer sur "Confirm email"

---

### Erreur : Redirection infinie vers `/admin/login`

**Cause** : Problème de cookies ou de session.

**Solution** :

1. Ouvrir les DevTools (F12)
2. Aller dans "Application" > "Cookies"
3. Supprimer tous les cookies de `localhost:3000`
4. Recharger la page
5. Se reconnecter

---

## 🔐 Sécurité

### Bonnes Pratiques

- ✅ Utiliser un mot de passe fort (minimum 12 caractères)
- ✅ Activer l'authentification 2FA sur Supabase
- ✅ Ne jamais partager les identifiants admin
- ✅ Créer des utilisateurs `admin` (non `super_admin`) pour les tâches quotidiennes
- ✅ Réserver `super_admin` pour les opérations sensibles

### Créer un Admin Standard (non Super Admin)

```sql
-- Créer d'abord l'utilisateur dans Authentication > Users
-- Puis exécuter ce SQL :

INSERT INTO admin_users (id, email, role)
VALUES (
    'uuid-du-nouvel-utilisateur',
    'manager@azalis.com',
    'admin'  -- Rôle 'admin' au lieu de 'super_admin'
);
```

**Différence entre les rôles** :
- `super_admin` : Peut tout faire, y compris gérer les autres admins
- `admin` : Peut gérer les commandes et produits, mais pas les autres admins

---

## 📚 Ressources

### Documentation

- **PHASE8_SUMMARY.md** : Documentation technique complète
- **supabase/schema.sql** : Schéma complet de la base de données

### Liens Utiles

- **Supabase Dashboard** : https://app.supabase.com
- **Supabase Auth Docs** : https://supabase.com/docs/guides/auth
- **Supabase RLS Docs** : https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Checklist de Configuration

- [ ] Table `admin_users` créée
- [ ] RLS activé sur `admin_users`
- [ ] Utilisateur créé dans Authentication
- [ ] Utilisateur ajouté dans `admin_users`
- [ ] Connexion testée avec succès
- [ ] Accès au dashboard confirmé
- [ ] Gestion des commandes testée
- [ ] Gestion des produits testée

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifier les logs du serveur Next.js dans PowerShell
2. Vérifier les logs dans la console du navigateur (F12)
3. Vérifier les tables dans Supabase Dashboard (Table Editor)
4. Consulter la documentation Supabase

---

## 🎊 Prêt pour la Production !

Une fois la configuration terminée, votre panel admin est **prêt pour la production** ! 🚀

N'oubliez pas de :
- Changer les mots de passe par défaut
- Configurer les variables d'environnement de production
- Activer HTTPS en production
- Configurer les sauvegardes Supabase
