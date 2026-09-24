import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  Link2, 
  Play, 
  TrendingUp, 
  Wallet
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

const ONBOARDING_STORAGE_KEY = 'ava_onboarding_completed_v1';

interface TourStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  keyPoints: string[];
  actionLabel?: string;
  actionScreen?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: 'Bước 1: Kết Nối Kênh TikTok & MXH',
    subtitle: 'Khởi đầu kiếm tiền & bảo vệ tài khoản',
    description: 'Liên kết kênh TikTok chính chủ của bạn để hệ thống tự động xác thực danh tính KYC, kích hoạt liên kết 1-1 chống gian lận và mở khóa toàn bộ quyền hạn kiếm Xu.',
    badge: 'ĐIỂM XUẤT PHÁT',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: Link2,
    accentColor: 'text-rose-400',
    bgGradient: 'from-rose-500/20 via-slate-900/80 to-slate-950',
    keyPoints: [
      'Xác thực kênh thật 100% không lo bị khóa',
      'Nhận ngay gói quà tặng tân thủ 10.000 Xu',
      'Đồng bộ tức thì mọi tương tác qua hệ thống'
    ],
    actionLabel: 'Kết Nối Ngay',
    actionScreen: 'connect_modal'
  },
  {
    stepNumber: 2,
    title: 'Bước 2: Lướt Video & Xem Live Kiếm Tiền',
    subtitle: 'Nhận Xu tức thì cho từng tương tác',
    description: 'Lướt xem video đề xuất FYP chuẩn 15s - 30s, thả tim, gửi bình luận chân thực hoặc tham gia giữ mắt xem phiên livestream để nhận Xu thưởng tự động cộng vào ví.',
    badge: 'KIẾM THU NHẬP',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: Play,
    accentColor: 'text-pink-400',
    bgGradient: 'from-pink-500/20 via-slate-900/80 to-slate-950',
    keyPoints: [
      'Trình phát tự động phát ngay không giật lag',
      'Thưởng từ 100 Xu đến 400 Xu cho mỗi nhiệm vụ',
      'Không giới hạn số lượng video & live trong ngày'
    ],
    actionLabel: 'Lướt Video Ngay',
    actionScreen: 'watch_feed'
  },
  {
    stepNumber: 3,
    title: 'Bước 3: Tạo Chiến Dịch Tăng Trưởng Toàn Diện',
    subtitle: 'Đẩy kênh lên xu hướng & bùng nổ đơn hàng',
    description: 'Sử dụng Xu kiếm được hoặc nạp trực tiếp để tạo chiến dịch tăng Follow người thật, tăng lượt xem video, tăng mắt xem Live và kích hoạt thuật toán đề xuất.',
    badge: 'TĂNG TRƯỞNG KÊNH',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: TrendingUp,
    accentColor: 'text-purple-400',
    bgGradient: 'from-purple-500/20 via-slate-900/80 to-slate-950',
    keyPoints: [
      '154,200+ người dùng thật đang hoạt động',
      'Cam kết bảo hành chống tụt 30 ngày bù đủ 100%',
      'Cơ chế phân phối Drip-feed nhịp độ tự nhiên'
    ],
    actionLabel: 'Tạo Chiến Dịch',
    actionScreen: 'campaigns'
  },
  {
    stepNumber: 4,
    title: 'Bước 4: Quản Lý Ví & Rút Tiền Về ATM 24/7',
    subtitle: 'Tỷ lệ quy đổi 1 Xu = 1 VNĐ minh bạch',
    description: 'Theo dõi biến động số dư và yêu cầu rút tiền về bất kỳ tài khoản ngân hàng ATM / VietQR Napas247 nào tại Việt Nam với tốc độ xử lý tức thì không mất phí.',
    badge: 'RÚT TIỀN NHANH',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Wallet,
    accentColor: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 via-slate-900/80 to-slate-950',
    keyPoints: [
      'Quy đổi tỷ lệ 1 Xu = 1 VNĐ minh bạch tuyệt đối',
      'Rút tiền về VietQR / Napas247 mọi ngân hàng',
      'Sổ cái đối soát giao dịch an toàn chuẩn ngân hàng'
    ],
    actionLabel: 'Khám Phá Ví',
    actionScreen: 'profile'
  }
];

interface OnboardingTourGuideProps {
  onNavigate?: (screen: any) => void;
}

export const OnboardingTourGuide: React.FC<OnboardingTourGuideProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const { openConnect, openFeedRunner } = useTikTokApp();

  useEffect(() => {
    // Chỉ hiển thị DUY NHẤT 1 LẦN cho tài khoản mới hoặc chưa từng hoàn thành onboarding
    try {
      const isCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!isCompleted) {
        // Tự động mở sau 600ms khi người dùng mới vào app
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleFinish = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {}
    setIsOpen(false);
  };

  // Lắng nghe phím Escape để bấm tắt nhanh
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.icon;
  const progressPercent = ((currentStepIndex + 1) / TOUR_STEPS.length) * 100;

  return (
    <div 
      onClick={handleFinish}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#0b0f19] border border-white/15 shadow-2xl overflow-hidden flex flex-col cursor-default"
      >
        {/* Top Gradient Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400" />

        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black text-white font-mono flex items-center gap-2">
                <span>HƯỚNG DẪN DÀNH CHO NGƯỜI MỚI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  {currentStepIndex + 1}/{TOUR_STEPS.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Làm quen 4 bước cốt lõi để sử dụng nền tảng hiệu quả</p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Bỏ qua hướng dẫn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-1">
          <div 
            className="bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Content Area */}
        <div className={`p-5 sm:p-6 bg-gradient-to-b ${currentStep.bgGradient} space-y-4`}>
          {/* Badge & Step Icon */}
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${currentStep.badgeColor}`}>
              {currentStep.badge}
            </span>
            <div className={`p-3 rounded-2xl bg-white/10 border border-white/10 shadow-lg ${currentStep.accentColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white font-display">
              {currentStep.title}
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-0.5">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Detailed Description Box */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Key Points Bullet List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">
              Điểm quan trọng cần nắm rõ:
            </div>
            {currentStep.keyPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-all font-mono cursor-pointer"
          >
            Bỏ qua
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            )}

            {currentStepIndex < TOUR_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
              >
                <span>Bước tiếp theo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
              >
                <span>Bắt đầu trải nghiệm ngay 🚀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
