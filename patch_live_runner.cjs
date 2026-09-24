const fs = require('fs');
let code = fs.readFileSync('src/components/modals/LivestreamRunnerModal.tsx', 'utf8');

// 1. Add states for pending action
code = code.replace(
  'const [isTabInactive, setIsTabInactive] = useState<boolean>(false);',
  `const [isTabInactive, setIsTabInactive] = useState<boolean>(false);
  const [pendingFraudAction, setPendingFraudAction] = useState<'comment' | 'share' | 'eye' | null>(null);
  const [pendingActionStartTime, setPendingActionStartTime] = useState<number>(0);`
);

// 2. Modify visibility hook to check pending actions
const visibilityRegex = /useEffect\(\(\) => \{\n    if \(\!isLiveRunnerOpen \|\| \!activeLiveTask \|\| isCompletedMission\) return;\n\n    const timer = setInterval\(\(\) => \{\n      \/\/ Đóng băng toàn bộ đồng hồ/s;

// Wait, Livestream uses a big setInterval for everything.
// Let's just hook into visibilitychange!
const addVisibilityHook = `
  useEffect(() => {
    if (!isLiveRunnerOpen || !activeLiveTask) return;
    const handleVisibilityChange = () => {
      const isHidden = typeof document !== 'undefined' && (document.hidden || (typeof document.hasFocus === 'function' && !document.hasFocus()));
      
      if (!isHidden && pendingFraudAction && activeLiveTask) {
        const timeSpentAway = Date.now() - pendingActionStartTime;
        let requiredTime = 4000;
        let actionName = 'Thao tác';
        if (pendingFraudAction === 'comment') { requiredTime = 8000; actionName = 'Bình luận'; }
        if (pendingFraudAction === 'share') { requiredTime = 5000; actionName = 'Chia sẻ'; }
        
        if (timeSpentAway < requiredTime) {
           triggerImmediateFraudAlert({
             title: 'PHÁT HIỆN GIAN LẬN',
             reason: \`Thời gian thao tác quá nhanh (\${(timeSpentAway/1000).toFixed(1)}s). Bạn phải MỞ TIKTOK và \${actionName} để nhận xu!\`,
             anomalyType: 'BOT_SPEED_DETECTED',
             channelHandle: activeLiveTask.channelHandle,
             penaltyPoints: 10
           });
        } else {
           if (pendingFraudAction === 'comment' && !claimedCommentReward) {
             setClaimedCommentReward(true);
             interactWithLiveBroadcast(activeLiveTask.id, 'comment');
             showToast('💬 Đã gửi bình luận seeding! Nhận ngay +350 Xu thưởng.');
           } else if (pendingFraudAction === 'share' && !claimedShareReward) {
             setClaimedShareReward(true);
             interactWithLiveBroadcast(activeLiveTask.id, 'share');
             showToast('🚀 Đã chia sẻ phòng Live! Nhận ngay +300 Xu.');
           }
        }
        setPendingFraudAction(null);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isLiveRunnerOpen, pendingFraudAction, pendingActionStartTime, activeLiveTask, claimedCommentReward, claimedShareReward, interactWithLiveBroadcast, triggerImmediateFraudAlert]);
`;

code = code.replace('// Main tick loop', addVisibilityHook + '\n\n  // Main tick loop');

// 3. Update handlers
const shareRegex = /const handleShareLive = \(e\: React\.MouseEvent\) => \{.*?\};\n/s;
const newShare = `const handleShareLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!claimedShareReward) {
      setPendingFraudAction('share');
      setPendingActionStartTime(Date.now());
      window.open(activeLiveTask?.targetUrl || \`https://www.tiktok.com/@\${activeLiveTask?.channelHandle}/live\`, '_blank', 'noopener,noreferrer');
    } else {
      showToast('🚀 Đã mở chia sẻ phòng Live!');
    }
  };\n`;
code = code.replace(shareRegex, newShare);

const chatRegex = /const handleSendChat = \(e\: React\.FormEvent\) => \{.*?\};\n/s;
const newChat = `const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeLiveTask) return;
    const msg = inputMsg.trim();
    
    // ĐÓNG BĂNG 60 LỚP: BẮT BUỘC COPY VÀ MỞ TIKTOK ĐỂ DÁN
    navigator.clipboard.writeText(msg).catch(() => {});
    
    setChatMessages(prev => [...prev, \`\${user.name}: \${msg}\`]);
    setInputMsg('');
    setIdleSeconds(0);
    syncTikTokComment(activeLiveTask.id, msg, user.tiktokConnected || user.email || '@user');

    if (!claimedCommentReward) {
      setPendingFraudAction('comment');
      setPendingActionStartTime(Date.now());
      showToast('Đã Copy bình luận! Đang mở TikTok, vui lòng DÁN (Paste) bình luận vào phiên LIVE nhé.');
      window.open(activeLiveTask.targetUrl || \`https://www.tiktok.com/@\${activeLiveTask.channelHandle}/live\`, '_blank', 'noopener,noreferrer');
    }
  };\n`;
code = code.replace(chatRegex, newChat);

fs.writeFileSync('src/components/modals/LivestreamRunnerModal.tsx', code);
console.log('Patched livestream runner!');
