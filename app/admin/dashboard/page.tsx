/**
 * Page Dashboard Admin AZALIS
 * 
 * Vue d'ensemble des commandes et produits
 */

import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/admin/AdminNav';
import OrdersTable from '@/components/admin/OrdersTable';
import StatsCards from '@/components/admin/StatsCards';

export default async function AdminDashboardPage() {
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

  // Récupérer les statistiques
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: products } = await supabase
    .from('products')
    .select('id, stock');

  // Calculer les statistiques
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === 'pending').length || 0;
  const paidOrders = orders?.filter((o) => o.status === 'paid').length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const lowStockProducts = products?.filter((p) => p.stock < 10).length || 0;

  return (
    <div className="min-h-screen bg-azalis-beige">
      <AdminNav user={user} role={adminUser.role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-azalis-green">
            Dashboard
          </h1>
          <p className="text-azalis-black/60 mt-1">
            Vue d&apos;ensemble de votre boutique
          </p>
        </div>

        {/* Cartes de statistiques */}
        <StatsCards
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          paidOrders={paidOrders}
          totalRevenue={totalRevenue}
          lowStockProducts={lowStockProducts}
        />

        {/* Tableau des commandes récentes */}
        <div className="mt-8">
          <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
            Commandes récentes
          </h2>
          <OrdersTable orders={orders?.slice(0, 10) || []} />
        </div>
      </main>
    </div>
  );
}
