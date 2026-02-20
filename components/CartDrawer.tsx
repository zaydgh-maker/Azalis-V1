'use client';

/**
 * Drawer du panier AZALIS
 * 
 * Panneau latéral qui affiche le contenu du panier avec :
 * - Liste des produits
 * - Modification des quantités
 * - Suppression d'items
 * - Total dynamique
 * - Bouton Commander
 */

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
    itemCount,
  } = useCart();

  // Gérer le clic sur "Commander"
  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-azalis-black/50 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-azalis-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header du drawer */}
          <div className="flex items-center justify-between p-6 border-b border-azalis-green/10">
            <h2 className="text-2xl font-serif font-semibold text-azalis-green">
              Panier ({itemCount})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-azalis-beige rounded-full transition-colors"
              aria-label="Fermer le panier"
            >
              <svg
                className="w-6 h-6 text-azalis-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Contenu du panier */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              // Panier vide
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6 p-6 bg-azalis-beige rounded-full">
                  <svg
                    className="w-16 h-16 text-azalis-green/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-azalis-green mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-sm text-azalis-black/60 mb-6">
                  Découvrez nos produits naturels
                </p>
                <Link
                  href="/produits"
                  onClick={closeCart}
                  className="px-6 py-3 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              // Liste des produits
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-azalis-beige rounded-lg"
                  >
                    {/* Image produit */}
                    <Link
                      href={`/produit/${item.slug}`}
                      onClick={closeCart}
                      className="relative w-20 h-20 flex-shrink-0 bg-azalis-white rounded overflow-hidden"
                    >
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-azalis-green/30"
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
                    </Link>

                    {/* Infos produit */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produit/${item.slug}`}
                        onClick={closeCart}
                        className="block"
                      >
                        <h3 className="font-serif font-semibold text-azalis-green hover:text-azalis-green/80 transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-azalis-black/70 mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Contrôles quantité */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-azalis-white rounded hover:bg-azalis-green hover:text-azalis-white transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>

                        <span className="text-sm font-medium text-azalis-black w-8 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-azalis-white rounded hover:bg-azalis-green hover:text-azalis-white transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>

                        {/* Bouton supprimer */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          aria-label="Supprimer du panier"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer du drawer avec total et bouton */}
          {items.length > 0 && (
            <div className="border-t border-azalis-green/10 p-6 space-y-4 bg-azalis-white">
              {/* Total */}
              <div className="flex items-center justify-between text-lg">
                <span className="font-serif font-semibold text-azalis-green">
                  Total
                </span>
                <span className="text-2xl font-semibold text-azalis-green">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Bouton Commander */}
              <button
                onClick={handleCheckout}
                className="w-full px-8 py-4 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors"
              >
                Commander
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
