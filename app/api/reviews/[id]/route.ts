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
    const body = await request.json();
    const { status } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Utilisez "approved" ou "rejected".' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'avis.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err) {
    console.error('Reviews PATCH error:', err);
    return NextResponse.json({ error: 'Erreur inattendue.' }, { status: 500 });
  }
}
