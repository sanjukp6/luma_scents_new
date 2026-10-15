import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] text-[#FAF9F6] border-t border-zinc-800 pt-16 pb-12 mt-20">
      {/* Brand Values / Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">Artisanal Blends</h4>
              <p className="text-xs text-zinc-400 mt-0.5">High concentration natural extracts</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#D4AF37]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">Complimentary Shipping</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Free delivery on orders over ₹1,000</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">Authenticity Guaranteed</h4>
              <p className="text-xs text-zinc-400 mt-0.5">100% genuine formulation sealed</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">Enduring Longevity</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Extrait de Parfum lasting 12+ hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl tracking-[0.25em] font-semibold text-[#FAF9F6] uppercase">
              Luma Scents
            </span>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Artisanal luxury perfumes crafted with rare florals, precious woods, and golden ambers. Designed to express personality and linger in memory.
            </p>
            <div className="text-xs text-[#D4AF37] tracking-wider uppercase pt-2">
              Clean Architecture • Ready for GTM & GA4
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
              Navigation
            </h5>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  All Perfumes & Fragrances
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#D4AF37] transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-[#D4AF37] transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Olfactory Journal */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
              The Olfactory Dispatch
            </h5>
            <p className="text-sm text-zinc-400">
              Subscribe to receive private invitations to limited batch harvests and seasonal fragrance launches.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to Luma Scents journal!');
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bg-zinc-900 border border-zinc-700 text-sm px-3.5 py-2.5 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] flex-1"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} Luma Scents Haute Parfumerie. All rights reserved.</p>
        <p className="text-zinc-500">
          Built for testing modern ecommerce workflows and analytics tracking.
        </p>
      </div>
    </footer>
  );
};
