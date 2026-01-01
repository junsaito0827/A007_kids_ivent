import Link from 'next/link';
import { EventCard } from '@/components/EventCard';
import { mockEvents, areas } from '@/lib/mockData';

export default function WeekendPage() {
  // 週末の日付を計算（土曜・日曜）
  const getWeekendDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysUntilSaturday);
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    const formatDate = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      return `${month}/${day}(${weekday})`;
    };

    return {
      saturday: formatDate(saturday),
      sunday: formatDate(sunday),
      saturdayFull: saturday.toISOString().split('T')[0],
      sundayFull: sunday.toISOString().split('T')[0],
    };
  };

  const weekend = getWeekendDates();

  // 週末イベント（モック）
  const weekendEvents = mockEvents;

  // 特集セクション（エディターズピック）
  const featuredEvents = mockEvents.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFE66D]/30 via-[#FF6B9D]/20 to-[#4ECDC4]/30 py-12 md:py-16">
        {/* デコレーション */}
        <div className="absolute top-8 left-8 text-5xl opacity-30 animate-bounce-slow">🌟</div>
        <div className="absolute top-12 right-12 text-4xl opacity-30 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🎪</div>
        <div className="absolute bottom-8 left-1/4 text-4xl opacity-30 animate-bounce-slow" style={{ animationDelay: '0.3s' }}>🎈</div>
        <div className="absolute bottom-12 right-1/4 text-5xl opacity-30 animate-bounce-slow" style={{ animationDelay: '0.7s' }}>🎨</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full mb-4 shadow-sm">
              <span className="text-xl">🗓️</span>
              <span className="font-bold text-gray-700">
                {weekend.saturday} - {weekend.sunday}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
              <span className="mr-2">🌟</span>
              週末特集
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              今週末のお出かけ先を見つけよう！<br className="hidden sm:block" />
              お子様と一緒に楽しめるイベントを厳選してお届けします。
            </p>
          </div>
        </div>

        {/* 波デコレーション */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path
              d="M0,60 C300,20 600,50 900,35 C1050,25 1150,40 1200,35 L1200,60 L0,60 Z"
              fill="#FFFBF5"
            />
          </svg>
        </div>
      </section>

      {/* エリア絞り込み */}
      <section className="py-8 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
              <span>📍</span> エリアで絞り込む:
            </span>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/weekend"
                className="chip bg-[#FF6B35] text-white"
              >
                すべて
              </Link>
              {areas.slice(0, 5).map((area) => (
                <Link
                  key={area.slug}
                  href={`/events?datePreset=weekend&area=${area.slug}`}
                  className="chip bg-white text-gray-600 border border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 編集部のおすすめ */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] flex items-center justify-center">
              <span className="text-white text-lg">✨</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">編集部のおすすめ</h2>
              <p className="text-sm text-gray-500">今週末のイチオシイベント</p>
            </div>
          </div>

          {/* 特集カード（大きめ表示） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredEvents.map((event, index) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
              >
                {/* バックグラウンド */}
                <div className="h-48 bg-gradient-to-br from-[#FFE66D]/40 to-[#4ECDC4]/40 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-40 group-hover:scale-110 transition-transform">
                      {event.categories?.[0] === '体験' && '🎪'}
                      {event.categories?.[0] === '自然' && '🌳'}
                      {event.categories?.[0] === '学習' && '📚'}
                      {event.categories?.[0] === '科学' && '🔬'}
                      {event.categories?.[0] === 'アウトドア' && '⛺'}
                      {event.categories?.[0] === '公園' && '🌲'}
                      {event.categories?.[0] === '工作' && '✂️'}
                      {event.categories?.[0] === 'ワークショップ' && '🎨'}
                      {event.categories?.[0] === '水族館' && '🐟'}
                      {event.categories?.[0] === '動物園' && '🦁'}
                      {!event.categories?.[0] && '🎈'}
                    </span>
                  </div>
                  {/* ランキングバッジ */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#FF6B35] text-white font-bold flex items-center justify-center text-sm shadow">
                    {index + 1}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#FF6B35] transition-colors mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📍 {event.area?.name}</span>
                    <span>·</span>
                    <span>👶 {event.age?.label}</span>
                  </div>
                  <div className="mt-3 font-bold text-[#FF6B35]">
                    {event.price?.text}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 全イベント一覧 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800">
              <span className="mr-2">📋</span>
              週末のイベント一覧
            </h2>
            <span className="text-gray-500">
              <span className="font-bold text-[#FF6B35]">{weekendEvents.length}</span> 件
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weekendEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* LINE通知CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#06C755] to-[#00B900] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* LINEロゴ風デコレーション */}
            <div className="absolute top-4 right-8 text-6xl opacity-20">💬</div>
            <div className="absolute bottom-4 left-8 text-5xl opacity-20">📱</div>

            <div className="relative z-10 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                  週末特集をLINEで受け取ろう！
                </h2>
                <p className="opacity-90">
                  毎週木曜にお届け。お出かけの計画に便利！
                </p>
              </div>
              <Link
                href="/connect/line"
                className="inline-block bg-white text-[#06C755] font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition shadow-lg"
              >
                LINE連携する
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
