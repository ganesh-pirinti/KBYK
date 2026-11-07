import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductAddOn } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      selectedSize?: string;
      selectedTheme?: string;
      selectedColor?: string;
      personalisedName?: string;
      giftMessage?: string;
      selectedAddOns?: ProductAddOn[];
      uploadedImageName?: string;
      uploadedImageUrl?: string;
    }
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  packagingPreference: 'Standard Eco Kraft' | 'Luxury Keepsake Velvet Box (+₹180)';
  setPackagingPreference: (pref: 'Standard Eco Kraft' | 'Luxury Keepsake Velvet Box (+₹180)') => void;
  giftNote: string;
  setGiftNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kbyk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [packagingPreference, setPackagingPreference] = useState<'Standard Eco Kraft' | 'Luxury Keepsake Velvet Box (+₹180)'>(() => {
    try {
      const saved = localStorage.getItem('kbyk_packaging');
      return (saved as any) || 'Standard Eco Kraft';
    } catch {
      return 'Standard Eco Kraft';
    }
  });

  const [giftNote, setGiftNote] = useState<string>(() => {
    return localStorage.getItem('kbyk_gift_note') || '';
  });

  useEffect(() => {
    try {
      localStorage.setItem('kbyk_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [items]);

  useEffect(() => {
    localStorage.setItem('kbyk_packaging', packagingPreference);
  }, [packagingPreference]);

  useEffect(() => {
    localStorage.setItem('kbyk_gift_note', giftNote);
  }, [giftNote]);

  const addToCart = (
    product: Product,
    options: {
      quantity?: number;
      selectedSize?: string;
      selectedTheme?: string;
      selectedColor?: string;
      personalisedName?: string;
      giftMessage?: string;
      selectedAddOns?: ProductAddOn[];
      uploadedImageName?: string;
      uploadedImageUrl?: string;
    } = {}
  ) => {
    const qty = options.quantity || 1;
    const addOns = options.selectedAddOns || [];
    const addOnsTotal = addOns.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = product.price + addOnsTotal;

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      product,
      quantity: qty,
      selectedSize: options.selectedSize || product.sizes?.[0] || 'Standard',
      selectedTheme: options.selectedTheme || product.themes?.[0] || 'Default',
      selectedColor: options.selectedColor || product.availableColors?.[0]?.name,
      personalisedName: options.personalisedName,
      giftMessage: options.giftMessage,
      selectedAddOns: addOns,
      uploadedImageName: options.uploadedImageName,
      uploadedImageUrl: options.uploadedImageUrl,
      totalItemPrice: unitPrice * qty,
    };

    setItems((prev) => [newItem, ...prev]);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const addOnsTotal = item.selectedAddOns.reduce((acc, a) => acc + a.price, 0);
            const unitPrice = item.product.price + addOnsTotal;
            return {
              ...item,
              quantity: newQty,
              totalItemPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const packagingExtra = packagingPreference.includes('Luxury') ? 180 : 0;
  const subtotal = items.reduce((acc, item) => acc + item.totalItemPrice, 0) + (items.length > 0 ? packagingExtra : 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        packagingPreference,
        setPackagingPreference,
        giftNote,
        setGiftNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
