import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile, SavedAddress, EnquiryRequest, AfterSalesRequest } from '../types';

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<CustomerProfile>) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  customerOrders: EnquiryRequest[];
  afterSalesRequests: AfterSalesRequest[];
  submitAfterSalesRequest: (orderId: string, type: 'cancellation' | 'return_replacement' | 'refund', reason: string) => void;
  addReminder: (title: string, occasion: string, date: string) => void;
  removeReminder: (id: string) => void;
}

const CUSTOMER_STORAGE_KEY = 'kbyk_customer_profile_v1';
const AFTER_SALES_STORAGE_KEY = 'kbyk_after_sales_v1';

const defaultDemoCustomer: CustomerProfile = {
  id: 'CUST-8492',
  name: 'Ananya Roy',
  email: 'ananya.roy@example.com',
  phone: '+91 98201 55432',
  loyaltyPoints: 340,
  referralCode: 'ANANYA150',
  joinedDate: '2026-04-12',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      fullName: 'Ananya Roy',
      phone: '+91 98201 55432',
      addressLine: 'A-402, Lotus Greens, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Bestie (Riya)',
      fullName: 'Riya Sen',
      phone: '+91 98112 44321',
      addressLine: 'Flat 12, Gulmohar Enclave, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: false,
    },
  ],
  reminders: [
    { id: 'rem-1', title: "Riya's 25th Birthday", occasion: 'Birthdays', date: '2026-11-18' },
    { id: 'rem-2', title: 'Parents Anniversary', occasion: 'Anniversaries', date: '2026-12-04' },
  ],
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultDemoCustomer;
    } catch {
      return defaultDemoCustomer;
    }
  });

  const [afterSalesRequests, setAfterSalesRequests] = useState<AfterSalesRequest[]>(() => {
    try {
      const stored = localStorage.getItem(AFTER_SALES_STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'AS-101',
              orderId: 'KBYK-8941',
              type: 'cancellation',
              reason: 'Event rescheduled to next month',
              status: 'Approved',
              createdAt: '2026-10-27',
              resolutionNotes: 'Order was still in materials stage. Refund processed via original UPI.',
            },
          ];
    } catch {
      return [];
    }
  });

  // Sync with localStorage
  useEffect(() => {
    if (customer) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
  }, [customer]);

  useEffect(() => {
    localStorage.setItem(AFTER_SALES_STORAGE_KEY, JSON.stringify(afterSalesRequests));
  }, [afterSalesRequests]);

  const login = (email: string, name?: string) => {
    const newCustomer: CustomerProfile = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || email.split('@')[0],
      email,
      phone: '+91 98200 11223',
      loyaltyPoints: 100,
      referralCode: `${(name || email).slice(0, 5).toUpperCase()}150`,
      joinedDate: new Date().toISOString().split('T')[0],
      addresses: [],
      reminders: [],
    };
    setCustomer(newCustomer);
  };

  const logout = () => {
    setCustomer(null);
  };

  const updateProfile = (updated: Partial<CustomerProfile>) => {
    if (!customer) return;
    setCustomer({ ...customer, ...updated });
  };

  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    if (!customer) return;
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setCustomer({
      ...customer,
      addresses: [...customer.addresses, newAddr],
    });
  };

  const deleteAddress = (id: string) => {
    if (!customer) return;
    setCustomer({
      ...customer,
      addresses: customer.addresses.filter((a) => a.id !== id),
    });
  };

  const submitAfterSalesRequest = (
    orderId: string,
    type: 'cancellation' | 'return_replacement' | 'refund',
    reason: string
  ) => {
    const newReq: AfterSalesRequest = {
      id: `AS-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      type,
      reason,
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0],
      resolutionNotes: 'Artisan review initiated. You will receive an update within 4 working hours.',
    };
    setAfterSalesRequests([newReq, ...afterSalesRequests]);
  };

  const addReminder = (title: string, occasion: string, date: string) => {
    if (!customer) return;
    const newRem = {
      id: `rem-${Date.now()}`,
      title,
      occasion,
      date,
    };
    setCustomer({
      ...customer,
      reminders: [...customer.reminders, newRem],
    });
  };

  const removeReminder = (id: string) => {
    if (!customer) return;
    setCustomer({
      ...customer,
      reminders: customer.reminders.filter((r) => r.id !== id),
    });
  };

  // Read orders matching customer phone or email from global enquiries
  const customerOrders: EnquiryRequest[] = []; // dynamically linked in customer page

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoggedIn: !!customer,
        login,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        customerOrders,
        afterSalesRequests,
        submitAfterSalesRequest,
        addReminder,
        removeReminder,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};
