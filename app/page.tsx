"use client"; 
// Next.jsのApp Routerでは、Reactのstateやイベントを使う場合は
// クライアントコンポーネントとして宣言する必要がある

import { useState } from "react";
// Reactのstate管理フックをインポート

export default function Home() {
// Homeコンポーネント（トップページ）

  const [task, setTask] = useState("");
  // 入力中のタスクを保存するstate
  // task → 現在入力されている値
  // setTask → taskを更新する関数

  const [tasks, setTasks] = useState<string[]>([]);
  // タスク一覧を保存するstate
  // string[] → 文字列の配列（TypeScriptで型指定）

  const addTask = () => {
  // タスクを追加する関数

    setTasks([...tasks, task]);
    // 既存のtasks配列に新しいtaskを追加する
    // ...tasks はスプレッド構文で配列を展開

    setTask("");
    // タスク追加後、入力フォームを空にする

  };

  const [editIndex, setEditIndex] = useState<number | null>(null);
  // 編集中のタスクのindex

    const [editTask, setEditTask] = useState("");
    // 編集中のタスク内容

    const updateTask = () => {
    // タスク編集用の関数

    if (editIndex === null) return;

    const newTasks = [...tasks];

    newTasks[editIndex] = editTask;

    setTasks(newTasks);

    setEditIndex(null);

  };

  const deleteTask = (index: number) => {
  // タスク削除用の関数
  // index → 削除するタスクの位置

    const newTasks = tasks.filter((_, i) => i !== index);
    // filterを使って削除対象以外のタスクを新しい配列にする
    // _ → 使わない引数
    // i → 配列のインデックス

    setTasks(newTasks);
    // 新しい配列をstateにセット

  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Study Tracker
        </h1>
         {/* 入力フォーム */}

      <div className="flex gap-2 mb-6">

        <input
          type="text"
          value={task}
          // 入力フォームの値をtaskと連動させる

          onChange={(e) => setTask(e.target.value)}
          // 入力された値をtask stateに保存

          placeholder="タスクを入力"

          className="border rounded px-3 py-2 w-full"
        />

        <button
            // タスク追加ボタン
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>
      {/* クリックするとタスク追加 */}

      <ul className="space-y-2">

        {tasks.map((task, index) => (
        // tasks配列をmapでループして表示

          <li
              key={index}
              className="flex justify-between items-center border p-3 rounded"
          >
            {/* keyはReactでリスト表示する際に必要 */}



             {editIndex === index ? (

              <>
                <input
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  className="border px-2 py-1 flex-1"
                />

                <button
                  onClick={updateTask}
                  className="text-green-500 ml-2"
                >
                  保存
                </button>
              </>

            ) : (

              <>

              <span>{task}</span>


                <button
                  onClick={() => {
                    setEditIndex(index);
                    setEditTask(task);
                  }}
                  className="text-blue-500 ml-2"
                >
                  編集
                </button>
              </>

            )}

            <button
                onClick={() => deleteTask(index)}
                className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
            {/* クリックすると該当タスク削除 */}

          </li>

        ))}

        </ul>

      </div>

    </main>

  );

}