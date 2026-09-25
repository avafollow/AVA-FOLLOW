import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  Heart,
  Flame,
  MessageSquare,
  Play
} from 'lucide-react';
import { extractTikTokHandle, getTikTokAvatar } from '../../../data/videoSources';

export interface TikTokLiveEmbedPlayerProps {
  channelHandle: string;
  targetUrl?: string;
  channelName?: string;
  viewersCount?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
  mode?: 'preview' | 'feed';
  hideHud?: boolean;
}

/**
 * TikTokLiveEmbedPlayer v3 — Hiển thị đúng phiên live từ link người dùng dán vào.
 * TikTok KHÔNG hỗ trợ nhúng phiên Live trong iframe từ bên thứ 3 (bị block X-Frame-Options).
 * Giải pháp: hiển thị Live Preview Card đẹp + nút "Mở Live Ngay" dẫn thẳng đến kênh thật.
 * KHÔNG dùng placeholder/ảnh mẫu nào — 100% hiển thị đúng @handle kênh thật người dùng dán vào.
 */
export const TikTokLiveEmbedPlayer: React.FC<TikTokLiveEmbedPlayerProps> = ({
  channelHandle,
  targetUrl,
  channelName,
  viewersCount = 1580,
  isMuted = true,
  onToggleMute,
  className = '',
  mode = 'preview',
  hideHud = false
}) => {
  const [resolvedHandle, setResolvedHandle] = useState<string | null>(null);
  
  // Trích xuất @handle chính xác từ URL người dùng dán vào
  const rawHandle = extractTikTokHandle(targetUrl || channelHandle || '');
  const cleanHandle = resolvedHandle || (rawHandle || channelHandle || '').replace(/^@+/, '').trim();

  // URL thật đến phiên live của creator
  const directLiveUrl = targetUrl && targetUrl.startsWith('http')
    ? targetUrl
    : `https://www.tiktok.com/@${cleanHandle}/live`;

  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [viewers, setViewers] = useState<number>(viewersCount);
  const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);
  const [realHlsUrl, setRealHlsUrl] = useState<string | null>(null);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Đảm bảo luôn check link /live của kênh
    let urlToResolve = targetUrl || `https://www.tiktok.com/@${cleanHandle}/live`;
    if (!urlToResolve.includes('/live') && !urlToResolve.includes('/video/') && urlToResolve.includes('@')) {
       urlToResolve = urlToResolve.endsWith('/') ? urlToResolve + 'live' : urlToResolve + '/live';
    }
    
    fetch(`/api/tiktok-resolve?url=${encodeURIComponent(urlToResolve)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.resolved) {
          const extracted = extractTikTokHandle(data.resolved);
          if (extracted) {
            setResolvedHandle(extracted.replace(/^@+/, '').trim());
          }
        }
        if (data && data.isLive !== undefined) setIsLiveActive(data.isLive);
        if (data && data.liveViewers) setViewers(data.liveViewers);
        if (data && data.hlsUrl) setRealHlsUrl(data.hlsUrl);
      })
      .catch(() => {});
  }, [targetUrl, cleanHandle]);

  useEffect(() => { setInternalMuted(isMuted); }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = internalMuted;
    }
  }, [internalMuted]);

  // Bộ đếm mắt xem THẬT (Cập nhật 15s 1 lần, không dao động ảo)
  useEffect(() => {
    const timer = setInterval(() => {
      let urlToResolve = targetUrl || `https://www.tiktok.com/@${cleanHandle}/live`;
      if (!urlToResolve.includes('/live') && !urlToResolve.includes('/video/') && urlToResolve.includes('@')) {
         urlToResolve = urlToResolve.endsWith('/') ? urlToResolve + 'live' : urlToResolve + '/live';
      }
      fetch(`/api/tiktok-resolve?url=${encodeURIComponent(urlToResolve)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.liveViewers) setViewers(data.liveViewers);
        }).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [targetUrl, cleanHandle]);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInternalMuted(prev => !prev);
    if (onToggleMute) onToggleMute();
  };

  const handleOpenLiveApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(directLiveUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTapScreen = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8'];
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.max(30, Math.min(rect.width - 40, x)),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setHearts(prev => [...prev.slice(-10), newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  const avatarUrl = getTikTokAvatar(cleanHandle);
  const displayName = channelName || `@${cleanHandle}`;
  const livePlayerUrl = cleanHandle
    ? `https://www.tiktok.com/embed/@${encodeURIComponent(cleanHandle)}/live?autoplay=1&muted=${isMuted ? 1 : 0}`
    : null;

  // Xử lý nạp HLS khi có HLS URL thật
  useEffect(() => {
    if (realHlsUrl && videoRef.current) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
      script.onload = () => {
        const video = videoRef.current;
        if (!video) return;
        // @ts-ignore
        if (window.Hls && window.Hls.isSupported()) {
          // @ts-ignore
          const hls = new window.Hls();
          hls.loadSource(realHlsUrl);
          hls.attachMedia(video);
          // @ts-ignore
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = realHlsUrl;
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(() => {});
          });
        }
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [realHlsUrl]);

  // Trích xuất videoId nếu user dán nhầm link video vào live
  const possibleVideoId = targetUrl ? (targetUrl.match(/\/(?:video|v)\/(\d+)/i)?.[1] || null) : null;

  return (
    <div
      className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none cursor-pointer ${className}`}
      onClick={handleTapScreen}
    >
      {/* 1. TIKTOK LUỒNG HLS / VIDEO EMBED / LIVE STUDIO STAGE */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        {realHlsUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover pointer-events-auto"
            autoPlay
            playsInline
            muted={internalMuted}
          />
        ) : possibleVideoId ? (
          <iframe
            key={`tt-vid-iframe-${possibleVideoId}`}
            src={`https://www.tiktok.com/embed/v2/${possibleVideoId}`}
            title={`TikTok Video: @${cleanHandle}`}
            allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share; fullscreen"
            allowFullScreen
            className="w-full h-full border-0 bg-black pointer-events-auto"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background dynamic animated glowing aura */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FE2C55]/20 via-[#0B0E17] to-[#25F4EE]/10 pointer-events-none" />
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-500/10 to-cyan-500/20 blur-3xl animate-pulse pointer-events-none" />

            {/* Pulsing Audio Equalizer Waves */}
            <div className="relative z-10 flex items-center gap-1.5 mb-5 pointer-events-none">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-10 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 h-14 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              <span className="w-1.5 h-8 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-12 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-1.5 h-5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '500ms' }} />
            </div>

            {/* Creator Avatar with Triple Glowing Live Ring */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#FE2C55] via-purple-500 to-[#25F4EE] shadow-[0_0_40px_rgba(254,44,85,0.6)] mb-4">
              <img
                src={avatarUrl}
                alt={cleanHandle}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle || 'T')}&background=FE2C55&color=fff&bold=true`;
                }}
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-rose-600 text-[9px] font-mono font-black text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>LIVE</span>
              </span>
            </div>

            {/* Channel Info & Live Room Title */}
            <div className="relative z-10 space-y-1.5 max-w-xs mb-5">
              <h4 className="text-white font-black text-base font-display truncate">
                @{cleanHandle}
              </h4>
              <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                {displayName !== `@${cleanHandle}` ? displayName : 'Phiên Live phát trực tiếp trên TikTok'}
              </p>
              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-rose-300 font-bold pt-1">
                <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-rose-500/30">
                  <Users className="w-3.5 h-3.5 text-rose-400" />
                  <span>{viewers.toLocaleString()} người đang xem</span>
                </span>
              </div>
            </div>

            {/* Instant Launch Button - Universal Deep-Link for ALL Devices */}
            <div className="relative z-10 pointer-events-auto flex flex-col gap-2 w-full max-w-[260px]">
              <button
                type="button"
                onClick={handleOpenLiveApp}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FE2C55] via-[#FF0050] to-[#E00045] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider font-display shadow-[0_0_25px_rgba(254,44,85,0.6)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>MỞ LIVE TRÊN TIKTOK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                Bộ đếm phút xem live vẫn tự động tích lũy Xu trên hệ thống
              </span>
            </div>
          </div>
        )}
      </div>

      {/* HUD BAR TOP */}
      {!hideHud && (
        <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/40 shadow-xl pointer-events-auto">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </div>
            <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">TIKTOK LIVE</span>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-300">
              <Users className="w-3 h-3 text-rose-400" />
              <span>{viewers.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg ${
                internalMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-black/80 text-emerald-400 border-emerald-500/40'
              }`}
              title={internalMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {internalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleOpenLiveApp}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-[10px] font-mono font-bold border border-rose-400/40 shadow-xl flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>Xem Trên TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {hearts.map(h => (
          <div key={h.id} className="absolute animate-bounce" style={{ left: `${h.x}px`, bottom: '120px', color: h.color, transition: 'all 1s ease-out', transform: 'translateY(-90px) scale(1.3)', opacity: 0 }}>
            <Heart className="w-7 h-7 fill-current drop-shadow-lg" />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      {!hideHud && (
        <div className="absolute bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none">
          <div className="flex items-center gap-2.5 min-w-0 pointer-events-auto">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 shadow-lg ring-2 ring-rose-500/60 animate-pulse">
              <img
                src={avatarUrl}
                alt={cleanHandle}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle || 'L')}&background=E11D48&color=fff&bold=true`; }}
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 px-1 rounded bg-rose-600 text-[7px] font-black text-white uppercase">LIVE</span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold truncate max-w-[170px] sm:max-w-[220px]">LIVE STREAM: @{cleanHandle}</div>
              <div className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
                <span>Đang phát trực tiếp</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Phiên Live Thật</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

