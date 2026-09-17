import React from 'react';
import { 
  Home, 
  UserCheck, 
  PlusCircle, 
  ShoppingBag, 
  Share2, 
  Users, 
  Wallet, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Play, 
  BarChart3, 
  Coins, 
  Building2,
  Cpu,
  Video,
  Globe,
  Smartphone,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  darkMode: boolean;
  onNavigateToLanding?: () => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  darkMode,
  onNavigateToLanding
}) => {
  const { user, tasks, openFeedRunner, openPwaModal, logout } = useTikTokApp();
  const openTasksCount = tasks.filter(t => t.status === 'open').length;

  const navItems: NavItem[] = [
    { id: 'home', label: 'TRANG CHỦ', icon: Home },
    { id: 'create_campaign', label: 'TẠO CHIẾN DỊCH', icon: PlusCircle, badge: 'HOT' },
    { id: 'tasks', label: 'KIẾM TIỀN NGAY', icon: UserCheck, badge: `${openTasksCount} MỚI` },
    { id: 'booking_escrow', label: 'KẾT NỐI KOC', icon: Video, badge: 'KOC' },
    { id: 'business_portal', label: 'QUẢN LÝ CHIẾN DỊCH', icon: Building2, badge: 'VIP' },
    { id: 'app_marketplace', label: 'APP KIẾM TIỀN', icon: Cpu, badge: 'HOT' },
    { id: 'marketplace', label: 'GÓI TĂNG TRƯỞNG', icon: ShoppingBag },
    { id: 'analytics', label: 'BÁO CÁO THU NHẬP', icon: BarChart3 },
    { id: 'community', label: 'CỘNG ĐỒNG CREATOR', icon: Users },
    ...(user.email === 'quocthiencr90@gmail.com' ? [
      { id: 'admin' as const, label: 'QUẢN TRỊ HỆ THỐNG', icon: ShieldCheck, badge: 'ADMIN' }
    ] : [])
  ];

  return (
    <aside className={`w-16 lg:w-64 shrink-0 hidden md:flex flex-col justify-between border-r p-2 lg:p-4 transition-all duration-300 ${
      darkMode ? 'bg-[#0B0F19]/95 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      <div className="space-y-4">
        {/* Quick Launch Swipe Video Feed */}
        <button
          onClick={() => {
            onSelectScreen('tasks');
            openFeedRunner('all');
          }}
          className="w-full py-2.5 lg:py-3 px-2 lg:px-4 rounded-2xl bg-gradient-to-r from-[#FF0050] via-purple-600 to-[#00F2FE] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          title="Lướt Video Kiếm Tiền"
        >
          <Play className="h-4 w-4 fill-white shrink-0" />
          <span className="hidden lg:inline truncate">Lướt Video Kiếm Tiền</span>
        </button>


        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-center lg:justify-between p-2.5 lg:px-3 lg:py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF0050]/20 to-purple-600/20 text-white border border-[#FF0050]/40 shadow-md shadow-rose-600/10'
                    : darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#FF0050]' : darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <span className="hidden lg:inline truncate font-display">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`hidden lg:inline text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight ${
                    item.id === 'business_portal'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : item.id === 'app_marketplace'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : item.id === 'booking_escrow'
                      ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-sm'
                      : isActive
                      ? 'bg-[#FF0050] text-white'
                      : 'bg-white/10 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Micro dot badge for collapsed tablet mode */}
                {item.badge && (
                  <span className="lg:hidden absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF0050]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>



      {/* Bottom User Quick Info Card & Action Buttons */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        {/* User Card (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 p-2 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="relative shrink-0">
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-rose-500 object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-[#0B0F19]" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-xs font-bold text-white truncate">{user.name || user.handle}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">{user.email || 'user@gmail.com'}</div>
          </div>
        </div>

        {/* Action Buttons: 1. Quay lại trang bán hàng & 2. Đăng xuất */}
        <div className="space-y-1">
          <button
            onClick={() => {
              if (onNavigateToLanding) onNavigateToLanding();
            }}
            className="w-full py-2 px-2 lg:px-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center lg:justify-between transition-all cursor-pointer group"
            title="Quay lại trang chủ bán hàng (Landing Page)"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline font-display">Trang Bán Hàng</span>
            </div>
            <span className="hidden lg:inline text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 font-mono">
              XEM
            </span>
          </button>

          <button
            onClick={() => logout()}
            className="w-full py-2 px-2 lg:px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center lg:justify-between transition-all cursor-pointer group"
            title="Đăng xuất khỏi tài khoản"
          >
            <div className="flex items-center gap-1.5 truncate">
              <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline font-display">Đăng Xuất</span>
            </div>
            <span className="hidden lg:inline text-[9px] text-rose-400/80 font-mono">
              Thoát
            </span>
          </button>
        </div>

        <div className="pt-2 text-[10px] font-mono text-slate-500 flex items-center justify-center lg:justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="hidden lg:inline">Live Server Online</span>
          </div>
          <span className="hidden lg:inline text-slate-400">v3.5</span>
        </div>
      </div>
    </aside>
  );
};
