import React from 'react';
import { Star, CheckCircle, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';
import { MotionReveal } from '../common/MotionReveal';

interface HomeReviewsProps {
  onViewAllReviews: () => void;
}

export const HomeReviews: React.FC<HomeReviewsProps> = ({ onViewAllReviews }) => {
  const featuredReviews = REVIEWS.filter((r) => r.featured).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <MotionReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#145C45] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Stories, Real Happiness ♡</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292626]">
              What Our Customers Say
            </h2>
            <p className="text-sm text-[#77716F]">
              Over 1,200 smiles created across India. Read genuine experiences from our community.
            </p>
          </div>

          <button
            onClick={onViewAllReviews}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145C45] hover:underline self-start md:self-auto cursor-pointer"
          >
            <span>Read all customer stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </MotionReveal>

        {/* 3 Review Cards with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredReviews.map((rev, idx) => (
            <MotionReveal
              key={rev.id}
              direction="up"
              delay={idx * 100}
              className="bg-[#FCFAF9] rounded-2xl p-6 border border-[#F7E6EB] hover:border-[#E8B5C3] card-luxury transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Customer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-11 h-11 rounded-full object-cover border border-[#E8B5C3]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#292626] flex items-center gap-1">
                        {rev.customerName}
                        <CheckCircle className="w-3.5 h-3.5 text-[#145C45] fill-emerald-100" />
                      </h4>
                      <span className="text-[11px] text-[#77716F]">
                        {rev.city} • {rev.occasion}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#77716F]">{rev.date}</span>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-semibold text-[#292626] ml-1">5.0</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#292626] italic leading-relaxed">
                  "{rev.reviewText}"
                </p>

                {/* Unboxing photo if available */}
                {rev.giftPhoto && (
                  <div className="rounded-xl overflow-hidden border border-[#F7E6EB] mt-3">
                    <img
                      src={rev.giftPhoto}
                      alt={`Gift photo from ${rev.customerName}`}
                      className="w-full h-36 object-cover object-center img-zoom"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F7E6EB] flex items-center justify-between text-xs text-[#77716F]">
                <span>Ordered: <strong className="text-[#145C45]">{rev.productTitle}</strong></span>
                <span className="text-[10px] text-[#145C45] bg-[#F7E6EB] px-2 py-0.5 rounded-full font-medium">Verified Gift</span>
              </div>
            </MotionReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
