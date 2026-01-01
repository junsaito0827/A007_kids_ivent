# 10_spec_guardrails — 仕様のガードレール（破ると事故る）

## 公開原則（最重要）
- 公開API/公開UIでは **Published以外のイベントを絶対に返さない／表示しない**。
- `/events/:id` は未Publishedを外部露出しない（404 または同等の扱い）。

## Canonicalの前提
- イベント詳細ページは必ず以下を表示する：
  - 公式URL（officialUrl）
  - 更新日（updatedAt）
  - 免責（最終確認は公式サイト）

## CSV仕様
- CSV必須列は固定：
  - `title`, `officialUrl`, `updatedAt`
- 推奨列は欠落しても取り込みを止めない（Warningで扱う）。

## スコープ外（勝手にやらない）
- 年齢カテゴリによるフィルタ追加は実施しない（ADRなしで入れない）。
- 多言語UI（英語切替）は実施しない。

## データSoT
- SoTはAirtable（Events / StagingEvents）。
- Web側に編集機能や独自の正規化ロジックを持ち込みすぎない（参照系を優先）。
