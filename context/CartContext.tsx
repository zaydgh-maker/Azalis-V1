'use client';

/**
 * Context de gestion du panier AZALIS
 * 
 * Gère l'état global du panier avec :
 * - Ajout/suppression de produits
 * - Modification des quantités
 * - Calcul du total
 * - Persistence dans localStorage
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// ============================================
// TYPES
// ============================================

/**
 * Item du panier
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  slug: string; // Pour le lien vers la page produit
}

/**
 * État du panier
 */
interface CartState {
  items: CartItem[];
  isOpen: boolean; // Pour le drawer
}

/**
 * Actions possibles sur le panier
 */
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'INCREASE_QUANTITY'; payload: string }
  | { type: 'DECREASE_QUANTITY'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

/**
 * Context value
 */
interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// ============================================
// CONTEXT
// ============================================

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ============================================
// REDUCER
// ============================================

/**
 * Reducer pour gérer l'état du panier
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          isOpen: true, // Ouvrir le drawer
        };
      }

      // Sinon, ajouter le nouveau produit
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        isOpen: true,
      };
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case 'INCREASE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case 'DECREASE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }

    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      };
    }

    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      };
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case 'LOAD_CART': {
      return {
        ...state,
        items: action.payload,
      };
    }

    default:
      return state;
  }
}

// ============================================
// PROVIDER
// ============================================

const CART_STORAGE_KEY = 'azalis-cart';

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provider du panier
 * 
 * Gère l'état global du panier et la persistence dans localStorage
 */
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const items = JSON.parse(savedCart) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Calculer le nombre total d'items
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  // Calculer le total du panier
  const total = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Actions
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const increaseQuantity = (id: string) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: id });
  };

  const decreaseQuantity = (id: string) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook pour utiliser le panier
 * 
 * @example
 * ```tsx
 * const { items, addToCart, total } = useCart();
 * ```
 */
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
