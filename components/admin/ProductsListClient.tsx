'use client';

/**
 * Liste des Produits avec Actions
 * Modals édition/création, confirmation suppression
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/products';
import ProductEditModal from './ProductEditModal';
import ProductCreateModal from './ProductCreateModal';
import ProductDeleteConfirm from './ProductDeleteConfirm';

interface Product {
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
  created_at?: string;
}

interface ProductsListClientProps {
  products: Product[];
}

export default function ProductsListClient({ products: initialProducts }: ProductsListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditSuccess = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
    setEditProduct(null);
    router.refresh();
  };

  const handleCreateSuccess = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowCreateModal(false);
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${deleteProduct.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erreur lors de la suppression');
      }

      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      setDeleteProduct(null);
      router.refresh();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error}
        </div>
      )}

      {products.length === 0 && !showCreateModal ? (
        <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-8 text-center">
          <p className="text-azalis-black/60 mb-4">Aucun produit pour le moment</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-azalis-green text-azalis-white rounded-sm hover:bg-azalis-green/90 transition-colors"
          >
            Ajouter un produit
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-azalis-green text-azalis-white rounded-sm hover:bg-azalis-green/90 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un produit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-azalis-white rounded-lg border border-azalis-green/10 overflow-hidden"
            >
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

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditProduct(product)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-azalis-beige text-azalis-black rounded-sm hover:bg-azalis-green/10 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setDeleteProduct(product)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-sm hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {editProduct && (
        <ProductEditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deleteProduct && (
        <ProductDeleteConfirm
          productName={deleteProduct.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteProduct(null)}
          isLoading={isUpdating}
        />
      )}

      {showCreateModal && (
        <ProductCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
