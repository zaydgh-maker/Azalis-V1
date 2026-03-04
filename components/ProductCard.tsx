import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { formatPrice, getStockStatus } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'discover';
}

/**
 * Carte produit premium - dominance réduite
 * Focus sur élégance et sobriété
 */
export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const stockStatus = getStockStatus(product);

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block bg-azalis-beige rounded-sm overflow-hidden border border-azalis-green/10 hover:border-azalis-green/20 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image du produit - hauteur fixe 320px */}
      <div className="relative h-80 bg-[#F5F0E8] overflow-hidden flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="text-center text-azalis-green/30">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs font-light">Image à venir</p>
          </div>
        )}

        {/* Badge stock - minimaliste */}
        {stockStatus.color === 'yellow' && (
          <div className="absolute top-3 right-3 bg-azalis-white/95 text-azalis-green text-xs font-light px-3 py-1 rounded-full shadow-sm border border-azalis-green/15">
            Stock limité
          </div>
        )}
        {stockStatus.color === 'red' && (
          <div className="absolute top-3 right-3 bg-azalis-white/95 text-red-600 text-xs font-light px-3 py-1 rounded-full shadow-sm border border-red-200">
            Rupture
          </div>
        )}
      </div>

      {/* Informations produit - hiérarchie restructurée */}
      <div className="p-6 space-y-3">
        {/* 1. Nom du produit */}
        <h3 className="font-serif text-xl font-medium text-azalis-green group-hover:text-azalis-green-hover transition-colors leading-tight">
          {product.name}
        </h3>

        {/* 2. Bénéfice/description (text-sm gray) */}
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed">
            {product.description}
          </p>
        )}

        {/* 3. Prix (text-base) */}
        <div className="pt-2">
          <div className="inline-flex flex-col">
            <span className="text-base font-medium text-azalis-green">
              {formatPrice(product.price)}
            </span>
            <span className="inline-block mt-1 text-[11px] font-medium bg-[#B8965A]/10 text-[#B8965A] border border-[#B8965A]/30 rounded-full px-3 py-0.5">
              Prix de lancement
            </span>
          </div>
          <span className="text-xs text-[#2E2E2E]/40 ml-2 font-light">30ml</span>
        </div>

        {/* 4. Bouton full-width */}
        <span className="block w-full mt-4 px-5 py-3 bg-azalis-green text-azalis-white text-sm font-normal rounded-lg hover:bg-azalis-green-hover transition-colors shadow-sm text-center">
          {variant === 'discover' ? 'Voir le produit' : 'Ajouter au panier'}
        </span>
      </div>
    </Link>
  );
}
