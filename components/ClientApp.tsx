"use client";
// Next.jsのApp Routerでは、Reactのstateやイベントを使う場合は
// クライアントコンポーネントとして宣言する必要がある

type Props = {
    // クライアントコンポーネントのprops型
    initialTasks: Task[];
    initialLogs: StudyLog[];
};

import { Task, StudyLog } from "../components/Types";

import { useState, useEffect} from "react";
// Reactのstate管理フックをインポート

import TaskForm from "../components/TaskForm";
// 入力フォームコンポーネント

import TaskList from "../components/TaskList";
// タスク一覧コンポーネント

import Chart from "../components/Chart";
// 学習時間をタグごとに集計して表示するチャートコンポーネント

import Dashboard from "../components/DashBoard";
// 全体の学習時間や達成率を表示するダッシュボードコンポーネント

import { supabase } from "../lib/supabase";

export default function ClientApp({ initialTasks, initialLogs }: Props) {
  const [task, setTask] = useState("");
  // 入力中のタスクを管理
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = async() => {
    // 空チェック(タスクとタグ両方)
    if (!task.trim() || !tag.trim()) return;

  // DBにINSERT
  const { error } = await supabase.from("tasks").insert({
    text: task,
    tag: tag,
    done: false,
    total_minutes: 0,
    date: new Date().toISOString(),
  });

  if (error) {
    console.error(error);
    return;
  }

    // サーバーから再取得
    await fetchTasks();


    setTask(""); // 入力リセット
    setTag(""); // タグもリセット
  };

  const deleteTask = async(id: number) => {
    const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  // 再取得
  await fetchTasks();
  };

  const updateTask = (id: number, newTask: Task) => {
    // 編集保存

    setTasks((prev) =>
    // タスク配列をループして、対象のタスクだけ内容を更新する

    prev.map((task) =>
      task.id === id ? newTask : task
    // idが一致するタスクだけnewTaskに置き換える
    )
  );
  };

  // タスクの完了状態を切り替える関数
  const toggleTask = (id: number) => {
    // 完了状態切り替え
    setTasks((prev) =>

    // タスク配列をループして、対象のタスクだけdoneを反転させる
    prev.map((task) =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    )
  );
  };

  console.log(tasks);

  // 学習ログ一覧
  // 全ての学習ログを管理
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(initialLogs);

  // 学習ログ追加関数
  const addStudyLog = async (taskId: number, minutes: number) => {

    const { error } = await supabase.from("study_logs").insert({
    task_id: taskId,
    minutes: minutes,
    date: new Date().toISOString(),
  });

  if (error) {
    console.error(error);
    return;
  }

    setStudyLogs((prev) => [...prev]);
    // 配列に追加
  };

  // タスクに紐づく学習ログを抽出(0分のログも含む)
  const fetchStudyLogs = async () => {
  const { data, error } = await supabase
    .from("study_logs")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  setStudyLogs(data || []);
};

  // タグ入力用
  const [tag, setTag] = useState("");

  // 重複なしタグ一覧を作成
  const uniqueTags = Array.from(new Set(tasks.map((task) => task.tag)));

  // タグごとの学習時間集計
  const tagSummary = studyLogs.reduce(
    (acc, log) => {
      // task_idからタスクを取得
      const task = tasks.find((t) => t.id === log.task_id);

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


  // 今日の日付（YYYY-MM-DD形式）
  const today = new Date().toISOString().split("T")[0];

 // 今日のログだけ抽出して合計
  const todayMinutes = studyLogs
  .filter((log) => log.date.startsWith(today)) // 今日のログだけ
  .reduce((sum, log) => sum + log.minutes, 0); // 分を合計

  // 総学習時間（全ログ合計）
  const overallMinutes = studyLogs.reduce(
    (sum, log) => sum + log.minutes,
    0
  );

  // 完了しているタスク数
  const completedTaskCount = tasks.filter((task) => task.done).length;

  // 全タスク数
  const totalTaskCount = tasks.length;

  // タスクをAPIから再取得する関数
  const fetchTasks = async () => {
  // DBから取得
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

   // DBのカラム名に合わせて変換
  const formatted = (data || []).map((task) => ({
    ...task,
    totalMinutes: task.total_minutes ?? 0, // ← 変換
  }));

  // state更新
  setTasks(formatted);
};


// 初回ロード時にAPIからタスクと学習ログを取得
useEffect(() => {
  fetchTasks();
  fetchStudyLogs();
}, []);



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
          setStudyLogs={setStudyLogs}
          fetchTasks={fetchTasks}
          fetchStudyLogs={fetchStudyLogs}
        />

        <Chart data={chartData} />
      </div>
    </main>
  );
}
