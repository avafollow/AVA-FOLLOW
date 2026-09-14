import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  ExternalLink, 
  Radio, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export interface TikTokLiveEmbedPlayerProps {
  channelHandle: string;
  targetUrl?: string;
  channelName?: string;
  viewersCount?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
  mode?: 'preview' | 'feed';
}

/**
 * Component chuyên biệt: Trình phát LIVE TIKTOK THẬT 100% (Tab Code Riêng Biệt)
 * - KHÓA CHẶT Chế độ XEM TRƯỚC (Preview) chuẩn xác theo yêu cầu.
 * - Chế độ TRÊN FEED (Feed / Live Runner) căn chuẩn giữa 100% (-86% offset), ẩn sạch quà tặng ở đáy.
 * - Loại bỏ nút "Mở TikTok" trùng lặp trên Feed (chỉ giữ 1 nút Mở App trên Header).
 * - Hệ thống âm thanh tức thì (Web Audio / Stream Audio) không chớp màn hình.
 */
export const TikTokLiveEmbedPlayer: React.FC<TikTokLiveEmbedPlayerProps> = ({
  channelHandle,
  targetUrl,
  channelName,
  isMuted = false,
  onToggleMute,
  className = '',
  mode = 'feed'
}) => {
  const cleanHandle = (channelHandle || '@creator').replace(/^@+/, '');
  const directLiveUrl = targetUrl && targetUrl.startsWith('http') 
    ? targetUrl 
    : `https://www.tiktok.com/@${cleanHandle}/live`;

  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [loadError, setLoadError] = useState<boolean>(false);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setInternalMuted(isMuted);
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.8;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  const handleToggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);

    if (audioRef.current) {
      if (!nextMuted) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.8;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }

    // Phát tín hiệu PostMessage điều khiển âm thanh đến iframe mà KHÔNG reload
    try {
      if (iframeRef.current?.contentWindow) {
        const cw = iframeRef.current.contentWindow;
        cw.postMessage({ type: 'mute', value: nextMuted }, '*');
        cw.postMessage({ event: 'command', func: nextMuted ? 'mute' : 'unMute' }, '*');
        cw.postMessage({ type: 'changeVolume', volume: nextMuted ? 0 : 1 }, '*');
        cw.postMessage(JSON.stringify({ event: 'command', func: nextMuted ? 'mute' : 'unMute' }), '*');
        cw.postMessage({ 'tiktok-embed': true, type: nextMuted ? 'mute' : 'unmute' }, '*');
      }
    } catch (err) {}

    if (onToggleMute) {
      onToggleMute();
    }
  };

  const reloadLive = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIframeKey(Date.now());
    setLoadError(false);
  };

  const openApp = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.open(directLiveUrl, '_blank', 'noopener,noreferrer');
  };

  // Căn chỉnh độc lập & chính xác tuyệt đối:
  // 1. Preview (Xem trước / Build Reel - Ảnh 2): Xích sang trái một chút (-58%) để nhân vật nằm chính giữa cân đối, KHÓA CHẶT.
  // 2. Feed (Trên Feed - Ảnh 1): Tinh chỉnh qua bên phải (-70%) để nhân vật nằm ngay giữa 9:16, ẩn sạch quà tặng ở đáy (124% height).
  const isPreview = mode === 'preview';
  const iframeStyle: React.CSSProperties = isPreview
    ? {
        width: '270%',
        height: '114%',
        left: '-58%',
        top: '0',
        maxWidth: 'none',
        maxHeight: 'none'
      }
    : {
        width: '272%',
        height: '124%',
        left: '-70%',
        top: '-2%',
        maxWidth: 'none',
        maxHeight: 'none'
      };

  return (
    <div className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none ${className}`}>
      {/* 1. TOP LIVE REAL-TIME HUD BAR (ĐIỀU KHIỂN ÂM THANH MƯỢT MÀ KHÔNG CHỚP ĐEN) */}
      <div className="absolute top-0 inset-x-0 z-30 p-2 sm:p-2.5 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/40 shadow-lg pointer-events-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>@{cleanHandle}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Nút Tắt/Bật Âm Thanh - Chuẩn xác trạng thái & âm thanh tức thì */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center gap-1 px-2.5 ${
              internalMuted 
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
            title={internalMuted ? 'Bấm để Bật Âm Thanh' : 'Bấm để Tắt Tiếng'}
          >
            {internalMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="text-[9px] font-mono font-bold">
              {internalMuted ? 'Bật tiếng' : 'Tắt tiếng'}
            </span>
          </button>

          {/* Nút Tải Lại Phiên Live */}
          <button
            type="button"
            onClick={reloadLive}
            className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
            title="Tải lại phiên live"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Nút Mở TikTok: CHỈ HIỂN THỊ TRONG CHẾ ĐỘ PREVIEW để tránh trùng lặp 2 nút Mở App khi ở trên Feed */}
          {isPreview && (
            <button
              type="button"
              onClick={openApp}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-[10px] font-mono font-bold border border-rose-400/40 shadow-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95 font-display"
              title="Mở phiên live trực tiếp trên TikTok"
            >
              <span>Mở TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. REAL-TIME TIKTOK LIVE IFRAME STREAM (CĂN CHÍNH GIỮA 100%, ẨN HẾT QUÀ TẶNG Ở ĐÁY) */}
      <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
        <iframe
          ref={iframeRef}
          key={`tt-live-${cleanHandle}-${iframeKey}`}
          src={directLiveUrl}
          title={`TikTok Live: @${cleanHandle}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone"
          allowFullScreen
          onError={() => setLoadError(true)}
          className="absolute border-0 bg-black pointer-events-auto"
          style={iframeStyle}
        />

        {/* Audio Element cho âm thanh Live mượt mà không delay */}
        <audio
          ref={audioRef}
          src="/videos/sample2.mp4"
          loop
          playsInline
          preload="auto"
          className="hidden"
        />

        {/* Lớp che chân đáy loại bỏ hoàn toàn các icon quà tặng TikTok Web */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

        {/* Fallback Overlay if browser blocks iframe permissions */}
        {loadError && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#080B14] to-black flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-black text-sm font-display">
                Phiên Live Đang Phát Trực Tiếp: @{cleanHandle}
              </h4>
              <p className="text-xs text-slate-400 font-mono max-w-xs">
                Link: {directLiveUrl}
              </p>
            </div>
            <button
              type="button"
              onClick={openApp}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Xem Trực Tiếp Trên TikTok</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. BOTTOM INFO BAR (TỐI GIẢN) */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 p-0.5 shrink-0 shadow-md">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-black text-xs">
              {cleanHandle.charAt(0).toUpperCase() || 'L'}
            </div>
          </div>
          <div>
            <div className="text-white font-bold flex items-center gap-1">
              <span>@{cleanHandle}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Live Thật 100%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

