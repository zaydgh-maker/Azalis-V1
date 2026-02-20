/**
 * Cartes de Statistiques Admin AZALIS
 * 
 * Affiche les statistiques clés du dashboard
 */

import { formatPrice } from '@/lib/products';

interface StatsCardsProps {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

export default function StatsCards({
  totalOrders,
  pendingOrders,
  paidOrders,
  totalRevenue,
  lowStockProducts,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Commandes',
      value: totalOrders,
      icon: '📦',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'En Attente',
      value: pendingOrders,
      icon: '⏳',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      label: 'Payées',
      value: paidOrders,
      icon: '✅',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Chiffre d\'Affaires',
      value: formatPrice(totalRevenue),
      icon: '💰',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Stock Faible',
      value: lowStockProducts,
      icon: '⚠️',
      color: 'bg-red-50 text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-azalis-white rounded-lg border border-azalis-green/10 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${stat.color}`}
            >
              {typeof stat.value === 'number' ? stat.value : stat.value}
            </span>
          </div>
          <p className="text-sm text-azalis-black/60">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
