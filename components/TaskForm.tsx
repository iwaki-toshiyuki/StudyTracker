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

        className="flex-1 px-3 py-2 outline-none"
      />

       {/* ▼ タグ選択 */}
      <div className="relative w-40 border-l">


          {/* 入力フィールド */}
          <input
            type="text"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setIsOpen(true); // 入力したら必ず開く
            }}
            placeholder="タグ"
            className="w-full px-2 py-2 outline-none"
            onFocus={() => setIsOpen(true)} // フォーカスで開く
            onBlur={() => setTimeout(() => setIsOpen(false), 100)} // 少し遅らせて閉じる
          />

          {/* ▼ ドロップダウン */}
          {isOpen && uniqueTags.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-10">

              {uniqueTags
                .filter((t) =>
                t.toLowerCase().includes(tag.toLowerCase())
                ).map((t: string) => (
                <div
                  key={t}
                  onMouseDown={() => {
                  // ⚠️ onClickだとblurで消える
                  setTag(t);
                  setIsOpen(false);
                }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {t}
                </div>
              ))}

          </div>
        )}
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