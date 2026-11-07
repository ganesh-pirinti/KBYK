import React, { useState } from 'react';
import { Sparkles, X, Heart, Globe } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const { cmsSettings } = useAdmin();
  const { language, setLanguage, t } = useLanguage();

  if (!visible) return null;

  return (
    <div className="bg-[#F7E6EB] text-[#292626] text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative border-b border-[#E8B5C3]/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-1.5 text-[#145C45] font-medium text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#145C45]" />
          <span>Handcrafted in India</span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#145C45] animate-pulse"></span>
          <span>{language === 'en' ? (cmsSettings.announcementText || t('announcement')) : t('announcement')}</span>
          <span className="text-[#77716F] hidden sm:inline">•</span>
          <a
            href="https://www.instagram.com/_.kbyk._/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[#145C45] underline underline-offset-2 hover:text-[#0F4534] transition-colors font-semibold"
          >
            DM @_.kbyk._
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 text-[11px] bg-white/70 px-2 py-0.5 rounded-full border border-[#E8B5C3]">
            <Globe className="w-3 h-3 text-[#145C45]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-[#292626] font-medium focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-[#77716F]">
            <Heart className="w-3 h-3 text-[#E8B5C3] fill-[#E8B5C3]" />
            100% Personalised Keepsakes
          </span>
          <button
            onClick={() => setVisible(false)}
            className="text-[#77716F] hover:text-[#292626] p-0.5 rounded transition-colors"
            aria-label="Close banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
