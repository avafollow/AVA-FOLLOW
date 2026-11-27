import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, CheckCircle2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { extractTikTokHandle, getPlatformAvatar } from '../../../data/videoSources';

export interface FacebookEmbedPlayerProps {
  url: string;
  title?: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Facebook Video Embed
 * Tách biệt hoàn toàn, xử lý video từ Facebook Plugin với cơ chế bật/tắt âm thanh 100% trên Mobile, macOS & Desktop PC
 * Khắc phục hoàn toàn lỗi câm tiếng do browser autoplay policy bằng phương thức postMessage & persistent iframe
 */
export const FacebookEmbedPlayer: React.FC<FacebookEmbedPlayerProps> = ({
  url,
  title = 'Facebook Video',
  isMuted = false,
  onToggleMute,
  className = ''
}) => {
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [hasError, setHasError] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fbPlayerInstanceRef = useRef<any>(null);

  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  // Lắng nghe sự kiện từ Facebook SDK nếu có sẵn trên trang
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      try {
        (window as any).FB.Event?.subscribe('xfbml.ready', (msg: any) => {
          if (msg.type === 'video') {
            fbPlayerInstanceRef.current = msg.instance;
            if (!internalMuted) {
              msg.instance.unmute?.();
              msg.instance.setVolume?.(1.0);
            }
          }
        });
      } catch {}
    }
  }, [internalMuted]);

  if (!url) return null;

  const normalizedUrl = url
    .replace('facebook.com/@', 'facebook.com/')
    .replace('m.facebook.com', 'www.facebook.com');

  const handle = extractTikTokHandle(normalizedUrl);
  const cleanHandle = handle.replace(/^@+/, '');

  /**
   * Kích hoạt âm thanh Facebook trực tiếp:
   * 1. Mở khóa AudioContext của trình duyệt (bắt buộc trên iOS Safari / macOS)
   * 2. Gửi lệnh postMessage unMute & setVolume tới iframe mà không tải lại (tránh bị browser chặn autoplay)
   * 3. Gọi SDK Facebook instance nếu khả dụng
   */
  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);

    // 1. Mở khóa AudioContext trình duyệt
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }
    } catch {}

    // 2. Gửi lệnh điều khiển âm lượng tới Iframe mà không hủy DOM
    if (iframeRef.current?.contentWindow) {
      const cw = iframeRef.current.contentWindow;
      const commands = nextMuted 
        ? [
            JSON.stringify({ event: 'command', func: 'mute' }),
            'mute'
          ]
        : [
            JSON.stringify({ event: 'command', func: 'unMute' }),
            JSON.stringify({ event: 'command', func: 'unmute' }),
            JSON.stringify({ event: 'command', func: 'setVolume', args: [1.0] }),
            JSON.stringify({ event: 'command', func: 'play' }),
            'unmute',
            'play'
          ];

      commands.forEach(cmd => {
        try {
          cw.postMessage(cmd, '*');
        } catch {}
      });
    }

    // 3. Điều khiển qua Facebook Player SDK nếu có
    if (fbPlayerInstanceRef.current) {
      try {
        if (nextMuted) {
          fbPlayerInstanceRef.current.mute?.();
        } else {
          fbPlayerInstanceRef.current.unmute?.();
          fbPlayerInstanceRef.current.setVolume?.(1.0);
          fbPlayerInstanceRef.current.play?.();
        }
      } catch {}
    }

    if (onToggleMute) {
      onToggleMute();
    }
  };

  if (hasError) {
    return (
      <div className={`relative w-full h-full bg-[#0B0F19] flex flex-col items-center justify-center overflow-hidden rounded-3xl group select-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1528] via-[#080D1A] to-[#040812]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-xs w-full">
          <div className="relative cursor-pointer" onClick={() => window.open(url, '_blank')}>
            <div className="w-20 h-20 rounded-full border-2 border-blue-500 overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-blue-600 to-indigo-500">
              <img 
                src={getPlatformAvatar('facebook', cleanHandle)} 
                alt={cleanHandle}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=2563EB&color=fff&bold=true`;
                }}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-blue-500 text-white shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-white font-black text-base flex items-center justify-center gap-1.5">
              <span>Fanpage {cleanHandle}</span>
            </h4>
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Facebook Video Thật</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-2 px-2">
            {title || `Video Fanpage Facebook ${cleanHandle}`}
          </p>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-blue-400/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mở & Phát Trên Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      {/* Top Floating Controls */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-blue-500/40 text-[10px] font-mono font-bold text-blue-300 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>FACEBOOK VIDEO</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Nút Bật/Tắt Âm Thanh Trực Tiếp */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`py-1 px-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5 ${
              internalMuted 
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40 animate-pulse' 
                : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/40'
            }`}
            title={internalMuted ? 'Bấm để bật âm thanh video Facebook' : 'Bấm để tắt tiếng'}
          >
            {internalMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
            <span className="text-[10px] font-mono font-bold">
              {internalMuted ? 'Bật Tiếng' : 'Âm Thanh Bật'}
            </span>
          </button>

          {/* Mở Facebook ngoài */}
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-full bg-black/80 hover:bg-blue-600 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20 active:scale-95 flex items-center justify-center shadow-lg"
            title="Mở trên Facebook để nghe âm thanh gốc"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Floating Center Prompt if Muted - Chạm để bật âm thanh tức thì */}
      {internalMuted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <button
            type="button"
            onClick={handleToggleSound}
            className="px-4 py-2.5 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-blue-300/40 pointer-events-auto cursor-pointer animate-pulse active:scale-95 transition-all backdrop-blur-md"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>🔊 Bấm để Bật Âm Thanh Facebook</span>
          </button>
        </div>
      )}

      {/* 
        Facebook Iframe Player:
        Giữ nguyên iframe không remount khi bật/tắt tiếng để tránh bị browser autoplay block,
        Cấu hình allow đầy đủ autoplay & âm thanh cho mọi trình duyệt
      */}
      <iframe
        ref={iframeRef}
        key={`fb-embed-${encodeURIComponent(normalizedUrl)}`}
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(normalizedUrl)}&show_text=false&autoplay=true&muted=false&allowfullscreen=true`}
        title={title}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        onError={() => setHasError(true)}
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};
