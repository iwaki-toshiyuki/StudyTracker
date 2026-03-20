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

    // タスク入力エリア
    <div className="mb-6">

      <div className="flex border rounded">

      {/* タスク入力フォーム */}
      <input
        type="text"
        value={task}
        // 入力フォームの値をstateと同期

        onChange={(e) => setTask(e.target.value)}
        // 入力された文字をtask stateに保存

        placeholder="タスクを入力"

        className="flex-1 px-2 py-2 outline-none"
      />

      {/* タグ入力フォーム */}
      <div className="w-40 border-l">
        <TagInput
          value={tag}
          onChange={setTag}
          options={uniqueTags}
        />
      </div>

    </div>

      {/* タスク追加ボタン */}
      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        追加
      </button>
    </div>

  );

}