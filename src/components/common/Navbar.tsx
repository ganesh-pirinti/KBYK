import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  ShieldCheck, 
  Lock,
  User,
} from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { CustomerAuthModal } from '../customer/CustomerAuthModal';
import { useLanguage } from '../../context/LanguageContext';
import { OCCASIONS } from '../../data/occasions';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch }) => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { customer, isLoggedIn } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [occasionsDropdown, setOccasionsDropdown] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home', 'Home') },
    { id: 'shop', label: t('shop', 'Shop') },
    { 
      id: 'occasions', 
      label: t('occasions', 'Occasions'), 
      hasDropdown: true 
    },
    { id: 'bouquet-builder', label: t('bouquet_builder', 'Flower Bar') },
    { id: 'voice-gift', label: t('voice_gifts', 'QR Voice') },
    { id: 'custom-order', label: t('custom_gifts', 'Custom Order') },
    { id: 'ai-finder', label: 'AI Gift Finder', isSpecial: true },
    { id: 'about', label: t('our_story', 'Our Story') },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F7E6EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F7E6EB] flex items-center justify-center text-[#145C45] font-serif font-bold text-xl group-hover:scale-105 transition-transform shadow-xs">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-2xl font-bold text-[#145C45] uppercase flex items-center gap-1">
                KBYK
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E8B5C3]"></span>
              </span>
              <span className="text-[10px] tracking-wider text-[#77716F] uppercase font-medium -mt-1 hidden sm:block">
                For moments that deserve to last
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={() => setOccasionsDropdown(true)}
                    onMouseLeave={() => setOccasionsDropdown(false)}
                  >
                    <button
                      onClick={() => onNavigate('occasions')}
                      className={`px-3 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1 ${
                        currentTab === 'occasions'
                          ? 'text-[#145C45] font-semibold bg-[#F7E6EB]'
                          : 'text-[#292626] hover:text-[#145C45] hover:bg-[#FCFAF9]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${occasionsDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Occasions Dropdown Menu */}
                    {occasionsDropdown && (
                      <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-[#F7E6EB] py-2 mt-1 z-50 animate-fade-in">
                        <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#77716F] tracking-wider border-b border-gray-100">
                          Handcrafted For Every Moment
                        </div>
                        {OCCASIONS.map((occ) => (
                          <button
                            key={occ.id}
                            onClick={() => {
                              onNavigate('occasions', occ.name);
                              setOccasionsDropdown(false);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs text-[#292626] hover:bg-[#F7E6EB] hover:text-[#145C45] transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium">{occ.name}</span>
                            <span className="text-[10px] text-[#77716F] bg-gray-50 px-1.5 py-0.5 rounded">
                              {occ.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1 ${
                    currentTab === item.id
                      ? 'text-[#145C45] font-semibold bg-[#F7E6EB]'
                      : 'text-[#292626] hover:text-[#145C45] hover:bg-[#FCFAF9]'
                  } ${item.isSpecial ? 'bg-gradient-to-r from-[#F7E6EB] to-[#FCFAF9] text-[#145C45] border border-[#E8B5C3]/60' : ''}`}
                >
                  {item.isSpecial && <Sparkles className="w-3.5 h-3.5 text-[#145C45] animate-spin-slow" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#292626] hover:text-[#145C45] hover:bg-[#F7E6EB] rounded-full transition-colors"
              title="Search gifts (voice or text)"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Heart Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className={`p-2 rounded-full transition-colors relative ${
                currentTab === 'wishlist'
                  ? 'text-red-500 bg-[#F7E6EB]'
                  : 'text-[#292626] hover:text-red-500 hover:bg-[#F7E6EB]'
              }`}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#E8B5C3] text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart / Enquiry Bag Icon */}
            <button
              onClick={() => onNavigate('cart')}
              className={`p-2 rounded-full transition-colors relative ${
                currentTab === 'cart'
                  ? 'text-[#145C45] bg-[#F7E6EB]'
                  : 'text-[#292626] hover:text-[#145C45] hover:bg-[#F7E6EB]'
              }`}
              title="View Enquiry Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#145C45] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Patron Account Button */}
            <button
              onClick={() => {
                if (isLoggedIn) {
                  onNavigate('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className={`p-2 rounded-full transition-colors relative ${
                currentTab === 'account'
                  ? 'text-[#145C45] bg-[#F7E6EB]'
                  : 'text-[#292626] hover:text-[#145C45] hover:bg-[#F7E6EB]'
              }`}
              title={isLoggedIn ? `Patron Account: ${customer?.name}` : "Sign In / Patron Account"}
              aria-label="Account"
            >
              {isLoggedIn ? (
                <div className="w-5 h-5 rounded-full bg-[#145C45] text-white text-[10px] font-bold flex items-center justify-center">
                  {customer?.name.charAt(0) || 'U'}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Contact Button (Emerald Green Pill matching reference) */}
            <button
              onClick={() => onNavigate('contact')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-all shadow-xs hover:shadow-md"
            >
              Contact
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#292626] hover:text-[#145C45] hover:bg-[#F7E6EB] rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Reference 16 - MOBILE MENU) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white border-b border-[#F7E6EB] shadow-2xl p-6 z-50 animate-fade-in max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626]"
            >
              Home
            </button>

            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626]"
            >
              Shop All Gifts
            </button>

            <button
              onClick={() => {
                onNavigate('occasions');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626]"
            >
              Occasions
            </button>

            <button
              onClick={() => {
                onNavigate('custom-order');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626] flex items-center justify-between"
            >
              <span>Custom Order</span>
              <span className="text-[10px] bg-[#E8B5C3] text-[#292626] px-2 py-0.5 rounded-full font-bold">
                Bespoke
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate('ai-finder');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium bg-[#F7E6EB] text-[#145C45] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#145C45]" />
              <span className="font-semibold">AI Gift Finder</span>
            </button>

            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626]"
            >
              About KBYK
            </button>

            <button
              onClick={() => {
                onNavigate('reviews');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626]"
            >
              Reviews ({OCCASIONS.length}+)
            </button>

            <button
              onClick={() => {
                onNavigate('faq');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#292626]"
            >
              Frequently Asked Questions
            </button>

            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-[#F7E6EB] text-[#145C45] font-semibold"
            >
              Contact & WhatsApp
            </button>

            <button
              onClick={() => {
                if (isLoggedIn) {
                  onNavigate('account');
                } else {
                  setIsAuthModalOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-xl text-sm font-medium bg-[#F7E6EB] text-[#145C45] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{isLoggedIn ? `My Account (${customer?.name})` : 'Sign In / My Account'}</span>
              </span>
              {isLoggedIn && (
                <span className="text-[10px] font-bold bg-[#145C45] text-white px-2 py-0.5 rounded-full">
                  {customer?.loyaltyPoints} Pts
                </span>
              )}
            </button>

            <div className="pt-4 border-t border-[#F7E6EB] flex items-center justify-between">
              <span className="text-[11px] text-[#77716F]">Handmade Atelier in India</span>

              <a
                href="https://www.instagram.com/_.kbyk._/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#145C45] flex items-center gap-1 hover:underline font-medium"
              >
                <InstagramIcon className="w-4 h-4" />
                @_.kbyk._
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Customer Login & Registration Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => onNavigate('account')}
      />
    </header>
  );
};
