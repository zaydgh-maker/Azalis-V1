/**
 * Configuration Stripe pour AZALIS V1
 * 
 * Ce fichier configure le client Stripe avec deux types :
 * 1. Client serveur (secret key) - Pour les opérations côté serveur uniquement
 * 2. Client public (publishable key) - Pour les opérations côté client
 */

import Stripe from 'stripe';

// ============================================
// VARIABLES D'ENVIRONNEMENT
// ============================================

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ============================================
// VALIDATION DES VARIABLES
// ============================================

if (!stripeSecretKey || stripeSecretKey.includes('placeholder')) {
  console.warn('⚠️ STRIPE_SECRET_KEY not configured. Stripe payments will not work.');
}

if (!stripePublishableKey || stripePublishableKey.includes('placeholder')) {
  console.warn('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not configured. Stripe payments will not work.');
}

// ============================================
// CLIENT STRIPE SERVEUR (CÔTÉ SERVEUR UNIQUEMENT)
// ============================================

/**
 * Client Stripe serveur avec secret key
 * 
 * ⚠️ ATTENTION : Ne JAMAIS utiliser côté client !
 * 
 * Utilisation :
 * - API Routes Next.js uniquement
 * - Création de sessions Checkout
 * - Gestion des webhooks
 * - Remboursements
 * 
 * Sécurité :
 * - Accès complet à l'API Stripe
 * - NE DOIT JAMAIS être exposé au client
 * 
 * Exemple d'utilisation :
 * ```ts
 * // app/api/create-stripe-session/route.ts
 * import { stripe } from '@/lib/stripe';
 * 
 * export async function POST(request: Request) {
 *   const session = await stripe.checkout.sessions.create({
 *     // ...
 *   });
 * }
 * ```
 */
export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
  appInfo: {
    name: 'AZALIS V1',
    version: '0.7.0',
  },
});

// ============================================
// CLÉS PUBLIQUES (CÔTÉ CLIENT)
// ============================================

/**
 * Clé publique Stripe (publishable key)
 * 
 * Utilisation :
 * - Côté client (browser)
 * - Initialisation de Stripe.js
 * - Redirection vers Checkout
 * 
 * Sécurité :
 * - Peut être exposée côté client
 * - Permissions limitées (lecture seule)
 */
export const STRIPE_PUBLISHABLE_KEY = stripePublishableKey || '';

/**
 * Secret webhook Stripe
 * 
 * Utilisation :
 * - Validation des webhooks Stripe
 * - Vérification de la signature
 * 
 * Sécurité :
 * - NE DOIT JAMAIS être exposé au client
 * - Utilisé uniquement dans l'API webhook
 */
export const STRIPE_WEBHOOK_SECRET = stripeWebhookSecret || '';

// ============================================
// HELPERS
// ============================================

/**
 * Vérifie si Stripe est configuré
 */
export function isStripeConfigured(): boolean {
  return !!(
    stripeSecretKey &&
    !stripeSecretKey.includes('placeholder') &&
    stripePublishableKey &&
    !stripePublishableKey.includes('placeholder')
  );
}

/**
 * Vérifie si le webhook Stripe est configuré
 */
export function isStripeWebhookConfigured(): boolean {
  return !!(
    stripeWebhookSecret &&
    !stripeWebhookSecret.includes('placeholder')
  );
}
