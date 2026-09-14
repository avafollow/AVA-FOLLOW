import React, { useEffect, useRef, useState, useCallback } from 'react';
import { extractTikTokVideoId } from '../../../data/videoSources';
import { Play, Volume2 } from 'lucide-react';

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
 * 2. Nhúng qua embed/v2 chính thức với autoplay=1&muted=0&lang=vi-VN
 * 3. Gửi lệnh Play & Unmute tức thì qua giao thức player.js và TikTok Native PostMessage
 * 4. Kích hoạt phát video và âm thanh ngay khi dán link
 */
export const TikTokVideoEmbedPlayer: React.FC<TikTokVideoEmbedPlayerProps> = ({
  videoId,
  directUrl,
  title = 'TikTok Video',
  className = ''
}) => {
  const effectiveId = videoId || (directUrl ? extractTikTokVideoId(directUrl) : null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Nếu có ID video TikTok chuẩn
  const iframeSrc = effectiveId
    ? `https://www.tiktok.com/embed/v2/${effectiveId}?lang=vi-VN&autoplay=1&muted=0`
    : directUrl || null;

  // Gửi lệnh phát video và bật tiếng qua mọi giao thức hỗ trợ của TikTok Embed
  const triggerPlayAndSound = useCallback(() => {
    try {
      if (!iframeRef.current?.contentWindow) return;
      const cw = iframeRef.current.contentWindow;

      // 1. Chuẩn Player.js (Được TikTok Web & Iframe Embed hỗ trợ)
      cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: 'play' }), '*');
      cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: 'unmute' }), '*');
      cw.postMessage(JSON.stringify({ context: 'player.js', version: '0.0.11', event: 'command', method: 'setVolume', value: 100 }), '*');

      // 2. Chuẩn Native TikTok Message
      cw.postMessage({ 'tiktok-embed': true, type: 'play' }, '*');
      cw.postMessage({ 'tiktok-embed': true, type: 'unmute' }, '*');
      cw.postMessage({ type: 'play' }, '*');
      cw.postMessage({ type: 'unmute' }, '*');
      cw.postMessage({ action: 'play' }, '*');
      cw.postMessage({ method: 'play' }, '*');
      cw.postMessage({ event: 'command', func: 'play' }, '*');

      setHasStarted(true);
    } catch (err) {}
  }, []);

  // Tự động kích hoạt phát video và âm thanh sau khi tải
  useEffect(() => {
    setHasStarted(false);
    const timers = [100, 300, 600, 1000, 1600, 2400].map(delay =>
      setTimeout(triggerPlayAndSound, delay)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, [effectiveId, triggerPlayAndSound]);

  // Kích hoạt phát video và âm thanh ngay khi người dùng chạm hoặc click vào màn hình
  useEffect(() => {
    const handleInteraction = () => {
      triggerPlayAndSound();
    };
    window.addEventListener('click', handleInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true, once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [triggerPlayAndSound]);

  if (!iframeSrc) return null;

  return (
    <div 
      onClick={triggerPlayAndSound}
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl group ${className}`}
    >
      <iframe
        ref={iframeRef}
        key={`tt-embed-${effectiveId || directUrl}`}
        src={iframeSrc}
        title={title}
        allow="accelerometer; autoplay *; clipboard-write; encrypted-media *; gyroscope; picture-in-picture *; web-share"
        allowFullScreen
        onLoad={triggerPlayAndSound}
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
      />

      {/* Floating Interactive Quick Play/Unmute Button if browser blocked immediate autoplay */}
      {!hasStarted && (
        <button
          type="button"
          onClick={triggerPlayAndSound}
          className="absolute inset-x-4 bottom-16 z-30 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white font-bold text-xs shadow-2xl flex items-center justify-center gap-2 border border-white/25 backdrop-blur-md animate-pulse hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>▶ PHÁT VIDEO & BẬT ÂM THANH NGAY</span>
          <Volume2 className="w-4 h-4 text-emerald-300" />
        </button>
      )}
    </div>
  );
};
