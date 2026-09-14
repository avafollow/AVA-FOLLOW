import React from 'react';
import { Users, ExternalLink, Radio, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

export interface YouTubeLiveEmbedPlayerProps {
  youtubeId: string;
  title?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát LIVE YOUTUBE THẬT 100% (Tab Code Riêng Biệt)
 * Nhúng trực tiếp luồng Live YouTube chính thức của creator.
 */
export const YouTubeLiveEmbedPlayer: React.FC<YouTubeLiveEmbedPlayerProps> = ({
  youtubeId,
  title = 'YouTube Live Stream',
  isMuted = false,
  onToggleMute,
  className = ''
}) => {
  if (!youtubeId) return null;

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
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
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

      {/* 2. REAL-TIME YOUTUBE EMBED IFRAME (TRÀN VIỀN, CĂN CHÍNH GIỮA) */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        <iframe
          key={`yt-live-${youtubeId}-${isMuted}`}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 bg-black pointer-events-auto object-cover"
        />
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
