import React, { useState } from 'react';
import { WishlistItem } from '../types/travel';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Camera, 
  ShoppingBag, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Utensils,
  Music,
  MapPin
} from 'lucide-react';

interface InTripWishlistViewProps {
  wishlist: WishlistItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<WishlistItem, 'id' | 'completed'>) => void;
  onDeleteItem: (id: string) => void;
  onResetCompleted: () => void;
}

export const InTripWishlistView: React.FC<InTripWishlistViewProps> = ({
  wishlist,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetCompleted,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState<WishlistItem['category']>('pilgrimage_idol');
  const [newMustVisit, setNewMustVisit] = useState(false);

  const filteredItems = wishlist.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const totalCount = wishlist.length;
  const completedCount = wishlist.filter((i) => i.completed).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      location: newLocation.trim() || undefined,
      category: newCategory,
      mustVisit: newMustVisit,
    });

    setNewTitle('');
    setNewSubtitle('');
    setNewLocation('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: WishlistItem['category']) => {
    switch (category) {
      case 'pilgrimage_idol':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'photo_scenery':
        return <Camera className="w-4 h-4 text-amber-600" />;
      case 'shopping_target':
        return <ShoppingBag className="w-4 h-4 text-rose-600" />;
      case 'food_wishlist':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>首爾隨身打卡 · 旅行中的 Check List</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#231F1E] mt-0.5">
              朝聖打卡與心願清單
            </h2>
            <p className="text-xs text-[#6E655F] mt-1">
              追星同款打卡、秋日秋楓銀杏機位、必買戰利品與必吃名店，在旅程中隨走隨勾！
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-[#6E655F]">心願達成度</div>
              <div className="font-mono text-base font-bold text-[#231F1E]">
                {completedCount} / {totalCount} ({progressPct}%)
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#231F1E] hover:bg-[#3D3734] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>新增心願項目</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2.5 w-full bg-[#E8E2D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D97706] to-[#B91C1C] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8E2D9] text-xs font-medium overflow-x-auto">
          {[
            { id: 'all', label: '全部心願' },
            { id: 'pilgrimage_idol', label: '🎤 追星同款朝聖' },
            { id: 'photo_scenery', label: '📸 攝影/銀杏秋景' },
            { id: 'shopping_target', label: '🛍️ 必買戰利品' },
            { id: 'food_wishlist', label: '🍲 必吃美食清單' },
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
          title="重設朝聖打勾狀態"
        >
          <RotateCcw className="w-3 h-3" />
          <span>重設打勾</span>
        </button>
      </div>

      {/* Checklist Grid */}
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
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-sm font-bold text-[#231F1E] ${
                    item.completed ? 'line-through text-[#6E655F]' : ''
                  }`}
                >
                  {item.title}
                </span>

                {item.mustVisit && (
                  <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded-sm border border-[#FDE68A]">
                    重點朝聖
                  </span>
                )}
              </div>

              {item.subtitle && (
                <p className="text-xs text-[#6E655F] mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              )}

              {item.location && (
                <div className="flex items-center gap-1 text-[11px] text-[#92400E] mt-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            <div className="shrink-0 p-1.5 rounded-lg bg-[#FAF7F2] text-[#6E655F]">
              {getCategoryIcon(item.category)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Wishlist Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                新增朝聖 / 心願項目
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
                  項目名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 聖水洞 Tamburins 巨型雕塑合影"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  地點位置 (選填)
                </label>
                <input
                  type="text"
                  placeholder="例如: 聖水洞旗艦店 / 漢南洞"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  補充說明或心願備註 (選填)
                </label>
                <input
                  type="text"
                  placeholder="例如: 傍晚光線最佳、拍立得合照"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  所屬心願分類
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as WishlistItem['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white cursor-pointer"
                >
                  <option value="pilgrimage_idol">🎤 追星同款朝聖</option>
                  <option value="photo_scenery">📸 攝影與銀杏秋景</option>
                  <option value="shopping_target">🛍️ 必買戰利品心願</option>
                  <option value="food_wishlist">🍲 必吃美食清單</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="wishlistMustVisit"
                  checked={newMustVisit}
                  onChange={(e) => setNewMustVisit(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#D97706] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="wishlistMustVisit" className="text-xs text-[#231F1E] cursor-pointer">
                  標記為「重點朝聖」
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
