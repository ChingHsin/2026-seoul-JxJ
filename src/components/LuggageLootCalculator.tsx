import React, { useState } from 'react';
import { 
  LootItem, 
  LuggageCategory, 
  PaymentMethod 
} from '../types/travel';
import { 
  Scale, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Briefcase, 
  CreditCard, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LuggageLootCalculatorProps {
  lootItems: LootItem[];
  exchangeRate: number;
  onAddLootItem: (item: Omit<LootItem, 'id'>) => void;
  onTogglePurchased: (id: string) => void;
  onChangeAllocation: (id: string, allocation: LuggageCategory) => void;
  onDeleteLootItem: (id: string) => void;
}

export const LuggageLootCalculator: React.FC<LuggageLootCalculatorProps> = ({
  lootItems,
  exchangeRate,
  onAddLootItem,
  onTogglePurchased,
  onChangeAllocation,
  onDeleteLootItem,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // New loot form state
  const [name, setName] = useState('');
  const [brandOrStore, setBrandOrStore] = useState('');
  const [priceKrw, setPriceKrw] = useState<number>(50000);
  const [weightGrams, setWeightGrams] = useState<number>(400);
  const [category, setCategory] = useState<LootItem['category']>('clothing_apparel');
  const [allocation, setAllocation] = useState<LuggageCategory>('courier_box');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dbs_eco');
  const [notes, setNotes] = useState('');

  // Maximum baggage weight limits in grams
  const CHECKED_LIMIT_G = 15000; // 15kg
  const CARRYON_LIMIT_G = 10000; // 10kg

  // Calculations
  const checkedWeight = lootItems
    .filter((item) => item.allocation === 'checked_15kg')
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const carryonWeight = lootItems
    .filter((item) => item.allocation === 'carryon_10kg')
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const courierWeight = lootItems
    .filter((item) => item.allocation === 'courier_box')
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const totalSpentKrw = lootItems.reduce((sum, item) => sum + item.priceKrw, 0);
  const totalSpentTwd = Math.round(totalSpentKrw / exchangeRate);

  // Estimated Cashback Calculation
  const estimatedCashbackTwd = lootItems.reduce((sum, item) => {
    const itemTwd = item.priceKrw / exchangeRate;
    let rate = 0.03; // fallback 3%
    if (item.paymentMethod === 'fubon_j') rate = 0.06;
    if (item.paymentMethod === 'dbs_eco') rate = 0.05;
    if (item.paymentMethod === 'cathay_cube') rate = 0.03;
    if (item.paymentMethod === 'ctbc_linepay') rate = 0.028;
    if (item.paymentMethod === 'twqr') rate = 0.04;
    return sum + itemTwd * rate;
  }, 0);

  const checkedPercent = Math.min(100, Math.round((checkedWeight / CHECKED_LIMIT_G) * 100));
  const carryonPercent = Math.min(100, Math.round((carryonWeight / CARRYON_LIMIT_G) * 100));

  const isCheckedOver = checkedWeight > CHECKED_LIMIT_G;
  const isCarryonOver = carryonWeight > CARRYON_LIMIT_G;

  // Check if any liquid item is misplaced in carryon
  const liquidWarningItems = lootItems.filter(
    (item) => item.category === 'liquid_cosmetics' && item.allocation === 'carryon_10kg'
  );

  const handleCreateLoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddLootItem({
      name: name.trim(),
      brandOrStore: brandOrStore.trim() || '首爾商圈',
      priceKrw: Number(priceKrw) || 0,
      weightGrams: Number(weightGrams) || 0,
      category,
      allocation,
      paymentMethod,
      purchased: false,
      notes: notes.trim(),
    });

    setName('');
    setBrandOrStore('');
    setPriceKrw(50000);
    setWeightGrams(400);
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Warning If Liquid Misplaced in Carry-on */}
      {liquidWarningItems.length > 0 && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#991B1B]">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-bold text-rose-950 mb-0.5">
              ⚠️ 航空液體隨身管制提醒
            </strong>
            <p>
              偵測到以下液體或膏狀美妝品被分配至「隨身擴充袋」：
              <span className="font-bold underline ml-1">
                {liquidWarningItems.map((i) => i.name).join('、')}
              </span>
              。單罐超過 100ml（如卸妝膏或香水）必須改分配至「20 吋託運箱」，否則安檢會被海關沒收！
            </p>
          </div>
        </div>
      )}

      {/* 3-Baggage Weight Capacity Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: 20-inch Checked Luggage (15kg) */}
        <div
          className={`bg-white rounded-2xl border p-5 shadow-xs relative overflow-hidden ${
            isCheckedOver ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E2D9]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#92400E]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#231F1E]">20 吋託運箱</h3>
                <p className="text-[11px] text-[#6E655F]">液體/香水/貼身換洗衣物</p>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                isCheckedOver
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              限重 15kg
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between text-xs mb-1.5">
              <span className="font-mono text-lg font-bold text-[#231F1E]">
                {(checkedWeight / 1000).toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#6E655F]">kg</span>
              </span>
              <span className="font-mono font-semibold text-[#6E655F]">
                {checkedPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#E8E2D9] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isCheckedOver
                    ? 'bg-rose-600'
                    : checkedPercent > 80
                    ? 'bg-[#D97706]'
                    : 'bg-[#1E3A2F]'
                }`}
                style={{ width: `${checkedPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#6E655F] mt-2">
              <span>
                {isCheckedOver
                  ? `超重 +${((checkedWeight - CHECKED_LIMIT_G) / 1000).toFixed(2)} kg`
                  : `剩餘 ${((CHECKED_LIMIT_G - checkedWeight) / 1000).toFixed(2)} kg`}
              </span>
              <span>15,000g 上限</span>
            </div>
          </div>
        </div>

        {/* Box 2: Expandable Carry-on (10kg) */}
        <div
          className={`bg-white rounded-2xl border p-5 shadow-xs relative overflow-hidden ${
            isCarryonOver ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E2D9]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0369A1]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#231F1E]">折疊隨身擴充袋</h3>
                <p className="text-[11px] text-[#6E655F]">手燈/行動電源/免稅商品</p>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                isCarryonOver
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-[#E0F2FE] text-[#0369A1]'
              }`}
            >
              限重 10kg
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between text-xs mb-1.5">
              <span className="font-mono text-lg font-bold text-[#231F1E]">
                {(carryonWeight / 1000).toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#6E655F]">kg</span>
              </span>
              <span className="font-mono font-semibold text-[#6E655F]">
                {carryonPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#E8E2D9] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isCarryonOver ? 'bg-rose-600' : 'bg-[#0369A1]'
                }`}
                style={{ width: `${carryonPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#6E655F] mt-2">
              <span>
                {isCarryonOver
                  ? `超重 +${((carryonWeight - CARRYON_LIMIT_G) / 1000).toFixed(2)} kg`
                  : `剩餘 ${((CARRYON_LIMIT_G - carryonWeight) / 1000).toFixed(2)} kg`}
              </span>
              <span>10,000g 上限</span>
            </div>
          </div>
        </div>

        {/* Box 3: Courier Box (CU/GS25 超商寄首爾集運倉) */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#231F1E]">超商寄集運倉</h3>
                <p className="text-[11px] text-[#6E655F]">衣物/鞋盒/樂天零食餅乾</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D28D9]">
              無託運重量限制
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between text-xs mb-1.5">
              <span className="font-mono text-lg font-bold text-[#6D28D9]">
                {(courierWeight / 1000).toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#6E655F]">kg</span>
              </span>
              <span className="text-[11px] text-[#6E655F]">寄友人家集運倉</span>
            </div>
            <div className="h-2.5 w-full bg-[#E8E2D9] rounded-full overflow-hidden">
              <div className="h-full bg-[#6D28D9] rounded-full w-full opacity-60" />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#6E655F] mt-2">
              <span>Day 5 晚間在堂山超商裝箱寄出</span>
              <span>空運回台免扛重物</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spending & Cashback Statistics Strip */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]">
              <Scale className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-xs text-[#6E655F]">戰利品累計花費預估</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#231F1E]">
                  ₩ {totalSpentKrw.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#6E655F]">
                  ≈ NT$ {totalSpentTwd.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0EAE1]">
            <div className="text-left sm:text-right">
              <div className="text-xs text-[#6E655F]">預估主力信用卡回饋</div>
              <div className="font-mono text-lg font-bold text-emerald-700">
                +NT$ {Math.round(estimatedCashbackTwd).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#231F1E] hover:bg-[#3D3734] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#FDE68A]" />
              <span>記帳/新增戰利品</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loot Items Management Table/Cards */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1] mb-4">
          <h3 className="font-editorial text-base sm:text-lg font-bold text-[#231F1E]">
            戰利品清單與行李動態分流 ({lootItems.length} 項)
          </h3>
          <span className="text-xs text-[#6E655F]">點擊行李分類標籤可直接快速切換</span>
        </div>

        <div className="space-y-3">
          {lootItems.map((item) => {
            const itemTwd = Math.round(item.priceKrw / exchangeRate);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.purchased
                    ? 'bg-[#FAF7F2]/80 border-[#E8E2D9]'
                    : 'bg-white border-[#E8E2D9] hover:border-[#D97706]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Item Info */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onTogglePurchased(item.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer transition-colors mt-0.5 ${
                        item.purchased
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-[#C4B9A5] hover:border-[#D97706] bg-white'
                      }`}
                      title={item.purchased ? '標記為未購買' : '標記為已入手'}
                    >
                      {item.purchased && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold text-[#231F1E] ${
                            item.purchased ? 'line-through text-[#6E655F]' : ''
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-xs text-[#6E655F]">
                          · {item.brandOrStore}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E655F] mt-1">
                        <span className="font-mono font-semibold text-[#231F1E]">
                          ₩{item.priceKrw.toLocaleString()}
                        </span>
                        <span>(≈ NT${itemTwd.toLocaleString()})</span>
                        <span>·</span>
                        <span className="font-mono">{item.weightGrams}g</span>
                        <span>·</span>
                        <span className="text-[#B45309]">
                          {item.paymentMethod === 'dbs_eco' && '星展 eco (5%)'}
                          {item.paymentMethod === 'fubon_j' && '富邦 J (6%)'}
                          {item.paymentMethod === 'cathay_cube' && '國泰 CUBE (3%)'}
                          {item.paymentMethod === 'ctbc_linepay' && '中信 LINE Pay'}
                          {item.paymentMethod === 'twqr' && 'TWQR 跨境掃碼'}
                          {item.paymentMethod === 'cash' && '現金'}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-[#6E655F] mt-1 bg-[#FAF7F2] p-1.5 rounded-lg border border-[#F0EAE1]">
                          💡 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Allocation Switcher & Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <select
                      value={item.allocation}
                      onChange={(e) =>
                        onChangeAllocation(item.id, e.target.value as LuggageCategory)
                      }
                      className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-[#E8E2D9] bg-white text-[#231F1E] focus:outline-none focus:border-[#D97706] cursor-pointer"
                    >
                      <option value="checked_15kg">🧳 20吋託運 (15kg)</option>
                      <option value="carryon_10kg">🎒 隨身擴充袋 (10kg)</option>
                      <option value="courier_box">📦 超商寄集運倉</option>
                    </select>

                    <button
                      onClick={() => onDeleteLootItem(item.id)}
                      className="p-1.5 text-[#9CA3AF] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="刪除品項"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Loot Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                新增戰利品與行李配重試算
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLoot} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  戰利品名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: SW19 香水、羽球服、Olive Young 面膜"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    購買店家 / 品牌
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 漢南洞 SW19、聖水 Musinsa"
                    value={brandOrStore}
                    onChange={(e) => setBrandOrStore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    品項分類
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LootItem['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white"
                  >
                    <option value="clothing_apparel">👗 服飾衣物</option>
                    <option value="liquid_cosmetics">💧 液體/膏狀美妝 (須託運)</option>
                    <option value="badminton">🏸 羽球裝備/KR限定</option>
                    <option value="shoes_boxes">👟 球鞋/鞋盒</option>
                    <option value="snacks_food">🍪 零食伴手禮</option>
                    <option value="general">✨ 演唱會周邊/雜貨</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    價格 (韓元 ₩)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={priceKrw}
                    onChange={(e) => setPriceKrw(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm font-mono focus:outline-none focus:border-[#D97706]"
                  />
                  <span className="text-[11px] text-[#6E655F] mt-0.5 block">
                    ≈ NT${Math.round(priceKrw / exchangeRate).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    預估重量 (公克 g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm font-mono focus:outline-none focus:border-[#D97706]"
                  />
                  <span className="text-[11px] text-[#6E655F] mt-0.5 block">
                    {(weightGrams / 1000).toFixed(2)} kg
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    物流歸屬位置
                  </label>
                  <select
                    value={allocation}
                    onChange={(e) => setAllocation(e.target.value as LuggageCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white"
                  >
                    <option value="checked_15kg">🧳 20吋託運箱 (15kg)</option>
                    <option value="carryon_10kg">🎒 隨身擴充手提袋 (10kg)</option>
                    <option value="courier_box">📦 超商寄集運倉</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    推薦付款方式
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white"
                  >
                    <option value="dbs_eco">星展 eco 卡 (5%)</option>
                    <option value="fubon_j">富邦 J 卡 (6% 登錄)</option>
                    <option value="cathay_cube">國泰 CUBE 卡 (趣旅行 3%)</option>
                    <option value="twqr">TWQR 跨境掃碼</option>
                    <option value="ctbc_linepay">中信 LINE Pay</option>
                    <option value="cash">韓元現金</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  備忘或注意事項
                </label>
                <input
                  type="text"
                  placeholder="例如: 記得出示護照退稅、瓶裝需防漏袋"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8E2D9] text-xs font-semibold text-[#6E655F] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#231F1E] text-white text-xs font-semibold hover:bg-[#3D3734] cursor-pointer"
                >
                  新增並計算配重
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
