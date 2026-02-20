'use client';

/**
 * Tableau des Commandes Admin AZALIS
 * 
 * Affiche la liste des commandes avec actions
 */

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';
import { formatDate } from '@/lib/utils';

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
  created_at: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-8 text-center">
        <p className="text-azalis-black/60">Aucune commande pour le moment</p>
      </div>
    );
  }

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

  const getPaymentMethodLabel = (method: string) => {
    return method === 'card' ? 'Carte' : 'À la livraison';
  };

  return (
    <div className="bg-azalis-white rounded-lg border border-azalis-green/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-azalis-beige border-b border-azalis-green/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-azalis-black/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-azalis-green/10">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-azalis-beige/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-azalis-black/60">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-azalis-black">
                    {order.customer_name}
                  </div>
                  <div className="text-xs text-azalis-black/60">
                    {order.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-azalis-black">
                  {order.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-azalis-green">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-azalis-black/70">
                  {getPaymentMethodLabel(order.payment_method)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-azalis-black/60">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-azalis-green hover:text-azalis-green/80 transition-colors"
                  >
                    Voir détails →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
