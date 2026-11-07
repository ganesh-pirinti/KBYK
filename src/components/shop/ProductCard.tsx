import React, { useState } from 'react';
import { Heart, Star, Sparkles, ArrowRight, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);
  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, { quantity: 1 });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartPopping(true);
    toggleWishlist(product.id);
    setTimeout(() => setIsHeartPopping(false), 400);
  };

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group relative bg-white rounded-2xl border border-[#F7E6EB] hover:border-[#E8B5C3] card-luxury flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FCFAF9]">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover object-center img-zoom"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#145C45] px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-emerald-200" />
              Bestseller
            </span>
          )}
          {product.newArrival && (
            <span className="inline-flex items-center rounded-full bg-[#E8B5C3] px-2.5 py-0.5 text-[10px] font-semibold text-[#292626]">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button with Heart Pop Animation */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-white text-red-500 shadow-md'
              : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white shadow-xs'
          } ${isHeartPopping ? 'animate-heart-pop' : ''}`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Hover Quick View Overlay for desktop */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#292626] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F7E6EB] hover:text-[#145C45] shadow-md z-10 hidden sm:flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Quick preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] pr-1">Preview</span>
          </button>
        )}
      </div>

      {/* Content Block */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#77716F]">
            <span className="text-[11px] font-semibold text-[#145C45] uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-[#292626] text-xs">{product.rating}</span>
              <span className="text-[10px] text-[#77716F]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-base sm:text-lg font-medium text-[#292626] group-hover:text-[#145C45] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#77716F] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & CTA Action */}
        <div className="pt-4 mt-3 border-t border-[#F7E6EB] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-[#292626]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#77716F] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickAdd}
              className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#F7E6EB] text-[#145C45] hover:bg-[#E8B5C3]'
              }`}
              title="Quick Add to Enquiry"
              aria-label="Add to cart"
            >
              {justAdded ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#145C45] text-white text-xs font-medium hover:bg-[#0F4534] transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>Personalise</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
