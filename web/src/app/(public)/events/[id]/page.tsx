'use client';

import { use } from 'react';
import Link from 'next/link';
import { FavoriteButton } from '@/components/FavoriteButton';
import { mockEvents } from '@/lib/mockData';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            イベントが見つかりませんでした
          </h1>
          <Link href="/events" className="btn-primary">
            イベント一覧へ戻る
          </Link>
        </div>
      </div>
    );
  }

  // 日付フォーマット
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年${month}月${day}日(${weekday})`;
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Xシェア用URL
  const shareText = encodeURIComponent(`${event.title} | キッズお出かけ情報`);
  const shareUrl = encodeURIComponent(`https://example.com/events/${event.id}`);
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくず */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#FF6B35]">ホーム</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/events" className="hover:text-[#FF6B35]">イベント</Link>
            </li>
            <li>/</li>
            <li className="text-gray-800 font-medium truncate max-w-[200px]">
              {event.title}
            </li>
          </ol>
        </nav>

        {/* メインカード */}
        <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* ヒーローイメージ */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#FFE66D]/40 to-[#4ECDC4]/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-50">
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

            {/* お気に入りボタン */}
            <div className="absolute top-4 right-4">
              <FavoriteButton eventId={event.id} size="lg" showLabel />
            </div>

            {/* 予約バッジ */}
            {event.reservation?.required && (
              <div className="absolute top-4 left-4">
                <span className="bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-full">
                  要予約
                </span>
              </div>
            )}
          </div>

          {/* コンテンツ */}
          <div className="p-6 sm:p-8">
            {/* カテゴリ */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.categories?.map((cat) => (
                <Link
                  key={cat}
                  href={`/events?category=${encodeURIComponent(cat)}`}
                  className="chip chip-primary"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* タイトル */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6">
              {event.title}
            </h1>

            {/* ===== 信頼性表示（必須）===== */}
            <div className="bg-[#FFFBF5] rounded-2xl p-6 mb-6 border border-[#FFE66D]/50">
              {/* 公式URL */}
              <a
                href={event.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#FF6B35] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#E55A25] transition-all shadow-md mb-4"
              >
                <span className="text-xl">🔗</span>
                <span>公式サイトで詳細を見る</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* 更新日・免責 */}
              <div className="text-center text-sm text-gray-500">
                <p className="mb-1">
                  <span className="font-semibold">情報更新日:</span> {event.updatedAt}
                </p>
                <p className="text-xs">
                  ※ 情報は変更される可能性があります。お出かけ前に公式サイトをご確認ください。
                </p>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-6">
              {/* 日時 */}
              {event.startAt && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">開催日時</h3>
                    <p className="text-gray-600">
                      {formatDate(event.startAt)}
                      <br />
                      {formatTime(event.startAt)}
                      {event.endAt && ` 〜 ${formatTime(event.endAt)}`}
                    </p>
                  </div>
                </div>
              )}

              {/* 場所 */}
              {event.venue && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">開催場所</h3>
                    <p className="text-gray-600">
                      {event.venue.name}
                      {event.venue.address && (
                        <>
                          <br />
                          <span className="text-sm">{event.venue.address}</span>
                        </>
                      )}
                    </p>
                    {event.area && (
                      <Link
                        href={`/events?area=${event.area.slug}`}
                        className="text-sm text-[#4ECDC4] font-semibold hover:underline"
                      >
                        {event.area.name}エリアの他のイベントを見る →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* 対象年齢 */}
              {event.age && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B9D]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👶</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">対象年齢</h3>
                    <p className="text-gray-600">{event.age.label}</p>
                  </div>
                </div>
              )}

              {/* 料金 */}
              {event.price && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFE66D]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">料金</h3>
                    <p className="text-[#FF6B35] font-bold text-lg">{event.price.text}</p>
                  </div>
                </div>
              )}

              {/* 予約情報 */}
              {event.reservation && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C44EE0]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">予約</h3>
                    <p className="text-gray-600">
                      {event.reservation.required ? '予約が必要です' : '予約不要'}
                      {event.reservation.method && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({event.reservation.method === 'web' && 'Web予約'}
                          {event.reservation.method === 'phone' && '電話予約'}
                          {event.reservation.method === 'lottery' && '抽選'})
                        </span>
                      )}
                    </p>
                    {event.reservation.deadlineAt && (
                      <p className="text-sm text-[#FF6B35]">
                        申込締切: {event.reservation.deadlineAt}
                      </p>
                    )}
                    {event.reservation.reservationUrl && (
                      <a
                        href={event.reservation.reservationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[#4ECDC4] font-semibold hover:underline"
                      >
                        予約ページへ →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 概要 */}
              {event.summary && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3">イベント概要</h3>
                  <p className="text-gray-600 leading-relaxed">{event.summary}</p>
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
              <a
                href={event.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 text-center"
              >
                公式サイトへ
              </a>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center flex items-center justify-center gap-2"
              >
                <span>𝕏</span>
                <span>シェア</span>
              </a>
            </div>
          </div>
        </article>

        {/* 関連イベント */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            <span className="mr-2">✨</span>
            他のおすすめイベント
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockEvents
              .filter((e) => e.id !== event.id)
              .slice(0, 2)
              .map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition flex gap-4 items-center"
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FFE66D]/30 to-[#4ECDC4]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">
                      {e.categories?.[0] === '体験' && '🎪'}
                      {e.categories?.[0] === '科学' && '🔬'}
                      {e.categories?.[0] === '公園' && '🌲'}
                      {e.categories?.[0] === '工作' && '✂️'}
                      {e.categories?.[0] === '水族館' && '🐟'}
                      {e.categories?.[0] === '動物園' && '🦁'}
                      {!e.categories?.[0] && '🎈'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{e.title}</h3>
                    <p className="text-sm text-gray-500">{e.area?.name}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
