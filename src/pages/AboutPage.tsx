import React from 'react';
import { Heart, Sparkles, Scissors, Award, ArrowRight, Check } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';

interface AboutPageProps {
  onExploreGifts: () => void;
  onCustomOrder: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onExploreGifts,
  onCustomOrder,
}) => {
  return (
    <div className="min-h-screen bg-[#FCFAF9] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Story Header matching Reference 06 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#E8B5C3] text-[#145C45]" />
            <span>The Artisan Soul Behind the Brand</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292626] font-normal leading-tight">
            A Little Story Behind KBYK
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#145C45] italic">
            “For moments that deserve to last.”
          </p>

          <p className="text-sm sm:text-base text-[#77716F] leading-relaxed font-light">
            KBYK is a handmade and personalised gifting brand, started with a heartfelt passion for creating meaningful keepsakes. Every piece is crafted with love, care, and attention to detail — for moments that deserve to be cherished for years to come.
          </p>
        </div>

        {/* Centerpiece Image & Card matching Reference 06 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85"
              alt="KBYK Artisan Desk with Dried Flowers, Ribbon, and Keepsakes"
              className="w-full h-80 sm:h-96 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-5 left-6 right-6 text-white text-xs">
              <span className="font-serif text-xl sm:text-2xl font-medium block">
                Small gifts, big happiness ♡
              </span>
              <span className="text-[#E8B5C3] font-light">
                Every ribbon hand-tied, every wax seal hand-pressed.
              </span>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#F7E6EB] shadow-xs">
            <h3 className="font-serif text-2xl font-normal text-[#292626]">
              How it all started
            </h3>
            <p className="text-xs sm:text-sm text-[#77716F] leading-relaxed">
              In a digital world where photos remain trapped on phone screens and messages get lost in chat histories, we wanted to revive the sacred joy of tangible memories.
            </p>
            <p className="text-xs sm:text-sm text-[#77716F] leading-relaxed">
              What began at a small desk crafting a single scrapbook for a best friend's milestone birthday quickly blossomed into a studio serving lovers, friends, and families all across India.
            </p>
            
            <div className="pt-2">
              <a
                href="https://www.instagram.com/_.kbyk._/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#145C45] hover:underline"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow our daily work @_.kbyk._</span>
              </a>
            </div>
          </div>

        </div>

        {/* 3 Pillars matching Reference 06 badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#F7E6EB] text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-[#E8B5C3]" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#292626]">
              Handmade With Love
            </h4>
            <p className="text-xs text-[#77716F]">
              Zero automated assembly lines. Real human hands cut, crease, glue, and stitch every detail.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#F7E6EB] text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-[#145C45]" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#292626]">
              Personalised For You
            </h4>
            <p className="text-xs text-[#77716F]">
              Your choice of photos, personal dates, secret codes, and beloved colors integrated seamlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#F7E6EB] text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-[#145C45]" />
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#292626]">
              Memories That Last
            </h4>
            <p className="text-xs text-[#77716F]">
              Acid-free heavy European papers, non-fading photographic prints, and preserved eternal blooms.
            </p>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-[#145C45] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal">
            Ready to Celebrate Someone Special?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto">
            Let us craft a bespoke gift that captures your bond. Browse our available collection or commission a one-of-a-kind idea.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExploreGifts}
              className="px-7 py-3 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-xs hover:bg-[#F7E6EB] transition-colors"
            >
              Explore Collection
            </button>
            <button
              onClick={onCustomOrder}
              className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/30 transition-colors"
            >
              Start Custom Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
