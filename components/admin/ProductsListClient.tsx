'use client';

/**
 * Liste des Produits avec Actions
 * 
 * Client component pour gérer les actions sur les produits
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
}

interface ProductsListClientProps {
  products: Product[];
}

export default function ProductsListClient({ products: initialProducts }: ProductsListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStock = async (productId: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Mettre à jour l'état local
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );

      setEditingStock(null);
      router.refresh();
    } catch (err) {
      console.error('Error updating stock:', err);
      setError('Erreur lors de la mise à jour du stock');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) {
        throw deleteError;
      }

      // Mettre à jour l'état local
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      router.refresh();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Erreur lors de la suppression du produit');
    } finally {
      setIsUpdating(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-8 text-center">
        <p className="text-azalis-black/60">Aucun produit pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error}
        </div>
      )}

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-azalis-white rounded-lg border border-azalis-green/10 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-48 bg-azalis-beige">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-azalis-green/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-4">
              <h3 className="font-serif font-semibold text-azalis-green text-lg mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-azalis-black/60 mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-azalis-green">
                  {formatPrice(product.price)}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-800'
                      : product.stock < 10
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  Stock: {product.stock}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {/* Modifier le stock */}
                {editingStock === product.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      min="0"
                      className="flex-1 px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 text-sm"
                    />
                    <button
                      onClick={() => handleUpdateStock(product.id)}
                      disabled={isUpdating}
                      className="px-3 py-2 bg-azalis-green text-azalis-white rounded-sm hover:bg-azalis-green/90 transition-colors disabled:opacity-50 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingStock(null)}
                      disabled={isUpdating}
                      className="px-3 py-2 bg-azalis-black/10 text-azalis-black rounded-sm hover:bg-azalis-black/20 transition-colors disabled:opacity-50 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingStock(product.id);
                      setNewStock(product.stock);
                    }}
                    disabled={isUpdating}
                    className="w-full px-4 py-2 bg-azalis-beige text-azalis-black rounded-sm hover:bg-azalis-green/10 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    Modifier le stock
                  </button>
                )}

                {/* Supprimer */}
                <button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-sm hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
