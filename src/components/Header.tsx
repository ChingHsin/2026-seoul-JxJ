import React, { useState } from 'react';
import { Calendar, Package, Camera, Scale, Coins, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export type MainTabType = 'itinerary' | 'packing' | 'wishlist' | 'luggage' | 'currency';

interface HeaderProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D9] px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('itinerary')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🍂</span>
                <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#231F1E]">
                  SEOUL 2026
                </span>
                <span className="hidden sm:inline-block text-xs font-medium text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  10.29 – 11.03
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-[#231F1E] text-white'
                  : 'text-[#6E655F] hover:text-[#231F1E] hover:bg-[#F0EAE1]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>每日行程</span>
            </button>

            <button
              onClick={() => setActiveTab('packing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'packing'
                  ? 'bg-[#231F1E] text-white'
                  : 'text-[#6E655F] hover:text-[#231F1E] hover:bg-[#F0EAE1]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>行前打包</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#231F1E] text-white'
                  : 'text-[#6E655F] hover:text-[#231F1E] hover:bg-[#F0EAE1]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>朝聖心願</span>
            </button>

            <button
              onClick={() => setActiveTab('luggage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'luggage'
                  ? 'bg-[#231F1E] text-white'
                  : 'text-[#6E655F] hover:text-[#231F1E] hover:bg-[#F0EAE1]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>15kg配重記帳</span>
            </button>

            <button
              onClick={() => setActiveTab('currency')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'currency'
                  ? 'bg-[#231F1E] text-white'
                  : 'text-[#6E655F] hover:text-[#231F1E] hover:bg-[#F0EAE1]'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>匯率刷卡</span>
            </button>
          </nav>

          {/* Zone 3: PWA Install Action */}
          <div className="flex items-center gap-2 shrink-0">
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 bg-[#D97706] hover:bg-[#B45309] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>安裝手冊</span>
              </button>
            )}

            {isIOS && !isInstalled && !isInstallable && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 bg-[#F5EFE6] hover:bg-[#EBDDC8] text-[#78350F] border border-[#E6DCCA] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">加入 iPhone 主畫面</span>
                <span className="sm:hidden">加入主畫面</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                將手冊安裝至 iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#4B5563]">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs shrink-0">
                  1
                </span>
                <p>
                  在 Safari 瀏覽器底部點擊 <strong className="text-[#231F1E]">「分享」</strong> 按鈕（向上箭頭圖示）。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs shrink-0">
                  2
                </span>
                <p>
                  向下滑動選單，點選 <strong className="text-[#231F1E]">「加入主畫面」</strong> (Add to Home Screen)。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs shrink-0">
                  3
                </span>
                <p>
                  點擊右上角「新增」，即可如原生 App 般在首爾離線秒開查閱！
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-[#231F1E] text-white py-2.5 text-sm font-semibold hover:bg-[#3D3734] transition-colors cursor-pointer"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
};
