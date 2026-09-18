import React from 'react';

export interface YouTubeEmbedPlayerProps {
  youtubeId: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát YouTube Embed
 * Tách biệt hoàn toàn, xử lý video hoặc live stream từ YouTube
 */
export const YouTubeEmbedPlayer: React.FC<YouTubeEmbedPlayerProps> = ({
  youtubeId,
  title = 'YouTube Video',
  isMuted = false,
  className = ''
}) => {
  if (!youtubeId) return null;

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        key={`yt-embed-${youtubeId}-${isMuted}`}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`}
        title={title}
        allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share; fullscreen"
        allowFullScreen
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};
