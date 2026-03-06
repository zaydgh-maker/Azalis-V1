'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AdminNav from '@/components/admin/AdminNav';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Review {
  id: string;
  product_id: string;
  name: string;
  city: string | null;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  products?: { name: string } | null;
}

const statusConfig = {
  pending: { label: 'En attente', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  approved: { label: 'Approuvé', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  rejected: { label: 'Refusé', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AdminReviewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        window.location.href = '/admin/login';
        return;
      }
      setUser(authUser);

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (!adminUser) {
        window.location.href = '/admin/login?error=unauthorized';
        return;
      }
      setRole(adminUser.role);
      setIsAuthorized(true);
      await fetchReviews();
    };
    init();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabasePublic
      .from('reviews')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    if (data) setReviews(data as Review[]);
    setLoading(false);
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error('Error updating review:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-azalis-beige flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-azalis-green/20 border-t-azalis-green rounded-full animate-spin" />
    </div>
  );

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-azalis-beige">
      <AdminNav user={user} role={role} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-azalis-green">
            Avis clients
          </h1>
          <p className="text-azalis-black/60 mt-1">
            Gérez les avis soumis par vos clients
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-azalis-green/20 border-t-azalis-green rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-azalis-white rounded-sm border border-azalis-green/10 p-12 text-center">
            <p className="text-azalis-black/50">Aucun avis pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const cfg = statusConfig[review.status];
              return (
                <div
                  key={review.id}
                  className="bg-azalis-white rounded-sm border border-azalis-green/10 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-medium text-azalis-green text-base">
                          {review.name}
                        </span>
                        {review.city && (
                          <span className="text-xs text-azalis-black/40">
                            {review.city}
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-[#D4A843]' : 'text-gray-200'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-azalis-black/40">
                          {review.products?.name || '—'}
                        </span>
                        <span className="text-xs text-azalis-black/30">
                          {new Date(review.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-[#3A3A3A] font-light leading-relaxed">
                        {review.comment}
                      </p>
                    </div>

                    {review.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAction(review.id, 'approved')}
                          disabled={actionLoading === review.id}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleAction(review.id, 'rejected')}
                          disabled={actionLoading === review.id}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
