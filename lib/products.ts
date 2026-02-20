/**
 * Gestion des produits AZALIS
 * 
 * Ce fichier contient toutes les fonctions pour récupérer
 * et manipuler les produits depuis Supabase.
 * 
 * Utilisation côté serveur uniquement (Server Components, API Routes)
 */

import { supabase, type Product } from './supabase';

// ============================================
// TYPES
// ============================================

/**
 * Résultat d'une opération sur les produits
 */
export interface ProductResult<T> {
  data: T | null;
  error: string | null;
}

// ============================================
// RÉCUPÉRATION DES PRODUITS
// ============================================

/**
 * Récupère tous les produits
 * 
 * @returns Liste de tous les produits (triés par date de création décroissante)
 * 
 * @example
 * ```tsx
 * const { data: products, error } = await getAllProducts();
 * if (error) {
 *   console.error(error);
 *   return;
 * }
 * // Utiliser products
 * ```
 */
export async function getAllProducts(): Promise<ProductResult<Product[]>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return {
        data: null,
        error: `Impossible de récupérer les produits: ${error.message}`,
      };
    }

    return {
      data: data as Product[],
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return {
      data: null,
      error: 'Une erreur inattendue est survenue lors de la récupération des produits.',
    };
  }
}

/**
 * Récupère tous les produits en stock uniquement
 * 
 * @returns Liste des produits avec stock > 0
 * 
 * @example
 * ```tsx
 * const { data: products, error } = await getProductsInStock();
 * ```
 */
export async function getProductsInStock(): Promise<ProductResult<Product[]>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products in stock:', error);
      return {
        data: null,
        error: `Impossible de récupérer les produits en stock: ${error.message}`,
      };
    }

    return {
      data: data as Product[],
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching products in stock:', error);
    return {
      data: null,
      error: 'Une erreur inattendue est survenue.',
    };
  }
}

/**
 * Récupère un produit par son slug
 * 
 * @param slug - Slug du produit (ex: "creme-visage-bio")
 * @returns Le produit correspondant ou null si introuvable
 * 
 * @example
 * ```tsx
 * const { data: product, error } = await getProductBySlug('creme-visage-bio');
 * if (!product) {
 *   notFound();
 * }
 * ```
 */
export async function getProductBySlug(slug: string): Promise<ProductResult<Product>> {
  try {
    // Validation du slug
    if (!slug || typeof slug !== 'string') {
      return {
        data: null,
        error: 'Slug invalide',
      };
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      // Si le produit n'existe pas, ce n'est pas une erreur technique
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: null, // Pas d'erreur, juste aucun résultat
        };
      }

      console.error('Error fetching product by slug:', error);
      return {
        data: null,
        error: `Impossible de récupérer le produit: ${error.message}`,
      };
    }

    return {
      data: data as Product,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching product by slug:', error);
    return {
      data: null,
      error: 'Une erreur inattendue est survenue.',
    };
  }
}

/**
 * Récupère un produit par son ID
 * 
 * @param id - ID du produit (UUID)
 * @returns Le produit correspondant ou null si introuvable
 */
export async function getProductById(id: string): Promise<ProductResult<Product>> {
  try {
    // Validation de l'ID
    if (!id || typeof id !== 'string') {
      return {
        data: null,
        error: 'ID invalide',
      };
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: null,
        };
      }

      console.error('Error fetching product by id:', error);
      return {
        data: null,
        error: `Impossible de récupérer le produit: ${error.message}`,
      };
    }

    return {
      data: data as Product,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching product by id:', error);
    return {
      data: null,
      error: 'Une erreur inattendue est survenue.',
    };
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Formate le prix d'un produit en dirhams marocains
 * 
 * @param price - Prix en dirhams (ex: 189)
 * @returns Prix formaté (ex: "189 DH")
 */
export function formatPrice(price: number): string {
  return `${price} DH`;
}

/**
 * Vérifie si un produit est en stock
 * 
 * @param product - Produit à vérifier
 * @returns true si le produit est en stock
 */
export function isInStock(product: Product): boolean {
  return product.stock > 0;
}

/**
 * Récupère le statut de stock d'un produit
 * 
 * @param product - Produit
 * @returns Statut de stock avec label et couleur
 */
export function getStockStatus(product: Product): {
  label: string;
  color: 'green' | 'yellow' | 'red';
} {
  if (product.stock === 0) {
    return { label: 'Rupture de stock', color: 'red' };
  }
  if (product.stock <= 5) {
    return { label: `Plus que ${product.stock} en stock`, color: 'yellow' };
  }
  return { label: 'En stock', color: 'green' };
}
