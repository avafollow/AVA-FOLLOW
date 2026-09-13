import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Trophy, CheckCircle2, Award, Heart, Share2, Copy, Volume2, VolumeX, Flame, ArrowRight, Zap, Check, X } from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export interface CongratulationData {
  title: string;
  subtitle?: string;
  message: string;
  rewardText?: string;
  badge?: string;
  type?: 'mission' | 'all_clear' | 'escrow_payout' | 'rank_up' | 'streak' | 'lucky_wheel';
}

interface FireworksCongratulationModalProps {
  data: CongratulationData | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  decay: number;
  gravity: number;
  isGlitter?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

export const FireworksCongratulationModal: React.FC<FireworksCongratulationModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const { user, showToast, affiliateData } = useTikTokApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const [displaySuffix, setDisplaySuffix] = useState<string>('');
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number>(2);

  // Referral URL and Code
  const refCode = affiliateData?.refCode || (user?.handle ? user.handle.replace('@', '').toUpperCase() : 'PRO888');
  const refLink = affiliateData?.refLink || `${window.location.origin}?ref=${refCode}`;

  // Tự động tắt sau 2 giây theo yêu cầu của user
  useEffect(() => {
    if (!isOpen) return;
    setAutoCloseCountdown(2);

    const countdownTimer = setInterval(() => {
      setAutoCloseCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [isOpen, onClose]);

  // Web Audio API Synthesizer celebration
  const playCelebrationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Arpeggio fanfare: C5, E5, G5, C6, E6
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.5);
      });

      // Bass boom for fireworks burst
      setTimeout(() => {
        try {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(150, ctx.currentTime);
          bassOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);

          bassGain.gain.setValueAtTime(0.35, ctx.currentTime);
          bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);
          bassOsc.start();
          bassOsc.stop(ctx.currentTime + 0.55);
        } catch (e) {
          // ignore audio catch
        }
      }, 350);

      // Coin jingling chimes
      setTimeout(() => {
        try {
          [1400, 1750, 2100].forEach((f, i) => {
            const chime = ctx.createOscillator();
            const cGain = ctx.createGain();
            chime.type = 'sine';
            chime.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
            cGain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
            cGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
            chime.connect(cGain);
            cGain.connect(ctx.destination);
            chime.start(ctx.currentTime + i * 0.08);
            chime.stop(ctx.currentTime + i * 0.08 + 0.35);
          });
        } catch (e) {
          // ignore
        }
      }, 650);

    } catch (e) {
      // AudioContext might require user gesture in some browsers
    }
  };

  // Trigger celebration sound on open
  useEffect(() => {
    if (isOpen) {
      playCelebrationSound();
    }
  }, [isOpen]);

  // Extract number from rewardText and animate count up
  useEffect(() => {
    if (!isOpen || !data?.rewardText) {
      setDisplayCount(null);
      return;
    }

    // Match numbers like 500, 1000, 2000, 50000...
    const numMatch = data.rewardText.replace(/,/g, '').replace(/\./g, '').match(/\d+/);
    if (numMatch) {
      const targetNum = parseInt(numMatch[0], 10);
      const suffix = data.rewardText.replace(/[\d,.\s+-]/g, '').trim();
      setDisplaySuffix(suffix || 'Xu');

      let current = 0;
      const step = Math.max(1, Math.floor(targetNum / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= targetNum) {
          setDisplayCount(targetNum);
          clearInterval(interval);
        } else {
          setDisplayCount(current);
        }
      }, 35);

      return () => clearInterval(interval);
    } else {
      setDisplayCount(null);
    }
  }, [isOpen, data?.rewardText]);

  // Canvas Fireworks System
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const palette = [
      '#FF0055', '#FF3366', '#FF9900', '#FFCC00', '#00FF66',
      '#00F2FE', '#7928CA', '#FF0080', '#FFFFFF', '#FFD700', '#4E65FF'
    ];

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const createBurst = (x: number, y: number, burstColor?: string) => {
      const count = 70 + Math.floor(Math.random() * 40);
      const c1 = burstColor || palette[Math.floor(Math.random() * palette.length)];
      const c2 = palette[Math.floor(Math.random() * palette.length)];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 7 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.45 ? c1 : c2,
          radius: Math.random() * 3 + 1.5,
          decay: Math.random() * 0.018 + 0.012,
          gravity: 0.075,
          isGlitter: Math.random() > 0.75,
        });
      }
    };

    // Initial volley
    createBurst(width * 0.3, height * 0.35);
    createBurst(width * 0.7, height * 0.35);
    createBurst(width * 0.5, height * 0.22, '#FFD700');

    let lastRocketTime = Date.now();
    const render = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const now = Date.now();

      // Launch rockets from bottom periodically
      if (now - lastRocketTime > 380) {
        lastRocketTime = now;
        rockets.push({
          x: width * 0.15 + Math.random() * (width * 0.7),
          y: height,
          targetY: height * 0.18 + Math.random() * (height * 0.35),
          vy: -(Math.random() * 5 + 11),
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.08;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= -1) {
          createBurst(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.982;
        p.vy *= 0.982;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (p.isGlitter ? (Math.random() * 1.5 + 0.5) : 1), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = p.isGlitter ? 16 : 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Copy Viral Share Message
  const handleCopyViralShare = () => {
    const rewardNotice = data?.rewardText ? `vừa săn được "${data.rewardText}"` : 'vừa lập chiến tích xuất sắc';
    const textToCopy = `🔥 CHÚC MỪNG CHIẾN THẮNG! Tôi ${rewardNotice} trên AVA FOLLOW!\n👉 Tham gia ngay cùng tôi để nhận +1.000 Xu chào mừng và 1 lượt quay may mắn miễn phí:\n${refLink}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      showToast('🎉 Đã sao chép link & lời nhắn! Gửi ngay cho bạn bè để nhận thêm hoa hồng đại lý lên đến 35%!');
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      showToast('Đã sao chép liên kết chia sẻ!');
    });
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background Canvas for Fireworks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Modal Card Content */}
      <div
        className="relative z-20 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#180d24] via-[#0e1222] to-[#07090e] border-2 border-amber-400/90 shadow-[0_0_90px_rgba(251,191,36,0.45)] p-5 sm:p-7 text-center space-y-4 animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Buttons: Auto-close badge, Sound Toggle & Explicit Close Button */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-amber-400/30">
            Tự tắt sau {autoCloseCountdown}s
          </span>
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playCelebrationSound();
            }}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={onClose}
            title="Đóng ngay"
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Celestial Glow with Rotating Sunburst Rays */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none opacity-30 animate-spin" style={{ animationDuration: '24s' }}>
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'repeating-conic-gradient(from 0deg, rgba(251, 191, 36, 0.4) 0deg 15deg, transparent 15deg 30deg)'
            }}
          />
        </div>

        {/* Top Trophy Icon with Golden Badge */}
        <div className="flex flex-col items-center justify-center space-y-2 relative pt-2">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-300 p-1 shadow-[0_0_40px_rgba(245,158,11,0.7)] animate-bounce">
              <div className="w-full h-full rounded-[20px] bg-slate-950 flex items-center justify-center text-amber-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />
                {data.type === 'escrow_payout' ? (
                  <Award className="w-11 h-11 text-amber-300" />
                ) : data.type === 'rank_up' ? (
                  <Trophy className="w-11 h-11 text-yellow-300" />
                ) : (
                  <Sparkles className="w-11 h-11 text-amber-400 fill-amber-400 animate-pulse" />
                )}
              </div>
            </div>
            
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-[10px] font-mono font-black border border-white/30 shadow-lg whitespace-nowrap">
              🎆 PHÁO HOA ĂN MỪNG 🎆
            </span>
          </div>

          {data.badge && (
            <div className="pt-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 text-amber-300 border border-amber-400/40 shadow-sm inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{data.badge}</span>
              </span>
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-display tracking-tight leading-snug">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-xs sm:text-sm font-mono text-amber-300 font-bold">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Animated Reward Display Box */}
        {data.rewardText && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border-2 border-amber-400/50 shadow-inner relative overflow-hidden group">
            <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1 flex items-center justify-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PHẦN THƯỞNG THỰC NHẬN VÀO TÀI KHOẢN</span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-mono tracking-tight animate-pulse">
              {displayCount !== null ? (
                <>
                  +{displayCount.toLocaleString('vi-VN')} {displaySuffix}
                </>
              ) : (
                data.rewardText
              )}
            </div>

            <p className="text-[10px] text-emerald-400 font-mono mt-1">
              ✓ Đã cộng trực tiếp vào ví tài khoản • Tỷ lệ quy đổi 1 Xu = 1 VNĐ
            </p>
          </div>
        )}

        {/* Inspirational Message */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 font-display">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Lời Chúc Mừng Từ Ban Quản Trị AvaLive:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
            "{data.message}"
          </p>
        </div>

        {/* Viral Share & Bragging Engine */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-display">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Khoe Chiến Tích &amp; Bật Hoa Hồng Lên Đến 35%</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              MÃ: {refCode}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            Chia sẻ chiến tích này để rủ bạn bè cùng tham gia. Mỗi người đăng ký bạn nhận ngay <strong>+5.000 Xu</strong> và hưởng hoa hồng đại lý ghi nhận an toàn vào ví!
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleCopyViralShare}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>ĐÃ SAO CHÉP THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>SAO CHÉP LINK KHOE BẠN BÈ</span>
                </>
              )}
            </button>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center transition-all"
              title="Chia sẻ lên Facebook"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-display"
          >
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>TUYỆT VỜI • TIẾP TỤC BÙNG NỔ!</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
