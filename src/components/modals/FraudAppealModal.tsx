import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  Info,
  Scale
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FraudAppealRecord } from '../../types';

interface FraudAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTask?: {
    id: string;
    title: string;
    type?: string;
  } | null;
}

const PRESET_REASONS = [
  {
    key: 'network_lag',
    title: 'Mạng chập chờn / Độ trễ TikTok API',
    desc: 'Tôi đã thực hiện thao tác trên TikTok nhưng đường truyền bị lag hoặc máy chủ TikTok phản hồi trễ hơn 15 giây.',
    badge: 'Phổ Biến Nhất',
    icon: '🌐'
  },
  {
    key: 'private_account',
    title: 'Tài khoản TikTok đặt chế độ Riêng tư',
    desc: 'Kênh TikTok của tôi hoặc chủ shop đặt chế độ Private, yêu cầu chủ kênh duyệt nên số lượng Đang theo dõi tăng chậm.',
    badge: 'Chính Đáng',
    icon: '🔒'
  },
  {
    key: 'false_unfollow',
    title: 'Bị trừ Xu oan do TikTok quét nhầm',
    desc: 'Tôi không hề Hủy Follow (Unfollow). Kênh vẫn nằm trong danh sách Đang theo dõi trên app TikTok của tôi.',
    badge: 'Ưu Tiên Duyệt',
    icon: '🤖'
  },
  {
    key: 'browser_restriction',
    title: 'Trình duyệt chặn Cookie / Tracking',
    desc: 'Trình duyệt Safari/Chrome trên điện thoại chặn popup hoặc cookie chéo dẫn đến hệ thống chưa nhận diện kịp.',
    badge: 'Kỹ Thuật',
    icon: '📱'
  },
  {
    key: 'other',
    title: 'Lý do khác có bằng chứng xác thực',
    desc: 'Tôi có video quay màn hình hoặc ảnh chụp chứng minh đã hoàn thành đầy đủ yêu cầu của chiến dịch.',
    badge: 'Kèm Ảnh/Video',
    icon: '📝'
  }
];

export const FraudAppealModal: React.FC<FraudAppealModalProps> = ({
  isOpen,
  onClose,
  targetTask
}) => {
  const { user, fraudAppeals, submitFraudAppeal, showToast } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'policy'>('submit');
  const [selectedReason, setSelectedReason] = useState<string>('network_lag');
  const [customNote, setCustomNote] = useState<string>('');
  const [taskTitleInput, setTaskTitleInput] = useState<string>(targetTask?.title || '');
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const [newProofInput, setNewProofInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [agreeCommitment, setAgreeCommitment] = useState<boolean>(true);

  if (!isOpen) return null;

  // Filter user's appeals
  const userAppeals = (fraudAppeals || []).filter(
    a => a.userId === user.id || a.userEmail === user.email || a.userHandle === user.tiktokHandle
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 8 * 1024 * 1024) {
        showToast('⚠️ Kích thước file tối đa 8MB');
        continue;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProofUrls(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
    showToast('✓ Đã tải lên ảnh chụp bằng chứng xác thực');
  };

  const handleAddProofUrl = () => {
    if (!newProofInput.trim()) return;
    setProofUrls(prev => [...prev, newProofInput.trim()]);
    setNewProofInput('');
    showToast('✓ Đã thêm liên kết ảnh bằng chứng');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeCommitment) {
      showToast('⚠️ Vui lòng tích chọn cam kết tính trung thực của bằng chứng');
      return;
    }

    const matchedPreset = PRESET_REASONS.find(r => r.key === selectedReason);
    const reasonLabel = matchedPreset ? matchedPreset.title : 'Khiếu nại gian lận';

    setIsSubmitting(true);
    try {
      await submitFraudAppeal({
        userId: user.id || 'user_anon',
        userEmail: user.email || 'user@example.com',
        userHandle: user.tiktokHandle || '@me',
        taskId: targetTask?.id || `task_${Date.now()}`,
        taskTitle: taskTitleInput || targetTask?.title || 'Nhiệm vụ tương tác TikTok',
        taskType: targetTask?.type || 'follow',
        reasonCategory: selectedReason,
        reasonLabel,
        customNote: customNote.trim(),
        proofImageUrls: proofUrls
      });

      showToast('🎉 Đơn kháng cáo đã được gửi thành công! Ban Quản Trị sẽ xử lý trong 2-4h');
      setCustomNote('');
      setProofUrls([]);
      setActiveTab('history');
    } catch {
      showToast('❌ Có lỗi xảy ra khi gửi đơn khiếu nại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1422] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-slate-900 border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-display">
                  Trung Tâm Khiếu Nại & Kháng Cáo
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Minh Bạch 100%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bảo vệ quyền lợi Creator: Kháng cáo cảnh báo gian lận, trừ Xu oan hoặc lỗi mạng API
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'submit'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gửi Khiếu Nại Mới</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Lịch Sử Khiếu Nại ({userAppeals.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'policy'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quy Trình & SLA</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* TAB 1: SUBMIT NEW APPEAL */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Alert notice */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white">Quyền khiếu nại công bằng cho mọi thành viên</p>
                  <p className="text-slate-300">
                    Nếu bạn nhận được cảnh báo gian lận hoặc bị trừ Xu do hiểu nhầm/lỗi đường truyền, vui lòng chọn nguyên nhân phù hợp và đính kèm ảnh chụp màn hình chứng minh.
                  </p>
                </div>
              </div>

              {/* Related Task info */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Chiến dịch / Nhiệm vụ liên quan:</span>
                  <span className="text-[10px] text-cyan-400 font-normal">(Tự động nhận diện)</span>
                </label>
                <input
                  type="text"
                  value={taskTitleInput}
                  onChange={(e) => setTaskTitleInput(e.target.value)}
                  placeholder="Nhập tên kênh hoặc mã chiến dịch..."
                  className="w-full bg-[#161D2E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Preset Reason Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Chọn lý do khiếu nại (Gợi ý sẵn):</span>
                  <span className="text-[10px] text-slate-400">Chọn 1 lý do chính xác nhất</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason.key;
                    return (
                      <div
                        key={reason.key}
                        onClick={() => setSelectedReason(reason.key)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                            : 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="text-xl shrink-0 mt-0.5">{reason.icon}</div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                              {reason.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              isSelected ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/5 text-slate-400'
                            }`}>
                              {reason.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {reason.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed custom note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Mô tả chi tiết bổ sung (Không bắt buộc):</span>
                  <span className="text-[10px] text-slate-400">{customNote.length}/500 ký tự</span>
                </label>
                <textarea
                  value={customNote}
                  maxLength={500}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ghi rõ thời gian thực hiện, thiết bị đang dùng hoặc ghi chú thêm cho ban quản trị..."
                  rows={3}
                  className="w-full bg-[#161D2E] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Upload Proof Images */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Đính kèm hình ảnh bằng chứng (Khuyến nghị):</span>
                  <span className="text-[10px] text-cyan-400">Tối đa 5 ảnh chụp màn hình</span>
                </label>

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 py-3 px-4 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-bold text-cyan-300">
                    <Upload className="w-4 h-4" />
                    <span>Tải ảnh từ máy / điện thoại</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newProofInput}
                      onChange={(e) => setNewProofInput(e.target.value)}
                      placeholder="Hoặc dán URL ảnh..."
                      className="w-40 sm:w-48 bg-[#161D2E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddProofUrl}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Image Previews */}
                {proofUrls.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {proofUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/15 aspect-video bg-black/40">
                        <img src={url} alt={`proof_${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProofUrls(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Commitment Checkbox */}
              <div className="p-3.5 rounded-2xl bg-white/2 border border-white/5 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agree_commitment"
                  checked={agreeCommitment}
                  onChange={(e) => setAgreeCommitment(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="agree_commitment" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer">
                  Tôi xác nhận bằng chứng cung cấp là trung thực và chính xác. Tôi đồng ý khôi phục điểm uy tín và hoàn Xu tự động sau khi ban quản trị xác nhận.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeCommitment}
                  className="flex-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Gửi Khiếu Nại...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>GỬI ĐƠN KHÁNG CÁO NGAY</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: APPEAL HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {userAppeals.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Bạn chưa có đơn khiếu nại nào</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Tài khoản của bạn hiện đang có độ tin cậy tuyệt đối và không bị cảnh báo vi phạm nào.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs transition-colors"
                  >
                    Tạo Đơn Khiếu Nại Mới
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAppeals.map((appeal) => {
                    const statusConfig = {
                      pending: { label: 'Đang Tiếp Nhận', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Clock },
                      under_review: { label: 'Đang Đối Soát', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: RefreshCw },
                      approved: { label: 'Đã Chấp Thuận & Hoàn Xu', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
                      rejected: { label: 'Từ Chối Khiếu Nại', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: AlertTriangle }
                    }[appeal.status] || { label: appeal.status, color: 'bg-white/10 text-slate-300 border-white/10', icon: Info };

                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={appeal.id}
                        className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-3 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                {appeal.taskTitle || 'Nhiệm vụ tương tác'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{appeal.id.slice(-6)}
                              </span>
                            </div>
                            <p className="text-[11px] text-cyan-300 font-medium">
                              Lý do: {appeal.reasonLabel}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shrink-0 ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{statusConfig.label}</span>
                          </span>
                        </div>

                        {appeal.customNote && (
                          <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-xl border border-white/5">
                            "{appeal.customNote}"
                          </p>
                        )}

                        {appeal.proofImageUrls && appeal.proofImageUrls.length > 0 && (
                          <div className="flex items-center gap-2 overflow-x-auto py-1">
                            {appeal.proofImageUrls.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt="proof"
                                className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5 font-mono">
                          <span>Gửi lúc: {new Date(appeal.submittedAt).toLocaleString('vi-VN')}</span>
                          {appeal.compensationXu && appeal.compensationXu > 0 && (
                            <span className="text-emerald-400 font-bold">
                              + {appeal.compensationXu.toLocaleString()} Xu bồi hoàn
                            </span>
                          )}
                        </div>

                        {appeal.reviewerNote && (
                          <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 space-y-0.5">
                            <span className="font-bold block text-[11px]">Phản hồi từ Ban Quản Trị:</span>
                            <p className="text-[11px]">{appeal.reviewerNote}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POLICY & TRANSPARENCY */}
          {activeTab === 'policy' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Quy Trình Đối Soát Kỹ Thuật 2 Chiều
                </h4>
                <p>
                  Hệ thống kiểm toán của AVA FOLLOW vận hành cơ chế so khớp delta 2 chiều giữa Người làm nhiệm vụ (Worker) và Chủ Shop (Creator). Mọi hành động đều được lưu vết minh bạch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/2 border border-white/5 space-y-1.5">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>SLA Xử Lý 2-4h</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Đội ngũ kỹ thuật túc trực xem xét và phản hồi đơn kháng cáo tối đa trong 4 giờ làm việc.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/2 border border-white/5 space-y-1.5">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Hoàn Xu 100%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Nếu phát hiện lỗi mạng hoặc quét nhầm, bạn sẽ được hoàn 100% Xu thưởng cùng điểm Uy Tín.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/2 border border-white/5 space-y-1.5">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Bảo Vệ Chủ Kênh</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ngân sách của chủ chiến dịch luôn được ký quỹ an toàn, chỉ trừ tiền khi hành động đã đối soát thành công.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                <h5 className="font-bold text-white">Các trường hợp được Chấp thuận Khiếu nại ngay:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Đính kèm ảnh chụp màn hình nút "Đang Follow" / "Đã Thả Tim" trên app TikTok.</li>
                  <li>TikTok cập nhật API chậm dẫn đến biến động số liệu Đang theo dõi trễ.</li>
                  <li>Kênh chiến dịch bị TikTok hạn chế hoặc tài khoản chủ shop đặt riêng tư.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
