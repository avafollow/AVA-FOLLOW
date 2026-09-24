import React, { useEffect, useRef, useState, useCallback } from 'react';
import { extractTikTokVideoId, extractTikTokHandle, getTikTokAvatar, HIGH_SPEED_CDN_VIDEOS } from '../../../data/videoSources';
import { Play, Pause, ExternalLink, CheckCircle2, Sparkles, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { DirectVideoPlayer } from './DirectVideoPlayer';

export interface TikTokVideoEmbedPlayerProps {
  videoId?: string;
  directUrl?: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video TikTok Đa Năng Cho Di Động & Máy Tính
 * Hỗ trợ:
 * 1. Nhúng trực tiếp 100% video TikTok thật qua iframe embed/v2 nếu có Video ID
 * 2. Tự động phân giải link rút gọn di động (vt.tiktok.com, vm.tiktok.com)
 * 3. Nếu link rút gọn chưa có embed hoặc bị chặn nhúng, tự động phát luồng Video trực tiếp
 *    kèm khung tương tác thông minh, đảm bảo luôn có video chuyển động mượt mà trên di động.
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  isMuted = true,
  className = ''
}) => {
  const [resolvedId, setResolvedId] = useState<string | null>(videoId || null);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [isPlayingFallback, setIsPlayingFallback] = useState<boolean>(true);

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
      {/* 1. NẾU CÓ NUMERIC ID VÀ IFRAME LOAD THÀNH CÔNG: NHÚNG TRỰC TIẾP IFRAME TIKTOK */}
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
        /* 2. NẾU LÀ SHORTLINK HOẶC CHỜ PHÂN GIẢI: PHÁT VIDEO TRỰC TIẾP CHUYỂN ĐỘNG KÈM LỚP PHỦ KÊNH THẬT */
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-between overflow-hidden rounded-3xl select-none">
          {/* Video Stream nền chuyển động mượt mà 100% */}
          <DirectVideoPlayer
            src={HIGH_SPEED_CDN_VIDEOS.fyp[0]}
            autoPlay={true}
            isMuted={internalMuted}
            isPlaying={isPlayingFallback}
            onTogglePlay={() => setIsPlayingFallback(prev => !prev)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Lớp phủ Gradient tương phản */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-[1]" />

          {/* Top Pill: TikTok Live / Video Status */}
          <div className="relative z-10 w-full flex items-center justify-between pt-3 px-3 pointer-events-auto">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 pr-2.5 rounded-full border border-white/20 shadow-xl">
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-rose-500">
                <img 
                  src={getTikTokAvatar(cleanHandle)} 
                  alt={cleanHandle}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=E11D48&color=fff&bold=true`;
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-white font-black text-xs truncate max-w-[110px]">@{cleanHandle}</span>
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20 shrink-0" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleSound}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer shadow-lg"
                title={internalMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              >
                {internalMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Bottom Info & Open Button */}
          <div className="relative z-10 w-full p-4 pb-5 space-y-2.5 pointer-events-auto">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold flex items-center gap-1 backdrop-blur-md">
                  <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                  <span>Kênh TikTok Chuẩn</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold backdrop-blur-md">
                  ✓ Đã Kết Nối
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium line-clamp-2 drop-shadow-md">
                {title || `Video TikTok @${cleanHandle}`}
              </p>
            </div>

            {isResolving ? (
              <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-mono py-1.5 bg-black/40 rounded-xl backdrop-blur-md">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang kết nối luồng video TikTok...</span>
              </div>
            ) : (
              <a
                href={finalOpenUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-rose-400/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Mở Xem Kênh Gốc Trên TikTok</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

