import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase-auth';
import { supabaseAdmin } from '@/lib/supabase';
import AdminNav from '@/components/admin/AdminNav';
import ReviewsClient from '@/components/admin/ReviewsClient';

export default async function AdminReviewsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    redirect('/admin/login?error=unauthorized');
  }

  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-azalis-beige">
      <AdminNav user={user} role={adminUser.role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-azalis-green">
            Avis clients
          </h1>
          <p className="text-azalis-black/60 mt-1">
            Gérez les avis soumis par vos clients
          </p>
        </div>

        <ReviewsClient reviews={reviews || []} />
      </main>
    </div>
  );
}
