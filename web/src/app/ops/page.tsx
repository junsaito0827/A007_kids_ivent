'use client';

import Link from 'next/link';
import { mockStagingEvents, mockImportBatches } from '@/lib/mockStagingData';
import { mockEvents } from '@/lib/mockData';

export default function OpsDashboard() {
  // 統計計算
  const totalEvents = mockEvents.length;
  const publishedEvents = mockEvents.filter(e => e.status === 'Published').length;
  const stagingCount = mockStagingEvents.length;
  const errorCount = mockStagingEvents.filter(e => e.validationErrors.length > 0).length;
  const warningCount = mockStagingEvents.filter(e => e.validationWarnings.length > 0).length;

  const stats = [
    { label: '公開中イベント', value: publishedEvents, icon: '✅', color: 'emerald' },
    { label: 'ステージング', value: stagingCount, icon: '📋', color: 'blue' },
    { label: 'エラーあり', value: errorCount, icon: '❌', color: 'red' },
    { label: '警告あり', value: warningCount, icon: '⚠️', color: 'amber' },
  ];

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-slate-400 mt-1">イベント管理の概要を確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-5 ${colorClasses[stat.color]}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <p className="mt-2 text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* クイックアクション */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* CSV取込 */}
        <Link
          href="/ops/import-csv"
          className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">📤</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                CSV取込
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                新しいイベントデータをCSVファイルからインポートします
              </p>
            </div>
            <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </Link>

        {/* ステージングレビュー */}
        <Link
          href="/ops/staging"
          className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-blue-500/30 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                ステージングレビュー
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                取り込み済みイベントの確認・編集・公開
              </p>
              {stagingCount > 0 && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                  {stagingCount}件のレビュー待ち
                </span>
              )}
            </div>
            <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </Link>
      </div>

      {/* 最近のインポート */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">最近のインポート</h2>
        </div>
        <div className="divide-y divide-slate-700">
          {mockImportBatches.map((batch) => (
            <div key={batch.id} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <div>
                  <p className="font-medium text-white">{batch.fileName}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(batch.importedAt).toLocaleString('ja-JP')} • {batch.importedBy}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <p className="text-slate-300">{batch.totalRows}件中</p>
                  <p className="text-emerald-400">{batch.successCount}件成功</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    batch.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : batch.status === 'PartialSuccess'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {batch.status === 'Completed' && '完了'}
                  {batch.status === 'PartialSuccess' && '一部成功'}
                  {batch.status === 'Failed' && '失敗'}
                  {batch.status === 'Processing' && '処理中'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ステージングイベント一覧（エラー/警告あり） */}
      {(errorCount > 0 || warningCount > 0) && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">対応が必要なイベント</h2>
            <Link
              href="/ops/staging"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {mockStagingEvents
              .filter((e) => e.validationErrors.length > 0 || e.validationWarnings.length > 0)
              .slice(0, 5)
              .map((event) => (
                <Link
                  key={event.id}
                  href={`/ops/events/${event.id}`}
                  className="p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="text-sm text-slate-400">
                      {event.area?.name} • インポート: {new Date(event.importedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.validationErrors.length > 0 && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full">
                        ❌ {event.validationErrors.length}件のエラー
                      </span>
                    )}
                    {event.validationWarnings.length > 0 && (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full">
                        ⚠️ {event.validationWarnings.length}件の警告
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
