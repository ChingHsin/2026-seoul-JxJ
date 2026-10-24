import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 sm:left-6 z-50 flex items-center gap-2 rounded-xl bg-[#92400E] text-white px-3.5 py-2 text-xs font-medium shadow-xl border border-[#B45309]">
      <WifiOff className="w-4 h-4 animate-pulse text-[#FDE68A]" />
      <span>離線模式已啟動 — 已載入本地快取資料</span>
    </div>
  );
};
