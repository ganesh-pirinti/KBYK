import React from 'react';
import { Product } from '../../types';
import { X, Heart, Star, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewDetails: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewDetails,
}) => {
  if (!product) return null;

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFavorited = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl border border-[#F7E6EB] shadow-2xl max-w-2xl w-full overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-[#292626] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-[#FCFAF9]">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#145C45] uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#292626]">
                {product.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-[#77716F]">({product.reviewCount} reviews)</span>
              </div>

              <span className="font-bold text-2xl text-[#292626] block pt-1">
                ₹{product.price}
              </span>

              <p className="text-xs text-[#77716F] leading-relaxed line-clamp-3">
                {product.shortDescription}
              </p>

              {product.materials && (
                <div className="pt-2 text-[11px] text-[#77716F]">
                  <strong className="text-[#292626] block mb-1">Key Materials:</strong>
                  <span>{product.materials.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  onViewDetails(product.id);
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-[#145C45] text-white font-semibold text-xs hover:bg-[#0F4534] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Full Customizer & Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-[#292626] hover:bg-[#F7E6EB] transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
