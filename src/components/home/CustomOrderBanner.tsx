import React from 'react';
import { Sparkles, ArrowRight, Palette, Camera, Scissors } from 'lucide-react';
import { MotionReveal } from '../common/MotionReveal';

interface CustomOrderBannerProps {
  onStartCustomOrder: () => void;
}

export const CustomOrderBanner: React.FC<CustomOrderBannerProps> = ({ onStartCustomOrder }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal direction="scale" className="relative rounded-3xl bg-[#145C45] text-white overflow-hidden shadow-2xl">
          
          {/* Delicate background decorative gradients & circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#1C7B5D]/40 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#0F4534] blur-2xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E8B5C3] text-xs font-semibold tracking-wide backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Creative Studio</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                Create Something Truly Yours
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                A custom gift, designed with your story. Choose your custom photo layout, preferred color palette, personal handwritten letters, and add-ons. We craft it stitch by stitch, fold by fold.
              </p>

              {/* Steps pills */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left text-xs">
                <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <span className="text-[#E8B5C3] font-bold block">01. Share Idea</span>
                  <span className="text-emerald-200 text-[11px]">Photos & thoughts</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <span className="text-[#E8B5C3] font-bold block">02. We Handcraft</span>
                  <span className="text-emerald-200 text-[11px]">Artisanal detail</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <span className="text-[#E8B5C3] font-bold block">03. Delivered</span>
                  <span className="text-emerald-200 text-[11px]">Ready to wow</span>
                </div>
              </div>

              {/* Start Custom Order Button matching reference */}
              <div className="pt-3">
                <button
                  onClick={onStartCustomOrder}
                  className="px-8 py-3.5 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-sm sm:text-base hover:bg-[#F7E6EB] transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 mx-auto lg:mx-0 group cursor-pointer"
                >
                  <span>Start a Custom Order</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Visual Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Image 1: Explosion Box / Keepsake */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                    alt="Custom Explosion Box with Polaroids"
                    className="w-full h-64 sm:h-72 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                    <span className="font-semibold block text-[#E8B5C3]">100% Personalised</span>
                    <span>Every fold hides a cherished picture</span>
                  </div>
                </div>

                {/* Floating mini badge */}
                <div className="absolute -top-3 -right-3 bg-white text-[#145C45] px-3 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Custom Themes</span>
                </div>

              </div>
            </div>

          </div>

        </MotionReveal>
      </div>
    </section>
  );
};
