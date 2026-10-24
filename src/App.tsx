import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_ITINERARY, 
  DEFAULT_LOOT_ITEMS, 
  DEFAULT_CHECKLIST, 
  CARD_PROMOTIONS 
} from './data/defaultItinerary';
import { 
  DayItinerary, 
  LootItem, 
  ChecklistItem, 
  LuggageCategory, 
  TimelineItem 
} from './types/travel';
import { Header } from './components/Header';
import { ItineraryView } from './components/ItineraryView';
import { LuggageLootCalculator } from './components/LuggageLootCalculator';
import { CurrencyConverter } from './components/CurrencyConverter';
import { ChecklistAndPilgrimage } from './components/ChecklistAndPilgrimage';
import { DeployAndExportModal } from './components/DeployAndExportModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  Calendar, 
  Scale, 
  Coins, 
  CheckSquare, 
  Rocket, 
  Plane, 
  MapPin, 
  Sparkles, 
  RotateCcw,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'luggage' | 'currency' | 'checklist' | 'deploy'>('itinerary');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

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

  // 2. Loot Items State (including 15kg baggage allocations)
  const [lootItems, setLootItems] = useState<LootItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoul_loot_2026');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LOOT_ITEMS;
  });

  // 3. Checklist Items State
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('seoul_checklist_2026');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CHECKLIST;
  });

  // 4. Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('seoul_exchange_rate_2026');
      if (saved) return Number(saved) || 42.5;
    } catch {
      // fallback
    }
    return 42.5;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('seoul_itinerary_2026', JSON.stringify(itinerary));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [itinerary]);

  useEffect(() => {
    try {
      localStorage.setItem('seoul_loot_2026', JSON.stringify(lootItems));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [lootItems]);

  useEffect(() => {
    try {
      localStorage.setItem('seoul_checklist_2026', JSON.stringify(checklist));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [checklist]);

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

  // Handlers for Loot
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

  // Handlers for Checklist
  const handleToggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddChecklistItem = (item: Omit<ChecklistItem, 'id' | 'completed'>) => {
    const newItem: ChecklistItem = {
      ...item,
      id: `check-${Date.now()}`,
      completed: false,
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const handleResetChecklist = () => {
    if (window.confirm('確定要將所有打包與朝聖清單的打勾狀態重設為未完成嗎？')) {
      setChecklist((prev) => prev.map((item) => ({ ...item, completed: false })));
    }
  };

  const handleResetAllData = () => {
    if (window.confirm('確定要還原為原始預設行程與清單資料嗎？所有自訂項目將被重置。')) {
      setItinerary(DEFAULT_ITINERARY);
      setLootItems(DEFAULT_LOOT_ITEMS);
      setChecklist(DEFAULT_CHECKLIST);
      setExchangeRate(42.5);
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231F1E] flex flex-col pb-20 md:pb-12">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'deploy') {
            setIsDeployModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Editorial Trip Overview Banner */}
        <section className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle warm decorative foliage gradient */}
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gradient-to-br from-[#F59E0B]/20 via-[#D97706]/10 to-transparent blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#92400E] font-medium">
                <span className="font-bold tracking-wider">首爾 6 天 5 夜女性獨旅手冊</span>
                <span>·</span>
                <span>2026/10/29 (四) – 11/03 (二)</span>
                <span>·</span>
                <span className="bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  秋景 · 演唱會 · 戰利品
                </span>
              </div>

              <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#231F1E] tracking-tight text-balance">
                首爾秋日銀杏散策與戰利品手冊
              </h1>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                德壽宮石牆金黃銀杏、聖水洞與漢南洞潮流掃貨、INSPIRE Arena 演唱會震撼盛宴，搭配 15kg 託運防超重與超商寄集運倉全攻略。
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

        {activeTab === 'checklist' && (
          <ChecklistAndPilgrimage
            checklist={checklist}
            onToggleChecklistItem={handleToggleChecklistItem}
            onAddChecklistItem={handleAddChecklistItem}
            onResetCompleted={handleResetChecklist}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8E2D9] py-8 px-4 text-center text-xs text-[#6E655F]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Seoul Autumn Solo Travel Guide · 離線優先 PWA 手冊</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="hover:text-[#231F1E] underline cursor-pointer"
            >
              下載單檔 index.html 與 GitHub Pages CI/CD
            </button>
            <span>·</span>
            <button
              onClick={handleResetAllData}
              className="text-[#9CA3AF] hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>還原預設資料</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (Thumb Zone Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center min-w-[56px] min-h-[44px] cursor-pointer ${
            activeTab === 'itinerary' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">行程</span>
        </button>

        <button
          onClick={() => setActiveTab('luggage')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center min-w-[56px] min-h-[44px] cursor-pointer ${
            activeTab === 'luggage' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">15kg配重</span>
        </button>

        <button
          onClick={() => setActiveTab('currency')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center min-w-[56px] min-h-[44px] cursor-pointer ${
            activeTab === 'currency' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <Coins className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">匯率刷卡</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center min-w-[56px] min-h-[44px] cursor-pointer ${
            activeTab === 'checklist' ? 'text-[#D97706]' : 'text-[#6E655F]'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">打包朝聖</span>
        </button>

        <button
          onClick={() => setIsDeployModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center min-w-[56px] min-h-[44px] text-[#231F1E] cursor-pointer"
        >
          <Rocket className="w-5 h-5 mb-0.5 text-[#D97706]" />
          <span className="text-[10px] font-semibold">部署匯出</span>
        </button>
      </nav>

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* CI/CD & Deploy Export Modal */}
      <DeployAndExportModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        itinerary={itinerary}
        lootItems={lootItems}
        checklist={checklist}
        cards={CARD_PROMOTIONS}
        exchangeRate={exchangeRate}
      />
    </div>
  );
}
