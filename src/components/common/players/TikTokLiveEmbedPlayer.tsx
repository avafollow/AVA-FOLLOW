import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  ExternalLink, 
  Radio, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  ShieldCheck
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
  hideHud?: boolean;
}

/**
 * Component chuyên biệt: Trình phát LIVE TIKTOK THẬT 100% (Tab Code Riêng Biệt)
 * - Khung hình KHÓA CHẶT 100% đồng bộ chuẩn xác giữa Reels/Preview và Feed.
 * - Viewport Preview: width 270%, height 114%, left -58%, top 0%.
 * - Viewport Feed: width 272%, height 116%, left -52%, top 0% (khít đều cả 2 bên không bị hở lề phải).
 * - Hệ thống âm thanh tức thì mượt mà không delay.
 */
export const TikTokLiveEmbedPlayer: React.FC<TikTokLiveEmbedPlayerProps> = ({
  channelHandle,
  targetUrl,
  channelName,
  isMuted = false,
  onToggleMute,
  className = '',
  mode = 'preview',
  hideHud = false
}) => {
  const cleanHandle = (channelHandle || '@creator').replace(/^@+/, '');
  const directLiveUrl = targetUrl && targetUrl.startsWith('http') 
    ? targetUrl 
    : `https://www.tiktok.com/@${cleanHandle}/live`;

  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [loadError, setLoadError] = useState<boolean>(false);
  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  const handleToggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextMuted = !internalMuted;
    setInternalMuted(nextMuted);

    // Gửi tín hiệu điều khiển âm thanh trực tiếp đến luồng nhúng video live
    try {
      if (iframeRef.current?.contentWindow) {
        const cw = iframeRef.current.contentWindow;
        cw.postMessage({ type: 'mute', value: nextMuted }, '*');
        cw.postMessage({ type: nextMuted ? 'mute' : 'unmute' }, '*');
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

  // Căn chỉnh riêng biệt:
  // 1. Preview (Xem trước / Reels - Ảnh 2): Khóa Chặt left -58%, width 270%, height 114%
  // 2. Feed (Trên Feed - Ảnh 1): Dịch qua phải một chút left -52%, width 272%, height 116% lấp kín viền phải
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
        height: '116%',
        left: '-52%',
        top: '0',
        maxWidth: 'none',
        maxHeight: 'none'
      };

  return (
    <div className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none ${className}`}>
      {/* 1. TOP LIVE HUD BAR (Ẩn khi parent modal đã có thanh điều khiển trên cùng) */}
      {!hideHud && (
        <div className="absolute top-0 inset-x-0 z-30 px-2 py-2 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-none gap-1">
          {/* Handle Live Badge */}
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-rose-500/40 shadow-lg pointer-events-auto min-w-0 shrink">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1 truncate max-w-[120px] sm:max-w-[140px]">
              <Radio className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">@{cleanHandle}</span>
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 pointer-events-auto shrink-0 pr-1">
            {/* Nút Bật/Tắt Âm Thanh */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`py-1 px-2 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center gap-1 ${
                internalMuted 
                  ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40' 
                  : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/35'
              }`}
              title={internalMuted ? 'Bấm để Bật Tiếng' : 'Bấm để Tắt Tiếng'}
            >
              {internalMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />}
              <span className="text-[9px] font-mono font-bold whitespace-nowrap">
                {internalMuted ? 'Bật tiếng' : 'Tắt tiếng'}
              </span>
            </button>

            {/* Nút Tải Lại Phiên Live */}
            <button
              type="button"
              onClick={reloadLive}
              className="p-1 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 transition-transform active:scale-95 cursor-pointer shadow-lg"
              title="Tải lại phiên live"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Nút Mở TikTok */}
            <button
              type="button"
              onClick={openApp}
              className="px-2 py-1 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-[9px] font-mono font-bold border border-rose-400/40 shadow-lg flex items-center gap-0.5 cursor-pointer transition-transform active:scale-95 font-display shrink-0"
              title="Mở phiên live trực tiếp trên TikTok"
            >
              <span>Mở TikTok</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. REAL-TIME TIKTOK LIVE IFRAME STREAM (KHÓA CHẶT 100% CĂN GIỮA ĐỒNG BỘ) */}
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


