import React, { useState } from 'react';
import { ChecklistItem } from '../types/travel';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Sparkles, 
  Camera, 
  ShoppingBag, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

interface ChecklistAndPilgrimageProps {
  checklist: ChecklistItem[];
  onToggleChecklistItem: (id: string) => void;
  onAddChecklistItem: (item: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  onResetCompleted: () => void;
}

export const ChecklistAndPilgrimage: React.FC<ChecklistAndPilgrimageProps> = ({
  checklist,
  onToggleChecklistItem,
  onAddChecklistItem,
  onResetCompleted,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistItem['category']>('shopping_target');
  const [newMustCheck, setNewMustCheck] = useState(false);

  const filteredItems = checklist.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const totalCount = checklist.length;
  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddChecklistItem({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      category: newCategory,
      mustCheck: newMustCheck,
    });

    setNewTitle('');
    setNewSubtitle('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'documents':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'carryon':
        return <ShoppingBag className="w-4 h-4 text-sky-600" />;
      case 'checked':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'pilgrimage':
        return <Camera className="w-4 h-4 text-purple-600" />;
      case 'shopping_target':
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress & Quick Stats Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>檢查與朝聖追蹤</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#231F1E] mt-0.5">
              打包行李、同款朝聖與心願清單
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-[#6E655F]">整體完成進度</div>
              <div className="font-mono text-base font-bold text-[#231F1E]">
                {completedCount} / {totalCount} ({progressPct}%)
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#231F1E] hover:bg-[#3D3734] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>新增項目</span>
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
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8E2D9] text-xs font-medium overflow-x-auto">
          {[
            { id: 'all', label: '全部項目' },
            { id: 'documents', label: '📄 證件/機票' },
            { id: 'carryon', label: '🎒 隨身 (10kg)' },
            { id: 'checked', label: '🧳 託運 (15kg)' },
            { id: 'pilgrimage', label: '📸 同款朝聖打卡' },
            { id: 'shopping_target', label: '🛍️ 必買目標清單' },
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
          title="重置所有打勾狀態"
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
            onClick={() => onToggleChecklistItem(item.id)}
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

            <div className="shrink-0 p-1 rounded-lg bg-[#FAF7F2] text-[#6E655F]">
              {getCategoryIcon(item.category)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Checklist Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                新增清單 / 朝聖項目
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold"
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
                  placeholder="例如: 仁川機場限定保養品、漢南洞打卡點"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  補充說明或細節
                </label>
                <input
                  type="text"
                  placeholder="例如: 記得攜帶實體護照、限量版尺寸"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  所屬分類
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ChecklistItem['category'])}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white"
                >
                  <option value="shopping_target">🛍️ 必買目標清單</option>
                  <option value="pilgrimage">📸 同款朝聖打卡</option>
                  <option value="carryon">🎒 隨身行李 (10kg)</option>
                  <option value="checked">🧳 託運行李 (15kg)</option>
                  <option value="documents">📄 證件與機票</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mustCheckCheckbox"
                  checked={newMustCheck}
                  onChange={(e) => setNewMustCheck(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#D97706] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="mustCheckCheckbox" className="text-xs text-[#231F1E] cursor-pointer">
                  標記為「必備 / 重點項目」
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
