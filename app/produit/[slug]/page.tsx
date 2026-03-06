import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import { getProductBySlug, getAllProducts } from '@/lib/products';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

/**
 * Génération des métadonnées dynamiques pour le SEO
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { data: product } = await getProductBySlug(params.slug);

  if (!product) {
    return { title: 'Produit introuvable' };
  }

  return {
    title: product.name,
    description: `${product.description} 98% d'origine naturelle. Livraison au Maroc, paiement à la réception.`,
    alternates: { canonical: `https://azalis.ma/produit/${params.slug}` },
    openGraph: {
      title: `${product.name} | Azalis`,
      description: product.description || '',
      url: `https://azalis.ma/produit/${params.slug}`,
      images: [
        {
          url: product.image_url || '/images/serum-hydratant.png',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
    },
  };
}

/**
 * Page produit premium dermo - Optimisée conversion avec accordéons et sticky CTA
 *
 * Route : /produit/[slug]
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { data: product, error } = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-serif text-red-600 mb-4">
            Erreur
          </h1>
          <p className="text-azalis-black/70">{error}</p>
        </div>
      </section>
    );
  }

  const { data: allProducts } = await getAllProducts();
  const otherProducts = allProducts?.filter(p => p.id !== product.id) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: { '@type': 'Brand', name: 'Azalis' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'MAD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Azalis' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} otherProducts={otherProducts} />
    </>
  );
}
