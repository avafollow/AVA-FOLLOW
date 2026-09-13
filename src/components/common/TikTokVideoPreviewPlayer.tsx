import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Radio, 
  Sparkles, 
  Heart,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { parseMediaUrl, ParsedMediaInfo } from '../../data/videoSources';

interface TikTokVideoPreviewPlayerProps {
  url: string;
  channelHandle?: string;
  isLive?: boolean;
  className?: string;
  aspectRatio?: '9/16' | 'square' | 'auto';
  autoPlay?: boolean;
  muted?: boolean;
  badgeText?: string;
  showControls?: boolean;
}

export const TikTokVideoPreviewPlayer: React.FC<TikTokVideoPreviewPlayerProps> = ({
  url,
  channelHandle,
  isLive = false,
  className = '',
  autoPlay = true,
  muted = true,
  badgeText,
  showControls = true
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaInfo: ParsedMediaInfo = parseMediaUrl(url, channelHandle);
  const effectiveIsLive = isLive || mediaInfo.isLive;

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [url, channelHandle]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl group select-none ${className}`}
      onClick={togglePlay}
    >
      {/* Background Video Stream (High performance CDN) */}
      <video
        ref={videoRef}
        src={mediaInfo.streamUrl}
        autoPlay={autoPlay}
        loop
        muted={isMuted}
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Shimmer / Backdrop Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      {/* Top Badges */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          {effectiveIsLive ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase font-mono flex items-center gap-1 shadow-lg animate-pulse">
              <Radio className="w-3 h-3" /> LIVE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF0050] to-purple-600 text-white text-[9px] font-black uppercase font-mono shadow-lg">
              {badgeText || 'FYP'}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[8px] font-mono text-cyan-300 border border-white/10">
            1080p
          </span>
        </div>

        {/* Audio Mute/Unmute */}
        {showControls && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform active:scale-95 pointer-events-auto cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        )}
      </div>

      {/* Center Play Indicator when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
            <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
          </div>
        </div>
      )}

      {/* Bottom Channel Info Overlay */}
      <div className="absolute bottom-2 left-2 right-2 z-10 pointer-events-none space-y-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center text-rose-300 font-bold text-[9px] shrink-0">
            {mediaInfo.handle.replace('@', '').charAt(0).toUpperCase()}
          </div>
          <span className="text-white font-bold text-[11px] truncate drop-shadow-md">
            {mediaInfo.handle}
          </span>
          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
        </div>

        {effectiveIsLive && (
          <div className="flex items-center gap-1 text-[9px] text-rose-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Phát sóng trực tiếp • 1.4K người đang xem</span>
          </div>
        )}
      </div>
    </div>
  );
};
