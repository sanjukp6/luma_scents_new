import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'LS-PERF-001',
    name: 'Luma Noir Eau de Parfum',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '50ml',
    price: 1499,
    description: 'An enigmatic blend of black pepper, smoky cedarwood, and rich amber designed for velvet twilight evenings. Intensely magnetic and long-lasting.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
    stock: 20,
    notes: {
      top: 'Black Pepper, Bergamot, Pink Peppercorn',
      heart: 'Dark Amber, Bulgarian Rose, Incense',
      base: 'Smoky Cedarwood, Indonesian Patchouli, Vanilla Bean'
    },
    featured: true,
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: 'LS-PERF-002',
    name: 'Luma Azure',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '50ml',
    price: 1299,
    description: 'Crisp aquatic breezes infused with Calabrian bergamot and subtle sea salt. Invigorating yet deeply calming, reminiscent of sun-drenched Mediterranean shores.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
    stock: 15,
    notes: {
      top: 'Calabrian Bergamot, Sea Salt, Mandarin',
      heart: 'Aquatic Accord, White Jasmine, Rosemary',
      base: 'Driftwood, White Musk, Mineral Amber'
    },
    featured: true,
    rating: 4.8,
    reviewsCount: 94
  },
  {
    id: 'LS-PERF-003',
    name: 'Luma Velvet Rose',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '50ml',
    price: 1599,
    description: 'A decadent bouquet of Damask rose petals wrapped in soft spiced oud and praline sweetness. Elegant, romantic, and irresistibly intoxicating.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80',
    stock: 12,
    notes: {
      top: 'Damask Rose, Clove, Red Currant',
      heart: 'Velvet Praline, Rose Otto, Violet Leaves',
      base: 'Smoked Oud, Amberwood, Creamy Sandalwood'
    },
    featured: true,
    rating: 4.9,
    reviewsCount: 110
  },
  {
    id: 'LS-PERF-004',
    name: 'Luma Cedar',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '100ml',
    price: 1899,
    description: 'Pure forest air harmonized with aged Atlas cedar, vetiver roots, and crushed cardamom. An earthy, grounding signature fragrance for discerning tastes.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80',
    stock: 18,
    notes: {
      top: 'Crushed Cardamom, Juniper Berries, Grapefruit',
      heart: 'Atlas Cedarwood, Nutmeg, Clary Sage',
      base: 'Haitian Vetiver, Leather Accord, Oakmoss'
    },
    featured: false,
    rating: 4.7,
    reviewsCount: 76
  },
  {
    id: 'LS-PERF-005',
    name: 'Luma Bloom',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '50ml',
    price: 1399,
    description: 'A radiant morning garden in full blossom. White tuberose, orange flower petals, and luscious neroli touched with a whisper of sunlit peach.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
    stock: 25,
    notes: {
      top: 'Sunlit Neroli, White Peach, Mandarin Blossom',
      heart: 'French Tuberose, Orange Flower, Gardenia',
      base: 'Sheer Cashmere Wood, Warm Amber, White Musk'
    },
    featured: true,
    rating: 4.8,
    reviewsCount: 89
  },
  {
    id: 'LS-PERF-006',
    name: 'Luma Oud',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '100ml',
    price: 2199,
    description: 'Royal agarwood distillation balanced with rare saffron threads, cardamom spice, and creamy Mysore sandalwood. A masterpiece of opulent longevity.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    stock: 8,
    notes: {
      top: 'Rare Saffron, Green Cardamom, Thyme',
      heart: 'Smoked Agarwood (Oud), Rose Petals, Incense',
      base: 'Mysore Sandalwood, Dark Leather, Warm Tonka'
    },
    featured: true,
    rating: 5.0,
    reviewsCount: 142
  },
  {
    id: 'LS-PERF-007',
    name: 'Luma Mist',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '50ml',
    price: 999,
    description: 'An airy, ethereal scent inspired by morning mist over tea terraces. Green tea leaves, sparkling yuzu, and clean white cedar create an effortless everyday aura.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=80',
    stock: 30,
    notes: {
      top: 'Sparkling Yuzu, Bamboo Water, Mint Leaves',
      heart: 'Green Tea Leaves, Peony, Lotus Flower',
      base: 'Clean White Cedar, Sheer Musk, Mate'
    },
    featured: false,
    rating: 4.6,
    reviewsCount: 65
  },
  {
    id: 'LS-PERF-008',
    name: 'Luma Essence',
    brand: 'Luma Scents',
    category: 'Perfume',
    variant: '30ml',
    price: 899,
    description: 'The pure, intimate essence of skin scent perfumery. Iso E Super, subtle ambroxan, and creamy tonka bean that evolves uniquely with your natural chemistry.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=80',
    stock: 22,
    notes: {
      top: 'Soft Ambrette Seed, Pink Pepper, Aldehydes',
      heart: 'Iris Concrete, Ambroxan, White Lily',
      base: 'Creamy Tonka Bean, Iso E Super, Velvet Musk'
    },
    featured: false,
    rating: 4.7,
    reviewsCount: 81
  }
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(p => p.id === id);
};
