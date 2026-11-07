export type OccasionType = 
  | 'Birthdays'
  | 'Anniversaries'
  | 'Friendship'
  | 'Festivals'
  | 'Just Because'
  | 'Proposals'
  | 'Valentine'
  | 'Graduation';

export type CategoryType = 
  | 'Gift Boxes'
  | 'Scrapbooks'
  | 'Accessories'
  | 'Home Decor'
  | 'Combo'
  | 'Handmade Keepsakes';

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CustomizationOption {
  type: 'text' | 'select' | 'color' | 'image' | 'checkbox';
  label: string;
  placeholder?: string;
  options?: string[];
  colors?: { name: string; hex: string }[];
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  leadTimeDays: number; // e.g. 4-6 days
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  occasions: OccasionType[];
  sizes?: string[]; // e.g. ['A5', 'A4']
  themes?: string[]; // e.g. ['Floral', 'Minimal', 'Vintage', 'Custom']
  availableColors?: { name: string; hex: string }[];
  addOns?: ProductAddOn[];
  materials?: string[];
  includes?: string[];
  inStock: boolean;
  personalisationNotice?: string;
}

export interface CartItem {
  id: string; // unique item id
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedTheme?: string;
  selectedColor?: string;
  personalisedName?: string;
  giftMessage?: string;
  selectedAddOns: ProductAddOn[];
  uploadedImageName?: string;
  uploadedImageUrl?: string;
  totalItemPrice: number;
}

export type PaymentMethodType = 'upi' | 'advance_50' | 'card' | 'cod';
export type PaymentStatusType = 'Pending Verification' | '50% Advance Received' | 'Fully Paid' | 'Refunded';

export interface EnquiryRequest {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  pincode?: string;
  deliveryAddress?: string;
  occasion: OccasionType | string;
  occasionDate?: string;
  requiredArrivalDate: string;
  isUrgent: boolean;
  items: CartItem[];
  customIdeaDescription?: string;
  budgetRange?: string;
  referenceImages?: string[];
  giftNote?: string;
  packagingPreference: 'Standard Eco Kraft' | 'Luxury Keepsake Velvet Box (+₹180)';
  estimatedTotal: number;
  discountApplied?: number;
  couponCode?: string;
  paymentMethod?: PaymentMethodType;
  paymentStatus?: PaymentStatusType;
  transactionRef?: string;
  trackingNumber?: string;
  courierPartner?: string;
  status: 'New' | 'Contacted' | 'Confirmed' | 'In Preparation' | 'Dispatched' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  date: string;
  productTitle: string;
  occasion: string;
  reviewText: string;
  customerAvatar?: string;
  giftPhoto?: string;
  verifiedBuyer: boolean;
  approved?: boolean;
  featured?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  extractedPreferences?: {
    occasion?: string;
    recipient?: string;
    budget?: string;
    style?: string;
    personalisation?: string;
  };
  recommendedProductIds?: string[];
  reasoningMap?: Record<string, string>;
  suggestedFollowUps?: string[];
}

/* ======================================================================= */
/* CUSTOMER ACCOUNTS & ORDERS (Section 1 & 2)                              */
/* ======================================================================= */
export interface SavedAddress {
  id: string;
  label: string; // e.g. Home, Office, Bestie
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  referralCode: string;
  joinedDate: string;
  addresses: SavedAddress[];
  reminders: { id: string; title: string; occasion: string; date: string }[];
}

export interface AfterSalesRequest {
  id: string;
  orderId: string;
  type: 'cancellation' | 'return_replacement' | 'refund';
  reason: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Declined' | 'Refund Processed';
  createdAt: string;
  resolutionNotes?: string;
}

/* ======================================================================= */
/* HANDMADE PRODUCTION & QUALITY CONTROL (Section 4)                       */
/* ======================================================================= */
export type ProductionStage = 
  | 'Awaiting Materials'
  | 'Ready to Start'
  | 'In Production'
  | 'Quality Check'
  | 'Ready to Dispatch'
  | 'Completed';

export interface QCItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ProductionRecord {
  id: string;
  orderId: string;
  customerName: string;
  productSummary: string;
  stage: ProductionStage;
  assignedArtisan: string;
  requiredArrivalDate: string;
  isUrgent: boolean;
  personalisationInstructions: string;
  referenceImages: string[];
  qcChecklist: QCItem[];
  packagingVerified: boolean;
  internalStudioNotes: string; // NEVER shown to customers
  issueReported?: string;
  updatedAt: string;
}

/* ======================================================================= */
/* COUPONS, GIFT CARDS & PROMOTIONS (Section 5)                            */
/* ======================================================================= */
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageCount: number;
  maxUsage: number;
  description: string;
  isActive: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initialAmount: number;
  recipientName: string;
  recipientEmail: string;
  expiryDate: string;
}

/* ======================================================================= */
/* CUSTOMER SUPPORT TICKETS (Section 6)                                    */
/* ======================================================================= */
export type TicketCategory = 
  | 'Order Issue'
  | 'Delivery Delay'
  | 'Personalisation Query'
  | 'Cancellation / Refund'
  | 'Damaged Package'
  | 'General Enquiry';

export type TicketPriority = 'Low' | 'Normal' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'artisan';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

/* ======================================================================= */
/* AUDIT LOG & STORE CMS (Sections 10, 11 & 12)                            */
/* ======================================================================= */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface StoreCmsSettings {
  announcementText: string;
  heroHeadline: string;
  heroTagline: string;
  freeShippingMinimum: number;
  standardLeadTimeDays: number;
  returnPolicySnippet: string;
  contactEmail: string;
  contactPhone: string;
}

/* ======================================================================= */
/* BACKUPS & DISASTER RECOVERY (Audit Requirement)                         */
/* ======================================================================= */
export type BackupType = 'manual_snapshot' | 'automated_local' | 'restore_test';
export type BackupStatus = 'success' | 'failed' | 'dry_run_verified';

export interface BackupRecord {
  id: string;
  timestamp: string;
  type: BackupType;
  status: BackupStatus;
  sizeBytes: number;
  categories: string[];
  hashChecksum: string;
  actor: string;
  details: string;
}

export interface BackupSystemStatus {
  localStorageHealth: 'healthy' | 'warning' | 'critical';
  cloudDatabaseStatus: 'Not configured' | 'Active' | 'Degraded';
  automatedLocalSchedule: 'Active (Daily Session Check)' | 'Paused';
  retentionPolicy: string;
  lastSuccessfulBackup: string | null;
  lastAttemptResult: string;
  nextScheduledCheck: string;
  lastVerifiedRestoreTest: {
    timestamp: string;
    result: 'Passed' | 'Failed' | 'Never Run';
    details: string;
  };
}

/* ======================================================================= */
/* CUSTOM BOUQUET BUILDER TYPES                                            */
/* ======================================================================= */
export interface FlowerStem {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  pricePerStem: number;
  image: string;
  fragranceNotes: string;
  isPopular?: boolean;
}

export interface BouquetConfiguration {
  size: 'Petite (6 Stems)' | 'Classic (12 Stems)' | 'Luxe (24 Stems)';
  stems: { flowerId: string; quantity: number }[];
  wrapping: 'Blush Pink Kraft' | 'Deep Emerald Velvet' | 'Vintage Calligraphy' | 'Frosted White Minimal';
  ribbonColor: 'Emerald Satin' | 'Dusty Rose Silk' | 'Champagne Gold' | 'Burgundy Velvet';
  cardMessage: string;
  addOns: { id: string; name: string; price: number }[];
  totalPrice: number;
}

/* ======================================================================= */
/* QR VOICE GIFT TYPES                                                     */
/* ======================================================================= */
export interface QrVoiceGift {
  id: string;
  orderId?: string;
  recipientName: string;
  senderName: string;
  audioBlobUrl?: string; // in-browser playback
  audioBase64?: string; // persistent audio data
  audioDurationSeconds: number;
  messageText: string;
  photoUrl?: string;
  createdAt: string;
  expiresAt?: string;
  isLocked: boolean;
  pinCode?: string;
  qrCodeUrl: string;
  playbackCount: number;
}
