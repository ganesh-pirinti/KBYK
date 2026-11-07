import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/shop/ProductCard';
import { PRODUCTS } from '../data/products';
import { CategoryType, OccasionType, Product } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter } from 'lucide-react';
import { MotionReveal } from '../components/common/MotionReveal';

interface ShopPageProps {
  initialCategory?: string;
  initialOccasion?: string;
  onSelectProduct: (id: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'All',
  initialOccasion = 'All',
  onSelectProduct,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedOccasion, setSelectedOccasion] = useState<string>(initialOccasion);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(2500);

  const categories: (string | CategoryType)[] = [
    'All',
    'Gift Boxes',
    'Scrapbooks',
    'Accessories',
    'Home Decor',
    'Combo',
  ];

  const occasions = [
    'All',
    'Birthdays',
    'Anniversaries',
    'Friendship',
    'Festivals',
    'Just Because',
    'Proposals',
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchOcc =
        selectedOccasion === 'All' ||
        p.occasions.some((o) => o.toLowerCase() === selectedOccasion.toLowerCase());
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.price <= maxPrice;

      return matchCat && matchOcc && matchSearch && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, selectedOccasion, searchQuery, sortBy, maxPrice]);

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Collection Header (matching Reference 02) */}
        <div className="text-center relative py-6 sm:py-10 border-b border-[#F7E6EB]">
          <span className="text-xs uppercase font-bold tracking-widest text-[#145C45] block mb-2">
            The Complete Studio Catalogue
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#292626]">
            Our Collection
          </h1>
          <p className="text-sm text-[#77716F] max-w-lg mx-auto mt-2 font-light">
            Handmade treasures for your special people. Every keepsake is crafted to order with personalized details.
          </p>
        </div>

        {/* Category Tabs (Reference 02) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#145C45] text-white shadow-md'
                  : 'bg-white text-[#77716F] hover:bg-[#F7E6EB] hover:text-[#145C45] border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Strip */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#F7E6EB] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search inside shop */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#77716F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword (e.g. polaroid, light)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FCFAF9] border border-gray-200 text-xs text-[#292626] focus:outline-none focus:border-[#145C45]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Occasion dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#77716F]">Occasion:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="bg-[#FCFAF9] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-[#292626] focus:outline-none focus:border-[#145C45]"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#77716F]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FCFAF9] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-[#292626] focus:outline-none focus:border-[#145C45]"
              >
                <option value="featured">Featured Keepsakes</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Max Budget Slider */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#77716F] pl-2 border-l border-gray-200">
              <span>Budget:</span>
              <input
                type="range"
                min="400"
                max="2000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#145C45] w-24 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="font-bold text-[#292626]">≤ ₹{maxPrice}</span>
            </div>
          </div>

        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'All' || selectedOccasion !== 'All' || searchQuery || maxPrice < 2000) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#77716F] font-medium">Active filters:</span>

            {selectedCategory !== 'All' && (
              <span className="bg-[#F7E6EB] text-[#145C45] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedOccasion !== 'All' && (
              <span className="bg-[#F7E6EB] text-[#145C45] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                Occasion: {selectedOccasion}
                <button onClick={() => setSelectedOccasion('All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="bg-[#F7E6EB] text-[#145C45] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedOccasion('All');
                setSearchQuery('');
                setMaxPrice(2500);
              }}
              className="text-xs text-[#145C45] underline font-semibold ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <MotionReveal key={product.id} variant="fade-up" delay={Math.min(idx * 75, 450)}>
                <ProductCard
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                />
              </MotionReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F7E6EB] p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#292626]">No gifts found matching criteria</h3>
            <p className="text-xs text-[#77716F] max-w-md mx-auto">
              Try adjusting your filters or send us a custom request — we can craft any keepsake to your desired specifications.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedOccasion('All');
                setSearchQuery('');
                setMaxPrice(2500);
              }}
              className="px-6 py-2.5 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
