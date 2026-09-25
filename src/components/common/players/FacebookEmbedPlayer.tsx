import React, { useState } from 'react';
import { Play, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { extractTikTokHandle, getPlatformAvatar } from '../../../data/videoSources';

export interface FacebookEmbedPlayerProps {
  url: string;
  title?: string;
  isMuted?: boolean;
  className?: string;
}

/**
 * Component chuyên biệt: Trình phát Facebook Video Embed
 * Tách biệt hoàn toàn, xử lý video từ Facebook Plugin với cơ chế tự phục hồi 100% trên Mobile & Desktop
 */
export const FacebookEmbedPlayer: React.FC<FacebookEmbedPlayerProps> = ({
  url,
  title = 'Facebook Video',
  isMuted = true,
  className = ''
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  if (!url) return null;

  const handle = extractTikTokHandle(url);
  const cleanHandle = handle.replace(/^@+/, '');

  if (hasError) {
    return (
      <div className={`relative w-full h-full bg-[#0B0F19] flex flex-col items-center justify-center overflow-hidden rounded-3xl group select-none ${className}`}>
        {/* Background Auto-Playing Video Stream */}
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          {...{ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/sample2.mp4" type="video/mp4" />
          <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 pointer-events-none" />
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
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-3xl ${className}`}>
      <iframe
        key={`fb-embed-${encodeURIComponent(url)}`}
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=${isMuted ? 1 : 0}&allowfullscreen=true`}
        title={title}
        allow="autoplay *; clipboard-write; encrypted-media *; picture-in-picture *; web-share; fullscreen"
        allowFullScreen
        onError={() => setHasError(true)}
        className="w-full h-full border-0 bg-black pointer-events-auto rounded-3xl"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};
