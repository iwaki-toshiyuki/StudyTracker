import { useState } from "react";

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

  // ドロップダウン開閉状態
  const [isOpen, setIsOpen] = useState(false);

  return (

    // タスク入力エリア
    <div className="flex gap-2 mb-6">

      {/* タスク入力フォーム */}
      <input
        type="text"
        value={task} 
        // 入力フォームの値をstateと同期

        onChange={(e) => setTask(e.target.value)}
        // 入力された文字をtask stateに保存

        placeholder="タスクを入力"

        className="border rounded px-3 py-2 w-full"
      />

       {/* タグ入力 */}
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="タグ（例: React）"
        className="border px-3 py-2 w-full"
      />

       <div className="relative w-60">

      {/* ▼ トリガー（入力っぽいやつ） */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border px-3 py-2 rounded cursor-pointer bg-white"
      >
        {tag || "タグを選択してください"}
      </div>

      {/* ▼ ドロップダウン */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-10">

          {uniqueTags.map((t: string) => (
            <div
              key={t}
              onClick={() => {
                setTag(t);
                setIsOpen(false); // 選択したら閉じる
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {t}
            </div>
          ))}

        </div>
      )}

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