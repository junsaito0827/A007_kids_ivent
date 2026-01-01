import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { EventCard } from '@/components/EventCard';
import { mockEvents, areas, categories } from '@/lib/mockData';

export default function HomePage() {
  // 週末のイベント（モック）
  const weekendEvents = mockEvents.slice(0, 4);
  // 人気カテゴリ
  const popularCategories = [
    { name: '体験', icon: '🎪', color: 'from-[#FF6B35] to-[#FF8F65]' },
    { name: '公園', icon: '🌲', color: 'from-[#95E84C] to-[#A8F05F]' },
    { name: '科学', icon: '🔬', color: 'from-[#C44EE0] to-[#D77AE8]' },
    { name: '工作', icon: '✂️', color: 'from-[#FFE66D] to-[#FFED99]' },
    { name: '水族館', icon: '🐟', color: 'from-[#4ECDC4] to-[#7EDDD6]' },
    { name: '動物園', icon: '🦁', color: 'from-[#FF6B9D] to-[#FF9BBB]' },
  ];

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
        {/* デコレーション */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce-slow">🎈</div>
        <div className="absolute top-20 right-20 text-5xl opacity-20 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🎪</div>
        <div className="absolute bottom-10 left-1/4 text-4xl opacity-20 animate-bounce-slow" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute bottom-20 right-1/4 text-5xl opacity-20 animate-bounce-slow" style={{ animationDelay: '0.3s' }}>🎨</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 opacity-0 animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
              <span className="block">週末のお出かけ先を</span>
              <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] bg-clip-text text-transparent">
                見つけよう！
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              キッズ向けイベント、体験教室、公園など<br className="hidden sm:block" />
              お子様と一緒に楽しめるスポット情報が満載！
            </p>

            {/* 検索バー */}
            <div className="max-w-2xl mx-auto mb-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <SearchBar size="lg" placeholder="イベント名、エリア、キーワードで検索..." />
            </div>

            {/* 日付プリセット */}
            <div className="flex flex-wrap justify-center gap-3 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <Link
                href="/events?datePreset=today"
                className="chip bg-white/80 text-gray-700 hover:bg-white shadow-sm border border-gray-200"
              >
                <span>📅</span>
                <span>今日</span>
              </Link>
              <Link
                href="/events?datePreset=thisWeek"
                className="chip bg-white/80 text-gray-700 hover:bg-white shadow-sm border border-gray-200"
              >
                <span>🗓️</span>
                <span>今週</span>
              </Link>
              <Link
                href="/weekend"
                className="chip bg-[#FF6B35] text-white hover:bg-[#E55A25] shadow-md"
              >
                <span>🌟</span>
                <span>週末特集</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 波デコレーション */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path
              d="M0,80 C300,20 600,60 900,40 C1050,30 1150,50 1200,40 L1200,80 L0,80 Z"
              fill="#FFFBF5"
            />
          </svg>
        </div>
      </section>

      {/* お気に入り説明 */}
      <section className="py-8 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FF6B9D]/10 to-[#FFE66D]/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 border border-[#FF6B9D]/20">
            <span className="text-4xl">💝</span>
            <div className="text-center md:text-left">
              <p className="font-bold text-gray-800">会員登録なしでお気に入り保存OK！</p>
              <p className="text-sm text-gray-600">気になるイベントはハートマークで保存。LINE連携で端末引き継ぎも。</p>
            </div>
            <Link
              href="/favorites"
              className="btn-outline whitespace-nowrap text-sm"
            >
              お気に入りを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 人気カテゴリ */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center">
            <span className="mr-2">🎯</span>
            カテゴリから探す
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {popularCategories.map((cat, index) => (
              <Link
                key={cat.name}
                href={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group opacity-0 animate-fadeInUp"
                style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
              >
                <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-[#FF6B35] transition-colors">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* エリアから探す */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center">
            <span className="mr-2">📍</span>
            エリアから探す
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <Link
                key={area.slug}
                href={`/events?area=${area.slug}`}
                className="chip bg-[#4ECDC4]/10 text-[#3EBDB4] hover:bg-[#4ECDC4] hover:text-white transition-all"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 週末特集 */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
              <span className="mr-2">🌟</span>
              今週末のおすすめ
            </h2>
            <Link
              href="/weekend"
              className="text-[#FF6B35] font-bold hover:underline flex items-center gap-1"
            >
              もっと見る
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weekendEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F65] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            {/* デコレーション */}
            <div className="absolute top-4 left-8 text-6xl opacity-20">🎪</div>
            <div className="absolute bottom-4 right-8 text-6xl opacity-20">🎡</div>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 relative z-10">
              週末の予定、もう決まった？
            </h2>
            <p className="text-lg opacity-90 mb-8 relative z-10">
              お子様が喜ぶイベントがきっと見つかる！
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link
                href="/events"
                className="bg-white text-[#FF6B35] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg"
              >
                イベントを探す
              </Link>
              <Link
                href="/weekend"
                className="bg-[#FFE66D] text-[#B8860B] font-bold px-8 py-3 rounded-full hover:bg-[#FFED99] transition shadow-lg"
              >
                週末特集を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
