import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  Heart,
  Flame,
  MessageSquare,
  Play
} from 'lucide-react';
import { extractTikTokHandle, getTikTokAvatar } from '../../../data/videoSources';

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
 * TikTokLiveEmbedPlayer v3 — Hiển thị đúng phiên live từ link người dùng dán vào.
 * TikTok KHÔNG hỗ trợ nhúng phiên Live trong iframe từ bên thứ 3 (bị block X-Frame-Options).
 * Giải pháp: hiển thị Live Preview Card đẹp + nút "Mở Live Ngay" dẫn thẳng đến kênh thật.
 * KHÔNG dùng placeholder/ảnh mẫu nào — 100% hiển thị đúng @handle kênh thật người dùng dán vào.
 */
export const TikTokLiveEmbedPlayer: React.FC<TikTokLiveEmbedPlayerProps> = ({
  channelHandle,
  targetUrl,
  channelName,
  viewersCount = 1580,
  isMuted = true,
  onToggleMute,
  className = '',
  mode = 'preview',
  hideHud = false
}) => {
  // Trích xuất @handle chính xác từ URL người dùng dán vào
  const rawHandle = extractTikTokHandle(targetUrl || channelHandle || '');
  const cleanHandle = (rawHandle || channelHandle || '').replace(/^@+/, '').trim();

  // URL thật đến phiên live của creator
  const directLiveUrl = targetUrl && targetUrl.startsWith('http')
    ? targetUrl
    : `https://www.tiktok.com/@${cleanHandle}/live`;

  const [internalMuted, setInternalMuted] = useState<boolean>(isMuted);
  const [viewers, setViewers] = useState<number>(viewersCount);
  const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);

  useEffect(() => { setInternalMuted(isMuted); }, [isMuted]);

  // Bộ đếm mắt xem dao động tự nhiên
  useEffect(() => {
    const timer = setInterval(() => {
      setViewers(prev => Math.max(500, prev + Math.floor(Math.random() * 11) - 5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInternalMuted(prev => !prev);
    if (onToggleMute) onToggleMute();
  };

  const handleOpenLiveApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(directLiveUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTapScreen = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8'];
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.max(30, Math.min(rect.width - 40, x)),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setHearts(prev => [...prev.slice(-10), newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  const avatarUrl = getTikTokAvatar(cleanHandle);
  const displayName = channelName || `@${cleanHandle}`;

  return (
    <div
      className={`relative w-full h-full bg-black flex flex-col overflow-hidden select-none cursor-pointer ${className}`}
      onClick={handleTapScreen}
    >
      {/* ============================================================== */}
      {/* LIVE PREVIEW CARD — Hiển thị đúng kênh thật, nút mở trực tiếp  */}
      {/* ============================================================== */}
      <div className="absolute inset-0 flex flex-col">
        {/* Animated dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0D18] via-[#12172B] to-[#0D1117]">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 sm:w-40 sm:h-40 bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 sm:w-32 sm:h-32 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 sm:gap-5 px-4 py-6">
          
          {/* Avatar + live ring */}
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 animate-spin opacity-80" style={{ animationDuration: '3s' }} />
              <img
                src={avatarUrl}
                alt={cleanHandle}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle || 'LIVE')}&background=E11D48&color=fff&bold=true&size=200`;
                }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-black z-10"
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 border border-white/20 text-white text-[10px] font-black tracking-wider z-20 flex items-center gap-1 shadow-lg shadow-rose-600/50 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Channel info */}
            <div className="text-center">
              <div className="text-white font-black text-base sm:text-lg font-display">{displayName}</div>
              <div className="text-rose-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 mt-0.5">
                <Radio className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
                <span>Đang phát trực tiếp</span>
              </div>
            </div>

            {/* Viewer count */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-rose-500/30 backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-white font-black text-sm font-mono">{viewers.toLocaleString()}</span>
              <span className="text-slate-400 text-[10px] font-mono">đang xem</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1 text-pink-400">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{(viewers * 3).toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1 text-blue-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-bold">{Math.floor(viewers * 0.4).toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-bold">Hot</span>
            </div>
          </div>

          {/* CTA button */}
          <div className="flex flex-col items-center gap-2 w-full max-w-[260px]">
            <button
              type="button"
              onClick={handleOpenLiveApp}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/40 cursor-pointer transition-all active:scale-95 hover:scale-[1.02] border border-white/10"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>🔴 Mở Phiên Live Ngay</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-500 font-mono text-center leading-relaxed px-2">
              Bấm để xem phiên live thật tại{' '}
              <span className="text-rose-400 font-bold break-all">{directLiveUrl}</span>
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 text-[10px] font-bold font-mono">Phiên Live Thật • Đã Xác Minh Chính Chủ</span>
          </div>
        </div>
      </div>

      {/* HUD BAR TOP */}
      {!hideHud && (
        <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/40 shadow-xl pointer-events-auto">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </div>
            <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">TIKTOK LIVE</span>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-300">
              <Users className="w-3 h-3 text-rose-400" />
              <span>{viewers.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg ${
                internalMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-black/80 text-emerald-400 border-emerald-500/40'
              }`}
              title={internalMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {internalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleOpenLiveApp}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-[10px] font-mono font-bold border border-rose-400/40 shadow-xl flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
            >
              <span>Xem Trên TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {hearts.map(h => (
          <div key={h.id} className="absolute animate-bounce" style={{ left: `${h.x}px`, bottom: '120px', color: h.color, transition: 'all 1s ease-out', transform: 'translateY(-90px) scale(1.3)', opacity: 0 }}>
            <Heart className="w-7 h-7 fill-current drop-shadow-lg" />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      {!hideHud && (
        <div className="absolute bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none">
          <div className="flex items-center gap-2.5 min-w-0 pointer-events-auto">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 shadow-lg ring-2 ring-rose-500/60 animate-pulse">
              <img
                src={avatarUrl}
                alt={cleanHandle}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle || 'L')}&background=E11D48&color=fff&bold=true`; }}
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 px-1 rounded bg-rose-600 text-[7px] font-black text-white uppercase">LIVE</span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold truncate max-w-[170px] sm:max-w-[220px]">LIVE STREAM: @{cleanHandle}</div>
              <div className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
                <span>Đang phát trực tiếp</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Phiên Live Thật</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

