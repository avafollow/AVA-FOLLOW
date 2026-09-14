import React from 'react';
import { Users, ExternalLink, Radio, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

export interface FacebookLiveEmbedPlayerProps {
  url: string;
  title?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát LIVE FACEBOOK THẬT 100% (Tab Code Riêng Biệt)
 * Nhúng trực tiếp luồng Live Facebook chính thức của creator qua Plugin.
 */
export const FacebookLiveEmbedPlayer: React.FC<FacebookLiveEmbedPlayerProps> = ({
  url,
  title = 'Facebook Live Stream',
  isMuted = false,
  onToggleMute,
  className = ''
}) => {
  if (!url) return null;

  return (
    <div className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none ${className}`}>
      {/* 1. TOP LIVE HUD BAR */}
      <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/30 shadow-lg pointer-events-auto">
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
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-blue-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          )}

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-mono font-bold border border-blue-400/40 shadow-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95 font-display"
            title="Mở trên Facebook"
          >
            <span>Mở Facebook</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. REAL-TIME FACEBOOK EMBED IFRAME (TRÀN VIỀN, CĂN CHÍNH GIỮA) */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        <iframe
          key={`fb-live-${encodeURIComponent(url)}`}
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=${isMuted ? 1 : 0}&allowfullscreen=true`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 bg-black pointer-events-auto object-cover"
        />
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
