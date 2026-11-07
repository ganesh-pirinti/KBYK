import React from 'react';
import { Product, ProductAddOn } from '../../types';
import { Sparkles, Heart, Upload, Image as ImageIcon, Check, Info } from 'lucide-react';

interface LiveCustomizerPreviewProps {
  product: Product;
  selectedTheme?: string;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
  personalisedName?: string;
  giftMessage?: string;
  selectedAddOns: ProductAddOn[];
  uploadedImageUrl?: string;
}

export const LiveCustomizerPreview: React.FC<LiveCustomizerPreviewProps> = ({
  product,
  selectedTheme,
  selectedSize,
  selectedColor,
  personalisedName,
  giftMessage,
  selectedAddOns,
  uploadedImageUrl,
}) => {
  return (
    <div className="bg-[#FCFAF9] rounded-2xl p-4 sm:p-6 border border-[#F7E6EB] space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#145C45] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#145C45]" />
          <span>Live Personalisation Studio Preview</span>
        </div>
        <span className="text-[10px] text-[#77716F] bg-white px-2 py-0.5 rounded-full border border-gray-200">
          Interactive Mockup
        </span>
      </div>

      {/* Simulated physical product mockup canvas */}
      <div 
        className="relative rounded-2xl p-6 sm:p-8 min-h-[260px] sm:min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner border-2 border-dashed border-[#E8B5C3] transition-all duration-300"
        style={{
          backgroundColor: selectedColor ? selectedColor.hex : '#F7E6EB',
        }}
      >
        {/* Subtle decorative watermark */}
        <div className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest opacity-40 text-[#292626]">
          KBYK • Handmade Studio
        </div>

        {/* Top: Selected Theme & Size Badge */}
        <div className="flex items-center gap-2">
          {selectedTheme && (
            <span className="bg-white/80 backdrop-blur-xs text-[#292626] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
              Theme: {selectedTheme}
            </span>
          )}
          {selectedSize && (
            <span className="bg-white/80 backdrop-blur-xs text-[#292626] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
              {selectedSize}
            </span>
          )}
        </div>

        {/* Center: Live Personalised Engraved / Lettered Title */}
        <div className="my-auto py-6 text-center space-y-2">
          <div className="inline-block p-4 bg-white/85 backdrop-blur-md rounded-2xl shadow-md border border-white/40 max-w-sm mx-auto">
            <span className="text-[10px] uppercase tracking-widest text-[#145C45] font-semibold block mb-1">
              Custom Inscription Preview
            </span>
            <p className="font-serif text-xl sm:text-2xl text-[#292626] font-semibold tracking-wide italic">
              {personalisedName ? (
                `“${personalisedName}”`
              ) : (
                <span className="text-gray-400 font-normal not-italic text-base">
                  Type your custom name / title above...
                </span>
              )}
            </p>

            {giftMessage && (
              <p className="text-xs text-[#77716F] mt-2 italic border-t border-gray-100 pt-2 line-clamp-2">
                Note: "{giftMessage}"
              </p>
            )}
          </div>
        </div>

        {/* Bottom: Uploaded photo preview & selected add-on pills */}
        <div className="flex flex-wrap items-end justify-between gap-2 pt-2 border-t border-black/5">
          <div className="flex items-center gap-2">
            {uploadedImageUrl ? (
              <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl shadow-2xs">
                <img
                  src={uploadedImageUrl}
                  alt="Customer Reference"
                  className="w-10 h-10 rounded-lg object-cover border border-[#E8B5C3]"
                />
                <div className="text-[10px] text-left pr-2">
                  <span className="font-bold text-[#145C45] block">Photo Attached</span>
                  <span className="text-gray-500">Will be printed for you</span>
                </div>
              </div>
            ) : (
              <span className="text-[11px] text-[#77716F] bg-white/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-[#145C45]" />
                No reference photo attached yet
              </span>
            )}
          </div>

          {/* Add-ons active chips */}
          <div className="flex flex-wrap gap-1 justify-end max-w-xs">
            {selectedAddOns.map((addon) => (
              <span
                key={addon.id}
                className="bg-[#145C45] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5" />
                {addon.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer as requested in specification */}
      <div className="flex items-start gap-2 text-xs text-[#77716F] bg-white p-3 rounded-xl border border-gray-100">
        <Info className="w-4 h-4 text-[#145C45] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-tight">
          <strong className="text-[#292626]">Illustrative Digital Preview:</strong> Your actual keepsake will be handcrafted by our artisan using real 300 GSM textured papers, preserved botanical blooms, authentic metallic wax seals, and hand-bound ribbons.
        </p>
      </div>

    </div>
  );
};
