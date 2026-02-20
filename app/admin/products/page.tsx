/**
 * Page Gestion des Produits Admin AZALIS
 * 
 * Liste des produits avec actions (modifier stock, supprimer)
 */

import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/admin/AdminNav';
import ProductsListClient from '@/components/admin/ProductsListClient';

export default async function AdminProductsPage() {
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

  // Récupérer tous les produits
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-azalis-beige">
      <AdminNav user={user} role={adminUser.role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-azalis-green">
            Gestion des Produits
          </h1>
          <p className="text-azalis-black/60 mt-1">
            {products?.length || 0} produit{products && products.length > 1 ? 's' : ''} au total
          </p>
        </div>

        {/* Liste des produits */}
        <ProductsListClient products={products || []} />
      </main>
    </div>
  );
}
