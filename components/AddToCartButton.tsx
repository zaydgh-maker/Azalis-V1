'use client';

/**
 * Bouton "Ajouter au panier" pour les pages produits
 * 
 * Gère l'ajout d'un produit au panier et affiche
 * un feedback visuel à l'utilisateur
 */

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/supabase';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Ajouter au panier
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      slug: product.slug,
    });

    // Feedback visuel
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Si rupture de stock
  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full md:w-auto px-8 py-4 bg-azalis-black/20 text-azalis-black/50 font-medium rounded-sm cursor-not-allowed"
      >
        Rupture de stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full md:w-auto px-8 py-4 font-medium rounded-sm transition-all duration-200 ${
        isAdded
          ? 'bg-green-600 text-white'
          : 'bg-azalis-green text-azalis-white hover:bg-azalis-green/90'
      }`}
    >
      {isAdded ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Ajouté au panier !
        </span>
      ) : (
        'Ajouter au panier'
      )}
    </button>
  );
}
