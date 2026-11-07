import React, { useState } from 'react';
import { OCCASIONS } from '../data/occasions';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';

interface OccasionPageProps {
  initialOccasion?: string;
  onSelectProduct: (id: string) => void;
  onCustomOrder: () => void;
}

export const OccasionPage: React.FC<OccasionPageProps> = ({
  initialOccasion = 'Birthdays',
  onSelectProduct,
  onCustomOrder,
}) => {
  const [selectedOccasionName, setSelectedOccasionName] = useState<string>(initialOccasion);

  const currentOccasion =
    OCCASIONS.find((o) => o.name.toLowerCase() === selectedOccasionName.toLowerCase()) ||
    OCCASIONS[0];

  const matchingProducts = PRODUCTS.filter((p) =>
    p.occasions.some((o) => o.toLowerCase() === currentOccasion.name.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Occasion Navigation Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              onClick={() => setSelectedOccasionName(occ.name)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                currentOccasion.name === occ.name
                  ? 'bg-[#145C45] text-white shadow-md'
                  : 'bg-white text-[#77716F] hover:bg-[#F7E6EB] hover:text-[#145C45] border border-gray-200'
              }`}
            >
              {occ.name}
            </button>
          ))}
        </div>

        {/* Occasion Editorial Hero Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#F7E6EB] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentOccasion.badge} Occasion</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-[#292626] font-normal">
                {currentOccasion.name} Keepsakes
              </h1>

              <p className="text-base font-serif italic text-[#145C45]">
                “{currentOccasion.tagline}”
              </p>

              <p className="text-xs sm:text-sm text-[#77716F] leading-relaxed max-w-xl">
                {currentOccasion.description}
              </p>

              <div className="pt-2 bg-[#FCFAF9] p-3.5 rounded-2xl border border-gray-100 text-xs text-[#292626]">
                <strong className="text-[#145C45] block font-semibold">
                  Artisan Recommendation:
                </strong>
                <span>{currentOccasion.giftIdeaHighlight}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onCustomOrder}
                  className="px-6 py-3 rounded-full bg-[#145C45] text-white font-semibold text-xs hover:bg-[#0F4534] transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <Gift className="w-4 h-4 text-emerald-200" />
                  <span>Start Bespoke {currentOccasion.name} Order</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-96 relative overflow-hidden">
              <img
                src={currentOccasion.image}
                alt={currentOccasion.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

          </div>
        </div>

        {/* Curated Products for this occasion */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F7E6EB] pb-3">
            <h2 className="font-serif text-2xl font-medium text-[#292626]">
              Handmade for {currentOccasion.name} ({matchingProducts.length})
            </h2>
            <span className="text-xs text-[#77716F]">
              Customizable with your dates & photos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchingProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
