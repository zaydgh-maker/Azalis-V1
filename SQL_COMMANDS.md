# 📝 Commandes SQL - Référence Rapide

## ⚠️ IMPORTANT

Toutes ces commandes doivent être exécutées **dans Supabase Dashboard** (SQL Editor), **PAS dans PowerShell** !

---

## 🔧 Configuration Initiale

### 1. Créer la table `admin_users`

```sql
-- Créer la table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Politiques
DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;
CREATE POLICY "Admins can read admin_users"
ON admin_users FOR SELECT
USING (auth.uid() IN (SELECT id FROM admin_users));

DROP POLICY IF EXISTS "Super admins can manage admin_users" ON admin_users;
CREATE POLICY "Super admins can manage admin_users"
ON admin_users FOR ALL
USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin'));

-- Fonction helper
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM admin_users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. Ajouter un utilisateur admin

**⚠️ Remplacer `VOTRE-UUID-ICI` par l'UUID de votre utilisateur !**

```sql
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

---

## 🔍 Vérifications

### Vérifier la table `admin_users`

```sql
SELECT * FROM admin_users;
```

### Vérifier les utilisateurs auth

```sql
SELECT id, email, created_at, confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### Vérifier qu'un utilisateur est admin

```sql
SELECT 
    u.id,
    u.email,
    a.role,
    a.created_at
FROM auth.users u
LEFT JOIN admin_users a ON u.id = a.id
WHERE u.email = 'admin@azalis.com';
```

---

## 🛠️ Gestion des Admins

### Ajouter un admin standard (non super_admin)

```sql
-- 1. Créer l'utilisateur dans Authentication > Users
-- 2. Copier son UUID
-- 3. Exécuter ce SQL :

INSERT INTO admin_users (id, email, role)
VALUES (
    'uuid-du-nouvel-admin',
    'manager@azalis.com',
    'admin'  -- Rôle 'admin' au lieu de 'super_admin'
);
```

### Changer le rôle d'un admin

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

## 📊 Statistiques

### Compter les admins

```sql
SELECT 
    role,
    COUNT(*) as count
FROM admin_users
GROUP BY role;
```

### Lister tous les admins

```sql
SELECT 
    a.email,
    a.role,
    a.created_at,
    u.last_sign_in_at
FROM admin_users a
JOIN auth.users u ON a.id = u.id
ORDER BY a.created_at DESC;
```

---

## 🔒 Sécurité

### Vérifier que RLS est activé

```sql
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'admin_users';
```

Résultat attendu : `rowsecurity = true`

### Vérifier les politiques RLS

```sql
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'admin_users';
```

---

## 🧹 Nettoyage (si nécessaire)

### Supprimer la table `admin_users`

⚠️ **Attention** : Cela supprimera tous les admins !

```sql
DROP TABLE IF EXISTS admin_users CASCADE;
```

### Supprimer un utilisateur auth

⚠️ **Attention** : Cela supprimera l'utilisateur définitivement !

```sql
-- Méthode 1 : Via SQL
DELETE FROM auth.users WHERE email = 'admin@azalis.com';

-- Méthode 2 : Via Dashboard (recommandé)
-- Authentication > Users > Cliquer sur l'utilisateur > Delete user
```

---

## 📚 Ressources

### Fichiers SQL

- **`supabase/admin-setup.sql`** : Script complet de configuration
- **`supabase/schema.sql`** : Schéma complet de la base

### Documentation

- **`ADMIN_SETUP.md`** : Guide détaillé
- **`ADMIN_CONFIGURATION_GUIDE.md`** : Ce fichier
- **`PHASE8_QUICKSTART.md`** : Guide rapide

---

## ✅ Checklist

Cocher au fur et à mesure :

- [ ] Supabase Dashboard ouvert
- [ ] Script SQL `admin-setup.sql` exécuté
- [ ] Table `admin_users` créée
- [ ] Utilisateur créé dans Authentication
- [ ] UUID copié
- [ ] INSERT INTO `admin_users` exécuté
- [ ] Vérification : `SELECT * FROM admin_users;` retourne 1 ligne
- [ ] Serveur Next.js lancé (`npm run dev`)
- [ ] Page `/admin/login` accessible
- [ ] Connexion réussie
- [ ] Dashboard accessible

---

## 🎉 Terminé !

Si toutes les cases sont cochées, votre admin panel est **prêt** ! 🚀

**Prochaine étape** : Gérer vos commandes sur `/admin/orders` ! 📦
