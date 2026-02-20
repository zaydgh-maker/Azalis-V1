-- ============================================
-- AZALIS V1 - Schéma de Base de Données
-- PostgreSQL / Supabase
-- Version: 1.0.0
-- Date: 2026-02-13
-- ============================================

-- ============================================
-- 1. SUPPRESSION DES TABLES EXISTANTES
-- ============================================

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ============================================
-- 2. TABLE PRODUCTS
-- ============================================

CREATE TABLE products (
    -- Identifiant unique
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informations de base
    name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 200),
    slug TEXT UNIQUE NOT NULL CHECK (char_length(slug) >= 3 AND char_length(slug) <= 200),
    description TEXT CHECK (char_length(description) <= 2000),
    
    -- Prix et stock
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    
    -- Médias
    image_url TEXT CHECK (char_length(image_url) <= 500),
    
    -- Détails produit
    ingredients TEXT CHECK (char_length(ingredients) <= 2000),
    benefits TEXT CHECK (char_length(benefits) <= 2000),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_stock ON products(stock) WHERE stock > 0;

-- Commentaires pour documentation
COMMENT ON TABLE products IS 'Catalogue des produits AZALIS';
COMMENT ON COLUMN products.slug IS 'URL-friendly identifier (ex: creme-visage-bio)';
COMMENT ON COLUMN products.price IS 'Prix en euros (format: 29.99)';
COMMENT ON COLUMN products.stock IS 'Quantité disponible en stock';

-- ============================================
-- 3. TABLE ORDERS
-- ============================================

CREATE TABLE orders (
    -- Identifiant unique
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informations client
    customer_name TEXT NOT NULL CHECK (char_length(customer_name) >= 2 AND char_length(customer_name) <= 100),
    customer_email TEXT CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT NOT NULL CHECK (char_length(phone) >= 10 AND char_length(phone) <= 20),
    
    -- Adresse de livraison
    address TEXT NOT NULL CHECK (char_length(address) >= 5 AND char_length(address) <= 200),
    city TEXT NOT NULL CHECK (char_length(city) >= 2 AND char_length(city) <= 100),
    postal_code TEXT CHECK (char_length(postal_code) >= 4 AND char_length(postal_code) <= 10),
    
    -- Montant et paiement
    total NUMERIC(10, 2) NOT NULL CHECK (total > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cash_on_delivery')),
    
    -- Statut de la commande
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'paid', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'payment_failed')
    ),
    
    -- Stripe IDs (pour les paiements par carte)
    stripe_session_id TEXT,
    stripe_payment_intent_id TEXT,
    
    -- Notes optionnelles
    notes TEXT CHECK (char_length(notes) <= 500),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Commentaires pour documentation
COMMENT ON TABLE orders IS 'Commandes clients AZALIS';
COMMENT ON COLUMN orders.status IS 'Statut: pending, paid, confirmed, preparing, shipped, delivered, cancelled, payment_failed';
COMMENT ON COLUMN orders.payment_method IS 'Méthode: card (carte) ou cash_on_delivery (paiement à la livraison)';
COMMENT ON COLUMN orders.total IS 'Montant total en MAD (Dirham marocain)';
COMMENT ON COLUMN orders.stripe_session_id IS 'ID de la session Stripe Checkout (si paiement par carte)';
COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'ID du PaymentIntent Stripe (si paiement par carte)';

-- ============================================
-- 4. FONCTION DE MISE À JOUR AUTOMATIQUE
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES RLS - PRODUCTS
-- ============================================

-- Lecture publique des produits (tout le monde peut voir)
CREATE POLICY "Public can read products"
    ON products
    FOR SELECT
    USING (true);

-- Insertion réservée aux admins (via service_role key)
CREATE POLICY "Service role can insert products"
    ON products
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Mise à jour réservée aux admins
CREATE POLICY "Service role can update products"
    ON products
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Suppression réservée aux admins
CREATE POLICY "Service role can delete products"
    ON products
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================
-- POLITIQUES RLS - ORDERS
-- ============================================

-- Insertion publique (tout le monde peut créer une commande)
CREATE POLICY "Public can insert orders"
    ON orders
    FOR INSERT
    WITH CHECK (true);

-- Lecture réservée aux admins uniquement
CREATE POLICY "Service role can read orders"
    ON orders
    FOR SELECT
    USING (auth.role() = 'service_role');

-- Mise à jour réservée aux admins
CREATE POLICY "Service role can update orders"
    ON orders
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Suppression réservée aux admins
CREATE POLICY "Service role can delete orders"
    ON orders
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================
-- 6. DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Insertion de produits de test
-- Décommenter pour ajouter des données de test

/*
INSERT INTO products (name, slug, description, price, stock, image_url, ingredients, benefits) VALUES
(
    'Crème Visage Bio',
    'creme-visage-bio',
    'Crème hydratante naturelle pour le visage, formulée avec des ingrédients biologiques.',
    29.99,
    50,
    '/images/products/creme-visage.jpg',
    'Aloe vera, huile de jojoba, beurre de karité, vitamine E',
    'Hydrate en profondeur, apaise les peaux sensibles, effet anti-âge naturel'
),
(
    'Sérum Éclat Naturel',
    'serum-eclat-naturel',
    'Sérum concentré pour un teint lumineux et unifié.',
    39.99,
    30,
    '/images/products/serum-eclat.jpg',
    'Vitamine C, acide hyaluronique, extrait de rose',
    'Illumine le teint, réduit les taches, effet bonne mine'
),
(
    'Huile Corps Nourrissante',
    'huile-corps-nourrissante',
    'Huile sèche multi-usage pour le corps, riche en nutriments.',
    24.99,
    40,
    '/images/products/huile-corps.jpg',
    'Huile d''argan, huile d''amande douce, vitamine E',
    'Nourrit intensément, adoucit la peau, parfum délicat'
);
*/

-- ============================================
-- 7. VUES UTILES (OPTIONNEL)
-- ============================================

-- Vue pour les produits en stock
CREATE OR REPLACE VIEW products_in_stock AS
SELECT 
    id,
    name,
    slug,
    description,
    price,
    stock,
    image_url,
    created_at
FROM products
WHERE stock > 0
ORDER BY created_at DESC;

-- Vue pour les statistiques des commandes
CREATE OR REPLACE VIEW orders_stats AS
SELECT 
    status,
    COUNT(*) as count,
    SUM(total) as total_amount,
    AVG(total) as average_amount
FROM orders
GROUP BY status;

-- ============================================
-- 8. TABLE ADMIN USERS (PROFILS ADMIN)
-- ============================================

-- Table pour stocker les rôles des utilisateurs
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
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- Commentaires pour documentation
COMMENT ON TABLE admin_users IS 'Utilisateurs avec accès admin au dashboard';
COMMENT ON COLUMN admin_users.role IS 'Rôle: admin (gestion commandes/produits) ou super_admin (tous les droits)';

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) - ADMIN
-- ============================================

-- Activer RLS sur admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

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
-- 10. FONCTION HELPER : Vérifier si un utilisateur est admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. TRIGGER : Mettre à jour updated_at automatiquement
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. DONNÉES DE TEST (OPTIONNEL)
-- ============================================

/*
-- Créer un utilisateur admin de test
-- Note: L'utilisateur doit d'abord être créé dans auth.users via Supabase Dashboard ou API
-- Ensuite, ajouter son ID ici :

INSERT INTO admin_users (id, email, role)
VALUES (
    'uuid-de-l-utilisateur-auth',
    'admin@azalis.com',
    'super_admin'
);
*/

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- Pour vérifier que tout est bien créé :
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM products_in_stock;
-- SELECT * FROM orders_stats;
-- SELECT * FROM admin_users;
