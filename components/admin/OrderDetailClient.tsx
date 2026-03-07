'use client';

/**
 * Détail Commande avec Changement de Statut
 * 
 * Client component pour gérer le changement de statut
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';
import { formatDate } from '@/lib/utils';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  phone: string;
  city: string;
  address: string;
  total: number;
  payment_method: 'card' | 'cash_on_delivery';
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

interface OrderDetailClientProps {
  order: Order;
}

export default function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      setOrder(prev => ({ ...prev, status: newStatus }));
      setSuccess('Statut mis à jour avec succès');
      router.refresh();
    } catch {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
      router.push('/admin/orders');
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'payment_failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'paid':
        return 'Payée';
      case 'confirmed':
        return 'Confirmée';
      case 'preparing':
        return 'En préparation';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      case 'payment_failed':
        return 'Paiement échoué';
      default:
        return status;
    }
  };

  const statuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payée' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-azalis-green hover:text-azalis-green/80 transition-colors mb-2 inline-block"
          >
            ← Retour aux commandes
          </Link>
          <h1 className="text-3xl font-serif font-semibold text-azalis-green">
            Commande #{order.id.slice(0, 8)}
          </h1>
          <p className="text-azalis-black/60 mt-1">
            Créée le {formatDate(order.created_at)}
          </p>
        </div>

        <span
          className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations client */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client */}
          <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              Informations Client
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-azalis-black/60">Nom</dt>
                <dd className="text-base text-azalis-black">{order.customer_name}</dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-sm font-medium text-azalis-black/60">Email</dt>
                  <dd className="text-base text-azalis-black">{order.customer_email}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-azalis-black/60">Téléphone</dt>
                <dd className="text-base text-azalis-black">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-azalis-black/60">Ville</dt>
                <dd className="text-base text-azalis-black">{order.city}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-azalis-black/60">Adresse</dt>
                <dd className="text-base text-azalis-black">{order.address}</dd>
              </div>
            </dl>
          </div>

          {/* Produits commandés */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6">
              <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
                Produits commandés
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-azalis-green/10">
                      <th className="text-left py-2 pr-4 font-medium text-azalis-black/60">Produit</th>
                      <th className="text-center py-2 px-4 font-medium text-azalis-black/60">Qté</th>
                      <th className="text-right py-2 px-4 font-medium text-azalis-black/60">Prix unitaire</th>
                      <th className="text-right py-2 pl-4 font-medium text-azalis-black/60">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item) => (
                      <tr key={item.id} className="border-b border-azalis-green/5 last:border-0">
                        <td className="py-3 pr-4 text-azalis-black">{item.product_name}</td>
                        <td className="py-3 px-4 text-center text-azalis-black">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-azalis-black">{formatPrice(item.price)}</td>
                        <td className="py-3 pl-4 text-right font-medium text-azalis-green">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-azalis-green/10">
                      <td colSpan={3} className="py-3 pr-4 text-right font-medium text-azalis-black/60">Total</td>
                      <td className="py-3 pl-4 text-right font-semibold text-azalis-green text-base">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Paiement */}
          <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              Informations Paiement
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-azalis-black/60">Mode de paiement</dt>
                <dd className="text-base text-azalis-black">
                  {order.payment_method === 'card' ? 'Carte bancaire' : 'Paiement à la livraison'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-azalis-black/60">Total</dt>
                <dd className="text-2xl font-semibold text-azalis-green">
                  {formatPrice(order.total)}
                </dd>
              </div>
              {order.stripe_session_id && (
                <div>
                  <dt className="text-sm font-medium text-azalis-black/60">Stripe Session ID</dt>
                  <dd className="text-sm font-mono text-azalis-black/70">
                    {order.stripe_session_id}
                  </dd>
                </div>
              )}
              {order.stripe_payment_intent_id && (
                <div>
                  <dt className="text-sm font-medium text-azalis-black/60">
                    Stripe Payment Intent ID
                  </dt>
                  <dd className="text-sm font-mono text-azalis-black/70">
                    {order.stripe_payment_intent_id}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          {/* Changer le statut */}
          <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              Changer le Statut
            </h2>
            <div className="space-y-2">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdating || order.status === status.value}
                  className={`w-full px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                    order.status === status.value
                      ? 'bg-azalis-green text-azalis-white cursor-default'
                      : 'bg-azalis-beige text-azalis-black hover:bg-azalis-green/10 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Métadonnées */}
          <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              Métadonnées
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-azalis-black/60">ID</dt>
                <dd className="font-mono text-azalis-black/70 break-all">{order.id}</dd>
              </div>
              <div>
                <dt className="text-azalis-black/60">Créée le</dt>
                <dd className="text-azalis-black/70">{formatDate(order.created_at)}</dd>
              </div>
              <div>
                <dt className="text-azalis-black/60">Modifiée le</dt>
                <dd className="text-azalis-black/70">{formatDate(order.updated_at)}</dd>
              </div>
            </dl>
          </div>

          {/* Supprimer */}
          <div className="bg-azalis-white rounded-lg border border-red-200 p-6">
            <h2 className="text-xl font-serif font-semibold text-red-600 mb-4">
              Zone dangereuse
            </h2>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer la commande
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-serif font-semibold text-red-600 mb-3">
              Supprimer la commande
            </h3>
            <p className="text-sm text-azalis-black/70 mb-6">
              Êtes-vous sûr de vouloir supprimer cette commande&nbsp;? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-azalis-black/70 bg-azalis-beige rounded-lg hover:bg-azalis-green/10 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
