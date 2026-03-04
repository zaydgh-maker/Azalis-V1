/**
 * API Route : Création de commande
 * 
 * POST /api/create-order
 * 
 * Sécurité :
 * - Validation stricte côté serveur
 * - Recalcul du total à partir des prix Supabase
 * - Vérification du stock
 * - Gestion d'erreurs robuste
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Type pour les données de commande reçues
interface OrderRequestData {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  payment_method: 'cash_on_delivery';
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
 * Valide les données de la commande
 */
function validateOrderData(data: any): { valid: boolean; errors: ValidationError[] } {
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

  // Validation payment_method
  if (data.payment_method !== 'cash_on_delivery') {
    errors.push({ field: 'payment_method', message: 'Mode de paiement invalide' });
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
 * POST /api/create-order
 * Crée une nouvelle commande dans Supabase
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parser les données
    const data: OrderRequestData = await request.json();

    // 2. Valider les données
    const validation = validateOrderData(data);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // 3. Créer le client Supabase
    const supabase = createServerClient();

    // 4. Récupérer les produits depuis Supabase pour recalculer le total
    const productIds = data.items.map(item => item.id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock')
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

    // 5. Vérifier le stock et calculer le total
    let calculatedTotal = 0;
    const orderItems: Array<{ product_id: string; quantity: number; price: number }> = [];

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

      // Calculer le sous-total
      const subtotal = product.price * item.quantity;
      calculatedTotal += subtotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 6. Créer la commande dans Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: data.customer_name.trim(),
        phone: data.phone.replace(/\s/g, ''),
        city: data.city.trim(),
        address: data.address.trim(),
        total: calculatedTotal,
        payment_method: data.payment_method,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      );
    }

    // Alerte WhatsApp via CallMeBot
    const sendWhatsAppAlert = async (order: { id: string; name: string; phone: string; city: string; total: number }) => {
      const message = encodeURIComponent(
        `🛍️ Nouvelle commande Azalis!\nClient: ${order.name}\nTél: ${order.phone}\nVille: ${order.city}\nTotal: ${order.total} DH\nID: ${order.id.slice(0, 8)}`
      );
      const numbers = [
        { phone: 'NUMERO1', apikey: 'APIKEY1' },
        { phone: 'NUMERO2', apikey: 'APIKEY2' },
      ];
      await Promise.all(
        numbers.map(n =>
          fetch(`https://api.callmebot.com/whatsapp.php?phone=${n.phone}&text=${message}&apikey=${n.apikey}`)
        )
      );
    };
    try {
      await sendWhatsAppAlert({
        id: order.id,
        name: order.customer_name,
        phone: order.phone,
        city: order.city,
        total: order.total,
      });
    } catch (err) {
      console.error('WhatsApp alert failed:', err);
    }

    const sendNtfyAlert = async (order: { name: string; phone: string; city: string; total: number }) => {
      const res = await fetch('https://ntfy.sh/azalis-commandes', {
        method: 'POST',
        headers: {
          'Title': 'Nouvelle commande Azalis',
          'Priority': 'high',
          'Tags': 'shopping',
          'Content-Type': 'text/plain',
        },
        body: `Client: ${order.name}\nTél: ${order.phone}\nVille: ${order.city}\nTotal: ${order.total} DH`,
      });
      console.log('Ntfy status:', res.status, await res.text());
    };

    try {
      console.log('Ntfy payload sent');
      await sendNtfyAlert({
        name: order.customer_name,
        phone: order.phone,
        city: order.city,
        total: order.total,
      });
    } catch (e) {
      console.error('Ntfy error:', JSON.stringify(e));
    }

    // 7. Créer les order_items (si la table existe)
    // Note: Cette étape est optionnelle pour la V1
    // Si vous avez une table order_items, décommentez ce code :
    /*
    const orderItemsData = orderItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Note: La commande est déjà créée, on continue quand même
    }
    */

    // 8. Mettre à jour le stock des produits
    for (const item of orderItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', item.product_id);

        if (stockError) {
          console.error('Error updating stock:', stockError);
          // Note: La commande est créée, on log l'erreur mais on continue
        }
      }
    }

    // 9. Retourner le succès
    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        total: calculatedTotal,
        message: 'Commande créée avec succès',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in create-order:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
