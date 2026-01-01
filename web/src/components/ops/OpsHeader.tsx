'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function OpsHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/ops', label: 'ダッシュボード', icon: '📊' },
    { href: '/ops/import-csv', label: 'CSV取込', icon: '📤' },
    { href: '/ops/staging', label: 'ステージング', icon: '📋' },
  ];

  const isActive = (href: string) => {
    if (href === '/ops') {
      return pathname === '/ops';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/ops" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚙</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Ops Console</span>
              <span className="text-slate-400 text-xs">キッズお出かけ情報</span>
            </div>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 右側のアクション */}
          <div className="flex items-center gap-4">
            {/* 公開サイトへのリンク */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white text-sm transition-colors"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">公開サイト</span>
            </Link>
            
            {/* ユーザーアバター */}
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-slate-300 text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* モバイルナビ */}
      <div className="md:hidden border-t border-slate-700">
        <nav className="flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
