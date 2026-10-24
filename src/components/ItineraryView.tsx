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
  Info,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Navigation
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  onToggleItem: (dayIndex: number, itemId: string) => void;
  onAddItem: (dayIndex: number, newItem: Omit<TimelineItem, 'id' | 'completed'>) => void;
  onEditItem: (dayIndex: number, itemId: string, updatedFields: Partial<TimelineItem>) => void;
  onDeleteItem: (dayIndex: number, itemId: string) => void;
  onMoveItemToDay: (fromDayIndex: number, toDayIndex: number, itemId: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onToggleItem,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItemToDay,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{ dayIndex: number; item: TimelineItem } | null>(null);
  const [movingItem, setMovingItem] = useState<{ dayIndex: number; item: TimelineItem } | null>(null);

  // Form states for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formKoreanTitle, setFormKoreanTitle] = useState('');
  const [formTime, setFormTime] = useState('14:00');
  const [formLocation, setFormLocation] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formOpeningHours, setFormOpeningHours] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPhotoTip, setFormPhotoTip] = useState('');
  const [formShoppingTip, setFormShoppingTip] = useState('');
  const [formTransportInfo, setFormTransportInfo] = useState('');
  const [formCategory, setFormCategory] = useState<TimelineItem['category']>('sightseeing');

  const currentDay = itinerary[selectedDay];

  const handleCopy = (text: string, key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openAddModal = () => {
    setFormTitle('');
    setFormKoreanTitle('');
    setFormTime('14:00');
    setFormLocation('');
    setFormAddress('');
    setFormPhone('');
    setFormOpeningHours('');
    setFormDesc('');
    setFormPhotoTip('');
    setFormShoppingTip('');
    setFormTransportInfo('');
    setFormCategory('sightseeing');
    setShowAddModal(true);
  };

  const openEditModal = (dayIndex: number, item: TimelineItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem({ dayIndex, item });
    setFormTitle(item.title);
    setFormKoreanTitle(item.koreanTitle || '');
    setFormTime(item.time);
    setFormLocation(item.location);
    setFormAddress(item.address || '');
    setFormPhone(item.phone || '');
    setFormOpeningHours(item.openingHours || '');
    setFormDesc(item.description);
    setFormPhotoTip(item.photoTip || '');
    setFormShoppingTip(item.shoppingOrTaxTip || '');
    setFormTransportInfo(item.transportInfo || '');
    setFormCategory(item.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formTitle.trim()) return;

    onEditItem(editingItem.dayIndex, editingItem.item.id, {
      title: formTitle.trim(),
      koreanTitle: formKoreanTitle.trim() || undefined,
      time: formTime.trim(),
      location: formLocation.trim() || '首爾市區',
      address: formAddress.trim() || undefined,
      phone: formPhone.trim() || undefined,
      openingHours: formOpeningHours.trim() || undefined,
      description: formDesc.trim(),
      photoTip: formPhotoTip.trim() || undefined,
      shoppingOrTaxTip: formShoppingTip.trim() || undefined,
      transportInfo: formTransportInfo.trim() || undefined,
      category: formCategory,
      googleMapsQuery: formLocation.trim() || formTitle.trim(),
      naverMapQuery: formKoreanTitle.trim() || formTitle.trim(),
    });

    setEditingItem(null);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    onAddItem(selectedDay, {
      title: formTitle.trim(),
      koreanTitle: formKoreanTitle.trim() || undefined,
      time: formTime.trim() || '任意時段',
      location: formLocation.trim() || '首爾市區',
      address: formAddress.trim() || undefined,
      phone: formPhone.trim() || undefined,
      openingHours: formOpeningHours.trim() || undefined,
      description: formDesc.trim() || '自訂備忘行程',
      photoTip: formPhotoTip.trim() || undefined,
      shoppingOrTaxTip: formShoppingTip.trim() || undefined,
      transportInfo: formTransportInfo.trim() || undefined,
      category: formCategory,
      googleMapsQuery: formLocation.trim() || formTitle.trim(),
      naverMapQuery: formKoreanTitle.trim() || formTitle.trim(),
      isCustom: true,
    });

    setShowAddModal(false);
  };

  const handleDelete = (dayIndex: number, itemId: string, itemTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`確定要刪除「${itemTitle}」這個行程景點嗎？`)) {
      onDeleteItem(dayIndex, itemId);
      if (expandedItemId === itemId) setExpandedItemId(null);
    }
  };

  const handleConfirmMove = (targetDayIdx: number) => {
    if (!movingItem) return;
    onMoveItemToDay(movingItem.dayIndex, targetDayIdx, movingItem.item.id);
    setMovingItem(null);
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
            const dayCompleted = day.items.length > 0 && day.items.every((i) => i.completed);

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
                  {dayCompleted && (
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
            { id: 'lodging', label: '🏨 住宿/交通' },
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
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-[#231F1E] hover:bg-[#3D3734] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#FDE68A]" />
          <span>新增行程景點</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#E8E2D9] before:pointer-events-none">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            item.googleMapsQuery || `${item.location} Seoul`
          )}`;
          const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
            item.naverMapQuery || item.koreanTitle || item.title
          )}`;

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
                onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs cursor-pointer ${
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

                    <div className="flex items-baseline gap-2">
                      <h3
                        className={`text-base font-bold text-[#231F1E] ${
                          item.completed ? 'line-through text-[#6E655F]' : ''
                        }`}
                      >
                        {item.title}
                      </h3>
                      {item.isCustom && (
                        <span className="text-[10px] font-semibold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.2 rounded">
                          自訂
                        </span>
                      )}
                    </div>

                    {item.koreanTitle && (
                      <p className="text-xs font-medium text-[#92400E] mt-0.5">
                        {item.koreanTitle}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-[#4B5563] mt-2 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Right: Move / Edit / Delete / Expand */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMovingItem({ dayIndex: selectedDay, item });
                      }}
                      className="p-1.5 text-[#6E655F] hover:text-[#D97706] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      title="移至其他天"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => openEditModal(selectedDay, item, e)}
                      className="p-1.5 text-[#6E655F] hover:text-[#231F1E] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      title="編輯景點資訊"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(selectedDay, item.id, item.title, e)}
                      className="p-1.5 text-[#9CA3AF] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="刪除景點"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedItemId(isExpanded ? null : item.id);
                      }}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#231F1E] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      title={isExpanded ? '收合詳情' : '點開查看地圖、電話與詳細資訊'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Maps, Address, Phone, Photo & Tips */}
                {isExpanded && (
                  <div
                    className="mt-4 pt-3.5 border-t border-[#F0EAE1] space-y-3 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Maps & Navigation Action Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#4285F4]/10 text-[#1967D2] hover:bg-[#4285F4]/20 border border-[#4285F4]/30 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Google Maps 導航</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                      </a>

                      <a
                        href={naverMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#03C75A]/10 text-[#008A3B] hover:bg-[#03C75A]/20 border border-[#03C75A]/30 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Naver Map 韓文地圖</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                      </a>
                    </div>

                    {/* Address & Phone with One-Click Copy */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]">
                      {item.address ? (
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-[#4B5563] block text-[11px]">
                              📍 詳細地址：
                            </span>
                            <span className="text-[#231F1E] font-medium leading-relaxed select-all">
                              {item.address}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleCopy(item.address!, `addr-${item.id}`, e)}
                            className="flex items-center gap-1 text-[#D97706] hover:text-[#B45309] font-bold text-[11px] bg-white border border-[#E8E2D9] px-2 py-1 rounded-md shrink-0 cursor-pointer shadow-2xs mt-0.5"
                            title="複製地址"
                          >
                            {copiedKey === `addr-${item.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">已複製</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>複製</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-[#9CA3AF] italic">尚無詳細地址資料</div>
                      )}

                      {item.phone ? (
                        <div className="flex items-start justify-between gap-2 border-t sm:border-t-0 sm:border-l border-[#E8E2D9] pt-2 sm:pt-0 sm:pl-3">
                          <div>
                            <span className="font-bold text-[#4B5563] block text-[11px]">
                              📞 聯絡電話：
                            </span>
                            <a
                              href={`tel:${item.phone}`}
                              className="text-[#231F1E] font-mono font-semibold hover:underline"
                            >
                              {item.phone}
                            </a>
                          </div>
                          <button
                            onClick={(e) => handleCopy(item.phone!, `phone-${item.id}`, e)}
                            className="flex items-center gap-1 text-[#D97706] hover:text-[#B45309] font-bold text-[11px] bg-white border border-[#E8E2D9] px-2 py-1 rounded-md shrink-0 cursor-pointer shadow-2xs mt-0.5"
                            title="複製電話"
                          >
                            {copiedKey === `phone-${item.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">已複製</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>複製</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-[#9CA3AF] italic border-t sm:border-t-0 sm:border-l border-[#E8E2D9] pt-2 sm:pt-0 sm:pl-3">
                          尚無電話號碼
                        </div>
                      )}
                    </div>

                    {/* Opening Hours */}
                    {item.openingHours && (
                      <div className="flex items-center gap-2 text-[#4B5563] bg-white p-2.5 rounded-lg border border-[#E8E2D9]">
                        <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                        <span className="font-bold text-[#231F1E]">營業時間：</span>
                        <span>{item.openingHours}</span>
                      </div>
                    )}

                    {/* Photo Guide */}
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

                    {/* Tax & Shopping Tips */}
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

                    {/* Transport Info */}
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

      {/* Move Item to Another Day Modal */}
      {movingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                將行程移至其他天
              </h3>
              <button
                onClick={() => setMovingItem(null)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-[#6E655F] mb-3">
                欲將 <strong className="text-[#231F1E]">「{movingItem.item.title}」</strong> 移至哪一天？
              </p>

              <div className="space-y-2">
                {itinerary.map((day, dIdx) => (
                  <button
                    key={day.dayNumber}
                    disabled={dIdx === movingItem.dayIndex}
                    onClick={() => handleConfirmMove(dIdx)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      dIdx === movingItem.dayIndex
                        ? 'bg-[#FAF7F2] text-[#9CA3AF] border-[#E8E2D9] cursor-not-allowed opacity-50'
                        : 'bg-white hover:bg-[#FEF3C7] text-[#231F1E] border-[#E8E2D9] hover:border-[#D97706]'
                    }`}
                  >
                    <span>Day {day.dayNumber} ({day.date.split(' ')[0]})</span>
                    <span className="text-[11px] font-normal text-[#6E655F]">
                      {dIdx === movingItem.dayIndex ? '目前所屬' : '點擊移至此天 ➔'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMovingItem(null)}
              className="mt-4 w-full py-2 rounded-xl border border-[#E8E2D9] text-xs font-semibold text-[#6E655F] hover:bg-[#FAF7F2] cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9] my-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                編輯景點行程資訊
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    景點/活動名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    時間 (例如 14:00)
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm font-mono focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    韓文原名 (方便導航/問路)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 덕수궁 돌담길"
                    value={formKoreanTitle}
                    onChange={(e) => setFormKoreanTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    分類
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TimelineItem['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white cursor-pointer"
                  >
                    <option value="sightseeing">📸 景點攝影</option>
                    <option value="shopping">🛍️ 購物採買</option>
                    <option value="food">🍲 美食餐廳</option>
                    <option value="concert">🎤 演唱會</option>
                    <option value="logistics">🧳 物流打包</option>
                    <option value="lodging">🏨 住宿</option>
                    <option value="flight">✈️ 航班/出入境</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  詳細地址 (支援一鍵複製)
                </label>
                <input
                  type="text"
                  placeholder="例如: 首爾特別市中區世宗大路 99"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    電話號碼 (支援一鍵複製)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 02-771-9951"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm font-mono focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    營業時間
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 09:00 - 21:00 (週一休館)"
                    value={formOpeningHours}
                    onChange={(e) => setFormOpeningHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  行程說明與備忘
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  攝影機位取景指南
                </label>
                <input
                  type="text"
                  placeholder="例如: 長焦低角度由地面落葉往上仰拍"
                  value={formPhotoTip}
                  onChange={(e) => setFormPhotoTip(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  購物 / 退稅 / 行李提示
                </label>
                <input
                  type="text"
                  placeholder="例如: 滿3萬可退稅、香水需託運"
                  value={formShoppingTip}
                  onChange={(e) => setFormShoppingTip(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8E2D9] text-xs font-semibold text-[#6E655F] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#231F1E] text-white text-xs font-semibold hover:bg-[#3D3734] cursor-pointer"
                >
                  儲存變更
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E2D9] my-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-editorial text-lg font-bold text-[#231F1E]">
                新增 Day {currentDay.dayNumber} 行程景點
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9CA3AF] hover:text-[#231F1E] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    景點/活動名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 聖水洞 Onion 麵包咖啡"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    預計時間
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 15:30"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm font-mono focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    韓文原名 (方便導航/問路)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 카페 어니언 성수"
                    value={formKoreanTitle}
                    onChange={(e) => setFormKoreanTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    分類
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TimelineItem['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706] bg-white cursor-pointer"
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
                  詳細地址 (支援一鍵複製)
                </label>
                <input
                  type="text"
                  placeholder="例如: 首爾特別市城東區峨嵯山路9街 8"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    電話號碼 (支援一鍵複製)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 02-1644-1941"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm font-mono focus:outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5563] mb-1">
                    營業時間
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 08:00 - 22:00"
                    value={formOpeningHours}
                    onChange={(e) => setFormOpeningHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  行程說明與備忘
                </label>
                <textarea
                  rows={2}
                  placeholder="備註點餐、重要提醒或同行約定..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  攝影取景筆記 (選填)
                </label>
                <input
                  type="text"
                  placeholder="例如: 頂樓露台廢墟紅磚光影"
                  value={formPhotoTip}
                  onChange={(e) => setFormPhotoTip(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#E8E2D9]">
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
