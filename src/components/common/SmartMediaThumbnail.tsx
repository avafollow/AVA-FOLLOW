import React, { useState } from 'react';
import { Play, Radio, Eye, Sparkles, CheckCircle2, Film } from 'lucide-react';
import { parseMediaUrl, getTikTokAvatar } from '../../data/videoSources';

interface SmartMediaThumbnailProps {
  targetUrl?: string;
  videoPreviewUrl?: string;
  channelAvatar?: string;
  channelHandle?: string;
  isLive?: boolean;
  className?: string;
  badgeText?: string;
  showPlayIcon?: boolean;
  viewersCount?: number;
  isBoosted?: boolean;
}

export const SmartMediaThumbnail: React.FC<SmartMediaThumbnailProps> = ({
  targetUrl = '',
  videoPreviewUrl = '',
  channelAvatar = '',
  channelHandle = '',
  isLive = false,
  className = '',
  badgeText,
  showPlayIcon = true,
  viewersCount,
  isBoosted = false
}) => {
  const mediaInfo = parseMediaUrl(targetUrl || videoPreviewUrl, channelHandle);
  const effectiveIsLive = isLive === true;
  const [hasMediaError, setHasMediaError] = useState(false);

  // 1. YouTube thumbnail high-res
  const youtubeThumbnail = mediaInfo.youtubeId 
    ? `https://img.youtube.com/vi/${mediaInfo.youtubeId}/hqdefault.jpg` 
    : null;

  // 2. Direct video stream (mp4 / webm)
  const isDirectVideo = mediaInfo.isDirectVideo || 
    (videoPreviewUrl && (videoPreviewUrl.endsWith('.mp4') || videoPreviewUrl.endsWith('.webm') || videoPreviewUrl.includes('/videos/')));

  // 3. Fallback poster image
  const fallbackAvatar = channelAvatar || getTikTokAvatar(channelHandle);

  return (
    <div className={`relative overflow-hidden bg-slate-950 select-none group/thumb ${className}`}>
      {/* Background Media Render */}
      {isDirectVideo && !hasMediaError ? (
        <video
          src={videoPreviewUrl || mediaInfo.streamUrl}
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          onError={() => setHasMediaError(true)}
        />
      ) : youtubeThumbnail && !hasMediaError ? (
        <img
          src={youtubeThumbnail}
          alt=""
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90"
          onError={() => setHasMediaError(true)}
        />
      ) : (
        <div className="w-full h-full relative">
          <img
            src={fallbackAvatar}
            alt=""
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-85"
            onError={(e) => {
              const clean = (channelHandle || '').replace(/^@+/, '');
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(clean || 'TikTok')}&background=0f172a&color=38bdf8&bold=true`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
      )}

      {/* Dark gradient vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />

      {/* Livestream Radar / Live Pulse Badge */}
      {effectiveIsLive ? (
        <>
          <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-600/90 border border-rose-400/40 text-white font-mono text-[8px] font-black shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </div>
          {viewersCount && (
            <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 border border-white/10 text-white/90 font-mono text-[8px] font-bold backdrop-blur-md">
              <Eye className="w-2.5 h-2.5 text-rose-400" />
              <span>{viewersCount.toLocaleString()}</span>
            </div>
          )}
        </>
      ) : (
        /* Video duration / type badge */
        badgeText && (
          <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-black/75 border border-cyan-400/40 text-cyan-300 font-mono text-[8px] font-bold backdrop-blur-sm">
            {badgeText}
          </div>
        )
      )}

      {/* TOP 1 / Boosted Banner */}
      {isBoosted && (
        <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-rose-600 text-white font-mono text-[8px] font-black shadow-md flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5 text-yellow-200" />
          <span>TOP 1</span>
        </div>
      )}

      {/* Center Play Button for Videos */}
      {showPlayIcon && !effectiveIsLive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-lg group-hover/thumb:scale-110 group-hover/thumb:bg-cyan-400 transition-all">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
      )}

      {/* Center Live Radar for Livestreams */}
      {effectiveIsLive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-all">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
