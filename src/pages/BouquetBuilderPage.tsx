import React, { useState } from 'react';
import { FlowerStem, BouquetConfiguration, Product } from '../types';
import { useCart } from '../context/CartContext';
import { MotionReveal } from '../components/common/MotionReveal';
import { 
  Sparkles, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Heart, 
  Info, 
  ArrowRight, 
  Gift, 
  Calendar,
  Layers,
  Palette
} from 'lucide-react';

const FLOWER_STOCK: FlowerStem[] = [
  {
    id: 'fl-1',
    name: 'Ecuadorian Red Roses',
    colorName: 'Velvet Crimson',
    colorHex: '#C51E3A',
    pricePerStem: 80,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    fragranceNotes: 'Classic deep romantic floral note',
    isPopular: true
  },
  {
    id: 'fl-2',
    name: 'Vintage Blush Hydrangea',
    colorName: 'Blush Pink',
    colorHex: '#E8B5C3',
    pricePerStem: 150,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=400&q=80',
    fragranceNotes: 'Subtle sweet garden bouquet',
    isPopular: true
  },
  {
    id: 'fl-3',
    name: 'Gypsophila (Baby\'s Breath)',
    colorName: 'Cloud White',
    colorHex: '#F5F5F5',
    pricePerStem: 50,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
    fragranceNotes: 'Airy, delicate volume filler'
  },
  {
    id: 'fl-4',
    name: 'Dried French Lavender',
    colorName: 'Provence Lilac',
    colorHex: '#9B7CB8',
    pricePerStem: 60,
    image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=400&q=80',
    fragranceNotes: 'Calming authentic herbal lavender'
  },
  {
    id: 'fl-5',
    name: 'Silver Dollar Eucalyptus',
    colorName: 'Sage Green',
    colorHex: '#7A9A82',
    pricePerStem: 40,
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=400&q=80',
    fragranceNotes: 'Crisp aromatic forest greens'
  },
  {
    id: 'fl-6',
    name: 'Bunny Tails & Golden Wheat',
    colorName: 'Warm Champagne',
    colorHex: '#D4AF37',
    pricePerStem: 45,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80',
    fragranceNotes: 'Long-lasting bohemian textured dried grass'
  }
];

const WRAPPINGS: BouquetConfiguration['wrapping'][] = [
  'Blush Pink Kraft',
  'Deep Emerald Velvet',
  'Vintage Calligraphy',
  'Frosted White Minimal'
];

const RIBBONS: BouquetConfiguration['ribbonColor'][] = [
  'Emerald Satin',
  'Dusty Rose Silk',
  'Champagne Gold',
  'Burgundy Velvet'
];

const ADD_ONS = [
  { id: 'b-addon-1', name: 'Micro-LED Fairy Lights (Warm Glow)', price: 120 },
  { id: 'b-addon-2', name: 'Artisan Belgian Truffle Trio (3 pcs)', price: 160 },
  { id: 'b-addon-3', name: 'Mini Polaroid Memory Clip (+₹90)', price: 90 }
];

interface BouquetBuilderPageProps {
  onProceedToCart: () => void;
  onExploreGifts: () => void;
}

export const BouquetBuilderPage: React.FC<BouquetBuilderPageProps> = ({
  onProceedToCart,
  onExploreGifts
}) => {
  const { addToCart } = useCart();

  const [bouquetSize, setBouquetSize] = useState<BouquetConfiguration['size']>('Classic (12 Stems)');
  const [selectedStems, setSelectedStems] = useState<Record<string, number>>({
    'fl-1': 4,
    'fl-2': 2,
    'fl-3': 3,
    'fl-5': 3
  });
  const [selectedWrapping, setSelectedWrapping] = useState<BouquetConfiguration['wrapping']>('Blush Pink Kraft');
  const [selectedRibbon, setSelectedRibbon] = useState<BouquetConfiguration['ribbonColor']>('Emerald Satin');
  const [cardMessage, setCardMessage] = useState('Happy Birthday to my favorite person in the world! May your day be as radiant as these blooms. With all my love.');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['b-addon-1']);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Maximum stems based on selected size
  const maxStems = bouquetSize === 'Petite (6 Stems)' ? 6 : bouquetSize === 'Classic (12 Stems)' ? 12 : 24;
  const currentTotalStems = Object.values(selectedStems).reduce((a, b) => a + b, 0);

  // Calculate dynamic price
  const basePriceBySize = bouquetSize === 'Petite (6 Stems)' ? 399 : bouquetSize === 'Classic (12 Stems)' ? 699 : 1199;
  const flowersPrice = Object.entries(selectedStems).reduce((acc, [fId, qty]) => {
    const flower = FLOWER_STOCK.find((f) => f.id === fId);
    return acc + (flower ? flower.pricePerStem * qty : 0);
  }, 0);
  const addOnsPrice = selectedAddOnIds.reduce((acc, aId) => {
    const addon = ADD_ONS.find((a) => a.id === aId);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const totalPrice = basePriceBySize + flowersPrice + addOnsPrice;

  const handleStemChange = (flowerId: string, delta: number) => {
    const current = selectedStems[flowerId] || 0;
    const next = Math.max(0, current + delta);
    if (delta > 0 && currentTotalStems >= maxStems) return; // capacity reached

    setSelectedStems((prev) => ({
      ...prev,
      [flowerId]: next
    }));
  };

  const handleToggleAddon = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    const bouquetProduct: Product = {
      id: `custom-bouquet-${Date.now()}`,
      name: `Bespoke Hand-Tied Bouquet (${bouquetSize})`,
      slug: 'custom-handcrafted-bouquet',
      category: 'Handmade Keepsakes',
      price: totalPrice,
      rating: 5.0,
      reviewCount: 38,
      leadTimeDays: 2,
      images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'],
      thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
      shortDescription: `Hand-tied with ${currentTotalStems} stems, wrapped in ${selectedWrapping} with ${selectedRibbon}.`,
      description: `Bespoke artisanal floral arrangement hand-tied in our studio. Includes personalised note card: "${cardMessage}".`,
      occasions: ['Birthdays', 'Anniversaries', 'Just Because'],
      materials: ['Fresh & Dried Florals', 'Luxury Matte Wrapping', 'Satin Ribbon', 'Conditioning Gel Base'],
      includes: ['Hydration stem wrap', 'Care card', 'Custom calligraphy greeting card'],
      inStock: true
    };

    addToCart(bouquetProduct, {
      selectedSize: bouquetSize,
      selectedTheme: selectedWrapping,
      selectedColor: selectedRibbon,
      personalisedName: 'Custom Bouquet Commission',
      giftMessage: cardMessage,
      selectedAddOns: selectedAddOnIds.map((id) => {
        const item = ADD_ONS.find((a) => a.id === id)!;
        return { id: item.id, name: item.name, price: item.price };
      })
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onProceedToCart();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14 text-[#292626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <MotionReveal variant="fade-up">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider block">
              The Artisan Flower Bar
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#292626]">
              Design Your Bespoke Bouquet
            </h1>
            <p className="text-xs sm:text-sm text-[#77716F]">
              Hand-select individual stems, artisan wrapping papers, and silk ribbons. Our florists hand-tie each arrangement fresh to order.
            </p>
          </div>
        </MotionReveal>

        {/* Builder Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Visual Bouquet Preview & Configuration Summary */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-lg space-y-6">
              
              {/* Visual Bouquet Artboard */}
              <div className="relative aspect-4/5 rounded-2xl bg-gradient-to-b from-[#FCFAF9] to-[#F7E6EB] overflow-hidden border border-[#F7E6EB] flex flex-col items-center justify-center p-6 text-center">
                
                {/* Wrapping Background Simulator */}
                <div 
                  className={`absolute inset-x-8 bottom-6 h-64 rounded-t-full shadow-md transition-all duration-500 flex flex-col items-center justify-end pb-4 ${
                    selectedWrapping === 'Deep Emerald Velvet' ? 'bg-[#145C45] text-white' :
                    selectedWrapping === 'Vintage Calligraphy' ? 'bg-[#EFE9DF] text-[#4A3B32] border border-[#D5C7B3]' :
                    selectedWrapping === 'Frosted White Minimal' ? 'bg-white/90 text-[#292626] border border-gray-200' :
                    'bg-[#F2D7E0] text-[#145C45]'
                  }`}
                >
                  {/* Ribbon Tie */}
                  <div 
                    className={`w-3/4 py-1.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs mb-2 transition-colors ${
                      selectedRibbon === 'Emerald Satin' ? 'bg-[#0F4534] text-white' :
                      selectedRibbon === 'Dusty Rose Silk' ? 'bg-[#E8B5C3] text-[#292626]' :
                      selectedRibbon === 'Champagne Gold' ? 'bg-[#D4AF37] text-white' :
                      'bg-[#58111A] text-white'
                    }`}
                  >
                    Bound with {selectedRibbon}
                  </div>
                  <span className="text-[10px] font-mono tracking-widest opacity-80 uppercase">
                    {selectedWrapping}
                  </span>
                </div>

                {/* Stems Fan Simulation */}
                <div className="relative z-10 flex flex-wrap justify-center items-center gap-1.5 max-w-[240px] mb-24">
                  {Object.entries(selectedStems).map(([fId, qty]) => {
                    const flower = FLOWER_STOCK.find((f) => f.id === fId);
                    if (!flower || qty === 0) return null;
                    return (
                      <div 
                        key={fId}
                        className="px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-xs flex items-center gap-1 animate-scale-up"
                        style={{ backgroundColor: flower.colorHex }}
                      >
                        <span>{qty}x</span>
                        <span className="truncate max-w-[80px]">{flower.name.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-[#145C45] shadow-xs">
                  {currentTotalStems} / {maxStems} Stems Chosen
                </div>

                <div className="absolute top-4 right-4 bg-[#145C45] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                  ₹{totalPrice}
                </div>
              </div>

              {/* Live Card Message Preview */}
              <div className="p-4 rounded-2xl bg-[#FCFAF9] border border-[#F7E6EB] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#77716F] tracking-wider block">
                  Complimentary Calligraphy Card Note:
                </span>
                <p className="font-serif italic text-xs text-[#292626] line-clamp-3">
                  "{cardMessage || 'Your personal handwritten note will appear here...'}"
                </p>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={currentTotalStems === 0}
                className="w-full py-4 rounded-2xl bg-[#145C45] hover:bg-[#196B51] disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>Added to Floral Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add Bouquet to Cart (₹{totalPrice})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Bouquet Size */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider">Step 1</span>
                  <h3 className="font-serif text-xl font-bold text-[#292626]">Choose Arrangement Scale</h3>
                </div>
                <span className="text-xs text-[#77716F]">Stem Capacity: {maxStems}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Petite (6 Stems)', desc: 'Charming intimate desk gift', price: '₹399 base' },
                  { name: 'Classic (12 Stems)', desc: 'Signature full luxury bouquet', price: '₹699 base' },
                  { name: 'Luxe (24 Stems)', desc: 'Grand statement celebration', price: '₹1,199 base' }
                ].map((tier) => (
                  <button
                    key={tier.name}
                    onClick={() => setBouquetSize(tier.name as BouquetConfiguration['size'])}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      bouquetSize === tier.name
                        ? 'border-[#145C45] bg-[#F7E6EB]/50 shadow-xs ring-1 ring-[#145C45]'
                        : 'border-gray-200 hover:border-[#E8B5C3] bg-white'
                    }`}
                  >
                    <strong className="text-xs font-bold text-[#292626] block">{tier.name}</strong>
                    <span className="text-[11px] text-[#77716F] block mt-1">{tier.desc}</span>
                    <span className="text-xs font-semibold text-[#145C45] block mt-2">{tier.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Stem Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider">Step 2</span>
                  <h3 className="font-serif text-xl font-bold text-[#292626]">Select Flowers & Foliage</h3>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  currentTotalStems >= maxStems ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentTotalStems} of {maxStems} stems chosen
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FLOWER_STOCK.map((flower) => {
                  const qty = selectedStems[flower.id] || 0;
                  return (
                    <div key={flower.id} className="p-3.5 rounded-2xl border border-gray-100 bg-[#FCFAF9] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={flower.image} alt={flower.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <strong className="text-xs font-bold text-[#292626] block">{flower.name}</strong>
                          <span className="text-[11px] text-[#77716F] block">₹{flower.pricePerStem}/stem</span>
                          <span className="text-[10px] text-[#145C45] font-medium">{flower.colorName}</span>
                        </div>
                      </div>

                      {/* Counter */}
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200">
                        <button
                          onClick={() => handleStemChange(flower.id, -1)}
                          disabled={qty === 0}
                          className="w-6 h-6 rounded-lg bg-[#FCFAF9] hover:bg-[#F7E6EB] text-[#292626] disabled:opacity-30 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs w-4 text-center">{qty}</span>
                        <button
                          onClick={() => handleStemChange(flower.id, 1)}
                          disabled={currentTotalStems >= maxStems}
                          className="w-6 h-6 rounded-lg bg-[#FCFAF9] hover:bg-[#F7E6EB] text-[#292626] disabled:opacity-30 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Wrapping & Ribbon */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider">Step 3</span>
                <h3 className="font-serif text-xl font-bold text-[#292626]">Atelier Presentation & Styling</h3>
              </div>

              {/* Wrapping Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] block">Signature Wrapping Paper Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {WRAPPINGS.map((wrap) => (
                    <button
                      key={wrap}
                      onClick={() => setSelectedWrapping(wrap)}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                        selectedWrapping === wrap
                          ? 'border-[#145C45] bg-[#F7E6EB] text-[#145C45] font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-[#77716F]'
                      }`}
                    >
                      {wrap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ribbon Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] block">Satin Ribbon Tie</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {RIBBONS.map((ribbon) => (
                    <button
                      key={ribbon}
                      onClick={() => setSelectedRibbon(ribbon)}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                        selectedRibbon === ribbon
                          ? 'border-[#145C45] bg-[#F7E6EB] text-[#145C45] font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-[#77716F]'
                      }`}
                    >
                      {ribbon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Handwritten Card Note */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] block">Personalized Calligraphy Note</label>
                <textarea
                  rows={3}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="Type your heartfelt greeting note here..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-xs text-[#292626] focus:outline-none focus:border-[#145C45] resize-none"
                />
              </div>

              {/* Add-ons */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-[#292626] block">Delightful Add-On Treats</label>
                <div className="space-y-2">
                  {ADD_ONS.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                          isSelected ? 'border-[#145C45] bg-[#F7E6EB]/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-[#292626]">{addon.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#145C45]">+₹{addon.price}</span>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isSelected ? 'bg-[#145C45] border-[#145C45] text-white' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
