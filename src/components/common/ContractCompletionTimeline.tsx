import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Lock, 
  Video, 
  Check, 
  Hourglass,
  FileCheck2,
  RotateCcw,
  Star
} from 'lucide-react';
import { EscrowBookingContract } from '../../types';

interface ContractCompletionTimelineProps {
  contract: EscrowBookingContract;
  compact?: boolean;
  onOpenExtensionModal?: (contract: EscrowBookingContract) => void;
  onOpenIncidentModal?: (contract: EscrowBookingContract) => void;
}

export const ContractCompletionTimeline: React.FC<ContractCompletionTimelineProps> = ({
  contract,
  compact = false,
  onOpenExtensionModal,
  onOpenIncidentModal
}) => {
  // Determine completion progress percentage & milestone states
  let progressPercent = 25;
  let statusColor = 'from-purple-500 to-indigo-500';
  let statusBadgeBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  let statusText = 'Đang trong tiến độ cam kết';
  let countdownText = `Thời hạn bàn giao: ${contract.deadlineDays || 3} ngày`;

  switch (contract.status) {
    case 'escrow_locked':
      progressPercent = 25;
      statusColor = 'from-blue-500 to-cyan-500';
      statusBadgeBg = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      statusText = 'Đã Khóa 100% Cọc Trong Két • Chờ KOC Nhận Việc';
      countdownText = `Thời hạn thực hiện: ${contract.deadlineDays || 3} ngày kể từ khi nhận`;
      break;

    case 'in_progress':
      progressPercent = 55;
      statusColor = 'from-amber-500 via-purple-500 to-indigo-500';
      statusBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      statusText = 'KOC Đang Sản Xuất Video';
      countdownText = `Hạn chót nộp video demo: Còn ${contract.deadlineDays || 2} ngày`;
      break;

    case 'demo_submitted':
      progressPercent = 85;
      statusColor = 'from-purple-500 via-pink-500 to-emerald-500';
      statusBadgeBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      statusText = 'Giai Đoạn Bảo Hành & Nghiệm Thu 72 Giờ';
      const hoursLeft = contract.autoReleaseHoursLeft !== undefined ? contract.autoReleaseHoursLeft : 68;
      countdownText = `Thời gian đối soát còn lại: ${hoursLeft} giờ (Hệ thống tự động giải ngân khi hết giờ)`;
      break;

    case 'disbursed':
      progressPercent = 100;
      statusColor = 'from-emerald-500 to-teal-400';
      statusBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      statusText = 'Đã Nghiệm Thu Hoàn Tất & Giải Ngân 100%';
      countdownText = contract.disbursedAt ? `Tất toán thành công (${contract.disbursedAt})` : 'Đã tất toán và giải ngân đúng hẹn';
      break;

    case 'disputed':
      progressPercent = 50;
      statusColor = 'from-rose-500 to-red-600';
      statusBadgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      statusText = 'Tạm Dừng Tiến Độ - Hội Đồng Trọng Tài Sàn Phân Xử';
      countdownText = 'Đang thụ lý giải quyết bảo vệ quyền lợi 3 bên';
      break;

    default:
      progressPercent = 25;
      break;
  }

  // Milestones definition
  const milestones = [
    {
      step: 1,
      title: 'Ký HĐ & Khóa Cọc',
      sub: contract.createdAt || 'Đã ký',
      isCompleted: true,
      isCurrent: contract.status === 'escrow_locked',
      icon: Lock
    },
    {
      step: 2,
      title: 'Sản Xuất Video',
      sub: contract.status === 'escrow_locked' ? 'Chờ KOC' : (contract.status === 'in_progress' ? 'Đang quay dựng' : 'Đã nộp demo'),
      isCompleted: ['in_progress', 'demo_submitted', 'disbursed'].includes(contract.status),
      isCurrent: contract.status === 'in_progress',
      icon: Video
    },
    {
      step: 3,
      title: 'Bảo Hành 72 Giờ',
      sub: contract.status === 'demo_submitted' ? `${contract.autoReleaseHoursLeft || 68}h còn lại` : (contract.status === 'disbursed' ? 'Đã đạt chuẩn' : 'Chờ nghiệm thu'),
      isCompleted: contract.status === 'disbursed',
      isCurrent: contract.status === 'demo_submitted',
      icon: ShieldCheck
    },
    {
      step: 4,
      title: 'Giải Ngân 80/20',
      sub: contract.status === 'disbursed' ? 'Hoàn tất' : 'KOC 80% • Sàn 20%',
      isCompleted: contract.status === 'disbursed',
      isCurrent: false,
      icon: FileCheck2
    }
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900/95 via-[#0b101f] to-slate-900/95 border border-purple-500/30 space-y-3 shadow-inner">
      {/* Header Info: Label, Badge & Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-display">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Tiến Độ Thực Hiện Hợp Đồng:</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${statusBadgeBg}`}>
            {contract.status === 'disbursed' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : contract.status === 'disputed' ? (
              <AlertTriangle className="w-3 h-3 text-rose-400" />
            ) : (
              <Hourglass className="w-3 h-3 text-amber-400" />
            )}
            <span>{statusText}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="font-semibold">{countdownText}</span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 rounded-full bg-slate-800/90 border border-white/5 overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${statusColor} transition-all duration-700 ease-out relative`}
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <span>Bắt đầu:</span>
            <strong className="text-slate-300">{contract.createdAt}</strong>
          </div>
          <div className="flex items-center gap-1 text-purple-300 font-bold">
            <span>Tiến độ hoàn thành:</span>
            <span className="text-amber-400">{progressPercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Hạn hoàn thành:</span>
            <strong className="text-slate-300">
              {contract.deliveryDeadlineDate || `${contract.deadlineDays || 3} ngày`}
            </strong>
          </div>
        </div>
      </div>

      {/* SPECIAL ALERT: Pending Extension Request */}
      {contract.extensionStatus === 'pending' && (
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Clock className="w-4 h-4 animate-spin shrink-0 text-amber-400" />
            <span>
              <strong>KOC ĐANG XIN GIA HẠN THÊM +{contract.extensionDays} NGÀY:</strong> "{contract.extensionReason}"
            </span>
          </div>
          {onOpenExtensionModal && (
            <button
              onClick={() => onOpenExtensionModal(contract)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 font-display cursor-pointer"
            >
              Phản Hồi Đồng Thuận
            </button>
          )}
        </div>
      )}

      {/* SPECIAL ALERT: Frozen Escrow Vault */}
      {contract.freezeStatus && contract.freezeStatus !== 'none' && (
        <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center gap-2 text-xs text-blue-300">
          <Lock className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>LỆNH NIÊM PHONG TIỀN CỌC ĐANG BẬT:</strong> Hệ thống tạm dừng đếm ngược 72h tự động giải ngân. Tiền đang được bảo vệ an toàn 100% trong két Sàn. Lý do: "{contract.freezeReason || 'Đang đối soát'}".
          </span>
        </div>
      )}

      {/* SPECIAL ALERT: Revision Requested */}
      {contract.revisionCount && contract.revisionCount > 0 && contract.status === 'in_progress' && (
        <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center gap-2 text-xs text-purple-300">
          <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>ĐANG CHỈNH SỬA VIDEO (Lần {contract.revisionCount}/2):</strong> KOC đang tiếp thu ý kiến và quay dựng lại: "{contract.revisionNote}".
          </span>
        </div>
      )}

      {/* SPECIAL BADGE: Rating & Review Result */}
      {contract.status === 'disbursed' && contract.clientRating && (
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="font-bold flex items-center gap-0.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {contract.clientRating}/5 Sao:
            </span>
            <span className="italic truncate max-w-md">"{contract.clientReview}"</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 shrink-0 font-bold">
            ✓ Đã Nghiệm Thu &amp; Nhận Đủ 80%
          </span>
        </div>
      )}

      {/* 4 Step Milestones Tracker */}
      {!compact && (
        <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.step}
                className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${
                  m.isCurrent
                    ? 'bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-900/20'
                    : m.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                  m.isCurrent
                    ? 'bg-purple-600 text-white animate-pulse'
                    : m.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {m.isCompleted && !m.isCurrent ? <Check className="w-3.5 h-3.5" /> : m.step}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-white truncate font-display">{m.title}</div>
                  <div className="text-[9px] text-slate-400 truncate font-mono">{m.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3-Party Protection & Security Guarantee Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>Bảo mật chữ ký số SHA-256 • 100% tiền cọc khóa trong két Sàn</span>
        </div>
        <div className="text-amber-400/90 font-semibold">
          Cam kết quyền lợi 3 bên: Bên Thuê (Brand) ↔ KOC 80% ↔ Sàn 20% Phí Bảo Chứng
        </div>
      </div>
    </div>
  );
};
