'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';
import { createClient } from '@supabase/supabase-js';

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    addToCart,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 300;
  const freeShippingProgress = Math.min(1, total / FREE_SHIPPING_THRESHOLD || 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const hasFreeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const SHIPPING_COST = 30;

  const [serumUpsell, setSerumUpsell] = useState<{
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    slug: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setSerumUpsell(null);
      return;
    }

    const hasAntiAcne = items.some((item) => item.slug === 'serum-anti-acne');
    const hasHydratant = items.some((item) => item.slug === 'serum-hydratant-figue');

    let targetSlug: string | null = null;

    if (hasAntiAcne && !hasHydratant) {
      targetSlug = 'serum-hydratant-figue';
    } else if (hasHydratant && !hasAntiAcne) {
      targetSlug = 'serum-anti-acne';
    } else {
      setSerumUpsell(null);
      return;
    }

    const loadSerums = async () => {
      const { data, error } = await supabasePublic
        .from('products')
        .select('id, name, price, image_url, slug')
        .in('slug', ['serum-hydratant-figue', 'serum-anti-acne']);

      if (error || !data) {
        console.error('Error loading serums for upsell:', error);
        setSerumUpsell(null);
        return;
      }

      const product = data.find((p) => p.slug === targetSlug);

      if (!product) {
        setSerumUpsell(null);
        return;
      }

      setSerumUpsell({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        slug: product.slug,
      });
    };

    loadSerums();
  }, [isOpen, items]);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-azalis-black/50 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#F7F4EF] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: '-8px 0 30px rgba(0,0,0,0.06)' }}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-azalis-green/10">
            <h2 className="text-xl font-serif font-semibold text-azalis-green">
              Panier ({itemCount} {itemCount === 1 ? 'article' : 'articles'})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-azalis-beige rounded-full transition-colors"
              aria-label="Fermer le panier"
            >
              <svg className="w-6 h-6 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Barre progression */}
          {items.length > 0 && (
            <div className="px-6 pt-4 pb-4 border-b border-azalis-green/10">
              <p className="mb-2 text-[11px] text-azalis-black/70">
                {!hasFreeShipping
                  ? `Plus que ${remainingForFreeShipping} DH pour la livraison offerte`
                  : 'Livraison offerte sur cette commande'}
              </p>
              <div className="h-1 w-full rounded-full bg-[#E8E2D9] overflow-hidden">
                <div
                  className="h-full bg-azalis-green transition-[width] duration-300 ease-out"
                  style={{ width: `${freeShippingProgress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6 p-6 bg-azalis-beige rounded-full">
                  <svg className="w-16 h-16 text-azalis-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-azalis-green mb-2">Votre panier est vide</h3>
                <p className="text-sm text-azalis-black/60 mb-6">Découvrez nos produits naturels</p>
                <Link
                  href="/produits"
                  onClick={closeCart}
                  className="px-6 py-3 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <>
                {/* Liste produits */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-4 py-3 bg-azalis-beige rounded-lg">
                      <Link
                        href={`/produit/${item.slug}`}
                        onClick={closeCart}
                        className="flex-shrink-0 w-20 h-20 rounded-[10px] bg-[#F3EFE9] flex items-center justify-center overflow-hidden"
                      >
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                            sizes="80px"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-azalis-green/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/produit/${item.slug}`} onClick={closeCart} className="block">
                          <h3 className="font-serif font-medium text-azalis-green text-sm hover:text-azalis-green/80 transition-colors truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="mt-1 text-sm font-bold text-azalis-green">{formatPrice(item.price)}</p>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-11 h-11 flex items-center justify-center bg-azalis-white rounded-md border border-azalis-green/20 hover:bg-azalis-beige transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>

                          <span className="text-xs font-medium text-azalis-black w-8 text-center">{item.quantity}</span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-11 h-11 flex items-center justify-center bg-azalis-white rounded-md border border-azalis-green/20 hover:bg-azalis-beige transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-2 text-azalis-black/30 hover:text-[#C25757] hover:bg-[#FDEBEB] rounded-md transition-colors"
                            aria-label="Supprimer du panier"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell */}
                {serumUpsell && (
                  <div className="mt-4 pt-4 border-t border-azalis-green/10">
                    <h4 className="mb-3 text-[11px] font-medium tracking-[0.18em] uppercase text-azalis-black/50">
                      Souvent associé à votre routine
                    </h4>
                    <div className="flex items-center gap-3 p-3 bg-azalis-beige rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0 rounded-[8px] bg-[#F3EFE9] overflow-hidden">
                        {serumUpsell.image_url ? (
                          <Image
                            src={serumUpsell.image_url}
                            alt={serumUpsell.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-azalis-green/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-azalis-green truncate">{serumUpsell.name}</p>
                        <p className="mt-0.5 text-xs font-semibold text-azalis-green">{formatPrice(serumUpsell.price)}</p>
                        <p className="mt-0.5 text-[11px] text-azalis-green/60">+ Livraison offerte</p>
                      </div>
                      <button
                        onClick={() =>
                          addToCart({
                            id: serumUpsell.id,
                            name: serumUpsell.name,
                            price: serumUpsell.price,
                            image_url: serumUpsell.image_url,
                            slug: serumUpsell.slug,
                          })
                        }
                        className="flex-shrink-0 px-3 py-2 text-xs bg-azalis-green text-white rounded-md hover:bg-[#2E4A3A] transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div
              className="sticky bottom-0 z-20 border-t border-azalis-green/10 px-5 py-4 bg-[#FAF8F5]"
              style={{ boxShadow: '0 -10px 24px rgba(0,0,0,0.08)' }}
            >
              <div className="space-y-1.5 text-xs text-azalis-black/70 mb-3">
                <div className="flex items-center justify-between">
                  <span>Sous-total</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Livraison</span>
                  <span className="font-medium">{hasFreeShipping ? 'Offerte' : `${SHIPPING_COST} DH`}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 pb-2 border-b border-azalis-green/10">
                <span className="font-serif text-sm uppercase tracking-[0.12em] text-azalis-green">Total</span>
                <span className="font-serif text-2xl font-semibold text-azalis-green">
                  {formatPrice(hasFreeShipping ? total : total + SHIPPING_COST)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full h-[56px] bg-azalis-green text-azalis-white font-medium rounded-[14px] hover:bg-[#2E4A3A] transition-colors mb-2"
              >
                Commander
              </button>

              <div className="text-[11px] text-azalis-black/50 text-center leading-relaxed">
                <p>Paiement en espèces à la réception</p>
                <p>Aucun paiement en ligne requis</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
