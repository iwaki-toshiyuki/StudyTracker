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
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
// 認証状態の確認とリダイレクトのためにsupabaseとrouterをインポート

import TaskForm from "../components/TaskForm";
// 入力フォームコンポーネント

import TaskList from "../components/TaskList";
// タスク一覧コンポーネント

import Chart from "../components/Chart";
// 学習時間をタグごとに集計して表示するチャートコンポーネント

import Dashboard from "../components/DashBoard";
// 全体の学習時間や達成率を表示するダッシュボードコンポーネント

import Pagination from "@/components/Pagination";
// タスク一覧のページネーションコンポーネント

import { getTasks, getAllTasks, createTask, deleteTask as deleteTaskDB, getStudyLogs, createStudyLog, updateTaskDB } from "../lib/db";
// DB操作関数をインポート

export default function ClientApp({ initialTasks, initialLogs }: Props) {
  const [task, setTask] = useState("");
  // 入力中のタスクを管理
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // チャート・ダッシュボード計算用（全ページ分）
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);

  // タグ入力用
  const [tag, setTag] = useState("");

  // 全タスク再取得関数（チャート・ダッシュボード用）
  const fetchAllTasks = async () => {
    const data = await getAllTasks();
    setAllTasks(data);
  };

  // タスク追加関数
  const addTask = async () => {
  // タスクとタグの両方が空でないことを確認
  if (!task.trim() || !tag.trim()) return;

  // タスクを追加してDBに保存
  await createTask(task, tag);

  // タスクをAPIから再取得してstateを更新
  await fetchTasks();
  await fetchAllTasks();

  setTask("");
  setTag("");
};


  const deleteTask = async(id: number) => {
    // タスク削除
    await deleteTaskDB(id);

  // 再取得
  await fetchTasks();
  await fetchAllTasks();
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
  const toggleTask = async (id: number) => {

    // 対象のタスクを取得
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    // 新しい完了状態を作成
    const updatedTask = { ...target, done: !target.done };

    // DBに完了状態を保存（これをしないとリロード時にリセットされる）
    await updateTaskDB(updatedTask);

    // タスクとログを再取得してグラフを即時更新
    await fetchTasks();
    await fetchAllTasks();
    await fetchStudyLogs();
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
  const uniqueTags = Array.from(new Set(tasks.map((task: any) => task.tag)));

  // タグごとの学習時間集計（完了済みタスクのみ）
  const tagSummary = studyLogs.reduce(
    (acc, log) => {
      // task_idからタスクを取得（全ページ対象）
      const task = allTasks.find((t) => t.id === log.taskId);

      // タスクが見つからない場合、または未完了の場合はスキップ
      // → 完了チェックを入れたタスクだけグラフに反映する
      if (!task || !task.done) return acc;

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


  // 今日の日付をローカル時刻で取得（YYYY-MM-DD形式）
  // toISOString()はUTC時刻を返すため、日本時間では日付がずれる場合がある
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  // ログのdateをローカル日付に変換して今日のものか判定するヘルパー関数
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const local = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
    return local === today;
  };

  // 今日のログだけ抽出して合計
  const todayMinutes = studyLogs
    .filter((log) => isToday(log.date)) // 今日のログだけ（ローカル日付で比較）
    .reduce((sum, log) => sum + log.minutes, 0); // 分を合計

  // 今日のログをタグ別に集計（円グラフ用、完了済みタスクのみ）
  const todayTagSummary = studyLogs
    .filter((log) => isToday(log.date)) // 今日のログだけ（ローカル日付で比較）
    .reduce(
      (acc, log) => {
        // taskIdからタスクを取得（全ページ対象）
        const task = allTasks.find((t) => t.id === log.taskId);

        // タスクが見つからない場合、または未完了の場合はスキップ
        if (!task || !task.done) return acc;

        const tag = task.tag;
        if (!acc[tag]) acc[tag] = 0;
        acc[tag] += log.minutes;
        return acc;
      },
      {} as Record<string, number>,
    );

  // 配列に変換（多い順に並べる）
  const todayChartData = Object.entries(todayTagSummary)
    .map(([tag, minutes]) => ({ name: tag, value: minutes }))
    .sort((a, b) => b.value - a.value);

  // 総学習時間（全ログ合計）
  const overallMinutes = studyLogs.reduce(
    (sum, log) => sum + log.minutes,
    0
  );


  // ページネーション用のstate
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 総タスク数（ダッシュボード用）
  const totalTaskCount = total;

  // 1ページあたりのタスク数
  const limit = 5; // 1ページ5件

  // ダッシュボード用のstate
  const [completedTaskCount, setCompletedTaskCount] = useState(0);

  // タスクをAPIから再取得する関数
  const fetchTasks = async () => {
  // APIからタスクを取得してstateを更新する関数
  try {
    const result = await getTasks(page,limit);

    setTasks(result.data);
    setTotal(result.total);
    setCompletedTaskCount(result.completedCount);

  } catch (error) {
    console.error(error);
  }
};

// 認証状態の確認とリダイレクト
const router = useRouter();

useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();

      // ✅ 未ログイン → ログインページへ
      if (!data.session) {
        router.push("/login");
        return;
      }

      // 🔥 ログイン済みだけデータ取得
      await fetchTasks();
      await fetchAllTasks();
      await fetchStudyLogs();
    };

    check();
  }, [page]); // ページが変わるたびにタスクを再取得



  return (
    <main className="min-h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 左カラム：フォーム・タスク一覧 */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* ページネーション */}
            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          </div>

          {/* 右カラム：ダッシュボード・グラフ */}
          <div className="space-y-6">
            {/* ダッシュボード */}
            <Dashboard
              overallMinutes={overallMinutes}
              todayMinutes={todayMinutes}
              completedTaskCount={completedTaskCount}
              totalTaskCount={totalTaskCount}
            />

            <Chart data={chartData} todayData={todayChartData} />
          </div>

        </div>
      </div>
    </main>
  );
 }
