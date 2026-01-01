'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { EventCard } from '@/components/EventCard';
import { mockEvents, areas, categories, ageRanges } from '@/lib/mockData';
import { DatePreset, SortOption } from '@/types/event';

function EventsContent() {
  const searchParams = useSearchParams();

  // URLパラメータから初期値を取得
  const initialQuery = searchParams.get('q') || '';
  const initialArea = searchParams.get('area') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialDatePreset = (searchParams.get('datePreset') as DatePreset) || '';
  const initialAge = searchParams.get('age') || '';

  // フィルター状態
  const [selectedArea, setSelectedArea] = useState<string[]>(initialArea ? [initialArea] : []);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedDatePreset, setSelectedDatePreset] = useState<string[]>(initialDatePreset ? [initialDatePreset] : []);
  const [selectedAge, setSelectedAge] = useState<string[]>(initialAge ? [initialAge] : []);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showFilters, setShowFilters] = useState(false);

  // 日付プリセット
  const datePresetChips = [
    { value: 'today', label: '今日', icon: '📅' },
    { value: 'thisWeek', label: '今週', icon: '🗓️' },
    { value: 'weekend', label: '週末', icon: '🌟' },
  ];

  // フィルタリング
  const filteredEvents = useMemo(() => {
    let result = [...mockEvents];

    // エリアフィルタ
    if (selectedArea.length > 0) {
      result = result.filter((e) => e.area && selectedArea.includes(e.area.slug));
    }

    // カテゴリフィルタ
    if (selectedCategory.length > 0) {
      result = result.filter((e) =>
        e.categories?.some((cat) => selectedCategory.includes(cat))
      );
    }

    // ソート
    if (sortBy === 'startAt') {
      result.sort((a, b) => {
        if (!a.startAt) return 1;
        if (!b.startAt) return -1;
        return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      });
    } else if (sortBy === 'updatedAt') {
      result.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    }

    return result;
  }, [selectedArea, selectedCategory, sortBy]);

  // フィルターをリセット
  const resetFilters = () => {
    setSelectedArea([]);
    setSelectedCategory([]);
    setSelectedDatePreset([]);
    setSelectedAge([]);
  };

  const hasFilters =
    selectedArea.length > 0 ||
    selectedCategory.length > 0 ||
    selectedDatePreset.length > 0 ||
    selectedAge.length > 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            <span className="mr-2">🔍</span>
            イベントを探す
          </h1>

          {/* 検索バー */}
          <div className="mb-6">
            <SearchBar defaultValue={initialQuery} />
          </div>

          {/* 日付プリセット */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-gray-600">日付:</span>
            <FilterChips
              chips={datePresetChips}
              selectedValues={selectedDatePreset}
              onChange={setSelectedDatePreset}
              variant="primary"
            />
          </div>

          {/* フィルターの展開/折りたたみ */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[#FF6B35] font-semibold mb-4 hover:underline"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            詳細フィルター
          </button>

          {/* 詳細フィルター */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6 space-y-6 animate-fadeIn">
              {/* エリア */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>📍</span> エリア
                </h3>
                <FilterChips
                  chips={areas.map((a) => ({ value: a.slug, label: a.name }))}
                  selectedValues={selectedArea}
                  onChange={setSelectedArea}
                  multiSelect
                  variant="secondary"
                />
              </div>

              {/* カテゴリ */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>🏷️</span> カテゴリ
                </h3>
                <FilterChips
                  chips={categories.map((c) => ({ value: c, label: c }))}
                  selectedValues={selectedCategory}
                  onChange={setSelectedCategory}
                  multiSelect
                  variant="outline"
                />
              </div>

              {/* 年齢 */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>👶</span> 対象年齢
                </h3>
                <FilterChips
                  chips={ageRanges.map((a) => ({ value: a.value, label: a.label }))}
                  selectedValues={selectedAge}
                  onChange={setSelectedAge}
                  multiSelect
                  variant="outline"
                />
              </div>

              {/* フィルタークリア */}
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-[#FF6B35] font-semibold"
                >
                  フィルターをクリア
                </button>
              )}
            </div>
          )}

          {/* 結果件数とソート */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-gray-600">
              <span className="font-bold text-[#FF6B35] text-xl">{filteredEvents.length}</span>
              <span className="ml-1">件のイベント</span>
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">並び替え:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#FF6B35]"
              >
                <option value="recommended">おすすめ順</option>
                <option value="startAt">開催日順</option>
                <option value="updatedAt">更新日順</option>
              </select>
            </div>
          </div>
        </div>

        {/* イベント一覧 */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          /* 0件UI */
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              該当するイベントが見つかりませんでした
            </h2>
            <p className="text-gray-600 mb-8">
              条件を変更するか、週末特集をご覧ください
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={resetFilters}
                className="btn-outline"
              >
                フィルターをクリア
              </button>
              <Link href="/weekend" className="btn-primary">
                週末特集を見る
              </Link>
            </div>

            {/* おすすめカテゴリ */}
            <div className="mt-12">
              <p className="text-sm text-gray-500 mb-4">人気のカテゴリから探す</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['体験', '公園', '科学', '動物園'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/events?category=${encodeURIComponent(cat)}`}
                    className="chip chip-primary"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce-slow mb-4">🔍</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
