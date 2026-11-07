import React from 'react';
import { Sparkles, ArrowRight, Heart, Gift, ShieldCheck, Star } from 'lucide-react';
import { MotionReveal } from '../common/MotionReveal';

interface HeroSectionProps {
  onExplore: () => void;
  onAiFinder: () => void;
  onCustomOrder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onAiFinder,
  onCustomOrder,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-[#FCFAF9] to-[#F7E6EB]/30">
      
      {/* Delicate botanical background glow with subtle pulse */}
      <div className="absolute top-10 right-0 -mr-20 w-96 h-96 rounded-full bg-[#F7E6EB]/60 blur-3xl pointer-events-none -z-0 animate-pulse-soft"></div>
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-[#E8B5C3]/20 blur-3xl pointer-events-none -z-0 animate-pulse-soft"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge matching reference 01 */}
            <MotionReveal direction="down" delay={50}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7E6EB] border border-[#E8B5C3]/60 text-[#145C45] text-xs font-semibold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#145C45]" />
                <span>Handmade • Personalised • With Love</span>
              </div>
            </MotionReveal>

            {/* Editorial Heading in Cormorant Garamond */}
            <MotionReveal direction="up" delay={120}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292626] font-normal tracking-tight leading-[1.12]">
                Gifts that feel like they were made{' '}
                <span className="italic font-medium text-[#145C45] block mt-1">
                  just for them.
                </span>
              </h1>
            </MotionReveal>

            {/* Subtitle with brand tagline */}
            <MotionReveal direction="up" delay={200}>
              <p className="text-base sm:text-lg text-[#77716F] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                <span className="font-medium text-[#292626]">“For moments that deserve to last.”</span>{' '}
                Bespoke memory scrapbooks, interactive explosion boxes, and curated celebration hampers — thoughtfully handcrafted in our studio to preserve your most treasured memories.
              </p>
            </MotionReveal>

            {/* Two Clear Primary CTAs */}
            <MotionReveal direction="up" delay={280}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                
                {/* Primary Action Button (Explore Gifts) */}
                <button
                  onClick={onExplore}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-sm sm:text-base hover:bg-[#dfa3b4] transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Gifts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* AI Gift Finder CTA */}
                <button
                  onClick={onAiFinder}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#145C45] text-white font-semibold text-sm sm:text-base hover:bg-[#0F4534] transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Find My Perfect Gift</span>
                </button>
              </div>
            </MotionReveal>

            {/* Social Proof & Metrics Strip */}
            <MotionReveal direction="up" delay={360}>
              <div className="pt-6 border-t border-[#F7E6EB] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#77716F]">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    <span className="w-6 h-6 rounded-full bg-[#F7E6EB] flex items-center justify-center text-[10px] font-bold text-[#145C45] ring-2 ring-white">P</span>
                    <span className="w-6 h-6 rounded-full bg-[#E8B5C3] flex items-center justify-center text-[10px] font-bold text-[#292626] ring-2 ring-white">N</span>
                    <span className="w-6 h-6 rounded-full bg-[#145C45] flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">A</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#292626] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0</span>
                  </div>
                  <span>(1,200+ Happy Givers)</span>
                </div>

                <div className="flex items-center gap-1 text-[#145C45] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#145C45]" />
                  <span>100% Photo Privacy Guaranteed</span>
                </div>
              </div>
            </MotionReveal>

          </div>

          {/* Right Column: Visual Composition matching Reference 01 Hero Collage */}
          <div className="lg:col-span-6 relative">
            <MotionReveal direction="scale" delay={150}>
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Main Centerpiece Image with editorial border and shadow */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group card-luxury">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85"
                    alt="KBYK Handcrafted Memory Scrapbook with Polaroids and Dried Flowers"
                    className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Overlay Text in hero image matching reference */}
                  <div className="absolute bottom-4 left-5 right-5 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-[#E8B5C3] font-semibold block">
                        Featured Creation
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium">
                        The Botanical Memory Scrapbook
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                      From ₹899
                    </span>
                  </div>
                </div>

                {/* Floating Polaroids / Keepsake Tag Left */}
                <div className="hidden sm:block absolute -top-5 -left-6 z-20 bg-white p-2.5 rounded-2xl shadow-xl border border-[#F7E6EB] transform -rotate-3 hover:rotate-0 transition-transform animate-float-gentle">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F7E6EB] flex items-center justify-center text-[#145C45]">
                      <Heart className="w-4 h-4 fill-[#145C45]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#292626] block">Handmade to Order</span>
                      <span className="text-[10px] text-[#77716F]">Tailored with your photos</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge Right matching reference: Pan-India Delivery */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 z-20 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-[#F7E6EB] transform rotate-2 hover:rotate-0 transition-transform animate-float-gentle" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#145C45] flex items-center justify-center text-white font-bold text-xs">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#145C45] block">Ready-to-Gift Luxury Box</span>
                      <span className="text-[11px] text-[#77716F]">Wax sealed & ribbon tied</span>
                    </div>
                  </div>
                </div>

              </div>
            </MotionReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
