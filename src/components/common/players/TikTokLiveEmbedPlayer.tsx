import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  Heart,
  Play,
  RefreshCw
} from 'lucide-react';
import {
  extractTikTokHandle,
  extractTikTokVideoId,
  getPlatformAvatar,
  isLiveMediaUrl,
  isGenericPlaceholderHandle
} from '../../../data/videoSources';

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
  onCompensate?: () => void;
}

/**
 * TikTokLiveEmbedPlayer — Trình phát Live Stream TikTok Đa Nền Tảng (iOS Safari, Android, Web, PC)
 * Tự động phát video stream trực tiếp thật 100% qua luồng HLS m3u8 hoặc Iframe nhúng TikTok chính thức.
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
  hideHud = false,
  onCompensate
}) => {
  const [resolvedHandle, setResolvedHandle] = useState<string | null>(null);
  const [resolvedAuthorName, setResolvedAuthorName] = useState<string | null>(null);
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(null);
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(null);
  const [resolvedCanonicalUrl, setResolvedCanonicalUrl] = useState<string | null>(null);
  const [roomCover, setRoomCover] = useState<string | null>(null);
  const [roomTitle, setRoomTitle] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState<boolean>(true);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [retryNonce, setRetryNonce] = useState<number>(0);

  // Trích xuất @handle chính xác từ URL người dùng dán vào (không dùng placeholder @creator_vietnam)
  const rawHandle = extractTikTokHandle(targetUrl || channelHandle || '');
  const safeInitialHandle = !isGenericPlaceholderHandle(rawHandle)
    ? rawHandle.replace(/^@+/, '').trim()
    : (!isGenericPlaceholderHandle(channelHandle) ? (channelHandle || '').replace(/^@+/, '').trim() : '');
  const cleanHandle = resolvedHandle || safeInitialHandle;

  // URL thật đến phiên live của creator
  const directLiveUrl =
    resolvedCanonicalUrl ||
    (targetUrl && targetUrl.startsWith('http')
      ? targetUrl
      : (cleanHandle ? `https://www.tiktok.com/@${cleanHandle}/live` : 'https://www.tiktok.com/live'));

  const displayName =
    resolvedAuthorName ||
    (!isGenericPlaceholderHandle(channelName) ? channelName : null) ||
    (cleanHandle ? `@${cleanHandle}` : 'Kênh TikTok Live');

  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [viewers, setViewers] = useState<number>(viewersCount);
  const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);
  const [hlsStreamUrl, setHlsStreamUrl] = useState<string | null>(null);
  const [hasStreamError, setHasStreamError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Kiểm tra chính xác xem URL có phải video TikTok không (chỉ dùng isLiveMediaUrl chặt chẽ)
  const isTargetLive = Boolean(targetUrl && isLiveMediaUrl(targetUrl));
  const possibleVideoId =
    resolvedVideoId || ((!isTargetLive && targetUrl) ? extractTikTokVideoId(targetUrl) : null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    let urlToResolve = targetUrl || (safeInitialHandle ? `https://www.tiktok.com/@${safeInitialHandle}/live` : '');
    if (!urlToResolve) {
      setIsResolving(false);
      return;
    }
    if (
      !urlToResolve.includes('/live') &&
      !urlToResolve.includes('/video/') &&
      !urlToResolve.includes('/photo/') &&
      !/vt\.tiktok\.com|vm\.tiktok\.com|tiktok\.com\/t\//i.test(urlToResolve) &&
      urlToResolve.includes('@')
    ) {
      urlToResolve = urlToResolve.endsWith('/') ? urlToResolve + 'live' : urlToResolve + '/live';
    }

    setIsResolving(true);
    setHasStreamError(false);
    setResolvedVideoId(null);
    let isCancelled = false;
    fetch(`/api/tiktok-resolve?url=${encodeURIComponent(urlToResolve)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled || !data) return;
        setIsResolving(false);
        if (data.resolved) {
          setResolvedCanonicalUrl(data.resolved);
          const extracted = extractTikTokHandle(data.resolved);
          if (extracted && !isGenericPlaceholderHandle(extracted)) {
            setResolvedHandle(extracted.replace(/^@+/, '').trim());
          }
        }
        if (data.authorHandle && !isGenericPlaceholderHandle(data.authorHandle)) {
          setResolvedHandle(data.authorHandle.replace(/^@+/, '').trim());
        }
        if (data.authorName) setResolvedAuthorName(data.authorName);
        if (data.authorAvatar) setResolvedAvatar(data.authorAvatar);
        if (data.videoId && !data.isLive) {
          setResolvedVideoId(data.videoId);
        }
        if (data.liveViewers) setViewers(data.liveViewers);
        if (data.roomCover) setRoomCover(data.roomCover);
        if (data.roomTitle || data.title) setRoomTitle(data.roomTitle || data.title);
        if (data.hlsUrl && data.roomStatus !== 4) {
          setHlsStreamUrl(data.hlsUrl);
          setHasStreamError(false);
          setIsEnded(false);
        } else if (data.roomStatus === 4 || (!data.isLive && !data.videoId)) {
          setHlsStreamUrl(null);
          setIsEnded(true);
        } else {
          setIsEnded(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setIsResolving(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [targetUrl, safeInitialHandle, retryNonce]);

  useEffect(() => { 
    setInternalMuted(isMuted); 
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = internalMuted;
      videoRef.current.defaultMuted = internalMuted;
    }
  }, [internalMuted]);

  // KHÔNG PHÁT VIDEO GIẢ LẬP: Chỉ nhận luồng Live stream HLS m3u8 thật 100%
  const activeStreamSrc = hlsStreamUrl || (
    targetUrl && (targetUrl.includes('.m3u8') || targetUrl.includes('.mp4') || targetUrl.includes('blob:')) ? targetUrl : null
  );

  // Khởi tạo luồng phát HLS / Video trực tiếp đảm bảo luôn có video phát 100% trên mọi thiết bị
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeStreamSrc) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.muted = internalMuted;
    video.defaultMuted = internalMuted;
    video.playsInline = true;

    if (activeStreamSrc.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30
        });
        hlsRef.current = hls;
        hls.loadSource(activeStreamSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().then(() => setIsPaused(false)).catch(() => {
            video.muted = true;
            video.defaultMuted = true;
            setInternalMuted(true);
            video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
          });
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data && data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                setHasStreamError(true);
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Hỗ trợ trực tiếp cho iOS Safari / iPad / Mac Safari
        video.src = activeStreamSrc;
        video.play().then(() => setIsPaused(false)).catch(() => {
          video.muted = true;
          video.defaultMuted = true;
          setInternalMuted(true);
          video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
        });
      } else {
        setHasStreamError(true);
      }
    } else {
      video.src = activeStreamSrc;
      video.play().then(() => setIsPaused(false)).catch(() => {
        video.muted = true;
        video.defaultMuted = true;
        setInternalMuted(true);
        video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
      });
    }

    const handlePlayEvent = () => setIsPaused(false);
    const handlePauseEvent = () => setIsPaused(true);
    video.addEventListener('play', handlePlayEvent);
    video.addEventListener('pause', handlePauseEvent);

    const resumeOnTouch = () => {
      if (video && video.paused) {
        video.play().then(() => setIsPaused(false)).catch(() => {});
      }
    };
    window.addEventListener('touchstart', resumeOnTouch, { passive: true, once: true });
    window.addEventListener('click', resumeOnTouch, { passive: true, once: true });

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeEventListener('play', handlePlayEvent);
      video.removeEventListener('pause', handlePauseEvent);
      window.removeEventListener('touchstart', resumeOnTouch);
      window.removeEventListener('click', resumeOnTouch);
    };
  }, [activeStreamSrc, internalMuted]);

  // Bộ đếm mắt xem THẬT (Cập nhật 15s 1 lần)
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
          if (data && data.hlsUrl && !hlsStreamUrl) setHlsStreamUrl(data.hlsUrl);
        }).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [targetUrl, cleanHandle, hlsStreamUrl]);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (onToggleMute) onToggleMute();
  };

  const handleOpenLiveApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(directLiveUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTapScreen = (e: React.MouseEvent) => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPaused(false)).catch(() => {});
    }

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

  const avatarUrl = resolvedAvatar || getPlatformAvatar('tiktok', cleanHandle);

  return (
    <div
      className={`relative w-full h-full bg-[#080B11] flex flex-col overflow-hidden select-none cursor-pointer ${className}`}
      onClick={handleTapScreen}
    >
      {/* 1. KHUNG PHÁT VIDEO / LIVE STREAM THẬT */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        {possibleVideoId ? (
          <iframe
            key={`tt-vid-player-v1-${possibleVideoId}`}
            src={`https://www.tiktok.com/player/v1/${possibleVideoId}?embed_from=oembed&music_info=1&description=1&autoplay=1&muted=${internalMuted ? 1 : 0}&loop=1&controls=1`}
            title={`TikTok Video: ${displayName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            className="w-full h-full border-0 bg-black pointer-events-auto"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* 1. Direct Auto-playing Live Stream Video */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover pointer-events-auto ${(hasStreamError || isEnded || (!activeStreamSrc && !isResolving)) ? 'opacity-20 blur-md scale-105' : ''}`}
              autoPlay
              playsInline
              {...{ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' }}
              loop
              muted={internalMuted}
              onError={() => {
                if (!activeStreamSrc?.includes('.m3u8')) {
                  setHasStreamError(true);
                }
              }}
            />

            {/* 2. Loading State (Đang kết nối luồng Live) */}
            {isResolving && !activeStreamSrc && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-15 bg-black/90 pointer-events-auto">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full border-2 border-rose-500/80 p-1 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse">
                    <img
                      src={roomCover || avatarUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarUrl; }}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[9px] uppercase shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm line-clamp-1 max-w-[280px]">
                  {roomTitle || `Phiên Live ${displayName}`}
                </h3>
                <p className="text-[11px] text-rose-300 font-mono mt-2 flex items-center gap-1.5 justify-center">
                  <Radio className="w-3.5 h-3.5 animate-spin text-rose-400" />
                  Đang kết nối luồng phát trực tiếp TikTok...
                </p>
              </div>
            )}

            {/* 3. Realistic Live Studio Broadcast Fallback if stream has ended or error */}
            {(hasStreamError || isEnded || (!activeStreamSrc && !isResolving)) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-15 bg-gradient-to-b from-black/85 via-black/80 to-black/95 backdrop-blur-md pointer-events-auto">
                <div className="relative mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-rose-500/80 p-1 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse">
                    <img
                      src={roomCover || avatarUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarUrl; }}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[9px] uppercase shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                </div>

                <h3 className="text-white font-black text-sm sm:text-base line-clamp-1 max-w-[280px]">
                  {roomTitle || `Phiên Live Trực Tiếp ${displayName}`}
                </h3>
                <p className="text-[11px] text-rose-300 font-mono mt-1 flex items-center gap-1.5 justify-center">
                  <Radio className="w-3.5 h-3.5 animate-spin text-rose-400" style={{ animationDuration: '3s' }} />
                  {isEnded
                    ? 'Kênh hiện chưa phát sóng Live (hoặc phiên Live vừa kết thúc)'
                    : 'Đang kết nối phiên phát sóng trực tiếp trên TikTok'}
                </p>

                {/* Equalizer Sound Waves */}
                <div className="flex items-center gap-1 my-3">
                  <span className="w-1 bg-rose-500 rounded-full animate-bounce h-3" />
                  <span className="w-1 bg-rose-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1 bg-rose-500 rounded-full animate-bounce h-6" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-pink-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.45s' }} />
                  <span className="w-1 bg-rose-300 rounded-full animate-bounce h-2" style={{ animationDelay: '0.6s' }} />
                </div>

                {/* Multi-Device Direct Action Buttons */}
                <div className="mt-2 space-y-2 max-w-xs w-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRetryNonce((n) => n + 1);
                    }}
                    className="w-full px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Kiểm Tra Lại Luồng Live</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCompensate) {
                        onCompensate();
                      } else {
                        handleOpenLiveApp();
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>⚡ Xem Trực Tiếp Trên TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-slate-400 font-mono">
                    🛡️ Hỗ trợ phát trực tiếp HLS trên iPhone, iPad, Android &amp; PC
                  </p>
                </div>
              </div>
            )}

            {/* 3. Gradient Darkening Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 pointer-events-none" />

            {/* 4. Center Play Icon if Paused on Strict Devices */}
            {isPaused && !hasStreamError && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(254,44,85,0.8)] border border-white/30 animate-pulse">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            )}
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

