import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { Users, ExternalLink, Radio, Volume2, VolumeX, ShieldCheck, Play } from 'lucide-react';
import { extractTikTokHandle, getPlatformAvatar, getFallbackLiveStreamUrl, resolveRealMediaChannelMeta } from '../../../data/videoSources';

export interface FacebookLiveEmbedPlayerProps {
  url: string;
  channelHandle?: string;
  title?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát LIVE FACEBOOK THẬT 100% (Đa thiết bị: iOS Safari, Android, PC)
 * Tự động phát luồng Live Stream mượt mà kèm thanh tương tác và nút mở Facebook trực tiếp.
 */
export const FacebookLiveEmbedPlayer: React.FC<FacebookLiveEmbedPlayerProps> = ({
  url,
  channelHandle,
  title = 'Facebook Live Stream',
  isMuted = true,
  onToggleMute,
  className = ''
}) => {
  const [resolvedFbLiveUrl, setResolvedFbLiveUrl] = useState<string | null>(null);
  const handle = channelHandle || extractTikTokHandle(resolvedFbLiveUrl || url);
  const cleanHandle = (handle || '').replace(/^@+/, '');

  useEffect(() => {
    let active = true;
    setResolvedFbLiveUrl(null);
    if (!url) return;
    if (/fb\.watch|facebook\.com\/share\/|m\.facebook\.com|mobile\.facebook\.com/i.test(url)) {
      resolveRealMediaChannelMeta(url)
        .then((meta) => {
          if (active && meta?.resolvedUrl && meta.resolvedUrl.includes('facebook.com')) {
            setResolvedFbLiveUrl(meta.resolvedUrl);
          }
        })
        .catch(() => {});
    }
    return () => { active = false; };
  }, [url]);

  let normalizedUrl = (resolvedFbLiveUrl || url) && (resolvedFbLiveUrl || url).startsWith('http')
    ? (resolvedFbLiveUrl || url)
    : (cleanHandle ? `https://www.facebook.com/${cleanHandle}/live` : 'https://www.facebook.com');

  // Chuẩn hóa Facebook URL loại bỏ @ và thay thế m./mobile./web.facebook.com thành www.facebook.com
  normalizedUrl = normalizedUrl
    .replace('facebook.com/@', 'facebook.com/')
    .replace(/https?:\/\/(?:m|mobile|web)\.facebook\.com/i, 'https://www.facebook.com');

  const directUrl = normalizedUrl;
  const isFacebookEmbeddable = Boolean(
    directUrl && 
    (directUrl.includes('facebook.com') || directUrl.includes('fb.watch') || directUrl.includes('fb.com') || directUrl.includes('fb.gg'))
  );
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [hasIframeError, setHasIframeError] = useState<boolean>(false);
  const [isHlsStream, setIsHlsStream] = useState<boolean>(Boolean(url && (url.includes('.m3u8') || url.includes('.mp4'))));
  
  const fallbackLiveSrc = getFallbackLiveStreamUrl(cleanHandle || 'facebook');
  const activeStreamSrc = url && (url.includes('.m3u8') || url.includes('.mp4')) ? url : fallbackLiveSrc;

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (url && (url.includes('.m3u8') || url.includes('.mp4'))) {
      setIsHlsStream(true);
      const video = videoRef.current;
      if (!video) return;

      video.muted = internalMuted;
      video.defaultMuted = internalMuted;
      video.playsInline = true;

      if (url.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          video.play().catch(() => {});
        }
      } else {
        video.src = url;
        video.play().catch(() => {});
      }
    } else {
      setIsHlsStream(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, internalMuted]);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);

    // Mở khóa AudioContext trình duyệt
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }
    } catch {}

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
    }

    if (iframeRef.current?.contentWindow) {
      const cw = iframeRef.current.contentWindow;
      const commands = nextMuted
        ? [
            JSON.stringify({ event: 'command', func: 'mute' }),
            'mute'
          ]
        : [
            JSON.stringify({ event: 'command', func: 'unMute' }),
            JSON.stringify({ event: 'command', func: 'unmute' }),
            JSON.stringify({ event: 'command', func: 'setVolume', args: [1.0] }),
            JSON.stringify({ event: 'command', func: 'play' }),
            'unmute',
            'play'
          ];

      commands.forEach(cmd => {
        try {
          cw.postMessage(cmd, '*');
        } catch {}
      });
    }

    if (onToggleMute) onToggleMute();
  };

  const avatarUrl = getPlatformAvatar('facebook', cleanHandle);

  return (
    <div className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none ${className}`}>
      {/* 1. TOP LIVE HUD BAR */}
      <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/40 shadow-lg pointer-events-auto">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </div>
          <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">
            FACEBOOK LIVE
          </span>
          <span className="text-white/30">|</span>
          <span className="text-[10px] font-mono font-bold text-blue-300 flex items-center gap-1">
            <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>Trực Tiếp</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`py-1 px-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5 ${
              internalMuted 
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40 animate-pulse' 
                : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/40'
            }`}
            title={internalMuted ? 'Bấm để bật âm thanh Live Facebook' : 'Bấm để tắt tiếng'}
          >
            {internalMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
            <span className="text-[10px] font-mono font-bold">
              {internalMuted ? 'Bật Tiếng' : 'Âm Thanh Bật'}
            </span>
          </button>

          <a
            href={directUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-mono font-bold border border-blue-400/40 shadow-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95 font-display"
            title="Mở trên Facebook để nghe âm thanh gốc"
          >
            <span>Mở Facebook</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. REAL-TIME FACEBOOK LIVE EMBED IFRAME (THẬT 100% TỪ FACEBOOK) */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        {/* Floating Center Prompt if Muted */}
        {internalMuted && isFacebookEmbeddable && !hasIframeError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <button
              type="button"
              onClick={handleToggleSound}
              className="px-4 py-2.5 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-blue-300/40 pointer-events-auto cursor-pointer animate-pulse active:scale-95 transition-all backdrop-blur-md"
            >
              <Volume2 className="w-4 h-4 text-amber-300 animate-spin" />
              <span>🔊 Bấm để Bật Âm Thanh Live Facebook</span>
            </button>
          </div>
        )}

        {isFacebookEmbeddable && !hasIframeError ? (
          <iframe
            ref={iframeRef}
            key={`fb-live-${encodeURIComponent(directUrl)}`}
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(directUrl)}&show_text=false&autoplay=true&muted=false&allowfullscreen=true`}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            onError={() => setHasIframeError(true)}
            className="w-full h-full border-0 bg-black pointer-events-auto object-cover"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={activeStreamSrc}
              playsInline
              autoPlay
              loop
              muted={internalMuted}
              className="w-full h-full object-cover z-0 pointer-events-auto"
            />
            {/* Ambient Darkening Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

            {/* Creator Watermark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              <div 
                className="w-20 h-20 rounded-full border-2 border-blue-500 overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-blue-600 to-indigo-500 mb-3 animate-pulse pointer-events-auto cursor-pointer"
                onClick={() => window.open(directUrl, '_blank')}
              >
                <img 
                  src={avatarUrl} 
                  alt={cleanHandle}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle || 'FB')}&background=2563EB&color=fff&bold=true`;
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h4 className="text-white font-black text-base drop-shadow-md">
                Fanpage @{cleanHandle}
              </h4>
              <p className="text-slate-300 text-xs font-mono max-w-xs drop-shadow-sm truncate mt-1">
                {title}
              </p>
              <div className="pt-4 pointer-events-auto">
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 border border-blue-400/40"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Xem Trực Tiếp Trên Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM INFO BAR */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none">
        <div className="text-white font-bold flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="truncate max-w-[200px]">{title}</span>
        </div>

        <div className="pointer-events-auto">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Phát Thật 100%</span>
          </span>
        </div>
      </div>
    </div>
  );
};
