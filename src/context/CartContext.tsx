import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem, Customer, Order, ToastMessage } from '../types';
import { calculateCartTotals } from '../utils/formatters';
import { createOrderObject } from '../utils/orderGenerator';
import { trackAddToCart } from '../utils/dataLayer';

const CART_STORAGE_KEY = 'luma_scents_cart_v1';
const LAST_ORDER_STORAGE_KEY = 'luma_scents_last_order_v1';

export interface AddToCartResult {
  success: boolean;
  message: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  lastOrder: Order | null;
  toasts: ToastMessage[];
  addToCart: (product: Product, quantity?: number) => AddToCartResult;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (customer: Customer) => Promise<Order>;
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Initialize lastOrder from localStorage
  const [lastOrder, setLastOrder] = useState<Order | null>(() => {
    try {
      const stored = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [items]);

  // Sync lastOrder to localStorage whenever it changes
  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      }
    } catch (err) {
      console.error('Failed to persist last order:', err);
    }
  }, [lastOrder]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Core Ecommerce Logic: addToCart
   * 1. Check stock
   * 2. Add product or update quantity in cart
   * 3. Update cart state
   * 4. Update cart quantity
   * 5. Show a success message
   *
   * Ready for future:
   * dataLayer.push({ event: 'add_to_cart', ecommerce: { ... } })
   */
  const addToCart = (product: Product, quantity = 1): AddToCartResult => {
    if (!product || quantity <= 0) {
      showToast('Invalid quantity selected', 'error');
      return { success: false, message: 'Invalid quantity selected' };
    }

    const existingItem = items.find((item) => item.product.id === product.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const requestedTotalQty = currentQtyInCart + quantity;

    // 1. Stock check
    if (requestedTotalQty > product.stock) {
      const availableToAdd = Math.max(0, product.stock - currentQtyInCart);
      const msg =
        availableToAdd > 0
          ? `Only ${availableToAdd} more item(s) available in stock (Current in cart: ${currentQtyInCart}).`
          : `Item is at maximum available stock (${product.stock}).`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    // 2 & 3 & 4. Update cart state & quantity
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (itemIndex > -1) {
        const updated = [...prevItems];
        updated[itemIndex] = {
          ...updated[itemIndex],
          quantity: updated[itemIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevItems, { product, quantity }];
    });

    // 5. Show success message
    const successMsg = `Added ${quantity} × ${product.name} to cart`;
    showToast(successMsg, 'success');

    // Trigger GA4 Add to Cart dataLayer event
    trackAddToCart(product, quantity);

    return { success: true, message: successMsg };
  };

  /**
   * Update item quantity directly
   */
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = items.find((i) => i.product.id === productId);
    if (!item) return;

    if (newQuantity > item.product.stock) {
      showToast(`Cannot exceed available stock of ${item.product.stock}`, 'error');
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed ${item.product.name} from cart`, 'info');
    }
  };

  /**
   * Clear all items in cart
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Core Ecommerce Logic: placeOrder
   * 1. Validate required fields & items
   * 2. Create mock order object with unique transaction ID
   * 3. Simulate successful order processing
   * 4. Clear cart & set last order state
   *
   * Ready for future:
   * dataLayer.push({ event: 'purchase', ecommerce: { ... } })
   */
  const placeOrder = async (customer: Customer): Promise<Order> => {
    if (items.length === 0) {
      throw new Error('Your cart is empty');
    }

    // Create the fully typed Order object with calculations & transactionId
    const newOrder = createOrderObject(customer, items);

    // Persist to state and storage
    setLastOrder(newOrder);

    // Clear cart upon successful order creation
    clearCart();

    // NOTE: In the future, this is the exact hook point to invoke:
    // dataLayer.push({ event: "purchase", ecommerce: { ... } });

    return newOrder;
  };

  // Derive cart totals using calculation utility
  const { subtotal, shipping, total, itemCount } = calculateCartTotals(items);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        total,
        lastOrder,
        toasts,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
