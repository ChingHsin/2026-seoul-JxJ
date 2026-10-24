import React, { useState } from 'react';
import { 
  DayItinerary, 
  TimelineItem 
} from '../types/travel';
import { 
  Plane, 
  Building, 
  Camera, 
  ShoppingBag, 
  Utensils, 
  Music, 
  Package, 
  CheckCircle2, 
  Circle, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Info
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  onToggleItem: (dayIndex: number, itemId: string) => void;
  onAddItem: (dayIndex: number, newItem: Omit<TimelineItem, 'id' | 'completed'>) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onToggleItem,
  onAddItem,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Custom item form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TimelineItem['category']>('sightseeing');

  const currentDay = itinerary[selectedDay];

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem(selectedDay, {
      title: newTitle.trim(),
      time: newTime.trim() || '任意時段',
      location: newLocation.trim() || '首爾市區',
      description: newDesc.trim() || '自訂備忘行程',
      category: newCategory,
      isCustom: true,
    });

    setNewTitle('');
    setNewTime('14:00');
    setNewLocation('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: TimelineItem['category']) => {
    switch (category) {
      case 'flight':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'lodging':
        return <Building className="w-4 h-4 text-emerald-600" />;
      case 'sightseeing':
        return <Camera className="w-4 h-4 text-amber-600" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-rose-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'concert':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'logistics':
        return <Package className="w-4 h-4 text-indigo-600" />;
      default:
        return <MapPin className="w-4 h-4 text-stone-600" />;
    }
  };

  const getCategoryBadge = (category: TimelineItem['category']) => {
    const labels: Record<string, string> = {
      flight: '航班/出入境',
      lodging: '住宿與行李',
      sightseeing: '秋景與攝影',
      shopping: '購物採買',
      food: '美食探索',
      concert: '演唱會盛事',
      logistics: '超商集運/打包',
    };
    return labels[category] || '行程';
  };

  const filteredItems = currentDay.items.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const completedCount = currentDay.items.filter((item) => item.completed).length;
  const totalCount = currentDay.items.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Horizontal Day Selector Bar */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {itinerary.map((day, idx) => {
            const isSelected = idx === selectedDay;
            const dayNum = day.dayNumber;
            const dateStr = day.date.split(' ')[0].replace('2026/', '');

            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDay(idx)}
                className={`flex-1 min-w-[92px] sm:min-w-[110px] py-2.5 px-3 rounded-xl text-center transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#231F1E] text-white shadow-xs'
                    : 'text-[#6E655F] hover:bg-[#FAF7F2] hover:text-[#231F1E]'
                }`}
              >
                <div className="text-[11px] font-medium tracking-wider opacity-80">
                  {dateStr}
                </div>
                <div className="text-sm font-bold flex items-center justify-center gap-1 mt-0.5">
                  <span>Day {dayNum}</span>
                  {day.items.every((i) => i.completed) && totalCount > 0 && (
                    <span className="text-emerald-400 text-xs">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Highlights & Logistics Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FEF3C7]/40 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
              <span>{currentDay.date}</span>
              <span>·</span>
              <span>Day {currentDay.dayNumber} of 6</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#231F1E] mt-1">
              {currentDay.theme}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-[#6E655F]">當日行程達成度</div>
              <div className="font-mono text-sm font-bold text-[#231F1E]">
                {completedCount} / {totalCount} ({progressPct}%)
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-[#E8E2D9] flex items-center justify-center relative bg-[#FAF7F2]">
              <span className="text-xs font-bold text-[#D97706]">{progressPct}%</span>
            </div>
          </div>
        </div>

        {/* Stay & Luggage Briefing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4 text-xs">
          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EBE5DB]">
            <div className="flex items-center gap-1.5 font-bold text-[#231F1E] mb-1">
              <Building className="w-3.5 h-3.5 text-emerald-700" />
              <span>當晚住宿安排</span>
            </div>
            <p className="text-[#4B5563] leading-relaxed">{currentDay.stayLocation}</p>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EBE5DB]">
            <div className="flex items-center gap-1.5 font-bold text-[#231F1E] mb-1">
              <Package className="w-3.5 h-3.5 text-indigo-700" />
              <span>行李與動線重點</span>
            </div>
            <p className="text-[#4B5563] leading-relaxed">{currentDay.luggageStatus}</p>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EBE5DB] sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1.5 font-bold text-[#231F1E] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>首爾秋日天氣與穿搭建議</span>
            </div>
            <p className="text-[#4B5563] leading-relaxed">{currentDay.weatherTips}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Add Custom Note Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8E2D9] text-xs font-medium overflow-x-auto">
          {[
            { id: 'all', label: '全部' },
            { id: 'sightseeing', label: '📸 景點' },
            { id: 'shopping', label: '🛍️ 購物' },
            { id: 'food', label: '🍲 美食' },
            { id: 'concert', label: '🎤 演唱會' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#231F1E] text-white shadow-xs'
                  : 'text-[#6E655F] hover:text-[#231F1E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] hover:bg-[#FAF7F2] text-[#231F1E] px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#D97706]" />
          <span>新增行程筆記</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#E8E2D9] before:pointer-events-none">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemId === item.id;

          return (
            <div
              key={item.id}
              className={`group relative pl-12 transition-all ${
                item.completed ? 'opacity-70' : ''
              }`}
            >
              {/* Timeline Pin Indicator */}
              <button
                onClick={() => onToggleItem(selectedDay, item.id)}
                className="absolute left-3 top-3.5 z-10 w-5 h-5 rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform group-hover:scale-110 focus:outline-none"
                title={item.completed ? '標記為未完成' : '標記為已完成'}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                ) : (
                  <Circle className="w-5 h-5 text-[#C4B9A5] hover:text-[#D97706]" />
                )}
              </button>

              {/* Timeline Card */}
              <div
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs ${
                  item.completed
                    ? 'border-[#E8E2D9] bg-[#FAF7F2]/60'
                    : 'border-[#E8E2D9] hover:border-[#D97706]/60 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
                      <span className="font-mono font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md border border-[#FDE68A]">
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1 text-[#6E655F]">
                        {getCategoryIcon(item.category)}
                        <span>{getCategoryBadge(item.category)}</span>
                      </span>
                      <span className="text-[#C4B9A5]">·</span>
                      <span className="flex items-center gap-1 text-[#6E655F] truncate max-w-[200px] sm:max-w-none">
                        <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold text-[#231F1E] ${
                        item.completed ? 'line-through text-[#6E655F]' : ''
                      }`}
                    >
                      {item.title}
                    </h3>

                    {item.koreanTitle && (
                      <p className="text-xs font-medium text-[#92400E] mt-0.5">
                        {item.koreanTitle}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-[#4B5563] mt-2 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className="p-1 text-[#9CA3AF] hover:text-[#231F1E] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer shrink-0"
                    title={isExpanded ? '收合詳情' : '展開更多詳情'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details: Photo, Tax, and Transport Guide */}
                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-[#F0EAE1] space-y-2.5 text-xs">
                    {item.photoTip && (
                      <div className="bg-[#EBF5F0] text-[#1E3A2F] p-3 rounded-xl border border-[#D1E7DD] flex items-start gap-2.5">
                        <Camera className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-emerald-900 font-bold mb-0.5">
                            攝影取景與機位推薦
                          </strong>
                          <p className="leading-relaxed">{item.photoTip}</p>
                        </div>
                      </div>
                    )}

                    {item.shoppingOrTaxTip && (
                      <div className="bg-[#FEF3C7] text-[#92400E] p-3 rounded-xl border border-[#FDE68A] flex items-start gap-2.5">
                        <CreditCard className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-amber-950 font-bold mb-0.5">
                            購物、退稅與行李分流提示
                          </strong>
                          <p className="leading-relaxed">{item.shoppingOrTaxTip}</p>
                        </div>
                      </div>
                    )}

                    {item.transportInfo && (
                      <div className="bg-[#F0F4F8] text-[#1E293B] p-3 rounded-xl border border-[#E2E8F0] flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-sky-950 font-bold mb-0.5">
                            交通動線與乘車指南
                          </strong>
                          <p className="leading-relaxed">{item.transportInfo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Timeline Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                新增 Day {currentDay.dayNumber} 自訂行程備忘
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  行程標題 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 聖水洞必喝 Onion 咖啡外帶"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    預計時間
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 15:30"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    分類
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TimelineItem['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white"
                  >
                    <option value="sightseeing">📸 景點攝影</option>
                    <option value="shopping">🛍️ 購物採買</option>
                    <option value="food">🍲 美食餐廳</option>
                    <option value="concert">🎤 演唱會</option>
                    <option value="logistics">🧳 物流打包</option>
                    <option value="lodging">🏨 住宿</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  地點 / 地鐵出口
                </label>
                <input
                  type="text"
                  placeholder="例如: 聖水站 2號出口"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  備忘說明與細節
                </label>
                <textarea
                  rows={2}
                  placeholder="備註點餐、營業時間或拍照位置..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
