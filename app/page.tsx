import Link from 'next/link';
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import { getProductsInStock } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Récupérer les produits depuis Supabase
  const { data: products, error } = await getProductsInStock();

  // Afficher tous les produits en stock
  const featuredProducts = products || [];

  return (
    <>
      {/* Hero Section - Institutionnel et Élégant */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-8 bg-azalis-white">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Titre principal - Autorité douce */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-5xl font-serif font-medium text-azalis-green leading-[1.05] tracking-tight">
                Le naturel sous contrôle
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-[#2E2E2E]/60 font-light leading-relaxed max-w-3xl mx-auto">
                Des formules naturelles élaborées avec rigueur pour préserver l&apos;équilibre cutané
              </p>

              {/* Ligne fine décorative */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="h-px w-12 bg-azalis-green/20"></div>
                <div className="w-1 h-1 rounded-full bg-azalis-green/40"></div>
                <div className="h-px w-12 bg-azalis-green/20"></div>
              </div>

              {/* Ligne institutionnelle */}
              <p className="text-xs uppercase tracking-widest text-[#2E2E2E]/40 font-light pt-4">
                Dermo-cosmétique naturelle • Haute tolérance • Formulation maîtrisée
              </p>
            </div>
            
            {/* CTA + lignes discrètes */}
            <div className="flex flex-col items-center justify-center gap-4 pt-6">
              <Link
                href="/produits"
                className="inline-block px-10 py-4 bg-azalis-green text-azalis-white font-normal rounded-lg hover:bg-azalis-green-hover transition-all duration-200 text-base min-w-[220px] text-center shadow-sm"
              >
                Découvrir<span className="hidden sm:inline"> la gamme</span>
              </Link>
              <div className="text-center space-y-1 text-xs text-gray-500">
                <p>Livraison offerte dès 300 DH</p>
                <p>Édition de lancement · Production limitée</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bannière lifestyle */}
      <section className="relative w-full">
        <div
          className="h-[420px] w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/ibnu-ihza-g6q3lFAe3kA-unsplash.jpg')",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#3D5A47] flex items-center justify-between px-6 md:px-12">
          <div className="flex-1" />
          <p className="text-white font-serif text-base md:text-lg">La nature au service de votre peau</p>
          <div className="flex-1 flex justify-end">
            <Link
              href="/produits"
              className="border border-white text-white text-sm py-2 px-4 rounded hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Découvrir →
            </Link>
          </div>
        </div>
      </section>

      {/* Bande de réassurance */}
      <section className="py-12 bg-[#E8DFD0]">
        <Container size="lg">
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-4 text-center">
            <p className="text-xs uppercase tracking-wider text-azalis-green/80 font-light">
              Formulé en laboratoire agréé
            </p>
            <p className="text-xs uppercase tracking-wider text-azalis-green/80 font-light">
              98% d&apos;origine naturelle
            </p>
          </div>
        </Container>
      </section>

      {/* Section "Notre philosophie" */}
      <section id="formulation" className="py-16 bg-[#F8F3EB]">
        <Container size="lg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-azalis-green mb-6">
                Notre philosophie
              </h2>
            </div>

            {/* 3 blocs horizontaux avec numéros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
              {/* Bloc 1 : Actifs sélectionnés */}
              <div className="text-center space-y-4">
                <div className="inline-block">
                  <span className="font-serif text-7xl font-light text-azalis-green/30">01</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-azalis-green">
                    Actifs sélectionnés
                  </h3>
                  <p className="text-sm text-[#2E2E2E]/60 leading-relaxed font-light">
                    Ingrédients reconnus pour leur efficacité et tolérance
                  </p>
                </div>
              </div>

              {/* Bloc 2 : Nature intelligente */}
              <div className="text-center space-y-4">
                <div className="inline-block">
                  <span className="font-serif text-7xl font-light text-azalis-green/30">02</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-azalis-green">
                    Nature intelligente
                  </h3>
                  <p className="text-sm text-[#2E2E2E]/60 leading-relaxed font-light">
                    Naturelle sans compromis sur la performance
                  </p>
                </div>
              </div>

              {/* Bloc 3 : Exigence de formulation */}
              <div className="text-center space-y-4">
                <div className="inline-block">
                  <span className="font-serif text-7xl font-light text-azalis-green/30">03</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-medium text-azalis-green">
                    Exigence de formulation
                  </h3>
                  <p className="text-sm text-[#2E2E2E]/60 leading-relaxed font-light">
                    Développé en laboratoire agréé avec rigueur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Produits */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-[#F8F3EB]">
          <Container size="lg">
            <div className="max-w-6xl mx-auto">
              {/* Titre section */}
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-azalis-green mb-6">
                  La gamme AZALIS
                </h2>
              </div>

              {/* Grille produits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="discover" />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Section Avis Clients */}
      <section className="py-16 bg-azalis-white border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-6xl mx-auto">
            {/* Titre section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-azalis-green mb-6">
                Avis clients
              </h2>
            </div>

            {/* Grille 3 avis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Avis 1 - Salma - 3 étoiles */}
              <div className="bg-[#F5F0E8] p-8 rounded-sm border border-azalis-green/10">
                <div className="flex items-center gap-1 mb-4">
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-sm text-[#2E2E2E]/70 leading-relaxed font-light mb-4">
                  &quot;Une texture incroyable qui pénètre rapidement. Ma peau est visiblement plus équilibrée depuis que j&apos;utilise ces soins naturels. Je recommande vivement&quot;
                </p>
                <p className="text-sm font-serif text-azalis-green">— Salma</p>
              </div>

              {/* Avis 2 - Yasmine - 4 étoiles */}
              <div className="bg-[#F5F0E8] p-8 rounded-sm border border-azalis-green/10">
                <div className="flex items-center gap-1 mb-4">
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-sm text-[#2E2E2E]/70 leading-relaxed font-light mb-4">
                  &quot;Enfin des cosmétiques naturels qui respectent vraiment la peau sensible. La formulation est douce, efficace et sans compromis sur la qualité&quot;
                </p>
                <p className="text-sm font-serif text-azalis-green">— Yasmine</p>
              </div>

              {/* Avis 3 - Leila - 5 étoiles */}
              <div className="bg-[#F5F0E8] p-8 rounded-sm border border-azalis-green/10">
                <div className="flex items-center gap-1 mb-4">
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-azalis-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-sm text-[#2E2E2E]/70 leading-relaxed font-light mb-4">
                  &quot;J&apos;adore la philosophie d&apos;AZALIS : naturel et rigoureux. Les résultats sont là, ma peau respire et retrouve son éclat naturel jour après jour&quot;
                </p>
                <p className="text-sm font-serif text-azalis-green">— Leila</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Message si aucun produit */}
      {featuredProducts.length === 0 && (
        <section className="py-16 bg-[#F8F3EB]">
          <Container size="md">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-azalis-green">
                Notre gamme arrive bientôt
              </h2>
              <p className="text-lg md:text-xl text-[#2E2E2E]/60 leading-relaxed max-w-2xl mx-auto font-light">
                Découvrez prochainement notre sélection de soins naturels formulés avec rigueur
              </p>
              {error && (
                <p className="text-sm text-red-600">
                  Erreur lors du chargement des produits
                </p>
              )}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
