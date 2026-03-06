/**
 * Page Détail Commande Admin AZALIS
 * 
 * Affiche les détails d'une commande et permet de changer son statut
 */

import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '@/lib/supabase-auth';
import { supabaseAdmin } from '@/lib/supabase';
import AdminNav from '@/components/admin/AdminNav';
import OrderDetailClient from '@/components/admin/OrderDetailClient';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  // Vérifier l'authentification
  const user = await getServerUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Vérifier si l'utilisateur est admin
  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    redirect('/admin/login?error=unauthorized');
  }

  // Récupérer la commande avec ses order_items
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_name,
        quantity,
        price
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-azalis-beige">
      <AdminNav user={user} role={adminUser.role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderDetailClient order={order} />
      </main>
    </div>
  );
}
