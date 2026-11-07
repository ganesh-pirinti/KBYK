import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'te' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  announcement: {
    en: 'Pan-India Safe Delivery • Custom orders open for celebrations',
    te: 'భారతదేశమంతటా సురక్షిత డెలివరీ • వేడుకల కోసం ప్రత్యేక కస్టమ్ ఆర్డర్లు',
    hi: 'अखिल भारतीय सुरक्षित डिलीवरी • समारोहों के लिए कस्टम ऑर्डर उपलब्ध'
  },
  home: {
    en: 'Home',
    te: 'హోమ్',
    hi: 'होम'
  },
  shop: {
    en: 'Shop All',
    te: 'షాప్',
    hi: 'दुकान'
  },
  occasions: {
    en: 'Occasions',
    te: 'సందర్భాలు',
    hi: 'अवसर'
  },
  custom_gifts: {
    en: 'Custom Gifts',
    te: 'కస్టమ్ బహుమతులు',
    hi: 'कस्टम उपहार'
  },
  bouquet_builder: {
    en: 'Flower Bar',
    te: 'పూల గుత్తి బార్',
    hi: 'पुष्प गुच्छ'
  },
  voice_gifts: {
    en: 'Voice Gifts',
    te: 'వాయిస్ గిఫ్ట్స్',
    hi: 'वॉयस गिफ्ट्स'
  },
  our_story: {
    en: 'Our Story',
    te: 'మా కథ',
    hi: 'हमारी कहानी'
  },
  wishlist: {
    en: 'Wishlist',
    te: 'కోరికల జాబితా',
    hi: 'विशलिस्ट'
  },
  cart: {
    en: 'Enquiry Bag',
    te: 'బ్యాగ్',
    hi: 'बैग'
  },
  explore_gifts: {
    en: 'Explore Gifts',
    te: 'బహుమతులను చూడండి',
    hi: 'उपहार देखें'
  },
  find_my_gift: {
    en: 'Find My Perfect Gift',
    te: 'సరైన బహుమతిని వెతకండి',
    hi: 'उपहार खोजें'
  },
  hero_headline: {
    en: 'Gifts that feel like they were made just for them.',
    te: 'వారికోసమే ప్రత్యేకంగా తయారు చేసినట్లుండే బహుమతులు.',
    hi: 'ऐसे उपहार जो सिर्फ उनके लिए बने महसूस हों।'
  },
  hero_tagline: {
    en: 'For moments that deserve to last.',
    te: 'శాశ్వతంగా నిలవాల్సిన మధుర క్షణాల కోసం.',
    hi: 'उन पलों के लिए जो हमेशा याद रहने चाहिए।'
  },
  add_to_cart: {
    en: 'Add to Enquiry Bag',
    te: 'బ్యాగ్‌కు జోడించండి',
    hi: 'बैग में जोड़ें'
  },
  personalise_now: {
    en: 'Personalise This Gift',
    te: 'ఈ బహుమతిని అనుకూలీకరించండి',
    hi: 'इसे कस्टमाइज़ करें'
  },
  contact_us: {
    en: 'Contact Atelier',
    te: 'సంప్రదించండి',
    hi: 'संपर्क करें'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('kbyk_language');
      if (saved === 'te' || saved === 'hi' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kbyk_language', lang);
    } catch {}
  };

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
