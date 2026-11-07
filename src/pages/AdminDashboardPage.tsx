import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useStudioAuth } from '../context/StudioAuthContext';
import { PortalSecuritySettings } from '../components/admin/PortalSecuritySettings';
import { ProductionQCTab } from '../components/admin/ProductionQCTab';
import { SupportQueueTab } from '../components/admin/SupportQueueTab';
import { PromotionsTab } from '../components/admin/PromotionsTab';
import { FinancialReportingTab } from '../components/admin/FinancialReportingTab';
import { StoreCmsTab } from '../components/admin/StoreCmsTab';
import { BackupRecoveryTab } from '../components/admin/BackupRecoveryTab';
import { EnquiryRequest, Product, CustomerReview } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MessageCircle, 
  Copy, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  X, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Star, 
  ExternalLink, 
  ChevronRight, 
  LogOut, 
  Send,
  Lock,
  KeyRound,
  ShieldAlert,
  Scissors,
  Tag,
  Headphones,
  Sliders,
  DollarSign,
  Database
} from 'lucide-react';

interface AdminDashboardPageProps {
  onBackToStorefront: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToStorefront,
}) => {
  const {
    enquiries,
    products,
    reviews,
    productionRecords,
    updateEnquiryStatus,
    deleteEnquiry,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    toggleReviewApproval,
    generateWhatsAppReply,
  } = useAdmin();

  const { lockPortal } = useStudioAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'enquiries' | 'production' | 'products' | 'promotions' | 'support' | 'financials' | 'reviews' | 'insights' | 'cms' | 'backups' | 'security'
  >('enquiries');

  // Enquiries filter & search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRequest | null>(null);
  const [replyTemplate, setReplyTemplate] = useState('greeting');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);

  // New product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Gift Boxes');
  const [newProductPrice, setNewProductPrice] = useState('999');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImg, setNewProductImg] = useState('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80');

  // Statistics
  const totalEnquiriesCount = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const inPrepCount = enquiries.filter((e) => e.status === 'In Preparation' || e.status === 'Confirmed').length;
  const totalPipelineValue = enquiries.reduce((acc, curr) => acc + (curr.estimatedTotal || 0), 0);

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const matchesSearch =
      enquirySearch === '' ||
      enq.customerName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.id.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.customerCity.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      enq.occasion.toLowerCase().includes(enquirySearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopySummary = (enq: EnquiryRequest) => {
    const text = `KBYK ENQUIRY #${enq.id}
Customer: ${enq.customerName} (${enq.customerPhone})
Email: ${enq.customerEmail}
City: ${enq.customerCity}
Occasion: ${enq.occasion}
Required By: ${enq.requiredArrivalDate} ${enq.isUrgent ? '[URGENT]' : ''}
Est. Total: ₹${enq.estimatedTotal}
Items: ${enq.items.map((i) => i.product.name).join(', ') || enq.customIdeaDescription || 'Custom Commission'}
Notes: ${enq.notes || 'None'}`;

    navigator.clipboard?.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleCopyReplyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    const newProd: Product = {
      id: `kbyk-${Date.now()}`,
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/\s+/g, '-'),
      category: newProductCategory as any,
      price: Number(newProductPrice) || 899,
      rating: 5.0,
      reviewCount: 1,
      leadTimeDays: 4,
      thumbnail: newProductImg,
      images: [newProductImg],
      shortDescription: newProductDesc || 'Handcrafted bespoke gift created in studio.',
      description: newProductDesc || 'Handmade with luxury paperboards and dried florals.',
      occasions: ['Birthdays', 'Anniversaries', 'Friendship'],
      inStock: true,
      featured: true,
    };

    addProduct(newProd);
    setShowAddProductModal(false);
    setNewProductName('');
    setNewProductDesc('');
  };

  return (
    <div className="min-h-screen bg-[#1E2422] text-[#F3F4F6] font-sans antialiased">
      
      {/* Top Admin Executive Bar */}
      <header className="bg-[#161B19] border-b border-[#2C3532] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#145C45] flex items-center justify-center text-white font-serif font-bold text-lg">
            K
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
              KBYK Studio Owner Portal
              <span className="text-[10px] font-sans bg-[#145C45] text-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Admin Prototype
              </span>
            </h1>
            <span className="text-xs text-gray-400">
              Handcrafted Gifting Pipeline & Catalogue Manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={lockPortal}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-xs font-semibold text-red-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Lock Studio Portal and require password on next entry"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Lock Portal</span>
            <span className="sm:hidden">Lock</span>
          </button>

          <button
            onClick={onBackToStorefront}
            className="px-4 py-2 rounded-xl bg-[#2A3330] hover:bg-[#34403C] text-xs font-semibold text-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <span>Exit to Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Prototype Banner Notification */}
        <div className="bg-[#161B19] border border-[#2C3532] p-3.5 rounded-2xl flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Owner Prototype Mode:</strong> All updates (enquiry status, product catalog, review approvals) persist locally in browser storage.
            </span>
          </span>
          <span className="text-gray-500 hidden sm:inline">Version 1.0 (Studio Edition)</span>
        </div>

        {/* 4 Overview Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#161B19] p-5 rounded-2xl border border-[#2C3532] shadow-xs">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
              Total Enquiries
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-3xl font-bold text-white">{totalEnquiriesCount}</span>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">From web & custom orders</span>
          </div>

          <div className="bg-[#161B19] p-5 rounded-2xl border border-[#2C3532] shadow-xs">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
              New Unreviewed
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-3xl font-bold text-amber-400">{newEnquiriesCount}</span>
              <span className="text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full font-semibold">
                Needs Reply
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">Awaiting WhatsApp outreach</span>
          </div>

          <div className="bg-[#161B19] p-5 rounded-2xl border border-[#2C3532] shadow-xs">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
              In Handcrafting
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-3xl font-bold text-emerald-300">{inPrepCount}</span>
              <span className="text-xs text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full font-semibold">
                Studio Slots
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">Currently on crafting desk</span>
          </div>

          <div className="bg-[#161B19] p-5 rounded-2xl border border-[#2C3532] shadow-xs">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
              Est. Pipeline Value
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-3xl font-bold text-white">₹{totalPipelineValue}</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                Est.
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">{products.length} live catalog items</span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2C3532] pb-3 overflow-x-auto text-xs sm:text-sm scrollbar-none">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            Orders & Enquiries ({enquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('production')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'production'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-pink-300" />
            <span>Production & QC ({productionRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            Catalogue ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'promotions'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-300" />
            <span>Coupons & Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'support'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-blue-300" />
            <span>Support Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'financials'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Revenue & Margins</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            Reviews ({reviews.length})
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cms'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-gray-300" />
            <span>Store CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('backups')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'backups'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backups & Recovery</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-[#2A3330]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Security</span>
          </button>
        </div>

        {/* TAB 1: ENQUIRIES TABLE & DETAILS DRAWER */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search customer name, city, ID, or occasion..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#161B19] border border-[#2C3532] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#145C45]"
                />
              </div>

              {/* Status filter dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#161B19] border border-[#2C3532] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#145C45]"
                >
                  <option value="All">All Statuses ({enquiries.length})</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Preparation">In Preparation</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Enquiries Data Table */}
            <div className="bg-[#161B19] rounded-2xl border border-[#2C3532] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101413] border-b border-[#2C3532] text-gray-400 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Enquiry ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Occasion & Date</th>
                      <th className="py-3.5 px-4">Est. Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C3532]">
                    {filteredEnquiries.map((enq) => {
                      const getStatusBadge = (st: string) => {
                        switch (st) {
                          case 'New':
                            return 'bg-amber-950/80 text-amber-300 border-amber-800';
                          case 'Contacted':
                            return 'bg-blue-950/80 text-blue-300 border-blue-800';
                          case 'Confirmed':
                            return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
                          case 'In Preparation':
                            return 'bg-purple-950/80 text-purple-300 border-purple-800';
                          case 'Dispatched':
                            return 'bg-teal-950/80 text-teal-300 border-teal-800';
                          case 'Completed':
                            return 'bg-gray-800 text-gray-300 border-gray-700';
                          default:
                            return 'bg-red-950/80 text-red-300 border-red-800';
                        }
                      };

                      return (
                        <tr
                          key={enq.id}
                          className="hover:bg-[#1E2522] transition-colors cursor-pointer"
                          onClick={() => setSelectedEnquiry(enq)}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            {enq.id}
                            {enq.isUrgent && (
                              <span className="ml-1 text-[9px] bg-red-950 text-red-400 px-1 py-0.5 rounded font-sans">
                                RUSH
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white block">{enq.customerName}</span>
                            <span className="text-gray-400 text-[11px]">{enq.customerCity} • {enq.customerPhone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-white block font-medium">{enq.occasion}</span>
                            <span className="text-gray-400 text-[11px]">Due: {enq.requiredArrivalDate}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            ₹{enq.estimatedTotal}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                                enq.status
                              )}`}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEnquiry(enq);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#2A3330] hover:bg-[#34403C] text-emerald-300 text-xs font-medium"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Slide-over Enquiry Detail Modal */}
            {selectedEnquiry && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
                <div className="bg-[#161B19] rounded-3xl border border-[#2C3532] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#2C3532] pb-4">
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
                        Customer Enquiry Detail
                      </span>
                      <h3 className="font-mono text-xl font-bold text-emerald-400">
                        {selectedEnquiry.id}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2A3330]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Customer Information & Summary */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-[#101413] p-4 rounded-2xl border border-[#2C3532]">
                    <div>
                      <span className="text-gray-500 block">Customer Name</span>
                      <strong className="text-white text-sm">{selectedEnquiry.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Phone / WhatsApp</span>
                      <span className="text-emerald-400 font-mono font-medium">{selectedEnquiry.customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Email Address</span>
                      <span className="text-gray-300">{selectedEnquiry.customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Delivery Destination</span>
                      <span className="text-gray-300">{selectedEnquiry.customerCity} (PIN: {selectedEnquiry.pincode || 'N/A'})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Occasion & Target Date</span>
                      <span className="text-white font-medium">{selectedEnquiry.occasion} • Due {selectedEnquiry.requiredArrivalDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Packaging</span>
                      <span className="text-emerald-300 font-medium">{selectedEnquiry.packagingPreference}</span>
                    </div>
                  </div>

                  {/* Items or Custom Idea Details */}
                  <div className="space-y-2 text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block">
                      Enquired Items & Specifications
                    </span>

                    {selectedEnquiry.items.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEnquiry.items.map((it) => (
                          <div key={it.id} className="bg-[#1F2623] p-3 rounded-xl border border-[#2C3532] flex items-center justify-between">
                            <div>
                              <strong className="text-white block">{it.product.name} (Qty: {it.quantity})</strong>
                              <span className="text-gray-400 text-[11px]">
                                {it.selectedSize} • {it.selectedTheme} • Inscription: "{it.personalisedName || 'None'}"
                              </span>
                            </div>
                            <span className="font-bold text-white">₹{it.totalItemPrice}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#1F2623] p-3.5 rounded-xl border border-[#2C3532]">
                        <strong className="text-emerald-300 block mb-1">Bespoke Custom Idea:</strong>
                        <p className="text-gray-300 leading-relaxed">{selectedEnquiry.customIdeaDescription || 'No description provided'}</p>
                      </div>
                    )}

                    {selectedEnquiry.notes && (
                      <div className="bg-[#1A211E] p-3 rounded-xl border border-gray-800 text-[11px] text-gray-400">
                        <strong className="text-gray-300">Studio Notes:</strong> {selectedEnquiry.notes}
                      </div>
                    )}
                  </div>

                  {/* Change Status Dropdown */}
                  <div className="flex items-center justify-between p-3 bg-[#101413] rounded-xl border border-[#2C3532] text-xs">
                    <span className="text-gray-300 font-semibold">Update Enquiry Status:</span>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => {
                        updateEnquiryStatus(selectedEnquiry.id, e.target.value as any);
                        setSelectedEnquiry((prev) => prev ? { ...prev, status: e.target.value as any } : null);
                      }}
                      className="bg-[#161B19] border border-[#2C3532] text-white rounded-lg px-3 py-1.5 font-bold focus:outline-none focus:border-emerald-400"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Preparation">In Preparation</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Quick Reply Templates & WhatsApp Generator */}
                  <div className="space-y-3 border-t border-[#2C3532] pt-4 text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block">
                      Quick Studio WhatsApp Response Templates
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: 'greeting', label: '01. Welcome & Photos' },
                        { key: 'confirmation', label: '02. 50% Advance UPI' },
                        { key: 'crafting_update', label: '03. Crafting Update' },
                        { key: 'dispatch', label: '04. Dispatch & Tracking' },
                      ].map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setReplyTemplate(t.key)}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            replyTemplate === t.key
                              ? 'bg-[#145C45] text-white'
                              : 'bg-[#2A3330] text-gray-400 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#101413] p-3 rounded-xl border border-[#2C3532] text-gray-300 text-xs font-mono whitespace-pre-line leading-relaxed">
                      {generateWhatsAppReply(selectedEnquiry, replyTemplate)}
                    </div>

                    {/* WhatsApp Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleCopyReplyText(generateWhatsAppReply(selectedEnquiry, replyTemplate))}
                        className="px-4 py-2 rounded-xl bg-[#2A3330] hover:bg-[#34403C] text-white font-medium flex items-center gap-1.5"
                      >
                        {copiedReply ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedReply ? 'Copied Message!' : 'Copy Template'}</span>
                      </button>

                      <a
                        href={`https://wa.me/${selectedEnquiry.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generateWhatsAppReply(selectedEnquiry, replyTemplate))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl bg-[#145C45] hover:bg-[#1C7B5D] text-white font-semibold flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-200" />
                        <span>Open WhatsApp with Message</span>
                      </a>
                    </div>
                  </div>

                  {/* Copy Summary & Close */}
                  <div className="flex items-center justify-between border-t border-[#2C3532] pt-4 text-xs">
                    <button
                      onClick={() => handleCopySummary(selectedEnquiry)}
                      className="text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSummary ? 'Summary Copied!' : 'Copy Summary'}</span>
                    </button>

                    <button
                      onClick={() => deleteEnquiry(selectedEnquiry.id)}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Archive Enquiry</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PRODUCT CATALOGUE MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Manage your active handcrafted keepsakes, pricing, and visibility.
              </span>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 rounded-xl bg-[#145C45] hover:bg-[#1C7B5D] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Keepsake</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-[#161B19] rounded-2xl border border-[#2C3532] p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={p.thumbnail} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-[#2C3532]" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">{p.category}</span>
                      <h4 className="font-serif text-sm font-semibold text-white truncate">{p.name}</h4>
                      <span className="text-xs font-bold text-gray-300">₹{p.price}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2">{p.shortDescription}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2C3532] text-xs">
                    <button
                      onClick={() => toggleFeatured(p.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.featured ? 'bg-amber-950 text-amber-300' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {p.featured ? '★ Featured' : 'Normal'}
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add product modal */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
                <div className="bg-[#161B19] rounded-3xl border border-[#2C3532] p-6 max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2C3532] pb-3">
                    <h3 className="font-serif text-lg text-white font-medium">Add New Handcrafted Gift</h3>
                    <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                    <div>
                      <label className="text-gray-400 block mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="e.g. Velvet Keepsake Box"
                        className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Category</label>
                        <select
                          value={newProductCategory}
                          onChange={(e) => setNewProductCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white focus:outline-none focus:border-emerald-400"
                        >
                          <option value="Scrapbooks">Scrapbooks</option>
                          <option value="Gift Boxes">Gift Boxes</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Home Decor">Home Decor</option>
                          <option value="Combo">Combo</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProductImg}
                        onChange={(e) => setNewProductImg(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white focus:outline-none focus:border-emerald-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={newProductDesc}
                        onChange={(e) => setNewProductDesc(e.target.value)}
                        placeholder="Key features, materials, custom notes..."
                        className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-white focus:outline-none focus:border-emerald-400 text-xs"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProductModal(false)}
                        className="px-4 py-2 rounded-xl bg-[#2A3330] text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#145C45] text-white font-semibold"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEW MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <span className="text-xs text-gray-400 block">
              Moderate submitted customer unboxing reviews and toggle display on storefront.
            </span>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-[#161B19] rounded-2xl border border-[#2C3532] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img src={rev.customerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-xs">{rev.customerName}</strong>
                        <span className="text-gray-500 text-[11px]">{rev.city} • {rev.occasion}</span>
                        <span className="text-amber-400 text-xs">★ {rev.rating}.0</span>
                      </div>
                      <p className="text-xs text-gray-300 italic mt-1">"{rev.reviewText}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => toggleReviewApproval(rev.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        rev.approved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {rev.approved ? '✓ Approved' : 'Pending'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDIO INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-[#161B19] rounded-2xl p-5 border border-[#2C3532] space-y-3">
              <span className="text-gray-400 uppercase font-bold tracking-wider block">
                Top Searched Customer Keywords
              </span>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Anniversary scrapbook under ₹1000”</span>
                  <span className="font-bold text-emerald-400">142 searches</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Explosion box with polaroid photos”</span>
                  <span className="font-bold text-emerald-400">118 searches</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Best friend matching keychains”</span>
                  <span className="font-bold text-emerald-400">96 searches</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Illuminated photo frame”</span>
                  <span className="font-bold text-emerald-400">74 searches</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#161B19] rounded-2xl p-5 border border-[#2C3532] space-y-3">
              <span className="text-gray-400 uppercase font-bold tracking-wider block">
                Zero-Result Search Terms (Opportunities to Add)
              </span>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Resin ring platter for engagement”</span>
                  <span className="font-bold text-amber-400">32 requests</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Wooden memory calendar”</span>
                  <span className="font-bold text-amber-400">21 requests</span>
                </li>
                <li className="flex justify-between py-1 border-b border-[#2C3532]">
                  <span>“Hand-embroidered hoop frame”</span>
                  <span className="font-bold text-amber-400">18 requests</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTION & QUALITY CONTROL */}
        {activeTab === 'production' && (
          <ProductionQCTab />
        )}

        {/* TAB: COUPONS, GIFT CARDS & PROMOTIONS */}
        {activeTab === 'promotions' && (
          <PromotionsTab />
        )}

        {/* TAB: CUSTOMER SUPPORT QUEUE */}
        {activeTab === 'support' && (
          <SupportQueueTab />
        )}

        {/* TAB: FINANCIAL REPORTING & ABANDONED LEADS */}
        {activeTab === 'financials' && (
          <FinancialReportingTab />
        )}

        {/* TAB: STORE CMS & DATABASE BACKUP */}
        {activeTab === 'cms' && (
          <StoreCmsTab />
        )}

        {/* TAB: BACKUPS & DISASTER RECOVERY */}
        {activeTab === 'backups' && (
          <BackupRecoveryTab />
        )}

        {/* TAB: SECURITY & ACCESS CONTROL */}
        {activeTab === 'security' && (
          <PortalSecuritySettings />
        )}

      </div>
    </div>
  );
};
