import React, { useState, useRef, useEffect } from 'react';
import { Play, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';

export interface YouTubeEmbedPlayerProps {
  youtubeId: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát YouTube Embed Đa Thiết Bị (iOS Safari, iPadOS, Android, PC)
 * Giữ nguyên iframe không reload khi bật/tắt tiếng, hỗ trợ playsinline=1 cho iPhone/iPad.
 */
export const YouTubeEmbedPlayer: React.FC<YouTubeEmbedPlayerProps> = ({
  youtubeId,
  title = 'YouTube Video',
  isMuted = true,
  className = ''
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const initialMutedRef = useRef<boolean>(isMuted);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: isMuted ? 'mute' : 'unMute', args: [] }),
        '*'
      );
      if (!isMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        );
      }
    } catch {}
  }, [isMuted]);

  if (!youtubeId) return null;

  const directUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  if (hasError) {
    return (
      <div className={`relative w-full h-full bg-[#0B0F19] flex flex-col items-center justify-center overflow-hidden rounded-3xl group select-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F0A0A] via-[#0F0505] to-[#080202]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-xs w-full">
          <div className="relative cursor-pointer" onClick={() => window.open(directUrl, '_blank')}>
            <div className="w-20 h-20 rounded-full border-2 border-red-500 overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-red-600 to-amber-500">
              <img 
                src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} 
                alt="YouTube Video"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=YouTube&background=DC2626&color=fff&bold=true`;
                }}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-red-500 text-white shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-white font-black text-base flex items-center justify-center gap-1.5">
              <span>Kênh YouTube</span>
            </h4>
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-400" />
                <span>YouTube Video Thật</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-2 px-2">
            {title || `Video YouTube (${youtubeId})`}
          </p>

          <a
            href={directUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-red-400/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mở & Phát Trên YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        ref={iframeRef}
        key={`yt-embed-${youtubeId}`}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${initialMutedRef.current ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        onError={() => setHasError(true)}
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};
