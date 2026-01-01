# A-2025-001 キッズお出かけ情報 — 現行仕様（CURRENT）

## 0. このドキュメントの位置づけ
- 本ファイル（`doc/spec/current.md`）は **実装・運用の唯一の正（Single Source of Truth for Spec）** とする。
- 仕様検討の履歴・草案は `doc/base/` 配下に置く。
  - 参照：`doc/base/kids_outing_flows_v0.2.md`（フロー図・詳細）

## 1. 目的 / ゴール
- キッズ向け「お出かけイベント」情報を、Web（ポータル）を中心に配信する。
- ユーザー体験の要件：
  - 登録強制はしない（離脱率を下げる）
  - お気に入りは匿名でも可能（LocalStorage）
  - 任意でLINE連携（通知最適化やリマインドが目的）
- 運用要件：
  - 情報の正確性は公式ソースを最優先
  - 公開品質を担保（誤配信・誤誘導を防止）

## 2. スコープ
### 2.1 In Scope
- ユーザー向けUI（Web）
- 運用者向けUI（CSV取り込み / Stagingレビュー / Publish）
- Airtable をSoTとしたデータフロー
- X投稿・LINE通知のためのキュー生成（設計・最小実装）

### 2.2 Out of Scope（現時点ではやらない）
- 年齢カテゴリによるフィルタ（「未就学児OK」「小学生以上」等）
- 多言語UI（英語切替）

## 3. 用語定義
- SoT（Single Source of Truth）：Airtable（Events / StagingEvents）が唯一の正
- StagingEvents：取り込み直後の検証・補正・重複解消のための中間テーブル
- Events：公開対象のイベント本体
- Published：Webに公開してよい状態（Published以外は外部に出さない）
- Canonical（本プロジェクトの意味）：本サイトのイベント詳細は「公式URLへ誘導するための基準点」
  - 公式URL / 更新日 / 免責を必ず提示する

## 4. 全体アーキテクチャ（要点）
### 4.1 データフロー
1) 情報ソース → CSV作成（半自動/手動）
2) Ops：CSV取込 → StagingEventsへ格納
3) Ops：Stagingレビュー（エラー/警告/重複候補の解消）
4) Ops：Eventsへ昇格（必要ならマージ/更新）
5) Ops：Publish
6) 公開API：Publishedのみ返却
7) 配信：X投稿キュー / LINE通知キュー（Published条件を前提）

### 4.2 公開原則
- **Publishedのみが公開対象**（未PublishedはAPIで物理的に返さない）
- 詳細ページは必ず以下を表示する：
  - 公式URL（canonical link）
  - 更新日（いつ確認したか）
  - 免責（最終確認は公式で）

## 5. 画面（ユーザー向け）
> ルーティングは `doc/base/kids_outing_flows_v0.2.md` を正とする。

- `/` ホーム：探索開始・週末導線
- `/events` 一覧：絞り込み検索、0件UI（代替導線）を持つ
- `/events/:id` 詳細：Canonical（公式URL/更新日/免責が主役）
- `/weekend` 週末特集：週次の着地、0件回避
- `/favorites` お気に入り：匿名（LocalStorage）＋LINE連携CTA
- `/connect/line` LINE連携：メリット提示＋連携

## 6. 画面（運用者向け）
- `/ops/import-csv` CSV取込：プレビュー、エラー/重複候補、Staging反映
- `/ops/staging` ステージング：エラー/警告、重複マージ、Events昇格、Publish
- `/ops/events/:id` 編集：必須欠落補正、ステータス管理

## 7. CSV取り込み仕様（最低要件）
### 7.1 必須列（Error：欠落は取り込み拒否）
- `title`
- `officialUrl`
- `updatedAt`（確認日）

### 7.2 推奨列（Warning：欠落でも取り込み可だが品質低下）
- `startAt`, `endAt`
- `areaSlug`, `areaName`
- `venueName`, `address`
- `ageLabel`（表示用）
- `categories`
- `priceText`
- `reservationRequired`, `reservationUrl`

### 7.3 バリデーション方針
- Error：必須列の欠落 / URL不正 / 日付不正
- Warning：推奨列の欠落、startAt欠落、カテゴリ欠落など

## 8. 公開（Publish）品質ゲート
- Publish操作時に最低限チェックすべき項目：
  - Published化に必要な必須項目が満たされていること
  - 公式URLが有効形式であること
  - updatedAt が妥当であること
- Publish後は公開APIで即時反映される前提（したがってPublishは慎重に）

## 9. LINE通知 / 予約リマインド（Hard Fail）
- 誤配信は信用を破壊するため、条件未達は **送らない（Hard Fail）** を原則とする。
- 送信しない条件例：
  - lineUserIdが無い
  - eventがPublishedでない
  - remindAtが過去
  - officialUrlが欠落

## 10. 非機能要件（MVP）
- 信頼性：Published以外は絶対に公開しない
- 監査性：Publish操作・重要更新はログで追えることが望ましい
- 保守性：SoTはAirtable、Webは参照系に寄せる

## 11. 変更管理（ルール）
- 仕様変更は必ず以下をセットで行う：
  - `doc/spec/current.md` 更新
  - 実装変更（コード）
  - 必要なら `doc/decisions/ADR-xxx.md` 追加
- 「やらない」決定もADRに残す（将来の蒸し返し防止）
