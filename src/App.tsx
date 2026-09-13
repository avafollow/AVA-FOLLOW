import React, { useState, useEffect } from 'react';
import { ScreenId } from './types';
import { TikTokAppProvider, useTikTokApp } from './context/TikTokAppContext';

// Landing Page Outside
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/modals/AuthModal';

// Layout
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';

// Dedicated Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { CreateCampaignScreen } from './components/screens/CreateCampaignScreen';
import { MarketplaceScreen } from './components/screens/MarketplaceScreen';
import { AffiliateScreen } from './components/screens/AffiliateScreen';
import { CommunityScreen } from './components/screens/CommunityScreen';
import { ProfileWalletScreen } from './components/screens/ProfileWalletScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { TokenomicsScreen } from './components/screens/TokenomicsScreen';
import { BookingEscrowScreen } from './components/screens/BookingEscrowScreen';
import { BusinessPortalScreen } from './components/screens/BusinessPortalScreen';
import { AppMarketplaceScreen } from './components/screens/AppMarketplaceScreen';
import { PolicyGuideScreen } from './components/screens/PolicyGuideScreen';

// Modals
import { TikTokTaskRunnerModal } from './components/modals/TikTokTaskRunnerModal';
import { TikTokFeedRunnerModal } from './components/modals/TikTokFeedRunnerModal';
import { LivestreamRunnerModal } from './components/modals/LivestreamRunnerModal';
import { LuckyWheelModal } from './components/modals/LuckyWheelModal';
import { TikTokConnectModal } from './components/modals/TikTokConnectModal';
import { BankWithdrawModal } from './components/modals/BankWithdrawModal';
import { KycVerificationModal } from './components/modals/KycVerificationModal';
import { PolicyGuideModal } from './components/modals/PolicyGuideModal';
import { PaymentModal } from './components/common/PaymentModal';
import { SepayUniversalCheckoutModal, SepayCheckoutItem } from './components/modals/SepayUniversalCheckoutModal';
import { CreateBookingModal } from './components/modals/CreateBookingModal';
import { SubmitDemoModal } from './components/modals/SubmitDemoModal';
import { BuyerLiveManagerModal } from './components/modals/BuyerLiveManagerModal';
import { ShareVideoModal } from './components/modals/ShareVideoModal';
import { MarqueeBoostModal } from './components/modals/MarqueeBoostModal';
import { MarqueeHistoryModal } from './components/modals/MarqueeHistoryModal';
import { FireworksCongratulationModal } from './components/modals/FireworksCongratulationModal';
import { RecentUserJoinNotification } from './components/common/RecentUserJoinNotification';
import { ZaloCommunityFloatingButton } from './components/common/ZaloCommunityFloatingButton';

import { CheckCircle2 } from 'lucide-react';

class ScreenErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Screen Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 mx-auto max-w-xl text-center bg-slate-900/90 border border-rose-500/40 rounded-3xl space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-2xl">
            ⚠️
          </div>
          <h3 className="text-lg font-black text-white">Đã xảy ra sự cố khi tải trang</h3>
          <p className="text-xs text-slate-400">
            Hệ thống đã ghi nhận lỗi. Vui lòng tải lại trang hoặc bấm quay về Trang Chủ.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Về Trang Chủ
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Tải Lại Ứng Dụng
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showLandingDirectly, setShowLandingDirectly] = useState(false);

  const { 
    user,
    toastMessage, 
    showToast,
    deposit, 
    isDepositOpen, 
    closeDeposit, 
    openDeposit,
    openWithdraw,
    openPolicy,
    isAuthenticated,
    isKycModalOpen,
    closeKycModal,
    fireworksData,
    isFireworksOpen,
    closeFireworks,
    isSepayModalOpen,
    sepayCheckoutItem,
    closeSepayModal,
    buySoftwareApp,
    purchaseServicePackage
  } = useTikTokApp();

  // Sync dark theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Admin routing check: if admin logs in, show Admin screen directly; if non-admin tries to view admin, redirect to home
  useEffect(() => {
    if (isAuthenticated && user?.email === 'quocthiencr90@gmail.com') {
      // Auto display admin screen for admin
      setCurrentScreen('admin');
    } else if (currentScreen === 'admin' && user?.email !== 'quocthiencr90@gmail.com') {
      // Protect admin screen against unauthorized users
      setCurrentScreen('home');
    }
  }, [isAuthenticated, user?.email]);

  // Check SePay Payment return query params (?payment=success / ?payment=cancel)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      showToast('🎉 Giao dịch SePay thành công! Hệ thống đã ghi nhận thanh toán của bạn.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('payment') === 'cancel') {
      showToast('ℹ️ Bạn đã hủy giao dịch thanh toán.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleDepositSuccess = (amount: number, method: string) => {
    const amountVND = amount >= 10000 ? amount : amount * 25400;
    deposit(amountVND, method);
  };

  const handleSepaySuccess = (item: SepayCheckoutItem, referenceId: string) => {
    if (item.category === 'topup_xu') {
      const coinsToAdd = item.xuEquivalent || item.amountVnd;
      deposit(coinsToAdd, `SePay VietQR 24/7 (Techcombank) - ${referenceId}`);
      showToast(`🎉 Nạp thành công +${coinsToAdd.toLocaleString()} Xu qua cổng SePay VietQR (Techcombank)!`);
    } else if (item.category === 'software_app') {
      if (item.metadata?.appId) {
        buySoftwareApp(item.metadata.appId, 'coins');
      }
      showToast(`🎉 Thanh toán SePay thành công! Đã cấp bản quyền phần mềm "${item.title}".`);
    } else if (item.category === 'growth_package') {
      if (item.metadata?.pkg) {
        purchaseServicePackage(item.metadata.pkg, item.metadata.targetUrl || '@kenh_tiktok', item.metadata.instructions, 'sepay');
      }
      showToast(`🎉 Thanh toán SePay thành công! Gói "${item.title}" đã kích hoạt vào hàng đợi xử lý.`);
    } else if (item.category === 'escrow_deposit') {
      showToast(`🛡️ Ký quỹ SePay thành công! Tiền cọc ${item.amountVnd.toLocaleString()}đ đã khóa an toàn vào Smart Vault.`);
    }
  };

  // If NOT authenticated, show the TikTok Pro Landing Page outside
  if (!isAuthenticated || showLandingDirectly) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-black/90 border border-rose-500/50 shadow-2xl shadow-rose-500/30 text-white text-xs font-mono animate-in slide-in-from-top-4 duration-200 max-w-sm">
            <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        )}

        {/* Back to App button if user is already logged in but viewing Landing */}
        {isAuthenticated && showLandingDirectly && (
          <div className="fixed top-20 left-4 z-50">
            <button
              onClick={() => setShowLandingDirectly(false)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
            >
              ← Quay Lại Bảng Điều Khiển
            </button>
          </div>
        )}

        <LandingPage />
        <AuthModal />

        {/* Bottom-Left Floating User Join Notification (Every 20s) */}
        <RecentUserJoinNotification />

        {/* Bottom-Right Floating Zalo Community Button */}
        <ZaloCommunityFloatingButton />
      </div>
    );
  }

  // If AUTHENTICATED: Show Full Dashboard App Inside
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      darkMode ? 'bg-[#07090E] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-black/90 border border-rose-500/50 shadow-2xl shadow-rose-500/30 text-white text-xs font-mono animate-in slide-in-from-top-4 duration-200 max-w-sm">
          <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onNavigateToProfile={() => setCurrentScreen('profile_wallet')}
        onNavigateToAdmin={() => setCurrentScreen('admin')}
        onOpenCreateCampaign={() => setCurrentScreen('create_campaign')}
        onOpenPolicy={openPolicy}
        onNavigateToLanding={() => setShowLandingDirectly(true)}
        onNavigateToAffiliate={() => setCurrentScreen('affiliate')}
        onNavigateToPolicyGuide={() => setCurrentScreen('policy_guide')}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={(scr) => setCurrentScreen(scr)}
          darkMode={darkMode}
          onNavigateToLanding={() => setShowLandingDirectly(true)}
        />

        {/* Screen Router */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 space-y-6">
          <ScreenErrorBoundary onReset={() => setCurrentScreen('home')}>
          {currentScreen === 'home' && (
            <HomeScreen
              darkMode={darkMode}
              onNavigate={(scr) => setCurrentScreen(scr)}
              onOpenDeposit={openDeposit}
              onOpenWithdraw={openWithdraw}
              onOpenCreateCampaign={() => setCurrentScreen('create_campaign')}
            />
          )}

          {currentScreen === 'business_portal' && (
            <BusinessPortalScreen darkMode={darkMode} />
          )}

          {currentScreen === 'app_marketplace' && (
            <AppMarketplaceScreen darkMode={darkMode} />
          )}

          {currentScreen === 'booking_escrow' && (
            <BookingEscrowScreen />
          )}

          {currentScreen === 'tasks' && (
            <TasksScreen darkMode={darkMode} />
          )}

          {currentScreen === 'create_campaign' && (
            <CreateCampaignScreen darkMode={darkMode} />
          )}

          {currentScreen === 'marketplace' && (
            <MarketplaceScreen
              darkMode={darkMode}
              onOrderService={() => {}}
            />
          )}

          {currentScreen === 'analytics' && (
            <AnalyticsScreen darkMode={darkMode} />
          )}

          {currentScreen === 'tokenomics' && (
            <TokenomicsScreen darkMode={darkMode} onNavigate={(scr) => setCurrentScreen(scr)} />
          )}

          {currentScreen === 'affiliate' && (
            <AffiliateScreen
              darkMode={darkMode}
              onOpenWithdraw={openWithdraw}
            />
          )}

          {currentScreen === 'community' && (
            <CommunityScreen darkMode={darkMode} />
          )}

          {currentScreen === 'profile_wallet' && (
            <ProfileWalletScreen darkMode={darkMode} />
          )}

          {currentScreen === 'admin' && (
            <AdminScreen darkMode={darkMode} />
          )}

          {currentScreen === 'policy_guide' && (
            <PolicyGuideScreen darkMode={darkMode} />
          )}
          </ScreenErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phone First) */}
      <MobileNav
        currentScreen={currentScreen}
        onSelectScreen={(scr) => setCurrentScreen(scr)}
      />

      {/* Interactive Modals */}
      <TikTokTaskRunnerModal />
      <TikTokFeedRunnerModal />
      <LivestreamRunnerModal />
      <BuyerLiveManagerModal />
      <LuckyWheelModal />
      <TikTokConnectModal />
      <BankWithdrawModal />
      <KycVerificationModal isOpen={isKycModalOpen} onClose={closeKycModal} />
      <PolicyGuideModal />
      <CreateBookingModal />
      <SubmitDemoModal />
      <ShareVideoModal />
      <MarqueeBoostModal />
      <MarqueeHistoryModal />
      <AuthModal />
      <FireworksCongratulationModal
        data={fireworksData}
        isOpen={isFireworksOpen}
        onClose={closeFireworks}
      />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* SePay VietQR Deposit Modal */}
      <PaymentModal
        isOpen={isDepositOpen}
        onClose={closeDeposit}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* SePay Universal Checkout Modal (Cho mọi giao dịch: Mua App, Mua Gói, Mua Xu, Ký Quỹ) */}
      <SepayUniversalCheckoutModal
        isOpen={isSepayModalOpen}
        item={sepayCheckoutItem}
        onClose={closeSepayModal}
        onSuccess={handleSepaySuccess}
      />

      {/* Bottom-Left Floating User Join Notification (Every 20s) */}
      <RecentUserJoinNotification />

      {/* Bottom-Right Floating Zalo Community Button */}
      <ZaloCommunityFloatingButton />
    </div>
  );
}

export function App() {
  return (
    <TikTokAppProvider>
      <AppContent />
    </TikTokAppProvider>
  );
}
