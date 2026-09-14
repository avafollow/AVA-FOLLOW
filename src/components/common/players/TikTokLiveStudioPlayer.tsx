import React, { useRef, useEffect } from 'react';
import { 
  Users, 
  ExternalLink, 
  ShoppingBag, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause 
} from 'lucide-react';

export interface TikTokLiveStudioPlayerProps {
  channelHandle: string;
  channelName?: string;
  channelAvatar?: string;
  streamUrl?: string;
  viewersCount?: number;
  isPlaying?: boolean;
  isMuted?: boolean;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onOpenApp?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Phiên Live Studio TikTok
 * Tách riêng biệt hoàn toàn với video thường để không bị chồng chéo code.
 * Bao gồm video chuyển động nền, âm thanh, sóng Equalizer, đếm mắt xem, giỏ hàng TikTok Shop và live chat.
 */
export const TikTokLiveStudioPlayer: React.FC<TikTokLiveStudioPlayerProps> = ({
  channelHandle,
  channelName,
  channelAvatar,
  streamUrl = '/videos/sample2.mp4',
  viewersCount = 1420,
  isPlaying = true,
  isMuted = false,
  onTogglePlay,
  onToggleMute,
  onOpenApp,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cleanHandle = (channelHandle || '@creator').replace(/^@+/, '');
  const displayName = channelName || cleanHandle;

  // Auto-play video motion in background with audio support
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
      videoRef.current.muted = isMuted;
      videoRef.current.playsInline = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [streamUrl, isMuted, isPlaying]);

  return (
    <div 
      className={`relative w-full h-full bg-black flex flex-col justify-between p-4 overflow-hidden select-none cursor-pointer rounded-3xl ${className}`}
      onClick={onTogglePlay}
    >
      {/* 1. Background Live Motion Video */}
      <video
        ref={videoRef}
        src={streamUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onCanPlay={(e) => {
          const v = e.currentTarget;
          if (v.paused) {
            v.play().catch(() => {
              v.muted = true;
              v.play().catch(() => {});
            });
          }
        }}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />

      {/* 2. Visual Effects & Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(244,63,94,0.2),transparent_70%)] animate-pulse pointer-events-none" />
      <div className="absolute top-1/4 -right-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-12 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Top Live Header & Action */}
      <div className="relative z-10 flex items-center justify-between pt-8 px-1">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-rose-300 uppercase tracking-wider">
            LIVE 🔴 TRỰC TIẾP
          </span>
          <span className="text-white/40">|</span>
          <span className="text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1">
            <Users className="w-3 h-3 text-rose-400" />
            <span>{viewersCount.toLocaleString()} mắt xem</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleMute && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-lg cursor-pointer"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          )}
          {onOpenApp && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenApp(); }}
              className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-mono font-bold border border-rose-400/40 shadow-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
              title="Mở trực tiếp trên App TikTok để xem phòng live"
            >
              <span>Mở App TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Center Host Visualizer */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-3 pointer-events-none">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 animate-spin opacity-75 blur-[2px]" style={{ animationDuration: '6s' }} />
          {channelAvatar ? (
            <img
              src={channelAvatar}
              alt={displayName}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-2xl"
            />
          ) : (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black p-1 border-2 border-white shadow-2xl flex items-center justify-center text-white font-black text-2xl">
              {cleanHandle.charAt(0).toUpperCase() || 'L'}
            </div>
          )}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-lg border border-rose-300/40 animate-pulse">
            ON AIR
          </div>
        </div>

        <div className="text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1">
            <span className="text-white font-black text-base drop-shadow-lg">@{cleanHandle}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          </div>
          <p className="text-[11px] text-rose-300 font-mono font-bold flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Phiên Live Đang Phát Sóng Trực Tuyến</span>
          </p>
        </div>

        {/* Audio Waveform Equalizer */}
        <div className="flex items-end justify-center gap-1 h-8 pt-1">
          {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 60, 100, 50, 75].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full animate-pulse"
              style={{ 
                height: `${isPlaying ? h : 20}%`, 
                animationDelay: `${i * 0.08}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 5. Live Shopping Deal & Live Chat Ticker */}
      <div className="relative z-10 space-y-2 pointer-events-auto">
        {/* Pinned TikTok Shop Bag */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenApp) onOpenApp();
          }}
          className="p-2.5 rounded-2xl bg-amber-400/90 hover:bg-amber-300 text-black flex items-center justify-between gap-2 shadow-xl cursor-pointer transition-transform active:scale-95"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-black/10">
              <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[8px] uppercase font-mono font-bold text-black/70">TikTok Shop Giỏ Hàng</div>
              <div className="text-[11px] font-extrabold text-black">Deal Đang Ghim Trong Live 🔥</div>
            </div>
          </div>
          <span className="px-2 py-1 rounded-lg bg-black text-amber-300 text-[10px] font-mono font-bold">
            Xem Deal
          </span>
        </div>

        {/* Rolling Live Chat Stream */}
        <div className="space-y-1 max-h-20 overflow-hidden text-left pointer-events-none">
          {[
            'Chào cả nhà yêu, mọi người thả tim giúp shop nhé ❤️',
            'Đã chốt đơn 2 combo màu be nhé chủ phòng 🔥',
            'Chất lượng live siêu mượt, xin chào @' + cleanHandle + ' !'
          ].map((msg, i) => (
            <div key={i} className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/5 text-[10px] text-white/90 leading-snug drop-shadow truncate">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
