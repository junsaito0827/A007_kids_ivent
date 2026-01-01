// イベント関連の型定義

export interface Area {
  slug: string;
  name: string;
}

export interface Venue {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface Age {
  min?: number;
  max?: number;
  label: string;
}

export interface Price {
  min?: number;
  max?: number;
  text: string;
}

export interface Reservation {
  required: boolean;
  method?: 'web' | 'phone' | 'walkin' | 'lottery' | 'unknown';
  reservationUrl?: string;
  deadlineAt?: string;
  note?: string;
}

export type EventStatus = 'Draft' | 'Staging' | 'Published' | 'Archived';

export interface Event {
  id: string;
  canonicalUrl: string;
  officialUrl: string;
  updatedAt: string;
  title: string;
  summary?: string;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  area?: Area;
  venue?: Venue;
  age?: Age;
  price?: Price;
  categories?: string[];
  tags?: string[];
  status: EventStatus;
  publishedAt?: string;
  reservation?: Reservation;
  xEligible?: boolean;
  lineEligible?: boolean;
  imageUrl?: string;
}

// 検索パラメータの型
export type DatePreset = 'today' | 'thisWeek' | 'weekend' | 'custom';
export type SortOption = 'recommended' | 'startAt' | 'updatedAt';

export interface SearchParams {
  q?: string;
  area?: string;
  age?: string;
  category?: string[];
  datePreset?: DatePreset;
  start?: string;
  end?: string;
  sort?: SortOption;
  cursor?: string;
  limit?: number;
}

// APIレスポンスの型
export interface EventListResponse {
  items: Event[];
  total: number;
  nextCursor?: string;
}

// お気に入りの型
export interface FavoriteState {
  eventIds: string[];
  lastUpdated: string;
}

// LINE連携の型
export interface LineUserState {
  lineUserId?: string;
  connected: boolean;
  connectedAt?: string;
}
