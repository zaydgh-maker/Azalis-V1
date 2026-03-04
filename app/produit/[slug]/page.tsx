import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import { getProductBySlug, getAllProducts } from '@/lib/products';

interface ProductPageProps {
  params: {
    slug: string;
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

  // Récupérer tous les produits pour la section "Vous aimerez aussi"
  const { data: allProducts } = await getAllProducts();
  const otherProducts = allProducts?.filter(p => p.id !== product.id) || [];

  return <ProductPageClient product={product} otherProducts={otherProducts} />;
}

/**
 * Génération des métadonnées dynamiques pour le SEO
 */
export async function generateMetadata({ params }: ProductPageProps) {
  const { data: product } = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Produit introuvable - AZALIS',
    };
  }

  return {
    title: `${product.name} - Dermo-cosmétique naturelle | AZALIS`,
    description: product.description || `${product.name} - Formule dermo-cosmétique naturelle haute tolérance. Développé en laboratoire agréé`,
  };
}
