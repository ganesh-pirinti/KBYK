import React, { useState, useRef } from 'react';
import { Heart, Mail, Phone, Shield, ArrowUp, Lock } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

interface FooterProps {
  onNavigate: (tab: string, param?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const clicksRef = useRef<number[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleBrandTripleClick = () => {
    const now = Date.now();
    // Keep only clicks within the last 2500ms
    clicksRef.current = clicksRef.current.filter((t) => now - t < 2500);
    clicksRef.current.push(now);

    if (clicksRef.current.length >= 3) {
      clicksRef.current = [];
      setIsTriggering(true);
      setTimeout(() => {
        setIsTriggering(false);
        onNavigate('admin');
      }, 400);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#F7E6EB] text-[#292626] relative overflow-hidden">
      {/* Decorative botanical top accent */}
      <div className="h-1 bg-gradient-to-r from-[#E8B5C3] via-[#145C45] to-[#E8B5C3]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Info & Tagline with Hidden Studio Portal Easter Egg */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={handleBrandTripleClick}
              className={`flex items-center gap-3 select-none cursor-default transition-all duration-300 ${
                isTriggering ? 'scale-105 opacity-90' : ''
              }`}
              title=""
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl shadow-xs transition-all duration-300 ${
                isTriggering 
                  ? 'bg-[#145C45] text-white shadow-emerald-500/30' 
                  : 'bg-[#F7E6EB] text-[#145C45]'
              }`}>
                {isTriggering ? <Lock className="w-5 h-5 animate-pulse" /> : 'K'}
              </div>
              <div className="flex flex-col">
                <span className={`font-serif tracking-widest text-2xl font-bold uppercase transition-colors duration-300 ${
                  isTriggering ? 'text-[#145C45] drop-shadow-xs' : 'text-[#145C45]'
                }`}>
                  KBYK
                </span>
                <span className="text-[11px] tracking-wider text-[#77716F] uppercase font-medium">
                  For moments that deserve to last
                </span>
              </div>
            </div>

            <p className="text-sm text-[#77716F] leading-relaxed max-w-sm">
              We are a dedicated handmade gifting studio crafting bespoke memory scrapbooks, explosion boxes, ambient photo frames, and customized hampers. Each creation is handcrafted with love, care, and attention to detail.
            </p>

            {/* Social & Contact Badges */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/_.kbyk._/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F7E6EB] text-[#145C45] hover:bg-[#E8B5C3] flex items-center justify-center transition-colors shadow-xs"
                title="Follow KBYK on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/919820144552?text=Hi%20KBYK!%20I%20would%20like%20to%20enquire%20about%20a%20custom%20gift."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F7E6EB] text-[#145C45] hover:bg-[#E8B5C3] flex items-center justify-center transition-colors shadow-xs"
                title="Chat on WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href="mailto:kbyk.gifts@gmail.com"
                className="w-9 h-9 rounded-full bg-[#F7E6EB] text-[#145C45] hover:bg-[#E8B5C3] flex items-center justify-center transition-colors shadow-xs"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#145C45] tracking-wide">
              Explore Gifts
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#77716F]">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#145C45] hover:underline transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Memory Scrapbooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#145C45] hover:underline transition-colors">
                  3-Layer Explosion Boxes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Wooden Photo Lamps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Charm Bracelets & Keychains
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-finder')} className="hover:text-[#145C45] font-semibold text-[#145C45]">
                  AI Gift Finder ✨
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Occasions */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#145C45] tracking-wide">
              By Occasion
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#77716F]">
              <li>
                <button onClick={() => onNavigate('occasions', 'Birthdays')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Birthday Keepsakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('occasions', 'Anniversaries')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Anniversary Hampers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('occasions', 'Friendship')} className="hover:text-[#145C45] hover:underline transition-colors">
                  BFF & Friendship Boxes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('occasions', 'Festivals')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Festive Celebrations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('occasions', 'Proposals')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Romantic Proposals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-order')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Start a Bespoke Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Studio */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#145C45] tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#77716F]">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#145C45] hover:underline transition-colors">
                  About Our Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Customer Stories & Photos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#145C45] hover:underline transition-colors">
                  Contact Us / DM Team
                </button>
              </li>
            </ul>

            <div className="pt-2 text-xs text-[#77716F]">
              <span className="font-medium text-[#292626] block">Studio Location:</span>
              <span>Based in India • Shipping all across India</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Scroll to Top */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77716F] gap-4">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {new Date().getFullYear()} KBYK. Handcrafted with <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" /> in India. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('faq')} 
              className="hover:text-[#145C45] transition-colors"
            >
              Privacy & Photo Security Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate('faq')} 
              className="hover:text-[#145C45] transition-colors"
            >
              Shipping & Returns
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#FCFAF9] hover:bg-[#F7E6EB] text-[#145C45] transition-colors flex items-center gap-1"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
