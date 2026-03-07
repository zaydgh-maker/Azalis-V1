'use client';

import { useState } from 'react';

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

interface ReviewsClientProps {
  reviews: Review[];
}

const statusConfig = {
  pending: { label: 'En attente', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  approved: { label: 'Approuvé', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  rejected: { label: 'Refusé', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function ReviewsClient({ reviews: initialReviews }: ReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-azalis-white rounded-sm border border-azalis-green/10 p-12 text-center">
        <p className="text-azalis-black/50">Aucun avis pour le moment.</p>
      </div>
    );
  }

  return (
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

              <div className="flex items-center gap-2 flex-shrink-0">
                {review.status === 'pending' && (
                  <>
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
                  </>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={actionLoading === review.id}
                  className="px-3 py-2 text-azalis-black/40 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
