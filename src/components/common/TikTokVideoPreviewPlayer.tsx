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
  Music2,
  Users
} from 'lucide-react';
import { parseMediaUrl, ParsedMediaInfo } from '../../data/videoSources';

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
  muted = true,
  badgeText,
  showControls = true,
  compact = false,
  fullSize = false
}) => {
  const mediaInfo: ParsedMediaInfo = parseMediaUrl(url, channelHandle);
  const effectiveIsLive = isLive || mediaInfo.isLive;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [showPlayAnim, setShowPlayAnim] = useState<boolean>(false);
  const [currentStream, setCurrentStream] = useState<string>(mediaInfo.streamUrl);

  // TikTok Action States
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(128400);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(1280);
  const [shareCount, setShareCount] = useState<number>(856);
  const [commentCount] = useState<number>(3420);

  // Link đích chính xác của tài khoản người dùng
  const displayHandle = mediaInfo.handle || channelHandle || '@creator.vietnam';
  const cleanHandle = displayHandle.replace(/^@+/, '');
  const userTikTokProfileUrl = `https://www.tiktok.com/@${cleanHandle}`;
  const directVideoUrl = url && url.startsWith('http') ? url : userTikTokProfileUrl;

  useEffect(() => {
    setCurrentStream(mediaInfo.streamUrl);
  }, [mediaInfo.streamUrl]);

  // Đảm bảo video tự động phát mượt mà khi mount hoặc đổi stream
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
  }, [currentStream, isMuted, autoPlay]);

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
    if (navigator.clipboard && directVideoUrl) {
      navigator.clipboard.writeText(directVideoUrl).catch(() => {});
    }
  };

  // Mở ĐÚNG kênh / video TikTok của người dùng trong tab mới
  const openUserTikTok = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(directVideoUrl, '_blank', 'noopener,noreferrer');
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl group select-none flex flex-col ${className}`}
      onClick={togglePlay}
    >
      {/* 1. NATIVE HIGH-PERFORMANCE 1080P FULL-FRAME VIDEO STREAM */}
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

      {/* Shimmer / Backdrop Gradient (Tạo độ tương phản chuẩn TikTok) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

      {/* TOP BAR: Chỉ hiển thị Live Stream Badge (nếu là Live) hoặc Link trực tiếp */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        {effectiveIsLive ? (
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase font-mono flex items-center gap-1.5 shadow-lg animate-pulse">
              <Radio className="w-3.5 h-3.5" /> TRỰC TIẾP
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white flex items-center gap-1">
              <Users className="w-3 h-3 text-rose-400" /> 2.8K
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Nút mở trực tiếp kênh TikTok của tài khoản */}
        <button
          type="button"
          onClick={openUserTikTok}
          className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg pointer-events-auto"
          title={`Mở trang TikTok của @${cleanHandle}`}
        >
          <ExternalLink className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* CENTER PLAY/PAUSE ANIMATED ICON */}
      {(!isPlaying || showPlayAnim) && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all">
          <div className="w-16 h-16 rounded-full bg-black/75 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transform scale-100 transition-transform">
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white text-white" />
            ) : (
              <Play className="w-8 h-8 fill-white ml-1 text-white" />
            )}
          </div>
        </div>
      )}

      {/* RIGHT ACTION COLUMN: CHUẨN NGUYÊN BỘ KHUNG TIKTOK */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
        {/* Creator Avatar & Follow Button */}
        <div className="relative mb-1">
          <div 
            onClick={openUserTikTok}
            className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xl cursor-pointer hover:scale-105 transition-transform"
            title={`Bấm để xem kênh @${cleanHandle} trên TikTok`}
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

        {/* Like Button (Thả tim) */}
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

        {/* Comment Button (Bình luận) */}
        <div className="flex flex-col items-center text-white cursor-pointer hover:text-cyan-400 transition-colors" title="Bình luận">
          <div className="p-1.5">
            <MessageCircle className="w-7 h-7 drop-shadow-lg fill-white/20" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
            {formatCount(commentCount)}
          </span>
        </div>

        {/* Bookmark Button (Lưu video) */}
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

        {/* Share Button (Chia sẻ) */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center text-white hover:text-emerald-400 transition-colors cursor-pointer"
          title="Chia sẻ video"
        >
          <div className="p-1.5">
            <Share2 className="w-7 h-7 drop-shadow-lg" />
          </div>
          <span className="text-[10px] font-bold text-white drop-shadow-md font-mono">
            {formatCount(shareCount)}
          </span>
        </button>

        {/* Rotating Vinyl Disc (Đĩa than xoay tròn) */}
        <div className="mt-1 relative">
          <div 
            className={`w-9 h-9 rounded-full bg-gradient-to-r from-slate-950 via-slate-800 to-black border-2 border-white/40 flex items-center justify-center shadow-xl ${isPlaying ? 'animate-spin' : ''}`} 
            style={{ animationDuration: '4s' }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white/60" />
          </div>
        </div>
      </div>

      {/* BOTTOM OVERLAY: Creator Handle + Ticker Âm Thanh & BỘ NÚT ĐIỀU KHIỂN CHUẨN */}
      <div className="absolute bottom-3 left-3 right-16 z-20 pointer-events-none space-y-2">
        {/* Creator Handle (Bấm vào nhảy về đúng trang TikTok của người dùng) */}
        <div 
          onClick={openUserTikTok}
          className="flex items-center gap-1.5 drop-shadow-lg cursor-pointer pointer-events-auto hover:opacity-90 w-fit"
          title={`Xem kênh TikTok của @${cleanHandle}`}
        >
          <span className="text-white font-black text-sm truncate">
            @{cleanHandle}
          </span>
          <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20 shrink-0" />
        </div>

        {/* Caption mô tả video (ngắn gọn, không tràn viền) */}
        <div className="text-[11px] text-white/95 line-clamp-2 drop-shadow-lg font-sans">
          {effectiveIsLive ? (
            <span className="text-rose-300 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Phiên Live trực tiếp • Đang phát sóng trực tuyến
            </span>
          ) : (
            <span>{mediaInfo.title || `Video TikTok chính thức từ kênh @${cleanHandle}`}</span>
          )}
        </div>

        {/* Sound Music Ticker */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-mono drop-shadow truncate">
          <Music2 className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-bounce" />
          <span className="truncate">♫ Âm thanh gốc - {cleanHandle} • TikTok Official</span>
        </div>

        {/* BỘ PHÍM ĐIỀU KHIỂN CHUẨN: PLAY/DỪNG, BẬT/TẮT ÂM THANH, FULL MÀN HÌNH */}
        {showControls && (
          <div className="flex items-center gap-2 pt-1 pointer-events-auto">
            {/* Nút Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title={isPlaying ? 'Tạm dừng video' : 'Phát video'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Nút Bật / Tắt âm thanh */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Nút Xem Full Màn Hình */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title="Xem toàn màn hình"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
