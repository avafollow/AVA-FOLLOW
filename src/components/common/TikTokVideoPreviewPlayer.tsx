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
  Film,
  Layers,
  Video as VideoIcon
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
  fullSize?: boolean;
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
  compact = false,
  fullSize = false
}) => {
  const mediaInfo: ParsedMediaInfo = parseMediaUrl(url, channelHandle);
  const effectiveIsLive = isLive || mediaInfo.isLive;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Player Display Mode:
  // 'embed': Phát chính xác 100% video gốc từ link (TikTok embed iframe, YouTube embed, Facebook embed)
  // 'interactive': Khung tương tác mô phỏng đầy đủ phím bấm chuẩn TikTok (Follow, Tim, Comment, Share...)
  const hasDirectEmbed = Boolean(
    (mediaInfo.isTikTok && mediaInfo.videoId) || 
    (mediaInfo.isYouTube && mediaInfo.youtubeId) || 
    (mediaInfo.isFacebook && mediaInfo.embedUrl) ||
    mediaInfo.isDirectVideo
  );

  const [playerMode, setPlayerMode] = useState<'embed' | 'interactive'>(hasDirectEmbed ? 'embed' : 'interactive');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [currentStream, setCurrentStream] = useState<string>(mediaInfo.streamUrl);
  const [showPlayAnim, setShowPlayAnim] = useState<boolean>(false);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  // TikTok Action States (for interactive simulation)
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(128400);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(1280);
  const [shareCount, setShareCount] = useState<number>(856);
  const [commentCount] = useState<number>(3420);

  // Khi URL thay đổi: Tự động chuyển sang chế độ embed nếu link có Video ID thật
  useEffect(() => {
    setCurrentStream(mediaInfo.streamUrl);
    setIframeLoaded(false);
    if (hasDirectEmbed) {
      setPlayerMode('embed');
    }
  }, [url, mediaInfo.videoId, mediaInfo.youtubeId, hasDirectEmbed]);

  useEffect(() => {
    if (videoRef.current && playerMode === 'interactive') {
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
  }, [playerMode, isMuted, autoPlay, currentStream]);

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
        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase font-mono flex items-center gap-1 shadow-lg animate-pulse">
          <Radio className="w-3 h-3" /> LIVE
        </span>
      );
    }
    if (mediaInfo.isYouTube) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase font-mono shadow-lg flex items-center gap-1">
          <Youtube className="w-3 h-3" /> YOUTUBE
        </span>
      );
    }
    if (mediaInfo.isFacebook) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black uppercase font-mono shadow-lg">
          FACEBOOK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF0050] to-purple-600 text-white text-[9px] font-black uppercase font-mono shadow-lg">
        {badgeText || (mediaInfo.videoId ? 'TIKTOK VIDEO THẬT' : 'TIKTOK FYP')}
      </span>
    );
  };

  return (
    <div 
      className={`relative w-full h-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl group select-none flex flex-col ${className}`}
    >
      {/* Top Controls Bar: Platform Badge, View Mode Switcher, Sound & External Link */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {getPlatformBadge()}
          <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[8px] font-mono text-cyan-300 border border-white/10 hidden sm:inline-block">
            1080p HD
          </span>
        </div>

        {/* Action Pills / Mode Switcher */}
        {showControls && (
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {hasDirectEmbed && (
              <div className="flex items-center bg-black/80 backdrop-blur-md border border-white/20 rounded-full p-0.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => setPlayerMode('embed')}
                  className={`px-2 py-1 rounded-full text-[9px] font-bold font-mono transition-all ${
                    playerMode === 'embed'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Phát chính xác 100% video từ đường link gốc"
                >
                  Phát Đúng Link
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerMode('interactive')}
                  className={`px-2 py-1 rounded-full text-[9px] font-bold font-mono transition-all ${
                    playerMode === 'interactive'
                      ? 'bg-gradient-to-r from-[#FF0050] to-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mở giao diện mô phỏng tương tác thả tim, follow, share"
                >
                  Khung Tương Tác
                </button>
              </div>
            )}

            {/* External Link */}
            {url && url.startsWith('http') && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-full bg-black/70 hover:bg-black/95 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
                title="Mở link gốc trực tiếp"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Sound Toggle (for interactive mode & direct video) */}
            {playerMode === 'interactive' && (
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
                title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* PLAYER CONTENT CONTAINER */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-black">
        {/* MODE 1: OFFICIAL EMBED (Plays the exact video from the link!) */}
        {playerMode === 'embed' && hasDirectEmbed ? (
          <div className="w-full h-full relative bg-black flex items-center justify-center">
            {/* TikTok Official Embed Player */}
            {mediaInfo.isTikTok && mediaInfo.videoId ? (
              <iframe
                key={`tiktok-${mediaInfo.videoId}`}
                src={`https://www.tiktok.com/embed/v2/${mediaInfo.videoId}`}
                title={mediaInfo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
              />
            ) : mediaInfo.isYouTube && mediaInfo.youtubeId ? (
              /* YouTube Embed Player */
              <iframe
                key={`yt-${mediaInfo.youtubeId}`}
                src={`https://www.youtube-nocookie.com/embed/${mediaInfo.youtubeId}?autoplay=1&mute=1&playsinline=1&controls=1&loop=1&playlist=${mediaInfo.youtubeId}&modestbranding=1`}
                title={mediaInfo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
              />
            ) : mediaInfo.isFacebook && mediaInfo.embedUrl ? (
              /* Facebook Video Embed Player */
              <iframe
                key={`fb-${encodeURIComponent(url)}`}
                src={mediaInfo.embedUrl}
                title={mediaInfo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
              />
            ) : mediaInfo.isDirectVideo ? (
              /* Direct MP4 / WebM Video File */
              <video
                key={url}
                ref={videoRef}
                src={url}
                autoPlay={autoPlay}
                loop
                muted={isMuted}
                playsInline
                controls
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : null}

            {/* Sleek loading placeholder while iframe initializes */}
            {!iframeLoaded && !mediaInfo.isDirectVideo && (
              <div className="absolute inset-0 bg-[#0B0E17] flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
                <div className="w-12 h-12 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
                <div className="text-center space-y-1">
                  <div className="text-white font-bold text-xs font-mono">Đang tải video chính xác từ link...</div>
                  <div className="text-[10px] text-slate-400 font-mono">{mediaInfo.handle}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: INTERACTIVE TIKTOK SIMULATION WITH NATIVE STREAM & FULL TIKTOK BUTTONS */
          <div className="relative w-full h-full" onClick={togglePlay}>
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

            {/* Center Play/Pause Animated Indicator */}
            {(!isPlaying || showPlayAnim) && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all">
                <div className="w-14 h-14 rounded-full bg-black/75 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transform scale-100 transition-transform">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white text-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-0.5 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Right Action Buttons (TikTok Sidebar: Avatar + Follow, Like, Comment, Bookmark, Share, Vinyl) */}
            {showControls && !compact && (
              <div className="absolute right-2.5 bottom-16 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
                {/* Creator Avatar & Follow Button */}
                <div className="relative mb-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xl">
                    {displayHandle.replace('@', '').charAt(0).toUpperCase() || 'T'}
                  </div>
                  <button
                    type="button"
                    onClick={handleFollow}
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                      isFollowed ? 'bg-emerald-500 text-white' : 'bg-[#FF0050] text-white hover:scale-110'
                    }`}
                    title={isFollowed ? 'Đã theo dõi' : 'Follow'}
                  >
                    {isFollowed ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 stroke-[3]" />}
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
                    <Heart className={`w-6 h-6 drop-shadow-lg ${isLiked ? 'fill-[#FF0050] text-[#FF0050]' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
                    {formatCount(likesCount)}
                  </span>
                </button>

                {/* Comment Button */}
                <div className="flex flex-col items-center text-white cursor-pointer hover:text-cyan-400 transition-colors" title="Bình luận">
                  <div className="p-1.5">
                    <MessageCircle className="w-6 h-6 drop-shadow-lg fill-white/20" />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
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
                    <Bookmark className={`w-6 h-6 drop-shadow-lg ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
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
                    <Share2 className="w-6 h-6 drop-shadow-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
                    {formatCount(shareCount)}
                  </span>
                </button>

                {/* Rotating Vinyl Disc */}
                <div className="mt-1 relative">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-r from-slate-950 via-slate-800 to-black border-2 border-white/30 flex items-center justify-center shadow-xl ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white/50" />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Left Info: Handle + Verified Badge + Caption + Music Track */}
            <div className="absolute bottom-3 left-3 right-16 z-20 pointer-events-none space-y-1.5">
              {/* Creator Handle */}
              <div className="flex items-center gap-1.5 drop-shadow-lg">
                <span className="text-white font-black text-xs sm:text-sm truncate">
                  {displayHandle}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 shrink-0" />
              </div>

              {/* Caption / Title */}
              <div className="text-[11px] text-white/95 line-clamp-2 drop-shadow-lg font-sans">
                {effectiveIsLive ? (
                  <span className="text-rose-300 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Phiên Live trực tiếp • Đang phát sóng trực tuyến
                  </span>
                ) : (
                  <span>{mediaInfo.title || 'Chiến dịch TikTok Creator #fyp #viral #trending #avalive'}</span>
                )}
              </div>

              {/* Music Sound Ticker */}
              <div className="flex items-center gap-1 text-[9px] text-slate-300 font-mono drop-shadow truncate">
                <Music2 className="w-3 h-3 text-rose-400 shrink-0 animate-bounce" />
                <span className="truncate">♫ Âm thanh gốc - {displayHandle.replace('@', '')} • TikTok Viral Trend</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
