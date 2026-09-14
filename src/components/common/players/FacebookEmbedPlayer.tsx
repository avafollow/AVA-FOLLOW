import React from 'react';

export interface FacebookEmbedPlayerProps {
  url: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Facebook Video Embed
 * Tách biệt hoàn toàn, xử lý video từ Facebook Plugin
 */
export const FacebookEmbedPlayer: React.FC<FacebookEmbedPlayerProps> = ({
  url,
  title = 'Facebook Video',
  isMuted = false,
  className = ''
}) => {
  if (!url) return null;

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        key={`fb-embed-${encodeURIComponent(url)}`}
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=${isMuted ? 1 : 0}&allowfullscreen=true`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
      />
    </div>
  );
};
