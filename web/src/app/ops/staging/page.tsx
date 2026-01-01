'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockStagingEvents, mockImportBatches } from '@/lib/mockStagingData';
import { StagingEvent } from '@/types/staging';

type FilterType = 'all' | 'error' | 'warning' | 'ready';

export default function StagingPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

  // フィルタリング
  const filteredEvents = mockStagingEvents.filter((event) => {
    // バッチフィルター
    if (selectedBatch !== 'all' && event.importBatchId !== selectedBatch) {
      return false;
    }

    // 状態フィルター
    switch (filter) {
      case 'error':
        return event.validationErrors.length > 0;
      case 'warning':
        return event.validationWarnings.length > 0 && event.validationErrors.length === 0;
      case 'ready':
        return event.validationErrors.length === 0 && event.validationWarnings.length === 0;
      default:
        return true;
    }
  });

  // 統計
  const stats = {
    total: mockStagingEvents.length,
    error: mockStagingEvents.filter(e => e.validationErrors.length > 0).length,
    warning: mockStagingEvents.filter(e => e.validationWarnings.length > 0 && e.validationErrors.length === 0).length,
    ready: mockStagingEvents.filter(e => e.validationErrors.length === 0 && e.validationWarnings.length === 0).length,
  };

  // 選択トグル
  const toggleSelection = (eventId: string) => {
    const newSelection = new Set(selectedEvents);
    if (newSelection.has(eventId)) {
      newSelection.delete(eventId);
    } else {
      newSelection.add(eventId);
    }
    setSelectedEvents(newSelection);
  };

  // 全選択/解除
  const toggleAllSelection = () => {
    if (selectedEvents.size === filteredEvents.filter(e => e.validationErrors.length === 0).length) {
      setSelectedEvents(new Set());
    } else {
      const selectableIds = filteredEvents
        .filter(e => e.validationErrors.length === 0)
        .map(e => e.id);
      setSelectedEvents(new Set(selectableIds));
    }
  };

  // ステータスバッジ
  const getStatusBadge = (event: StagingEvent) => {
    if (event.validationErrors.length > 0) {
      return (
        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full">
          ❌ エラー
        </span>
      );
    }
    if (event.validationWarnings.length > 0) {
      return (
        <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full">
          ⚠️ 警告
        </span>
      );
    }
    if (event.duplicateCandidates && event.duplicateCandidates.length > 0) {
      return (
        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full">
          🔄 重複候補
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
        ✅ 公開可能
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ステージング</h1>
          <p className="text-slate-400 mt-1">取り込み済みイベントの確認・編集・公開</p>
        </div>
        <Link
          href="/ops/import-csv"
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <span>📤</span>
          新規取込
        </Link>
      </div>

      {/* フィルタータブ */}
      <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl">
        {[
          { key: 'all' as FilterType, label: 'すべて', count: stats.total },
          { key: 'ready' as FilterType, label: '公開可能', count: stats.ready, color: 'emerald' },
          { key: 'warning' as FilterType, label: '警告', count: stats.warning, color: 'amber' },
          { key: 'error' as FilterType, label: 'エラー', count: stats.error, color: 'red' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              filter === tab.key
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                filter === tab.key
                  ? tab.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : tab.color === 'amber'
                    ? 'bg-amber-500/20 text-amber-400'
                    : tab.color === 'red'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-slate-600 text-slate-300'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* バッチフィルター */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-400">インポートバッチ:</label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="all">すべてのバッチ</option>
          {mockImportBatches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.fileName} ({new Date(batch.importedAt).toLocaleDateString('ja-JP')})
            </option>
          ))}
        </select>
      </div>

      {/* 一括操作バー */}
      {selectedEvents.size > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
          <span className="text-emerald-400 font-medium">
            {selectedEvents.size}件選択中
          </span>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
              一括編集
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
              一括公開
            </button>
          </div>
        </div>
      )}

      {/* イベントリスト */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {/* テーブルヘッダー */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEvents.size === filteredEvents.filter(e => e.validationErrors.length === 0).length && selectedEvents.size > 0}
              onChange={toggleAllSelection}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">イベント</div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">エリア</div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">状態</div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">操作</div>
        </div>

        {/* イベント行 */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-400">該当するイベントがありません</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-slate-800/50 transition-colors ${
                  event.validationErrors.length > 0 ? 'opacity-60' : ''
                }`}
              >
                {/* チェックボックス */}
                <div>
                  <input
                    type="checkbox"
                    checked={selectedEvents.has(event.id)}
                    onChange={() => toggleSelection(event.id)}
                    disabled={event.validationErrors.length > 0}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500 disabled:opacity-50"
                  />
                </div>

                {/* イベント情報 */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white truncate">{event.title}</h3>
                    {event.xEligible && (
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">X</span>
                    )}
                    {event.lineEligible && (
                      <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">LINE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                    {event.startAt && (
                      <span>📅 {new Date(event.startAt).toLocaleDateString('ja-JP')}</span>
                    )}
                    <span>
                      インポート: {new Date(event.importedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  {/* エラー/警告の詳細 */}
                  {(event.validationErrors.length > 0 || event.validationWarnings.length > 0) && (
                    <div className="mt-2 space-y-1">
                      {event.validationErrors.map((err, i) => (
                        <p key={i} className="text-xs text-red-400">❌ {err.message}</p>
                      ))}
                      {event.validationWarnings.map((warn, i) => (
                        <p key={i} className="text-xs text-amber-400">⚠️ {warn.message}</p>
                      ))}
                    </div>
                  )}
                  {/* 重複候補 */}
                  {event.duplicateCandidates && event.duplicateCandidates.length > 0 && (
                    <div className="mt-2 p-2 bg-purple-500/10 rounded-lg">
                      <p className="text-xs text-purple-400 font-medium">🔄 重複候補あり:</p>
                      {event.duplicateCandidates.map((dup) => (
                        <p key={dup.eventId} className="text-xs text-slate-300 mt-1">
                          • {dup.title}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* エリア */}
                <div className="text-sm text-slate-300">
                  {event.area?.name || '-'}
                </div>

                {/* 状態 */}
                <div>
                  {getStatusBadge(event)}
                </div>

                {/* 操作 */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/ops/events/${event.id}`}
                    className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    編集
                  </Link>
                  {event.validationErrors.length === 0 && (
                    <button className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors">
                      公開
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
