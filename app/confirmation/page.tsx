'use client';

/**
 * Page Confirmation de Commande AZALIS
 * 
 * Affichée après une commande réussie
 */

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/Container';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(10);

  // Rediriger si pas d'orderId
  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  // Compte à rebours pour redirection automatique
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  if (!orderId) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 min-h-[70vh] flex items-center">
      <Container size="md">
        <div className="bg-azalis-white border border-azalis-green/10 rounded-lg p-8 md:p-12 text-center">
          {/* Icône de succès */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Titre */}
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-azalis-green mb-4">
            Commande enregistrée !
          </h1>

          {/* Message */}
          <div className="space-y-4 text-azalis-black/80 mb-8">
            <p className="text-lg">
              Votre commande <span className="font-semibold text-azalis-green">#{orderId.slice(0, 8)}</span> a bien été enregistrée.
            </p>
            <p>
              Nous vous contacterons très prochainement pour confirmer votre commande et organiser la livraison.
            </p>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-azalis-beige p-6 rounded-lg mb-8 text-left">
            <h2 className="font-serif font-semibold text-azalis-green mb-3">
              Prochaines étapes
            </h2>
            <ul className="space-y-2 text-sm text-azalis-black/80">
              <li className="flex items-start gap-2">
                <span className="text-azalis-green mt-0.5">✓</span>
                <span>Vous recevrez un appel de confirmation dans les prochaines heures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-azalis-green mt-0.5">✓</span>
                <span>Nous préparerons votre commande avec soin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-azalis-green mt-0.5">✓</span>
                <span>Livraison à l&apos;adresse indiquée sous 2-3 jours ouvrés</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-azalis-green mt-0.5">✓</span>
                <span>Paiement à la livraison en espèces</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/produits"
              className="px-8 py-3 bg-azalis-white text-azalis-green font-medium rounded-sm border border-azalis-green hover:bg-azalis-beige transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>

          {/* Compte à rebours */}
          <p className="text-sm text-azalis-black/50 mt-8">
            Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
          </p>
        </div>
      </Container>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <section className="py-12 md:py-20 min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azalis-green mx-auto mb-4"></div>
            <p className="text-azalis-black/60">Chargement...</p>
          </div>
        </section>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
