/**
 * API Admin : Création de produit
 * POST /api/admin/products
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerAuthClient } from '@/lib/supabase-auth';
import { createProduct } from '@/lib/supabase';
import type { CreateProductInput } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerAuthClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();

    const slug =
      body.slug?.trim() ||
      (body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'produit');

    const productData: CreateProductInput = {
      name: body.name?.trim() || '',
      slug,
      description: body.description?.trim() || null,
      price: Number(body.price) || 0,
      stock: Number(body.stock) ?? 0,
      image_url: body.image_url?.trim() || null,
      ingredients: body.ingredients?.trim() || null,
      benefits: body.benefits?.trim() || null,
    };
    if (body.usage_protocol?.trim()) productData.usage_protocol = body.usage_protocol.trim();
    if (Array.isArray(body.faq) && body.faq.length > 0) productData.faq = body.faq;

    if (!productData.name || productData.name.length < 3) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 3 caractères' },
        { status: 400 }
      );
    }

    if (productData.price < 0) {
      return NextResponse.json({ error: 'Le prix doit être positif' }, { status: 400 });
    }

    const { data, error } = await createProduct(productData);

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (err) {
    console.error('Admin products POST error:', err);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
