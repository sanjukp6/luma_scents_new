import type { Product } from '../types';

// Declare global dataLayer and eedl interfaces
declare global {
  interface Window {
    dataLayer: any[];
    eedl?: (...args: any[]) => void;
    mpDl?: any[];
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

  // If MagicPixel / EEDL is loaded on the page, also pass event
  if (typeof window.eedl === 'function') {
    try {
      window.eedl(payload.event, payload);
    } catch {
      // ignore
    }
  }

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
 * 2. Track View Item (GA4 Ecommerce)
 * Triggered when a user views a specific fragrance details page.
 */
export const trackViewItem = (product: Product) => {
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
};

/**
 * 3. Track Add to Cart (GA4 Ecommerce)
 * Triggered whenever a product is successfully added to cart.
 */
export const trackAddToCart = (product: Product, quantity: number) => {
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
};
