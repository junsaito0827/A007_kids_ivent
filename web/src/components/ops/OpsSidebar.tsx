'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function OpsSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      group: 'メイン',
      items: [
        { href: '/ops', label: 'ダッシュボード', icon: '📊', exact: true },
      ],
    },
    {
      group: 'イベント管理',
      items: [
        { href: '/ops/import-csv', label: 'CSV取込', icon: '📤' },
        { href: '/ops/staging', label: 'ステージング', icon: '📋' },
      ],
    },
    {
      group: '設定',
      items: [
        { href: '/ops/settings', label: '設定', icon: '⚙️' },
      ],
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:block w-64 bg-slate-900 border-r border-slate-700 min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-6">
        {menuItems.map((group) => (
          <div key={group.group}>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 px-3">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href, item.exact)
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* バージョン情報 */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-slate-500 text-xs">Ops Console v0.1.0</p>
        </div>
      </div>
    </aside>
  );
}
