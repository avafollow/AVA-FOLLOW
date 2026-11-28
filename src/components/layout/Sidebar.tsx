import React from 'react';
import {
  Home,
  UserCheck,
  PlusCircle,
  Users,
  ShieldCheck,
  Play,
  BarChart3,
  Building2,
  Video
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
  darkMode
}) => {
  const { user, tasks, openFeedRunner } = useTikTokApp();
  const openTasksCount = tasks.filter(t => t.status === 'open').length;

  const navItems: NavItem[] = [
    { id: 'home', label: 'TRANG CHỦ', icon: Home },
    { id: 'create_campaign', label: 'TẠO CHIẾN DỊCH', icon: PlusCircle, badge: 'HOT' },
    { id: 'tasks', label: 'NHIỆM VỤ TƯƠNG TÁC', icon: UserCheck, badge: openTasksCount > 0 ? `${openTasksCount}` : undefined },
    { id: 'booking_escrow', label: 'KÝ QUỸ KOC ESCROW', icon: Video, badge: 'ESCROW' },
    { id: 'business_portal', label: 'QUẢN LÝ CHIẾN DỊCH', icon: Building2 },
    { id: 'analytics', label: 'BÁO CÁO & THỐNG KÊ', icon: BarChart3 },
    { id: 'community', label: 'CỘNG ĐỒNG CREATOR', icon: Users },
    ...(user.email === 'quocthiencr90@gmail.com'
      ? [{ id: 'admin' as const, label: 'QUẢN TRỊ HỆ THỐNG', icon: ShieldCheck, badge: 'ADMIN' }]
      : [])
  ];

  return (
    <aside
      className={`w-16 lg:w-64 shrink-0 hidden md:flex flex-col justify-between border-r p-2.5 lg:p-4 transition-all duration-300 ${
        darkMode
          ? 'bg-[#090D16]/95 border-white/10 text-slate-300 backdrop-blur-xl'
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      <div className="space-y-4">
        {/* Quick Launch Swipe Video Feed */}
        <button
          onClick={() => {
            onSelectScreen('tasks');
            openFeedRunner('all');
          }}
          className="w-full py-2.5 lg:py-3 px-2 lg:px-4 rounded-2xl bg-gradient-to-r from-[#FF0050] via-purple-600 to-[#00F2FE] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 hover:shadow-rose-500/50 hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
          title="Lướt Feed Tương Tác Thật"
        >
          <Play className="h-4 w-4 fill-white shrink-0" />
          <span className="hidden lg:inline truncate">Lướt Feed Ngay</span>
        </button>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-center lg:justify-between p-2.5 lg:px-3.5 lg:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative cursor-pointer hover:scale-[1.03] active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF0050]/20 via-purple-600/20 to-cyan-500/10 text-white border border-[#FF0050]/45 shadow-lg shadow-rose-600/15'
                    : darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {/* Active left neon indicator bar */}
                {isActive && (
                  <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-[#FF0050] to-[#00F2FE]" />
                )}

                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-115 ${
                      isActive ? 'text-[#FF0050]' : darkMode ? 'text-slate-400 group-hover:text-cyan-300' : 'text-slate-500'
                    }`}
                  />
                  <span className="hidden lg:inline truncate font-display tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`hidden lg:inline text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${
                      item.id === 'booking_escrow'
                        ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-sm'
                        : item.id === 'admin'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isActive
                        ? 'bg-[#FF0050] text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
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
    </aside>
  );
};
