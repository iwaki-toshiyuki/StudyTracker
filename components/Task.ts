// タスク型定義
export type Task = {
  id: number; // タスクの一意なID
  text: string; // タスク内容
  done: boolean; // 完了状態
};

// 学習ログ型
export type StudyLog = {
  taskId: number; // ← タスクのID
  minutes: number;   // 学習時間（分）
  date: string;      // 日付
};