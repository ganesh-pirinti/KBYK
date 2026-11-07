import React, { useState } from 'react';
import { ProductCard } from '../shop/ProductCard';
import { PRODUCTS } from '../../data/products';
import { CategoryType, Product } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MotionReveal } from '../common/MotionReveal';

interface FeaturedGiftsProps {
  onSelectProduct: (id: string) => void;
  onViewAll: () => void;
  onQuickView?: (product: Product) => void;
}

export const FeaturedGifts: React.FC<FeaturedGiftsProps> = ({
  onSelectProduct,
  onViewAll,
  onQuickView,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories: (string | CategoryType)[] = [
    'All',
    'Scrapbooks',
    'Gift Boxes',
    'Accessories',
    'Home Decor',
    'Combo',
  ];

  const filtered = activeCategory === 'All'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <MotionReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#145C45] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Treasures</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292626]">
              Featured Keepsakes
            </h2>
            <p className="text-sm text-[#77716F] max-w-lg">
              Explore our most loved handcrafted creations, personalized to preserve your special moments forever.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#145C45] text-white shadow-xs'
                    : 'bg-[#FCFAF9] text-[#77716F] hover:bg-[#F7E6EB] hover:text-[#145C45] border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </MotionReveal>

        {/* Products Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, idx) => (
            <MotionReveal
              key={product.id}
              direction="up"
              delay={(idx % 4) * 80}
            >
              <ProductCard
                product={product}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            </MotionReveal>
          ))}
        </div>

        {/* Bottom View All Link */}
        <MotionReveal direction="up" delay={200} className="mt-12 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#145C45] text-[#145C45] text-sm font-semibold hover:bg-[#145C45] hover:text-white transition-all transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
          >
            <span>View All Handcrafted Gifts ({PRODUCTS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </MotionReveal>

      </div>
    </section>
  );
};
