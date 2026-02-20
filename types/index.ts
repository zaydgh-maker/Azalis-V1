/**
 * Types de base pour l'application AZALIS
 */

// Type pour les produits (à développer plus tard)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

// Type pour les utilisateurs (à développer plus tard)
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Type pour les commandes (à développer plus tard)
export interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}
