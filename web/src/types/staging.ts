// ステージングイベント関連の型定義
import { Event, EventStatus } from './event';

// ステージングイベント（レビュー待ちのイベント）
export interface StagingEvent extends Omit<Event, 'status'> {
  status: 'Staging';
  importBatchId: string;
  importedAt: string;
  validationErrors: ValidationError[];
  validationWarnings: ValidationWarning[];
  duplicateCandidates?: DuplicateCandidate[];
}

// バリデーションエラー（Hard Fail）
export interface ValidationError {
  field: string;
  message: string;
  code: 'EMPTY_TITLE' | 'INVALID_URL' | 'INVALID_DATE' | 'MISSING_REQUIRED';
}

// バリデーション警告（取り込みはするがOps対応必要）
export interface ValidationWarning {
  field: string;
  message: string;
  code: 'MISSING_START_DATE' | 'MISSING_CATEGORIES' | 'UNPARSEABLE_DATE';
}

// 重複候補
export interface DuplicateCandidate {
  eventId: string;
  title: string;
  matchReason: 'SAME_URL_AND_DATE' | 'SIMILAR_TITLE_AND_DATE';
  matchScore: number;
}

// CSVインポートバッチ
export interface ImportBatch {
  id: string;
  fileName: string;
  importedAt: string;
  importedBy: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  status: 'Processing' | 'Completed' | 'PartialSuccess' | 'Failed';
}

// CSVパース結果
export interface CSVParseResult {
  success: boolean;
  rows: CSVRow[];
  errors: CSVError[];
}

// CSVの1行
export interface CSVRow {
  rowNumber: number;
  data: Partial<Event>;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// CSVエラー
export interface CSVError {
  rowNumber: number;
  column: string;
  value: string;
  message: string;
}

// Ops操作ログ
export interface OpsLog {
  id: string;
  action: 'IMPORT' | 'REVIEW' | 'PROMOTE' | 'PUBLISH' | 'ARCHIVE' | 'EDIT';
  actor: string;
  targetId: string;
  targetType: 'Event' | 'StagingEvent' | 'ImportBatch';
  timestamp: string;
  details?: Record<string, unknown>;
}
