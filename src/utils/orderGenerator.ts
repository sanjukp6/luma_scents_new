import type { Customer, CartItem, Order } from '../types';
import { calculateCartTotals } from './formatters';

const ORDER_COUNTER_KEY = 'luma_scents_order_counter';

/**
 * Generates an incremental unique transaction ID like 'LS-2026-000001'
 */
export const generateTransactionId = (): string => {
  let counter = 1;
  try {
    const saved = localStorage.getItem(ORDER_COUNTER_KEY);
    if (saved) {
      counter = parseInt(saved, 10) + 1;
    }
  } catch {
    counter = Math.floor(Math.random() * 900000) + 100000;
  }

  try {
    localStorage.setItem(ORDER_COUNTER_KEY, counter.toString());
  } catch {
    // Ignore storage errors
  }

  const padded = String(counter).padStart(6, '0');
  const year = new Date().getFullYear();
  return `LS-${year}-${padded}`;
};

/**
 * Creates a clean, typed Order object from customer data and cart items
 */
export const createOrderObject = (
  customer: Customer,
  items: CartItem[]
): Order => {
  const { subtotal, shipping, total } = calculateCartTotals(items);
  const transactionId = generateTransactionId();

  return {
    transactionId,
    customer,
    items: [...items],
    subtotal,
    shipping,
    total,
    currency: 'INR',
    status: 'success',
    createdAt: new Date().toISOString(),
  };
};
