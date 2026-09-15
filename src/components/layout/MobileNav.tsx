import React, { useState } from 'react';
import { 
  Home, 
  UserCheck, 
  Play, 
  PlusCircle, 
  Wallet,
  Menu,
  X,
  ShoppingBag,
  Building2,
  Video,
  Cpu,
  BarChart3,
  Share2,
  Users,
  BookOpen,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';

interface MobileNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentScreen,
  onSelectScreen
}) => {
  const { tasks, openFeedRunner, openPwaModal, logout, user } = useTikTokApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openTasksCount = tasks.filter(t => t.status === 'open').length;

  const allScreens: { id: ScreenId; label: string; icon: React.ElementType; badge?: string; desc: string; color: string }[] = [
    { id: 'home', label: 'Trang Chủ', icon: Home, desc: 'Tổng quan bảng điều khiển', color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30' },
    { id: 'marketplace', label: 'Gói Tăng Trưởng', icon: ShoppingBag, badge: 'HOT 1+1', desc: 'Mua Follow, Tim, Mắt Live tặng 100% View', color: 'from-amber-500/20 to-rose-500/20 text-amber-300 border-amber-500/40' },
    { id: 'tasks', label: 'Kiếm Tiền Ngay', icon: UserCheck, badge: `${openTasksCount} Mới`, desc: 'Làm nhiệm vụ kiếm Xu rút tiền mặt', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'create_campaign', label: 'Tạo Chiến Dịch', icon: PlusCircle, badge: 'HOT', desc: 'Tăng tương tác thật cho kênh TikTok', color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30' },
    { id: 'business_portal', label: 'Đối Tác Kinh Doanh', icon: Building2, badge: 'VIP', desc: 'Cổng phân phối & tiếp thị doanh nghiệp', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'booking_escrow', label: 'Kết Nối KOC', icon: Video, badge: 'ESCROW', desc: 'Booking KOC/KOL ký quỹ an toàn 3 bên', color: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30' },
    { id: 'app_marketplace', label: 'App Kiếm Tiền', icon: Cpu, badge: 'AUTO', desc: 'Phần mềm tự động & công cụ tăng trưởng', color: 'from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30' },
    { id: 'analytics', label: 'Báo Cáo Thu Nhập', icon: BarChart3, desc: 'Thống kê Xu, số dư và biểu đồ tăng trưởng', color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'affiliate', label: 'Tiếp Thị Liên Kết', icon: Share2, badge: '35%', desc: 'Chia sẻ link nhận 20% - 35% hoa hồng', color: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30' },
    { id: 'community', label: 'Cộng Đồng Creator', icon: Users, desc: 'Giao lưu học hỏi cùng 154K+ nhà sáng tạo', color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30' },
    { id: 'profile_wallet', label: 'Hồ Sơ & Ví Xu', icon: Wallet, desc: 'Rút tiền ngân hàng & cài đặt tài khoản', color: 'from-rose-500/20 to-orange-500/20 text-rose-300 border-rose-500/30' },
    { id: 'policy_guide', label: 'Chính Sách Cấp Bậc', icon: BookOpen, desc: 'Bảng quyền lợi Đồng, Bạc, Vàng, Kim Cương', color: 'from-slate-500/20 to-slate-400/20 text-slate-300 border-slate-500/30' },
    ...(user.email === 'quocthiencr90@gmail.com' ? [
      { id: 'admin' as const, label: 'Quản Trị Hệ Thống', icon: ShieldCheck, badge: 'ADMIN', desc: 'Toàn quyền điều hành & xét duyệt sàn', color: 'from-rose-600/20 to-red-600/20 text-rose-300 border-rose-600/40' }
    ] : [])
  ];

  const handleSelect = (scr: ScreenId) => {
    onSelectScreen(scr);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 1. Thanh điều hướng đáy di động (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0D17]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around">
          {/* Trang chủ */}
          <button
            onClick={() => onSelectScreen('home')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              currentScreen === 'home' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Trang chủ</span>
          </button>

          {/* Nhiệm vụ */}
          <button
            onClick={() => onSelectScreen('tasks')}
            className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              currentScreen === 'tasks' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <UserCheck className="h-5 w-5" />
              {openTasksCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-rose-600 text-white text-[8px] font-mono font-bold">
                  {openTasksCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Nhiệm vụ</span>
          </button>

          {/* Center: Lướt Kiếm Tiền Button (Phát tất cả Video & Live) */}
          <button
            onClick={() => {
              onSelectScreen('tasks');
              openFeedRunner('all');
            }}
            className="flex flex-col items-center -mt-5 group cursor-pointer"
            title="Lướt feed video & live kiếm Xu"
          >
            <div className="p-3.5 rounded-full bg-gradient-to-tr from-[#FF0050] via-purple-600 to-[#00F2FE] text-white shadow-xl shadow-rose-600/40 group-active:scale-90 transition-transform animate-pulse">
              <Play className="h-5 w-5 fill-white" />
            </div>
            <span className="text-[10px] font-black text-rose-400 mt-0.5">LƯỚT FEED</span>
          </button>

          {/* Mua Gói Tăng Trưởng (Marketplace) */}
          <button
            onClick={() => onSelectScreen('marketplace')}
            className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              currentScreen === 'marketplace' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-black text-[8px] font-mono font-bold">
                MUA
              </span>
            </div>
            <span className="text-[10px] mt-0.5">Mua gói</span>
          </button>

          {/* Tất Cả Menu Drawer */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              isMenuOpen ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Tất cả tab</span>
          </button>
        </div>
      </div>

      {/* 2. Menu Mở Rộng Tất Cả Tab Chức Năng (Full Mobile Drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div className="w-full bg-[#0D111E] rounded-t-3xl border-t border-rose-500/30 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-white">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-slate-950/80 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <img src="/ava-full-logo.png" alt="" className="w-8 h-8 rounded-xl object-cover" />
                <div>
                  <h3 className="text-sm font-black text-white font-display uppercase tracking-wide">
                    Tất Cả Chức Năng Hệ Thống
                  </h3>
                  <p className="text-[10px] text-slate-400">Chọn mục để truy cập nhanh</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold font-mono transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Đóng</span>
              </button>
            </div>

            {/* Prominent CTA: Mua Gói Tăng Trưởng 1+1 */}
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border-b border-amber-500/20 shrink-0">
              <div 
                onClick={() => handleSelect('marketplace')}
                className="cursor-pointer p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between gap-3 shadow-md hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-slate-950 shadow-md">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>MUA GÓI TĂNG TRƯỞNG KÊNH</span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[8px] font-mono font-bold">1+1</span>
                    </div>
                    <p className="text-[10px] text-amber-200">Tặng 100% Lượt Xem Video cho 100 đơn đầu</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-300 shrink-0" />
              </div>
            </div>

            {/* Screen Items Grid */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allScreens.map((scr) => {
                  const Icon = scr.icon;
                  const isCurrent = currentScreen === scr.id;
                  return (
                    <div
                      key={scr.id}
                      onClick={() => handleSelect(scr.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-rose-600/20 border-rose-500 text-white ring-1 ring-rose-500/50' 
                          : `bg-[#13192B] hover:bg-white/5 border-white/5 hover:border-white/20 text-slate-300`
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 bg-gradient-to-br ${scr.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white font-display truncate">
                              {scr.label}
                            </span>
                            {scr.badge && (
                              <span className="px-1.5 py-0.2 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[8px] font-mono font-bold">
                                {scr.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{scr.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Tools: Cài App PWA & Thoát */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openPwaModal();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Cài App PWA</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer: Về Trang Chủ */}
            <div className="p-3 bg-black/60 border-t border-white/10 shrink-0">
              <button
                onClick={() => handleSelect('home')}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-display flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Quay Về Trang Chủ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
