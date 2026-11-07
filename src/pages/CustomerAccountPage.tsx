import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Gift,
  Bell,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  X,
  Share2,
  Plus,
  Trash2,
  Calendar,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useAdmin } from '../context/AdminContext';
import { MotionReveal } from '../components/common/MotionReveal';
import { EnquiryRequest } from '../types';

interface CustomerAccountPageProps {
  onExploreGifts: () => void;
  onSelectProduct: (id: string) => void;
  onOpenSupport: () => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  onExploreGifts,
  onSelectProduct,
  onOpenSupport,
}) => {
  const {
    customer,
    logout,
    addAddress,
    deleteAddress,
    afterSalesRequests,
    submitAfterSalesRequest,
    addReminder,
    removeReminder,
  } = useCustomerAuth();

  const { enquiries } = useAdmin();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'loyalty' | 'reminders' | 'aftersales'>('orders');

  // Address modal
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrPin, setAddrPin] = useState('');

  // Reminder form
  const [remTitle, setRemTitle] = useState('');
  const [remOccasion, setRemOccasion] = useState('Birthdays');
  const [remDate, setRemDate] = useState('');

  // After-sales modal
  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<EnquiryRequest | null>(null);
  const [afterSalesType, setAfterSalesType] = useState<'cancellation' | 'return_replacement' | 'refund'>('cancellation');
  const [afterSalesReason, setAfterSalesReason] = useState('');
  const [afterSalesSubmittedToast, setAfterSalesSubmittedToast] = useState(false);

  // Copied referral link toast
  const [copiedReferral, setCopiedReferral] = useState(false);

  if (!customer) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <User className="w-12 h-12 text-[#145C45] mb-3" />
        <h2 className="font-serif text-2xl text-[#292626]">Patron Account Signed Out</h2>
        <p className="text-xs text-[#77716F] max-w-sm mt-1 mb-5">
          Please sign in through the header or explore our handcrafted gift collections.
        </p>
        <button
          onClick={onExploreGifts}
          className="px-6 py-2.5 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534]"
        >
          Explore Handmade Gifts
        </button>
      </div>
    );
  }

  // Filter orders matching customer
  const userOrders = enquiries.filter(
    (e) =>
      e.customerEmail.toLowerCase() === customer.email.toLowerCase() ||
      e.customerPhone.includes(customer.phone.replace(/[^0-9]/g, '').slice(-8))
  );

  const displayOrders = userOrders.length > 0 ? userOrders : enquiries.slice(0, 3);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine || !addrCity) return;
    addAddress({
      label: addrLabel,
      fullName: addrName || customer.name,
      phone: addrPhone || customer.phone,
      addressLine: addrLine,
      city: addrCity,
      state: addrState,
      pincode: addrPin,
      isDefault: customer.addresses.length === 0,
    });
    setShowAddAddressModal(false);
    setAddrLine('');
    setAddrCity('');
    setAddrPin('');
  };

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle || !remDate) return;
    addReminder(remTitle, remOccasion, remDate);
    setRemTitle('');
    setRemDate('');
  };

  const handleAfterSalesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForSupport || !afterSalesReason) return;
    submitAfterSalesRequest(selectedOrderForSupport.id, afterSalesType, afterSalesReason);
    setSelectedOrderForSupport(null);
    setAfterSalesReason('');
    setAfterSalesSubmittedToast(true);
    setTimeout(() => setAfterSalesSubmittedToast(false), 4000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(`https://kbyk.in/?ref=${customer.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Executive Header */}
        <MotionReveal direction="down" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#F7E6EB] border border-[#E8B5C3] flex items-center justify-center text-[#145C45] font-serif font-bold text-2xl shadow-inner">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#292626]">
                  {customer.name}
                </h1>
                <span className="text-[10px] font-bold bg-[#F7E6EB] text-[#145C45] px-2.5 py-0.5 rounded-full border border-[#E8B5C3]">
                  VIP Patron
                </span>
              </div>
              <p className="text-xs text-[#77716F] mt-0.5">
                {customer.email} • {customer.phone}
              </p>
              <span className="text-[11px] text-[#77716F]">
                Cherished moments patron since {customer.joinedDate}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto justify-start md:justify-end">
            {/* Loyalty points capsule */}
            <div className="bg-[#FCFAF9] border border-[#E8B5C3] px-4 py-2 rounded-2xl text-left">
              <span className="text-[10px] uppercase font-bold text-[#77716F] tracking-wider block">
                Heirloom Points
              </span>
              <span className="font-serif text-xl font-bold text-[#145C45]">
                {customer.loyaltyPoints} Pts
              </span>
              <span className="text-[10px] text-emerald-700 block font-medium">
                Worth ₹{Math.round(customer.loyaltyPoints * 0.5)} on your next gift
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-2.5 rounded-xl text-[#77716F] hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </MotionReveal>

        {/* Account Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F7E6EB] pb-2 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#145C45] hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Tracking ({displayOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#145C45] hover:bg-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({customer.addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'loyalty'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#145C45] hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Heirloom Rewards & Referrals</span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'reminders'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#145C45] hover:bg-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Milestone Reminders ({customer.reminders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('aftersales')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'aftersales'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#145C45] hover:bg-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>After-Sales & Refunds ({afterSalesRequests.length})</span>
          </button>
        </div>

        {/* Global Toast for submitted support */}
        {afterSalesSubmittedToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>
              Your after-sales request has been registered! Our lead artisan is reviewing the details and will update you via WhatsApp within 4 hours.
            </span>
          </div>
        )}

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {displayOrders.map((order, idx) => (
              <MotionReveal key={order.id} delay={idx * 60} className="bg-white rounded-3xl p-6 border border-[#F7E6EB] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F7E6EB] gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#145C45] bg-[#F7E6EB] px-2 py-0.5 rounded">
                        #{order.id}
                      </span>
                      <span className="text-xs text-[#77716F]">Ordered on {order.createdAt}</span>
                    </div>
                    <span className="font-serif text-lg text-[#292626] font-semibold block mt-1">
                      {order.occasion} Keepsake Collection
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-bold text-[#145C45]">
                      ₹{order.estimatedTotal}
                    </span>
                    <button
                      onClick={() => setSelectedOrderForSupport(order)}
                      className="px-3 py-1.5 rounded-xl border border-[#E8B5C3] text-xs font-medium text-[#292626] hover:bg-[#F7E6EB] transition-colors"
                    >
                      Request Support / Refund
                    </button>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="bg-[#FCFAF9] rounded-2xl p-4 border border-[#F7E6EB] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#145C45] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#145C45]" />
                      <span>Delivery Status: {order.status}</span>
                    </span>
                    <span className="text-[#77716F]">Target Arrival: {order.requiredArrivalDate}</span>
                  </div>

                  {/* Visual Steps */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-[#77716F]">
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-[#145C45]" />
                      <span className="text-[#145C45]">01. Confirmed</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`h-1.5 rounded-full ${order.status !== 'New' ? 'bg-[#145C45]' : 'bg-gray-200'}`} />
                      <span className={order.status !== 'New' ? 'text-[#145C45]' : ''}>02. Crafting</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`h-1.5 rounded-full ${['Dispatched', 'Completed'].includes(order.status) ? 'bg-[#145C45]' : 'bg-gray-200'}`} />
                      <span className={['Dispatched', 'Completed'].includes(order.status) ? 'text-[#145C45]' : ''}>03. QC & Dispatched</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-[#145C45]' : 'bg-gray-200'}`} />
                      <span className={order.status === 'Completed' ? 'text-[#145C45]' : ''}>04. Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                    Handcrafted Keepsakes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.length > 0 ? (
                      order.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF9] border border-[#F7E6EB]">
                          <img src={it.product.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div className="text-xs">
                            <strong className="text-[#292626] block">{it.product.name}</strong>
                            <span className="text-[#77716F]">Qty: {it.quantity} • ₹{it.totalItemPrice}</span>
                            {it.personalisedName && (
                              <span className="text-[11px] text-[#145C45] block font-medium">
                                Inscribed: "{it.personalisedName}"
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-2xl bg-[#FCFAF9] text-xs text-[#77716F]">
                        {order.customIdeaDescription || 'Bespoke Custom Commission Package'}
                      </div>
                    )}
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#77716F]">
                Quick-fill delivery destinations for surprise gifts sent to family and friends.
              </span>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="px-4 py-2 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl p-6 border border-[#F7E6EB] shadow-xs relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-[#F7E6EB] text-[#145C45] px-2.5 py-0.5 rounded-full">
                      {addr.label}
                    </span>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <strong className="text-sm text-[#292626] block">{addr.fullName}</strong>
                  <p className="text-xs text-[#77716F] leading-relaxed">
                    {addr.addressLine}<br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <span className="text-xs text-[#145C45] font-mono block">Phone: {addr.phone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LOYALTY & REFERRALS */}
        {activeTab === 'loyalty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7E6EB] flex items-center justify-center text-[#145C45]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#292626]">
                    Heirloom Club Rewards
                  </h3>
                  <span className="text-xs text-[#77716F]">Earn 1 point for every ₹10 spent</span>
                </div>
              </div>

              <div className="p-4 bg-[#FCFAF9] rounded-2xl border border-[#F7E6EB] space-y-1">
                <span className="text-xs text-[#77716F] block">Your Active Balance:</span>
                <span className="font-serif text-3xl font-bold text-[#145C45]">
                  {customer.loyaltyPoints} Points
                </span>
                <span className="text-xs text-emerald-800 block">
                  ≈ ₹{Math.round(customer.loyaltyPoints * 0.5)} off automatically redeemable at checkout.
                </span>
              </div>

              <div className="text-xs text-[#77716F] space-y-1.5 leading-relaxed">
                <p>✓ Redeemable across all personalized albums, explosion boxes, and lamp frames.</p>
                <p>✓ Double points during festive seasons (Diwali, Valentine's, Friendship Week).</p>
                <p>✓ VIP invitations to preview limited edition seasonal dried-botanical stocks.</p>
              </div>
            </div>

            {/* Referrals card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7E6EB] flex items-center justify-center text-[#145C45]">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#292626]">
                    Gift a Friend ₹150
                  </h3>
                  <span className="text-xs text-[#77716F]">Share moments with those you love</span>
                </div>
              </div>

              <p className="text-xs text-[#77716F] leading-relaxed">
                Give your friends flat ₹150 off their first personalized keepsake order. When they order, 300 Heirloom Points (₹150 value) will be credited to your account!
              </p>

              <div className="p-3 bg-[#FCFAF9] rounded-2xl border border-[#E8B5C3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#77716F] block">Your Exclusive Referral Code:</span>
                  <span className="font-mono text-base font-bold text-[#145C45]">{customer.referralCode}</span>
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="px-3 py-1.5 rounded-xl bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-colors"
                >
                  {copiedReferral ? 'Copied Link!' : 'Copy Link'}
                </button>
              </div>

              <a
                href={`https://wa.me/?text=Hey!%20I%20love%20KBYK%20handmade%20personalised%20gifts.%20Use%20my%20code%20${customer.referralCode}%20to%20get%20flat%20%E2%82%B9150%20off%20your%20first%20keepsake%3A%20https%3A%2F%2Fkbyk.in%2F%3Fref%3D${customer.referralCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-600 text-[#145C45] hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: MILESTONE REMINDERS */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#F7E6EB] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#292626] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#145C45]" />
                <span>Never Miss an Important Date</span>
              </h3>
              <p className="text-xs text-[#77716F]">
                Handcrafted gifts take 5-7 days of love. Add your loved ones' milestones, and we will send a friendly reminder 12 days prior so you have plenty of time!
              </p>

              <form onSubmit={handleAddReminderSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <input
                  type="text"
                  required
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g. Mom's 50th Birthday"
                  className="px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-xs text-[#292626]"
                />
                <select
                  value={remOccasion}
                  onChange={(e) => setRemOccasion(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-xs text-[#292626]"
                >
                  <option>Birthdays</option>
                  <option>Anniversaries</option>
                  <option>Friendship</option>
                  <option>Festivals</option>
                </select>
                <input
                  type="date"
                  required
                  value={remDate}
                  onChange={(e) => setRemDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3] text-xs text-[#292626]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534]"
                >
                  Save Reminder
                </button>
              </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customer.reminders.map((rem) => (
                <div key={rem.id} className="bg-white rounded-2xl p-4 border border-[#F7E6EB] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <strong className="text-xs text-[#292626] block">{rem.title}</strong>
                    <span className="text-[11px] text-[#77716F]">
                      {rem.occasion} • Due {rem.date}
                    </span>
                  </div>
                  <button
                    onClick={() => removeReminder(rem.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AFTER-SALES & REFUNDS */}
        {activeTab === 'aftersales' && (
          <div className="space-y-6">
            <span className="text-xs text-[#77716F] block">
              Transparent after-sales guarantee. Track the progress of any transit damage replacements or refund reviews.
            </span>

            {afterSalesRequests.length > 0 ? (
              <div className="space-y-4">
                {afterSalesRequests.map((req) => (
                  <div key={req.id} className="bg-white rounded-3xl p-6 border border-[#F7E6EB] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#145C45] bg-[#F7E6EB] px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-xs text-[#77716F]">Order #{req.orderId}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <strong className="text-[#292626] capitalize">Type: {req.type.replace('_', ' ')}</strong>
                      <p className="text-[#77716F] italic">"{req.reason}"</p>
                    </div>

                    {req.resolutionNotes && (
                      <div className="p-3 bg-[#FCFAF9] rounded-xl border border-[#F7E6EB] text-xs text-[#145C45]">
                        <strong>Studio Resolution:</strong> {req.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-[#F7E6EB]">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-serif text-lg text-[#292626]">No Active Issues</h4>
                <p className="text-xs text-[#77716F]">All your handcrafted orders have been delivered in pristine condition.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F7E6EB] shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowAddAddressModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#292626]">Add Delivery Address</h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Address Label</label>
                <input
                  type="text"
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="e.g. Home, Office, Bestie"
                  className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Street Address</label>
                <textarea
                  required
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  placeholder="House / Flat / Street / Landmark"
                  className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addrPin}
                    onChange={(e) => setAddrPin(e.target.value)}
                    placeholder="400050"
                    className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#145C45] text-white font-semibold hover:bg-[#0F4534] mt-2"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* After-Sales Request Modal */}
      {selectedOrderForSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F7E6EB] shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedOrderForSupport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-bold text-[#145C45] uppercase tracking-wider block">
                After-Sales Resolution
              </span>
              <h3 className="font-serif text-xl font-bold text-[#292626]">
                Order #{selectedOrderForSupport.id}
              </h3>
            </div>
            <form onSubmit={handleAfterSalesSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Request Type</label>
                <select
                  value={afterSalesType}
                  onChange={(e: any) => setAfterSalesType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                >
                  <option value="cancellation">Order Cancellation (Before Crafting)</option>
                  <option value="return_replacement">Transit Damage Replacement</option>
                  <option value="refund">Payment Refund Enquiry</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Reason & Specific Details</label>
                <textarea
                  required
                  rows={3}
                  value={afterSalesReason}
                  onChange={(e) => setAfterSalesReason(e.target.value)}
                  placeholder="Explain your situation in detail. Our lead artisan will review and assist promptly."
                  className="w-full px-3 py-2 rounded-xl bg-[#FCFAF9] border border-[#E8B5C3]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                Custom photo scrapbooks cannot be cancelled once assembly has started. Replacements are guaranteed if courier damage occurs.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#145C45] text-white font-semibold hover:bg-[#0F4534] mt-2"
              >
                Submit Request to Studio
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
