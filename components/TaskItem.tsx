import { useState } from "react";
import { Task, StudyLog } from './Types';
import TagInput from "./TagInput";
import { updateTaskDB } from "../lib/db";
import { supabase } from "@/lib/supabase";

// propsの型定義
type Props = {
  task: Task; // タスク内容
  deleteTask: (id: number) => void; // 削除関数
  updateTask: (id: number, newTask: Task) => void; // 編集保存関数
  toggleTask: (id: number) => void; // タスク完了状態切り替え関数
  studyLogs: StudyLog[]; // 学習ログ一覧
  setStudyLogs: React.Dispatch<React.SetStateAction<StudyLog[]>>; // 学習ログ更新関数
  fetchTasks: () => Promise<void>; // タスク再取得関数
  fetchStudyLogs: () => Promise<void>; // 学習ログ再取得関数
  uniqueTags: string[]; // 重複なしタグ一覧
  createStudyLog: (taskId: number, minutes: number) => Promise<void>; // 学習ログ追加関数（API呼び出し版）
};

export default function TaskItem({
  task,
  deleteTask,
  updateTask,
  toggleTask,
  fetchTasks,
  fetchStudyLogs,
  uniqueTags,
  createStudyLog,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  // 編集モードかどうか

  const [editTask, setEditTask] = useState(task.text);
  // 編集中のタスク内容

  const [editTag, setEditTag] = useState(task.tag);
  // 編集用state


  const handleSave = async() => {

    // 学習時間を数値に変換
    const newMinutes = Number(minutes);


    const { data: { session } } = await supabase.auth.getSession();

    // 前削除（このタスクの学習ログをすべて削除）
    await fetch(`/api/study-logs/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
    },
    });

     // 🔥 DB更新
    await updateTaskDB({
      ...task,
      text: editTask,
      tag: editTag,
      done: task.done,
      totalMinutes: newMinutes,
  });


    // 新しい学習ログを追加（0分は追加しない）
   if (newMinutes > 0) {
    await createStudyLog(task.id, newMinutes);
  }

  


    // 編集保存
    updateTask(task.id, {
      ...task, // 元のtaskオブジェクトをコピー
      text: editTask, // textだけ更新
      tag: editTag, // tagも更新
      totalMinutes: newMinutes, // 合計時間も更新
    });

    // タスクとログを再取得して最新状態に
    await fetchTasks();
    await fetchStudyLogs();

    // 入力リセット
    setMinutes("");

    // 編集モード終了
    setIsEditing(false);


  };

  // 学習時間入力用state
  const [minutes, setMinutes] = useState("");

  // タスクに紐づく学習ログを抽出(0分のログも含む)
  const taskTotalMinutes = task.totalMinutes ?? 0;

  // 日付フォーマット関数(JST表示用)
  const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

  return (
    <li className="rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all">
      <p className="text-xs text-gray-400">
        作成日：{formatDate(task.createdAt)}
      </p>
      {isEditing ? (
        <div className="space-y-3">
          {/* 編集フォーム */}
          <div className="flex gap-2">
            <input
              value={editTask}
              onChange={(e) => setEditTask(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="分"
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border border-gray-200 rounded-lg">
            <TagInput
              value={editTag}
              onChange={setEditTag}
              options={uniqueTags}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="rounded"
              />
              完了
            </label>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-sm px-4 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-medium block ${task.done ? "line-through text-gray-400" : "text-slate-700"}`}>
              {task.text}
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                {task.tag}
              </span>
              <span className="text-xs text-slate-400">{taskTotalMinutes} 分</span>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-3 shrink-0">
            <button
              onClick={() => {
                setIsEditing(true);
                setEditTask(task.text);
                setEditTag(task.tag);
                setMinutes(taskTotalMinutes.toString());
              }}
              className="text-xs text-slate-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              編集
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
