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
import {
  parseMediaUrl,
  ParsedMediaInfo,
  getPlatformAvatar,
  resolveRealMediaChannelMeta,
  ResolvedMediaChannelMeta
} from '../../data/videoSources';
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
  channelName?: string;
  channelAvatar?: string;
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
  channelName,
  channelAvatar,
  isLive = false,
  className = '',
  autoPlay = true,
  muted = true,
  badgeText,
  showControls = true,
  compact = false,
  fullSize = false
}) => {
  const { openFeedRunner } = useTikTokApp();
  const mediaInfo: ParsedMediaInfo = parseMediaUrl(url, channelHandle);
  const effectiveIsLive = isLive || mediaInfo.isLive || (Boolean(url) && (url.toLowerCase().includes('live') || url.toLowerCase().includes('livestream')));
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [currentStream, setCurrentStream] = useState<string>(mediaInfo.streamUrl);
  const [resolvedMeta, setResolvedMeta] = useState<ResolvedMediaChannelMeta | null>(null);

  // Tự động tra cứu Tên Kênh THẬT & Logo Kênh THẬT cho mọi link YouTube / Facebook / TikTok
  useEffect(() => {
    let active = true;
    setResolvedMeta(null);
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) return;
    resolveRealMediaChannelMeta(url)
      .then((meta) => {
        if (active && meta) setResolvedMeta(meta);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [url]);

  // Đồng bộ trạng thái âm thanh khi prop muted thay đổi từ bên ngoài
  useEffect(() => {
    setIsMuted(muted);
  }, [muted]);

  // Phân loại nguồn phát chính xác
  const isYouTube = mediaInfo.isYouTube && Boolean(mediaInfo.youtubeId);
  const isFacebook = mediaInfo.isFacebook && Boolean(url);
  const isTikTok = mediaInfo.isTikTok;
  const isDirectVideo = mediaInfo.isDirectVideo || (!isTikTok && !isYouTube && !isFacebook);

  useEffect(() => {
    setCurrentStream(url);
  }, [url]);

  // Thông tin Kênh & Logo thật 100% (ưu tiên metadata API thật -> prop truyền vào -> parsed media)
  const displayChannelName =
    resolvedMeta?.channelName ||
    channelName ||
    mediaInfo.channelName ||
    channelHandle ||
    (isYouTube ? 'Kênh YouTube' : isFacebook ? 'Fanpage Facebook' : 'Kênh TikTok');
  const displayHandle =
    resolvedMeta?.channelHandle ||
    (mediaInfo.handle && mediaInfo.handle !== '@creator_vietnam' ? mediaInfo.handle : null) ||
    channelHandle ||
    displayChannelName;
  const displayAvatar =
    resolvedMeta?.channelAvatar ||
    channelAvatar ||
    mediaInfo.avatarUrl ||
    getPlatformAvatar(mediaInfo.platform, displayHandle);
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

  const openUserMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(directUserUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePushToFeed = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openFeedRunner(directUserUrl || channelHandle || 'all');
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] sm:min-h-[560px] rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl group select-none flex flex-col ${className}`}
    >
      {/* 1. TẬP HỢP CÁC TRÌNH PHÁT RIÊNG BIỆT */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-black flex items-center justify-center">
        {/* TAB 1: LIVE STREAM PLAYERS */}
        {effectiveIsLive || mediaInfo.isLive ? (
          isYouTube ? (
            /* TAB 1A: YOUTUBE LIVE PLAYER */
            <YouTubeLiveEmbedPlayer
              youtubeId={mediaInfo.youtubeId}
              targetUrl={url}
              channelHandle={cleanHandle}
              title={mediaInfo.title}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          ) : isFacebook && url ? (
            /* TAB 1B: FACEBOOK LIVE PLAYER */
            <FacebookLiveEmbedPlayer
              key={'preview_fb_live_' + encodeURIComponent(url)}
              url={url}
              title={mediaInfo.title}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          ) : (
            /* TAB 1C: TIKTOK LIVE PLAYER */
            <TikTokLiveEmbedPlayer
              channelHandle={cleanHandle}
              targetUrl={mediaInfo.streamUrl || directUserUrl}
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
            key={'preview_fb_' + encodeURIComponent(url)}
            url={url}
            title={mediaInfo.title}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            className="pb-16"
          />
        ) : mediaInfo.isTikTok || url.includes('tiktok.com') || (!isYouTube && !isFacebook && !isDirectVideo) ? (
          /* TAB 4: TIKTOK VIDEO EMBED PLAYER (THẬT 100% TỪ LINK) */
          <TikTokVideoEmbedPlayer
            key={'preview_tt_' + encodeURIComponent(url)}
            videoId={mediaInfo.videoId}
            directUrl={url}
            title={mediaInfo.title}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        ) : (
          /* TAB 5: TRÌNH PHÁT VIDEO TRỰC TIẾP */
          <DirectVideoPlayer
            src={url}
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

      {/* 4. BOTTOM INFO & CHANNEL/FANPAGE BANNER (Hiển thị cho tất cả nền tảng: YouTube, Facebook, TikTok) */}
      {!effectiveIsLive && !mediaInfo.isLive && (
        <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
          <div className="p-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-between gap-2.5 pointer-events-auto">
            <div 
              onClick={openUserMedia}
              className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
              title={`Mở kênh ${displayChannelName}`}
            >
              <div className="relative shrink-0">
                <img
                  src={displayAvatar}
                  alt={displayChannelName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const bg = isYouTube ? 'FF0000' : isFacebook ? '1877F2' : '010101';
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayChannelName || 'Channel')}&background=${bg}&color=fff&bold=true&size=128`;
                  }}
                  className="w-8 h-8 rounded-full border border-white/30 object-cover bg-slate-900"
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
                    {displayChannelName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
                <div className="text-[9px] text-slate-300 font-mono truncate">
                  {isYouTube ? 'Kênh YouTube' : isFacebook ? 'Trang / Fanpage Facebook' : 'Kênh TikTok'} • {displayHandle}
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
