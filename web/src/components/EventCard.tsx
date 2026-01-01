'use client';

import Link from 'next/link';
import { Event } from '@/types/event';
import { FavoriteButton } from './FavoriteButton';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  // 日付フォーマット
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  // 時間フォーマット
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // カテゴリカラー
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '体験': 'bg-[#FF6B35]/10 text-[#FF6B35]',
      '自然': 'bg-[#95E84C]/20 text-[#5A8F2A]',
      '学習': 'bg-[#4ECDC4]/10 text-[#3EBDB4]',
      '科学': 'bg-[#C44EE0]/10 text-[#C44EE0]',
      'アウトドア': 'bg-[#95E84C]/20 text-[#5A8F2A]',
      '公園': 'bg-[#95E84C]/20 text-[#5A8F2A]',
      '工作': 'bg-[#FFE66D]/30 text-[#B8860B]',
      'ワークショップ': 'bg-[#FFE66D]/30 text-[#B8860B]',
      '水族館': 'bg-[#4ECDC4]/10 text-[#3EBDB4]',
      '動物園': 'bg-[#FF6B9D]/10 text-[#FF6B9D]',
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  return (
    <Link href={`/events/${event.id}`}>
      <article
        className="card group cursor-pointer opacity-0 animate-fadeInUp"
        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
      >
        {/* イメージ部分 */}
        <div className="relative h-40 bg-gradient-to-br from-[#FFE66D]/30 to-[#4ECDC4]/30 overflow-hidden">
          {/* プレースホルダーイメージ（実際のプロジェクトでは画像を使用） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
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
          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
            <FavoriteButton eventId={event.id} />
          </div>

          {/* 予約要否バッジ */}
          {event.reservation?.required && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-full">
                要予約
              </span>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-4">
          {/* カテゴリ */}
          <div className="flex flex-wrap gap-1 mb-2">
            {event.categories?.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(cat)}`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* タイトル */}
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2 group-hover:text-[#FF6B35] transition-colors">
            {event.title}
          </h3>

          {/* 日時 */}
          {event.startAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span>📅</span>
              <span className="font-semibold text-[#FF6B35]">{formatDate(event.startAt)}</span>
              <span className="text-gray-400">
                {formatTime(event.startAt)}〜
                {event.endAt && formatTime(event.endAt)}
              </span>
            </div>
          )}

          {/* エリア */}
          {event.area && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span>📍</span>
              <span>{event.area.name}</span>
              {event.venue?.name && <span className="text-gray-400">/ {event.venue.name}</span>}
            </div>
          )}

          {/* 年齢・料金 */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {event.age && (
              <div className="flex items-center gap-1 text-sm">
                <span>👶</span>
                <span className="text-gray-600">{event.age.label}</span>
              </div>
            )}
            {event.price && (
              <div className="font-bold text-[#FF6B35]">
                {event.price.text}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
