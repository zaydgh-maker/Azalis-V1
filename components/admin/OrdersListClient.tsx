'use client';

/**
 * Liste des Commandes avec Filtres et Export CSV
 * 
 * Client component pour gérer les filtres et l'export
 */

import { useState, useMemo } from 'react';
import OrdersTable from './OrdersTable';

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

interface OrdersListClientProps {
  orders: Order[];
}

export default function OrdersListClient({ orders }: OrdersListClientProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les commandes
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtre par statut
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Filtre par mode de paiement
      if (paymentFilter !== 'all' && order.payment_method !== paymentFilter) {
        return false;
      }

      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.customer_name.toLowerCase().includes(query) ||
          order.phone.includes(query) ||
          order.city.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  // Exporter en CSV
  const handleExportCSV = () => {
    // Préparer les données CSV
    const headers = [
      'ID',
      'Client',
      'Email',
      'Téléphone',
      'Ville',
      'Adresse',
      'Total',
      'Paiement',
      'Statut',
      'Date',
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer_name,
      order.customer_email || '',
      order.phone,
      order.city,
      order.address,
      order.total,
      order.payment_method === 'card' ? 'Carte' : 'À la livraison',
      order.status,
      new Date(order.created_at).toLocaleString('fr-FR'),
    ]);

    // Créer le contenu CSV
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `azalis-commandes-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filtres et actions */}
      <div className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-azalis-black mb-2">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom, téléphone, ville, ID..."
              className="w-full px-4 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          {/* Filtre par statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-azalis-black mb-2">
              Statut
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50"
            >
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="confirmed">Confirmée</option>
              <option value="preparing">En préparation</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
              <option value="payment_failed">Paiement échoué</option>
            </select>
          </div>

          {/* Filtre par mode de paiement */}
          <div>
            <label htmlFor="payment" className="block text-sm font-medium text-azalis-black mb-2">
              Paiement
            </label>
            <select
              id="payment"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-4 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50"
            >
              <option value="all">Tous</option>
              <option value="card">Carte</option>
              <option value="cash_on_delivery">À la livraison</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-azalis-black/60">
            {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée
            {filteredOrders.length > 1 ? 's' : ''}
          </p>

          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="px-4 py-2 bg-azalis-green text-azalis-white rounded-sm hover:bg-azalis-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            📥 Exporter en CSV
          </button>
        </div>
      </div>

      {/* Tableau des commandes */}
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
