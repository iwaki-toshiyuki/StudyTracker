"use client";
// Next.jsのApp Routerでは、Reactのstateやイベントを使う場合は
// クライアントコンポーネントとして宣言する必要がある

import { Task, StudyLog } from "../components/Types";

import { useState, useEffect } from "react";
// Reactのstate管理フックをインポート

import TaskForm from "../components/TaskForm";
// 入力フォームコンポーネント

import TaskList from "../components/TaskList";
// タスク一覧コンポーネント

import Chart from "../components/Chart";
// 学習時間をタグごとに集計して表示するチャートコンポーネント

import Dashboard from "../components/DashBoard";
// 全体の学習時間や達成率を表示するダッシュボードコンポーネント

export default function Home() {
  const [task, setTask] = useState("");
  // 入力中のタスクを管理
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    // タスク追加関数

    setTasks([
      ...tasks,
      {
        id: Date.now(), // ←一意なIDを生成
        text: task, // タスク内容
        done: false, // 初期状態は未完了
        tag: tag, // タグも保存
        totalMinutes: 0, // 累計学習時間も初期化
      },
    ]);

    setTask(""); // 入力リセット
    setTag(""); // タグもリセット
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
      minutes: minutes, // 学習時間
      date: new Date().toISOString(), // 現在日時
    };

    setStudyLogs((prev) => [...prev, newLog]);
    // 配列に追加
  };

  // タグ入力用
  const [tag, setTag] = useState("");

  // 重複なしタグ一覧を作成
  const uniqueTags = Array.from(new Set(tasks.map((task) => task.tag)));

  // タグごとの学習時間集計
  const tagSummary = studyLogs.reduce(
    (acc, log) => {
      // taskIdからタスクを取得
      const task = tasks.find((t) => t.id === log.taskId);

      // タスクが見つからない場合はスキップ
      if (!task) return acc;

      // タグをキーにして学習時間を加算
      const tag = task.tag;

      // 初めてのタグなら初期化
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      // 学習時間を加算
      acc[tag] += log.minutes;

      return acc;
    },
    {} as Record<string, number>,
  );

  // 配列に変換
  const sorted = Object.entries(tagSummary)
    .map(([tag, minutes]) => ({
      name: tag,
      value: minutes,
    }))
    .sort((a, b) => b.value - a.value); // 多い順に並べる

  // 上位5件
  const top5 = sorted.slice(0, 5);

  // それ以外
  const others = sorted.slice(5);

  // Others合計
  const othersSum = others.reduce((sum, item) => sum + item.value, 0);

  // 最終データ
  const chartData = [
    ...top5,
    ...(othersSum > 0 ? [{ name: "Others", value: othersSum }] : []),
  ];

  // 全体の学習時間（全ログ合計）
  const overallMinutes = studyLogs.reduce((sum, log) => {
    return sum + log.minutes;
  }, 0);

  // 今日の日付（YYYY-MM-DD形式）
  const today = new Date().toISOString().split("T")[0];

  // 今日の学習時間
  const todayMinutes = studyLogs
    .filter((log) => log.date.startsWith(today))
  .reduce((sum, log) => sum + log.minutes, 0);

  // 完了しているタスク数
  const completedTaskCount = tasks.filter((task) => task.done).length;

  // 全タスク数
  const totalTaskCount = tasks.length;

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
        <h1 className="text-2xl font-bold mb-6 text-center">Study Tracker</h1>

        {/* ダッシュボード */}
        <Dashboard
          overallMinutes={overallMinutes}
          todayMinutes={todayMinutes}
          completedTaskCount={completedTaskCount}
          totalTaskCount={totalTaskCount}
        />

        {/* タスク入力フォーム */}
        <TaskForm
          task={task}
          setTask={setTask}
          tag={tag}
          setTag={setTag}
          uniqueTags={uniqueTags}
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

        <Chart data={chartData} />
      </div>
    </main>
  );
}
