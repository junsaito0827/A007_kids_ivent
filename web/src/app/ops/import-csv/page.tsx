'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface CSVPreviewRow {
  rowNumber: number;
  title: string;
  officialUrl: string;
  updatedAt: string;
  startAt?: string;
  areaName?: string;
  errors: string[];
  warnings: string[];
}

export default function ImportCSVPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CSVPreviewRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // ファイルドロップハンドラー
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.csv')) {
      handleFile(droppedFile);
    }
  }, []);

  // ファイル選択ハンドラー
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // ファイル処理
  const handleFile = (file: File) => {
    setFile(file);
    setUploadComplete(false);
    
    // CSVをパースしてプレビューを生成（シミュレーション）
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setPreviewData([]);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const titleIdx = headers.findIndex(h => h === 'title' || h === 'タイトル');
      const urlIdx = headers.findIndex(h => h === 'officialurl' || h === '公式url');
      const updatedIdx = headers.findIndex(h => h === 'updatedat' || h === '更新日');
      const startIdx = headers.findIndex(h => h === 'startat' || h === '開始日');
      const areaIdx = headers.findIndex(h => h === 'areaname' || h === 'エリア');

      const preview: CSVPreviewRow[] = [];
      
      for (let i = 1; i < Math.min(lines.length, 11); i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const errors: string[] = [];
        const warnings: string[] = [];

        const title = titleIdx >= 0 ? values[titleIdx] : '';
        const officialUrl = urlIdx >= 0 ? values[urlIdx] : '';
        const updatedAt = updatedIdx >= 0 ? values[updatedIdx] : '';
        const startAt = startIdx >= 0 ? values[startIdx] : undefined;
        const areaName = areaIdx >= 0 ? values[areaIdx] : undefined;

        // バリデーション
        if (!title) errors.push('タイトルが空です');
        if (!officialUrl) errors.push('公式URLが必要です');
        else if (!officialUrl.startsWith('http')) errors.push('URLが無効です');
        if (!updatedAt) errors.push('更新日が必要です');
        if (!startAt) warnings.push('開始日時が未設定です');

        preview.push({
          rowNumber: i,
          title: title || '(未設定)',
          officialUrl: officialUrl || '(未設定)',
          updatedAt: updatedAt || '(未設定)',
          startAt,
          areaName,
          errors,
          warnings,
        });
      }

      setPreviewData(preview);
    };
    reader.readAsText(file);
  };

  // アップロード実行
  const handleUpload = async () => {
    if (!file || previewData.some(row => row.errors.length > 0)) return;

    setIsUploading(true);
    
    // シミュレーション: 2秒後に完了
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploadComplete(true);
  };

  // リセット
  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
    setUploadComplete(false);
  };

  const totalErrors = previewData.reduce((sum, row) => sum + row.errors.length, 0);
  const totalWarnings = previewData.reduce((sum, row) => sum + row.warnings.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CSV取込</h1>
          <p className="text-slate-400 mt-1">CSVファイルからイベントデータをインポートします</p>
        </div>
        {file && !uploadComplete && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            リセット
          </button>
        )}
      </div>

      {/* 完了メッセージ */}
      {uploadComplete && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-400">インポート完了</h3>
              <p className="text-slate-300 mt-1">
                {previewData.length}件のイベントがステージングに追加されました。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                新しいファイルを取込
              </button>
              <Link
                href="/ops/staging"
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                ステージングを確認 →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ファイルアップロードエリア */}
      {!file && !uploadComplete && (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            CSVファイルをドラッグ＆ドロップ
          </h3>
          <p className="text-slate-400 mb-4">または</p>
          <label className="inline-block">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <span className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium cursor-pointer hover:bg-emerald-600 transition-colors">
              ファイルを選択
            </span>
          </label>
          <p className="text-slate-500 text-sm mt-4">
            UTF-8エンコードのCSVファイルのみ対応
          </p>
        </div>
      )}

      {/* プレビュー */}
      {file && !uploadComplete && (
        <div className="space-y-6">
          {/* ファイル情報 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-sm text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB • {previewData.length}件のイベント
                </p>
              </div>
              <div className="flex items-center gap-4">
                {totalErrors > 0 && (
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 text-sm font-medium rounded-full">
                    ❌ {totalErrors}件のエラー
                  </span>
                )}
                {totalWarnings > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm font-medium rounded-full">
                    ⚠️ {totalWarnings}件の警告
                  </span>
                )}
                {totalErrors === 0 && totalWarnings === 0 && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full">
                    ✅ 問題なし
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* エラーサマリー */}
          {totalErrors > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 font-medium">
                ❌ エラーのある行は取り込めません。CSVを修正してから再アップロードしてください。
              </p>
            </div>
          )}

          {/* プレビューテーブル */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white">プレビュー（最大10件表示）</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">行</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">タイトル</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">公式URL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">更新日</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">開始日</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {previewData.map((row) => (
                    <tr 
                      key={row.rowNumber}
                      className={
                        row.errors.length > 0 
                          ? 'bg-red-500/5' 
                          : row.warnings.length > 0 
                          ? 'bg-amber-500/5' 
                          : ''
                      }
                    >
                      <td className="px-4 py-3 text-sm text-slate-400">{row.rowNumber}</td>
                      <td className="px-4 py-3 text-sm text-white font-medium max-w-[200px] truncate">
                        {row.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300 max-w-[200px] truncate">
                        {row.officialUrl}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">{row.updatedAt}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{row.startAt || '-'}</td>
                      <td className="px-4 py-3">
                        {row.errors.length > 0 ? (
                          <div className="space-y-1">
                            {row.errors.map((err, i) => (
                              <span key={i} className="block text-xs text-red-400">❌ {err}</span>
                            ))}
                          </div>
                        ) : row.warnings.length > 0 ? (
                          <div className="space-y-1">
                            {row.warnings.map((warn, i) => (
                              <span key={i} className="block text-xs text-amber-400">⚠️ {warn}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-400">✅ OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* アクション */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpload}
              disabled={totalErrors > 0 || isUploading}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                totalErrors > 0
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  インポート中...
                </>
              ) : (
                <>
                  📤 ステージングにインポート
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CSVフォーマット説明 */}
      {!file && !uploadComplete && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h3 className="font-semibold text-white">CSVフォーマット</h3>
          </div>
          <div className="p-5">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 必須列 */}
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-3">必須列</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <div>
                      <span className="text-white font-mono">title</span>
                      <span className="text-slate-400 ml-2">イベントタイトル</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <div>
                      <span className="text-white font-mono">officialUrl</span>
                      <span className="text-slate-400 ml-2">公式サイトURL</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <div>
                      <span className="text-white font-mono">updatedAt</span>
                      <span className="text-slate-400 ml-2">更新日（YYYY-MM-DD）</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 推奨列 */}
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-3">推奨列</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <div>
                      <span className="text-white font-mono">startAt</span>
                      <span className="text-slate-400 ml-2">開始日時（ISO8601）</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <div>
                      <span className="text-white font-mono">areaSlug</span>
                      <span className="text-slate-400 ml-2">エリアコード</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <div>
                      <span className="text-white font-mono">categories</span>
                      <span className="text-slate-400 ml-2">カテゴリ（カンマ区切り）</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* サンプルダウンロード */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                📥 サンプルCSVをダウンロード
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
