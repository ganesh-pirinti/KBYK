import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EnquiryRequest,
  Product,
  CustomerReview,
  ProductionRecord,
  ProductionStage,
  AuditLogEntry,
  StoreCmsSettings,
} from '../types';
import { INITIAL_ENQUIRIES } from '../data/sampleEnquiries';
import { PRODUCTS } from '../data/products';
import { REVIEWS } from '../data/reviews';

interface AdminContextType {
  enquiries: EnquiryRequest[];
  products: Product[];
  reviews: CustomerReview[];
  productionRecords: ProductionRecord[];
  cmsSettings: StoreCmsSettings;
  auditLogs: AuditLogEntry[];
  addEnquiry: (enquiry: Omit<EnquiryRequest, 'id' | 'createdAt' | 'status'>) => string;
  updateEnquiryStatus: (id: string, status: EnquiryRequest['status'], note?: string) => void;
  deleteEnquiry: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleReviewApproval: (id: string) => void;
  addReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
  generateWhatsAppReply: (enquiry: EnquiryRequest, templateKey: string) => string;
  updateProductionStage: (recordId: string, stage: ProductionStage) => void;
  toggleQCCheck: (recordId: string, qcItemId: string) => void;
  verifyPackaging: (recordId: string, verified: boolean) => void;
  reportProductionIssue: (recordId: string, issue: string) => void;
  updateCmsSettings: (settings: Partial<StoreCmsSettings>) => void;
  exportStoreData: () => string;
  restoreStoreData: (jsonStr: string) => { success: boolean; message: string };
}

const defaultProductionRecords: ProductionRecord[] = [
  {
    id: 'PROD-8941',
    orderId: 'KBYK-8941',
    customerName: 'Aarav Sharma',
    productSummary: 'Memory Keepsake Scrapbook Album (15 Polaroids)',
    stage: 'In Production',
    assignedArtisan: 'Kavita M. (Lead Bookbinder)',
    requiredArrivalDate: '2026-11-06',
    isUrgent: false,
    personalisationInstructions: 'Personalised cover with "Aarav & Priya - 3 Years of Us" in gold foil calligraphy.',
    referenceImages: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'],
    qcChecklist: [
      { id: 'qc-1', label: 'Spelling & calligraphy verified', checked: true },
      { id: 'qc-2', label: 'Photo alignment & corner stickers secure', checked: true },
      { id: 'qc-3', label: 'Ribbon tie & wax seal intact', checked: false },
      { id: 'qc-4', label: 'Handwritten note verified', checked: true },
      { id: 'qc-5', label: 'Dried botanical packing inclusion', checked: false },
    ],
    packagingVerified: false,
    internalStudioNotes: 'Customer requested extra blush pink dried rose petals in the gift box.',
    updatedAt: '2026-10-28 02:15 PM',
  },
  {
    id: 'PROD-8940',
    orderId: 'KBYK-8940',
    customerName: 'Simran Kaur',
    productSummary: '3-Layer Hexagon Explosion Box (Sweet 16)',
    stage: 'Quality Check',
    assignedArtisan: 'Pooja V. (Origami Specialist)',
    requiredArrivalDate: '2026-11-01',
    isUrgent: true,
    personalisationInstructions: 'Pastel lavender theme with 24 mini photos and pop-up chocolate cube in center.',
    referenceImages: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'],
    qcChecklist: [
      { id: 'qc-1', label: 'Spelling & calligraphy verified', checked: true },
      { id: 'qc-2', label: 'Photo alignment & corner stickers secure', checked: true },
      { id: 'qc-3', label: 'Ribbon tie & wax seal intact', checked: true },
      { id: 'qc-4', label: 'Handwritten note verified', checked: true },
      { id: 'qc-5', label: 'Dried botanical packing inclusion', checked: true },
    ],
    packagingVerified: true,
    internalStudioNotes: 'Urgent rush delivery. Fast-tracked through courier priority air.',
    updatedAt: '2026-10-28 04:30 PM',
  },
  {
    id: 'PROD-8938',
    orderId: 'KBYK-8938',
    customerName: 'Divya Nair',
    productSummary: 'Illuminated Wooden Photo Lamp Frame',
    stage: 'Awaiting Materials',
    assignedArtisan: 'Arjun R. (Woodcraft Specialist)',
    requiredArrivalDate: '2026-11-03',
    isUrgent: false,
    personalisationInstructions: 'Warm teak wood finish with high-contrast night sky silhouette portrait.',
    referenceImages: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80'],
    qcChecklist: [
      { id: 'qc-1', label: 'Spelling & calligraphy verified', checked: false },
      { id: 'qc-2', label: 'Photo alignment & corner stickers secure', checked: false },
      { id: 'qc-3', label: 'Ribbon tie & wax seal intact', checked: false },
      { id: 'qc-4', label: 'Handwritten note verified', checked: false },
      { id: 'qc-5', label: 'Dried botanical packing inclusion', checked: false },
    ],
    packagingVerified: false,
    internalStudioNotes: 'Awaiting arrival of seasoned birch timber planks.',
    updatedAt: '2026-10-28 01:00 PM',
  },
];

const defaultCmsSettings: StoreCmsSettings = {
  announcementText: '✨ Handcrafted with Love • Free Express Delivery Across India on Orders Over ₹999 • DM @_.kbyk._',
  heroHeadline: 'Gifts that feel like they were made just for them.',
  heroTagline: 'Personalised keepsakes, hand-bound memory scrapbooks, and bespoke celebration boxes handcrafted to hold your most cherished moments forever.',
  freeShippingMinimum: 999,
  standardLeadTimeDays: 5,
  returnPolicySnippet: 'Because each gift is custom made with personal photos and names, returns are supported if damage occurs in transit.',
  contactEmail: 'hello.kbyk@gmail.com',
  contactPhone: '+91 98201 44552',
};

const defaultAuditLogs: AuditLogEntry[] = [
  {
    id: 'LOG-1',
    timestamp: '2026-10-28 17:30',
    actor: 'Studio Owner',
    action: 'Status Update',
    details: 'Moved Enquiry KBYK-8940 to Quality Check',
  },
  {
    id: 'LOG-2',
    timestamp: '2026-10-28 16:15',
    actor: 'Studio Owner',
    action: 'Password Configuration',
    details: 'Salted cryptographic PBKDF2 hash initialized',
  },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enquiries, setEnquiries] = useState<EnquiryRequest[]>(() => {
    try {
      const saved = localStorage.getItem('kbyk_admin_enquiries');
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kbyk_admin_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('kbyk_admin_reviews');
      return saved ? JSON.parse(saved) : REVIEWS;
    } catch {
      return REVIEWS;
    }
  });

  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kbyk_admin_production');
      return saved ? JSON.parse(saved) : defaultProductionRecords;
    } catch {
      return defaultProductionRecords;
    }
  });

  const [cmsSettings, setCmsSettings] = useState<StoreCmsSettings>(() => {
    try {
      const saved = localStorage.getItem('kbyk_admin_cms');
      return saved ? JSON.parse(saved) : defaultCmsSettings;
    } catch {
      return defaultCmsSettings;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kbyk_admin_audit');
      return saved ? JSON.parse(saved) : defaultAuditLogs;
    } catch {
      return defaultAuditLogs;
    }
  });

  useEffect(() => {
    localStorage.setItem('kbyk_admin_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('kbyk_admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kbyk_admin_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kbyk_admin_production', JSON.stringify(productionRecords));
  }, [productionRecords]);

  useEffect(() => {
    localStorage.setItem('kbyk_admin_cms', JSON.stringify(cmsSettings));
  }, [cmsSettings]);

  useEffect(() => {
    localStorage.setItem('kbyk_admin_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAction = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Studio Owner',
      action,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 49)]); // keep last 50
  };

  const addEnquiry = (enquiryData: Omit<EnquiryRequest, 'id' | 'createdAt' | 'status'>) => {
    const id = `KBYK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newEnquiry: EnquiryRequest = {
      ...enquiryData,
      id,
      createdAt,
      status: 'New',
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Also automatically create a pending production record
    const newProdRecord: ProductionRecord = {
      id: `PROD-${id.replace('KBYK-', '')}`,
      orderId: id,
      customerName: enquiryData.customerName,
      productSummary: enquiryData.items.map((i) => i.product.name).join(', ') || enquiryData.customIdeaDescription || 'Custom Gift',
      stage: 'Awaiting Materials',
      assignedArtisan: 'Unassigned (Craft Desk)',
      requiredArrivalDate: enquiryData.requiredArrivalDate,
      isUrgent: enquiryData.isUrgent,
      personalisationInstructions: enquiryData.notes || 'See customer notes',
      referenceImages: enquiryData.referenceImages || [],
      qcChecklist: [
        { id: 'qc-1', label: 'Spelling & calligraphy verified', checked: false },
        { id: 'qc-2', label: 'Photo alignment & corner stickers secure', checked: false },
        { id: 'qc-3', label: 'Ribbon tie & wax seal intact', checked: false },
        { id: 'qc-4', label: 'Handwritten note verified', checked: false },
        { id: 'qc-5', label: 'Dried botanical packing inclusion', checked: false },
      ],
      packagingVerified: false,
      internalStudioNotes: 'New online commission received.',
      updatedAt: 'Just now',
    };

    setProductionRecords((prev) => [newProdRecord, ...prev]);
    logAction('New Order Submitted', `Created enquiry ${id} for ${enquiryData.customerName}`);

    return id;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryRequest['status'], note?: string) => {
    setEnquiries((prev) =>
      prev.map((enq) => {
        if (enq.id === id) {
          return {
            ...enq,
            status,
            notes: note !== undefined ? note : enq.notes,
          };
        }
        return enq;
      })
    );
    logAction('Status Updated', `Enquiry ${id} updated to ${status}`);
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((enq) => enq.id !== id));
    logAction('Deleted Enquiry', `Removed enquiry ${id}`);
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    logAction('Product Added', `Added ${product.name} to catalogue`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    logAction('Product Updated', `Updated product ${updated.name}`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAction('Product Deleted', `Removed product ${id}`);
  };

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'date'>) => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      approved: true,
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const generateWhatsAppReply = (enquiry: EnquiryRequest, templateKey: string): string => {
    const itemsList = enquiry.items.map((i) => `• ${i.product.name} (Qty: ${i.quantity}, ₹${i.totalItemPrice})`).join('\n');
    
    switch (templateKey) {
      case 'greeting':
        return `Hi ${enquiry.customerName}! ✨ Warm greetings from KBYK handmade gifts. We received your bespoke gifting request (#${enquiry.id}) for ${enquiry.occasion}! We would love to bring this to life for you. May I ask you to share your chosen photographs via this chat or a Google Drive link so we can begin the draft layout? 🌸`;
      
      case 'confirmation':
        return `Hello ${enquiry.customerName}! 💖 Your KBYK order #${enquiry.id} is confirmed!\n\nSummary:\n${itemsList}\nTotal: ₹${enquiry.estimatedTotal}\nTarget Delivery: ${enquiry.requiredArrivalDate}\n\nTo lock your slot on our crafting calendar, kindly transfer the 50% advance (₹${Math.round(enquiry.estimatedTotal * 0.5)}) via UPI: kbyk.artisan@okaxis or GPay/PhonePe to 9820144552. Let us know once sent! ✨`;
      
      case 'crafting_update':
        return `Hi ${enquiry.customerName}! 🎨 Quick magical update from our studio: your handmade ${enquiry.items[0]?.product.name || 'keepsake'} is currently being assembled with love and dried botanical accents! We will share final video preview before packing. ✨`;
      
      case 'dispatch':
        return `Yay ${enquiry.customerName}! 🎉 Your handcrafted package from KBYK has been dispatched with love and utmost protection! Tracking ID: DTDC-IN-${Math.floor(10000000 + Math.random() * 90000000)}. Expected delivery by ${enquiry.requiredArrivalDate}. We hope it brings pure joy! Tag us @_.kbyk._ when you unbox! 🌸`;

      default:
        return `Hi ${enquiry.customerName}, thank you for reaching out to KBYK! We are reviewing your gifting enquiry #${enquiry.id} and will assist you shortly.`;
    }
  };

  const updateProductionStage = (recordId: string, stage: ProductionStage) => {
    setProductionRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, stage, updatedAt: 'Just now' } : rec))
    );
    logAction('Production Stage Changed', `Record ${recordId} set to ${stage}`);
  };

  const toggleQCCheck = (recordId: string, qcItemId: string) => {
    setProductionRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          const updatedChecks = rec.qcChecklist.map((item) =>
            item.id === qcItemId ? { ...item, checked: !item.checked } : item
          );
          return { ...rec, qcChecklist: updatedChecks };
        }
        return rec;
      })
    );
  };

  const verifyPackaging = (recordId: string, verified: boolean) => {
    setProductionRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, packagingVerified: verified } : rec))
    );
  };

  const reportProductionIssue = (recordId: string, issue: string) => {
    setProductionRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, issueReported: issue } : rec))
    );
    logAction('QC Issue Flagged', `Issue logged on ${recordId}: ${issue}`);
  };

  const updateCmsSettings = (newSettings: Partial<StoreCmsSettings>) => {
    setCmsSettings((prev) => ({ ...prev, ...newSettings }));
    logAction('CMS Updated', 'Storefront banners or policies updated');
  };

  const exportStoreData = (): string => {
    const backup = {
      timestamp: new Date().toISOString(),
      enquiries,
      products,
      reviews,
      productionRecords,
      cmsSettings,
    };
    return JSON.stringify(backup, null, 2);
  };

  const restoreStoreData = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.enquiries) setEnquiries(data.enquiries);
      if (data.products) setProducts(data.products);
      if (data.reviews) setReviews(data.reviews);
      if (data.productionRecords) setProductionRecords(data.productionRecords);
      if (data.cmsSettings) setCmsSettings(data.cmsSettings);
      logAction('Database Restored', 'Restored store snapshot from JSON backup');
      return { success: true, message: 'Store database snapshot successfully restored!' };
    } catch (e: any) {
      return { success: false, message: `Invalid backup file: ${e.message}` };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        enquiries,
        products,
        reviews,
        productionRecords,
        cmsSettings,
        auditLogs,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleReviewApproval,
        addReview,
        generateWhatsAppReply,
        updateProductionStage,
        toggleQCCheck,
        verifyPackaging,
        reportProductionIssue,
        updateCmsSettings,
        exportStoreData,
        restoreStoreData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
