import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Feather, Shield, Droplets } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0D0D0D] text-white">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1920&q=85"
            alt="Luma Scents Luxury Perfume Flacon"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0D]/40 to-[#0D0D0D]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#1A1A1A]/70 backdrop-blur-md text-[#D4AF37] text-xs font-medium tracking-[0.25em] uppercase animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Artisanal Parfum Collection</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#FAF9F6] leading-[1.15]">
            Whispers of Amber, <br />
            <span className="italic font-light text-[#D4AF37]">Echoes of Memory.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Distilled from the world's most elusive botanicals and rare aged resins. Hand-poured in micro-batches to create scents that evolve intimately with your skin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/products"
              id="hero-shop-collection-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FAF9F6] text-[#121212] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl shadow-black/40"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#featured"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-200 text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              Explore Featured
            </a>
          </div>
        </div>
      </section>

      {/* Brand Highlights / Craftsmanship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-zinc-200">
          <div className="flex items-start gap-4 p-4">
            <div className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-900 shrink-0">
              <Droplets className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-zinc-900">Extrait Concentration</h3>
              <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                Formulated at an exceptional 25-30% fragrance oil concentration for an unmatched 14+ hour trail.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-900 shrink-0">
              <Feather className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-zinc-900">Sustainably Harvested</h3>
              <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                Rare florals and resins sourced ethically from ancestral distillers in Grasse, Mysore, and Calabria.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-900 shrink-0">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-zinc-900">Flacon Perfection</h3>
              <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                Hand-polished heavyweight French glass bottles finished with custom magnetic zinc alloy caps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#8C827A] uppercase block">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 mt-1">
              Featured Fragrances
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900 hover:text-[#D4AF37] transition-colors"
          >
            <span>View All 8 Fragrances</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Scent Journey Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#161616] text-[#FAF9F6] p-8 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-6">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4AF37]">
              The Olfactory Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
              Perfume is the most intense form of <span className="italic font-serif text-[#D4AF37]">memory</span>.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Every Luma Scents fragrance is composed as a three-act symphony. The opening notes greet you like a sudden burst of morning light; the heart reveals raw emotion; while the base lingers on your scarf and skin for days.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF9F6] text-black hover:bg-[#D4AF37] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors"
              >
                Discover The Full Range
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 aspect-square rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
              alt="Luma Scents Perfumer Process"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
