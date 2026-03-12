"use client"; 
// Next.jsのApp Routerでは、Reactのstateやイベントを使う場合は
// クライアントコンポーネントとして宣言する必要がある

import { useState } from "react";
// Reactのstate管理フックをインポート

import TaskForm from "../components/TaskForm";
// 入力フォームコンポーネント

import TaskList from "../components/TaskList";
// タスク一覧コンポーネント

export default function Home() {

  const [task, setTask] = useState("");
  // 入力中のタスクを管理

  const [tasks, setTasks] = useState<string[]>([]);
  // タスク一覧を管理

  const addTask = () => {
  // タスク追加関数

    setTasks([...tasks, task]);
    // tasks配列に新しいtaskを追加

    setTask("");
    // 入力フォームを空にする

  };

  const deleteTask = (index: number) => {
  // タスク削除関数

    const newTasks = tasks.filter((_, i) => i !== index);
    // 削除対象以外のタスクを新しい配列にする

    setTasks(newTasks);
    // state更新

  };

  const updateTask = (index: number, newTask: string) => {
  // 編集保存

    const newTasks = [...tasks];
    // タスク配列をコピー

    newTasks[index] = newTask;
    // 編集されたタスク内容を更新

    setTasks(newTasks);
    // state更新

  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* アプリ全体のカードUI */}
      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">

        {/* タイトル */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Study Tracker
        </h1>

        {/* タスク入力フォーム */}
        <TaskForm
          task={task}
          setTask={setTask}
          addTask={addTask}
        />

        {/* タスク一覧 */}
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          updateTask={updateTask}
        />

      </div>
    </main>

  );

}