import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, UniformItem } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: UniformItem, size: string, price: number, quantity?: number) => void;
  removeItem: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string, size: string) => boolean;
  getItemQuantity: (itemId: string, size: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ss-uniforms-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('ss-uniforms-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: UniformItem, size: string, price: number, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        cartItem => cartItem.item.id === item.id && cartItem.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Cart Updated",
          description: `${item.name} (${size}) quantity updated to ${updatedItems[existingItemIndex].quantity}`,
        });
        
        return updatedItems;
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: `${item.id}-${size}`,
          item,
          size,
          price,
          quantity,
        };
        
        toast({
          title: "Added to Cart",
          description: `${item.name} (${size}) added to cart`,
        });
        
        return [...currentItems, newCartItem];
      }
    });
  };

  const removeItem = (itemId: string, size: string) => {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(
        cartItem => !(cartItem.item.id === itemId && cartItem.size === size)
      );
      
      toast({
        title: "Removed from Cart",
        description: "Item removed from cart",
      });
      
      return updatedItems;
    });
  };

  const updateQuantity = (itemId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId, size);
      return;
    }

    setItems(currentItems => {
      const updatedItems = currentItems.map(cartItem => {
        if (cartItem.item.id === itemId && cartItem.size === size) {
          return { ...cartItem, quantity };
        }
        return cartItem;
      });
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  };

  const isInCart = (itemId: string, size: string): boolean => {
    return items.some(cartItem => cartItem.item.id === itemId && cartItem.size === size);
  };

  const getItemQuantity = (itemId: string, size: string): number => {
    const cartItem = items.find(cartItem => cartItem.item.id === itemId && cartItem.size === size);
    return cartItem?.quantity || 0;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};