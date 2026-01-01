import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#2D3436] to-[#3D4446] text-white mt-16">
      {/* デコレーション波 */}
      <div className="relative">
        <svg
          className="w-full h-12 md:h-16 -mb-1"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,0 600,60 900,30 C1050,15 1150,40 1200,30 L1200,0 L0,0 Z"
            fill="#FFFBF5"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎈</span>
              <span className="font-extrabold text-xl text-white">
                キッズお出かけ情報
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              週末のお出かけ先を探そう！キッズ向けイベント、体験教室、公園など、
              お子様と一緒に楽しめるスポット情報をお届けします。
            </p>
            <p className="text-gray-400 text-xs mt-4">
              ※ 情報は変更される可能性があります。お出かけ前に公式サイトをご確認ください。
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFE66D] mb-4">
              イベントを探す
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition text-sm">
                  イベント検索
                </Link>
              </li>
              <li>
                <Link href="/weekend" className="text-gray-300 hover:text-white transition text-sm">
                  週末特集
                </Link>
              </li>
              <li>
                <Link href="/events?category=体験" className="text-gray-300 hover:text-white transition text-sm">
                  体験イベント
                </Link>
              </li>
              <li>
                <Link href="/events?category=公園" className="text-gray-300 hover:text-white transition text-sm">
                  公園・アウトドア
                </Link>
              </li>
            </ul>
          </div>

          {/* マイページ */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#4ECDC4] mb-4">
              マイページ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/favorites" className="text-gray-300 hover:text-white transition text-sm">
                  お気に入り
                </Link>
              </li>
              <li>
                <Link href="/connect/line" className="text-gray-300 hover:text-white transition text-sm">
                  LINE連携
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-600 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 キッズお出かけ情報. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl hover:scale-110 transition cursor-pointer">🎪</span>
            <span className="text-2xl hover:scale-110 transition cursor-pointer">🎨</span>
            <span className="text-2xl hover:scale-110 transition cursor-pointer">🎡</span>
            <span className="text-2xl hover:scale-110 transition cursor-pointer">🎠</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
