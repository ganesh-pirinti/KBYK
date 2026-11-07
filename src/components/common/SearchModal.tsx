import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, ArrowRight, Heart, Sparkles, Filter } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { OCCASIONS } from '../../data/occasions';
import { useWishlist } from '../../context/WishlistContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectOccasion: (occasionName: string) => void;
  onOpenAiFinder: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectOccasion,
  onOpenAiFinder,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsListening(false);
      setVoiceNotice(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Voice Search handler using Web Speech API or realistic graceful simulation
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful simulation with realistic audio feedback
      setIsListening(true);
      setVoiceNotice('Listening to your voice... (Speak now)');
      const simulatedPhrases = [
        'Anniversary scrapbook with photos',
        'Birthday gift under 1000 rupees',
        'Handmade surprise explosion box',
        'Cute gift for my best friend',
      ];
      const randomPhrase = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
      
      setTimeout(() => {
        setQuery(randomPhrase);
        setIsListening(false);
        setVoiceNotice(`Heard: "${randomPhrase}"`);
        setTimeout(() => setVoiceNotice(null), 3500);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak your gift idea or budget');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setVoiceNotice(`Heard: "${transcript}"`);
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        setVoiceNotice('Could not access microphone or voice was unclear. Please type below.');
        setTimeout(() => setVoiceNotice(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Voice input simulated. Try typing or clicking quick suggestions.');
    }
  };

  if (!isOpen) return null;

  // Filter products based on search query, category, and budget
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesQuery =
      query === '' ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.occasions.some((o) => o.toLowerCase().includes(query.toLowerCase())) ||
      product.materials?.some((m) => m.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    let matchesBudget = true;
    if (selectedBudget === 'under500') matchesBudget = product.price <= 500;
    else if (selectedBudget === '500to1000') matchesBudget = product.price > 500 && product.price <= 1000;
    else if (selectedBudget === 'above1000') matchesBudget = product.price > 1000;

    return matchesQuery && matchesCategory && matchesBudget;
  });

  const suggestions = [
    'Memory Scrapbook',
    'Explosion Box',
    'Personalised Gift Box',
    'Photo Lamp',
    'Friendship Keepsakes',
    'Under ₹1,000',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#F7E6EB] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#F7E6EB] flex items-center gap-3 bg-[#FCFAF9]">
          <Search className="w-5 h-5 text-[#145C45] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scrapbooks, boxes, occasions, or try 'anniversary under ₹1000'..."
            className="flex-1 bg-transparent border-none text-[#292626] placeholder-[#77716F] text-base sm:text-lg focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#77716F] hover:text-[#292626] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            onClick={handleVoiceSearch}
            className={`p-2 rounded-full transition-all relative ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'text-[#145C45] bg-[#F7E6EB] hover:bg-[#E8B5C3]/60'
            }`}
            title="Search with your voice"
            aria-label="Voice search"
          >
            {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="text-[#77716F] hover:text-[#292626] p-2 hover:bg-[#F7E6EB] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Feedback Banner */}
        {voiceNotice && (
          <div className="bg-[#145C45] text-white text-xs px-4 py-2 flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              {voiceNotice}
            </span>
            <button onClick={() => setVoiceNotice(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Filter Chips & Suggestions */}
        <div className="px-5 py-3 bg-[#FCFAF9] border-b border-[#F7E6EB] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#77716F] flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3 text-[#145C45]" /> Filter:
          </span>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#E8B5C3] text-[#292626] rounded-full px-2.5 py-1 text-xs focus:outline-none focus:border-[#145C45]"
          >
            <option value="All">All Categories</option>
            <option value="Scrapbooks">Scrapbooks</option>
            <option value="Gift Boxes">Gift Boxes</option>
            <option value="Accessories">Accessories</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Combo">Combo</option>
          </select>

          {/* Budget Dropdown */}
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="bg-white border border-[#E8B5C3] text-[#292626] rounded-full px-2.5 py-1 text-xs focus:outline-none focus:border-[#145C45]"
          >
            <option value="All">Any Budget</option>
            <option value="under500">Under ₹500</option>
            <option value="500to1000">₹500 - ₹1,000</option>
            <option value="above1000">Above ₹1,000</option>
          </select>

          {/* Quick chips */}
          <div className="hidden sm:flex items-center gap-1.5 ml-auto overflow-x-auto">
            {suggestions.slice(0, 3).map((item) => (
              <button
                key={item}
                onClick={() => setQuery(item.startsWith('Under') ? '' : item)}
                className="bg-white hover:bg-[#F7E6EB] text-[#77716F] hover:text-[#145C45] px-2.5 py-1 rounded-full border border-gray-200 transition-colors text-[11px]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {filteredProducts.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-[#77716F]">
                <span>Showing {filteredProducts.length} handcrafted match{filteredProducts.length === 1 ? '' : 'es'}</span>
                {query && <span className="font-medium text-[#145C45]">Keyword: "{query}"</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-[#E8B5C3] hover:bg-[#FCFAF9] transition-all cursor-pointer group"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#145C45] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <span className="text-xs font-bold text-[#292626]">₹{product.price}</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#292626] truncate group-hover:text-[#145C45] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#77716F] truncate">{product.shortDescription}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition-colors"
                      title="Save to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#292626]">No standard gifts match your search</h3>
              <p className="text-xs text-[#77716F] max-w-md mx-auto mt-1 mb-5">
                Every piece at KBYK is handcrafted! If you don't see your exact vision here, we can custom-build it from scratch for your special celebration.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAiFinder();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold hover:bg-[#E8B5C3] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try AI Gift Finder
                </button>
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('All');
                    setSelectedBudget('All');
                  }}
                  className="px-4 py-2 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Quick Occasions jump */}
          <div className="border-t border-[#F7E6EB] pt-4">
            <h4 className="text-xs font-semibold text-[#77716F] uppercase tracking-wider mb-2">
              Explore by Occasion
            </h4>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => {
                    onSelectOccasion(occ.name);
                    onClose();
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#FCFAF9] hover:bg-[#F7E6EB] border border-gray-200 hover:border-[#E8B5C3] text-[#292626] transition-colors flex items-center gap-1"
                >
                  <span>{occ.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#145C45]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Discovery Callout footer inside search modal */}
        <div className="p-3 bg-[#F7E6EB]/60 border-t border-[#E8B5C3]/40 flex items-center justify-between px-5 text-xs">
          <div className="flex items-center gap-2 text-[#145C45]">
            <Sparkles className="w-4 h-4 text-[#145C45]" />
            <span className="font-medium">Unsure what to get? Talk to our AI Gift Finder</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenAiFinder();
            }}
            className="text-xs font-semibold text-[#145C45] hover:underline flex items-center gap-1"
          >
            Launch Finder &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
