import React, { useState } from 'react';
import { PackingItem, LootItem, LuggageCategory } from '../types/travel';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  FileText, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Shirt,
  Scale,
  Briefcase,
  AlertTriangle,
  Package
} from 'lucide-react';

interface PreTripPackingViewProps {
  packingList: PackingItem[];
  lootItems: LootItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<PackingItem, 'id' | 'completed'>) => void;
  onDeleteItem: (id: string) => void;
  onResetCompleted: () => void;
  onChangeLootAllocation?: (id: string, allocation: LuggageCategory) => void;
}

export const PreTripPackingView: React.FC<PreTripPackingViewProps> = ({
  packingList,
  lootItems,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetCompleted,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWeightBreakdown, setShowWeightBreakdown] = useState(true);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<PackingItem['category']>('carryon_bag');
  const [newMustCheck, setNewMustCheck] = useState(false);

  // Calculations
  const CHECKED_LIMIT_G = 15000; // 15kg
  const CARRYON_LIMIT_G = 10000; // 10kg

  const checkedWeight = lootItems
    .filter((item) => item.allocation === 'checked_15kg')
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const carryonWeight = lootItems
    .filter((item) => item.allocation === 'carryon_10kg')
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const courierWeight = lootItems
    .filter((item) => item.allocation === 'courier_box')
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const checkedPercent = Math.min(100, Math.round((checkedWeight / CHECKED_LIMIT_G) * 100));
  const isCheckedOver = checkedWeight > CHECKED_LIMIT_G;

  const filteredItems = packingList.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const totalCount = packingList.length;
  const completedCount = packingList.filter((i) => i.completed).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      category: newCategory,
      mustCheck: newMustCheck,
    });

    setNewTitle('');
    setNewSubtitle('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: PackingItem['category']) => {
    switch (category) {
      case 'documents':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'carryon_bag':
        return <ShoppingBag className="w-4 h-4 text-sky-600" />;
      case 'checked_luggage':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'clothing_weather':
        return <Shirt className="w-4 h-4 text-rose-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview & Luggage Weight Quick Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
              <Package className="w-3.5 h-3.5" />
              <span>出發前打包準備 · 行前 Check List</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#231F1E] mt-0.5">
              行前準備與行李打包清單
            </h2>
            <p className="text-xs text-[#6E655F] mt-1">
              檢查 20 吋託運箱（15kg 上限）、隨身擴充袋（10kg）與重要出入境證件
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-[#6E655F]">打包完成度</div>
              <div className="font-mono text-base font-bold text-[#231F1E]">
                {completedCount} / {totalCount} ({progressPct}%)
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#231F1E] hover:bg-[#3D3734] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>新增打包品項</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2.5 w-full bg-[#E8E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D97706] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 15kg Baggage Quick Bar Toggle */}
        <div className="mt-5 pt-4 border-t border-[#F0EAE1]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D97706]" />
              <span className="text-xs font-bold text-[#231F1E]">
                當前戰利品預估配重：20 吋託運箱 ({checkedPercent}%)
              </span>
            </div>
            <button
              onClick={() => setShowWeightBreakdown(!showWeightBreakdown)}
              className="text-xs text-[#D97706] hover:text-[#B45309] font-semibold cursor-pointer underline"
            >
              {showWeightBreakdown ? '收合配重詳情' : '查看配重詳情'}
            </button>
          </div>

          {showWeightBreakdown && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]">
                <div className="font-bold text-[#231F1E] flex items-center justify-between mb-1">
                  <span>🧳 20吋託運箱 (限重 15kg)</span>
                  <span className={isCheckedOver ? 'text-rose-600 font-bold' : 'text-[#D97706]'}>
                    {(checkedWeight / 1000).toFixed(2)} kg
                  </span>
                </div>
                <p className="text-[11px] text-[#6E655F]">
                  {isCheckedOver ? '⚠️ 已超重！請將衣物改為超商集運' : `剩餘扣打 ${((CHECKED_LIMIT_G - checkedWeight) / 1000).toFixed(2)} kg`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]">
                <div className="font-bold text-[#231F1E] flex items-center justify-between mb-1">
                  <span>🎒 隨身手提袋 (限重 10kg)</span>
                  <span className="text-sky-700 font-bold">{(carryonWeight / 1000).toFixed(2)} kg</span>
                </div>
                <p className="text-[11px] text-[#6E655F]">手燈/行動電源/保暖衣物</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]">
                <div className="font-bold text-[#231F1E] flex items-center justify-between mb-1">
                  <span>📦 超商寄集運倉</span>
                  <span className="text-purple-700 font-bold">{(courierWeight / 1000).toFixed(2)} kg</span>
                </div>
                <p className="text-[11px] text-[#6E655F]">衣服/鞋盒/零食伴手禮</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8E2D9] text-xs font-medium overflow-x-auto">
          {[
            { id: 'all', label: '全部項目' },
            { id: 'documents', label: '📄 證件/機票/卡片' },
            { id: 'carryon_bag', label: '🎒 隨身行李 (10kg)' },
            { id: 'checked_luggage', label: '🧳 託運行李 (15kg)' },
            { id: 'clothing_weather', label: '🧥 秋季穿搭/天氣' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#231F1E] text-white shadow-xs'
                  : 'text-[#6E655F] hover:text-[#231F1E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={onResetCompleted}
          className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#231F1E] transition-colors cursor-pointer"
          title="重設打包打勾狀態"
        >
          <RotateCcw className="w-3 h-3" />
          <span>重設打勾</span>
        </button>
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              item.completed
                ? 'bg-[#FAF7F2]/60 border-[#E8E2D9] opacity-60'
                : 'bg-white border-[#E8E2D9] hover:border-[#D97706]/60 shadow-xs'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
              ) : (
                <Square className="w-5 h-5 text-[#C4B9A5] hover:text-[#D97706]" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold text-[#231F1E] ${
                    item.completed ? 'line-through text-[#6E655F]' : ''
                  }`}
                >
                  {item.title}
                </span>

                {item.mustCheck && (
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm">
                    必帶
                  </span>
                )}
              </div>

              {item.subtitle && (
                <p className="text-xs text-[#6E655F] mt-0.5 leading-relaxed">
                  {item.subtitle}
                </p>
              )}
            </div>

            <div className="shrink-0 p-1.5 rounded-lg bg-[#FAF7F2] text-[#6E655F]">
              {getCategoryIcon(item.category)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Packing Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                新增行前打包品項
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  物品名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 保暖圍巾、拍立得底片、護唇膏"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  備註說明 (選填)
                </label>
                <input
                  type="text"
                  placeholder="例如: 記得充飽電、收納於手提袋"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  所屬打包分類
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PackingItem['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white cursor-pointer"
                >
                  <option value="documents">📄 證件/機票/卡片</option>
                  <option value="carryon_bag">🎒 隨身行李 (10kg 擴充手提袋)</option>
                  <option value="checked_luggage">🧳 託運行李 (20 吋 15kg 箱)</option>
                  <option value="clothing_weather">🧥 秋季穿搭與防寒</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="packingMustCheck"
                  checked={newMustCheck}
                  onChange={(e) => setNewMustCheck(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#D97706] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="packingMustCheck" className="text-xs text-[#231F1E] cursor-pointer">
                  標記為「重要必備」
                </label>
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
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
