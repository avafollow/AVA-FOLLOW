import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, X, Coins, Flame } from 'lucide-react';
import { RECENT_JOINED_USERS_100, RecentJoinedUser } from '../../data/recentUsersData';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const RecentUserJoinNotification: React.FC = () => {
  const { openAuthModal } = useTikTokApp();
  const [currentUser, setCurrentUser] = useState<RecentJoinedUser | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    // Initial display after 3.5 seconds
    const initialTimer = setTimeout(() => {
      showNextUser();
    }, 3500);

    // Every 20 seconds: trigger a new notification
    const intervalTimer = setInterval(() => {
      showNextUser();
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const showNextUser = () => {
    setCurrentIndex(prev => {
      const nextIdx = (prev + 1) % RECENT_JOINED_USERS_100.length;
      setCurrentUser(RECENT_JOINED_USERS_100[nextIdx]);
      setIsVisible(true);

      // Auto hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      return nextIdx;
    });
  };

  if (!currentUser) return null;

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 left-3 sm:left-6 z-40 transition-all duration-500 transform pointer-events-auto ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div 
        onClick={() => openAuthModal && openAuthModal()}
        className="cursor-pointer max-w-[340px] sm:max-w-sm rounded-2xl bg-gradient-to-r from-[#0e1220]/95 via-[#0b0e1b]/95 to-[#130d22]/95 border border-white/15 hover:border-amber-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.15)] p-3.5 backdrop-blur-xl relative group overflow-hidden"
      >
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3">
          {/* Avatar Initial with Stylish Gradient */}
          <div className="relative shrink-0 mt-0.5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${currentUser.colorClass.split(' ')[0]} ${currentUser.colorClass.split(' ')[1]} p-0.5 shadow-md flex items-center justify-center font-black text-slate-950 text-sm`}>
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-mono font-black">
                {currentUser.initial}
              </div>
            </div>
            {/* Live Green Pulse */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>

          {/* User Info & Action Details */}
          <div className="space-y-1 flex-1 pr-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-white font-display">
                {currentUser.name}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-400 font-mono">
                ({currentUser.location})
              </span>
            </div>

            <div className="text-[11px] text-slate-300 font-sans leading-tight">
              {currentUser.action.includes('5.000 Xu') ? (
                <span>
                  {currentUser.action.split('5.000 Xu')[0]}
                  <strong className="text-amber-300 font-mono font-bold bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                    +5.000 Xu
                  </strong>
                  {currentUser.action.split('5.000 Xu')[1]}
                </span>
              ) : (
                <span>{currentUser.action}</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-0.5 text-[10px] text-slate-400 font-mono">
              <span className="text-emerald-400 font-medium">● {currentUser.timeAgo}</span>
              <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>Nhận 5.000 Xu ngay →</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
