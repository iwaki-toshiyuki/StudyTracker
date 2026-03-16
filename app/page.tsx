"use client"; 
// Next.jsのApp Routerでは、Reactのstateやイベントを使う場合は
// クライアントコンポーネントとして宣言する必要がある

import { Task } from "../components/Task";

import { useState, useEffect} from "react";
// Reactのstate管理フックをインポート

import TaskForm from "../components/TaskForm";
// 入力フォームコンポーネント

import TaskList from "../components/TaskList";
// タスク一覧コンポーネント


export default function Home() {

  const [task, setTask] = useState("");
  // 入力中のタスクを管理
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
  // タスク追加関数

    setTasks([
    ...tasks,
    {
      text: task,   // タスク内容
      done: false   // 初期状態は未完了
    }
  ]);

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

  const updateTask = (index: number, newTask: Task) => {
  // 編集保存

    const newTasks = [...tasks];
    // タスク配列をコピー

    newTasks[index] = newTask;
    // 編集されたタスク内容を更新

    setTasks(newTasks);
    // state更新

  };

  // タスクの完了状態を切り替える関数
  const toggleTask = (index: number) => {

  const newTasks = [...tasks];

  // doneを反転
  newTasks[index].done = !newTasks[index].done;

  setTasks(newTasks);

};

// 初回ロード時にLocalStorageからタスクを取得
useEffect(() => {

  const savedTasks = localStorage.getItem("tasks");
  // LocalStorageからtasksを取得

  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
    // JSON文字列を配列に戻してstateにセット
  }

}, []);

// tasks変更時にLocalStorageへ保存
  useEffect(() => {

    localStorage.setItem("tasks", JSON.stringify(tasks));

  }, [tasks]);


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
          toggleTask={toggleTask}
        />

      </div>
    </main>

  );

}