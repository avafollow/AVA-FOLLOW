import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Flame,
  Crown,
  UserCheck
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useTikTokApp();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('admin');

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = (emailTarget?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(emailTarget);
      setIsLoading(false);
      closeAuthModal();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0F1424] to-[#0A0D18] border border-amber-500/40 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col p-6 sm:p-8 space-y-6">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Header with Brand Logo */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center">
            <BrandLogo size="md" showSubtitle={false} />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white uppercase font-display tracking-wide">
              Đăng Nhập AVA FOLLOW
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Hệ sinh thái kết nối người thật, tăng trưởng và kiếm tiền 24/7
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-600/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>TẶNG +5,000 XU KHI GIA NHẬP LẦN ĐẦU</span>
          </div>
        </div>

        {/* 2. Ô Kết Nối Google 1 Chạm Duy Nhất */}
        <div className="space-y-4 pt-1">
          {/* Main 1-Touch Google Button */}
          <button
            type="button"
            onClick={() => handleGoogleLogin(selectedRole === 'admin' ? 'quocthiencr90@gmail.com' : 'user@gmail.com')}
            disabled={isLoading}
            className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-950 font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-white/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-display disabled:opacity-50 ring-2 ring-white/50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoading ? 'Đang Kết Nối Google...' : 'KẾT NỐI GOOGLE (1 CHẠM)'}
            </span>
          </button>

          {/* Role selector pills for easy 1-touch test */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] text-slate-400 font-mono text-center uppercase tracking-wider">
              Chọn tài khoản kết nối nhanh:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  handleGoogleLogin('quocthiencr90@gmail.com');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Admin Quản Trị</div>
                  <div className="text-[9px] text-amber-300/80 font-mono truncate">quocthiencr90@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('user');
                  handleGoogleLogin('user@gmail.com');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  selectedRole === 'user'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 ring-1 ring-cyan-400/50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Người Dùng Thường</div>
                  <div className="text-[9px] text-cyan-300/80 font-mono truncate">user@gmail.com</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Security guarantee */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Bảo mật 100% qua Google OAuth &amp; Cơ sở dữ liệu Supabase</span>
        </div>

      </div>
    </div>
  );
};
