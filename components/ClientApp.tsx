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

import { getTasks, createTask, deleteTask as deleteTaskDB, getStudyLogs, createStudyLog } from "../lib/db";
// DB操作関数をインポート

export default function ClientApp({ initialTasks, initialLogs }: Props) {
  const [task, setTask] = useState("");
  // 入力中のタスクを管理
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // タグ入力用
  const [tag, setTag] = useState("");

  // タスク追加関数
  const addTask = async () => {
  // タスクとタグの両方が空でないことを確認
  if (!task.trim() || !tag.trim()) return;

  // タスクを追加してDBに保存
  await createTask(task, tag);

  // タスクをAPIから再取得してstateを更新
  await fetchTasks();

  setTask("");
  setTag("");
};


  const deleteTask = async(id: number) => {
    // タスク削除
    await deleteTaskDB(id);

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

  // 学習ログ一覧
  // 全ての学習ログを管理
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(initialLogs);

  // 学習ログ追加関数
  const addStudyLog = async (taskId: number, minutes: number) => {

    // 学習ログを追加してDBに保存
    await createStudyLog(taskId, minutes);

  };

  // 学習ログ再取得関数
  const fetchStudyLogs = async () => {
    // APIから学習ログを取得してstateを更新する関数
    const data = await getStudyLogs();

    // 取得したデータをstateにセット
    setStudyLogs(data);
};

  // 重複なしタグ一覧を作成
  const uniqueTags = Array.from(new Set(tasks.map((task) => task.tag)));

  // タグごとの学習時間集計
  const tagSummary = studyLogs.reduce(
    (acc, log) => {
      // task_idからタスクを取得
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
  // APIからタスクを取得してstateを更新する関数
  try {
    const data = await getTasks();

    setTasks(
      data.map((task: any) => ({
        ...task,
        // SupabaseとPrisma両対応
        totalMinutes:
          task.totalMinutes ?? task.total_minutes ?? 0,
      }))
    );
  } catch (error) {
    console.error(error);
  }
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
          studyLogs={studyLogs}
          setStudyLogs={setStudyLogs}
          fetchTasks={fetchTasks}
          fetchStudyLogs={fetchStudyLogs}
          uniqueTags={uniqueTags}
          createStudyLog={addStudyLog}
        />

        <Chart data={chartData} />
      </div>
    </main>
  );
 }
