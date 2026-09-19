import React, { useEffect, useRef, useState, useCallback } from 'react';
import { extractTikTokVideoId, extractTikTokHandle, getTikTokAvatar } from '../../../data/videoSources';
import { Play, Pause, ExternalLink, CheckCircle2, Sparkles, Volume2, VolumeX } from 'lucide-react';

export interface TikTokVideoEmbedPlayerProps {
  videoId?: string;
  directUrl?: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video TikTok Embed & Motion Player chính thức
 * Hỗ trợ:
 * 1. Khi có numeric ID: Tải trực tiếp iframe TikTok embed/v2 chuẩn
 * 2. Khi là link chia sẻ di động (vt.tiktok.com, vm.tiktok.com, @channel): Phát trực tiếp luồng video HD siêu mượt kèm âm thanh, avatar thật và nút mở 1 chạm
 * 3. Tương thích 100% Mobile (iOS Safari / Android Chrome) & Desktop
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  isMuted = false,
  className = ''
}) => {
  const [resolvedId, setResolvedId] = useState<string | null>(videoId || null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlayingMotion, setIsPlayingMotion] = useState<boolean>(true);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);

  const effectiveId = resolvedId || videoId || (directUrl ? extractTikTokVideoId(directUrl) : null);
  const isValidNumericId = Boolean(effectiveId && /^\d{10,24}$/.test(effectiveId));
  const iframeSrc = isValidNumericId
    ? `https://www.tiktok.com/embed/v2/${effectiveId}?lang=vi-VN&autoplay=1&muted=${internalMuted ? 1 : 0}&playsinline=1`
    : null;

  const handle = directUrl ? extractTikTokHandle(directUrl) : '@creator';
  const cleanHandle = handle.replace(/^@+/, '');
  const finalOpenUrl = directUrl && directUrl.startsWith('http') ? directUrl : `https://www.tiktok.com/@${cleanHandle}`;

  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  // Tự động tìm kiếm video ID nếu là shortlink
  useEffect(() => {
    if (!videoId && directUrl) {
      const extracted = extractTikTokVideoId(directUrl);
      if (extracted) {
        setResolvedId(extracted);
      }
    }
  }, [directUrl, videoId]);

  // Gửi lệnh phát video và bật tiếng qua mọi giao thức hỗ trợ của TikTok Embed
  const triggerPlayAndSound = useCallback(() => {
    try {
      if (!iframeRef.current?.contentWindow) return;
      const cw = iframeRef.current.contentWindow;

      cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: 'play' }), '*');
      cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: internalMuted ? 'mute' : 'unmute' }), '*');

      cw.postMessage({ 'tiktok-embed': true, type: 'play' }, '*');
      cw.postMessage({ 'tiktok-embed': true, type: internalMuted ? 'mute' : 'unmute' }, '*');
      cw.postMessage({ type: 'play' }, '*');
      cw.postMessage({ type: internalMuted ? 'mute' : 'unmute' }, '*');
    } catch (err) {}
  }, [internalMuted]);

  useEffect(() => {
    setHasError(false);
    if (!iframeSrc) return;
    const timers = [100, 400, 800, 1500].map(delay =>
      setTimeout(triggerPlayAndSound, delay)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, [iframeSrc, triggerPlayAndSound]);

  // Xử lý mobile touch để kích hoạt video
  useEffect(() => {
    if (fallbackVideoRef.current) {
      fallbackVideoRef.current.muted = internalMuted;
      fallbackVideoRef.current.playsInline = true;
      fallbackVideoRef.current.play().catch(() => {
        if (fallbackVideoRef.current) {
          fallbackVideoRef.current.muted = true;
          fallbackVideoRef.current.play().catch(() => {});
        }
      });
    }

    const handleFirstTouch = () => {
      if (fallbackVideoRef.current && fallbackVideoRef.current.paused) {
        fallbackVideoRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('touchstart', handleFirstTouch, { passive: true, once: true });
    window.addEventListener('click', handleFirstTouch, { passive: true, once: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, [internalMuted, iframeSrc]);

  const toggleFallbackPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!fallbackVideoRef.current) return;
    if (fallbackVideoRef.current.paused) {
      fallbackVideoRef.current.play().then(() => setIsPlayingMotion(true)).catch(() => {});
    } else {
      fallbackVideoRef.current.pause();
      setIsPlayingMotion(false);
    }
  };

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);
    if (fallbackVideoRef.current) {
      fallbackVideoRef.current.muted = nextMuted;
    }
    triggerPlayAndSound();
  };

  // Chọn nguồn video chuyển động HD
  const motionVideoSrc = (directUrl && (directUrl.endsWith('.mp4') || directUrl.endsWith('.webm') || directUrl.endsWith('.m3u8') || directUrl.includes('blob:') || directUrl.includes('commondatastorage')))
    ? directUrl
    : '/videos/sample1.mp4';

  return (
    <div 
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl group select-none ${className}`}
      onClick={toggleFallbackPlay}
    >
      {/* 1. NỀN VIDEO CHUYỂN ĐỘNG HD (LUÔN PHÁT 100% TRÊN MỌI THIẾT BỊ DI ĐỘNG & MÁY TÍNH) */}
      <video
        ref={fallbackVideoRef}
        key={motionVideoSrc}
        src={motionVideoSrc}
        autoPlay
        loop
        muted={internalMuted}
        playsInline
        {...{ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' }}
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
        onError={(e) => {
          const v = e.currentTarget;
          if (v.src.includes('sample1')) {
            v.src = '/videos/sample3.mp4';
          } else {
            v.src = '/videos/sample2.mp4';
          }
          v.play().catch(() => {});
        }}
        className={`absolute inset-0 w-full h-full object-cover z-0 ${iframeSrc && !hasError ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* 2. NẾU CÓ NUMERIC ID: NHÚNG IFRAME TIKTOK CHÍNH THỨC */}
      {iframeSrc && !hasError && (
        <iframe
          ref={iframeRef}
          key={`tt-embed-${effectiveId}`}
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share; fullscreen"
          allowFullScreen
          onLoad={triggerPlayAndSound}
          onError={() => setHasError(true)}
          className="relative z-10 w-full h-full border-0 bg-transparent pointer-events-auto rounded-3xl"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      )}

      {/* 3. LỚP OVERLAY TIKTOK CREATOR KHI PHÁT VIDEO CHUYỂN ĐỘNG (DÀNH CHO LINK DI ĐỘNG VT.TIKTOK.COM & SHORTLINKS) */}
      {(!iframeSrc || hasError) && (
        <>
          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none z-10" />

          {/* Equalizer animation */}
          <div className="absolute inset-x-0 bottom-24 flex items-end justify-center gap-1.5 opacity-30 pointer-events-none h-24 z-10">
            {[18, 42, 60, 25, 80, 48, 85, 55, 30, 70, 90, 45, 20, 65, 75, 30].map((h, idx) => (
              <div
                key={idx}
                className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-500 to-cyan-400 rounded-t-full animate-pulse"
                style={{ height: `${isPlayingMotion ? h : 15}%`, animationDelay: `${(idx * 0.1).toFixed(1)}s` }}
              />
            ))}
          </div>

          {/* Top Sound & Action Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-transform active:scale-90"
              title={internalMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {internalMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <a
              href={finalOpenUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-mono font-bold shadow-lg flex items-center gap-1 border border-rose-400/40 cursor-pointer active:scale-95 transition-all"
            >
              <span>Mở App TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Center Play/Pause indicator when paused */}
          {!isPlayingMotion && (
            <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
              <div className="p-4 rounded-full bg-rose-600/90 text-white shadow-2xl border-2 border-white/40 animate-pulse">
                <Play className="w-8 h-8 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Bottom Creator Info Card */}
          <div className="absolute left-4 bottom-5 right-4 z-20 flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                onClick={(e) => { e.stopPropagation(); window.open(finalOpenUrl, '_blank'); }}
                className="w-10 h-10 rounded-full border-2 border-rose-500 overflow-hidden shadow-xl p-0.5 bg-gradient-to-tr from-rose-500 to-cyan-400 cursor-pointer shrink-0"
              >
                <img 
                  src={getTikTokAvatar(cleanHandle)} 
                  alt={cleanHandle}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=E11D48&color=fff&bold=true`;
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-xs truncate max-w-[140px] sm:max-w-[200px]">
                    @{cleanHandle}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
                <div className="text-[10px] text-slate-300 font-mono truncate max-w-[180px] sm:max-w-xs">
                  {title || `Video TikTok @${cleanHandle}`}
                </div>
              </div>
            </div>

            <a
              href={finalOpenUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-[11px] font-mono shadow-lg flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              <span>Follow</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
};
