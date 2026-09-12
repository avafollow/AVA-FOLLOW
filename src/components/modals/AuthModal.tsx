import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Gift, 
  Flame
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginWithEmail } = useTikTokApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      setIsLoading(false);
      closeAuthModal();
    }, 800);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      loginWithEmail(email, name || 'Nhà Sáng Tạo AVA FOLLOW', tiktokHandle);
      setIsLoading(false);
      closeAuthModal();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-purple-900/30 overflow-hidden flex flex-col">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Brand Logo */}
        <div className="p-6 pb-4 text-center border-b border-slate-800/80 relative space-y-2.5">
          <div className="flex justify-center">
            <BrandLogo size="md" showSubtitle={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-600/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>TẶNG +5,000 XU KHI GIA NHẬP LẦN ĐẦU</span>
          </div>

          <p className="text-xs text-slate-400">
            Kết nối tài khoản để truy cập App Dashboard AVA FOLLOW tăng follow và kiếm tiền
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl mt-4 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          
          {/* 1-Click Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 shadow-lg shadow-white/10 hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Tiếp tục bằng Tài khoản Google (1 Chạm)</span>
          </button>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <div className="flex-1 h-px bg-slate-800" />
            <span>hoặc qua Email & Mật khẩu</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {activeTab === 'register' && (
              <>
                <div>
                  <label className="block text-slate-400 text-[11px] font-semibold mb-1">Họ & Tên</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] font-semibold mb-1">Kênh TikTok (@handle)</label>
                  <div className="relative">
                    <span className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono">@</span>
                    <input
                      type="text"
                      placeholder="kenhtiktokcuaban"
                      value={tiktokHandle}
                      onChange={(e) => setTiktokHandle(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Mật khẩu bảo mật</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang kết nối hệ sinh thái...</span>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Đăng Nhập Vào Bảng Điều Khiển' : 'Tạo Tài Khoản & Nhận +1,000 Xu'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guarantee Security */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cam kết bảo mật 100% tài khoản qua mã hóa Supabase Auth</span>
          </div>

        </div>
      </div>
    </div>
  );
};
