import React, { useState } from 'react';
import { CARD_PROMOTIONS } from '../data/defaultItinerary';
import { 
  ArrowRightLeft, 
  Coins, 
  CreditCard, 
  RefreshCw, 
  Receipt, 
  Check, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

interface CurrencyConverterProps {
  exchangeRate: number;
  onUpdateRate: (newRate: number) => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  exchangeRate,
  onUpdateRate,
}) => {
  const [krwAmount, setKrwAmount] = useState<string>('50000');
  const [twdAmount, setTwdAmount] = useState<string>(
    String(Math.round(50000 / exchangeRate))
  );
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [customRate, setCustomRate] = useState<string>(String(exchangeRate));

  const handleKrwChange = (val: string) => {
    setKrwAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setTwdAmount(String(Math.round(num / exchangeRate)));
    } else {
      setTwdAmount('');
    }
  };

  const handleTwdChange = (val: string) => {
    setTwdAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setKrwAmount(String(Math.round(num * exchangeRate)));
    } else {
      setKrwAmount('');
    }
  };

  const handleSetQuickKrw = (amount: number) => {
    setKrwAmount(String(amount));
    setTwdAmount(String(Math.round(amount / exchangeRate)));
  };

  const handleSaveRate = () => {
    const parsed = parseFloat(customRate);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateRate(parsed);
      setIsEditingRate(false);
      // Recalculate
      const num = parseFloat(krwAmount);
      if (!isNaN(num)) {
        setTwdAmount(String(Math.round(num / parsed)));
      }
    }
  };

  // Tax refund estimation
  const currentKrw = parseFloat(krwAmount) || 0;
  const isTaxFreeEligible = currentKrw >= 30000;
  // Korea tax refund is tiered: usually ~6% to 8%
  const estimatedTaxRefundKrw = isTaxFreeEligible ? Math.round(currentKrw * 0.065) : 0;
  const estimatedTaxRefundTwd = Math.round(estimatedTaxRefundKrw / exchangeRate);

  return (
    <div className="space-y-6">
      {/* Bidirectional Converter Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EAE1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
              <Coins className="w-3.5 h-3.5" />
              <span>雙向即時試算</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#231F1E] mt-0.5">
              韓元 (KRW) ⇄ 台幣 (TWD) 匯率換算
            </h2>
          </div>

          {/* Exchange Rate Badge & Setting */}
          <div className="flex items-center gap-2">
            {!isEditingRate ? (
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D9] px-3 py-1.5 rounded-xl text-xs">
                <span className="text-[#6E655F]">基準匯率：</span>
                <span className="font-mono font-bold text-[#231F1E]">
                  1 TWD ≈ {exchangeRate} KRW
                </span>
                <button
                  onClick={() => setIsEditingRate(true)}
                  className="text-[#D97706] hover:text-[#B45309] font-medium ml-1 cursor-pointer underline"
                >
                  修改
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="w-20 px-2 py-1 border border-[#D97706] rounded-lg text-xs font-mono"
                />
                <button
                  onClick={handleSaveRate}
                  className="bg-[#231F1E] text-white text-xs px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  儲存
                </button>
                <button
                  onClick={() => {
                    setCustomRate(String(exchangeRate));
                    setIsEditingRate(false);
                  }}
                  className="text-xs text-[#6E655F] cursor-pointer"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input Pair */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* KRW Input */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE5DB]">
            <div className="flex justify-between items-center text-xs font-bold text-[#4B5563] mb-1.5">
              <span>韓元 (KRW ₩)</span>
              <span className="text-[#9CA3AF]">韓國標價</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={krwAmount}
                onChange={(e) => handleKrwChange(e.target.value)}
                placeholder="輸入韓元金額"
                className="w-full bg-white px-4 py-3 rounded-xl border border-[#E8E2D9] text-xl font-mono font-bold text-[#231F1E] focus:outline-none focus:border-[#D97706]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#9CA3AF]">
                ₩
              </span>
            </div>
          </div>

          {/* TWD Input */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE5DB]">
            <div className="flex justify-between items-center text-xs font-bold text-[#4B5563] mb-1.5">
              <span>新台幣 (TWD NT$)</span>
              <span className="text-[#9CA3AF]">折合台幣</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={twdAmount}
                onChange={(e) => handleTwdChange(e.target.value)}
                placeholder="輸入台幣金額"
                className="w-full bg-white px-4 py-3 rounded-xl border border-[#E8E2D9] text-xl font-mono font-bold text-[#231F1E] focus:outline-none focus:border-[#D97706]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#9CA3AF]">
                NT$
              </span>
            </div>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#6E655F]">常用快捷按鈕：</span>
          {[
            { label: '1萬₩ (約$235)', val: 10000 },
            { label: '3萬₩ (退稅門檻 約$705)', val: 30000 },
            { label: '5萬₩ (約$1,176)', val: 50000 },
            { label: '10萬₩ (約$2,353)', val: 100000 },
            { label: '15萬₩ (約$3,529)', val: 150000 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => handleSetQuickKrw(item.val)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FEF3C7]/40 text-[#231F1E] transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Instant Tax Refund Calculation Banner */}
        <div className="mt-5 p-4 rounded-xl border border-[#FDE68A] bg-[#FEF3C7]/60 text-xs text-[#92400E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Receipt className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#78350F] text-sm flex items-center gap-1.5">
                <span>韓國即時免稅 (Tax Refund) 估算</span>
                {isTaxFreeEligible ? (
                  <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                    達退稅門檻 (≥30,000₩)
                  </span>
                ) : (
                  <span className="bg-[#9CA3AF] text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                    差 {(30000 - currentKrw).toLocaleString()}₩ 達門檻
                  </span>
                )}
              </div>
              <p className="text-[#92400E] mt-1 leading-relaxed">
                在明洞 BANILA CO、聖水洞、漢南洞或首爾站樂天超市結帳時，主動出示護照，即可現場直接扣除稅金！
              </p>
            </div>
          </div>

          {isTaxFreeEligible && (
            <div className="sm:text-right shrink-0 bg-white/80 p-2.5 rounded-lg border border-[#FDE68A]">
              <div className="text-[11px] text-[#78350F]">預估現場扣抵退稅</div>
              <div className="font-mono text-base font-bold text-emerald-800">
                -₩{estimatedTaxRefundKrw.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#92400E]">
                  (≈ NT${estimatedTaxRefundTwd})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit Card & Mobile Payment Strategy Guide */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1] mb-4">
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
              赴韓主力信用卡與行動支付回饋攻略
            </h3>
            <p className="text-xs text-[#6E655F]">
              針對海外 1.5% 手續費的最佳抵扣方案與超商 TWQR 跨境掃碼
            </p>
          </div>
          <CreditCard className="w-5 h-5 text-[#D97706]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CARD_PROMOTIONS.map((card) => (
            <div
              key={card.id}
              className="p-4 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-[#231F1E]">{card.name}</h4>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                  >
                    {card.rewardRate}
                  </span>
                </div>
                <div className="text-xs text-[#9CA3AF] mb-2">{card.issuer}</div>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  {card.highlights}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#EBE5DB] text-[11px] text-[#1E3A2F] flex items-center gap-1.5">
                <span className="font-bold shrink-0">🎯 最適場景：</span>
                <span className="truncate">{card.suitableFor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
