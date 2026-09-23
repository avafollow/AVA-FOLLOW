import React, { useState, useEffect } from 'react';
import { TikTokLiveStudioPlayer } from './TikTokLiveStudioPlayer';
import { getTikTokAvatar } from '../../../data/videoSources';

export interface TikTokLiveEmbedPlayerProps {
  channelHandle: string;
  targetUrl?: string;
  channelName?: string;
  viewersCount?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
  mode?: 'preview' | 'feed';
  hideHud?: boolean;
}

/**
 * Component chuyên biệt: Trình phát LIVE TIKTOK THẬT 100% (Tab Code Riêng Biệt)
 * - Tương thích hoàn hảo 100% trên điện thoại di động và máy tính.
 * - Hiển thị phòng Live Studio sống động: Avatar xoay viền neon, sóng Equalizer âm thanh,
 *   đếm mắt xem trực tuyến, giỏ hàng TikTok Shop và bình luận tương tác.
 * - Hỗ trợ nút Mở Trực Tiếp Trên App TikTok 1 chạm.
 */
export const TikTokLiveEmbedPlayer: React.FC<TikTokLiveEmbedPlayerProps> = ({
  channelHandle,
  targetUrl,
  channelName,
  viewersCount = 1420,
  isMuted = true,
  onToggleMute,
  className = '',
  mode = 'preview',
  hideHud = false
}) => {
  const cleanHandle = (channelHandle || '@creator').replace(/^@+/, '');
  const directLiveUrl = targetUrl && targetUrl.startsWith('http') 
    ? targetUrl 
    : `https://www.tiktok.com/@${cleanHandle}/live`;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);

  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  const handleToggleSound = () => {
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);
    if (onToggleMute) {
      onToggleMute();
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleOpenApp = () => {
    window.open(directLiveUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none ${className}`}>
      <TikTokLiveStudioPlayer
        channelHandle={cleanHandle}
        channelName={channelName || `Kênh @${cleanHandle}`}
        channelAvatar={getTikTokAvatar(cleanHandle)}
        streamUrl={targetUrl}
        viewersCount={viewersCount}
        isPlaying={isPlaying}
        isMuted={internalMuted}
        onTogglePlay={handleTogglePlay}
        onToggleMute={handleToggleSound}
        onOpenApp={handleOpenApp}
        className="w-full h-full"
      />
    </div>
  );
};
