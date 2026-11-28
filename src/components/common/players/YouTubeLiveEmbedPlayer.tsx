import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Radio, Volume2, VolumeX, ShieldCheck, Play } from 'lucide-react';
import { extractYouTubeVideoId, extractTikTokHandle, resolveRealMediaChannelMeta } from '../../../data/videoSources';

export interface YouTubeLiveEmbedPlayerProps {
  youtubeId?: string;
  targetUrl?: string;
  channelHandle?: string;
  title?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát LIVE YOUTUBE THẬT 100% (Đa thiết bị: iOS, iPad, Android, PC)
 * Hỗ trợ URL video live, URL kênh @handle/live (tự phân giải Channel ID UC...), hoặc ID video 11 ký tự.
 */
export const YouTubeLiveEmbedPlayer: React.FC<YouTubeLiveEmbedPlayerProps> = ({
  youtubeId,
  targetUrl,
  channelHandle,
  title = 'YouTube Live Stream',
  isMuted = true,
  onToggleMute,
  className = ''
}) => {
  const [resolvedChannelId, setResolvedChannelId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const initialMutedRef = useRef<boolean>(isMuted);

  const resolvedId = youtubeId || (targetUrl ? extractYouTubeVideoId(targetUrl) : null);
  const handle = channelHandle || (targetUrl ? extractTikTokHandle(targetUrl) : '@creator');
  const cleanHandle = (handle || '').replace(/^@+/, '');

  // Phân giải UC... channelId khi người dùng dán link dạng youtube.com/@tenkenh/live
  useEffect(() => {
    let active = true;
    if (resolvedId || !targetUrl) return;
    const directCid = targetUrl.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/i);
    if (directCid && directCid[1]) {
      setResolvedChannelId(directCid[1]);
      return;
    }
    resolveRealMediaChannelMeta(targetUrl)
      .then((meta) => {
        if (active && meta?.channelId) {
          setResolvedChannelId(meta.channelId);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [resolvedId, targetUrl]);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: isMuted ? 'mute' : 'unMute', args: [] }),
        '*'
      );
    } catch {}
  }, [isMuted]);

  const directUrl = targetUrl || (resolvedId ? `https://www.youtube.com/watch?v=${resolvedId}` : (cleanHandle ? `https://www.youtube.com/@${cleanHandle}/live` : 'https://www.youtube.com'));

  const embedSrc = resolvedId
    ? `https://www.youtube.com/embed/${resolvedId}?autoplay=1&mute=${initialMutedRef.current ? 1 : 0}&playsinline=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`
    : (resolvedChannelId
      ? `https://www.youtube.com/embed/live_stream?channel=${resolvedChannelId}&autoplay=1&mute=${initialMutedRef.current ? 1 : 0}&playsinline=1&controls=1&enablejsapi=1`
      : null);

  return (
    <div className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none ${className}`}>
      {/* 1. TOP LIVE HUD BAR */}
      <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 shadow-lg pointer-events-auto">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">
            YOUTUBE LIVE
          </span>
          <span className="text-white/30">|</span>
          <span className="text-[10px] font-mono font-bold text-red-300 flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>Trực Tiếp HD</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg ${
                isMuted 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                  : 'bg-black/80 text-emerald-400 border-emerald-500/40'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <a
            href={directUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] font-mono font-bold border border-red-400/40 shadow-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95 font-display"
            title="Mở trên YouTube"
          >
            <span>Mở YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. REAL-TIME YOUTUBE EMBED IFRAME */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        {embedSrc ? (
          <iframe
            ref={iframeRef}
            key={`yt-live-${resolvedId || resolvedChannelId || cleanHandle}`}
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            className="w-full h-full border-0 bg-black pointer-events-auto object-cover"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-3 pointer-events-auto">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center animate-pulse">
              <Radio className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-sm font-bold text-white">{title}</div>
            <p className="text-xs text-slate-400 max-w-xs">
              Kênh YouTube @{cleanHandle} đang phát trực tiếp. Bấm mở ứng dụng YouTube để xem trọn vẹn chất lượng cao.
            </p>
            <a
              href={directUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Xem Trực Tiếp Trên YouTube</span>
            </a>
          </div>
        )}
      </div>

      {/* 3. BOTTOM INFO BAR */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none">
        <div className="text-white font-bold flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="truncate max-w-[200px]">{title}</span>
        </div>

        <div className="pointer-events-auto">
          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Phát Thật 100%</span>
          </span>
        </div>
      </div>
    </div>
  );
};
