import React, { useEffect, useRef } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import type { Order } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { lastOrder } = useCart();

  // Retrieve order from router state or fallback to persisted lastOrder
  const order: Order | null = location.state?.order || lastOrder;
  const hasTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!order || hasTrackedRef.current === order.transactionId) return;
    hasTrackedRef.current = order.transactionId;

    const triggerPurchase = () => {
      const win = window as any;
      if (typeof win === 'undefined') return;

      const execute = () => {
        if (typeof win.eedl !== 'function') return;

        // 1. Name splitting (fName and lName)
        const userName = (order.customer && order.customer.name) || '';
        let fName = '';
        let lName: string | undefined = undefined;

        if (userName.indexOf(' ') > -1) {
          const parts = userName.trim().split(/\s+/);
          fName = parts[0];
          lName = parts.slice(1).join(' ');
        } else {
          fName = userName;
          lName = undefined;
        }

        // 2. Phone cleanup (remove +91 and non-digits)
        const rawPhone = (order.customer && order.customer.phone) || '';
        const phone = rawPhone.replace(/^\+?91[\s-]*/, '').replace(/\D/g, '');

        // 3. Dispatch user_info
        win.eedl('user_info', {
          pid: (order.customer && order.customer.email) || order.transactionId,
          email: (order.customer && order.customer.email) || '',
          phone: phone,
          country: 'IN',
          city: (order.customer && order.customer.city) || '',
          state: (order.customer && order.customer.state) || '',
          fName: fName,
          lName: lName,
          zip: (order.customer && order.customer.pincode) || '',
        });

        // 4. Cart ID fallback
        const cartId =
          (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('mp_cart_id')) ||
          ('cart_' + order.transactionId);

        // 5. Items mapping
        const itemsList = (order.items || []).map((item, idx) => {
          const prod = item.product;
          return {
            item_id: String(prod.id),
            item_name: prod.name,
            item_sku: String((prod as any).sku || prod.id),
            index: idx,
            price: Number(prod.price),
            quantity: Number(item.quantity || 1),
            item_brand: prod.brand || 'Luma Scents',
            item_category: prod.category || undefined,
          };
        });

        // 6. Dispatch purchase payload
        const purchasePayload = {
          currency: order.currency || 'INR',
          transaction_id: order.transactionId,
          cart_id: cartId,
          value: Number(order.total),
          coupon: undefined,
          shipping: Number(order.shipping || 0),
          payment_type: 'Credit Card',
          tax: 0,
          items: itemsList,
          ev_source: 'ingestlabs',
        };

        win.eedl('purchase', purchasePayload);
      };

      if (win._mp && typeof win._mp.safeExecute === 'function') {
        win._mp.safeExecute('evPurchase', execute)();
      } else {
        execute();
      }
    };

    const win = window as any;
    if (typeof win !== 'undefined' && win._mp && typeof win._mp.waitUntil === 'function') {
      win._mp.waitUntil(
        () => win._mp && win._mp.eedlInstance,
        15000,
        100,
        triggerPurchase
      );
    } else {
      triggerPurchase();
    }
  }, [order?.transactionId]);

  if (!order) {
    return <Navigate to="/products" replace />;
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Top Success Badge & Celebration */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#121212] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment & Order Confirmed</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-zinc-950 font-normal">
          Order Placed Successfully
        </h1>

        <p className="text-zinc-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-zinc-900">{order.customer.name}</strong>. Your artisanal flacons are being hand-packaged with care at our atelier.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden divide-y divide-zinc-100">
        {/* Transaction Header Info */}
        <div className="p-6 sm:p-8 bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold block">
              Official Transaction ID
            </span>
            <span
              id="order-transaction-id"
              className="font-mono text-xl sm:text-2xl font-bold text-zinc-900 tracking-wider"
            >
              {order.transactionId}
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span className="uppercase font-semibold text-emerald-700">Paid • {order.currency}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>Customer Details</span>
            </div>
            <p className="font-medium text-zinc-900">{order.customer.name}</p>
            <p className="text-zinc-600 text-xs">{order.customer.email}</p>
            <p className="text-zinc-600 text-xs">+91 {order.customer.phone}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Delivery Address</span>
            </div>
            <p className="text-zinc-700 text-xs leading-relaxed">
              {order.customer.address}, {order.customer.city}, {order.customer.state} — {order.customer.pincode}
            </p>
            <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Standard Express Delivery (2-4 business days)
            </span>
          </div>
        </div>

        {/* Purchased Products List */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>Purchased Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {order.items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="py-4 flex items-center justify-between gap-4 text-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-16 rounded-xl object-cover border border-zinc-200"
                  />
                  <div>
                    <span className="font-semibold text-zinc-900 block">{product.name}</span>
                    <span className="text-xs text-zinc-500">
                      ID: {product.id} • {product.variant} • Qty: {quantity}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency(product.price * quantity)}
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    {formatCurrency(product.price)} each
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Calculations */}
        <div className="p-6 sm:p-8 bg-zinc-50/70 space-y-3 text-sm">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="font-medium text-zinc-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Shipping</span>
            <span className="font-medium text-zinc-900">
              {order.shipping === 0 ? 'Complimentary' : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline">
            <span className="text-base font-semibold text-zinc-950">Total Paid</span>
            <span id="order-total-amount" className="text-2xl font-bold text-zinc-950">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Ready Callout for user awareness */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs space-y-1">
        <div className="font-semibold flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>GTM & GA4 E-Commerce Ready</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Order state is preserved in memory and localStorage with complete transactionId, revenue, customer, and items payload. Ready for your manual <code>dataLayer.push({`{ event: 'purchase', ecommerce: ... }`})</code> hook!
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/products"
          id="continue-shopping-button"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-semibold rounded-full shadow-xl transition-transform active:scale-95"
        >
          <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
