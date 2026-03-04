/**
 * Configuration du client Supabase pour AZALIS V1
 * 
 * Ce fichier configure la connexion à Supabase avec trois types de clients :
 * 1. Client public (anon key) - Pour les opérations côté client (produits, panier)
 * 2. Client browser (anon key, cookies) - Pour l'auth admin (persiste session en cookies)
 * 3. Client admin (service role) - Pour les opérations côté serveur uniquement
 */

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// ============================================
// VARIABLES D'ENVIRONNEMENT
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================
// VALIDATION DES VARIABLES
// ============================================

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL not configured. Using placeholder.');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured. Using placeholder.');
}

// Valeurs par défaut pour éviter les erreurs de build
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Log au démarrage serveur : SUPABASE_SERVICE_ROLE_KEY et client admin
if (typeof window === 'undefined') {
  if (supabaseServiceRoleKey && !supabaseServiceRoleKey.includes('placeholder')) {
    console.log(`[Supabase] SUPABASE_SERVICE_ROLE_KEY chargée (longueur: ${supabaseServiceRoleKey.length})`);
    console.log('[Supabase] Vérification admin : supabaseAdmin (serviceRoleKey) - bypass RLS pour admin_users');
  } else {
    console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY non configurée ou placeholder - admin fallback sur anon');
  }
}

// ============================================
// CLIENT PUBLIC (CÔTÉ CLIENT)
// ============================================

/**
 * Client Supabase public avec anon key
 * 
 * Utilisation :
 * - Lecture des produits (public)
 * - Création de commandes (public)
 * - Toute opération côté client (browser)
 * 
 * Sécurité :
 * - Protégé par Row Level Security (RLS)
 * - Peut être exposé côté client
 * - Permissions limitées par les politiques RLS
 */
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      persistSession: false, // Pas de session pour produits/panier
    },
  }
);

// ============================================
// CLIENT BROWSER AUTH (cookies - pour admin login)
// ============================================

/**
 * Client Supabase pour auth côté client - persiste la session en cookies
 * Nécessaire pour que le middleware détecte l'utilisateur après login
 * 
 * Utiliser UNIQUEMENT sur les pages d'auth (admin/login)
 */
export const supabaseBrowser =
  typeof window !== 'undefined'
    ? createBrowserClient(
        supabaseUrl || defaultUrl,
        supabaseAnonKey || defaultKey
      )
    : null;

// ============================================
// CLIENT ADMIN (CÔTÉ SERVEUR UNIQUEMENT)
// ============================================

/**
 * Client Supabase admin avec service role key
 * 
 * ⚠️ ATTENTION : Ne JAMAIS utiliser côté client !
 * 
 * Utilisation :
 * - API Routes Next.js uniquement
 * - Server Components uniquement
 * - Opérations admin (CRUD produits, gestion commandes)
 * 
 * Sécurité :
 * - Bypass Row Level Security
 * - Accès complet à la base de données
 * - NE DOIT JAMAIS être exposé au client
 * 
 * Exemple d'utilisation :
 * ```ts
 * // app/api/admin/products/route.ts
 * import { supabaseAdmin } from '@/lib/supabase';
 * 
 * export async function POST(request: Request) {
 *   const { data, error } = await supabaseAdmin
 *     .from('products')
 *     .insert({ ... });
 * }
 * ```
 */
export const supabaseAdmin = (() => {
  if (!supabaseServiceRoleKey || supabaseServiceRoleKey.includes('placeholder')) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not configured. Admin operations will fail.');
    // Retourner le client public en fallback (pour éviter les erreurs en dev)
    return supabase;
  }

  // Client admin : utilise serviceRoleKey (bypass RLS), PAS anon key
  return createClient(supabaseUrl || defaultUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
})();

/**
 * Alias pour createServerClient (pour les API routes)
 * Utilise le client public avec anon key (RLS activé)
 */
export const createServerClient = () => supabase;

// ============================================
// TYPES TYPESCRIPT
// ============================================

/**
 * Type pour un produit
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  ingredients: string | null;
  benefits: string | null;
  usage_protocol?: string | null;
  faq?: Array<{ question: string; answer: string }> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Type pour une commande
 */
export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  payment_method: 'card' | 'cash_on_delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Type pour créer une commande (sans les champs auto-générés)
 */
export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  payment_method: 'card' | 'cash_on_delivery';
  notes?: string;
}

/**
 * Type pour créer un produit (sans les champs auto-générés)
 */
export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  ingredients?: string;
  benefits?: string;
  usage_protocol?: string;
  faq?: Array<{ question: string; answer: string }>;
}

/**
 * Type pour la mise à jour partielle d'un produit
 */
export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string;
  ingredients?: string;
  benefits?: string;
  usage_protocol?: string;
  faq?: Array<{ question: string; answer: string }>;
}

// ============================================
// HELPERS DE BASE DE DONNÉES
// ============================================

/**
 * Récupère tous les produits en stock
 */
export async function getProductsInStock() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return { data: null, error };
  }

  return { data: data as Product[], error: null };
}

/**
 * Récupère un produit par son slug
 */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return { data: null, error };
  }

  return { data: data as Product, error: null };
}

/**
 * Crée une nouvelle commande
 */
export async function createOrder(orderData: CreateOrderInput) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { data: null, error };
  }

  return { data: data as Order, error: null };
}

// ============================================
// HELPERS ADMIN (SERVER-SIDE ONLY)
// ============================================

/**
 * Crée un nouveau produit (admin uniquement)
 * ⚠️ À utiliser uniquement dans les API Routes
 */
export async function createProduct(productData: CreateProductInput) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return { data: null, error };
  }

  return { data: data as Product, error: null };
}

/**
 * Met à jour un produit (admin uniquement)
 */
export async function updateProduct(
  productId: string,
  updates: UpdateProductInput
) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return { data: null, error };
  }

  return { data: data as Product, error: null };
}

/**
 * Supprime un produit (admin uniquement)
 */
export async function deleteProduct(productId: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { error };
  }

  return { error: null };
}

/**
 * Met à jour le statut d'une commande (admin uniquement)
 * ⚠️ À utiliser uniquement dans les API Routes
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    return { data: null, error };
  }

  return { data: data as Order, error: null };
}

/**
 * Récupère toutes les commandes (admin uniquement)
 * ⚠️ À utiliser uniquement dans les API Routes
 */
export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return { data: null, error };
  }

  return { data: data as Order[], error: null };
}
