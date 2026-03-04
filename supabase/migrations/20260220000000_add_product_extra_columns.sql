-- Ajout des colonnes usage_protocol et faq à la table products
ALTER TABLE products ADD COLUMN IF NOT EXISTS usage_protocol TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]';

COMMENT ON COLUMN products.usage_protocol IS 'Protocole d''utilisation du produit';
COMMENT ON COLUMN products.faq IS 'FAQ produit: [{question, answer}, ...]';
