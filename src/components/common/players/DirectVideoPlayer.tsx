import React, { useRef, useEffect, useState } from 'react';
import { Loader2, VolumeX } from 'lucide-react';

export interface DirectVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  isMuted?: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

const FAST_CDN_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
];

/**
 * Tự động chuẩn hóa URL video:
 * Ưu tiên phát nguồn video trực tiếp mượt mà, hỗ trợ fallback CDN tốc độ cao
 */
function sanitizeVideoSrc(rawSrc?: string): string {
  if (!rawSrc) return FAST_CDN_VIDEOS[0];
  if (
    rawSrc.includes('test-videos.co.uk') || 
    rawSrc.includes('interactive-examples.mdn') || 
    rawSrc.includes('vjs.zencdn.net')
  ) {
    return FAST_CDN_VIDEOS[0];
  }
  return rawSrc;
}

export const DirectVideoPlayer: React.FC<DirectVideoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  isMuted = false,
  isPlaying = true,
  onTogglePlay,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentSrc, setCurrentSrc] = useState<string>(() => sanitizeVideoSrc(src));
  const [fallbackIndex, setFallbackIndex] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);

  // Cập nhật khi prop src thay đổi
  useEffect(() => {
    const safe = sanitizeVideoSrc(src);
    setCurrentSrc(safe);
    setFallbackIndex(0);
    setIsBuffering(true);
    setHasStartedPlaying(false);
  }, [src]);

  // Đồng bộ âm thanh
  useEffect(() => {
    setInternalMuted(isMuted);
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Xử lý tự động phát video ngay lập tức
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = internalMuted;
    video.playsInline = true;

    if (autoPlay || isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsBuffering(false);
            setHasStartedPlaying(true);
          })
          .catch(() => {
            // Trình duyệt chặn autoplay có tiếng -> chuyển sang muted và phát ngay
            video.muted = true;
            setInternalMuted(true);
            video.play().then(() => {
              setIsBuffering(false);
              setHasStartedPlaying(true);
            }).catch(() => {
              setIsBuffering(false);
            });
          });
      }
    } else {
      video.pause();
    }
  }, [currentSrc, isPlaying, autoPlay]);

  // Tự động chuyển sang video CDN tiếp theo nếu video hiện tại bị lỗi
  const handleVideoError = () => {
    const nextIdx = fallbackIndex + 1;
    if (nextIdx < FAST_CDN_VIDEOS.length) {
      setFallbackIndex(nextIdx);
      setCurrentSrc(FAST_CDN_VIDEOS[nextIdx]);
    } else {
      setCurrentSrc(FAST_CDN_VIDEOS[0]);
    }
  };

  const handleVideoWaiting = () => {
    setIsBuffering(true);
  };

  const handleVideoPlaying = () => {
    setIsBuffering(false);
    setHasStartedPlaying(true);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Nếu người dùng tương tác, thử bật tiếng nếu đang bị tắt do autoplay policy
    const video = videoRef.current;
    if (video && video.muted && !isMuted) {
      video.muted = false;
      setInternalMuted(false);
    }
    if (onTogglePlay) {
      onTogglePlay();
    }
  };

  return (
    <div 
      className={`relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl ${className}`}
      onClick={handleContainerClick}
    >
      {/* Background Poster mờ nhẹ khi đang load để không bao giờ bị màn hình đen */}
      {poster && !hasStartedPlaying && (
        <img 
          src={poster} 
          alt="Video Preview"
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60 scale-105"
        />
      )}

      {/* Thẻ Video Chính Thức */}
      <video
        ref={videoRef}
        key={currentSrc}
        src={currentSrc}
        poster={poster}
        autoPlay={autoPlay}
        loop
        muted={internalMuted}
        playsInline
        preload="auto"
        onWaiting={handleVideoWaiting}
        onPlaying={handleVideoPlaying}
        onCanPlay={() => setIsBuffering(false)}
        onError={handleVideoError}
        className="w-full h-full object-cover rounded-3xl z-10"
      />

      {/* Loading Spinner mượt mà khi video đang buffer */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
          <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
          <span className="text-[11px] font-mono font-bold text-white mt-2 drop-shadow-md">
            Đang tải video...
          </span>
        </div>
      )}

      {/* Nút nhắc bật tiếng nếu trình duyệt tạm tắt tiếng */}
      {internalMuted && !isMuted && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = false;
              setInternalMuted(false);
            }
          }}
          className="absolute bottom-20 left-4 z-30 px-3 py-1.5 rounded-full bg-black/70 border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:bg-rose-600 transition-all cursor-pointer pointer-events-auto"
        >
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          <span>Chạm để bật tiếng</span>
        </div>
      )}
    </div>
  );
};
