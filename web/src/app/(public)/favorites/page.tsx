'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EventCard } from '@/components/EventCard';
import { getFavorites } from '@/lib/favorites';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/types/event';

export default function FavoritesPage() {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const favoriteIds = getFavorites();
    const events = mockEvents.filter((e) => favoriteIds.includes(e.id));
    setFavoriteEvents(events);
    setIsLoading(false);
  }, []);

  // お気に入りの更新を監視
  useEffect(() => {
    const handleStorageChange = () => {
      const favoriteIds = getFavorites();
      const events = mockEvents.filter((e) => favoriteIds.includes(e.id));
      setFavoriteEvents(events);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // カスタムイベントも監視（同一タブ内の更新用）
    const interval = setInterval(() => {
      const favoriteIds = getFavorites();
      const events = mockEvents.filter((e) => favoriteIds.includes(e.id));
      if (events.length !== favoriteEvents.length) {
        setFavoriteEvents(events);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [favoriteEvents.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce-slow mb-4">❤️</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            <span className="mr-2">❤️</span>
            お気に入り
          </h1>
          <p className="text-gray-600">
            気になるイベントを保存しておこう
          </p>
        </div>

        {/* 端末依存の注意 */}
        <div className="bg-[#FFE66D]/20 border border-[#FFE66D] rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-gray-800">
              お気に入りはこの端末に保存されています
            </p>
            <p className="text-sm text-gray-600 mt-1">
              他の端末でも見たい場合や、予約リマインダーを受け取りたい場合は
              <Link href="/connect/line" className="text-[#06C755] font-semibold hover:underline ml-1">
                LINE連携
              </Link>
              がおすすめです。
            </p>
          </div>
        </div>

        {favoriteEvents.length > 0 ? (
          <>
            {/* 件数 */}
            <p className="text-gray-600 mb-6">
              <span className="font-bold text-[#FF6B35] text-xl">{favoriteEvents.length}</span>
              <span className="ml-1">件のお気に入り</span>
            </p>

            {/* イベント一覧 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {favoriteEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </>
        ) : (
          /* お気に入りがない場合 */
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🤍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              お気に入りはまだありません
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              イベントカードの❤️をタップして、<br />
              気になるイベントを保存しましょう！
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/events" className="btn-primary">
                イベントを探す
              </Link>
              <Link href="/weekend" className="btn-outline">
                週末特集を見る
              </Link>
            </div>
          </div>
        )}

        {/* LINE連携CTA */}
        <section className="mt-8">
          <div className="bg-gradient-to-r from-[#06C755]/10 to-[#00B900]/10 border border-[#06C755]/30 rounded-2xl p-6 md:p-8">
            <div className="md:flex md:items-center md:justify-between gap-6">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#06C755] flex items-center justify-center">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">LINE連携のメリット</h2>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#06C755]">✓</span>
                    <span>端末を変えてもお気に入りを引き継げる</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#06C755]">✓</span>
                    <span>週末特集をLINEでお届け</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#06C755]">✓</span>
                    <span>予約したイベントのリマインダー通知</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/connect/line"
                className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white font-bold px-8 py-4 rounded-full hover:bg-[#05B24A] transition shadow-lg whitespace-nowrap"
              >
                <span className="text-xl">💬</span>
                <span>LINE連携する</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
