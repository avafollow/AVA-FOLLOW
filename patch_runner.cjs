const fs = require('fs');

let code = fs.readFileSync('src/components/modals/TikTokTaskRunnerModal.tsx', 'utf8');

// 1. Add states for pending action
code = code.replace(
  'const [isTabInactive, setIsTabInactive] = useState<boolean>(false);',
  `const [isTabInactive, setIsTabInactive] = useState<boolean>(false);
  const [pendingFraudAction, setPendingFraudAction] = useState<'follow' | 'like' | 'comment' | 'share' | null>(null);
  const [pendingActionStartTime, setPendingActionStartTime] = useState<number>(0);`
);

// 2. Modify visibility hook to check pending actions
const visibilityRegex = /useEffect\(\(\) => \{\n    if \(\!isRunnerOpen\) return;\n    const handleVisibilityChange.*?\}\;\n  \}, \[isRunnerOpen\]\);/s;

const newVisibilityHook = `useEffect(() => {
    if (!isRunnerOpen) return;
    const handleVisibilityChange = () => {
      const isHidden = typeof document !== 'undefined' && (document.hidden || (typeof document.hasFocus === 'function' && !document.hasFocus()));
      setIsTabInactive(isHidden);
      
      if (!isHidden && pendingFraudAction && runnerTask) {
        const timeSpentAway = Date.now() - pendingActionStartTime;
        let requiredTime = 4000; 
        let actionName = 'Follow';
        if (pendingFraudAction === 'comment') { requiredTime = 8000; actionName = 'Bình luận'; }
        if (pendingFraudAction === 'share') { requiredTime = 5000; actionName = 'Chia sẻ'; }
        if (pendingFraudAction === 'like') { requiredTime = 4000; actionName = 'Thả tim'; }
        
        if (timeSpentAway < requiredTime) {
           triggerImmediateFraudAlert({
             title: 'PHÁT HIỆN GIAN LẬN',
             reason: \`Thời gian thao tác quá nhanh (\${(timeSpentAway/1000).toFixed(1)}s). Bạn phải THỰC SỰ MỞ ỨNG DỤNG và \${actionName} để nhận xu!\`,
             anomalyType: 'BOT_SPEED_DETECTED',
             channelHandle: runnerTask.channelHandle,
             penaltyPoints: 10
           });
        } else {
           const earned = claimTaskAction(runnerTask.id, pendingFraudAction);
           if (earned > 0) {
             setClaimedActions(prev => ({ ...prev, [pendingFraudAction]: true }));
             showToast(\`🎉 Xác minh \${actionName} thành công: +\${earned} Xu\`);
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
  }, [isRunnerOpen, pendingFraudAction, pendingActionStartTime, runnerTask, claimTaskAction, triggerImmediateFraudAlert]);`;

code = code.replace(visibilityRegex, newVisibilityHook);

// 3. Update action handlers
const followRegex = /const handleFollowAction = \(e\?\: React\.MouseEvent\) => \{.*?\};/s;
const newFollow = `const handleFollowAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isChannelFollowed(runnerTask.channelHandle)) {
      triggerImmediateFraudAlert({
        title: 'TỪ CHỐI FOLLOW TRÙNG LẶP',
        reason: \`Bạn đã từng Follow kênh \${runnerTask.channelHandle} trên hệ thống rồi. Mỗi kênh chỉ được nhận thưởng follow 1 lần duy nhất trong đời để bảo vệ ngân sách nhà sáng tạo!\`,
        anomalyType: 'DUPLICATE_CHANNEL_FOLLOW',
        channelHandle: runnerTask.channelHandle,
        penaltyPoints: 10
      });
      return;
    }
    if (!claimedActions.follow) {
      setPendingFraudAction('follow');
      setPendingActionStartTime(Date.now());
      window.open(\`https://www.tiktok.com/@\${runnerTask.channelHandle}\`, '_blank', 'noopener,noreferrer');
    }
  };`;
code = code.replace(followRegex, newFollow);

const commentRegex = /const handleCommentAction = \(commentText\: string\) => \{.*?\};/s;
const newComment = `const handleCommentAction = (commentText: string) => {
    if (!commentText.trim()) return;
    
    // ĐÓNG BĂNG 60 LỚP: BẮT BUỘC COPY VÀ MỞ TIKTOK ĐỂ DÁN
    navigator.clipboard.writeText(commentText).catch(() => {});
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCommentSheet(false);
      
      setPendingFraudAction('comment');
      setPendingActionStartTime(Date.now());
      showToast('Đã Copy bình luận! Đang mở TikTok, vui lòng DÁN (Paste) bình luận vào video nhé.');
      
      const targetUrl = runnerTask.targetUrl || \`https://www.tiktok.com/@\${runnerTask.channelHandle}\`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 1000);
  };`;
code = code.replace(commentRegex, newComment);

const likeShareRegex = /const handleAction = \(action\: 'like' \| 'share'\) => \{.*?\};/s;
const newLikeShare = `const handleAction = (action: 'like' | 'share') => {
    if (!claimedActions[action]) {
      setPendingFraudAction(action);
      setPendingActionStartTime(Date.now());
      const targetUrl = runnerTask.targetUrl || \`https://www.tiktok.com/@\${runnerTask.channelHandle}\`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };`;
code = code.replace(likeShareRegex, newLikeShare);

// Ensure the FAKE auto-reward for watch is stopped if they haven't met criteria.
// "Ví dụ nó mở kênh TikTok lên xong rồi nó chờ... nhận xu. Đó là không được"
const watchAutoRewardRegex = /\/\/ When timer hits 0, auto claim watch reward \(\+200 Xu\) once\n  useEffect\(\(\) => \{\n    if \(timeLeft === 0 && \!claimedActions\.watch && runnerTask\) \{\n      claimTaskAction\(runnerTask\.id, 'watch'\);\n      setClaimedActions\(prev => \(\{ \.\.\.prev, watch\: true \}\)\);\n    \}\n  \}, \[timeLeft, claimedActions\.watch, runnerTask, claimTaskAction\]\);/s;
const newWatchAutoReward = `// Bắt buộc click Xem Trên TikTok để nhận phần thưởng watch
  useEffect(() => {
    // Chúng ta KHÔNG auto claim Xu khi đếm lùi về 0 nữa. 
    // Người dùng phải thực sự chuyển hướng sang TikTok.
  }, []);`;
code = code.replace(watchAutoRewardRegex, newWatchAutoReward);

// Also need a button to claim Watch reward manually by going to TikTok
// Wait, the UI has a "Mở Nhanh Link" button?
// Actually if they do ANY action they go to TikTok. What if the task is ONLY "watch"?
// Let's add a condition in the countdown timer that shows a "Xác Nhận Xem Trên Ứng Dụng" button when timer reaches 0.

fs.writeFileSync('src/components/modals/TikTokTaskRunnerModal.tsx', code);
console.log('Patched runner modal!');
