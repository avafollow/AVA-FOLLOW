import React from "react";

export interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showText = true,
  showSubtitle = false,
  subtitleText = "KẾT NỐI • TĂNG TRƯỞNG • BỨT PHÁ",
  className = "",
  textClassName = "",
  onClick = () => { window.location.href = '/'; }
}) => {
  // Size config
  const sizeMap = {
    xs: {
      wrapper: "h-7 w-7",
      img: "h-6 w-6",
      title: "text-sm",
      sub: "text-[8px]",
      badge: "text-[8px] px-1 py-0.1"
    },
    sm: {
      wrapper: "h-9 w-9",
      img: "h-8 w-8",
      title: "text-base",
      sub: "text-[9px]",
      badge: "text-[9px] px-1.5 py-0.2"
    },
    md: {
      wrapper: "h-11 w-11",
      img: "h-10 w-10",
      title: "text-lg sm:text-xl",
      sub: "text-[10px]",
      badge: "text-[10px] px-2 py-0.5"
    },
    lg: {
      wrapper: "h-14 w-14",
      img: "h-13 w-13",
      title: "text-2xl sm:text-3xl",
      sub: "text-xs",
      badge: "text-xs px-2.5 py-0.5"
    },
    xl: {
      wrapper: "h-20 w-20",
      img: "h-18 w-18",
      title: "text-3xl sm:text-4xl",
      sub: "text-sm",
      badge: "text-xs px-3 py-1"
    },
    "2xl": {
      wrapper: "h-28 w-28",
      img: "h-26 w-26",
      title: "text-4xl sm:text-5xl",
      sub: "text-base",
      badge: "text-sm px-3.5 py-1"
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer hover:opacity-95 transition-opacity ${className}`}
    >
      {/* 3D Circular Emblem with Multi-Layer Neon Glowing Aura */}
      <div className="relative shrink-0 flex items-center justify-center group">
        {/* Ambient Outer Neon Breathing Blur */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-[#FF0050] to-[#00F2FE] blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
        
        {/* Gold & Neon Border Ring */}
        <div className={`relative ${currentSize.wrapper} rounded-full p-[2px] bg-gradient-to-tr from-[#FFD700] via-[#FF007A] to-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.5),0_0_12px_rgba(255,215,0,0.4)] ring-1 ring-amber-300/60 overflow-hidden flex items-center justify-center`}>
          <img
            src="/ava-full-logo.png"
            alt="AVA FOLLOW Logo"
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`flex flex-col min-w-0 ${textClassName}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`${currentSize.title} font-black tracking-wider uppercase font-display leading-none flex items-center gap-1.5`}>
              <span className="bg-gradient-to-r from-[#FFE259] via-[#FFA751] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.55)]">
                AVA
              </span>
              <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,242,254,0.7)] tracking-widest">
                FOLLOW
              </span>
            </span>
          </div>

          {showSubtitle && (
            <p className={`${currentSize.sub} font-mono tracking-tight text-slate-300 font-semibold mt-1 truncate max-w-xs sm:max-w-md`}>
              {subtitleText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
