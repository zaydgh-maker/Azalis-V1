/**
 * API Route : Webhook Stripe
 * 
 * POST /api/stripe-webhook
 * 
 * Sécurité :
 * - Vérification de la signature webhook
 * - Traitement des événements Stripe
 * - Mise à jour de la commande après paiement
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET, isStripeWebhookConfigured } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';
import Stripe from 'stripe';

/**
 * POST /api/stripe-webhook
 * Reçoit et traite les webhooks Stripe
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier que le webhook est configuré
    if (!isStripeWebhookConfigured()) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // 2. Récupérer le body brut (raw body)
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // 3. Vérifier la signature du webhook
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // 4. Traiter l'événement selon son type
    console.log(`Received Stripe event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // 5. Retourner un succès à Stripe
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in stripe-webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Gère l'événement checkout.session.completed
 * Déclenché quand une session Checkout est complétée
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Handling checkout.session.completed:', session.id);

  try {
    const supabase = createServerClient();

    // Récupérer les métadonnées de la session
    const metadata = session.metadata;

    if (!metadata) {
      console.error('No metadata found in session');
      return;
    }

    // Calculer le total (Stripe utilise les centimes)
    const total = session.amount_total ? session.amount_total / 100 : 0;

    // Créer la commande dans Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: metadata.customer_name,
        customer_email: session.customer_email || null,
        phone: metadata.phone,
        city: metadata.city,
        address: metadata.address,
        total: total,
        payment_method: 'card',
        status: 'paid', // Statut "paid" car le paiement est confirmé
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return;
    }

    console.log('Order created successfully:', order.id);

    // Mettre à jour le stock des produits
    // Note: Les line items ne sont pas directement disponibles dans la session
    // Il faut les récupérer via l'API Stripe
    if (session.id) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      for (const item of lineItems.data) {
        // Récupérer le produit par son nom (ou utiliser un ID dans les métadonnées)
        const productName = item.description;
        const quantity = item.quantity || 0;

        if (productName && quantity > 0) {
          const { data: product } = await supabase
            .from('products')
            .select('id, stock')
            .eq('name', productName)
            .single();

          if (product) {
            // Mettre à jour le stock
            const { error: stockError } = await supabase
              .from('products')
              .update({ stock: Math.max(0, product.stock - quantity) })
              .eq('id', product.id);

            if (stockError) {
              console.error('Error updating stock:', stockError);
            } else {
              console.log(`Stock updated for product ${product.id}: ${product.stock} -> ${product.stock - quantity}`);
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
  }
}

/**
 * Gère l'événement payment_intent.succeeded
 * Déclenché quand un paiement est réussi
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Handling payment_intent.succeeded:', paymentIntent.id);

  try {
    const supabase = createServerClient();

    // Mettre à jour le statut de la commande si elle existe déjà
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      console.log('Order status updated to paid');
    }

  } catch (error) {
    console.error('Error in handlePaymentIntentSucceeded:', error);
  }
}

/**
 * Gère l'événement payment_intent.payment_failed
 * Déclenché quand un paiement échoue
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Handling payment_intent.payment_failed:', paymentIntent.id);

  try {
    const supabase = createServerClient();

    // Mettre à jour le statut de la commande
    const { error } = await supabase
      .from('orders')
      .update({ status: 'payment_failed' })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      console.log('Order status updated to payment_failed');
    }

  } catch (error) {
    console.error('Error in handlePaymentIntentFailed:', error);
  }
}
