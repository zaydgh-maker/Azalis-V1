'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/supabase';
import { formatPrice, getStockStatus } from '@/lib/products';

interface ProductPageClientProps {
  product: Product;
  otherProducts: Product[];
}

export default function ProductPageClient({ product, otherProducts }: ProductPageClientProps) {
  const [openAccordion, setOpenAccordion] = useState<string>('different');
  const [openFaqAccordion, setOpenFaqAccordion] = useState<string>('');
  const [showStickyButton, setShowStickyButton] = useState(false);
  const originalButtonRef = useRef<HTMLDivElement>(null);
  const stockStatus = getStockStatus(product);

  // Gestion du sticky button
  useEffect(() => {
    const handleScroll = () => {
      if (originalButtonRef.current) {
        const rect = originalButtonRef.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        setShowStickyButton(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  const toggleFaqAccordion = (id: string) => {
    setOpenFaqAccordion(openFaqAccordion === id ? '' : id);
  };

  return (
    <>
      {/* Fil d'Ariane */}
      <section className="py-6 bg-azalis-white border-b border-azalis-green/10">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-[#2E2E2E]/50 font-light">
            <Link href="/" className="hover:text-azalis-green transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-azalis-green transition-colors">
              Produits
            </Link>
            <span>/</span>
            <span className="text-azalis-green font-normal">{product.name}</span>
          </nav>
        </Container>
      </section>

      {/* 1. ABOVE THE FOLD - Layout 2 colonnes */}
      <section className="py-12 bg-azalis-white">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Image 55% */}
            <div className="lg:col-span-7">
              <div className="relative h-[480px] bg-[#F5F0E8] rounded-sm overflow-hidden shadow-sm flex items-center justify-center">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-8 hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                ) : (
                  <div className="text-center text-azalis-green/20">
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
                  <div className="flex flex-col">
                    <span className="text-3xl font-semibold text-azalis-green">
                      {formatPrice(product.price)}
                    </span>
                    <span className="inline-block mt-1 text-[11px] font-medium bg-[#B8965A]/10 text-[#B8965A] border border-[#B8965A]/30 rounded-full px-3 py-0.5">
                      Prix de lancement
                    </span>
                  </div>
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
                <p className="text-sm text-[#2E2E2E]/40 font-light">30ml • 4 à 6 semaines d&apos;utilisation</p>
              </div>

              {/* Bouton CTA original */}
              <div ref={originalButtonRef}>
                <AddToCartButton product={product} />
              </div>

              {/* Bloc réassurance */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-[#2E2E2E]/50 font-light">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span>Livraison 24-48h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-azalis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>98% naturel</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SIGNATURE */}
      <section className="py-12 bg-[#F8F3EB] border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-medium text-[#2E2E2E] mb-3">
              Une formulation maîtrisée
            </h2>
            <p className="text-base text-[#3A3A3A] font-light max-w-2xl mx-auto leading-relaxed">
              Chaque ingrédient est sélectionné pour son efficacité prouvée et sa tolérance cutanée
            </p>
          </div>
        </Container>
      </section>

      {/* 3. ACCORDÉONS */}
      <section className="py-12 bg-[#F8F3EB] border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Accordion 1: Résultats attendus */}
            {product.benefits && (
              <div className="bg-azalis-white rounded-sm border border-azalis-green/10 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('results')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F5F0E8] transition-colors"
                >
                  <h3 className="text-lg font-medium text-azalis-green">Résultats attendus</h3>
                  <svg
                    className={`w-5 h-5 text-azalis-green transition-transform ${openAccordion === 'results' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordion === 'results' && (
                  <div className="px-6 pb-6">
                    <div className="prose prose-base max-w-none text-[#3A3A3A] font-light leading-relaxed mb-6">
                      <p className="whitespace-pre-line">
                        {product.benefits}
                      </p>
                    </div>

                    {/* Ce que vous ressentirez intégré */}
                    <ul className="space-y-3 text-[#3A3A3A] font-light">
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Sensation d&apos;équilibre durable</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Texture légère et confortable</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Absorption rapide</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Peau visiblement plus harmonieuse</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Accordion 2: Pourquoi ce soin est différent (ouvert par défaut) */}
            <div className="bg-azalis-white rounded-sm border border-azalis-green/10 overflow-hidden">
              <button
                onClick={() => toggleAccordion('different')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F5F0E8] transition-colors"
              >
                <h3 className="text-lg font-medium text-azalis-green">Pourquoi ce soin est différent</h3>
                <svg
                  className={`w-5 h-5 text-azalis-green transition-transform ${openAccordion === 'different' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === 'different' && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h4 className="text-base font-medium text-azalis-green mb-1">Sans alcool agressif</h4>
                        <p className="text-sm text-[#3A3A3A] font-light">Respecte la barrière cutanée</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h4 className="text-base font-medium text-azalis-green mb-1">Sans parfum synthétique</h4>
                        <p className="text-sm text-[#3A3A3A] font-light">Réduit les risques d&apos;irritation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h4 className="text-base font-medium text-azalis-green mb-1">Peaux sensibles</h4>
                        <p className="text-sm text-[#3A3A3A] font-light">Testé dermatologiquement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-azalis-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h4 className="text-base font-medium text-azalis-green mb-1">98% d&apos;origine naturelle</h4>
                        <p className="text-sm text-[#3A3A3A] font-light">Formulation maîtrisée</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Actifs clés (noms communs + rôle) */}
            <div className="bg-azalis-white rounded-sm border border-azalis-green/10 overflow-hidden">
              <button
                onClick={() => toggleAccordion('actives')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F5F0E8] transition-colors"
              >
                <h3 className="text-lg font-medium text-azalis-green">Actifs clés</h3>
                <svg
                  className={`w-5 h-5 text-azalis-green transition-transform ${openAccordion === 'actives' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === 'actives' && (
                <div className="px-6 pb-6">
                  <div className="space-y-3 text-sm text-[#3A3A3A] font-light">
                    <div className="flex gap-2">
                      <span className="font-medium text-azalis-green min-w-fit">Huile de Figue de Barbarie</span>
                      <span className="text-[#2E2E2E]/60">— Hydratation profonde</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium text-azalis-green min-w-fit">Aloe Vera</span>
                      <span className="text-[#2E2E2E]/60">— Apaisement</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium text-azalis-green min-w-fit">Jojoba</span>
                      <span className="text-[#2E2E2E]/60">— Équilibre sébacé</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium text-azalis-green min-w-fit">Glycérine</span>
                      <span className="text-[#2E2E2E]/60">— Hydratation continue</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium text-azalis-green min-w-fit">Vitamine E</span>
                      <span className="text-[#2E2E2E]/60">— Antioxydant</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Ingrédients complets (INCI) */}
            {product.ingredients && (
              <div className="bg-azalis-white rounded-sm border border-azalis-green/10 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F5F0E8] transition-colors"
                >
                  <h3 className="text-lg font-medium text-azalis-green">Ingrédients complets</h3>
                  <svg
                    className={`w-5 h-5 text-azalis-green transition-transform ${openAccordion === 'ingredients' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordion === 'ingredients' && (
                  <div className="px-6 pb-6">
                    <p className="text-xs font-medium text-azalis-green mb-3">Formule transparente :</p>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      {product.ingredients}
                    </p>

                    {/* Rassurance */}
                    <div className="pt-5 space-y-2 text-sm text-[#2E2E2E]/50 font-light border-t border-azalis-green/10 mt-5">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-azalis-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Sans alcool desséchant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-azalis-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Non comédogène</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-azalis-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Sans effet film gras</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Accordion 5: Protocole d'utilisation */}
            <div className="bg-azalis-white rounded-sm border border-azalis-green/10 overflow-hidden">
              <button
                onClick={() => toggleAccordion('protocol')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F5F0E8] transition-colors"
              >
                <h3 className="text-lg font-medium text-azalis-green">Protocole d&apos;utilisation</h3>
                <svg
                  className={`w-5 h-5 text-azalis-green transition-transform ${openAccordion === 'protocol' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === 'protocol' && (
                <div className="px-6 pb-6">
                  <p className="text-base text-[#3A3A3A] font-light leading-relaxed">
                    Appliquer matin et/ou soir sur une peau propre et sèche. Quelques gouttes suffisent. 
                    Masser délicatement jusqu&apos;à absorption complète
                  </p>
                </div>
              )}
            </div>

          </div>
        </Container>
      </section>

      {/* 5. FAQ */}
      <section className="py-12 bg-azalis-white border-t border-azalis-green/10">
        <Container size="lg">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-2xl font-medium text-[#2E2E2E]">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="bg-[#F5F0E8] rounded-sm border border-azalis-green/10 overflow-hidden">
                <button
                  onClick={() => toggleFaqAccordion('faq1')}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#EBE5DA] transition-colors"
                >
                  <h3 className="text-base font-medium text-azalis-green">Convient-il aux peaux sensibles ?</h3>
                  <svg
                    className={`w-5 h-5 text-azalis-green transition-transform flex-shrink-0 ml-4 ${openFaqAccordion === 'faq1' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqAccordion === 'faq1' && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                      Oui, formulé sans alcool agressif ni parfum synthétique, ce soin est adapté aux peaux sensibles
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="bg-[#F5F0E8] rounded-sm border border-azalis-green/10 overflow-hidden">
                <button
                  onClick={() => toggleFaqAccordion('faq2')}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#EBE5DA] transition-colors"
                >
                  <h3 className="text-base font-medium text-azalis-green">Quand voir les premiers résultats ?</h3>
                  <svg
                    className={`w-5 h-5 text-azalis-green transition-transform flex-shrink-0 ml-4 ${openFaqAccordion === 'faq2' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqAccordion === 'faq2' && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                      Les premiers effets peuvent être visibles dès 2 à 3 semaines d&apos;utilisation régulière
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="bg-[#F5F0E8] rounded-sm border border-azalis-green/10 overflow-hidden">
                <button
                  onClick={() => toggleFaqAccordion('faq3')}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#EBE5DA] transition-colors"
                >
                  <h3 className="text-base font-medium text-azalis-green">Puis-je l&apos;utiliser avec d&apos;autres soins ?</h3>
                  <svg
                    className={`w-5 h-5 text-azalis-green transition-transform flex-shrink-0 ml-4 ${openFaqAccordion === 'faq3' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqAccordion === 'faq3' && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                      Oui, ce soin s&apos;intègre facilement dans votre routine. Appliquer avant votre crème hydratante
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. VOUS AIMEREZ AUSSI */}
      {otherProducts.length > 0 && (
        <section className="py-16 bg-[#F8F3EB] border-t border-azalis-green/10">
          <Container size="lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-medium text-azalis-green mb-12 text-center">
                Vous aimerez aussi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {otherProducts.slice(0, 2).map((otherProduct) => (
                  <Link
                    key={otherProduct.id}
                    href={`/produit/${otherProduct.slug}`}
                    className="group block bg-azalis-beige rounded-sm overflow-hidden border border-azalis-green/10 hover:border-azalis-green/20 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-[280px] bg-[#F5F0E8] overflow-hidden">
                      {otherProduct.image_url ? (
                        <Image
                          src={otherProduct.image_url}
                          alt={otherProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
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
                        </div>
                      )}
                    </div>

                    {/* Infos sous l'image */}
                    <div className="p-6 space-y-3">
                      <h3 className="font-serif text-xl font-medium text-azalis-green group-hover:text-azalis-green-hover transition-colors leading-tight">
                        {otherProduct.name}
                      </h3>
                      <div className="flex flex-col">
                        <p className="text-base font-medium text-azalis-green">
                          {formatPrice(otherProduct.price)}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-medium bg-[#B8965A]/10 text-[#B8965A] border border-[#B8965A]/30 rounded-full px-3 py-0.5">
                          Prix de lancement
                        </span>
                      </div>
                      <button className="w-full px-5 py-3 bg-azalis-green text-azalis-white text-sm font-normal rounded-lg hover:bg-azalis-green-hover transition-colors shadow-sm">
                        Découvrir
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* STICKY CTA BUTTON */}
      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-azalis-white border-t border-azalis-green/20 shadow-lg py-4 animate-slide-up">
          <Container>
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="hidden sm:block relative w-16 h-16 bg-[#F5F0E8] rounded-sm overflow-hidden flex-shrink-0">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                      sizes="64px"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-azalis-green text-sm sm:text-base">{product.name}</p>
                  <div className="flex flex-col">
                    <p className="text-azalis-green text-lg sm:text-xl font-semibold">{formatPrice(product.price)}</p>
                    <span className="inline-block mt-1 text-[11px] font-medium bg-[#B8965A]/10 text-[#B8965A] border border-[#B8965A]/30 rounded-full px-3 py-0.5">
                      Prix de lancement
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  // Utiliser l'event du AddToCartButton
                  const addButton = document.querySelector('[data-add-to-cart]') as HTMLButtonElement;
                  if (addButton) addButton.click();
                }}
                className="px-6 sm:px-8 py-3 bg-azalis-green text-azalis-white font-normal rounded-lg hover:bg-azalis-green-hover transition-colors text-sm sm:text-base whitespace-nowrap shadow-md"
              >
                Ajouter au panier
              </button>
            </div>
          </Container>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
