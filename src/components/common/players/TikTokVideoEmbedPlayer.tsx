import React from 'react';
import { extractTikTokVideoId } from '../../../data/videoSources';

export interface TikTokVideoEmbedPlayerProps {
  videoId?: string;
  directUrl?: string;
  title?: string;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video TikTok Embed chính thức từ TikTok
 * Hỗ trợ:
 * 1. videoId hoặc directUrl → Tự động trích xuất videoId chuẩn
 * 2. Nhúng qua embed/v2 chính thức với autoplay=1 và lang=vi-VN
 * 3. Cho phép đầy đủ quyền phát tự động, âm thanh và toàn màn hình
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  className = ''
}) => {
  const effectiveId = videoId || (directUrl ? extractTikTokVideoId(directUrl) : null);

  // Nếu có ID video TikTok chuẩn
  const iframeSrc = effectiveId
    ? `https://www.tiktok.com/embed/v2/${effectiveId}?lang=vi-VN&autoplay=1`
    : directUrl || null;

  if (!iframeSrc) return null;

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        key={`tt-embed-${effectiveId || directUrl}`}
        src={iframeSrc}
        title={title}
        allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share"
        allowFullScreen
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
      />
    </div>
  );
};
