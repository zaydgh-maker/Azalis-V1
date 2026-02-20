import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';

export const metadata = {
  title: 'Notre Gamme - Dermo-cosmétique naturelle | AZALIS',
  description: 'Découvrez notre gamme de soins dermo-cosmétiques naturels haute tolérance, formulés avec rigueur en laboratoire agréé.',
};

/**
 * Page catalogue de tous les produits
 * 
 * Route : /produits
 */
export default async function ProductsPage() {
  // Récupérer tous les produits
  const { data: products, error } = await getAllProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-azalis-white">
        <Container size="lg">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-azalis-green leading-tight">
              La gamme AZALIS
            </h1>
            <p className="text-xl md:text-2xl text-azalis-black/60 leading-relaxed font-light">
              Des soins ciblés, formulés avec rigueur pour répondre aux besoins spécifiques de votre peau.
            </p>
          </div>
        </Container>
      </section>

      {/* Catalogue Produits */}
      <section className="py-24 md:py-32 bg-azalis-beige">
        <Container size="lg">
          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-12 max-w-2xl mx-auto">
              <p className="font-semibold">Erreur</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Aucun produit */}
          {!error && (!products || products.length === 0) && (
            <div className="text-center py-20">
              <h2 className="text-4xl font-serif font-semibold text-azalis-green mb-6">
                Notre gamme arrive bientôt
              </h2>
              <p className="text-lg text-azalis-black/60 max-w-xl mx-auto leading-relaxed">
                Découvrez prochainement notre sélection de soins naturels formulés avec rigueur.
              </p>
            </div>
          )}

          {/* Grille de produits */}
          {products && products.length > 0 && (
            <>
              <div className="mb-12 text-center">
                <p className="text-sm text-azalis-black/50 font-medium">
                  {products.length} soin{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Section Confiance */}
      <section className="py-20 md:py-24 bg-azalis-white border-t border-azalis-green/10">
        <Container size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-azalis-beige/50">
                <svg className="w-8 h-8 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="font-medium text-azalis-green text-lg">Formulé avec rigueur</h3>
              <p className="text-sm text-azalis-black/60">Laboratoire agréé</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-azalis-beige/50">
                <svg className="w-8 h-8 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-medium text-azalis-green text-lg">Haute tolérance</h3>
              <p className="text-sm text-azalis-black/60">Peaux sensibles</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-azalis-beige/50">
                <svg className="w-8 h-8 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-azalis-green text-lg">98% naturel</h3>
              <p className="text-sm text-azalis-black/60">Origine naturelle</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-azalis-beige/50">
                <svg className="w-8 h-8 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="font-medium text-azalis-green text-lg">Livraison rapide</h3>
              <p className="text-sm text-azalis-black/60">Partout au Maroc</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
