import React, { useRef, useEffect } from 'react';

export interface DirectVideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  isMuted?: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Video Trực Tiếp (MP4 / WebM)
 * Tách biệt hoàn toàn, xử lý video gốc với âm thanh và autoplay siêu mượt
 */
export const DirectVideoPlayer: React.FC<DirectVideoPlayerProps> = ({
  src,
  autoPlay = true,
  isMuted = false,
  isPlaying = true,
  onTogglePlay,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
      videoRef.current.muted = isMuted;
      videoRef.current.playsInline = true;
      if (autoPlay || isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [src, isMuted, isPlaying, autoPlay]);

  return (
    <div 
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl ${className}`}
      onClick={onTogglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover rounded-3xl"
      />
    </div>
  );
};
