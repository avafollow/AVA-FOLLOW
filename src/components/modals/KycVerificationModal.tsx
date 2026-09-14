import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  User, 
  Building2, 
  Clock, 
  FileText,
  Lock,
  Sparkles,
  Camera
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, submitKyc } = useTikTokApp();

  const [fullName, setFullName] = useState(user.name || '');
  const [idNumber, setIdNumber] = useState(user.kycData?.idNumber || user.citizenId || '');
  const [dateOfBirth, setDateOfBirth] = useState(user.kycData?.dateOfBirth || '1995-08-15');
  const [bankName, setBankName] = useState(user.bankInfo?.bankName || 'MB Bank (Quân Đội)');
  const [bankAccountNumber, setBankAccountNumber] = useState(user.bankInfo?.accountNumber || '');
  const [bankAccountHolder, setBankAccountHolder] = useState(user.bankInfo?.accountHolder || user.name.toUpperCase());
  
  // Sample card image previews + Selfie
  const [frontCardPreview, setFrontCardPreview] = useState(user.kycData?.frontIdCardUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80');
  const [backCardPreview, setBackCardPreview] = useState(user.kycData?.backIdCardUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80');
  const [selfiePreview, setSelfiePreview] = useState(user.kycData?.selfiePhotoUrl || user.selfiePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const VIETNAM_BANKS = [
    'MB Bank (Quân Đội)',
    'Vietcombank (Ngoại Thương)',
    'Techcombank (Kỹ Thương)',
    'VPBank (Việt Nam Thịnh Vượng)',
    'ACB (Á Châu)',
    'BIDV (Đầu Tư & Phát Triển)',
    'TPBank (Tiên Phong)',
    'Ví MoMo (Rút qua SĐT)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !idNumber.trim() || !bankAccountNumber.trim() || !bankAccountHolder.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitKyc({
        userId: 'usr_001',
        userEmail: user.email || 'thienvuaapp@gmail.com',
        fullName: fullName.toUpperCase(),
        idNumber: idNumber.trim(),
        dateOfBirth,
        frontIdCardUrl: frontCardPreview,
        backIdCardUrl: backCardPreview,
        selfiePhotoUrl: selfiePreview,
        bankName,
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountHolder: bankAccountHolder.toUpperCase(),
        submittedAt: 'Vừa xong',
        status: 'pending',
        isCitizenIdUnique: true
      });
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1800);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0C101B] border border-rose-500/30 shadow-2xl shadow-rose-950/60 overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display">
                  Xác Minh Danh Tính Người Dùng (KYC Bắt Buộc)
                </h3>
                <FeatureGuideTooltip
                  title="Chính Sách KYC Chống Gian Lận & Rút Tiền"
                  description="Để đảm bảo 100% người dùng trên hệ thống là người thật, loại bỏ hoàn toàn bot spam tự động và chống rửa tiền, mọi lệnh rút tiền về ngân hàng đều yêu cầu xác minh danh tính."
                  steps={[
                    "Bước 1: Nhập họ tên và số CCCD / Hộ chiếu chính chủ",
                    "Bước 2: Tải ảnh chụp mặt trước và mặt sau thẻ căn cước",
                    "Bước 3: Nhập số tài khoản ngân hàng (tên tài khoản phải trùng với tên trên CCCD)",
                    "Bước 4: Nộp hồ sơ và chờ hệ thống/Admin xét duyệt trong 5 - 15 phút"
                  ]}
                  tips="Sau khi được duyệt 'Verified', bạn sẽ được mở khóa quyền rút tiền định kỳ và nhận ưu đãi giảm 20% phí giao dịch trên sàn."
                  badge="An Toàn 100% Người Thật"
                />
              </div>
              <p className="text-xs text-slate-400">
                Tuân thủ quy chuẩn an toàn tài chính & bảo vệ số dư tài khoản của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-slate-300">
          
          {/* Status Alert Banner */}
          {user.kycStatus === 'verified' ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">Tài Khoản Đã Xác Minh Danh Tính (KYC Verified)</h4>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Tài khoản của bạn đã được chứng thực 100% người thật. Bạn có toàn quyền rút tiền và giao dịch trên toàn hệ sinh thái.
                </p>
              </div>
            </div>
          ) : user.kycStatus === 'pending' ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-white text-sm">Hồ Sơ KYC Đang Chờ Xét Duyệt</h4>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Hệ thống đang đối soát thông tin của bạn. Thời gian xử lý dự kiến từ 5 - 15 phút. Bạn có thể cập nhật lại thông tin bên dưới nếu cần chỉnh sửa.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-xs">Yêu Cầu KYC Bắt Buộc Trước Khi Rút Tiền</h4>
                <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  Để ngăn chặn các trường hợp bot ảo spam hoặc rút tiền sai tài khoản, tên chủ thẻ ngân hàng nhận tiền <strong>phải trùng khớp</strong> với họ tên trên Căn cước công dân (CCCD).
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-400" />
                  <span>Họ & Tên Chính Chủ (CCCD):</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={user.kycStatus === 'verified'}
                  value={fullName}
                  onChange={(e) => !(user.kycStatus === 'verified') && setFullName(e.target.value)}
                  placeholder="NGUYEN VAN MINH"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-white font-mono uppercase transition-colors ${
                    user.kycStatus === 'verified'
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300 cursor-not-allowed opacity-90'
                      : 'bg-slate-900/90 border-white/10 focus:outline-none focus:border-rose-500'
                  }`}
                />
              </div>

              {/* ID Number */}
              <div className="space-y-1.5">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  <span>Số CCCD / CMND / Hộ Chiếu:</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={user.kycStatus === 'verified'}
                  value={idNumber}
                  onChange={(e) => !(user.kycStatus === 'verified') && setIdNumber(e.target.value)}
                  placeholder="001200088999"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-white font-mono transition-colors ${
                    user.kycStatus === 'verified'
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300 cursor-not-allowed opacity-90'
                      : 'bg-slate-900/90 border-white/10 focus:outline-none focus:border-rose-500'
                  }`}
                />
              </div>
            </div>

            {/* Row 2: Date of Birth & Bank Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ngày Sinh (Theo CCCD):</span>
                </label>
                <input
                  type="date"
                  required
                  disabled={user.kycStatus === 'verified'}
                  value={dateOfBirth}
                  onChange={(e) => !(user.kycStatus === 'verified') && setDateOfBirth(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-white font-mono transition-colors ${
                    user.kycStatus === 'verified'
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300 cursor-not-allowed opacity-90'
                      : 'bg-slate-900/90 border-white/10 focus:outline-none focus:border-rose-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ngân Hàng Nhận Tiền Chính Chủ:</span>
                </label>
                <select
                  value={bankName}
                  disabled={user.kycStatus === 'verified'}
                  onChange={(e) => !(user.kycStatus === 'verified') && setBankName(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-white transition-colors ${
                    user.kycStatus === 'verified'
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300 cursor-not-allowed opacity-90'
                      : 'bg-slate-900/90 border-white/10 focus:outline-none focus:border-rose-500'
                  }`}
                >
                  {VIETNAM_BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Account Number & Account Holder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-white">Số Tài Khoản Ngân Hàng:</label>
                <input
                  type="text"
                  required
                  disabled={user.kycStatus === 'verified'}
                  value={bankAccountNumber}
                  onChange={(e) => !(user.kycStatus === 'verified') && setBankAccountNumber(e.target.value)}
                  placeholder="999988886666"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-white font-mono transition-colors ${
                    user.kycStatus === 'verified'
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300 cursor-not-allowed opacity-90'
                      : 'bg-slate-900/90 border-white/10 focus:outline-none focus:border-rose-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white">Tên Chủ Tài Khoản (Phải trùng tên CCCD):</label>
                <input
                  type="text"
                  required
                  disabled={user.kycStatus === 'verified'}
                  value={bankAccountHolder}
                  onChange={(e) => !(user.kycStatus === 'verified') && setBankAccountHolder(e.target.value.toUpperCase())}
                  placeholder="NGUYEN VAN MINH"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-white font-mono uppercase transition-colors ${
                    user.kycStatus === 'verified'
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300 cursor-not-allowed opacity-90'
                      : 'bg-slate-900/90 border-white/10 focus:outline-none focus:border-rose-500'
                  }`}
                />
              </div>
            </div>

            {/* ID Card Photos Upload Previews */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white block">
                  Ảnh Chụp CCCD 2 Mặt & Ảnh Chụp Khuôn Mặt Chính Chủ (Rõ nét, không lóa sáng):
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  🛡️ 1 CCCD chỉ KYC 1 tài khoản
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Front Photo */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-slate-300 block font-mono">1. Mặt Trước CCCD</span>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                    <img src={frontCardPreview} alt="Front ID" className="w-full h-full object-cover" />
                    {user.kycStatus !== 'verified' ? (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[11px] font-mono gap-1">
                        <UploadCloud className="w-5 h-5 text-rose-400" />
                        <span>Đổi Ảnh Khác</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              setFrontCardPreview(url);
                            }
                          }} 
                        />
                      </label>
                    ) : (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã Duyệt
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Back Photo */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-slate-300 block font-mono">2. Mặt Sau CCCD</span>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                    <img src={backCardPreview} alt="Back ID" className="w-full h-full object-cover" />
                    {user.kycStatus !== 'verified' ? (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[11px] font-mono gap-1">
                        <UploadCloud className="w-5 h-5 text-rose-400" />
                        <span>Đổi Ảnh Khác</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              setBackCardPreview(url);
                            }
                          }} 
                        />
                      </label>
                    ) : (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã Duyệt
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selfie Face Photo */}
                <div className="p-3 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/80 border border-purple-500/30 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-purple-300 block font-mono flex items-center justify-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-pink-400" />
                    <span>3. Ảnh Selfie Khuôn Mặt</span>
                  </span>
                  <div className="relative h-28 rounded-xl overflow-hidden bg-black/40 border border-purple-500/30 group">
                    <img src={selfiePreview} alt="Ảnh selfie" className="w-full h-full object-cover" />
                    {user.kycStatus !== 'verified' ? (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[11px] font-mono gap-1">
                        <Camera className="w-5 h-5 text-pink-400" />
                        <span>Chụp / Đổi Selfie</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              setSelfiePreview(url);
                            }
                          }} 
                        />
                      </label>
                    ) : (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã Duyệt
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security Note */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200 flex items-start gap-2 font-mono">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Dữ liệu CCCD & hình ảnh cá nhân được mã hóa AES-256 an toàn tuyệt đối. Mỗi CCCD chỉ được đăng ký 01 tài khoản để chống bot gian lận.</span>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || submittedSuccess || user.kycStatus === 'verified'}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  user.kycStatus === 'verified'
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-lg shadow-rose-900/30 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    Đang Nộp Hồ Sơ KYC...
                  </span>
                ) : submittedSuccess ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã Nộp Hồ Sơ Thành Công!
                  </span>
                ) : user.kycStatus === 'verified' ? (
                  <span className="flex items-center gap-2 text-slate-300">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Hồ Sơ KYC Đã Được Phê Duyệt & Khóa Bảo Vệ
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Xác Nhận & Nộp Hồ Sơ KYC Xét Duyệt
                  </span>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
