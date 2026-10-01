import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, CartItem } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, quantity = 1, selectedSize?: string) => {
    setItems(prev => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id && item.selectedSize === selectedSize,
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, selectedSize?: string) => {
    setItems(prev =>
      prev.filter(
        (item) =>
          item.product.id !== productId || item.selectedSize !== selectedSize,
      ),
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
