import Link from 'next/link';
import Container from '@/components/Container';

/**
 * Page 404 personnalisée pour les produits introuvables
 */
export default function ProductNotFound() {
  return (
    <section className="py-20 min-h-[60vh] flex items-center">
      <Container size="md">
        <div className="text-center space-y-6">
          {/* Icône */}
          <div className="inline-block p-6 bg-azalis-beige rounded-full mb-4">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-azalis-green">
            Produit introuvable
          </h1>

          {/* Message */}
          <p className="text-base md:text-lg text-azalis-black/70 max-w-md mx-auto">
            Désolé, ce produit n&apos;existe pas ou n&apos;est plus disponible.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/produits"
              className="inline-block px-8 py-4 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors duration-200"
            >
              Voir tous les produits
            </Link>
            <Link
              href="/"
              className="inline-block px-8 py-4 border-2 border-azalis-green text-azalis-green font-medium rounded-sm hover:bg-azalis-green hover:text-azalis-white transition-colors duration-200"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
