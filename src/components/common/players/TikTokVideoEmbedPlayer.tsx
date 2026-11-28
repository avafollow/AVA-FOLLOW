import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  extractTikTokVideoId,
  extractTikTokHandle,
  getPlatformAvatar,
  isGenericPlaceholderHandle
} from '../../../data/videoSources';
import {
  Play,
  ExternalLink,
  CheckCircle2,
  Volume2,
  VolumeX,
  Loader2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export interface TikTokVideoEmbedPlayerProps {
  videoId?: string;
  directUrl?: string;
  title?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
  autoPlay?: boolean;
}

/**
 * Trình phát Video TikTok Đa Thiết Bị (iOS Safari, iPadOS, Android Chrome, macOS, Windows)
 * 1. Tự động phân giải mọi định dạng link (vt.tiktok.com, vm.tiktok.com, tiktok.com/t/..., /video/, /photo/, m.tiktok.com/v/).
 * 2. Luồng 1 (Ưu tiên siêu mượt đa thiết bị): Luồng MP4 thật của chính video TikTok đó qua proxy hỗ trợ Range 206 (iOS/iPad).
 * 3. Luồng 2 (Chuẩn chính thức TikTok 2026): Trình phát chính thức https://www.tiktok.com/player/v1/{videoId}?embed_from=oembed.
 * 4. Nút chuyển đổi qua lại 1 chạm giữa MP4 Siêu Mượt và TikTok Player, không che khuất nút bấm video.
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  isMuted = true,
  onToggleMute,
  className = '',
  autoPlay = true
}) => {
  const [resolvedId, setResolvedId] = useState<string | null>(
    videoId || (directUrl ? extractTikTokVideoId(directUrl) : null)
  );
  const [resolvedHandle, setResolvedHandle] = useState<string | null>(null);
  const [resolvedAuthorName, setResolvedAuthorName] = useState<string | null>(null);
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(null);
  const [resolvedCover, setResolvedCover] = useState<string | null>(null);
  const [resolvedTitle, setResolvedTitle] = useState<string | null>(null);
  const [resolvedMp4Url, setResolvedMp4Url] = useState<string | null>(null);
  const [resolvedCanonicalUrl, setResolvedCanonicalUrl] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [mp4Failed, setMp4Failed] = useState<boolean>(false);
  const [hasIframeError, setHasIframeError] = useState<boolean>(false);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [playerMode, setPlayerMode] = useState<'official' | 'direct'>('official');

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const extractedHandle = directUrl ? extractTikTokHandle(directUrl) : null;
  const rawHandle =
    resolvedHandle ||
    (extractedHandle && !isGenericPlaceholderHandle(extractedHandle) ? extractedHandle : null) ||
    '@tiktok';
  const cleanHandle = rawHandle.replace(/^@+/, '').trim();
  const displayTitle = resolvedTitle || title;
  const displayName = resolvedAuthorName || (cleanHandle && cleanHandle !== 'tiktok' ? `@${cleanHandle}` : 'Kênh TikTok');
  const finalOpenUrl =
    resolvedCanonicalUrl ||
    (directUrl && directUrl.startsWith('http') ? directUrl : `https://www.tiktok.com/@${cleanHandle}`);

  const effectiveId = resolvedId || videoId || (directUrl ? extractTikTokVideoId(directUrl) : null);
  const isValidNumericId = Boolean(effectiveId && /^\d{8,24}$/.test(effectiveId));

  // TikTok Official Player v1 (2026 standard — tương thích 100% iOS Safari, iPad, Android, PC)
  const officialPlayerUrl = isValidNumericId
    ? `https://www.tiktok.com/player/v1/${effectiveId}?embed_from=oembed&music_info=1&description=1&autoplay=1&muted=${internalMuted ? 1 : 0}&loop=1&controls=1&rel=0`
    : null;

  const directMp4Src: string | null = !mp4Failed
    ? resolvedMp4Url || (directUrl && /\.(mp4|webm|mov)(\?.*)?$/i.test(directUrl) ? directUrl : null)
    : null;

  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = internalMuted;
      videoRef.current.defaultMuted = internalMuted;
    }
  }, [internalMuted]);

  // Tự động phân giải mọi đường link TikTok (kể cả link chia sẻ di động vt.tiktok.com, vm.tiktok.com, tiktok.com/t/...)
  useEffect(() => {
    let cancelled = false;
    setMp4Failed(false);
    setHasIframeError(false);
    setResolvedMp4Url(null);
    setResolvedCanonicalUrl(null);

    const immediateId = videoId || (directUrl ? extractTikTokVideoId(directUrl) : null);
    setResolvedId(immediateId);

    const urlToResolve =
      directUrl && directUrl.startsWith('http')
        ? directUrl
        : immediateId
          ? `https://www.tiktok.com/@tiktok/video/${immediateId}`
          : null;

    if (!urlToResolve) return;

    setIsResolving(true);
    fetch(`/api/tiktok-resolve?url=${encodeURIComponent(urlToResolve)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const vid = data.videoId || (data.resolved ? extractTikTokVideoId(data.resolved) : null);
        if (vid) setResolvedId(vid);
        if (data.resolved) setResolvedCanonicalUrl(data.resolved);
        if (data.authorHandle) setResolvedHandle(data.authorHandle);
        if (data.authorName) setResolvedAuthorName(data.authorName);
        if (data.authorAvatar) setResolvedAvatar(data.authorAvatar);
        if (data.thumbnailUrl) setResolvedCover(data.thumbnailUrl);
        if (data.title) setResolvedTitle(data.title);
        if (data.directPlayProxyUrl || data.directPlayUrl) {
          setResolvedMp4Url(data.directPlayProxyUrl || data.directPlayUrl);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsResolving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [directUrl, videoId]);

  // Tự động gửi lệnh play/mute cho TikTok player/v1 qua postMessage
  const triggerPlayAndSound = useCallback(
    (mutedFlag: boolean) => {
      try {
        if (!iframeRef.current?.contentWindow) return;
        const cw = iframeRef.current.contentWindow;
        cw.postMessage({ 'x-tiktok-player': true, type: 'play' }, '*');
        cw.postMessage({ 'x-tiktok-player': true, type: mutedFlag ? 'mute' : 'unMute' }, '*');
        cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: 'play' }), '*');
        cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: mutedFlag ? 'mute' : 'unmute' }), '*');
      } catch {}
    },
    []
  );

  // Tự động phát video HTML5 MP4 khi ở chế độ direct (tương thích iOS Safari / iPadOS)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !directMp4Src) return;
    video.playsInline = true;
    video.muted = internalMuted;
    video.defaultMuted = internalMuted;
    if (autoPlay) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          video.muted = true;
          video.defaultMuted = true;
          setInternalMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }
  }, [directMp4Src, autoPlay, playerMode, internalMuted]);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      if (!nextMuted && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
    triggerPlayAndSound(nextMuted);
    if (onToggleMute) onToggleMute();
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Xác định chế độ phát tối ưu:
  // - Nếu chọn 'direct' và có MP4 thật (hoặc iframe bị lỗi / chưa có videoId nhưng có MP4) -> phát HTML5 <video> siêu mượt đa thiết bị
  // - Ngược lại nếu có officialPlayerUrl (player/v1) -> phát trình phát chính thức TikTok 2026
  const showDirectMp4 = Boolean(directMp4Src && (playerMode === 'direct' || hasIframeError || !officialPlayerUrl));
  const showOfficialIframe = Boolean(!showDirectMp4 && officialPlayerUrl && !hasIframeError);

  return (
    <div
      className={`relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-3xl select-none ${className}`}
    >
      {/* 1. TOP HUD BAR: Chế độ phát & Âm thanh (gọn trên cùng, không che nút phát của TikTok) */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-rose-500/40 text-[10px] font-mono font-bold text-rose-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>TIKTOK VIDEO</span>
          </div>

          {directMp4Src && officialPlayerUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPlayerMode((prev) => (prev === 'official' ? 'direct' : 'official'));
              }}
              className="px-2.5 py-1 rounded-full bg-black/80 hover:bg-white/20 text-white text-[9px] font-mono font-bold border border-white/20 backdrop-blur-md flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
              title="Đổi giữa TikTok Player chính thức và Luồng MP4 Siêu Mượt"
            >
              <RefreshCw className="w-2.5 h-2.5 text-cyan-300" />
              <span>{showDirectMp4 ? 'MP4 Mượt' : 'TikTok Player'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`py-1 px-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5 ${
              internalMuted
                ? 'bg-rose-500/30 text-rose-200 border-rose-500/50 hover:bg-rose-500/45'
                : 'bg-emerald-500/30 text-emerald-200 border-emerald-500/50 hover:bg-emerald-500/45'
            }`}
            title={internalMuted ? 'Bấm để bật âm thanh video TikTok' : 'Bấm để tắt tiếng'}
          >
            {internalMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-mono font-bold">
              {internalMuted ? 'Bật Tiếng' : 'Có Tiếng'}
            </span>
          </button>

          <a
            href={finalOpenUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full bg-black/80 hover:bg-rose-600 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20 active:scale-95 flex items-center justify-center shadow-lg"
            title="Mở trực tiếp trên TikTok"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. KHUNG PHÁT VIDEO CHÍNH THỨC */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        {showDirectMp4 ? (
          <div
            className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
            onClick={handleTogglePlay}
          >
            <video
              ref={videoRef}
              key={`tt-mp4-${directMp4Src}`}
              src={directMp4Src!}
              poster={resolvedCover || undefined}
              playsInline
              {...{ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' }}
              autoPlay={autoPlay}
              loop
              muted={internalMuted}
              onError={() => {
                setMp4Failed(true);
                setPlayerMode('official');
              }}
              className="w-full h-full object-contain bg-black"
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl border border-white/30">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            )}
          </div>
        ) : showOfficialIframe ? (
          <iframe
            ref={iframeRef}
            key={`tt-player-v1-${effectiveId}`}
            src={officialPlayerUrl!}
            title={displayTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => triggerPlayAndSound(internalMuted)}
            onError={() => {
              setHasIframeError(true);
              if (directMp4Src) setPlayerMode('direct');
            }}
            className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#140814] via-[#090B12] to-black">
            {resolvedCover && (
              <img
                src={resolvedCover}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-25 blur-sm"
              />
            )}
            <div className="relative z-10 flex flex-col items-center space-y-3 max-w-xs">
              <div
                className="w-20 h-20 rounded-full border-2 border-rose-500 overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-[#FF0050] to-[#00F2FE] cursor-pointer"
                onClick={() => window.open(finalOpenUrl, '_blank', 'noopener,noreferrer')}
              >
                <img
                  src={resolvedAvatar || getPlatformAvatar('tiktok', cleanHandle)}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=010101&color=fff&bold=true&size=128`;
                  }}
                  className="w-full h-full rounded-full object-cover bg-slate-900"
                />
              </div>

              <h4 className="text-white font-black text-base flex items-center gap-1.5">
                <span className="truncate max-w-[220px]">{displayName}</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              </h4>

              {isResolving ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/20 text-rose-300 text-[11px] font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                  <span>Đang phân giải link video TikTok...</span>
                </div>
              ) : (
                <p className="text-slate-300 text-xs font-mono leading-relaxed">
                  Hãy dán link video TikTok cụ thể (VD: tiktok.com/@tenkenh/video/... hoặc link chia sẻ vt.tiktok.com/...) để phát ngay trên mọi thiết bị.
                </p>
              )}

              <a
                href={finalOpenUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:brightness-110 text-white text-xs font-bold shadow-lg flex items-center gap-2 border border-rose-400/40 cursor-pointer active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Mở Xem Trên TikTok</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM STATUS STRIP */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-3 py-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-[10px] font-mono pointer-events-none">
        <div className="text-white/90 font-bold flex items-center gap-1.5 truncate max-w-[65%]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
          <span className="truncate">{displayName}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{showDirectMp4 ? 'MP4 Thật' : 'TikTok 2026'}</span>
        </span>
      </div>
    </div>
  );
};
