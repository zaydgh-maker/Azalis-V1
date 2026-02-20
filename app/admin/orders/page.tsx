/**
 * Page Gestion des Commandes Admin AZALIS
 * 
 * Liste complète des commandes avec filtres et export CSV
 */

import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/admin/AdminNav';
import OrdersListClient from '@/components/admin/OrdersListClient';

export default async function AdminOrdersPage() {
  // Vérifier l'authentification
  const user = await getServerUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Vérifier si l'utilisateur est admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    redirect('/admin/login?error=unauthorized');
  }

  // Récupérer toutes les commandes
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-azalis-beige">
      <AdminNav user={user} role={adminUser.role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-azalis-green">
            Gestion des Commandes
          </h1>
          <p className="text-azalis-black/60 mt-1">
            {orders?.length || 0} commande{orders && orders.length > 1 ? 's' : ''} au total
          </p>
        </div>

        {/* Liste des commandes (client component pour filtres et export) */}
        <OrdersListClient orders={orders || []} />
      </main>
    </div>
  );
}
