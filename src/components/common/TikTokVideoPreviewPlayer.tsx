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
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle2,
  Plus,
  Check,
  Music2,
  Disc3,
  Youtube,
  Film
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
  compact?: boolean;
}

export const TikTokVideoPreviewPlayer: React.FC<TikTokVideoPreviewPlayerProps> = ({
  url,
  channelHandle,
  isLive = false,
  className = '',
  autoPlay = true,
  muted = true,
  badgeText,
  showControls = true,
  compact = false
}) => {
  const mediaInfo: ParsedMediaInfo = parseMediaUrl(url, channelHandle);
  const effectiveIsLive = isLive || mediaInfo.isLive;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [currentStream, setCurrentStream] = useState<string>(mediaInfo.streamUrl);
  const [showPlayAnim, setShowPlayAnim] = useState<boolean>(false);

  // TikTok Action States
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(128400);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(1280);
  const [shareCount, setShareCount] = useState<number>(856);
  const [commentCount] = useState<number>(3420);

  useEffect(() => {
    setCurrentStream(mediaInfo.streamUrl);
  }, [mediaInfo.streamUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = isMuted;
      videoRef.current.muted = isMuted;
      videoRef.current.playsInline = true;
      if (autoPlay) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            });
        }
      }
    }
  }, [url, channelHandle, isMuted, autoPlay, currentStream]);

  const handleVideoError = () => {
    if (currentStream !== 'https://vjs.zencdn.net/v/oceans.mp4') {
      setCurrentStream('https://vjs.zencdn.net/v/oceans.mp4');
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowPlayAnim(true);
        setTimeout(() => setShowPlayAnim(false), 500);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayAnim(true);
      setTimeout(() => setShowPlayAnim(false), 500);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowed(!isFollowed);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    setBookmarkCount(prev => isBookmarked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount(prev => prev + 1);
    if (navigator.clipboard && url) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const displayHandle = mediaInfo.handle || channelHandle || '@creator.vietnam';

  const getPlatformBadge = () => {
    if (effectiveIsLive) {
      return (
        <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[8px] font-black uppercase font-mono flex items-center gap-1 shadow-lg animate-pulse">
          <Radio className="w-2.5 h-2.5" /> LIVE
        </span>
      );
    }
    if (mediaInfo.isYouTube) {
      return (
        <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[8px] font-black uppercase font-mono shadow-lg flex items-center gap-1">
          <Youtube className="w-2.5 h-2.5" /> YOUTUBE
        </span>
      );
    }
    if (mediaInfo.isFacebook) {
      return (
        <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[8px] font-black uppercase font-mono shadow-lg">
          FACEBOOK
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#FF0050] to-purple-600 text-white text-[8px] font-black uppercase font-mono shadow-lg">
        {badgeText || 'TIKTOK FYP'}
      </span>
    );
  };

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl group select-none ${className}`}
      onClick={togglePlay}
    >
      {/* 1. Native High Performance Video Stream & TikTok Live Simulation */}
      <video
        key={currentStream}
        ref={videoRef}
        src={currentStream}
        autoPlay={autoPlay}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onError={handleVideoError}
        onCanPlay={() => {
          if (autoPlay && videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
      />

      {/* Shimmer / Backdrop Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      {/* Top Badges & Controls Header */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1">
          {getPlatformBadge()}
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-cyan-300 border border-white/10">
            1080p HD
          </span>
        </div>

        {/* Audio Mute/Unmute & Direct Link Controls */}
        {showControls && (
          <div className="flex items-center gap-1 pointer-events-auto">
            {url && url.startsWith('http') && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-md border border-white/10 transition-transform active:scale-95 cursor-pointer shadow-md"
                title="Mở link gốc"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform active:scale-95 cursor-pointer shadow-md"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-3 h-3 text-slate-300" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Center Play/Pause Animated Indicator */}
      {(!isPlaying || showPlayAnim) && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all">
          <div className="w-11 h-11 rounded-full bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transform scale-100 transition-transform">
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Right Action Buttons (TikTok Sidebar: Avatar + Follow, Like, Comment, Bookmark, Share, Vinyl) */}
      {showControls && !compact && (
        <div className="absolute right-1.5 bottom-12 z-20 flex flex-col items-center gap-2.5 pointer-events-auto">
          {/* Creator Avatar & Follow Button */}
          <div className="relative mb-1">
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
              {displayHandle.replace('@', '').charAt(0).toUpperCase() || 'T'}
            </div>
            <button
              type="button"
              onClick={handleFollow}
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
                isFollowed ? 'bg-emerald-500 text-white' : 'bg-[#FF0050] text-white hover:scale-110'
              }`}
              title={isFollowed ? 'Đã theo dõi' : 'Follow'}
            >
              {isFollowed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[3]" />}
            </button>
          </div>

          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center group/btn cursor-pointer"
            title="Thả tim"
          >
            <div className={`p-1.5 rounded-full transition-transform active:scale-75 ${isLiked ? 'text-[#FF0050]' : 'text-white hover:text-rose-400'}`}>
              <Heart className={`w-5 h-5 drop-shadow ${isLiked ? 'fill-[#FF0050] text-[#FF0050]' : ''}`} />
            </div>
            <span className="text-[9px] font-bold text-white drop-shadow font-mono">
              {formatCount(likesCount)}
            </span>
          </button>

          {/* Comment Button */}
          <div className="flex flex-col items-center text-white cursor-pointer hover:text-cyan-400 transition-colors" title="Bình luận">
            <div className="p-1.5">
              <MessageCircle className="w-5 h-5 drop-shadow fill-white/20" />
            </div>
            <span className="text-[9px] font-bold text-white drop-shadow font-mono">
              {formatCount(commentCount)}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            className="flex flex-col items-center group/btn cursor-pointer"
            title="Lưu video"
          >
            <div className={`p-1.5 rounded-full transition-transform active:scale-75 ${isBookmarked ? 'text-amber-400' : 'text-white hover:text-amber-300'}`}>
              <Bookmark className={`w-5 h-5 drop-shadow ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </div>
            <span className="text-[9px] font-bold text-white drop-shadow font-mono">
              {formatCount(bookmarkCount)}
            </span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center text-white hover:text-emerald-400 transition-colors cursor-pointer"
            title="Chia sẻ"
          >
            <div className="p-1.5">
              <Share2 className="w-5 h-5 drop-shadow" />
            </div>
            <span className="text-[9px] font-bold text-white drop-shadow font-mono">
              {formatCount(shareCount)}
            </span>
          </button>

          {/* Rotating Vinyl Disc */}
          <div className="mt-1 relative">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-black border border-white/20 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white/40" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Left Info: Handle + Verified Badge + Caption + Music Track */}
      <div className="absolute bottom-2 left-2 right-12 z-20 pointer-events-none space-y-1">
        {/* Creator Handle */}
        <div className="flex items-center gap-1 drop-shadow-md">
          <span className="text-white font-black text-[11px] truncate">
            {displayHandle}
          </span>
          <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20 shrink-0" />
        </div>

        {/* Caption / Title */}
        <div className="text-[10px] text-white/90 line-clamp-1 drop-shadow-md font-sans">
          {effectiveIsLive ? (
            <span className="text-rose-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Phiên Live trực tiếp • Đang phát sóng
            </span>
          ) : (
            <span>{mediaInfo.title || 'Chiến dịch TikTok Creator #fyp #viral #trending'}</span>
          )}
        </div>

        {/* Music Sound Ticker */}
        <div className="flex items-center gap-1 text-[8px] text-slate-300 font-mono drop-shadow truncate">
          <Music2 className="w-2.5 h-2.5 text-rose-400 shrink-0 animate-bounce" />
          <span className="truncate">♫ Âm thanh gốc - {displayHandle.replace('@', '')} • TikTok Viral Beat</span>
        </div>
      </div>
    </div>
  );
};
