import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ValueProps } from '../components/home/ValueProps';
import { OccasionGrid } from '../components/home/OccasionGrid';
import { CustomOrderBanner } from '../components/home/CustomOrderBanner';
import { FeaturedGifts } from '../components/home/FeaturedGifts';
import { CraftProcess } from '../components/home/CraftProcess';
import { AiGiftFinderCta } from '../components/home/AiGiftFinderCta';
import { HomeReviews } from '../components/home/HomeReviews';
import { InstagramShowcase } from '../components/home/InstagramShowcase';
import { Newsletter } from '../components/home/Newsletter';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (tab: string, param?: any) => void;
  onSelectProduct: (id: string) => void;
  onQuickView?: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onQuickView,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection
        onExplore={() => onNavigate('shop')}
        onAiFinder={() => onNavigate('ai-finder')}
        onCustomOrder={() => onNavigate('custom-order')}
      />

      {/* 2. Value Props 5-Item Strip */}
      <ValueProps />

      {/* 3. Shop by Occasion */}
      <OccasionGrid
        onSelectOccasion={(occName) => onNavigate('occasions', occName)}
      />

      {/* 4. Curated Featured Gifts Grid */}
      <FeaturedGifts
        onSelectProduct={onSelectProduct}
        onViewAll={() => onNavigate('shop')}
        onQuickView={onQuickView}
      />

      {/* 5. "Create Something Truly Yours" Emerald Custom Order Banner */}
      <CustomOrderBanner
        onStartCustomOrder={() => onNavigate('custom-order')}
      />

      {/* 6. Handcraft Process Timeline */}
      <CraftProcess />

      {/* 7. Conversational AI Gift Finder Banner */}
      <AiGiftFinderCta
        onOpenFinder={(prompt) => onNavigate('ai-finder', prompt)}
      />

      {/* 8. Verified Customer Reviews */}
      <HomeReviews
        onViewAllReviews={() => onNavigate('reviews')}
      />

      {/* 9. Instagram Showcase */}
      <InstagramShowcase />

      {/* 10. Warm Newsletter Section */}
      <Newsletter />
    </div>
  );
};
