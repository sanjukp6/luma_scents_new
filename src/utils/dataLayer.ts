import type { Product, CartItem } from '../types';

// Declare global dataLayer and eedl interfaces
declare global {
  interface Window {
    dataLayer: any[];
    eedl?: (...args: any[]) => void;
    mpDl?: any[];
    trackMpAddToCart?: (product: Product, quantity: number) => void;
    trackMpViewItem?: (product: Product) => void;
    trackMpViewCart?: (items: CartItem[], total: number) => void;
    trackMpBeginCheckout?: (items: CartItem[], total: number) => void;
    trackMpAddShippingInfo?: (items: CartItem[], total: number, shippingTier: string) => void;
    trackMpAddPaymentInfo?: (items: CartItem[], total: number, paymentType: string) => void;
  }
}

/**
 * Ensures window.dataLayer exists and pushes event data cleanly.
 * Follows Google Analytics 4 (GA4) ecommerce guidelines:
 * Clears prior ecommerce object before pushing a new ecommerce event.
 */
export const pushToDataLayer = (payload: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // GA4 recommendation: clear previous ecommerce object to prevent parameter leakage
  if (payload.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }

  window.dataLayer.push(payload);

  // Developer-friendly log for easy inspection during tracking tests
  if (import.meta.env.DEV || true) {
    console.log(
      `%c[dataLayer] %c${payload.event || 'push'}`,
      'background: #121212; color: #D4AF37; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #0088cc; font-weight: bold;',
      payload
    );
  }
};

/**
 * 1. Track Page Load / Page View
 * Triggered on initial page load and whenever client-side route changes.
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  const title = pageTitle || document.title;
  pushToDataLayer({
    event: 'page_view',
    page_path: pagePath,
    page_title: title,
    page_location: window.location.href,
  });
};

/**
 * 2. Track View Item (GA4 Ecommerce + MagicPixel EEDL)
 * Triggered when a user views a specific fragrance details page.
 */
export const trackViewItem = (product: Product) => {
  // GA4 dataLayer event
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'INR',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          item_variant: product.variant,
          price: product.price,
          quantity: 1,
        },
      ],
    },
  });

  // MagicPixel EEDL view_item tracking
  if (typeof window !== 'undefined' && typeof window.trackMpViewItem === 'function') {
    try {
      window.trackMpViewItem(product);
    } catch (err) {
      console.warn('[MagicPixel] Error dispatching trackMpViewItem:', err);
    }
  }
};

/**
 * 3. Track Add to Cart (GA4 Ecommerce + MagicPixel EEDL)
 * Triggered whenever a product is successfully added to cart.
 */
export const trackAddToCart = (product: Product, quantity: number) => {
  // GA4 dataLayer event
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'INR',
      value: product.price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          item_variant: product.variant,
          price: product.price,
          quantity: quantity,
        },
      ],
    },
  });

  // MagicPixel EEDL mp_add_to_cart tracking
  if (typeof window !== 'undefined' && typeof window.trackMpAddToCart === 'function') {
    try {
      window.trackMpAddToCart(product, quantity);
    } catch (err) {
      console.warn('[MagicPixel] Error dispatching trackMpAddToCart:', err);
    }
  }
};

/**
 * 4. Track View Cart (GA4 Ecommerce + MagicPixel EEDL)
 * Triggered when a user views their shopping cart.
 */
export const trackViewCart = (items: CartItem[], total: number) => {
  // GA4 dataLayer event
  pushToDataLayer({
    event: 'view_cart',
    ecommerce: {
      currency: 'INR',
      value: total,
      items: items.map((cartItem, idx) => ({
        item_id: cartItem.product.id,
        item_name: cartItem.product.name,
        item_brand: cartItem.product.brand || 'Luma Scents',
        item_category: cartItem.product.category,
        item_variant: cartItem.product.variant,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        index: idx,
      })),
    },
  });

  // MagicPixel EEDL view_cart tracking
  if (typeof window !== 'undefined' && typeof window.trackMpViewCart === 'function') {
    try {
      window.trackMpViewCart(items, total);
    } catch (err) {
      console.warn('[MagicPixel] Error dispatching trackMpViewCart:', err);
    }
  } else if (typeof window !== 'undefined' && typeof (window as any).eedl === 'function') {
    try {
      const cartId =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('mp_cart_id')) ||
        'cart_' + Date.now().toString(36);
      const itemsList = items.map((item, idx) => ({
        item_id: String(item.product.id),
        item_name: item.product.name,
        item_sku: String((item.product as any).sku || item.product.id),
        variant_id: item.product.variant || undefined,
        index: idx,
        price: Number(item.product.price),
        quantity: Number(item.quantity || 1),
        item_brand: item.product.brand || 'Luma Scents',
        item_category: item.product.category || undefined,
        options: {
          volume: (item.product as any).volume,
        },
      }));

      (window as any).eedl('view_cart', {
        currency: 'INR',
        cart_id: cartId,
        value: Number(total),
        items: itemsList,
        ev_source: 'gtm',
      });
    } catch (err) {
      console.warn('[EEDL] Error dispatching view_cart:', err);
    }
  }
};

/**
 * 5. Track Begin Checkout (GA4 Ecommerce + MagicPixel EEDL)
 * Triggered when a user clicks Proceed to Checkout from the cart.
 */
export const trackBeginCheckout = (items: CartItem[], total: number) => {
  // GA4 dataLayer event
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'INR',
      value: total,
      items: items.map((cartItem, idx) => ({
        item_id: cartItem.product.id,
        item_name: cartItem.product.name,
        item_brand: cartItem.product.brand || 'Luma Scents',
        item_category: cartItem.product.category,
        item_variant: cartItem.product.variant,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        index: idx,
      })),
    },
  });

  // MagicPixel EEDL begin_checkout tracking
  if (typeof window !== 'undefined' && typeof window.trackMpBeginCheckout === 'function') {
    try {
      window.trackMpBeginCheckout(items, total);
    } catch (err) {
      console.warn('[MagicPixel] Error dispatching trackMpBeginCheckout:', err);
    }
  } else if (typeof window !== 'undefined' && typeof (window as any).eedl === 'function') {
    try {
      const cartId =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('mp_cart_id')) ||
        'cart_' + Date.now().toString(36);
      const itemsList = items.map((item, idx) => ({
        item_id: String(item.product.id),
        item_name: item.product.name,
        item_sku: String((item.product as any).sku || item.product.id),
        variant_id: item.product.variant || undefined,
        index: idx,
        price: Number(item.product.price),
        quantity: Number(item.quantity || 1),
        item_brand: item.product.brand || 'Luma Scents',
        item_category: item.product.category || undefined,
        options: {
          volume: (item.product as any).volume,
        },
      }));

      (window as any).eedl('begin_checkout', {
        currency: 'INR',
        cart_id: cartId,
        value: Number(total),
        items: itemsList,
        ev_source: 'gtm',
      });
    } catch (err) {
      console.warn('[EEDL] Error dispatching begin_checkout:', err);
    }
  }
};

/**
 * 6. Track Add Shipping Info (MagicPixel EEDL)
 * Triggered when a user confirms or enters shipping/delivery details.
 */
export const trackAddShippingInfo = (
  items: CartItem[],
  total: number,
  shippingTier: string = 'Standard Delivery'
) => {
  // Developer inspection log
  if (import.meta.env.DEV || true) {
    console.log(
      '%c[MagicPixel EEDL] %cadd_shipping_info',
      'background: #121212; color: #D4AF37; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #10b981; font-weight: bold;',
      { shippingTier, total, itemCount: items.length }
    );
  }

  // MagicPixel EEDL add_shipping_info tracking
  if (typeof window !== 'undefined' && typeof window.trackMpAddShippingInfo === 'function') {
    try {
      window.trackMpAddShippingInfo(items, total, shippingTier);
    } catch (err) {
      console.warn('[MagicPixel] Error dispatching trackMpAddShippingInfo:', err);
    }
  } else if (typeof window !== 'undefined' && typeof (window as any).eedl === 'function') {
    try {
      const cartId =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('mp_cart_id')) ||
        'cart_' + Date.now().toString(36);
      const itemsList = items.map((item, idx) => ({
        item_id: String(item.product.id),
        item_name: item.product.name,
        item_sku: String((item.product as any).sku || item.product.id),
        variant_id: item.product.variant || undefined,
        index: idx,
        price: Number(item.product.price),
        quantity: Number(item.quantity || 1),
        item_brand: item.product.brand || 'Luma Scents',
        item_category: item.product.category || undefined,
        options: {
          volume: (item.product as any).volume,
        },
      }));

      (window as any).eedl('add_shipping_info', {
        currency: 'INR',
        cart_id: cartId,
        value: Number(total),
        shipping_tier: shippingTier,
        items: itemsList,
        ev_source: 'gtm',
      });
    } catch (err) {
      console.warn('[EEDL] Error dispatching add_shipping_info:', err);
    }
  }
};

/**
 * 7. Track Add Payment Info (MagicPixel EEDL)
 * Triggered when a user selects or confirms their payment method.
 */
export const trackAddPaymentInfo = (
  items: CartItem[],
  total: number,
  paymentType: string = 'Credit Card'
) => {
  // Developer inspection log
  if (import.meta.env.DEV || true) {
    console.log(
      '%c[MagicPixel EEDL] %cadd_payment_info',
      'background: #121212; color: #D4AF37; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #10b981; font-weight: bold;',
      { paymentType, total, itemCount: items.length }
    );
  }

  // MagicPixel EEDL add_payment_info tracking
  if (typeof window !== 'undefined' && typeof window.trackMpAddPaymentInfo === 'function') {
    try {
      window.trackMpAddPaymentInfo(items, total, paymentType);
    } catch (err) {
      console.warn('[MagicPixel] Error dispatching trackMpAddPaymentInfo:', err);
    }
  } else if (typeof window !== 'undefined' && typeof (window as any).eedl === 'function') {
    try {
      const cartId =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('mp_cart_id')) ||
        'cart_' + Date.now().toString(36);
      const itemsList = items.map((item, idx) => ({
        item_id: String(item.product.id),
        item_name: item.product.name,
        item_sku: String((item.product as any).sku || item.product.id),
        variant_id: item.product.variant || undefined,
        index: idx,
        price: Number(item.product.price),
        quantity: Number(item.quantity || 1),
        item_brand: item.product.brand || 'Luma Scents',
        item_category: item.product.category || undefined,
        options: {
          volume: (item.product as any).volume,
        },
      }));

      (window as any).eedl('add_payment_info', {
        currency: 'INR',
        cart_id: cartId,
        value: Number(total),
        payment_type: paymentType,
        items: itemsList,
        ev_source: 'gtm',
      });
    } catch (err) {
      console.warn('[EEDL] Error dispatching add_payment_info:', err);
    }
  }
};
