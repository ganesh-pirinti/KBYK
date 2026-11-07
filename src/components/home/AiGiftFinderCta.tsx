import React from 'react';
import { Sparkles, Mic, ArrowRight, MessageCircleHeart } from 'lucide-react';

interface AiGiftFinderCtaProps {
  onOpenFinder: (initialPrompt?: string) => void;
}

export const AiGiftFinderCta: React.FC<AiGiftFinderCtaProps> = ({ onOpenFinder }) => {
  const suggestions = [
    'Find a birthday gift for my best friend under ₹1,000',
    'Romantic 1st anniversary keepsake with photo polaroids',
    'Aesthetic cute desk decor gift for my sister',
    'Surprise proposal explosion box in emerald green',
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-r from-[#F7E6EB]/50 via-white to-[#F7E6EB]/50 border-y border-[#E8B5C3]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8B5C3] shadow-xl relative overflow-hidden">
          
          {/* Subtle background sparkle glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#F7E6EB] blur-2xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left description */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#145C45] text-white text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Conversational Gift Discovery</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#292626] font-normal">
                Can't decide? Let our AI Gift Finder match your moments.
              </h2>

              <p className="text-sm text-[#77716F] max-w-xl mx-auto lg:mx-0">
                Type or speak your recipient's personality, occasion, and budget. Our smart curator extracts your exact preferences and recommends personalized gifts with meaningful explanations.
              </p>

              {/* Suggested prompt chips */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-[#145C45] uppercase tracking-wider block">
                  Click a prompt to try:
                </span>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {suggestions.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => onOpenFinder(prompt)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#FCFAF9] hover:bg-[#F7E6EB] border border-[#E8B5C3] text-[#292626] hover:text-[#145C45] transition-colors text-left flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#145C45]" />
                      <span>"{prompt}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => onOpenFinder()}
                  className="px-8 py-3.5 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 group"
                >
                  <MessageCircleHeart className="w-4 h-4 text-emerald-200" />
                  <span>Launch AI Gift Finder</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenFinder()}
                  className="px-5 py-3.5 rounded-full bg-[#F7E6EB] text-[#145C45] font-semibold text-sm hover:bg-[#E8B5C3] transition-colors flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Try Voice Input</span>
                </button>
              </div>

            </div>

            {/* Right preview mock chat bubble */}
            <div className="lg:col-span-5">
              <div className="bg-[#FCFAF9] rounded-2xl p-5 border border-[#F7E6EB] shadow-md space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#145C45] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    AI
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-2xs border border-gray-100 text-xs text-[#292626] space-y-1">
                    <p className="font-medium text-[#145C45]">KBYK Intelligent Curator</p>
                    <p>“Who are you looking to surprise today, and what is your desired budget?”</p>
                  </div>
                </div>

                <div className="flex items-start justify-end gap-2.5">
                  <div className="bg-[#F7E6EB] rounded-2xl rounded-tr-none p-3 shadow-2xs border border-[#E8B5C3] text-xs text-[#292626] max-w-[80%]">
                    <p>“Birthday gift for my best friend under ₹1,000. Something personal, aesthetic and memorable.”</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#145C45] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    AI
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-2xs border border-gray-100 text-xs text-[#292626] space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-[#F7E6EB] text-[#145C45] text-[10px] px-2 py-0.5 rounded font-semibold">Occasion: Birthday</span>
                      <span className="bg-[#F7E6EB] text-[#145C45] text-[10px] px-2 py-0.5 rounded font-semibold">Budget: &lt; ₹1,000</span>
                      <span className="bg-[#F7E6EB] text-[#145C45] text-[10px] px-2 py-0.5 rounded font-semibold">Vibe: Aesthetic</span>
                    </div>
                    <p className="text-[#77716F]">
                      Extracted preferences! I recommend the <strong>Memory Scrapbook (₹899)</strong> or <strong>Custom Polaroid Keychain (₹399)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
