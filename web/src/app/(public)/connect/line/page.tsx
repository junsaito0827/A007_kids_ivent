'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConnectLinePage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // モック：実際はLIFF/OAuth処理
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  if (isConnected) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#06C755] flex items-center justify-center animate-fadeIn">
              <span className="text-white text-4xl">✓</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4">
              連携完了！
            </h1>
            <p className="text-gray-600 mb-8">
              LINEとの連携が完了しました。<br />
              週末特集やリマインダーをお届けします。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/favorites" className="btn-primary">
                お気に入りを見る
              </Link>
              <Link href="/" className="btn-outline">
                ホームへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくず */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#FF6B35]">ホーム</Link>
            </li>
            <li>/</li>
            <li className="text-gray-800 font-medium">LINE連携</li>
          </ol>
        </nav>

        {/* メインカード */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-[#06C755] to-[#00B900] p-8 text-white text-center relative overflow-hidden">
            {/* デコレーション */}
            <div className="absolute top-4 left-8 text-4xl opacity-20">💬</div>
            <div className="absolute bottom-4 right-8 text-4xl opacity-20">📱</div>

            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-5xl">💬</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
              LINE連携
            </h1>
            <p className="opacity-90">
              連携してもっと便利に使おう
            </p>
          </div>

          {/* コンテンツ */}
          <div className="p-6 md:p-8">
            {/* メリット一覧 */}
            <div className="space-y-4 mb-8">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <span>✨</span> LINE連携のメリット
              </h2>
              
              <div className="space-y-4">
                {/* メリット1 */}
                <div className="flex items-start gap-4 p-4 bg-[#FFFBF5] rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">端末引き継ぎ</h3>
                    <p className="text-sm text-gray-600">
                      スマホを変えても、お気に入りが消えません。<br />
                      いつでもどこでもアクセスできます。
                    </p>
                  </div>
                </div>

                {/* メリット2 */}
                <div className="flex items-start gap-4 p-4 bg-[#FFFBF5] rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#FFE66D]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">週末特集をお届け</h3>
                    <p className="text-sm text-gray-600">
                      毎週木曜にLINEで週末特集をお届け。<br />
                      お出かけの計画がラクラク！
                    </p>
                  </div>
                </div>

                {/* メリット3 */}
                <div className="flex items-start gap-4 p-4 bg-[#FFFBF5] rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">予約リマインダー</h3>
                    <p className="text-sm text-gray-600">
                      予約したイベントの前日にお知らせ。<br />
                      うっかり忘れを防げます。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* データ利用説明 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                <span>🔒</span> 保存するデータ
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LINE ID（通知送信用）</li>
                <li>• お気に入りイベント</li>
                <li>• 予約リマインダー設定</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                ※ 上記以外の個人情報は保存しません。いつでも連携解除できます。
              </p>
            </div>

            {/* 連携ボタン */}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`
                w-full flex items-center justify-center gap-3
                bg-[#06C755] text-white font-bold text-lg
                py-4 px-8 rounded-xl
                transition-all shadow-lg
                ${isConnecting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-[#05B24A] hover:shadow-xl'
                }
              `}
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>連携中...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">💬</span>
                  <span>LINEで連携する</span>
                </>
              )}
            </button>

            {/* 注意事項 */}
            <p className="text-center text-xs text-gray-500 mt-4">
              連携すると、
              <a href="#" className="text-[#06C755] hover:underline">利用規約</a>
              と
              <a href="#" className="text-[#06C755] hover:underline">プライバシーポリシー</a>
              に同意したことになります。
            </p>
          </div>
        </div>

        {/* 連携しない場合のリンク */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-2">
            連携しなくてもお気に入りは使えます
          </p>
          <Link href="/favorites" className="text-[#FF6B35] font-semibold hover:underline">
            お気に入りを見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
