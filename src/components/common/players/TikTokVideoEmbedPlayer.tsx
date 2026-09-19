import React, { useEffect, useRef, useState, useCallback } from 'react';
import { extractTikTokVideoId, extractTikTokHandle, getTikTokAvatar } from '../../../data/videoSources';
import { Play, ExternalLink, CheckCircle2, Sparkles, Volume2, VolumeX, Loader2 } from 'lucide-react';

export interface TikTokVideoEmbedPlayerProps {
  videoId?: string;
  directUrl?: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video TikTok Embed chính thức từ TikTok
 * Hỗ trợ:
 * 1. Nhúng trực tiếp 100% video TikTok thật qua iframe embed/v2 của TikTok
 * 2. Tự động phân giải link rút gọn di động (vt.tiktok.com, vm.tiktok.com)
 * 3. Tuyệt đối KHÔNG phát video demo/mẫu chạy cảnh
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  isMuted = false,
  className = ''
}) => {
  const [resolvedId, setResolvedId] = useState<string | null>(videoId || null);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
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

  // Tự động phân giải video ID nếu là shortlink (vt.tiktok.com, vm.tiktok.com)
  useEffect(() => {
    if (videoId) {
      setResolvedId(videoId);
      return;
    }

    if (!directUrl) return;

    const extracted = extractTikTokVideoId(directUrl);
    if (extracted) {
      setResolvedId(extracted);
      return;
    }

    // Nếu là shortlink, thử gọi oEmbed để lấy video ID thật
    if (directUrl.includes('vt.tiktok.com') || directUrl.includes('vm.tiktok.com') || directUrl.includes('tiktok.com/t')) {
      setIsResolving(true);
      fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(directUrl)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.html) {
            const match = data.html.match(/data-video-id="(\d+)"/) || data.html.match(/\/video\/(\d+)/);
            if (match && match[1]) {
              setResolvedId(match[1]);
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsResolving(false);
        });
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

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);
    triggerPlayAndSound();
  };

  return (
    <div 
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl group select-none ${className}`}
    >
      {/* 1. NẾU CÓ NUMERIC ID: NHÚNG TRỰC TIẾP IFRAME TIKTOK THẬT 100% */}
      {iframeSrc && !hasError ? (
        <iframe
          ref={iframeRef}
          key={`tt-embed-${effectiveId}`}
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share; fullscreen"
          allowFullScreen
          onLoad={triggerPlayAndSound}
          onError={() => setHasError(true)}
          className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        /* 2. GIAO DIỆN KẾT NỐI KÊNH TIKTOK THẬT (KHÔNG DÙNG VIDEO DEMO) */
        <div className="relative w-full h-full bg-[#0B0F19] flex flex-col items-center justify-center overflow-hidden rounded-3xl group select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#050811]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl" />

          {/* Equalizer animation */}
          <div className="absolute inset-x-0 bottom-20 flex items-end justify-center gap-1 opacity-25 pointer-events-none h-24">
            {[14, 28, 45, 20, 65, 38, 70, 48, 25, 55, 78, 35, 18, 50, 62, 25].map((h, idx) => (
              <div
                key={idx}
                className="w-1.5 bg-gradient-to-t from-rose-500 to-cyan-400 rounded-t-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${(idx * 0.1).toFixed(1)}s` }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-xs w-full">
            <div className="relative cursor-pointer" onClick={() => window.open(finalOpenUrl, '_blank')}>
              <div className="w-20 h-20 rounded-full border-2 border-rose-500 overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-400">
                <img 
                  src={getTikTokAvatar(cleanHandle)} 
                  alt={cleanHandle}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=E11D48&color=fff&bold=true`;
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-500 text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-black text-base flex items-center justify-center gap-1.5 font-display">
                <span>@{cleanHandle}</span>
              </h4>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>Kênh TikTok Thật</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  ✓ Đã Kết Nối
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-2 px-2">
              {title || `Video TikTok @${cleanHandle}`}
            </p>

            {isResolving ? (
              <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-mono py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang kết nối luồng video...</span>
              </div>
            ) : (
              <a
                href={finalOpenUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-rose-400/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mở & Phát Video Trên TikTok</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
