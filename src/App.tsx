import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ScreenId } from './types';
import { TikTokAppProvider, useTikTokApp } from './context/TikTokAppContext';

// Landing Page Outside (Lazy-loaded to shrink initial bundle)
const LandingPage = lazy(() => import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthModal = lazy(() => import('./components/modals/AuthModal').then(m => ({ default: m.AuthModal })));

// Layout (Keep lightweight shell eager)
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Dedicated Screens (Code-split per route so mobile loads ultra-fast)
const HomeScreen = lazy(() => import('./components/screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const TasksScreen = lazy(() => import('./components/screens/TasksScreen').then(m => ({ default: m.TasksScreen })));
const CreateCampaignScreen = lazy(() => import('./components/screens/CreateCampaignScreen').then(m => ({ default: m.CreateCampaignScreen })));
const MarketplaceScreen = lazy(() => import('./components/screens/MarketplaceScreen').then(m => ({ default: m.MarketplaceScreen })));
const AffiliateScreen = lazy(() => import('./components/screens/AffiliateScreen').then(m => ({ default: m.AffiliateScreen })));
const CommunityScreen = lazy(() => import('./components/screens/CommunityScreen').then(m => ({ default: m.CommunityScreen })));
const ProfileWalletScreen = lazy(() => import('./components/screens/ProfileWalletScreen').then(m => ({ default: m.ProfileWalletScreen })));
const AdminScreen = lazy(() => import('./components/screens/AdminScreen').then(m => ({ default: m.AdminScreen })));
const AnalyticsScreen = lazy(() => import('./components/screens/AnalyticsScreen').then(m => ({ default: m.AnalyticsScreen })));
const TokenomicsScreen = lazy(() => import('./components/screens/TokenomicsScreen').then(m => ({ default: m.TokenomicsScreen })));
const BookingEscrowScreen = lazy(() => import('./components/screens/BookingEscrowScreen').then(m => ({ default: m.BookingEscrowScreen })));
const BusinessPortalScreen = lazy(() => import('./components/screens/BusinessPortalScreen').then(m => ({ default: m.BusinessPortalScreen })));
const AppMarketplaceScreen = lazy(() => import('./components/screens/AppMarketplaceScreen').then(m => ({ default: m.AppMarketplaceScreen })));
const PolicyGuideScreen = lazy(() => import('./components/screens/PolicyGuideScreen').then(m => ({ default: m.PolicyGuideScreen })));

// Modals (Lazy-loaded & mounted ONLY when open — eliminates 20+ idle modal re-renders!)
const CommandPalette = lazy(() => import('./components/layout/CommandPalette').then(m => ({ default: m.CommandPalette })));
const TikTokTaskRunnerModal = lazy(() => import('./components/modals/TikTokTaskRunnerModal').then(m => ({ default: m.TikTokTaskRunnerModal })));
const TikTokFeedRunnerModal = lazy(() => import('./components/modals/TikTokFeedRunnerModal').then(m => ({ default: m.TikTokFeedRunnerModal })));
const LivestreamRunnerModal = lazy(() => import('./components/modals/LivestreamRunnerModal').then(m => ({ default: m.LivestreamRunnerModal })));
const LuckyWheelModal = lazy(() => import('./components/modals/LuckyWheelModal').then(m => ({ default: m.LuckyWheelModal })));
const TikTokConnectModal = lazy(() => import('./components/modals/TikTokConnectModal').then(m => ({ default: m.TikTokConnectModal })));
const BankWithdrawModal = lazy(() => import('./components/modals/BankWithdrawModal').then(m => ({ default: m.BankWithdrawModal })));
const KycVerificationModal = lazy(() => import('./components/modals/KycVerificationModal').then(m => ({ default: m.KycVerificationModal })));
const PolicyGuideModal = lazy(() => import('./components/modals/PolicyGuideModal').then(m => ({ default: m.PolicyGuideModal })));
const PaymentModal = lazy(() => import('./components/common/PaymentModal').then(m => ({ default: m.PaymentModal })));
const SepayUniversalCheckoutModal = lazy(() => import('./components/modals/SepayUniversalCheckoutModal').then(m => ({ default: m.SepayUniversalCheckoutModal })));
import type { SepayCheckoutItem } from './components/modals/SepayUniversalCheckoutModal';
const CreateBookingModal = lazy(() => import('./components/modals/CreateBookingModal').then(m => ({ default: m.CreateBookingModal })));
const SubmitDemoModal = lazy(() => import('./components/modals/SubmitDemoModal').then(m => ({ default: m.SubmitDemoModal })));
const BuyerLiveManagerModal = lazy(() => import('./components/modals/BuyerLiveManagerModal').then(m => ({ default: m.BuyerLiveManagerModal })));
const ShareVideoModal = lazy(() => import('./components/modals/ShareVideoModal').then(m => ({ default: m.ShareVideoModal })));
const MarqueeBoostModal = lazy(() => import('./components/modals/MarqueeBoostModal').then(m => ({ default: m.MarqueeBoostModal })));
const MarqueeHistoryModal = lazy(() => import('./components/modals/MarqueeHistoryModal').then(m => ({ default: m.MarqueeHistoryModal })));
const FireworksCongratulationModal = lazy(() => import('./components/modals/FireworksCongratulationModal').then(m => ({ default: m.FireworksCongratulationModal })));
const PwaInstallGuideModal = lazy(() => import('./components/modals/PwaInstallGuideModal').then(m => ({ default: m.PwaInstallGuideModal })));
const FraudAppealModal = lazy(() => import('./components/modals/FraudAppealModal').then(m => ({ default: m.FraudAppealModal })));
const TaskHistoryDetailModal = lazy(() => import('./components/modals/TaskHistoryDetailModal').then(m => ({ default: m.TaskHistoryDetailModal })));
const LivestreamBannerPopup = lazy(() => import('./components/common/LivestreamBannerPopup').then(m => ({ default: m.LivestreamBannerPopup })));
const RecentUserJoinNotification = lazy(() => import('./components/common/RecentUserJoinNotification').then(m => ({ default: m.RecentUserJoinNotification })));
import { ZaloCommunityFloatingButton } from './components/common/ZaloCommunityFloatingButton';
import { AntiFraudMarqueeTicker } from './components/common/AntiFraudMarqueeTicker';
const OnboardingTourGuide = lazy(() => import('./components/common/OnboardingTourGuide').then(m => ({ default: m.OnboardingTourGuide })));

import { CheckCircle2, ArrowLeft } from 'lucide-react';

const ScreenFallback = () => (
  <div className="w-full min-h-[55vh] flex flex-col items-center justify-center gap-3 text-slate-400">
    <div className="w-9 h-9 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
    <span className="text-xs font-mono">Đang tải giao diện mượt mà...</span>
  </div>
);

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
    purchaseServicePackage,
    isPwaModalOpen,
    closePwaModal,
    isFraudAppealModalOpen,
    closeFraudAppealModal,
    fraudAppealTargetTask,
    selectedTaskDetail,
    isTaskDetailModalOpen,
    closeTaskDetail,
    isAuthModalOpen,
    isRunnerOpen,
    isFeedRunnerOpen,
    isLiveRunnerOpen,
    isBuyerPortalOpen,
    isLuckyWheelOpen,
    isConnectOpen,
    isWithdrawOpen,
    isPolicyOpen,
    isBookingModalOpen,
    isSubmitDemoModalOpen,
    isShareModalOpen,
    isMarqueeBoostModalOpen,
    isMarqueeHistoryModalOpen
  } = useTikTokApp();

  // Ref tới phần tử nội dung cuộn chính
  const mainContentRef = React.useRef<HTMLElement>(null);

  // Xử lý cuộn chuột mượt mà tại BẤT KỲ VỊ TRÍ NÀO trên màn hình máy tính (Header, Sidebar, Lề, Nền, Khung viền, Landing Page)
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Nếu đang hover bên trong một modal / dialog popup đang mở thì để modal tự cuộn
      const activeModal = target.closest('[role="dialog"], .modal-scroll-container, .sepay-modal-scroll');
      if (activeModal) {
        return;
      }

      // Nếu đang ở Dashboard App thì cuộn mainContentRef
      if (mainContentRef.current) {
        if (!mainContentRef.current.contains(target)) {
          mainContentRef.current.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, []);

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
          <div className="fixed top-5 sm:top-6 right-4 sm:right-6 z-[99999] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-black/95 border border-rose-500/80 shadow-2xl shadow-rose-500/40 text-white text-xs font-mono animate-in slide-in-from-top-4 duration-200 max-w-sm pointer-events-auto">
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

        <Suspense fallback={<ScreenFallback />}>
          <LandingPage />
          {isAuthModalOpen && <AuthModal />}
          <RecentUserJoinNotification />
        </Suspense>

        {/* Bottom-Right Floating Zalo Community Button */}
        <ZaloCommunityFloatingButton />
      </div>
    );
  }

  // If AUTHENTICATED: Show Full Dashboard App Inside
  return (
    <div className={`h-screen h-[100dvh] max-w-full flex flex-col font-sans transition-colors overflow-hidden ${
      darkMode ? 'bg-[#07090E] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 sm:top-6 right-4 sm:right-6 z-[99999] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-black/95 border border-rose-500/80 shadow-2xl shadow-rose-500/40 text-white text-xs font-mono animate-in slide-in-from-top-4 duration-200 max-w-sm pointer-events-auto">
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
      <div className="flex-1 flex overflow-hidden min-h-0 max-w-full relative">
        {/* Left Sidebar (Desktop) */}
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={(scr) => setCurrentScreen(scr)}
          darkMode={darkMode}
          onNavigateToLanding={() => setShowLandingDirectly(true)}
        />

        {/* Screen Router */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-2.5 sm:p-6 lg:p-8 pb-32 md:pb-8 space-y-3.5 sm:space-y-6 max-w-full overscroll-y-contain">
          {/* Quick Exit / Back to Home Bar (Hiển thị trên tất cả thiết bị khi đi sâu vào trang con) */}
          {currentScreen !== 'home' && (
            <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-[#0D111E]/95 border border-rose-500/30 shadow-lg backdrop-blur-md">
              <button
                onClick={() => setCurrentScreen('home')}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 text-rose-500 shrink-0" />
                <span>← Quay Lại Trang Chủ</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('marketplace')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs font-mono shadow-sm flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>🔥 MUA GÓI 1+1</span>
                </button>
              </div>
            </div>
          )}

          <ScreenErrorBoundary key={currentScreen} onReset={() => setCurrentScreen('home')}>
          <Suspense fallback={<ScreenFallback />}>
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
            <TasksScreen 
              darkMode={darkMode} 
              onNavigate={(scr) => setCurrentScreen(scr)}
              onOpenCreateCampaign={() => setCurrentScreen('create_campaign')}
            />
          )}

          {currentScreen === 'create_campaign' && (
            <CreateCampaignScreen darkMode={darkMode} />
          )}

          {currentScreen === 'marketplace' && (
            <MarketplaceScreen
              darkMode={darkMode}
              onOrderService={() => {}}
              onNavigate={(scr) => setCurrentScreen(scr)}
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
            user.email === 'quocthiencr90@gmail.com' ? (
              <AdminScreen darkMode={darkMode} />
            ) : (
              <HomeScreen
                darkMode={darkMode}
                onNavigate={(scr) => setCurrentScreen(scr)}
                onOpenDeposit={openDeposit}
                onOpenWithdraw={openWithdraw}
                onOpenCreateCampaign={() => setCurrentScreen('create_campaign')}
              />
            )
          )}

          {currentScreen === 'policy_guide' && (
            <PolicyGuideScreen darkMode={darkMode} />
          )}
          </Suspense>
          </ScreenErrorBoundary>
        </main>
      </div>

      {/* THANH CHỮ CẢNH BÁO BẢO MẬT & CHẾ TÀI PHÁP CHẾ (CHẠY TỪ TỪ Ở ĐÁY MÀN HÌNH) */}
      <AntiFraudMarqueeTicker onOpenLegalModal={() => setCurrentScreen('profile_wallet')} />

      {/* Mobile Bottom Navigation Bar (Phone First) */}
      <MobileNav
        currentScreen={currentScreen}
        onSelectScreen={(scr) => setCurrentScreen(scr)}
      />

      {/* Interactive Modals (Chỉ mount vào DOM khi đang mở — tăng tốc giao diện gấp nhiều lần!) */}
      <Suspense fallback={null}>
        {isRunnerOpen && <TikTokTaskRunnerModal />}
        {isFeedRunnerOpen && <TikTokFeedRunnerModal />}
        {isLiveRunnerOpen && <LivestreamRunnerModal />}
        {isBuyerPortalOpen && <BuyerLiveManagerModal />}
        {isLuckyWheelOpen && <LuckyWheelModal />}
        {isConnectOpen && <TikTokConnectModal />}
        {isWithdrawOpen && <BankWithdrawModal />}
        {isKycModalOpen && <KycVerificationModal isOpen={isKycModalOpen} onClose={closeKycModal} />}
        {isPolicyOpen && <PolicyGuideModal />}
        {isBookingModalOpen && <CreateBookingModal />}
        {isSubmitDemoModalOpen && <SubmitDemoModal />}
        {isShareModalOpen && <ShareVideoModal />}
        {isMarqueeBoostModalOpen && <MarqueeBoostModal />}
        {isMarqueeHistoryModalOpen && <MarqueeHistoryModal />}
        {isAuthModalOpen && <AuthModal />}
        {isFireworksOpen && (
          <FireworksCongratulationModal
            data={fireworksData}
            isOpen={isFireworksOpen}
            onClose={closeFireworks}
          />
        )}
        {isPwaModalOpen && (
          <PwaInstallGuideModal
            isOpen={isPwaModalOpen}
            onClose={closePwaModal}
          />
        )}
        {isFraudAppealModalOpen && (
          <FraudAppealModal
            isOpen={isFraudAppealModalOpen}
            onClose={closeFraudAppealModal}
            targetTask={fraudAppealTargetTask}
          />
        )}
        {isTaskDetailModalOpen && (
          <TaskHistoryDetailModal
            isOpen={isTaskDetailModalOpen}
            onClose={closeTaskDetail}
            item={selectedTaskDetail}
          />
        )}
        <LivestreamBannerPopup />

        {/* Global Command Palette (Ctrl + K) */}
        {isCommandPaletteOpen && (
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              setIsCommandPaletteOpen(false);
            }}
          />
        )}

        {/* SePay VietQR Deposit Modal */}
        {isDepositOpen && (
          <PaymentModal
            isOpen={isDepositOpen}
            onClose={closeDeposit}
            onDepositSuccess={handleDepositSuccess}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {/* SePay Universal Checkout Modal */}
        {isSepayModalOpen && (
          <SepayUniversalCheckoutModal
            isOpen={isSepayModalOpen}
            item={sepayCheckoutItem}
            onClose={closeSepayModal}
            onSuccess={handleSepaySuccess}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {/* Bottom-Left Floating User Join Notification */}
        <RecentUserJoinNotification />

        {/* New User Onboarding Tour Guide */}
        <OnboardingTourGuide onNavigate={(scr) => setCurrentScreen(scr)} />
      </Suspense>

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
