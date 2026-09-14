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
  Users,
  Youtube,
  Film,
  ShoppingBag
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
  muted = false,
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

  // Phân loại nguồn phát chính xác
  const isYouTube = mediaInfo.isYouTube && Boolean(mediaInfo.youtubeId);
  const isFacebook = mediaInfo.isFacebook && Boolean(url);
  const isDirectVideo = mediaInfo.isDirectVideo;
  const hasTikTokVideoId = Boolean(mediaInfo.isTikTok && mediaInfo.videoId);

  // Tự động phát video TikTok thật nếu có Video ID, hoặc video Stream HD
  const [streamMode, setStreamMode] = useState<'stream' | 'embed'>(hasTikTokVideoId ? 'embed' : 'stream');

  useEffect(() => {
    if (hasTikTokVideoId) {
      setStreamMode('embed');
    } else {
      setStreamMode('stream');
    }
  }, [hasTikTokVideoId, url]);

  // Link đích chính xác của người dùng
  const displayHandle = mediaInfo.handle || channelHandle || '@creator.vietnam';
  const cleanHandle = displayHandle.replace(/^@+/, '');
  
  let directUserUrl = url && url.startsWith('http') ? url : `https://www.tiktok.com/@${cleanHandle}`;
  if (isYouTube && mediaInfo.youtubeId) {
    directUserUrl = `https://www.youtube.com/watch?v=${mediaInfo.youtubeId}`;
  } else if (isFacebook) {
    directUserUrl = url;
  }

  // Đảm bảo video native tự động phát mượt mà khi dán link mới (0.00s delay)
  useEffect(() => {
    setCurrentStream(mediaInfo.streamUrl);
    if (videoRef.current && (!isYouTube || streamMode === 'stream') && streamMode !== 'embed') {
      videoRef.current.defaultMuted = false;
      videoRef.current.muted = isMuted;
      videoRef.current.playsInline = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
                setIsPlaying(false);
              });
            } else {
              setIsPlaying(false);
            }
          });
      }
    }
  }, [currentStream, mediaInfo.streamUrl, url, isMuted, autoPlay, isYouTube, streamMode]);

  const handleVideoError = () => {
    // Không chuyển sang video demo, giữ nguyên luồng video của người dùng
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
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
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

  // Mở ĐÚNG video / kênh người dùng trong tab mới
  const openUserMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(directUserUrl, '_blank', 'noopener,noreferrer');
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getPlatformBadge = () => {
    if (effectiveIsLive) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase font-mono flex items-center gap-1 shadow-lg animate-pulse">
          <Radio className="w-3 h-3" /> {isYouTube ? 'YOUTUBE LIVE' : isFacebook ? 'FB LIVE' : 'TRỰC TIẾP'}
        </span>
      );
    }
    if (isYouTube) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase font-mono flex items-center gap-1 shadow-lg">
          <Youtube className="w-3 h-3" /> YOUTUBE
        </span>
      );
    }
    if (isFacebook) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black uppercase font-mono shadow-lg">
          FACEBOOK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF0050] to-purple-600 text-white text-[9px] font-black uppercase font-mono shadow-lg">
        {badgeText || 'TIKTOK'}
      </span>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl group select-none flex flex-col ${className}`}
    >
      {/* 1. PLAYER CONTAINER (Tự động thích ứng với YouTube, Facebook, TikTok hoặc Native Stream) */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-black flex items-center justify-center">
        {/* TRƯỜNG HỢP A: TIKTOK CHÍNH THỨC NẾU NGƯỜI DÙNG CHỌN XEM KHUNG EMBED */}
        {streamMode === 'embed' && hasTikTokVideoId ? (
          <iframe
            key={`tt-${mediaInfo.videoId}`}
            src={`https://www.tiktok.com/embed/v2/${mediaInfo.videoId}`}
            title={mediaInfo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
          />
        ) : isYouTube && mediaInfo.youtubeId ? (
          /* TRƯỜNG HỢP B: YOUTUBE VIDEO HOẶC YOUTUBE LIVE */
          <iframe
            key={`yt-${mediaInfo.youtubeId}-${isMuted}`}
            src={`https://www.youtube.com/embed/${mediaInfo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${mediaInfo.youtubeId}&modestbranding=1&rel=0&enablejsapi=1`}
            title={mediaInfo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
          />
        ) : isFacebook && url ? (
          /* TRƯỜNG HỢP C: FACEBOOK VIDEO EMBED */
          <iframe
            key={`fb-${encodeURIComponent(url)}`}
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=${isMuted ? 1 : 0}&allowfullscreen=true`}
            title={mediaInfo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
          />
        ) : isDirectVideo ? (
          /* TRƯỜNG HỢP D: DIRECT MP4 / WEBM VIDEO FILE */
          <video
            key={url}
            ref={(el) => {
              videoRef.current = el;
              if (el) {
                el.defaultMuted = false;
                el.muted = isMuted;
                el.playsInline = true;
                el.play().then(() => setIsPlaying(true)).catch(() => {
                  el.muted = true;
                  el.play().catch(() => {});
                });
              }
            }}
            src={url}
            autoPlay={autoPlay}
            loop
            muted={isMuted}
            playsInline
            controls
            className="w-full h-full object-cover bg-black rounded-3xl"
          />
        ) : effectiveIsLive || mediaInfo.isLive ? (
          /* TRƯỜNG HỢP E: TIKTOK LIVE BROADCAST STUDIO (PHÒNG PHÁT SÓNG TRỰC TIẾP SẮC NÉT) */
          <div 
            className="relative w-full h-full bg-black flex flex-col justify-between p-4 overflow-hidden select-none cursor-pointer"
            onClick={togglePlay}
          >
            {/* Background Active Live Motion Video Stream */}
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.defaultMuted = false;
                  el.muted = isMuted;
                  el.playsInline = true;
                  const playPromise = el.play();
                  if (playPromise !== undefined) {
                    playPromise.then(() => setIsPlaying(true)).catch(() => {
                      el.muted = true;
                      el.play().then(() => setIsPlaying(true)).catch(() => {});
                    });
                  }
                }
              }}
              src={currentStream}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />

            {/* Animated Glow Background Waves & Contrast Layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(244,63,94,0.3),transparent_70%)] animate-pulse pointer-events-none" />
            <div className="absolute top-1/4 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 -left-12 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* TOP LIVE BROADCAST TICKER */}
            <div className="relative z-10 flex items-center justify-between pt-8 px-1">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </div>
                <span className="text-[10px] font-mono font-black text-rose-300 uppercase tracking-wider">
                  LIVE 🔴 TRỰC TIẾP
                </span>
                <span className="text-white/40">|</span>
                <span className="text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1">
                  <Users className="w-3 h-3 text-rose-400" />
                  <span>1,420 mắt xem</span>
                </span>
              </div>

              {/* TikTok Direct App Button */}
              <button
                type="button"
                onClick={openUserMedia}
                className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-mono font-bold border border-rose-400/40 shadow-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                title="Mở trực tiếp trên App TikTok để xem phòng live"
              >
                <span>Mở App TikTok</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* CENTER LIVE BROADCAST VISUALIZER & HOST AVATAR */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-3 pointer-events-none">
              {/* Host Avatar with Multi-layer Live Rings */}
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 animate-spin opacity-75 blur-[2px]" style={{ animationDuration: '6s' }} />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black p-1 border-2 border-white shadow-2xl flex items-center justify-center text-white font-black text-2xl">
                  {cleanHandle.charAt(0).toUpperCase() || 'L'}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-lg border border-rose-300/40 animate-pulse">
                  ON AIR
                </div>
              </div>

              {/* Host Handle & Broadcast Status */}
              <div className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-white font-black text-base drop-shadow-lg">@{cleanHandle}</span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                </div>
                <p className="text-[11px] text-rose-300 font-mono font-bold flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Phiên Live Đang Phát Sóng Trực Tuyến</span>
                </p>
              </div>

              {/* Live Audio Equalizer Waveform Bars */}
              <div className="flex items-end justify-center gap-1 h-8 pt-1">
                {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 60, 100, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full animate-pulse"
                    style={{ 
                      height: `${isPlaying ? h : 20}%`, 
                      animationDelay: `${i * 0.08}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* LIVE SHOPPING DEAL & CHAT TICKER */}
            <div className="relative z-10 space-y-2 pointer-events-auto">
              {/* Pinned TikTok Shop Bag */}
              <div 
                onClick={openUserMedia}
                className="p-2.5 rounded-2xl bg-amber-400/90 hover:bg-amber-300 text-black flex items-center justify-between gap-2 shadow-xl cursor-pointer transition-transform active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-black/10">
                    <ShoppingBag className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-[8px] uppercase font-mono font-bold text-black/70">TikTok Shop Giỏ Hàng</div>
                    <div className="text-[11px] font-extrabold text-black">Deal Đang Ghim Trong Live 🔥</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-black text-amber-300 text-[10px] font-mono font-bold">
                  Xem Deal
                </span>
              </div>

              {/* Rolling Live Chat Stream */}
              <div className="space-y-1 max-h-24 overflow-hidden text-left pointer-events-none">
                {[
                  'Chào cả nhà yêu, mọi người thả tim giúp shop nhé ❤️',
                  'Đã chốt đơn 2 combo màu be nhé chủ phòng 🔥',
                  'Chất lượng live siêu mượt, xin chào @' + cleanHandle + ' !'
                ].map((msg, i) => (
                  <div key={i} className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/5 text-[10px] text-white/90 leading-snug drop-shadow truncate">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP E: TIKTOK KÊNH, TIKTOK VIDEO, TIKTOK LIVE, NATIVE STREAM SIÊU MƯỢT */
          <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
            <video
              key={currentStream}
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.defaultMuted = true;
                  el.muted = isMuted;
                  el.playsInline = true;
                  const p = el.play();
                  if (p !== undefined) {
                    p.then(() => setIsPlaying(true)).catch(() => {
                      el.muted = true;
                      el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                    });
                  }
                }
              }}
              src={currentStream}
              autoPlay={autoPlay}
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onError={handleVideoError}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onCanPlay={(e) => {
                const v = e.currentTarget;
                if (autoPlay && v.paused) {
                  v.play().then(() => setIsPlaying(true)).catch(() => {
                    v.muted = true;
                    setIsMuted(true);
                    v.play().then(() => setIsPlaying(true)).catch(() => {
                      setIsPlaying(false);
                    });
                  });
                }
              }}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Shimmer / Backdrop Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

            {/* Center Play/Pause Animated & Interactive Button */}
            {(!isPlaying || showPlayAnim) && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-auto bg-black/45 backdrop-blur-[2px] transition-all cursor-pointer"
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer transform hover:scale-110 active:scale-95 border-2 border-white/40 shadow-rose-500/50"
                  title={isPlaying ? 'Tạm dừng' : 'Bấm để phát video'}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white" />
                  ) : (
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1 text-white" />
                  )}
                </button>
                {!isPlaying && (
                  <span className="mt-3 px-4 py-1.5 rounded-full bg-black/85 text-white text-xs font-mono font-bold tracking-wide border border-rose-500/50 shadow-xl flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ▶️ BẤM ĐỂ PHÁT VIDEO LIÊN TỤC
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. TOP HEADER BAR: LIVE COUNTER & SOUND CONTROLS */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {effectiveIsLive && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-[9px] font-mono font-bold text-white flex items-center gap-1 border border-rose-400/30 animate-pulse">
              <Radio className="w-3 h-3" /> ĐANG LIVE
            </span>
          )}
          {hasTikTokVideoId && (
            <button
              type="button"
              onClick={() => setStreamMode(streamMode === 'embed' ? 'stream' : 'embed')}
              className="px-2.5 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-[9px] font-mono font-bold border border-rose-400/40 backdrop-blur-md transition-all flex items-center gap-1 shadow-md cursor-pointer"
              title={streamMode === 'embed' ? 'Đang phát TikTok Gốc (Bấm để chuyển sang Stream HD)' : 'Đang phát Stream HD (Bấm để chuyển sang TikTok Gốc)'}
            >
              {streamMode === 'embed' ? '🎬 TikTok Gốc' : '⚡ Stream HD'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Play/Pause Button in header */}
          {(!isYouTube || streamMode === 'stream') && streamMode !== 'embed' && (
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
          {streamMode !== 'embed' && (
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          )}

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

      {/* 3. RIGHT ACTION BUTTONS (Chỉ hiển thị cho Video thường để không bị đè 2 lớp trên Live hoặc Khung nhúng) */}
      {(!isYouTube || streamMode === 'stream') && streamMode !== 'embed' && !effectiveIsLive && !mediaInfo.isLive && (
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

          {/* Rotating Vinyl Disc */}
          <div className="mt-1 relative">
            <div 
              className={`w-9 h-9 rounded-full bg-gradient-to-r from-slate-950 via-slate-800 to-black border-2 border-white/40 flex items-center justify-center shadow-xl ${isPlaying ? 'animate-spin' : ''}`} 
              style={{ animationDuration: '4s' }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white/60" />
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM INFO OVERLAY (Dành cho Video thường, ẩn khi Live để tránh trùng lặp đè chữ) */}
      {(!isYouTube || streamMode === 'stream') && streamMode !== 'embed' && !effectiveIsLive && !mediaInfo.isLive && (
        <div className="absolute bottom-3 left-3 right-16 z-20 pointer-events-none space-y-2">
          {/* Creator Handle */}
          <div 
            onClick={openUserMedia}
            className="flex items-center gap-1.5 drop-shadow-lg cursor-pointer pointer-events-auto hover:opacity-90 w-fit"
            title={`Xem kênh @${cleanHandle}`}
          >
            <span className="text-white font-black text-sm truncate">
              @{cleanHandle}
            </span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20 shrink-0" />
          </div>

          {/* Caption */}
          <div className="text-[11px] text-white/95 line-clamp-2 drop-shadow-lg font-sans">
            {effectiveIsLive ? (
              <span className="text-rose-300 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Phiên Live trực tiếp • Đang phát sóng trực tuyến
              </span>
            ) : (
              <span>{mediaInfo.title || `Video chính thức từ @${cleanHandle}`}</span>
            )}
          </div>

          {/* Music Ticker */}
          <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-mono drop-shadow truncate">
            <Music2 className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-bounce" />
            <span className="truncate">♫ Âm thanh gốc - {cleanHandle} • Đang phát sóng</span>
          </div>

          {/* Play/Pause & Audio controls */}
          {showControls && (
            <div className="flex items-center gap-2 pt-1 pointer-events-auto">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-full bg-black/70 hover:bg-black/95 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer shadow-lg"
                title={isPlaying ? 'Tạm dừng video' : 'Phát video'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
