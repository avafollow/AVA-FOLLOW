import React, { useRef, useEffect, useState } from 'react';
import { Loader2, VolumeX, Volume2, Play, Pause } from 'lucide-react';

export interface DirectVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  isMuted?: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

export const DirectVideoPlayer: React.FC<DirectVideoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  isMuted = true,
  isPlaying = true,
  onTogglePlay,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const resolveValidSrc = (input?: string) => {
    if (!input) return '/videos/sample1.mp4';
    if (input.endsWith('.mp4') || input.endsWith('.webm') || input.startsWith('/videos/') || input.includes('blob:')) {
      return input;
    }
    return '/videos/sample1.mp4';
  };

  const [currentSrc, setCurrentSrc] = useState<string>(() => resolveValidSrc(src));
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);

  // Cập nhật khi prop src thay đổi
  useEffect(() => {
    setCurrentSrc(resolveValidSrc(src));
    setIsBuffering(false);
    setHasStartedPlaying(false);
  }, [src]);

  // Đồng bộ âm thanh
  useEffect(() => {
    setInternalMuted(isMuted);
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.defaultMuted = isMuted;
    }
  }, [isMuted]);

  // Xử lý tự động phát video ngay lập tức với cơ chế tương thích 100% Mobile (iOS Safari / Android Chrome) & Desktop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.muted = internalMuted;
    video.defaultMuted = internalMuted;

    const startPlay = () => {
      if (autoPlay || isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsBuffering(false);
              setHasStartedPlaying(true);
            })
            .catch(() => {
              // Mobile Safari chặn autoplay có tiếng -> ép muted và phát ngay tức thì
              video.muted = true;
              video.defaultMuted = true;
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
    };

    startPlay();

    // Lắng nghe tương tác đầu tiên của người dùng trên điện thoại để kích hoạt play nếu bị trình duyệt chặn
    const handleFirstUserInteraction = () => {
      if (video.paused && (autoPlay || isPlaying)) {
        video.play().then(() => {
          setIsBuffering(false);
          setHasStartedPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleFirstUserInteraction, { passive: true, once: true });
    window.addEventListener('touchend', handleFirstUserInteraction, { passive: true, once: true });
    window.addEventListener('click', handleFirstUserInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleFirstUserInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('touchend', handleFirstUserInteraction);
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
    };
  }, [currentSrc, isPlaying, autoPlay, internalMuted]);

  // Tự động chuyển sang video mẫu chuẩn nếu video hiện tại bị lỗi mạng
  const handleVideoError = () => {
    setIsBuffering(false);
    if (currentSrc !== '/videos/sample1.mp4') {
      setCurrentSrc('/videos/sample1.mp4');
    }
  };

  const handleVideoWaiting = () => {
    // Chỉ kích hoạt buffering nếu video chưa phát
    if (!hasStartedPlaying) {
      setIsBuffering(true);
    }
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
        {...{ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' }}
        preload="auto"
        onWaiting={handleVideoWaiting}
        onPlaying={handleVideoPlaying}
        onCanPlay={() => {
          setIsBuffering(false);
          if (videoRef.current && (autoPlay || isPlaying) && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onError={handleVideoError}
        className="w-full h-full object-cover rounded-3xl z-10"
      />

      {/* Loading Spinner mượt mà khi video đang buffer */}
      {isBuffering && !hasStartedPlaying && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <span className="text-[10px] font-mono font-bold text-white mt-1.5 drop-shadow-md">
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
