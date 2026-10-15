import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF9F6]/90 border-b border-[#E8E6E1] transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-[#121212] text-[#FAF9F6] text-xs py-2 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Complimentary express delivery on all orders over ₹1,000</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-800 hover:text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Left Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-wider font-medium text-zinc-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-black ${
                isActive ? 'text-black font-semibold border-b border-black pb-0.5' : ''
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `transition-colors hover:text-black ${
                isActive ? 'text-black font-semibold border-b border-black pb-0.5' : ''
              }`
            }
          >
            All Fragrances
          </NavLink>
        </div>

        {/* Brand Logo / Name */}
        <div className="text-center">
          <Link to="/" className="group inline-flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-[#121212] group-hover:text-black transition-colors uppercase">
              Luma Scents
            </span>
            <span className="text-[10px] tracking-[0.35em] text-[#8C827A] uppercase -mt-1 font-light">
              Haute Parfumerie
            </span>
          </Link>
        </div>

        {/* Right Actions: Cart & CTA */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center text-xs uppercase tracking-widest px-4 py-2 border border-zinc-900 rounded-full hover:bg-zinc-900 hover:text-white transition-all duration-300 font-medium"
          >
            Shop Collection
          </Link>

          <Link
            to="/cart"
            id="navbar-cart-button"
            className="relative p-2.5 text-zinc-900 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
            aria-label={`Shopping Cart with ${itemCount} items`}
          >
            <ShoppingBag className="w-6 h-6 stroke-[1.75]" />
            {itemCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute top-1 right-1 bg-[#121212] text-[#D4AF37] text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#FAF9F6] shadow-sm transform scale-100 animate-fade-in"
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-[#E8E6E1] px-6 py-6 space-y-4 animate-fade-in shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base uppercase tracking-wider font-medium text-zinc-900 py-2 border-b border-zinc-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base uppercase tracking-wider font-medium text-zinc-900 py-2 border-b border-zinc-200"
          >
            All Products & Fragrances
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base uppercase tracking-wider font-medium text-zinc-900 py-2 border-b border-zinc-200 flex items-center justify-between"
          >
            <span>Cart</span>
            <span className="bg-zinc-900 text-[#D4AF37] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {itemCount} items
            </span>
          </Link>
        </div>
      )}
    </header>
  );
};
