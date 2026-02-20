import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { formatPrice, getStockStatus } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

/**
 * Carte produit premium - dominance réduite
 * Focus sur élégance et sobriété
 */
export default function ProductCard({ product }: ProductCardProps) {
  const stockStatus = getStockStatus(product);

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block bg-[#F6F1E8] rounded-sm overflow-hidden border border-azalis-green/10 hover:border-[#4F6758]/20 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image du produit - hauteur réduite */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-azalis-beige/40 to-azalis-beige/20 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-[#4F6758]/30">
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
          </div>
        )}

        {/* Badge stock - minimaliste */}
        {stockStatus.color === 'yellow' && (
          <div className="absolute top-3 right-3 bg-azalis-white/95 text-[#4F6758] text-xs font-light px-3 py-1 rounded-full shadow-sm border border-[#4F6758]/15">
            Stock limité
          </div>
        )}
        {stockStatus.color === 'red' && (
          <div className="absolute top-3 right-3 bg-azalis-white/95 text-red-600 text-xs font-light px-3 py-1 rounded-full shadow-sm border border-red-200">
            Rupture
          </div>
        )}
      </div>

      {/* Informations produit - padding réduit */}
      <div className="p-6 space-y-4">
        {/* Nom du produit */}
        <h3 className="font-serif text-xl font-medium text-[#4F6758] group-hover:text-azalis-green-hover transition-colors leading-tight">
          {product.name}
        </h3>

        {/* Problématique ciblée - 1 ligne max */}
        {product.description && (
          <p className="text-sm text-[#2E2E2E]/50 line-clamp-1 font-light">
            {product.description}
          </p>
        )}

        {/* Divider subtile */}
        <div className="h-px bg-[#4F6758]/8"></div>

        {/* Prix + CTA */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="text-3xl font-medium text-[#4F6758] block leading-none">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-[#2E2E2E]/40 mt-1.5 block font-light">30ml</span>
          </div>
          
          <button className="px-5 py-2.5 bg-[#4F6758] text-azalis-white text-sm font-light rounded-lg hover:bg-azalis-green-hover transition-colors shadow-sm">
            Découvrir
          </button>
        </div>
      </div>
    </Link>
  );
}
