import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coupon, GiftCard } from '../types';

interface CouponContextType {
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (code: string, currentTotal: number) => { success: boolean; message: string; discount?: number };
  removeCoupon: () => void;
  giftCards: GiftCard[];
  appliedGiftCard: GiftCard | null;
  applyGiftCard: (code: string) => { success: boolean; message: string; balance?: number };
  removeGiftCard: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCouponActive: (id: string) => void;
}

const COUPONS_STORAGE_KEY = 'kbyk_coupons_v1';

const defaultCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'KBYKFIRST',
    type: 'percentage',
    discountValue: 10, // 10%
    minOrderValue: 499,
    expiryDate: '2026-12-31',
    usageCount: 42,
    maxUsage: 500,
    description: '10% off your first handcrafted keepsake (Min ₹499)',
    isActive: true,
  },
  {
    id: 'coup-2',
    code: 'CELEBRATE',
    type: 'fixed',
    discountValue: 200, // ₹200 off
    minOrderValue: 1200,
    expiryDate: '2026-11-30',
    usageCount: 18,
    maxUsage: 100,
    description: 'Flat ₹200 off luxury celebration hampers over ₹1,200',
    isActive: true,
  },
  {
    id: 'coup-3',
    code: 'FESTIVE15',
    type: 'percentage',
    discountValue: 15,
    minOrderValue: 1500,
    expiryDate: '2026-11-15',
    usageCount: 29,
    maxUsage: 250,
    description: '15% off festive gift boxes & explosion albums',
    isActive: true,
  },
];

const defaultGiftCards: GiftCard[] = [
  {
    id: 'gc-1',
    code: 'GIFT-KBYK-500',
    balance: 500,
    initialAmount: 500,
    recipientName: 'Ananya Roy',
    recipientEmail: 'ananya.roy@example.com',
    expiryDate: '2027-01-01',
  },
];

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const stored = localStorage.getItem(COUPONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultCoupons;
    } catch {
      return defaultCoupons;
    }
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);

  useEffect(() => {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const applyCoupon = (
    code: string,
    currentTotal: number
  ): { success: boolean; message: string; discount?: number } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid coupon code. Please check and try again.' };
    }

    if (!found.isActive) {
      return { success: false, message: 'This coupon has been disabled by the studio.' };
    }

    if (currentTotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minOrderValue}.`,
      };
    }

    let calculatedDiscount = 0;
    if (found.type === 'percentage') {
      calculatedDiscount = Math.round((currentTotal * found.discountValue) / 100);
    } else {
      calculatedDiscount = found.discountValue;
    }

    setActiveCoupon(found);
    setDiscountAmount(calculatedDiscount);

    return {
      success: true,
      message: `Coupon "${found.code}" applied! You saved ₹${calculatedDiscount}.`,
      discount: calculatedDiscount,
    };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setDiscountAmount(0);
  };

  const applyGiftCard = (code: string): { success: boolean; message: string; balance?: number } => {
    const cleanCode = code.trim().toUpperCase();
    const found = defaultGiftCards.find((g) => g.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Gift card code not found.' };
    }

    setAppliedGiftCard(found);
    return {
      success: true,
      message: `Gift card applied! Balance: ₹${found.balance}`,
      balance: found.balance,
    };
  };

  const removeGiftCard = () => {
    setAppliedGiftCard(null);
  };

  const addCoupon = (coup: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...coup,
      id: `coup-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons([...coupons, newCoupon]);
  };

  const toggleCouponActive = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        activeCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        giftCards: defaultGiftCards,
        appliedGiftCard,
        applyGiftCard,
        removeGiftCard,
        addCoupon,
        toggleCouponActive,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within CouponProvider');
  }
  return context;
};
