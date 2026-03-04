'use client';

/**
 * Page Checkout AZALIS
 * 
 * Formulaire de commande avec :
 * - Informations client
 * - Récapitulatif du panier
 * - Validation des champs
 * - Paiement à la livraison
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/Container';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rediriger si panier vide
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push('/produits');
    }
  }, [items, router, isSubmitting]);

  // État du formulaire
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    payment_method: 'cash_on_delivery' as 'cash_on_delivery' | 'card',
  });

  // Validation du formulaire
  const validateForm = (): string | null => {
    if (!formData.customer_name.trim()) {
      return 'Le nom est requis';
    }
    if (formData.customer_name.trim().length < 3) {
      return 'Le nom doit contenir au moins 3 caractères';
    }
    if (!formData.phone.trim()) {
      return 'Le téléphone est requis';
    }
    // Validation téléphone (format marocain ou international)
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      return 'Numéro de téléphone invalide (ex: 0612345678 ou +212612345678)';
    }
    if (!formData.address.trim()) {
      return 'L\'adresse complète est requise';
    }
    if (formData.address.trim().length < 10) {
      return 'L\'adresse doit être plus détaillée (minimum 10 caractères)';
    }
    if (!formData.city.trim()) {
      return 'La ville est requise';
    }
    if (formData.city.trim().length < 3) {
      return 'La ville doit contenir au moins 3 caractères';
    }
    if (!formData.postal_code.trim()) {
      return 'Le code postal est requis';
    }
    return null;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Vérifier que le panier n'est pas vide
    if (items.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les données de la commande
      const orderData = {
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.replace(/\s/g, ''),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postal_code: formData.postal_code.trim(),
        payment_method: formData.payment_method,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      // Si paiement par carte, créer une session Stripe
      if (formData.payment_method === 'card') {
        const response = await fetch('/api/create-stripe-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de la création de la session Stripe');
        }

        // Rediriger vers Stripe Checkout
        if (result.url) {
          window.location.href = result.url;
        } else {
          throw new Error('URL de paiement non reçue');
        }
      } else {
        // Paiement à la livraison : créer la commande directement
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de la création de la commande');
        }

        // Succès : vider le panier et rediriger
        clearCart();
        router.push(`/confirmation?orderId=${result.orderId}`);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Si panier vide, ne rien afficher (redirection en cours)
  if (items.length === 0) {
    return null;
  }

  // Calcul frais de livraison
  const shippingCost = total >= 300 ? 0 : 30;
  const totalWithShipping = total + shippingCost;

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-azalis-white border-b border-azalis-green/10">
        <Container>
          <div className="py-4">
            <nav className="flex items-center gap-2 text-sm text-azalis-black/60">
              <Link href="/" className="hover:text-azalis-green transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link href="/produits" className="hover:text-azalis-green transition-colors">
                Produits
              </Link>
              <span>/</span>
              <span className="text-azalis-green font-medium">Commande</span>
            </nav>
          </div>
        </Container>
      </section>

      {/* Contenu principal */}
      <section className="py-12 md:py-20">
        <Container size="lg">
          <h1 className="text-2xl font-medium text-azalis-green mb-12 text-center">
            Finaliser votre commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div>
              <h2 className="text-2xl font-serif font-semibold text-azalis-green mb-6">
                Informations de livraison
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-azalis-black mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-azalis-white border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50"
                    placeholder="Ex: Ahmed Benali"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-azalis-black mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-azalis-white border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50"
                    placeholder="Ex: 0612345678"
                  />
                  <p className="text-xs text-azalis-black/60 mt-1">
                    Format: 0612345678 ou +212612345678
                  </p>
                </div>

                {/* Adresse complète */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-azalis-black mb-2">
                    Adresse complète <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={3}
                    className="w-full px-4 py-3 bg-azalis-white border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50 resize-none"
                    placeholder="Ex: Rue 123, Quartier Maarif, Immeuble 5, Appartement 12"
                  />
                  <p className="text-xs text-azalis-black/60 mt-1">
                    Soyez précis pour faciliter la livraison
                  </p>
                </div>

                {/* Ville */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-azalis-black mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-azalis-white border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50"
                    placeholder="Ex: Casablanca"
                  />
                </div>

                {/* Code postal */}
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-azalis-black mb-2">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-azalis-white border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50"
                    placeholder="Ex: 20000"
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Bouton de soumission - Mobile/Tablette uniquement */}
                <div className="lg:hidden">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Traitement en cours...
                      </span>
                    ) : (
                      'Confirmer la commande'
                    )}
                  </button>

                  {/* Badges réassurance */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-azalis-black/60 font-light pt-2">
                    <span className="flex items-center gap-1.5">
                      🔒 Paiement sécurisé
                    </span>
                    <span className="hidden sm:inline text-azalis-black/30">·</span>
                    <span className="flex items-center gap-1.5">
                      Livraison 24-48h
                    </span>
                    <span className="hidden sm:inline text-azalis-black/30">·</span>
                    <span className="flex items-center gap-1.5">
                      Satisfait ou remboursé
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Récapitulatif du panier */}
            <div>
              <h2 className="text-2xl font-serif font-semibold text-azalis-green mb-6">
                Récapitulatif
              </h2>

              <div className="bg-azalis-white border border-azalis-green/10 rounded-lg p-6 space-y-6">
                {/* Liste des produits */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-azalis-beige rounded overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-azalis-green/30"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-azalis-green truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-azalis-black/70 mt-1">
                          Quantité : {item.quantity}
                        </p>
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="font-semibold text-azalis-green">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Séparateur */}
                <div className="border-t border-azalis-green/10" />

                {/* Sous-total */}
                <div className="flex items-center justify-between">
                  <span className="text-azalis-black/70">Sous-total</span>
                  <span className="font-medium text-azalis-green">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Livraison */}
                <div className="flex items-center justify-between">
                  <span className="text-azalis-black/70">Livraison</span>
                  <span className="font-medium text-azalis-green">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div className="text-xs text-azalis-black/60 -mt-2">
                    Gratuite dès 300 DH d&apos;achat
                  </div>
                )}

                {/* Séparateur */}
                <div className="border-t border-azalis-green/10" />

                {/* Total */}
                <div className="flex items-center justify-between text-xl">
                  <span className="font-serif font-semibold text-azalis-green">
                    Total
                  </span>
                  <span className="text-2xl font-semibold text-azalis-green">
                    {formatPrice(totalWithShipping)}
                  </span>
                </div>

                {/* Mode de paiement dans le récapitulatif */}
                <div className="border-t border-azalis-green/10 pt-4">
                  <h3 className="text-sm font-medium text-azalis-black mb-3">
                    Mode de paiement
                  </h3>
                  <div className="space-y-3">
                    {/* COD */}
                    <div
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.payment_method === 'cash_on_delivery'
                          ? 'bg-azalis-beige border-azalis-green'
                          : 'bg-azalis-white border-azalis-green/10 hover:border-azalis-green/20'
                      }`}
                      onClick={() => !isSubmitting && setFormData(prev => ({ ...prev, payment_method: 'cash_on_delivery' }))}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="cod_summary"
                          name="payment_method_summary"
                          value="cash_on_delivery"
                          checked={formData.payment_method === 'cash_on_delivery'}
                          onChange={() => setFormData(prev => ({ ...prev, payment_method: 'cash_on_delivery' }))}
                          disabled={isSubmitting}
                          className="flex-shrink-0"
                        />
                        <label htmlFor="cod_summary" className="flex-1 cursor-pointer text-sm">
                          <span className="font-medium text-azalis-green">Paiement à la livraison (COD)</span>
                        </label>
                      </div>
                    </div>

                    {/* Carte */}
                    <div
                      className={`p-3 rounded-lg border-2 cursor-not-allowed opacity-60 ${
                        formData.payment_method === 'card'
                          ? 'bg-azalis-beige border-azalis-green'
                          : 'bg-azalis-white border-azalis-green/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="card_summary"
                          name="payment_method_summary"
                          value="card"
                          checked={formData.payment_method === 'card'}
                          disabled
                          className="flex-shrink-0"
                        />
                        <label htmlFor="card_summary" className="flex-1 text-sm">
                          <span className="font-medium text-azalis-black/60">Carte bancaire (bientôt disponible)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-azalis-beige p-4 rounded-lg">
                  <p className="text-sm text-azalis-black/70">
                    💡 Vous serez contacté pour confirmer votre commande avant la livraison.
                  </p>
                </div>

                {/* Bouton de confirmation - Desktop uniquement */}
                <div className="hidden lg:block">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Traitement en cours...
                      </span>
                    ) : (
                      'Confirmer la commande'
                    )}
                  </button>

                  {/* Badges réassurance */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-azalis-black/60 font-light pt-2">
                    <span className="flex items-center gap-1.5">
                      🔒 Paiement sécurisé
                    </span>
                    <span className="hidden sm:inline text-azalis-black/30">·</span>
                    <span className="flex items-center gap-1.5">
                      Livraison 24-48h
                    </span>
                    <span className="hidden sm:inline text-azalis-black/30">·</span>
                    <span className="flex items-center gap-1.5">
                      Satisfait ou remboursé
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
