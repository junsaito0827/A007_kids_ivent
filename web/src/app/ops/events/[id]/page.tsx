'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockStagingEvents } from '@/lib/mockStagingData';
import { mockEvents, areas, categories } from '@/lib/mockData';
import { Event } from '@/types/event';
import { StagingEvent } from '@/types/staging';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // ステージングイベントまたは公開イベントを取得
  const stagingEvent = mockStagingEvents.find(e => e.id === id);
  const publishedEvent = mockEvents.find(e => e.id === id);
  const event = stagingEvent || publishedEvent;
  const isStaging = !!stagingEvent;

  // フォーム状態
  const [formData, setFormData] = useState<Partial<Event>>({
    title: event?.title || '',
    officialUrl: event?.officialUrl || '',
    updatedAt: event?.updatedAt || '',
    summary: event?.summary || '',
    startAt: event?.startAt?.slice(0, 16) || '', // datetime-localフォーマット
    endAt: event?.endAt?.slice(0, 16) || '',
    area: event?.area || undefined,
    venue: event?.venue || { name: '', address: '' },
    age: event?.age || { label: '' },
    price: event?.price || { text: '' },
    categories: event?.categories || [],
    reservation: event?.reservation || { required: false },
    xEligible: event?.xEligible || false,
    lineEligible: event?.lineEligible ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-white mb-2">イベントが見つかりません</h2>
          <p className="text-slate-400 mb-6">指定されたイベントは存在しないか、削除されました。</p>
          <Link
            href="/ops/staging"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            ステージングに戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev as Record<string, unknown>)[parent] as object, [field]: value },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // 実際にはAPIを呼び出す
  };

  const handlePublish = async () => {
    // バリデーションチェック
    if (!formData.officialUrl || !formData.updatedAt) {
      alert('公式URLと更新日は必須です');
      return;
    }

    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPublishing(false);
    router.push('/ops/staging');
  };

  const handleArchive = async () => {
    if (!confirm('このイベントをアーカイブしますか？')) return;
    // 実際にはAPIを呼び出す
    router.push('/ops/staging');
  };

  // バリデーションチェック
  const canPublish = formData.officialUrl && formData.updatedAt && formData.title;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/ops/staging"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">イベント編集</h1>
            <div className="flex items-center gap-2 mt-1">
              {isStaging ? (
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                  📋 ステージング
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                  ✅ 公開中
                </span>
              )}
              {(stagingEvent as StagingEvent)?.validationErrors?.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-full">
                  ❌ エラーあり
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                保存中...
              </>
            ) : (
              '下書き保存'
            )}
          </button>
          {isStaging && (
            <button
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                canPublish
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isPublishing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  公開中...
                </>
              ) : (
                <>✅ 公開する</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* バリデーションエラー表示 */}
      {(stagingEvent as StagingEvent)?.validationErrors?.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-red-400 font-medium mb-2">❌ 修正が必要なエラー</h3>
          <ul className="space-y-1">
            {(stagingEvent as StagingEvent).validationErrors.map((err, i) => (
              <li key={i} className="text-sm text-red-300">• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* バリデーション警告表示 */}
      {(stagingEvent as StagingEvent)?.validationWarnings?.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <h3 className="text-amber-400 font-medium mb-2">⚠️ 確認が必要な警告</h3>
          <ul className="space-y-1">
            {(stagingEvent as StagingEvent).validationWarnings.map((warn, i) => (
              <li key={i} className="text-sm text-amber-300">• {warn.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 重複候補表示 */}
      {(stagingEvent as StagingEvent)?.duplicateCandidates && (stagingEvent as StagingEvent).duplicateCandidates!.length > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <h3 className="text-purple-400 font-medium mb-2">🔄 重複候補</h3>
          <p className="text-sm text-slate-300 mb-3">以下のイベントと類似しています。重複の場合は削除してください。</p>
          <ul className="space-y-2">
            {(stagingEvent as StagingEvent).duplicateCandidates!.map((dup) => (
              <li key={dup.eventId} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-white">{dup.title}</span>
                <Link
                  href={`/ops/events/${dup.eventId}`}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  確認する →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* フォーム */}
      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="font-semibold text-white">基本情報</h2>
          </div>
          <div className="p-5 space-y-5">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                タイトル <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="イベント名を入力"
              />
            </div>

            {/* 公式URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                公式URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={formData.officialUrl}
                onChange={(e) => handleChange('officialUrl', e.target.value)}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  !formData.officialUrl ? 'border-red-500/50' : 'border-slate-700 focus:border-emerald-500'
                }`}
                placeholder="https://example.com/event"
              />
              {!formData.officialUrl && (
                <p className="text-red-400 text-xs mt-1">公式URLは必須です</p>
              )}
            </div>

            {/* 更新日 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                更新日 <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.updatedAt}
                onChange={(e) => handleChange('updatedAt', e.target.value)}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-3 text-white focus:outline-none ${
                  !formData.updatedAt ? 'border-red-500/50' : 'border-slate-700 focus:border-emerald-500'
                }`}
              />
              {!formData.updatedAt && (
                <p className="text-red-400 text-xs mt-1">更新日は必須です</p>
              )}
            </div>

            {/* 概要 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">概要</label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="イベントの説明を入力"
              />
            </div>
          </div>
        </div>

        {/* 日時・場所 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="font-semibold text-white">日時・場所</h2>
          </div>
          <div className="p-5 space-y-5">
            {/* 開始・終了日時 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">開始日時</label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => handleChange('startAt', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">終了日時</label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => handleChange('endAt', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* エリア */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">エリア</label>
              <select
                value={formData.area?.slug || ''}
                onChange={(e) => {
                  const area = areas.find(a => a.slug === e.target.value);
                  handleChange('area', area || undefined);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">選択してください</option>
                {areas.map((area) => (
                  <option key={area.slug} value={area.slug}>{area.name}</option>
                ))}
              </select>
            </div>

            {/* 会場 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">会場名</label>
                <input
                  type="text"
                  value={formData.venue?.name || ''}
                  onChange={(e) => handleNestedChange('venue', 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="会場名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">住所</label>
                <input
                  type="text"
                  value={formData.venue?.address || ''}
                  onChange={(e) => handleNestedChange('venue', 'address', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="住所"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 対象・料金・予約 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="font-semibold text-white">対象・料金・予約</h2>
          </div>
          <div className="p-5 space-y-5">
            {/* 対象年齢 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">対象年齢</label>
              <input
                type="text"
                value={formData.age?.label || ''}
                onChange={(e) => handleNestedChange('age', 'label', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="例: 3歳〜小学生"
              />
            </div>

            {/* 料金 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">料金</label>
              <input
                type="text"
                value={formData.price?.text || ''}
                onChange={(e) => handleNestedChange('price', 'text', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="例: 無料、1,000円〜"
              />
            </div>

            {/* 予約 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="reservationRequired"
                  checked={formData.reservation?.required || false}
                  onChange={(e) => handleNestedChange('reservation', 'required', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="reservationRequired" className="text-sm text-slate-300">
                  予約が必要
                </label>
              </div>

              {formData.reservation?.required && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">予約URL</label>
                  <input
                    type="url"
                    value={formData.reservation?.reservationUrl || ''}
                    onChange={(e) => handleNestedChange('reservation', 'reservationUrl', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="https://example.com/reserve"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* カテゴリ */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="font-semibold text-white">カテゴリ</h2>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    const current = formData.categories || [];
                    if (current.includes(cat)) {
                      handleChange('categories', current.filter(c => c !== cat));
                    } else {
                      handleChange('categories', [...current, cat]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.categories?.includes(cat)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 配信設定 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="font-semibold text-white">配信設定</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium text-white">X (Twitter) 投稿</p>
                <p className="text-sm text-slate-400">公開時にXに自動投稿します</p>
              </div>
              <button
                onClick={() => handleChange('xEligible', !formData.xEligible)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.xEligible ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.xEligible ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium text-white">LINE 配信</p>
                <p className="text-sm text-slate-400">週次配信やリマインドの対象にします</p>
              </div>
              <button
                onClick={() => handleChange('lineEligible', !formData.lineEligible)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.lineEligible ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.lineEligible ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 危険な操作 */}
        <div className="bg-slate-800/50 border border-red-500/30 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h2 className="font-semibold text-red-400">危険な操作</h2>
          </div>
          <div className="p-5">
            <button
              onClick={handleArchive}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
            >
              🗑️ このイベントをアーカイブ
            </button>
            <p className="text-sm text-slate-500 mt-2">
              アーカイブされたイベントは公開されなくなります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
