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
  Smartphone
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
  const { user, tasks, openFeedRunner, openPwaModal } = useTikTokApp();
  const openTasksCount = tasks.filter(t => t.status === 'open').length;

  const navItems: NavItem[] = [
    { id: 'home', label: 'TRANG CHỦ', icon: Home },
    { id: 'create_campaign', label: 'TẠO CHIẾN DỊCH', icon: PlusCircle, badge: 'HOT' },
    { id: 'tasks', label: 'KIẾM TIỀN NGAY', icon: UserCheck, badge: `${openTasksCount} MỚI` },
    { id: 'booking_escrow', label: 'KẾT NỐI KOC', icon: Video, badge: 'KOC' },
    { id: 'business_portal', label: 'ĐỐI TÁC KINH DOANH', icon: Building2, badge: 'VIP' },
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



      {/* Bottom User Quick Info Card */}
      <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-500 flex items-center justify-center lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="hidden lg:inline">Hệ thống VIP Live</span>
        </div>
        <span className="hidden lg:inline text-slate-400">v3.5 Escrow</span>
      </div>
    </aside>
  );
};
