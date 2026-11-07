import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Star, CheckCircle, Heart, Sparkles, Filter, Plus, Upload, Check } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { reviews, addReview } = useAdmin();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Submit review form
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [productTitle, setProductTitle] = useState('Memory Scrapbook');
  const [occasion, setOccasion] = useState('Birthday');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittedToast, setSubmittedToast] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reviewText) return;

    addReview({
      customerName: name,
      city: city || 'India',
      rating,
      productTitle,
      occasion,
      reviewText,
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      giftPhoto: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      verifiedBuyer: true,
      approved: true,
    });

    setSubmittedToast(true);
    setName('');
    setReviewText('');
    setShowSubmitModal(false);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  const filtered = selectedFilter === 'All'
    ? reviews.filter((r) => r.approved !== false)
    : reviews.filter((r) => r.approved !== false && (r.occasion.toLowerCase().includes(selectedFilter.toLowerCase()) || r.productTitle.toLowerCase().includes(selectedFilter.toLowerCase())));

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header matching Reference 05 */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider block">
            Verified Customer Experiences
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#292626]">
            What Our Customers Say
          </h1>
          <p className="font-serif text-base text-[#145C45] italic">
            “Real stories, real happiness ♡”
          </p>
        </div>

        {/* Rating Breakdown Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="font-serif text-5xl font-bold text-[#292626] block">
                4.9
              </span>
              <div className="flex items-center justify-center gap-1 mt-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-[#77716F] block mt-1">
                Based on 1,200+ orders
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#77716F] border-l border-gray-100 pl-6">
              <div className="flex items-center gap-2">
                <span>5 Stars</span>
                <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#145C45] h-full w-[94%]" />
                </div>
                <span>94%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4 Stars</span>
                <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#145C45] h-full w-[6%]" />
                </div>
                <span>6%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Share Your Unboxing Story</span>
            </button>
          </div>
        </div>

        {/* Toast confirmation */}
        {submittedToast && (
          <div className="p-4 bg-emerald-50 border border-[#145C45] rounded-2xl text-center text-xs text-[#145C45] font-semibold animate-fade-in flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Thank you for sharing your love! Your review has been added to our wall.</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-[#77716F] flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#145C45]" /> Filter by:
          </span>
          {['All', 'Birthday', 'Anniversary', 'Friendship', 'Proposal'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedFilter === f
                  ? 'bg-[#145C45] text-white'
                  : 'bg-white text-[#77716F] border border-gray-200 hover:bg-[#F7E6EB]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Reviews Masonry / Grid matching Reference 05 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#F7E6EB] hover:border-[#E8B5C3] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-12 h-12 rounded-full object-cover border border-[#E8B5C3]"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#292626] flex items-center gap-1">
                        {rev.customerName}
                        <CheckCircle className="w-4 h-4 text-[#145C45] fill-emerald-100" />
                      </h3>
                      <span className="text-[11px] text-[#77716F]">
                        {rev.city} • {rev.occasion}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#77716F]">{rev.date}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#292626] italic leading-relaxed">
                  "{rev.reviewText}"
                </p>

                {/* Unboxing photo */}
                {rev.giftPhoto && (
                  <div className="rounded-2xl overflow-hidden border border-[#F7E6EB] mt-3">
                    <img
                      src={rev.giftPhoto}
                      alt="Received Gift"
                      className="w-full h-44 object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#77716F]">
                <span>Product: <strong className="text-[#145C45]">{rev.productTitle}</strong></span>
                <span className="text-[10px] text-[#145C45] bg-[#F7E6EB] px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F7E6EB] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#F7E6EB] pb-3">
                <h3 className="font-serif text-xl font-medium text-[#292626]">
                  Share Your KBYK Experience
                </h3>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#292626] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shalini Roy"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Your City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Occasion</label>
                    <input
                      type="text"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. Birthday / Anniversary"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#292626] block mb-1">Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#292626] block mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us what you loved about the unboxing and reaction..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-[#77716F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534]"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
