import React from 'react';

export interface TikTokVideoEmbedPlayerProps {
  videoId?: string;
  directUrl?: string;
  title?: string;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video TikTok Embed chính thức từ TikTok
 * Hỗ trợ 2 chế độ:
 * 1. videoId → Phát qua TikTok embed/v2 chính thức
 * 2. directUrl → Phát trực tiếp URL gốc qua iframe (khi không trích xuất được videoId)
 * Đảm bảo video TikTok LUÔN phát ngay lập tức khi dán link, không rơi vào video nền mẫu.
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  className = ''
}) => {
  // Ưu tiên videoId embed chuẩn, fallback sang directUrl iframe
  const iframeSrc = videoId
    ? `https://www.tiktok.com/embed/v2/${videoId}`
    : directUrl || null;

  if (!iframeSrc) return null;

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        key={`tt-embed-${videoId || directUrl}`}
        src={iframeSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
      />
    </div>
  );
};
