import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Star } from 'lucide-react';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#ECE9E2] hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Badges */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F4F0]">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Variant Badge */}
        <div className="absolute top-3 left-3 bg-[#121212]/80 backdrop-blur-sm text-white text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full">
          {product.variant}
        </div>

        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
            Only {product.stock} left
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
            Out of Stock
          </div>
        )}

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="w-full py-2.5 px-4 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs font-semibold tracking-wider uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add Another ({inCartQty} in cart)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">
            <span>{product.brand}</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-zinc-700 font-medium">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.id}`}
            className="block text-base font-medium text-zinc-900 hover:text-black line-clamp-1 group-hover:text-black transition-colors"
          >
            {product.name}
          </Link>

          {/* Scent notes summary / short description */}
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block">Price</span>
            <span className="text-lg font-semibold text-zinc-950">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="text-xs font-semibold uppercase tracking-wider text-[#121212] hover:text-[#D4AF37] transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
