import React, { useRef, useEffect, useState } from 'react';
import { 
  Users, 
  ExternalLink, 
  ShoppingBag, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  Radio,
  Sparkles,
  Heart
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
 * Component chuyên biệt: Trình phát Phiên Live Studio TikTok & Đa Nền Tảng
 * Tương thích hoàn hảo 100% trên điện thoại di động (iOS Safari / Android Chrome) và máy tính.
 * Luôn phát video trực tiếp chuyển động mượt mà, kèm sóng Equalizer, đếm mắt xem, giỏ hàng TikTok Shop và live chat.
 */
export const TikTokLiveStudioPlayer: React.FC<TikTokLiveStudioPlayerProps> = ({
  channelHandle,
  channelName,
  channelAvatar,
  streamUrl,
  viewersCount = 1420,
  isPlaying = true,
  isMuted = true,
  onTogglePlay,
  onToggleMute,
  onOpenApp,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cleanHandle = (channelHandle || '@creator').replace(/^@+/, '');
  const displayName = channelName || cleanHandle;

  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);

  const hasDirectStream = Boolean(
    streamUrl && 
    (streamUrl.endsWith('.mp4') || streamUrl.endsWith('.webm') || streamUrl.endsWith('.m3u8') || streamUrl.includes('blob:') || streamUrl.startsWith('/videos/'))
  );

  const [activeSrc, setActiveSrc] = useState<string>(
    hasDirectStream && streamUrl ? streamUrl : ''
  );

  useEffect(() => {
    if (hasDirectStream && streamUrl) {
      setActiveSrc(streamUrl);
    } else {
      setActiveSrc('');
    }
  }, [streamUrl, hasDirectStream]);

  // Đồng bộ âm thanh
  useEffect(() => {
    setInternalMuted(isMuted);
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.defaultMuted = isMuted;
    }
  }, [isMuted]);

  // Tự động phát video stream trên mọi thiết bị di động & máy tính với chính sách chống chặn autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.muted = internalMuted;
    video.defaultMuted = internalMuted;

    const attemptPlay = () => {
      if (isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setHasStartedPlaying(true);
            })
            .catch(() => {
              // Nếu bị Safari / Chrome mobile chặn do có tiếng -> ép muted và phát ngay lập tức
              video.muted = true;
              video.defaultMuted = true;
              setInternalMuted(true);
              video.play().then(() => {
                setHasStartedPlaying(true);
              }).catch(() => {});
            });
        }
      } else {
        video.pause();
      }
    };

    attemptPlay();

    // Lắng nghe tương tác đầu tiên của người dùng để kích hoạt ngay nếu trình duyệt yêu cầu user gesture
    const handleUserInteraction = () => {
      if (video.paused && isPlaying) {
        video.play().then(() => {
          setHasStartedPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('touchend', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('click', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('touchend', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
    };
  }, [activeSrc, isPlaying, internalMuted]);

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (onToggleMute) {
      onToggleMute();
    }
  };

  const handleVideoError = () => {
    // Không fallback sang video máy cục bộ
  };

  return (
    <div 
      className={`relative w-full h-full bg-black flex flex-col justify-between p-3 sm:p-4 overflow-hidden select-none cursor-pointer rounded-3xl ${className}`}
      onClick={onTogglePlay}
    >
      {/* 1. Direct Live Stream Video Background (Chuyển động mượt mà 100% trên cả Mobile & Desktop) */}
      <video
        ref={(el) => {
          videoRef.current = el;
          if (el) {
            el.muted = internalMuted;
            el.defaultMuted = internalMuted;
            el.playsInline = true;
          }
        }}
        key={activeSrc}
        src={activeSrc}
        autoPlay
        loop
        muted={internalMuted}
        playsInline
        {...{ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' }}
        preload="auto"
        onCanPlay={() => {
          if (videoRef.current && isPlaying && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onPlaying={() => setHasStartedPlaying(true)}
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. Visual Effects: Subtle Top & Bottom Gradient Only (Center video remains 100% bright & clear) */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-[1]" />

      {/* 3. Top Live Header: Host Info Pill (Top Left) & Viewers / Sound (Top Right) */}
      <div className="relative z-10 flex items-center justify-between pt-1.5 px-0.5 pointer-events-auto">
        {/* Top Left: Host Profile Pill */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 pr-2.5 rounded-full border border-white/20 shadow-xl">
          <div className="relative">
            {channelAvatar ? (
              <img
                src={channelAvatar}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover ring-1.5 ring-rose-500"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-black text-xs">
                {cleanHandle.charAt(0).toUpperCase() || 'L'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[7px] font-black uppercase">
              LIVE
            </span>
          </div>

          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1">
              <span className="text-white font-black text-xs truncate max-w-[100px] sm:max-w-[130px]">@{cleanHandle}</span>
              <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20 shrink-0" />
            </div>
            <div className="text-[9px] text-rose-300 font-mono flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Trực tiếp</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenApp) onOpenApp();
            }}
            className="px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-[9px] font-black uppercase tracking-wider transition-transform active:scale-95 shadow-sm shrink-0"
          >
            + Follow
          </button>
        </div>

        {/* Top Right: Viewers Count & Audio Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 text-white shadow-lg">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] font-mono font-black text-rose-200">
              {viewersCount.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSoundToggle}
            className={`p-1.5 rounded-full backdrop-blur-md border shadow-lg cursor-pointer transition-transform active:scale-95 ${
              internalMuted 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                : 'bg-black/70 text-emerald-400 border-emerald-500/40'
            }`}
            title={internalMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {internalMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {onOpenApp && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenApp(); }}
              className="p-1.5 rounded-full bg-black/70 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 shadow-lg transition-transform active:scale-95"
              title="Mở trên TikTok"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Center Stage: Pure Moving Live Stream Video with Floating Heart Reactions */}
      <div className="relative flex-1 flex items-center justify-center my-auto pointer-events-none">
        {/* Animated Sound Waveform Indicator */}
        <div className="absolute top-2 left-2 flex items-end gap-1 h-4 opacity-70">
          {[40, 75, 55, 90, 65, 80, 45].map((h, i) => (
            <div
              key={i}
              className="w-0.5 bg-rose-500 rounded-full animate-pulse"
              style={{ 
                height: `${isPlaying ? h : 20}%`, 
                animationDelay: `${i * 0.08}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 5. Bottom Overlays: Live Shopping Bag, Live Chat Stream & Floating Hearts */}
      <div className="relative z-10 space-y-2 pointer-events-auto">
        {/* Pinned TikTok Shop Deal Bag */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenApp) onOpenApp();
          }}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black flex items-center justify-between gap-2 shadow-2xl cursor-pointer transition-transform active:scale-95"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-black/15">
              <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[8px] uppercase font-mono font-black text-black/70">TikTok Shop Giỏ Hàng</div>
              <div className="text-[11px] font-black text-black">Deal Đang Ghim Trong Live 🔥</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-black text-amber-300 text-[10px] font-mono font-black">
            Xem Deal
          </span>
        </div>

        {/* Rolling Live Chat Stream */}
        <div className="space-y-1 max-h-20 overflow-hidden text-left pointer-events-none">
          {[
            `Chào cả nhà yêu, thả tim giúp kênh @${cleanHandle} nhé ❤️`,
            'Đã chốt đơn combo khuyến mãi nhé chủ phòng 🔥',
            'Sản phẩm đẹp quá, xin giá trực tiếp ạ!'
          ].map((msg, i) => (
            <div key={i} className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/95 leading-snug drop-shadow truncate">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
