import { NextRequest, NextResponse } from 'next/server';
import { createServerAuthClient } from '@/lib/supabase-auth';
import { supabaseAdmin } from '@/lib/supabase';

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
    const { status } = await request.json();

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin orders PATCH error:', err);
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

    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin orders DELETE error:', err);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}
