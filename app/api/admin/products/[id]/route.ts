/**
 * API Admin : Mise à jour et suppression de produit
 * PATCH /api/admin/products/[id]
 * DELETE /api/admin/products/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerAuthClient } from '@/lib/supabase-auth';
import { updateProduct, deleteProduct } from '@/lib/supabase';
import type { UpdateProductInput } from '@/lib/supabase';

async function verifyAdmin() {
  const supabase = createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Non authentifié', status: 401 };
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!adminUser) return { error: 'Accès non autorisé', status: 403 };
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await verifyAdmin();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const { id } = await params;
    const body = await request.json();

    const updates: UpdateProductInput = {};

    if (body.name !== undefined) updates.name = body.name?.trim() || null;
    if (body.slug !== undefined) updates.slug = body.slug?.trim() || null;
    if (body.description !== undefined) updates.description = body.description?.trim() || null;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.stock !== undefined) updates.stock = Number(body.stock);
    if (body.image_url !== undefined) updates.image_url = body.image_url?.trim() || null;
    if (body.ingredients !== undefined) updates.ingredients = body.ingredients?.trim() || null;
    if (body.benefits !== undefined) updates.benefits = body.benefits?.trim() || null;
    if (body.usage_protocol !== undefined) updates.usage_protocol = body.usage_protocol?.trim() || null;
    if (Array.isArray(body.faq)) updates.faq = body.faq;

    const { data, error } = await updateProduct(id, updates);

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    console.error('Admin products PATCH error:', err);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await verifyAdmin();
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status });
    }

    const { id } = await params;
    const { error } = await deleteProduct(id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin products DELETE error:', err);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}
