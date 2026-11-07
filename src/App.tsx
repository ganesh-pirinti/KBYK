import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider } from './context/AdminContext';
import { StudioAuthProvider, useStudioAuth } from './context/StudioAuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { CouponProvider } from './context/CouponContext';
import { SupportProvider } from './context/SupportContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/shop/QuickViewModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OccasionPage } from './pages/OccasionPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { BouquetBuilderPage } from './pages/BouquetBuilderPage';
import { QrVoiceGiftPage } from './pages/QrVoiceGiftPage';
import { VoiceGiftPlaybackPage } from './pages/VoiceGiftPlaybackPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartEnquiryPage } from './pages/CartEnquiryPage';
import { OrderSubmittedPage } from './pages/OrderSubmittedPage';
import { AboutPage } from './pages/AboutPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { AiFinderPage } from './pages/AiFinderPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StudioLockScreen } from './components/admin/StudioLockScreen';
import { Product } from './types';

function AppContent() {
  const { isUnlocked } = useStudioAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('kbyk-01');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Birthdays');
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [lastSubmittedEnquiryId, setLastSubmittedEnquiryId] = useState<string>('');
  const [selectedVoiceGiftId, setSelectedVoiceGiftId] = useState<string>('sample');
  
  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product-')) {
        const pId = hash.replace('product-', '');
        setSelectedProductId(pId);
        setCurrentTab('product');
      } else if (hash.startsWith('occasion-')) {
        const occ = hash.replace('occasion-', '');
        setSelectedOccasion(occ);
        setCurrentTab('occasions');
      } else if (hash === 'voice-gift') {
        setCurrentTab('voice-gift');
      } else if (hash.startsWith('voice-')) {
        const vId = hash.replace('voice-', '');
        setSelectedVoiceGiftId(vId);
        setCurrentTab('voice-playback');
      } else if (!hash || hash === 'home') {
        setCurrentTab('home');
      } else {
        setCurrentTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string, param?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'product') {
      setSelectedProductId(param || 'kbyk-01');
      setCurrentTab('product');
      window.location.hash = `product-${param || 'kbyk-01'}`;
      return;
    }

    if (tab === 'occasions') {
      if (param) setSelectedOccasion(param);
      setCurrentTab('occasions');
      window.location.hash = param ? `occasion-${param}` : 'occasions';
      return;
    }

    if (tab === 'ai-finder') {
      if (param) setAiInitialPrompt(param);
      setCurrentTab('ai-finder');
      window.location.hash = 'ai-finder';
      return;
    }

    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
  };

  const handleSelectProduct = (id: string) => {
    handleNavigate('product', id);
  };

  const handleOrderSubmitted = (enquiryId: string) => {
    setLastSubmittedEnquiryId(enquiryId);
    handleNavigate('order-submitted');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF9] text-[#292626]">
      
      {/* 
        STUDIO PORTAL ACCESS CONTROL:
        If user navigated to #admin or clicked Studio Portal:
        - If NOT unlocked, display the StudioLockScreen (Setup or Unlock)
        - If UNLOCKED, display the executive AdminDashboardPage
      */}
      {currentTab === 'admin' ? (
        isUnlocked ? (
          <AdminDashboardPage
            onBackToStorefront={() => handleNavigate('home')}
          />
        ) : (
          <StudioLockScreen
            onBackToStorefront={() => handleNavigate('home')}
          />
        )
      ) : (
        /* PUBLIC CUSTOMER-FACING STOREFRONT (Always accessible without password) */
        <>
          {/* 1. Announcement Bar */}
          <AnnouncementBar />

          {/* 2. Global Navbar */}
          <Navbar
            currentTab={currentTab}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* 3. Main Page Routing */}
          <main className="flex-1">
            {currentTab === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
                onQuickView={setQuickViewProduct}
              />
            )}

            {currentTab === 'shop' && (
              <ShopPage
                initialCategory="All"
                initialOccasion="All"
                onSelectProduct={handleSelectProduct}
                onQuickView={setQuickViewProduct}
              />
            )}

            {currentTab === 'product' && (
              <ProductDetailPage
                productId={selectedProductId}
                onBack={() => handleNavigate('shop')}
                onSelectProduct={handleSelectProduct}
                onProceedToEnquiry={() => handleNavigate('cart')}
              />
            )}

            {currentTab === 'occasions' && (
              <OccasionPage
                initialOccasion={selectedOccasion}
                onSelectProduct={handleSelectProduct}
                onCustomOrder={() => handleNavigate('custom-order')}
              />
            )}

            {currentTab === 'ai-finder' && (
              <AiFinderPage
                initialPrompt={aiInitialPrompt}
                onSelectProduct={handleSelectProduct}
                onNavigateCustomOrder={() => handleNavigate('custom-order')}
              />
            )}

            {currentTab === 'custom-order' && (
              <CustomOrderPage
                onOrderSubmitted={handleOrderSubmitted}
                onBackToHome={() => handleNavigate('home')}
              />
            )}

            {currentTab === 'bouquet-builder' && (
              <BouquetBuilderPage
                onProceedToCart={() => handleNavigate('cart')}
                onExploreGifts={() => handleNavigate('shop')}
              />
            )}

            {currentTab === 'voice-gift' && (
              <QrVoiceGiftPage
                onBackToStorefront={() => handleNavigate('home')}
                onOpenPlayback={(vId) => {
                  setSelectedVoiceGiftId(vId);
                  handleNavigate('voice-playback');
                  window.location.hash = `voice-${vId}`;
                }}
              />
            )}

            {currentTab === 'voice-playback' && (
              <VoiceGiftPlaybackPage
                giftId={selectedVoiceGiftId}
                onExploreGifts={() => handleNavigate('shop')}
              />
            )}

            {currentTab === 'cart' && (
              <CartEnquiryPage
                onOrderSubmitted={handleOrderSubmitted}
                onExploreGifts={() => handleNavigate('shop')}
              />
            )}

            {currentTab === 'order-submitted' && (
              <OrderSubmittedPage
                enquiryId={lastSubmittedEnquiryId}
                onBackToHome={() => handleNavigate('home')}
                onExploreGifts={() => handleNavigate('shop')}
              />
            )}

            {currentTab === 'wishlist' && (
              <WishlistPage
                onSelectProduct={handleSelectProduct}
                onExploreGifts={() => handleNavigate('shop')}
              />
            )}

            {currentTab === 'about' && (
              <AboutPage
                onExploreGifts={() => handleNavigate('shop')}
                onCustomOrder={() => handleNavigate('custom-order')}
              />
            )}

            {currentTab === 'reviews' && (
              <ReviewsPage />
            )}

            {currentTab === 'faq' && (
              <FaqPage />
            )}

            {currentTab === 'contact' && (
              <ContactPage />
            )}

            {currentTab === 'account' && (
              <CustomerAccountPage
                onExploreGifts={() => handleNavigate('shop')}
                onSelectProduct={handleSelectProduct}
                onOpenSupport={() => handleNavigate('contact')}
              />
            )}
          </main>

          {/* 4. Global Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Search Modal with Voice Search */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectProduct={handleSelectProduct}
            onSelectOccasion={(occ) => handleNavigate('occasions', occ)}
            onOpenAiFinder={() => handleNavigate('ai-finder')}
          />

          {/* Quick View Modal */}
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onViewDetails={handleSelectProduct}
          />
        </>
      )}

    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <StudioAuthProvider>
        <AdminProvider>
          <LanguageProvider>
            <CustomerAuthProvider>
              <CouponProvider>
                <SupportProvider>
                  <WishlistProvider>
                    <CartProvider>
                      <AppContent />
                    </CartProvider>
                  </WishlistProvider>
                </SupportProvider>
              </CouponProvider>
            </CustomerAuthProvider>
          </LanguageProvider>
        </AdminProvider>
      </StudioAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
