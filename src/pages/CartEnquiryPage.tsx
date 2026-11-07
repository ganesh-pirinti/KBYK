import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { useCoupons } from '../context/CouponContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { MotionReveal } from '../components/common/MotionReveal';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Check, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  Sparkles,
  AlertTriangle,
  Gift,
  CreditCard,
  QrCode,
  Tag,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethodType } from '../types';

interface CartEnquiryPageProps {
  onOrderSubmitted: (enquiryId: string) => void;
  onExploreGifts: () => void;
}

export const CartEnquiryPage: React.FC<CartEnquiryPageProps> = ({
  onOrderSubmitted,
  onExploreGifts,
}) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    clearCart,
    packagingPreference,
    setPackagingPreference,
    giftNote,
    setGiftNote,
  } = useCart();

  const { addEnquiry } = useAdmin();
  const { activeCoupon, discountAmount, applyCoupon, removeCoupon } = useCoupons();
  const { customer, isLoggedIn } = useCustomerAuth();

  // Coupon input state
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Enquiry checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState(customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(customer?.email || '');
  const [customerCity, setCustomerCity] = useState(customer?.addresses[0]?.city || '');
  const [deliveryAddress, setDeliveryAddress] = useState(customer?.addresses[0]?.addressLine || '');
  const [pincode, setPincode] = useState(customer?.addresses[0]?.pincode || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [occasion, setOccasion] = useState('Birthdays');
  const [requiredDate, setRequiredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [isUrgent, setIsUrgent] = useState(false);

  const handleDateChange = (val: string) => {
    setRequiredDate(val);
    const chosen = new Date(val);
    const today = new Date();
    const diffDays = Math.ceil((chosen.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setIsUrgent(diffDays <= 4);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput, subtotal);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E8B5C3', '#145C45', '#FFFFFF'],
      });
    } catch {}

    const newId = addEnquiry({
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@example.com',
      customerPhone: customerPhone || '+91 98201 44552',
      customerCity: customerCity || 'India',
      pincode: pincode || '400001',
      deliveryAddress,
      occasion,
      requiredArrivalDate: requiredDate,
      isUrgent,
      items: [...items],
      giftNote,
      packagingPreference,
      estimatedTotal: finalTotal,
      discountApplied: discountAmount,
      couponCode: activeCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi' ? 'Pending Verification' : '50% Advance Received',
      notes: `Order created from Enquiry Bag with ${items.length} unique item(s). Payment: ${paymentMethod}. Packaging: ${packagingPreference}`,
    });

    clearCart();
    onOrderSubmitted(newId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF9] py-16 px-4">
        <MotionReveal direction="scale" className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#F7E6EB] shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#292626]">
            Your Enquiry Bag is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#77716F]">
            You have not added any personalized keepsakes or custom gifts yet.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreGifts}
              className="px-8 py-3.5 rounded-full bg-[#145C45] text-white font-semibold text-xs sm:text-sm hover:bg-[#0F4534] transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Handcrafted Gifts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </MotionReveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title */}
        <MotionReveal direction="down" className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handmade With Love • Direct Artisan Review</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292626]">
            Your Enquiry Bag
          </h1>
          <p className="text-xs sm:text-sm text-[#77716F]">
            Review your selected personalised gifts, packaging preferences, and verified quotes.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items List & Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Items Table Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-6">
              <div className="divide-y divide-[#F7E6EB]">
                {items.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-[#F7E6EB] flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#145C45] tracking-wider">
                          {item.product.category}
                        </span>
                        <h3 className="font-serif text-base font-semibold text-[#292626]">
                          {item.product.name}
                        </h3>
                        
                        {/* Customisation specs */}
                        <div className="text-xs text-[#77716F] space-y-0.5">
                          {item.personalisedName && (
                            <p className="text-[#145C45] font-medium">
                              Inscribed Name: <span className="font-bold">"{item.personalisedName}"</span>
                            </p>
                          )}
                          {item.selectedTheme && <p>Theme: {item.selectedTheme}</p>}
                          {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                          {item.selectedAddOns.length > 0 && (
                            <p className="text-[11px] text-[#77716F]">
                              Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-[#E8B5C3] rounded-full px-2 py-0.5 bg-[#FCFAF9]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs text-[#77716F] hover:text-[#145C45]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#292626]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-[#77716F] hover:text-[#145C45]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif text-lg font-bold text-[#292626]">
                        ₹{item.totalItemPrice}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Packaging preference selector */}
              <div className="pt-6 border-t border-[#F7E6EB] space-y-3">
                <span className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Studio Packaging Upgrade
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setPackagingPreference('Standard Eco Kraft')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      packagingPreference === 'Standard Eco Kraft'
                        ? 'border-[#145C45] bg-[#F7E6EB]/30'
                        : 'border-gray-200 bg-[#FCFAF9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="packaging"
                      checked={packagingPreference === 'Standard Eco Kraft'}
                      onChange={() => setPackagingPreference('Standard Eco Kraft')}
                      className="mt-0.5 accent-[#145C45]"
                    />
                    <div>
                      <strong className="block text-[#292626]">Standard Eco Kraft (Included)</strong>
                      <span className="text-[11px] text-[#77716F]">Recycled kraft box, jute twine & botanical tag.</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPackagingPreference('Luxury Keepsake Velvet Box (+₹180)')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      packagingPreference === 'Luxury Keepsake Velvet Box (+₹180)'
                        ? 'border-[#145C45] bg-[#F7E6EB]/30'
                        : 'border-gray-200 bg-[#FCFAF9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="packaging"
                      checked={packagingPreference === 'Luxury Keepsake Velvet Box (+₹180)'}
                      onChange={() => setPackagingPreference('Luxury Keepsake Velvet Box (+₹180)')}
                      className="mt-0.5 accent-[#145C45]"
                    />
                    <div>
                      <strong className="block text-[#292626]">Luxury Velvet Heirloom (+₹180)</strong>
                      <span className="text-[11px] text-[#77716F]">Rigid box, gold wax seal stamp, & dried petals.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Coupon / Promo Code Input */}
              <div className="pt-4 border-t border-[#F7E6EB] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#292626]">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#145C45]" />
                    <span>Have a Promo Code or Gift Card?</span>
                  </span>
                  <span className="text-[11px] text-[#77716F]">Try: KBYKFIRST or CELEBRATE</span>
                </div>

                {activeCoupon ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>
                        Coupon <strong>{activeCoupon.code}</strong> applied (-₹{discountAmount})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 font-bold p-1"
                      title="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code (e.g. KBYKFIRST)"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-xs uppercase font-semibold text-[#292626] focus:outline-none focus:border-[#145C45]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#145C45] hover:bg-[#0F4534] text-white text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && !activeCoupon && (
                  <p className={`text-[11px] ${couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Total Calculation Strip */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs text-[#77716F] block">Total Payable:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-[#292626]">
                      ₹{finalTotal}
                    </span>
                    {discountAmount > 0 && (
                      <span className="text-xs text-emerald-700 font-semibold line-through">
                        ₹{subtotal}
                      </span>
                    )}
                  </div>
                </div>

                {!isCheckingOut && (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Checkout Form */}
            {isCheckingOut && (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#145C45] shadow-xl space-y-6 animate-fade-in">
                <div className="border-b border-[#F7E6EB] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-[#145C45] font-semibold">
                      Delivery & Payment Selection
                    </h3>
                    <p className="text-xs text-[#77716F]">
                      Direct artisan verification before handcrafted assembly.
                    </p>
                  </div>
                  {isLoggedIn && (
                    <span className="text-[11px] font-semibold bg-[#F7E6EB] text-[#145C45] px-2.5 py-1 rounded-full">
                      Logged in as {customer?.name}
                    </span>
                  )}
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Diya Patel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 98201 44552"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. diya.patel@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Occasion *</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    >
                      <option value="Birthdays">Birthdays</option>
                      <option value="Anniversaries">Anniversaries</option>
                      <option value="Friendship">Friendship</option>
                      <option value="Festivals">Festivals</option>
                      <option value="Proposals">Proposals</option>
                      <option value="Just Because">Just Because</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-[#292626] block mb-1">Street Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Flat / Building / Street Name / Area"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">City & State *</label>
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 400050"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>
                </div>

                {/* Target Arrival Date */}
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-[#292626] block">Target Arrival Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={requiredDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2 pt-2 border-t border-[#F7E6EB]">
                  <label className="font-bold text-[#292626] text-xs block">Choose Payment Method *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        paymentMethod === 'upi'
                          ? 'border-[#145C45] bg-[#F7E6EB]/40 font-semibold'
                          : 'border-gray-200 bg-[#FCFAF9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-[#145C45]"
                      />
                      <QrCode className="w-4 h-4 text-[#145C45]" />
                      <span>Instant UPI / QR (GPay, PhonePe, Paytm)</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('advance_50')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        paymentMethod === 'advance_50'
                          ? 'border-[#145C45] bg-[#F7E6EB]/40 font-semibold'
                          : 'border-gray-200 bg-[#FCFAF9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'advance_50'}
                        onChange={() => setPaymentMethod('advance_50')}
                        className="accent-[#145C45]"
                      />
                      <Sparkles className="w-4 h-4 text-[#145C45]" />
                      <span>50% Handcrafted Advance (Balance on dispatch)</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        paymentMethod === 'card'
                          ? 'border-[#145C45] bg-[#F7E6EB]/40 font-semibold'
                          : 'border-gray-200 bg-[#FCFAF9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#145C45]"
                      />
                      <CreditCard className="w-4 h-4 text-[#145C45]" />
                      <span>Cards & NetBanking</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        paymentMethod === 'cod'
                          ? 'border-[#145C45] bg-[#F7E6EB]/40 font-semibold'
                          : 'border-gray-200 bg-[#FCFAF9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#145C45]"
                      />
                      <Truck className="w-4 h-4 text-[#145C45]" />
                      <span>Cash on Delivery (₹150 photo token)</span>
                    </label>
                  </div>
                </div>

                {/* Gift Note */}
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-[#292626] block">Optional Wax-Sealed Gift Card Message</label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Message to be handwritten inside the envelope..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                  />
                </div>

                {isUrgent && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Urgent date selected (&lt; 4 days)! We will review studio capacity and respond promptly on WhatsApp.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-emerald-200" />
                  <span>Confirm Order & Lock Artisan Slot (₹{finalTotal})</span>
                </button>
              </form>
            )}

          </div>

          {/* Right Column: "Why Choose KBYK?" Card */}
          <div className="lg:col-span-4 space-y-6">
            <MotionReveal direction="left" className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F7E6EB] shadow-xs space-y-5">
              <h3 className="font-serif text-xl font-medium text-[#292626] border-b border-[#F7E6EB] pb-3">
                Why Choose KBYK?
              </h3>

              <div className="space-y-3.5 text-xs text-[#292626]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#145C45] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-sm">Handmade with love</strong>
                    <span className="text-[#77716F]">Every order crafted by our dedicated artisan team.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#145C45] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-sm">Complete photo privacy</strong>
                    <span className="text-[#77716F]">Your private photographs are strictly handled for print & permanently cleared.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#145C45] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-sm">Damage-free transit replacement</strong>
                    <span className="text-[#77716F]">Multi-layered bubble wrapping and replacement guarantee.</span>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>

        </div>

      </div>
    </div>
  );
};
