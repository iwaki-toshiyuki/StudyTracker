"use client"; 
// Next.jsのApp Routerでは、Reactのstateやイベントを使う場合は
// クライアントコンポーネントとして宣言する必要がある

import { Task, StudyLog } from "../components/Task";

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

  // タグ入力用
  const [tag, setTag] = useState("");

  const addTask = () => {
  // タスク追加関数

    setTasks([
    ...tasks,
    {
      id: Date.now(), // ←一意なIDを生成
      text: task,   // タスク内容
      done: false ,  // 初期状態は未完了
      tag: tag      // タグも保存
    }
  ]);

    setTask(""); // 入力リセット
    setTag("");  // タグもリセット

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

// 学習ログ一覧
// 全ての学習ログを管理
const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);


// 学習ログ追加関数
const addStudyLog = (taskId: number, minutes: number) => {

  const newLog = {
    taskId: taskId, // ←タスクのIDを保存
    minutes: minutes,     // 学習時間
    date: new Date().toISOString() // 現在日時
  };

  setStudyLogs((prev) => [...prev, newLog]);
  // 配列に追加

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
          addStudyLog={addStudyLog}
          studyLogs={studyLogs}
        />

      </div>
    </main>

  );

}