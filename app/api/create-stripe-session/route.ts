/**
 * API Route : Création de session Stripe Checkout
 * 
 * POST /api/create-stripe-session
 * 
 * Sécurité :
 * - Validation stricte côté serveur
 * - Recalcul du total à partir des prix Supabase
 * - Vérification du stock
 * - Création de session Stripe sécurisée
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

// Type pour les données de session reçues
interface StripeSessionRequestData {
  customer_name: string;
  customer_email?: string;
  phone: string;
  city: string;
  address: string;
  items: Array<{
    id: string;
    quantity: number;
  }>;
}

// Type pour les erreurs de validation
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Valide les données de la session
 */
function validateSessionData(data: any): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Validation customer_name
  if (!data.customer_name || typeof data.customer_name !== 'string') {
    errors.push({ field: 'customer_name', message: 'Le nom est requis' });
  } else if (data.customer_name.trim().length < 3) {
    errors.push({ field: 'customer_name', message: 'Le nom doit contenir au moins 3 caractères' });
  }

  // Validation phone
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push({ field: 'phone', message: 'Le téléphone est requis' });
  } else {
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      errors.push({ field: 'phone', message: 'Numéro de téléphone invalide' });
    }
  }

  // Validation city
  if (!data.city || typeof data.city !== 'string') {
    errors.push({ field: 'city', message: 'La ville est requise' });
  } else if (data.city.trim().length < 3) {
    errors.push({ field: 'city', message: 'La ville doit contenir au moins 3 caractères' });
  }

  // Validation address
  if (!data.address || typeof data.address !== 'string') {
    errors.push({ field: 'address', message: 'L\'adresse est requise' });
  } else if (data.address.trim().length < 10) {
    errors.push({ field: 'address', message: 'L\'adresse doit être plus détaillée' });
  }

  // Validation items
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push({ field: 'items', message: 'Le panier est vide' });
  } else {
    data.items.forEach((item: any, index: number) => {
      if (!item.id || typeof item.id !== 'string') {
        errors.push({ field: `items[${index}].id`, message: 'ID produit invalide' });
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantité invalide' });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * POST /api/create-stripe-session
 * Crée une session Stripe Checkout
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier que Stripe est configuré
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe n\'est pas configuré. Veuillez utiliser le paiement à la livraison.' },
        { status: 503 }
      );
    }

    // 2. Parser les données
    const data: StripeSessionRequestData = await request.json();

    // 3. Valider les données
    const validation = validateSessionData(data);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // 4. Créer le client Supabase
    const supabase = createServerClient();

    // 5. Récupérer les produits depuis Supabase pour recalculer le total
    const productIds = data.items.map(item => item.id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock, image_url')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Aucun produit trouvé' },
        { status: 404 }
      );
    }

    // 6. Vérifier le stock et préparer les line items
    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          images?: string[];
        };
        unit_amount: number;
      };
      quantity: number;
    }> = [];

    for (const item of data.items) {
      const product = products.find(p => p.id === item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Produit ${item.id} introuvable` },
          { status: 404 }
        );
      }

      // Vérifier le stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        );
      }

      // Préparer le line item pour Stripe
      lineItems.push({
        price_data: {
          currency: 'mad', // Dirham marocain
          product_data: {
            name: product.name,
            images: product.image_url ? [product.image_url] : [],
          },
          unit_amount: Math.round(product.price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      });
    }

    // 7. Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/confirmation?orderId={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${request.nextUrl.origin}/checkout?canceled=true`,
      customer_email: data.customer_email || undefined,
      metadata: {
        customer_name: data.customer_name.trim(),
        phone: data.phone.replace(/\s/g, ''),
        city: data.city.trim(),
        address: data.address.trim(),
        payment_method: 'card',
      },
      // Permettre les codes promo (optionnel)
      allow_promotion_codes: false,
      // Expiration de la session (30 minutes)
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    // 8. Retourner l'URL de la session
    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error in create-stripe-session:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
