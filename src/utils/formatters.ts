import type { CartItem } from '../types';

export const FREE_SHIPPING_THRESHOLD = 1000;
export const STANDARD_SHIPPING_FEE = 99;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingQualified: boolean;
  amountNeededForFreeShipping: number;
}

export const calculateCartTotals = (items: CartItem[]): CartTotals => {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping when subtotal >= 1000, otherwise ₹99 (if cart is empty, shipping is 0)
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;
  const freeShippingQualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    subtotal,
    shipping,
    total,
    itemCount,
    freeShippingQualified,
    amountNeededForFreeShipping,
  };
};
