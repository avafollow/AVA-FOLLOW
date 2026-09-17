import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2,
  ExternalLink, 
  Radio, 
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle2,
  Plus,
  Check,
  Music2
} from 'lucide-react';
import { parseMediaUrl, ParsedMediaInfo, getTikTokAvatar, extractTikTokVideoId, HIGH_SPEED_CDN_VIDEOS } from '../../data/videoSources';
import { useTikTokApp } from '../../context/TikTokAppContext';
import {
  TikTokVideoEmbedPlayer,
  TikTokLiveEmbedPlayer,
  TikTokLiveStudioPlayer,
  YouTubeEmbedPlayer,
  YouTubeLiveEmbedPlayer,
  FacebookEmbedPlayer,
  FacebookLiveEmbedPlayer,
  DirectVideoPlayer
} from './players';

interface TikTokVideoPreviewPlayerProps {
  url: string;
  channelHandle?: string;
  isLive?: boolean;
  className?: string;
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
  muted = false,
  badgeText,
  showControls = true,
  compact = false,
  fullSize = false
}) => {
  const { openFeedRunner } = useTikTokApp();
  const mediaInfo: ParsedMediaInfo = parseMediaUrl(url, channelHandle);
  const effectiveIsLive = isLive || mediaInfo.isLive;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [currentStream, setCurrentStream] = useState<string>(mediaInfo.streamUrl);

  // Đồng bộ trạng thái âm thanh khi prop muted thay đổi từ bên ngoài
  useEffect(() => {
    setIsMuted(muted);
  }, [muted]);

  // TikTok Action States
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(128400);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(1280);
  const [shareCount, setShareCount] = useState<number>(856);
  const [commentCount] = useState<number>(3420);

  // Phân loại nguồn phát chính xác
  const isYouTube = mediaInfo.isYouTube && Boolean(mediaInfo.youtubeId);
  const isFacebook = mediaInfo.isFacebook && Boolean(url);
  const hasTikTokVideoId = Boolean(mediaInfo.isTikTok && mediaInfo.videoId);
  const isDirectVideo = mediaInfo.isDirectVideo || (!hasTikTokVideoId && !isYouTube && !isFacebook);

  useEffect(() => {
    setCurrentStream(url);
  }, [url]);

  // Link đích chính xác của người dùng
  const displayHandle = mediaInfo.handle || channelHandle || '@creator.vietnam';
  const cleanHandle = displayHandle.replace(/^@+/, '');
  
  let directUserUrl = url && url.startsWith('http') ? url : `https://www.tiktok.com/@${cleanHandle}`;
  if (isYouTube && mediaInfo.youtubeId) {
    directUserUrl = `https://www.youtube.com/watch?v=${mediaInfo.youtubeId}`;
  } else if (isFacebook) {
    directUserUrl = url;
  }

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
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
    if (navigator.clipboard && directUserUrl) {
      navigator.clipboard.writeText(directUserUrl).catch(() => {});
    }
  };

  const openUserMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(directUserUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePushToFeed = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openFeedRunner(directUserUrl || channelHandle || 'all');
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl group select-none flex flex-col ${className}`}
    >
      {/* 1. TẬP HỢP CÁC TRÌNH PHÁT RIÊNG BIỆT */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-black flex items-center justify-center">
        {/* TAB 1: LIVE STREAM PLAYERS */}
        {effectiveIsLive || mediaInfo.isLive ? (
          isYouTube && mediaInfo.youtubeId ? (
            /* TAB 1A: YOUTUBE LIVE PLAYER */
            <YouTubeLiveEmbedPlayer
              youtubeId={mediaInfo.youtubeId}
              title={mediaInfo.title}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          ) : isFacebook && url ? (
            /* TAB 1B: FACEBOOK LIVE PLAYER */
            <FacebookLiveEmbedPlayer
              url={url}
              title={mediaInfo.title}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          ) : (
            /* TAB 1C: TIKTOK LIVE PLAYER */
            <TikTokLiveEmbedPlayer
              channelHandle={cleanHandle}
              targetUrl={directUserUrl}
              channelName={mediaInfo.title}
              viewersCount={1420}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              mode="preview"
            />
          )
        ) : isYouTube && mediaInfo.youtubeId ? (
          /* TAB 2: YOUTUBE VIDEO EMBED PLAYER */
          <YouTubeEmbedPlayer
            youtubeId={mediaInfo.youtubeId}
            title={mediaInfo.title}
            isMuted={isMuted}
          />
        ) : isFacebook && url ? (
          /* TAB 3: FACEBOOK VIDEO EMBED PLAYER */
          <FacebookEmbedPlayer
            url={url}
            title={mediaInfo.title}
            isMuted={isMuted}
          />
        ) : (hasTikTokVideoId && mediaInfo.videoId) || extractTikTokVideoId(url) ? (
          /* TAB 4: TIKTOK OFFICIAL VIDEO EMBED */
          <TikTokVideoEmbedPlayer
            videoId={mediaInfo.videoId || extractTikTokVideoId(url) || undefined}
            directUrl={url}
            title={mediaInfo.title}
          />
        ) : (
          /* TAB 5: NGUỒN PHÁT VIDEO CHUẨN TIKTOK (HỖ TRỢ LINK RÚT GỌN VT.TIKTOK & SHORT URL) */
          <DirectVideoPlayer
            src={mediaInfo.isDirectVideo && url ? url : HIGH_SPEED_CDN_VIDEOS.fyp[0]}
            autoPlay={autoPlay}
            isMuted={isMuted}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
          />
        )}
      </div>

      {/* 2. TOP HEADER BAR: SOUND CONTROLS & SWITCHER (Chỉ hiển thị cho Video thường, ẩn khi Live để tránh trùng lặp đè 2 lớp) */}
      {!effectiveIsLive && !mediaInfo.isLive && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full bg-black/80 text-white text-[9px] font-mono font-bold border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-md">
              {isYouTube ? '▶️ YouTube' : isFacebook ? '🌐 Facebook' : '🎬 TikTok'}
            </span>
            <button
              type="button"
              onClick={handlePushToFeed}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white text-[9px] font-bold shadow-lg flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/30"
              title="Đẩy lên Feed xem thử toàn màn hình"
            >
              <Play className="w-2.5 h-2.5 fill-white" />
              <span>Lướt Feed</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Play/Pause Button */}
            {isDirectVideo && (
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
                title={isPlaying ? 'Tạm dừng video' : 'Phát video'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
              </button>
            )}

            {/* Sound Mute/Unmute */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title="Xem toàn màn hình"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>

            {/* External Link Button */}
            <button
              type="button"
              onClick={openUserMedia}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title={`Mở trực tiếp trên ${isYouTube ? 'YouTube' : mediaInfo.isFacebook ? 'Facebook' : 'TikTok'}`}
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* 3. RIGHT ACTION BUTTONS (Chỉ hiển thị cho Video Direct) */}
      {isDirectVideo && !effectiveIsLive && !mediaInfo.isLive && (
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
          {/* Creator Avatar & Follow Button */}
          <div className="relative mb-1">
            <div 
              onClick={openUserMedia}
              className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xl cursor-pointer hover:scale-105 transition-transform"
              title={`Xem kênh @${cleanHandle}`}
            >
              {cleanHandle.charAt(0).toUpperCase() || 'T'}
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
              <Heart className={`w-7 h-7 drop-shadow-lg ${isLiked ? 'fill-[#FF0050] text-[#FF0050]' : ''}`} />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
              {formatCount(likesCount)}
            </span>
          </button>

          {/* Comment Button */}
          <div className="flex flex-col items-center text-white cursor-pointer hover:text-cyan-400 transition-colors" title="Bình luận">
            <div className="p-1.5">
              <MessageCircle className="w-7 h-7 drop-shadow-lg fill-white/20" />
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
            title="Lưu video vào danh sách"
          >
            <div className={`p-1.5 rounded-full transition-transform active:scale-75 ${isBookmarked ? 'text-amber-400' : 'text-white hover:text-amber-300'}`}>
              <Bookmark className={`w-7 h-7 drop-shadow-lg ${isBookmarked ? 'fill-amber-400' : ''}`} />
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
              <Share2 className="w-7 h-7 drop-shadow-lg" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
              {formatCount(shareCount)}
            </span>
          </button>
        </div>
      )}

      {/* 4. BOTTOM INFO & CHANNEL/FANPAGE BANNER (Hiển thị cho tất cả nền tảng: YouTube, Facebook, TikTok) */}
      {!effectiveIsLive && !mediaInfo.isLive && (
        <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-auto">
          <div className="p-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-between gap-2.5">
            <div 
              onClick={openUserMedia}
              className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
              title={`Mở kênh ${mediaInfo.channelName}`}
            >
              <div className="relative shrink-0">
                <img
                  src={mediaInfo.avatarUrl}
                  alt={mediaInfo.channelName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';
                  }}
                  className="w-8 h-8 rounded-full border border-white/30 object-cover"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black text-white ${
                  isYouTube ? 'bg-red-600' : isFacebook ? 'bg-blue-600' : 'bg-black text-rose-400 border border-rose-500'
                }`}>
                  {isYouTube ? '▶' : isFacebook ? 'f' : '♪'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-xs truncate max-w-[140px] sm:max-w-[180px]">
                    {mediaInfo.channelName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
                <div className="text-[9px] text-slate-300 font-mono truncate">
                  {isYouTube ? 'Kênh YouTube' : isFacebook ? 'Trang / Fanpage Facebook' : 'Kênh TikTok'} • {mediaInfo.handle}
                </div>
              </div>
            </div>

            {/* Direct Subscribe / Follow Action Button */}
            <button
              type="button"
              onClick={openUserMedia}
              className={`px-3 py-1.5 rounded-xl font-black text-[10px] sm:text-xs font-mono flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer active:scale-95 transition-all ${
                isYouTube
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                  : isFacebook
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-900/40'
              }`}
            >
              <span>{mediaInfo.actionCtaLabel}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
