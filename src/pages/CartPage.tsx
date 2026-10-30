import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, FREE_SHIPPING_THRESHOLD } from '../utils/formatters';
import { trackViewCart, trackBeginCheckout } from '../utils/dataLayer';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const hasTrackedViewCart = useRef(false);

  // Track GA4 Ecommerce and MagicPixel EEDL view_cart when user views cart
  useEffect(() => {
    if (items.length > 0 && !hasTrackedViewCart.current) {
      hasTrackedViewCart.current = true;
      trackViewCart(items, total);
    }
  }, [items, total]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleProceedToCheckout = () => {
    if (items.length > 0) {
      trackBeginCheckout(items, total);
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          <ShoppingBag className="w-10 h-10 stroke-[1.25]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-zinc-900 font-normal">
          Your Cart is Empty
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          You haven't chosen any artisanal fragrances yet. Explore our handcrafted collection to find your signature scent.
        </p>
        <div className="pt-4">
          <Link
            to="/products"
            id="empty-cart-shop-cta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-semibold rounded-full shadow-lg transition-transform active:scale-95"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-zinc-950 font-normal">
            Your Shopping Bag
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1 uppercase tracking-wider">
            {itemCount} {itemCount === 1 ? 'fragrance' : 'fragrances'} selected
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-wider text-zinc-400 hover:text-red-600 transition-colors self-start sm:self-auto"
        >
          Clear entire cart
        </button>
      </div>

      {/* Free Shipping Tier Banner */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-2 text-zinc-800">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            {isFreeShipping ? (
              <span className="font-semibold text-emerald-700">
                You've unlocked Complimentary Express Shipping!
              </span>
            ) : (
              <span>
                Add <strong className="text-zinc-950">{formatCurrency(amountNeeded)}</strong> more to unlock Free Shipping
              </span>
            )}
          </span>
          <span className="text-zinc-500">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#D4AF37] h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden shadow-sm">
            {items.map(({ product, quantity }) => {
              const itemTotal = product.price * quantity;

              return (
                <div
                  key={product.id}
                  id={`cart-item-${product.id}`}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors hover:bg-zinc-50/50"
                >
                  {/* Thumbnail and Title */}
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <Link
                      to={`/products/${product.id}`}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#8C827A] font-semibold">
                        {product.brand}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-medium text-zinc-900 hover:text-black text-base sm:text-lg block line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700 font-medium">
                          {product.variant}
                        </span>
                        <span>•</span>
                        <span>{formatCurrency(product.price)} each</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-white p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 text-zinc-500 hover:text-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="p-1.5 text-zinc-500 hover:text-black disabled:text-zinc-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for this line */}
                    <div className="text-right min-w-[90px]">
                      <span className="font-semibold text-base text-zinc-950 block">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs uppercase tracking-wider font-semibold text-zinc-700 hover:text-black flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6 sticky top-28">
            <h2 className="font-serif text-2xl text-zinc-950 font-normal border-b border-zinc-100 pb-4">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-zinc-950">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1">
                  <span>Shipping</span>
                  {shipping === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
                      Free
                    </span>
                  )}
                </span>
                <span className="font-medium text-zinc-950">
                  {shipping === 0 ? '₹0' : formatCurrency(shipping)}
                </span>
              </div>

              <div className="border-t border-zinc-100 pt-3.5 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-semibold text-zinc-950 block">Total</span>
                  <span className="text-[11px] text-zinc-400">Includes all applicable GST</span>
                </div>
                <span className="text-2xl font-bold text-zinc-950">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              id="proceed-to-checkout-button"
              onClick={handleProceedToCheckout}
              className="w-full py-4 px-6 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            {/* Security assurance */}
            <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Simulated Secure Checkout (Learning Environment)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Clean Architecture for GA4 E-commerce Tagging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
