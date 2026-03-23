import { useState } from "react";
import TagInput from "./TagInput";

// propsの型定義
type Props = {
  task: string; // 現在入力中のタスク
  setTask: (task: string) => void; // 入力値を更新する関数
  tag: string; // 現在入力中のタグ
  setTag: (value: string) => void; // タグ入力値を更新する関数
  uniqueTags: string[]; // 重複なしタグ一覧
  addTask: () => void; // タスク追加関数
};


export default function TaskForm({ task, setTask, addTask, tag, setTag, uniqueTags }: Props) {

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">タスクを追加</h2>

      <div className="space-y-3">
        {/* タスク入力フォーム */}
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="タスクを入力"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* タグ入力フォーム */}
        <div className="border border-gray-200 rounded-lg">
          <TagInput
            value={tag}
            onChange={setTag}
            options={uniqueTags}
          />
        </div>

        {/* タスク追加ボタン */}
        <button
          onClick={addTask}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          追加
        </button>
      </div>
    </div>
  );

}