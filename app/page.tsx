import Link from 'next/link';
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import { getProductsInStock } from '@/lib/products';

export const dynamic = "force-dynamic";

export default async function Home() {
  // Récupérer les produits depuis Supabase
  const { data: products, error } = await getProductsInStock();

  // Afficher tous les produits en stock
  const featuredProducts = products || [];

  return (
    <>
      {/* Hero Section - Institutionnel et Élégant */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 md:py-21 bg-azalis-white">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center space-y-20">
            {/* Titre principal - Autorité douce */}
            <div className="space-y-10">
              <h1 className="text-4xl sm:text-5xl md:text-5xl font-serif font-medium text-[#4F6758] leading-[1.05] tracking-tight">
                Le naturel sous contrôle.
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-[#2E2E2E]/60 font-light leading-relaxed max-w-3xl mx-auto">
                Des formules naturelles élaborées avec rigueur pour préserver l'équilibre cutané.
              </p>

              {/* Ligne fine décorative */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="h-px w-12 bg-[#4F6758]/20"></div>
                <div className="w-1 h-1 rounded-full bg-[#4F6758]/40"></div>
                <div className="h-px w-12 bg-[#4F6758]/20"></div>
              </div>

              {/* Ligne institutionnelle */}
              <p className="text-xs uppercase tracking-widest text-[#2E2E2E]/40 font-light pt-6">
                Dermo-cosmétique naturelle • Haute tolérance • Formulation maîtrisée
              </p>
            </div>
            
            {/* Double CTA - Plus élégants */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link
                href="/produits"
                className="inline-block px-10 py-4 bg-[#4F6758] text-azalis-white font-normal rounded-lg hover:bg-azalis-green-hover transition-all duration-200 text-base min-w-[220px] text-center shadow-sm"
              >
                Découvrir la gamme
              </Link>
              <Link
                href="#formulation"
                className="inline-block px-10 py-4 border border-[#4F6758] text-[#4F6758] font-normal rounded-lg hover:bg-azalis-beige transition-all duration-200 text-base min-w-[220px] text-center"
              >
                Notre approche
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Transition Narrative */}
      <section className="py-16 md:py-22 bg-[#F8F3EB]">
        <Container size="lg">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#4F6758] leading-tight">
              L'exigence au service de l'équilibre.
            </h2>
            <p className="text-lg md:text-xl text-[#2E2E2E]/60 leading-relaxed font-light">
              Chez AZALIS, chaque formule est pensée pour respecter la physiologie naturelle de la peau avant de corriger ses déséquilibres.
            </p>
          </div>
        </Container>
      </section>

      {/* Section "Une formulation maîtrisée" */}
      <section id="formulation" className="py-20 md:py-24 bg-azalis-white">
        <Container size="lg">
          <div className="max-w-6xl mx-auto">
            {/* Titre section */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#4F6758] mb-6">
                Une formulation maîtrisée.
              </h2>
            </div>

            {/* 3 blocs horizontaux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
              {/* Bloc 1 : Actifs sélectionnés - Icône laboratoire */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EBE5DA] shadow-sm">
                  <svg
                    className="w-10 h-10 text-[#4F6758]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-[#4F6758]">
                    Actifs sélectionnés
                  </h3>
                  <p className="text-[#2E2E2E]/60 leading-relaxed text-sm font-light">
                    Ingrédients reconnus pour leur efficacité et tolérance.
                  </p>
                </div>
              </div>

              {/* Bloc 2 : Nature intelligente - Icône molécule */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EBE5DA] shadow-sm">
                  <svg
                    className="w-10 h-10 text-[#4F6758]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="6" cy="8" r="1.5" />
                    <circle cx="18" cy="8" r="1.5" />
                    <circle cx="6" cy="16" r="1.5" />
                    <circle cx="18" cy="16" r="1.5" />
                    <path d="M10.5 10.5L7.5 9.5" />
                    <path d="M13.5 10.5L16.5 9.5" />
                    <path d="M10.5 13.5L7.5 14.5" />
                    <path d="M13.5 13.5L16.5 14.5" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-[#4F6758]">
                    Nature intelligente
                  </h3>
                  <p className="text-[#2E2E2E]/60 leading-relaxed text-sm font-light">
                    Naturelle sans compromis sur la performance.
                  </p>
                </div>
              </div>

              {/* Bloc 3 : Exigence de formulation - Icône bouclier avec check */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EBE5DA] shadow-sm">
                  <svg
                    className="w-10 h-10 text-[#4F6758]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-[#4F6758]">
                    Exigence de formulation
                  </h3>
                  <p className="text-[#2E2E2E]/60 leading-relaxed text-sm font-light">
                    Développé en laboratoire agréé avec rigueur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Produits */}
      {featuredProducts.length > 0 && (
        <section className="py-26 md:py-32 bg-[#F8F3EB]">
          <Container size="lg">
            <div className="max-w-6xl mx-auto">
              {/* Titre section */}
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#4F6758] mb-6">
                  La gamme AZALIS
                </h2>
              </div>

              {/* Grille produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Lien vers tous les produits */}
              <div className="text-center mt-20">
                <Link
                  href="/produits"
                  className="inline-block text-[#4F6758] hover:text-azalis-green-hover font-normal transition-colors underline-offset-4 hover:underline text-base"
                >
                  Voir tous les soins →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Section "Pourquoi choisir AZALIS ?" */}
      <section className="py-26 md:py-32 bg-azalis-white border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-6xl mx-auto">
            {/* Titre section */}
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#4F6758] mb-6">
                Pourquoi choisir AZALIS ?
              </h2>
            </div>

            {/* 4 points minimalistes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
              {/* Point 1 */}
              <div className="text-center space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F8F3EB]">
                  <svg className="w-7 h-7 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="font-normal text-[#4F6758] text-base">Formulé avec rigueur</h3>
                <p className="text-sm text-[#2E2E2E]/50 leading-relaxed font-light">Laboratoire agréé</p>
              </div>

              {/* Point 2 */}
              <div className="text-center space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F8F3EB]">
                  <svg className="w-7 h-7 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="font-normal text-[#4F6758] text-base">Haute tolérance</h3>
                <p className="text-sm text-[#2E2E2E]/50 leading-relaxed font-light">Peaux sensibles</p>
              </div>

              {/* Point 3 */}
              <div className="text-center space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F8F3EB]">
                  <svg className="w-7 h-7 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </div>
                <h3 className="font-normal text-[#4F6758] text-base">98% naturel</h3>
                <p className="text-sm text-[#2E2E2E]/50 leading-relaxed font-light">Origine naturelle</p>
              </div>

              {/* Point 4 */}
              <div className="text-center space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F8F3EB]">
                  <svg className="w-7 h-7 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h3 className="font-normal text-[#4F6758] text-base">Livraison rapide</h3>
                <p className="text-sm text-[#2E2E2E]/50 leading-relaxed font-light">Partout au Maroc</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Message si aucun produit */}
      {featuredProducts.length === 0 && (
        <section className="py-26 md:py-32 bg-[#F8F3EB]">
          <Container size="md">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#4F6758]">
                Notre gamme arrive bientôt
              </h2>
              <p className="text-lg md:text-xl text-[#2E2E2E]/60 leading-relaxed max-w-2xl mx-auto font-light">
                Découvrez prochainement notre sélection de soins naturels formulés avec rigueur.
              </p>
              {error && (
                <p className="text-sm text-red-600">
                  Erreur lors du chargement des produits.
                </p>
              )}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
