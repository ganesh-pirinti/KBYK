import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  Share2, 
  ArrowRight, 
  Check, 
  Sparkles,
  Copy
} from 'lucide-react';

interface WishlistPageProps {
  onSelectProduct: (id: string) => void;
  onExploreGifts: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onExploreGifts,
}) => {
  const { wishlistProducts, toggleWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [shareCopied, setShareCopied] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const handleMoveToEnquiry = (product: any) => {
    addToCart(product, { quantity: 1 });
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleShareWishlist = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF9] py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#F7E6EB] shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7E6EB] text-red-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-[#F7E6EB]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#292626]">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#77716F]">
            Tap the heart icon on any handmade gift to save your favorites for upcoming celebrations.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreGifts}
              className="px-8 py-3.5 rounded-full bg-[#145C45] text-white font-semibold text-xs sm:text-sm hover:bg-[#0F4534] transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Handcrafted Gifts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F7E6EB] gap-4">
          <div>
            <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider block">
              Saved Keepsakes
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#292626]">
              Your Wishlist ({wishlistCount})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWishlist}
              className="px-4 py-2 rounded-full bg-white border border-[#E8B5C3] text-xs font-semibold text-[#145C45] hover:bg-[#F7E6EB] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Wishlist</span>
                </>
              )}
            </button>

            <button
              onClick={clearWishlist}
              className="text-xs text-[#77716F] hover:text-red-500 underline transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#F7E6EB] hover:border-[#E8B5C3] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FCFAF9] mb-3">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => onSelectProduct(product.id)}
                  />

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white text-red-500 shadow-md hover:scale-110 transition-transform"
                    title="Remove from Wishlist"
                  >
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>
                </div>

                <span className="text-[10px] font-bold text-[#145C45] uppercase tracking-wider block">
                  {product.category}
                </span>
                <h3
                  onClick={() => onSelectProduct(product.id)}
                  className="font-serif text-base font-semibold text-[#292626] hover:text-[#145C45] transition-colors cursor-pointer"
                >
                  {product.name}
                </h3>
                <p className="text-xs text-[#77716F] line-clamp-2 mt-1">
                  {product.shortDescription}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="font-bold text-base text-[#292626]">
                  ₹{product.price}
                </span>

                <button
                  onClick={() => handleMoveToEnquiry(product)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    addedItemMap[product.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#145C45] text-white hover:bg-[#0F4534]'
                  }`}
                >
                  {addedItemMap[product.id] ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
