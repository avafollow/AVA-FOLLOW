import React from 'react';

export interface TikTokVideoEmbedPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video TikTok Embed chính thức từ TikTok
 * Khóa chặt logic nhúng iframe v2, đảm bảo video TikTok phát đúng chuẩn và sạch sẽ.
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  title = 'TikTok Video',
  className = ''
}) => {
  if (!videoId) return null;

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        key={`tt-embed-${videoId}`}
        src={`https://www.tiktok.com/embed/v2/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
      />
    </div>
  );
};
