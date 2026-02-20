import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import AddToCartButton from '@/components/AddToCartButton';
import { getProductBySlug, formatPrice, getStockStatus } from '@/lib/products';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

/**
 * Page produit premium dermo - Optimisée conversion
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
        <Container size="md">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-red-600 mb-4">
              Erreur
            </h1>
            <p className="text-azalis-black/70">{error}</p>
          </div>
        </Container>
      </section>
    );
  }

  const stockStatus = getStockStatus(product);

  return (
    <>
      {/* Fil d'Ariane */}
      <section className="py-6 bg-azalis-white border-b border-azalis-green/10">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-[#2E2E2E]/50 font-light">
            <Link href="/" className="hover:text-[#4F6758] transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-[#4F6758] transition-colors">
              Produits
            </Link>
            <span>/</span>
            <span className="text-[#4F6758] font-normal">{product.name}</span>
          </nav>
        </Container>
      </section>

      {/* 1. ABOVE THE FOLD - Layout 2 colonnes */}
      <section className="py-12 bg-azalis-white">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Image 55% */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-azalis-beige/30 to-azalis-beige/10 rounded-sm overflow-hidden shadow-sm group">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-[#4F6758]/20">
                      <svg
                        className="w-20 h-20 mx-auto mb-3"
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
                      <p className="text-sm font-light">Image à venir</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bloc infos 45% */}
            <div className="lg:col-span-5 space-y-5">
              {/* Nom + sous-titre */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-semibold text-[#2E2E2E] leading-tight tracking-tight">
                  {product.name}
                </h1>
                <p className="text-lg text-[#2E2E2E]/50 font-light">
                  {product.description || "Soin ciblé haute tolérance"}
                </p>
              </div>

              {/* Prix */}
              <div className="space-y-2 pb-4 border-b border-azalis-green/10">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold text-[#4F6758]">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className={`inline-block text-xs font-normal px-3 py-1.5 rounded-full ${
                      stockStatus.color === 'green'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : stockStatus.color === 'yellow'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {stockStatus.label}
                  </span>
                </div>
                <p className="text-sm text-[#2E2E2E]/40 font-light">30ml • 4 à 6 semaines d'utilisation</p>
              </div>

              {/* Bouton CTA */}
              <div>
                <AddToCartButton product={product} />
              </div>

              {/* Bloc réassurance horizontal compact */}
              <div className="pt-4 flex items-center gap-5 text-xs text-[#2E2E2E]/50 font-light">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span>Livraison rapide Maroc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#4F6758]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>98% origine naturelle</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SIGNATURE - "Une formulation maîtrisée" */}
      <section className="py-12 bg-[#F8F3EB] border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-medium text-[#2E2E2E] mb-3">
              Une formulation maîtrisée
            </h2>
            <p className="text-base text-[#3A3A3A] font-light max-w-2xl mx-auto leading-relaxed">
              Chaque ingrédient est sélectionné pour son efficacité prouvée et sa tolérance cutanée.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. INDICATIONS + RÉSULTATS - "Pour qui ?" */}
      {product.benefits && (
        <section className="py-12 bg-azalis-white border-t border-azalis-green/10">
          <Container size="lg">
            <div className="max-w-4xl mx-auto space-y-5">
              <h2 className="text-2xl font-medium text-[#2E2E2E]">
                Indications & Résultats
              </h2>
              <div className="prose prose-base max-w-none text-[#3A3A3A] font-light leading-relaxed">
                <p className="whitespace-pre-line">
                  {product.benefits}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 4. ACTIFS CLÉS + Rassurance */}
      {product.ingredients && (
        <section className="py-12 bg-[#F8F3EB] border-t border-azalis-green/10">
          <Container size="lg">
            <div className="max-w-4xl mx-auto space-y-5">
              <h2 className="text-2xl font-medium text-[#2E2E2E]">
                Actifs clés
              </h2>
              <div className="prose prose-base max-w-none text-[#3A3A3A] font-light leading-relaxed">
                <p className="whitespace-pre-line">
                  {product.ingredients}
                </p>
              </div>

              {/* Rassurance actifs - 3 bullets discrets */}
              <div className="pt-5 space-y-2 text-sm text-[#2E2E2E]/50 font-light border-t border-azalis-green/10">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#4F6758] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sans alcool desséchant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#4F6758] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Non comédogène</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#4F6758] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sans effet film gras</span>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 5. POURQUOI CE SÉRUM EST DIFFÉRENT - "Tolérance & formulation" */}
      <section className="py-12 bg-azalis-white border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-5">
            <h2 className="text-2xl font-medium text-[#2E2E2E]">
              Pourquoi ce soin est différent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#4F6758] mb-0.5">Sans alcool agressif</h3>
                  <p className="text-sm text-[#3A3A3A] font-light">Respecte la barrière cutanée</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#4F6758] mb-0.5">Sans parfum synthétique</h3>
                  <p className="text-sm text-[#3A3A3A] font-light">Réduit les risques d'irritation</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#4F6758] mb-0.5">Peaux sensibles</h3>
                  <p className="text-sm text-[#3A3A3A] font-light">Testé sous contrôle dermatologique</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#4F6758] mb-0.5">98% d'origine naturelle</h3>
                  <p className="text-sm text-[#3A3A3A] font-light">Formulation maîtrisée</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. CE QUE VOUS RESSENTIREZ - NOUVEAU */}
      <section className="py-12 bg-[#F8F3EB] border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-2xl font-medium text-[#2E2E2E]">
              Ce que vous ressentirez
            </h2>
            <ul className="space-y-3 text-[#3A3A3A] font-light">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Sensation d'équilibre durable</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Texture légère et confortable</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Absorption rapide</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#4F6758] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Peau visiblement plus harmonieuse</span>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* 7. PROTOCOLE - "Comment utiliser" */}
      <section className="py-12 bg-azalis-white border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-2xl font-medium text-[#2E2E2E]">
              Protocole d'utilisation
            </h2>
            <p className="text-base text-[#3A3A3A] font-light leading-relaxed">
              Appliquer matin et/ou soir sur une peau propre et sèche. Quelques gouttes suffisent. 
              Masser délicatement jusqu'à absorption complète.
            </p>
          </div>
        </Container>
      </section>

      {/* 8. FAQ */}
      <section className="py-12 bg-[#F8F3EB] border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-2xl font-medium text-[#2E2E2E]">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              <div className="bg-azalis-white p-5 rounded-sm border border-azalis-green/10">
                <h3 className="text-lg font-semibold text-[#4F6758] mb-2">Convient-il aux peaux sensibles ?</h3>
                <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                  Oui, formulé sans alcool agressif ni parfum synthétique, ce soin est adapté aux peaux sensibles.
                </p>
              </div>
              <div className="bg-azalis-white p-5 rounded-sm border border-azalis-green/10">
                <h3 className="text-lg font-semibold text-[#4F6758] mb-2">Quand voir les premiers résultats ?</h3>
                <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                  Les premiers effets peuvent être visibles dès 2 à 3 semaines d'utilisation régulière.
                </p>
              </div>
              <div className="bg-azalis-white p-5 rounded-sm border border-azalis-green/10">
                <h3 className="text-lg font-semibold text-[#4F6758] mb-2">Puis-je l'utiliser avec d'autres soins ?</h3>
                <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                  Oui, ce soin s'intègre facilement dans votre routine. Appliquer avant votre crème hydratante.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section Retour */}
      <section className="py-10 bg-azalis-white border-t border-azalis-green/10">
        <Container>
          <div className="text-center">
            <Link
              href="/produits"
              className="inline-block text-[#4F6758] hover:text-azalis-green-hover font-normal transition-colors underline-offset-4 hover:underline text-base"
            >
              ← Retour à la gamme
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
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
    description: product.description || `${product.name} - Formule dermo-cosmétique naturelle haute tolérance. Développé en laboratoire agréé.`,
  };
}
