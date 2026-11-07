import React, { useState } from 'react';
import { useCoupons } from '../../context/CouponContext';
import { Tag, Plus, CheckCircle2, Gift, Sparkles, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Coupon } from '../../types';

export const PromotionsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive, giftCards } = useCoupons();
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('499');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [maxUsage, setMaxUsage] = useState('250');
  const [description, setDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    addCoupon({
      code: code.trim().toUpperCase(),
      type,
      discountValue: parseInt(discountValue, 10) || 10,
      minOrderValue: parseInt(minOrderValue, 10) || 499,
      expiryDate,
      maxUsage: parseInt(maxUsage, 10) || 100,
      description: description || `Handcrafted promotion for ${code}`,
      isActive: true,
    });
    setShowAddModal(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3532] pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            Promotions, Coupons & Gift Cards
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure discount codes, manage gift card balances, and track referral rewards.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#145C45] hover:bg-[#0F4534] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#161B19] rounded-2xl border border-[#2C3532] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#101413] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#2C3532]">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Cart</th>
                <th className="py-3 px-4">Usage / Cap</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C3532]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#1C2220] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {c.type === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                  </td>
                  <td className="py-3.5 px-4">
                    ₹{c.minOrderValue}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.usageCount} / {c.maxUsage} used
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">
                    {c.expiryDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleCouponActive(c.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2A3330] hover:bg-[#34403C] text-gray-200"
                    >
                      {c.isActive ? 'Deactivate' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gift Cards & Referrals Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gift cards */}
        <div className="bg-[#161B19] rounded-2xl p-5 border border-[#2C3532] space-y-3">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
            <Gift className="w-5 h-5 text-emerald-400" />
            <span>Digital Gift Cards Issued</span>
          </div>
          <div className="space-y-2">
            {giftCards.map((g) => (
              <div key={g.id} className="p-3 bg-[#101413] rounded-xl border border-[#2C3532] flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-emerald-400 font-bold block">{g.code}</span>
                  <span className="text-gray-400">Issued to: {g.recipientName}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">Balance: ₹{g.balance}</span>
                  <span className="text-[10px] text-gray-500">Exp: {g.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral program */}
        <div className="bg-[#161B19] rounded-2xl p-5 border border-[#2C3532] space-y-3">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Patron Referral Program</span>
          </div>
          <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
            <p>
              Patrons receive flat <strong>₹150 off</strong> on friend invitations. When friends order, <strong>300 Heirloom Points</strong> are awarded to the advocate.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#101413] rounded-xl border border-[#2C3532]">
                <span className="text-[10px] uppercase text-gray-500 block">Total Referrals</span>
                <span className="font-serif text-2xl font-bold text-white">48</span>
              </div>
              <div className="p-3 bg-[#101413] rounded-xl border border-[#2C3532]">
                <span className="text-[10px] uppercase text-gray-500 block">Revenue Generated</span>
                <span className="font-serif text-2xl font-bold text-emerald-400">₹62,400</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#161B19] rounded-3xl border border-[#2C3532] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-white">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="999"
                    className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Campaign Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% off for Diwali celebration boxes"
                  className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#145C45] hover:bg-[#0F4534] text-white font-semibold transition-colors mt-2 cursor-pointer"
              >
                Publish Coupon Code
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
