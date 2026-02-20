-- ============================================
-- AZALIS V1 - Configuration Admin Panel
-- PostgreSQL / Supabase
-- Version: 1.0.0
-- Date: 2026-02-13
-- ============================================

-- ⚠️ IMPORTANT : Exécuter ce script dans Supabase Dashboard
-- SQL Editor → New query → Copier/Coller → Run

-- ============================================
-- 1. TABLE ADMIN USERS
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

-- Commentaires pour documentation
COMMENT ON TABLE admin_users IS 'Utilisateurs avec accès admin au dashboard';
COMMENT ON COLUMN admin_users.role IS 'Rôle: admin (gestion commandes/produits) ou super_admin (tous les droits)';

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS)
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
-- 3. FONCTION HELPER
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
-- 4. TRIGGER
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

-- ============================================
-- 5. VÉRIFICATION
-- ============================================

-- Vérifier que la table est créée
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'admin_users';

-- Vérifier que RLS est activé
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'admin_users';

-- ============================================
-- 6. PROCHAINES ÉTAPES
-- ============================================

-- ✅ Table créée avec succès !
-- 
-- Prochaines étapes :
-- 
-- 1. Créer un utilisateur dans Authentication > Users
--    - Email : admin@azalis.com
--    - Password : Choisir un mot de passe sécurisé
--    - ✅ Cocher "Auto Confirm User"
-- 
-- 2. Copier l'UUID de l'utilisateur
-- 
-- 3. Exécuter ce SQL (remplacer l'UUID) :
--    INSERT INTO admin_users (id, email, role)
--    VALUES (
--        'VOTRE-UUID-ICI',
--        'admin@azalis.com',
--        'super_admin'
--    );
-- 
-- 4. Tester la connexion sur http://localhost:3000/admin/login
-- 
-- ============================================
-- FIN DU SCRIPT
-- ============================================
