import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  X, 
  Calendar, 
  Gift, 
  Heart, 
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  User,
  MapPin
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { OCCASIONS } from '../data/occasions';
import confetti from 'canvas-confetti';

interface CustomOrderPageProps {
  onOrderSubmitted: (enquiryId: string) => void;
  onBackToHome: () => void;
}

export const CustomOrderPage: React.FC<CustomOrderPageProps> = ({
  onOrderSubmitted,
  onBackToHome,
}) => {
  const { addEnquiry } = useAdmin();

  // Wizard step: 1: Idea, 2: Details, 3: Review & Submit
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [ideaDescription, setIdeaDescription] = useState('');
  const [occasion, setOccasion] = useState('Birthdays');
  const [budgetRange, setBudgetRange] = useState('₹1,000 - ₹2,000');
  const [requiredDate, setRequiredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [isUrgent, setIsUrgent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [palettePreference, setPalettePreference] = useState('Soft Blush Pink & Emerald');
  const [packagingPreference, setPackagingPreference] = useState<'Standard Eco Kraft' | 'Luxury Keepsake Velvet Box (+₹180)'>('Standard Eco Kraft');
  
  // Contact details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [giftNote, setGiftNote] = useState('');

  // Handle date changes
  const handleDateChange = (val: string) => {
    setRequiredDate(val);
    const chosen = new Date(val);
    const today = new Date();
    const diffDays = Math.ceil((chosen.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setIsUrgent(diffDays <= 4);
  };

  // Upload handler simulation
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => [...prev, file.name]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E8B5C3', '#145C45', '#F7E6EB'],
      });
    } catch {}

    const newId = addEnquiry({
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@example.com',
      customerPhone: customerPhone || '+91 98000 00000',
      customerCity: customerCity || 'India',
      pincode: pincode || '400001',
      occasion,
      requiredArrivalDate: requiredDate,
      isUrgent,
      items: [],
      customIdeaDescription: ideaDescription,
      budgetRange,
      referenceImages: uploadedFiles,
      giftNote,
      packagingPreference,
      estimatedTotal: budgetRange.includes('2,000') ? 2200 : budgetRange.includes('1,000') ? 1499 : 899,
      notes: `Custom Bespoke Request. Theme: ${palettePreference}. ${isUrgent ? 'URGENT RUSH REQUEST' : ''}`,
    });

    onOrderSubmitted(newId);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header (matching Reference 04) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Handcrafted Commission</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292626]">
            Create Your Custom Gift
          </h1>
          <p className="text-sm text-[#77716F]">
            Tell us your idea and we'll bring it to life.
          </p>
        </div>

        {/* 3-Step Indicator matching Reference 04 */}
        <div className="bg-white rounded-2xl p-4 border border-[#F7E6EB] shadow-xs">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === 1
                    ? 'bg-[#E8B5C3] text-[#292626] ring-4 ring-[#F7E6EB]'
                    : step > 1
                    ? 'bg-[#145C45] text-white'
                    : 'bg-gray-100 text-[#77716F]'
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${step === 1 ? 'text-[#145C45]' : 'text-[#77716F]'}`}>
                Your Idea
              </span>
            </div>

            {/* Line 1-2 */}
            <div className={`flex-1 h-0.5 mx-2 ${step > 1 ? 'bg-[#145C45]' : 'bg-gray-200'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === 2
                    ? 'bg-[#E8B5C3] text-[#292626] ring-4 ring-[#F7E6EB]'
                    : step > 2
                    ? 'bg-[#145C45] text-white'
                    : 'bg-gray-100 text-[#77716F]'
                }`}
              >
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${step === 2 ? 'text-[#145C45]' : 'text-[#77716F]'}`}>
                Details
              </span>
            </div>

            {/* Line 2-3 */}
            <div className={`flex-1 h-0.5 mx-2 ${step === 3 ? 'bg-[#145C45]' : 'bg-gray-200'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === 3
                    ? 'bg-[#145C45] text-white ring-4 ring-[#F7E6EB]'
                    : 'bg-gray-100 text-[#77716F]'
                }`}
              >
                3
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${step === 3 ? 'text-[#145C45]' : 'text-[#77716F]'}`}>
                Review & Submit
              </span>
            </div>

          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F7E6EB] shadow-xl space-y-6">
          
          {/* STEP 1: YOUR IDEA (Matching Reference 04) */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Question 1: What would you like to create? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  What would you like to create? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  placeholder="Describe your idea (e.g. scrapbook for 1st anniversary with 20 polaroids, explosion box with chocolate center and hidden love letter, custom keepsake hamper for bestie...)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                />
              </div>

              {/* Question 2: Occasion */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                >
                  {OCCASIONS.map((occ) => (
                    <option key={occ.id} value={occ.name}>
                      {occ.name} — {occ.tagline}
                    </option>
                  ))}
                  <option value="Other">Other Unique Celebration</option>
                </select>
              </div>

              {/* Question 3: Budget Range (Radio Pills matching Reference 04) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Budget Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'Below ₹500',
                    '₹500 - ₹1,000',
                    '₹1,000 - ₹2,000',
                    'Above ₹2,000',
                  ].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setBudgetRange(range)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        budgetRange === range
                          ? 'bg-[#F7E6EB] border-[#145C45] text-[#145C45] shadow-xs'
                          : 'bg-[#FCFAF9] border-gray-200 text-[#77716F] hover:border-gray-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Required Arrival Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider flex items-center justify-between">
                  <span>Required Delivery Date</span>
                  <span className="text-[11px] font-normal text-[#77716F]">
                    Standard Crafting: ~5-7 Days
                  </span>
                </label>
                <input
                  type="date"
                  value={requiredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                />

                {isUrgent && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Urgent date selected (&lt; 4 days)! We will fast-track your slot via WhatsApp immediately upon submission.
                    </span>
                  </div>
                )}
              </div>

              {/* Question 5: Reference Images (Optional - matching Reference 04) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Reference Images (Optional)
                </label>
                <label className="border-2 border-dashed border-[#E8B5C3] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F7E6EB]/30 transition-colors bg-[#FCFAF9]">
                  <Upload className="w-8 h-8 text-[#145C45] mb-2" />
                  <span className="text-xs font-semibold text-[#292626]">
                    Upload Images
                  </span>
                  <span className="text-[11px] text-[#77716F]">
                    Drag & drop or click to upload Pinterest/Instagram references
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>

                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {uploadedFiles.map((file, i) => (
                      <span
                        key={i}
                        className="bg-white border border-[#E8B5C3] px-3 py-1 rounded-full text-xs text-[#292626] flex items-center gap-1.5 shadow-2xs"
                      >
                        <Check className="w-3 h-3 text-[#145C45]" />
                        <span className="truncate max-w-[150px]">{file}</span>
                        <button onClick={() => removeUploadedFile(i)} className="text-red-500 hover:text-red-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Next Button matching Reference 04 */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!ideaDescription.trim()) {
                      alert('Please describe your idea before proceeding.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-4 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-sm hover:bg-[#dfa3b4] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & PREFERENCES */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Preferred Color Aesthetic / Palette
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Soft Blush Pink & Emerald',
                    'Vintage Kraft & Warm Vanilla',
                    'Deep Emerald & Gold Leaf',
                    'Pastel Lavender & Pearl',
                    'Monochrome Minimal',
                    'Let Studio Surprise Me',
                  ].map((pal) => (
                    <button
                      key={pal}
                      type="button"
                      onClick={() => setPalettePreference(pal)}
                      className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                        palettePreference === pal
                          ? 'bg-[#F7E6EB] border-[#145C45] text-[#145C45] font-semibold'
                          : 'bg-[#FCFAF9] border-gray-200 text-[#77716F]'
                      }`}
                    >
                      {pal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Special Love Note / Message
                </label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Optional message to be handwritten in gold ink..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FCFAF9] border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                />
              </div>

              {/* Packaging selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#292626] uppercase tracking-wider block">
                  Packaging Upgrade
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      packagingPreference === 'Standard Eco Kraft'
                        ? 'bg-[#F7E6EB]/50 border-[#145C45]'
                        : 'bg-[#FCFAF9] border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pkg"
                      checked={packagingPreference === 'Standard Eco Kraft'}
                      onChange={() => setPackagingPreference('Standard Eco Kraft')}
                      className="accent-[#145C45] mt-1"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#292626] block">
                        Standard Eco Kraft Box (Included)
                      </span>
                      <span className="text-[11px] text-[#77716F]">
                        Recycled box with satin ribbon and botanical tag.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      packagingPreference === 'Luxury Keepsake Velvet Box (+₹180)'
                        ? 'bg-[#F7E6EB]/50 border-[#145C45]'
                        : 'bg-[#FCFAF9] border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pkg"
                      checked={packagingPreference === 'Luxury Keepsake Velvet Box (+₹180)'}
                      onChange={() => setPackagingPreference('Luxury Keepsake Velvet Box (+₹180)')}
                      className="accent-[#145C45] mt-1"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#292626] block">
                        Luxury Keepsake Velvet Box (+₹180)
                      </span>
                      <span className="text-[11px] text-[#77716F]">
                        Rigid heirloom box with metallic wax seal & petals.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-full border border-gray-300 text-xs font-semibold text-[#77716F] hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Review & Complete Contact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {step === 3 && (
            <form onSubmit={handleSubmitEnquiry} className="space-y-6 animate-fade-in">
              {/* Summary card */}
              <div className="bg-[#FCFAF9] rounded-2xl p-4 border border-[#F7E6EB] space-y-2 text-xs">
                <span className="font-bold text-[#145C45] uppercase tracking-wider block">
                  Commission Summary
                </span>
                <p><strong>Idea:</strong> {ideaDescription}</p>
                <p><strong>Occasion:</strong> {occasion}</p>
                <p><strong>Target Budget:</strong> {budgetRange}</p>
                <p><strong>Arrival Date:</strong> {requiredDate} {isUrgent ? '(Rush)' : ''}</p>
                <p><strong>Aesthetic Theme:</strong> {palettePreference}</p>
                <p><strong>Packaging:</strong> {packagingPreference}</p>
                {uploadedFiles.length > 0 && (
                  <p><strong>Files Attached:</strong> {uploadedFiles.join(', ')}</p>
                )}
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-medium text-[#292626]">
                  Your Contact Information
                </h3>
                <p className="text-xs text-[#77716F]">
                  We will reach out on WhatsApp to share draft layouts, photo mockups, and confirm delivery details.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Priyanshu Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">WhatsApp Number *</label>
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
                      placeholder="e.g. priyanshu@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Delivery City & State *</label>
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="e.g. Bangalore, Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#145C45]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 rounded-full border border-gray-300 text-xs font-semibold text-[#77716F] hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-4 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Gift className="w-4 h-4 text-emerald-200" />
                  <span>Submit Custom Gift Enquiry</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
