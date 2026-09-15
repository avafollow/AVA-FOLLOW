import React from 'react';
import { 
  Home, 
  UserCheck, 
  Play, 
  PlusCircle, 
  Wallet
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
  const { tasks, openFeedRunner } = useTikTokApp();
  const openTasksCount = tasks.filter(t => t.status === 'open').length;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0D17]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onSelectScreen('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentScreen === 'home' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Trang chủ</span>
        </button>

        {/* Tasks */}
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
        >
          <div className="p-3.5 rounded-full bg-gradient-to-tr from-[#FF0050] via-purple-600 to-[#00F2FE] text-white shadow-xl shadow-rose-600/40 group-active:scale-90 transition-transform animate-pulse">
            <Play className="h-5 w-5 fill-white" />
          </div>
          <span className="text-[10px] font-black text-rose-400 mt-0.5">LƯỚT FEED</span>
        </button>

        {/* Create Campaign (Tạo Chiến Dịch / Tab Video & Live) */}
        <button
          onClick={() => onSelectScreen('create_campaign')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentScreen === 'create_campaign' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <PlusCircle className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-black text-[8px] font-mono font-bold">
              HOT
            </span>
          </div>
          <span className="text-[10px] mt-0.5">Tạo chiến dịch</span>
        </button>

        {/* Profile / Wallet */}
        <button
          onClick={() => onSelectScreen('profile_wallet')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentScreen === 'profile_wallet' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Ví Xu</span>
        </button>
      </div>
    </div>
  );
};
