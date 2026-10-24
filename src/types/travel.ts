export type LuggageCategory = 'checked_15kg' | 'carryon_10kg' | 'courier_box';

export type PaymentMethod = 'dbs_eco' | 'fubon_j' | 'cathay_cube' | 'ctbc_linepay' | 'twqr' | 'cash';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  koreanTitle?: string;
  category: 'flight' | 'lodging' | 'sightseeing' | 'shopping' | 'food' | 'concert' | 'logistics';
  location: string;
  description: string;
  photoTip?: string;
  shoppingOrTaxTip?: string;
  transportInfo?: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  date: string; // e.g. "2026/10/29 (四)"
  theme: string;
  stayLocation: string; // "堂山朋友家" or "GLAD Hotel Mapo"
  luggageStatus: string;
  weatherTips: string;
  items: TimelineItem[];
}

export interface LootItem {
  id: string;
  name: string;
  brandOrStore: string;
  priceKrw: number;
  weightGrams: number;
  category: 'liquid_cosmetics' | 'clothing_apparel' | 'shoes_boxes' | 'badminton' | 'snacks_food' | 'general';
  allocation: LuggageCategory; // checked_15kg | carryon_10kg | courier_box
  paymentMethod: PaymentMethod;
  purchased: boolean;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  category: 'carryon' | 'checked' | 'pilgrimage' | 'shopping_target' | 'documents';
  title: string;
  subtitle?: string;
  completed: boolean;
  mustCheck?: boolean;
}

export interface CardPromotion {
  id: PaymentMethod;
  name: string;
  issuer: string;
  rewardRate: string;
  highlights: string;
  suitableFor: string;
  badgeColor: string;
}
