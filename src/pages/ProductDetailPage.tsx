import React, { useState } from 'react';
import { Product, ProductAddOn } from '../types';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LiveCustomizerPreview } from '../components/product/LiveCustomizerPreview';
import { LeadTimeCalculator } from '../components/product/LeadTimeCalculator';
import { MotionReveal } from '../components/common/MotionReveal';
import { 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Scissors, 
  Upload, 
  X, 
  Check, 
  ArrowLeft, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onSelectProduct: (id: string) => void;
  onProceedToEnquiry: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onSelectProduct,
  onProceedToEnquiry,
}) => {
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // State for customization
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'Standard');
  const [selectedTheme, setSelectedTheme] = useState<string>(product.themes?.[0] || 'Default');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.availableColors?.[0] || { name: 'Blush Pink', hex: '#F7E6EB' }
  );
  const [personalisedName, setPersonalisedName] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<ProductAddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'reviews'>('details');
  const [addedToast, setAddedToast] = useState(false);

  // Toggle add-on checkbox
  const handleToggleAddOn = (addon: ProductAddOn) => {
    setSelectedAddOns((prev) => {
      if (prev.some((a) => a.id === addon.id)) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Image Upload handler (supports real client file object with objectURL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageName(file.name);
      const url = URL.createObjectURL(file);
      setUploadedImageUrl(url);
    }
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImageName(null);
    setUploadedImageUrl(null);
  };

  // Calculate dynamic price
  const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = product.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  // Add to enquiry cart
  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      selectedSize,
      selectedTheme,
      selectedColor: selectedColor.name,
      personalisedName,
      giftMessage,
      selectedAddOns,
      uploadedImageName: uploadedImageName || undefined,
      uploadedImageUrl: uploadedImageUrl || undefined,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  // Buy now / instant enquiry
  const handleBuyNow = () => {
    handleAddToCart();
    onProceedToEnquiry();
  };

  const isFavorited = isInWishlist(product.id);

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#77716F]">
          <button onClick={onBack} className="hover:text-[#145C45] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span>/</span>
          <span className="hover:text-[#145C45] cursor-pointer" onClick={onBack}>
            Shop
          </span>
          <span>/</span>
          <span className="text-[#145C45] font-medium">{product.category}</span>
          <span>/</span>
          <span className="text-[#292626] font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        {/* Product Main Showcase Grid matching Reference 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (matching Reference 03) */}
          <div className="lg:col-span-6 space-y-4 sticky top-24">
            
            {/* Main Featured Photo */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-xl border border-[#F7E6EB] group">
              <img
                src={product.images[selectedImageIndex] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                  isFavorited
                    ? 'bg-white text-red-500 shadow-md scale-110'
                    : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white shadow-xs'
                }`}
                title="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div className="absolute bottom-4 left-4">
                <span className="bg-[#145C45] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip (4 photos matching reference 03) */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#145C45] ring-2 ring-[#145C45]/20 scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>

            {/* Live Interactive Preview Box */}
            <div className="pt-2">
              <LiveCustomizerPreview
                product={product}
                selectedSize={selectedSize}
                selectedTheme={selectedTheme}
                selectedColor={selectedColor}
                personalisedName={personalisedName}
                giftMessage={giftMessage}
                selectedAddOns={selectedAddOns}
                uploadedImageUrl={uploadedImageUrl || undefined}
              />
            </div>
          </div>

          {/* Right Column: Customization & Ordering Form (matching Reference 03) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title, Rating & Price */}
            <div className="space-y-2 border-b border-[#F7E6EB] pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-[#145C45]">
                  Handmade Keepsake
                </span>
                <span className="text-xs text-[#77716F]">
                  Est. craft time: ~{product.leadTimeDays} days
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#292626] font-normal">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#292626]">{product.rating}</span>
                <span className="text-xs text-[#77716F]">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-bold text-[#292626]">
                  ₹{unitPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#77716F] line-through">
                    ₹{product.originalPrice + addOnsTotal}
                  </span>
                )}
                <span className="text-xs font-semibold text-[#145C45] bg-[#F7E6EB] px-2.5 py-0.5 rounded-full">
                  Free Pan-India Delivery Above ₹1,499
                </span>
              </div>

              <p className="text-sm text-[#77716F] leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Customization Controls (Reference 03) */}
            <div className="space-y-5">
              
              {/* Size Selection (if available) */}
              {product.sizes && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                    Choose Size / Format:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-[#145C45] text-white shadow-xs'
                            : 'bg-white text-[#292626] hover:bg-[#F7E6EB] border border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Theme Selection (Reference 03) */}
              {product.themes && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                    Cover Aesthetic Theme:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.themes.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedTheme === theme
                            ? 'bg-[#145C45] text-white shadow-xs'
                            : 'bg-white text-[#292626] hover:bg-[#F7E6EB] border border-gray-200'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Palette Selector */}
              {product.availableColors && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#292626] uppercase tracking-wider">
                      Color Palette:
                    </label>
                    <span className="text-[#145C45] font-semibold">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.availableColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor.name === color.name
                            ? 'border-[#145C45] scale-115 shadow-sm'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Personalised Name / Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider flex items-center justify-between">
                  <span>Personalised Name / Title:</span>
                  <span className="text-[11px] font-normal text-[#77716F]">Included free</span>
                </label>
                <input
                  type="text"
                  value={personalisedName}
                  onChange={(e) => setPersonalisedName(e.target.value)}
                  placeholder="e.g. Diya's 21st Birthday, Rohit & Sneha 2026..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                />
              </div>

              {/* Optional Gift Note */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Gift Note (Printed inside envelope):
                </label>
                <textarea
                  rows={2}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Write a heartfelt message to be hand-lettered or printed..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45] resize-none"
                />
              </div>

              {/* Add-ons Checkboxes matching Reference 03 */}
              {product.addOns && product.addOns.length > 0 && (
                <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-[#F7E6EB]">
                  <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                    Optional Add-ons:
                  </label>
                  <div className="space-y-2">
                    {product.addOns.map((addon) => {
                      const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#F7E6EB]/50 border-[#145C45]'
                              : 'bg-[#FCFAF9] border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleAddOn(addon)}
                              className="accent-[#145C45] w-4 h-4 rounded cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-semibold text-[#292626] block">
                                {addon.name}
                              </span>
                              {addon.description && (
                                <span className="text-[10px] text-[#77716F]">
                                  {addon.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#145C45]">
                            +₹{addon.price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reference Image Upload Box (matching Reference 03 & 04) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider flex items-center justify-between">
                  <span>Attach Reference Photos / Memories:</span>
                  <span className="text-[11px] font-normal text-[#77716F]">Optional</span>
                </label>

                {uploadedImageName ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#145C45] text-xs text-[#292626]">
                    <div className="flex items-center gap-2 truncate">
                      <Check className="w-4 h-4 text-[#145C45]" />
                      <span className="truncate font-medium">{uploadedImageName}</span>
                    </div>
                    <button
                      onClick={handleRemoveUploadedImage}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#E8B5C3] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F7E6EB]/30 transition-colors bg-white">
                    <Upload className="w-6 h-6 text-[#145C45] mb-1.5" />
                    <span className="text-xs font-semibold text-[#292626]">
                      Click to upload photos or drag & drop
                    </span>
                    <span className="text-[10px] text-[#77716F] mt-0.5">
                      PNG, JPG, HEIC up to 15MB. Or send via WhatsApp later!
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Lead-Time Calculator & Delivery Date Planner (Requirement 11) */}
              <LeadTimeCalculator leadTimeDays={product.leadTimeDays} />

              {/* Quantity Selector & Action Buttons (Reference 03) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E8B5C3] rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#292626] hover:bg-[#F7E6EB] transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#292626]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#292626] hover:bg-[#F7E6EB] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-xs text-[#77716F]">
                    <span>Total: </span>
                    <strong className="text-base text-[#292626]">₹{totalPrice}</strong>
                  </div>
                </div>

                {/* Two buttons matching Reference 03: "Add to Cart" and "Buy Now" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4 text-emerald-200" />
                    <span>Add to Enquiry</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-4 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-sm hover:bg-[#dfa3b4] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Enquire Now (Fast Track)</span>
                  </button>
                </div>

                {addedToast && (
                  <div className="p-3 bg-emerald-50 border border-[#145C45] rounded-xl text-center text-xs text-[#145C45] font-semibold animate-fade-in">
                    ✓ Customised keepsake added to your enquiry!
                  </div>
                )}
              </div>

              {/* Trust Badges matching Reference 03 footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#F7E6EB] text-center text-[11px] text-[#77716F]">
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <Scissors className="w-4 h-4 text-[#145C45] mx-auto mb-1" />
                  <span className="font-semibold text-[#292626] block">Handmade</span>
                  <span>With Love</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <Sparkles className="w-4 h-4 text-[#145C45] mx-auto mb-1" />
                  <span className="font-semibold text-[#292626] block">Customised</span>
                  <span>Just for You</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-[#145C45] mx-auto mb-1" />
                  <span className="font-semibold text-[#292626] block">Secure</span>
                  <span>Packaging</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <Truck className="w-4 h-4 text-[#145C45] mx-auto mb-1" />
                  <span className="font-semibold text-[#292626] block">Pan-India</span>
                  <span>Delivery</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Info Section: Materials, Includes & Care */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-[#F7E6EB] pb-3 text-sm">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 font-semibold transition-colors ${
                activeTab === 'details'
                  ? 'border-b-2 border-[#145C45] text-[#145C45]'
                  : 'text-[#77716F] hover:text-[#292626]'
              }`}
            >
              Story & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-2 font-semibold transition-colors ${
                activeTab === 'materials'
                  ? 'border-b-2 border-[#145C45] text-[#145C45]'
                  : 'text-[#77716F] hover:text-[#292626]'
              }`}
            >
              Materials & Includes
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[#145C45] text-[#145C45]'
                  : 'text-[#77716F] hover:text-[#292626]'
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs sm:text-sm text-[#77716F] leading-relaxed">
              <p>{product.description}</p>
              <div className="bg-[#FCFAF9] p-4 rounded-2xl border border-gray-100">
                <h4 className="font-serif font-bold text-[#292626] text-base mb-2">
                  The KBYK Promise
                </h4>
                <p>
                  Every keepsake is handled with reverent care. Photos are printed on non-fade archival photo paper, dried botanicals are treated to preserve natural hues, and edges are precision-creased for seamless unfolding.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-[#292626] uppercase text-xs tracking-wider mb-2">
                  Artisan Materials
                </h4>
                <ul className="space-y-1.5 text-[#77716F]">
                  {product.materials?.map((m, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#145C45]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#292626] uppercase text-xs tracking-wider mb-2">
                  What’s Inside the Box
                </h4>
                <ul className="space-y-1.5 text-[#77716F]">
                  {product.includes?.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8B5C3]" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-4 bg-[#FCFAF9] p-4 rounded-2xl">
                <div className="text-center pr-4 border-r border-gray-200">
                  <span className="font-serif text-3xl font-bold text-[#292626]">
                    {product.rating}
                  </span>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#77716F] block mt-1">
                    100% Verified Givers
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#292626]">Exceptional Handmade Quality</p>
                  <p className="text-[#77716F] text-xs">
                    "Every recipient mentioned the unboxing was the highlight of their birthday party."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Gifts */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="font-serif text-2xl font-normal text-[#292626]">
              You May Also Adore
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className="bg-white rounded-2xl border border-[#F7E6EB] hover:border-[#E8B5C3] p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-44 object-cover rounded-xl group-hover:scale-103 transition-transform"
                  />
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-[#145C45] uppercase">
                      {p.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-[#292626] truncate">
                      {p.name}
                    </h4>
                    <span className="text-xs font-bold text-[#292626] block">
                      ₹{p.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
