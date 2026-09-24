import React, { useState, useEffect } from 'react';
import { X, Radio, ExternalLink, Sparkles } from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export interface ActiveLivestreamBanner {
  id: string;
  bannerImageUrl: string;
  targetLiveUrl: string;
  channelHandle?: string;
  liveTitle?: string;
  creatorName?: string;
}

export const LivestreamBannerPopup: React.FC = () => {
  const { activeGlobalBanner, dismissGlobalBanner, openLiveRunner } = useTikTokApp();
  const [secondsLeft, setSecondsLeft] = useState<number>(3);

  useEffect(() => {
    if (!activeGlobalBanner) return;

    setSecondsLeft(3);

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          dismissGlobalBanner();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGlobalBanner, dismissGlobalBanner]);

  if (!activeGlobalBanner) return null;

  const handleClickBanner = () => {
    dismissGlobalBanner();
    if (activeGlobalBanner.targetLiveUrl) {
      if (activeGlobalBanner.targetLiveUrl.startsWith('http')) {
        window.open(activeGlobalBanner.targetLiveUrl, '_blank', 'noopener,noreferrer');
      } else {
        openLiveRunner();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fadeIn select-none pointer-events-auto"
      onClick={dismissGlobalBanner}
    >
      {/* 50% Frame Sized Floating Banner Container (Không chữ thừa, chỉ thuần ảnh banner chuẩn 16:9) */}
      <div 
        className="relative w-full max-w-[560px] sm:w-[50vw] sm:max-h-[50vh] rounded-3xl overflow-hidden border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.4)] bg-black cursor-pointer group animate-scaleUp flex flex-col items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          handleClickBanner();
        }}
      >
        {/* Top 3-Second Countdown & LIVE Badge Bar */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-rose-500/50 shadow-xl text-[10px] font-mono font-black text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="tracking-wider">🔴 PHIÊN LIVE NỔI BẬT</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-amber-300 shadow-xl flex items-center gap-1">
              <span>Đóng sau {secondsLeft}s</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissGlobalBanner();
              }}
              className="p-1.5 rounded-full bg-black/85 hover:bg-rose-600 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl"
              title="Đóng Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pure 16:9 Aspect Ratio Banner Image (Khung hình 50% chuẩn đẹp) */}
        <div className="relative w-full aspect-[16/9] bg-black overflow-hidden flex items-center justify-center">
          <img
            src={activeGlobalBanner.bannerImageUrl}
            alt="Livestream Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-mono font-bold text-xs shadow-2xl flex items-center gap-1.5">
              <span>Bấm Để Vào Xem Live Ngay</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 3-Second Countdown Linear Bar at the Bottom */}
        <div className="w-full bg-white/10 h-1 absolute bottom-0 inset-x-0 z-30">
          <div 
            className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full transition-all ease-linear"
            style={{ 
              width: `${(secondsLeft / 3) * 100}%`,
              transitionDuration: '1000ms'
            }}
          />
        </div>
      </div>
    </div>
  );
};
