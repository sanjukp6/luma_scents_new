import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle2,
  ArrowLeft,
  Star
} from 'lucide-react';
import { PRODUCTS, getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const product = getProductById(id || '');

  // Local quantity selector state
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl text-zinc-900">Fragrance Not Found</h1>
        <p className="text-zinc-600">The fragrance ID you requested does not exist in our catalog.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Collection
        </Link>
      </div>
    );
  }

  // Check how many of this item is already in cart
  const itemInCart = items.find((i) => i.product.id === product.id);
  const inCartQuantity = itemInCart ? itemInCart.quantity : 0;
  const remainingStock = Math.max(0, product.stock - inCartQuantity);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < remainingStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  /**
   * Core Ecommerce Business Logic execution from UI
   * UI -> Product Details Component -> addToCart(product, quantity) -> Cart State
   */
  const handleAddToCart = () => {
    setIsAdding(true);
    // Execute real business logic
    const result = addToCart(product, quantity);

    setTimeout(() => {
      setIsAdding(false);
      if (result.success) {
        // Reset selected quantity back to 1
        setQuantity(1);
      }
    }, 250);
  };

  // Related products (other perfumes in catalog)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-zinc-500">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <Link to="/products" className="hover:text-black transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-900 font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Product Imagery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-zinc-200 shadow-xl group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Overlay SKU / ID Badge */}
            <div className="absolute top-4 left-4 bg-[#121212]/80 backdrop-blur-md text-white text-[11px] font-mono tracking-widest px-3 py-1.5 rounded-full border border-white/10">
              ID: {product.id}
            </div>

            {/* Stock status overlay badge */}
            <div className="absolute top-4 right-4">
              {isOutOfStock ? (
                <span className="bg-red-700 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Critical Stock: {product.stock} left
                </span>
              ) : (
                <span className="bg-emerald-800/90 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  In Stock ({product.stock} units)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Commerce Actions */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Info */}
          <div className="space-y-3 border-b border-zinc-200 pb-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[#8C827A]">
              <span>{product.brand} • {product.category}</span>
              <span className="bg-zinc-200 text-zinc-800 px-2.5 py-0.5 rounded-full text-[11px]">
                {product.variant}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-zinc-950 font-normal leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <span className="text-xs text-zinc-500">
                {product.rating} ({product.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="text-3xl font-semibold text-zinc-950">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-zinc-500 block mt-1">
                Inclusive of all taxes. Free express shipping on this order.
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-900">
              Fragrance Description
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Olfactory Pyramid / Scent Notes */}
          {product.notes && (
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Olfactory Pyramid</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-800 w-14 shrink-0">Top:</span>
                  <span className="text-zinc-600">{product.notes.top}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-800 w-14 shrink-0">Heart:</span>
                  <span className="text-zinc-600">{product.notes.heart}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-800 w-14 shrink-0">Base:</span>
                  <span className="text-zinc-600">{product.notes.base}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quantity Selector and Add to Cart Action */}
          <div className="space-y-4 pt-2">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <label htmlFor="product-qty" className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Quantity
              </label>
              <span className="text-xs text-zinc-500">
                Available to add: <strong className="text-zinc-900">{remainingStock}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  id="decrement-qty-button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-zinc-600 hover:text-black disabled:text-zinc-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="product-qty"
                  type="number"
                  min="1"
                  max={remainingStock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= remainingStock) {
                      setQuantity(val);
                    }
                  }}
                  className="w-12 text-center text-sm font-semibold text-zinc-900 focus:outline-none"
                />
                <button
                  type="button"
                  id="increment-qty-button"
                  onClick={handleIncrement}
                  disabled={quantity >= remainingStock || isOutOfStock}
                  className="p-2.5 text-zinc-600 hover:text-black disabled:text-zinc-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add To Cart CTA Button */}
              <button
                type="button"
                id="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || remainingStock === 0 || isAdding}
                className="flex-1 py-4 px-6 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {isOutOfStock
                    ? 'Sold Out'
                    : remainingStock === 0
                    ? 'Max In Cart'
                    : isAdding
                    ? 'Adding...'
                    : `Add to Cart — ${formatCurrency(product.price * quantity)}`}
                </span>
              </button>
            </div>

            {/* In-cart status banner */}
            {inCartQuantity > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100 text-xs text-zinc-700">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You have <strong>{inCartQuantity}</strong> in your cart</span>
                </span>
                <button
                  onClick={() => navigate('/cart')}
                  className="font-semibold text-zinc-900 hover:underline uppercase tracking-wider"
                >
                  View Cart →
                </button>
              </div>
            )}
          </div>

          {/* Guarantees & Shipping perks */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Free Delivery in 2-4 days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100% Original Flacon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Fragrances Section */}
      <div className="pt-16 border-t border-zinc-200 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950">
            You May Also Admire
          </h2>
          <Link
            to="/products"
            className="text-xs uppercase tracking-wider font-semibold text-zinc-800 hover:text-black"
          >
            Explore All Fragrances →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
