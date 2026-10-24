import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_ITINERARY, 
  DEFAULT_LOOT_ITEMS, 
  DEFAULT_PACKING_LIST, 
  DEFAULT_WISHLIST, 
  CARD_PROMOTIONS 
} from './data/defaultItinerary';
import { 
  DayItinerary, 
  LootItem, 
  PackingItem, 
  WishlistItem, 
  LuggageCategory, 
  TimelineItem 
} from './types/travel';
import { Header, MainTabType } from './components/Header';
import { ItineraryView } from './components/ItineraryView';
import { PreTripPackingView } from './components/PreTripPackingView';
import { InTripWishlistView } from './components/InTripWishlistView';
import { LuggageLootCalculator } from './components/LuggageLootCalculator';
import { CurrencyConverter } from './components/CurrencyConverter';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  Calendar, 
  Package, 
  Camera, 
  Scale, 
  Coins, 
  Plane, 
  MapPin, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('itinerary');

  // 1. Itinerary State
  const [itinerary, setItinerary] = useState<DayItinerary[]>(() => {
    try {
      const saved = localStorage.getItem('seoul_itinerary_2026');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ITINERARY;
  });

  // 2. Pre-trip Packing Checklist State
  const [packingList, setPackingList] = useState<PackingItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoul_packing_2026');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PACKING_LIST;
  });

  // 3. In-trip Pilgrimage & Wishlist State
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoul_wishlist_2026');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_WISHLIST;
  });

  // 4. Loot Items & 15kg Baggage State
  const [lootItems, setLootItems] = useState<LootItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoul_loot_2026');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LOOT_ITEMS;
  });

  // 5. Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('seoul_exchange_rate_2026');
      if (saved) return Number(saved) || 42.5;
    } catch {
      // fallback
    }
    return 42.5;
  });

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem('seoul_itinerary_2026', JSON.stringify(itinerary));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [itinerary]);

  useEffect(() => {
    try {
      localStorage.setItem('seoul_packing_2026', JSON.stringify(packingList));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [packingList]);

  useEffect(() => {
    try {
      localStorage.setItem('seoul_wishlist_2026', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('seoul_loot_2026', JSON.stringify(lootItems));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [lootItems]);

  useEffect(() => {
    try {
      localStorage.setItem('seoul_exchange_rate_2026', String(exchangeRate));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [exchangeRate]);

  // Handlers for Itinerary
  const handleToggleTimelineItem = (dayIndex: number, itemId: string) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[dayIndex] };
      targetDay.items = targetDay.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      updated[dayIndex] = targetDay;
      return updated;
    });
  };

  const handleAddTimelineItem = (
    dayIndex: number,
    newItem: Omit<TimelineItem, 'id' | 'completed'>
  ) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[dayIndex] };
      const generatedItem: TimelineItem = {
        ...newItem,
        id: `custom-${Date.now()}`,
        completed: false,
      };
      targetDay.items = [...targetDay.items, generatedItem];
      updated[dayIndex] = targetDay;
      return updated;
    });
  };

  const handleEditTimelineItem = (
    dayIndex: number,
    itemId: string,
    updatedFields: Partial<TimelineItem>
  ) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[dayIndex] };
      targetDay.items = targetDay.items.map((item) =>
        item.id === itemId ? { ...item, ...updatedFields } : item
      );
      updated[dayIndex] = targetDay;
      return updated;
    });
  };

  const handleDeleteTimelineItem = (dayIndex: number, itemId: string) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[dayIndex] };
      targetDay.items = targetDay.items.filter((item) => item.id !== itemId);
      updated[dayIndex] = targetDay;
      return updated;
    });
  };

  const handleMoveTimelineItemToDay = (
    fromDayIndex: number,
    toDayIndex: number,
    itemId: string
  ) => {
    if (fromDayIndex === toDayIndex) return;
    setItinerary((prev) => {
      const updated = [...prev];
      const sourceDay = { ...updated[fromDayIndex] };
      const destDay = { ...updated[toDayIndex] };

      const itemToMove = sourceDay.items.find((i) => i.id === itemId);
      if (!itemToMove) return prev;

      sourceDay.items = sourceDay.items.filter((i) => i.id !== itemId);
      destDay.items = [...destDay.items, itemToMove];

      updated[fromDayIndex] = sourceDay;
      updated[toDayIndex] = destDay;
      return updated;
    });
  };

  // Handlers for Pre-trip Packing List
  const handleTogglePackingItem = (id: string) => {
    setPackingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddPackingItem = (item: Omit<PackingItem, 'id' | 'completed'>) => {
    const newItem: PackingItem = {
      ...item,
      id: `pack-${Date.now()}`,
      completed: false,
    };
    setPackingList((prev) => [newItem, ...prev]);
  };

  const handleDeletePackingItem = (id: string) => {
    setPackingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetPackingList = () => {
    if (window.confirm('確定要將行前打包清單的所有打勾項目重設為未勾選嗎？')) {
      setPackingList((prev) => prev.map((item) => ({ ...item, completed: false })));
    }
  };

  // Handlers for In-trip Wishlist
  const handleToggleWishlistItem = (id: string) => {
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddWishlistItem = (item: Omit<WishlistItem, 'id' | 'completed'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: `wish-${Date.now()}`,
      completed: false,
    };
    setWishlist((prev) => [newItem, ...prev]);
  };

  const handleDeleteWishlistItem = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetWishlist = () => {
    if (window.confirm('確定要將朝聖與心願清單的所有打勾狀態重設為未打卡嗎？')) {
      setWishlist((prev) => prev.map((item) => ({ ...item, completed: false })));
    }
  };

  // Handlers for Loot & Luggage
  const handleAddLootItem = (item: Omit<LootItem, 'id'>) => {
    const newItem: LootItem = {
      ...item,
      id: `loot-${Date.now()}`,
    };
    setLootItems((prev) => [newItem, ...prev]);
  };

  const handleToggleLootPurchased = (id: string) => {
    setLootItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const handleChangeLootAllocation = (id: string, allocation: LuggageCategory) => {
    setLootItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, allocation } : item))
    );
  };

  const handleDeleteLootItem = (id: string) => {
    setLootItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset all to defaults
  const handleResetAllData = () => {
    if (window.confirm('確定要還原為原始行程與清單資料嗎？所有自訂修改將被還原。')) {
      setItinerary(DEFAULT_ITINERARY);
      setPackingList(DEFAULT_PACKING_LIST);
      setWishlist(DEFAULT_WISHLIST);
      setLootItems(DEFAULT_LOOT_ITEMS);
      setExchangeRate(42.5);
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231F1E] flex flex-col pb-20 md:pb-12">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Editorial Trip Overview Banner */}
        <section className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gradient-to-br from-[#F59E0B]/20 via-[#D97706]/10 to-transparent blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#92400E] font-medium">
                <span className="font-bold tracking-wider">首爾 6 天 5 夜自由行計畫</span>
                <span>·</span>
                <span>2026/10/29 (四) – 11/03 (二)</span>
                <span>·</span>
                <span className="bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  秋景 · 演唱會 · 戰利品
                </span>
              </div>

              <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#231F1E] tracking-tight text-balance">
                首爾秋日銀杏散策與旅行計畫
              </h1>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                德壽宮石牆金黃銀杏、聖水洞與漢南洞潮流探索、INSPIRE Arena 演唱會盛宴。每個景點支援一鍵複製地址電話與連動 Google / Naver Map，行程隨心彈性調度！
              </p>
            </div>

            {/* Flight & Lodging Anchor Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs shrink-0">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E2D9]">
                <div className="flex items-center gap-1.5 font-bold text-[#231F1E] mb-1">
                  <Plane className="w-3.5 h-3.5 text-sky-700" />
                  <span>往返航班</span>
                </div>
                <div className="text-[11px] text-[#4B5563] font-mono">
                  ZE888 抵 GMP 17:25<br />
                  ZE887 起 GMP 11:00
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E2D9]">
                <div className="flex items-center gap-1.5 font-bold text-[#231F1E] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>住宿分佈</span>
                </div>
                <div className="text-[11px] text-[#4B5563]">
                  10/29, 11/1-2 堂山朋友家<br />
                  10/30-31 孔德 GLAD Mapo
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E2D9] col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 font-bold text-[#231F1E] mb-1">
                  <Scale className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>行李限重策略</span>
                </div>
                <div className="text-[11px] text-[#4B5563]">
                  20吋託運 15kg (液體)<br />
                  隨身 10kg + 超商集運倉
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Content Rendering */}
        {activeTab === 'itinerary' && (
          <ItineraryView
            itinerary={itinerary}
            onToggleItem={handleToggleTimelineItem}
            onAddItem={handleAddTimelineItem}
            onEditItem={handleEditTimelineItem}
            onDeleteItem={handleDeleteTimelineItem}
            onMoveItemToDay={handleMoveTimelineItemToDay}
          />
        )}

        {activeTab === 'packing' && (
          <PreTripPackingView
            packingList={packingList}
            lootItems={lootItems}
            onToggleItem={handleTogglePackingItem}
            onAddItem={handleAddPackingItem}
            onDeleteItem={handleDeletePackingItem}
            onResetCompleted={handleResetPackingList}
            onChangeLootAllocation={handleChangeLootAllocation}
          />
        )}

        {activeTab === 'wishlist' && (
          <InTripWishlistView
            wishlist={wishlist}
            onToggleItem={handleToggleWishlistItem}
            onAddItem={handleAddWishlistItem}
            onDeleteItem={handleDeleteWishlistItem}
            onResetCompleted={handleResetWishlist}
          />
        )}

        {activeTab === 'luggage' && (
          <LuggageLootCalculator
            lootItems={lootItems}
            exchangeRate={exchangeRate}
            onAddLootItem={handleAddLootItem}
            onTogglePurchased={handleToggleLootPurchased}
            onChangeAllocation={handleChangeLootAllocation}
            onDeleteLootItem={handleDeleteLootItem}
          />
        )}

        {activeTab === 'currency' && (
          <CurrencyConverter
            exchangeRate={exchangeRate}
            onUpdateRate={setExchangeRate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8E2D9] py-8 px-4 text-center text-xs text-[#6E655F]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Seoul Autumn Solo Travel Guide · 離線優先隨身旅遊計畫手冊</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('itinerary')}
              className="hover:text-[#231F1E] cursor-pointer"
            >
              每日行程
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('packing')}
              className="hover:text-[#231F1E] cursor-pointer"
            >
              行前打包
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('wishlist')}
              className="hover:text-[#231F1E] cursor-pointer"
            >
              朝聖心願
            </button>
            <span>·</span>
            <button
              onClick={handleResetAllData}
              className="text-[#9CA3AF] hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
              title="還原所有預設資料"
            >
              <RotateCcw className="w-3 h-3" />
              <span>還原預設資料</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (Thumb Zone Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-center min-w-[54px] min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'itinerary' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">行程</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-center min-w-[54px] min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'packing' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">打包</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-center min-w-[54px] min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'wishlist' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">朝聖</span>
        </button>

        <button
          onClick={() => setActiveTab('luggage')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-center min-w-[54px] min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'luggage' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">配重</span>
        </button>

        <button
          onClick={() => setActiveTab('currency')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-center min-w-[54px] min-h-[44px] cursor-pointer transition-colors ${
            activeTab === 'currency' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Coins className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">匯率</span>
        </button>
      </nav>

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />
    </div>
  );
}
