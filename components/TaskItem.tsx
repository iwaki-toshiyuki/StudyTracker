import { useState } from "react";
import { Task, StudyLog } from "./Types";
import { supabase } from "../lib/supabase";

// propsの型定義
type Props = {
  task: Task; // タスク内容
  index: number; // タスクの位置
  deleteTask: (index: number) => void; // 削除関数
  updateTask: (index: number, newTask: Task) => void; // 編集保存関数
  toggleTask: (index: number) => void; // タスク完了状態切り替え関数
  addStudyLog: (index: number, minutes: number) => void; // 学習ログ追加関数
  studyLogs: StudyLog[]; // 学習ログ一覧
  setStudyLogs: React.Dispatch<React.SetStateAction<StudyLog[]>>; // 学習ログ更新関数
  fetchTasks: () => Promise<void>; // タスク再取得関数
};

export default function TaskItem({
  task,
  index,
  deleteTask,
  updateTask,
  toggleTask,
  addStudyLog,
  studyLogs,
  setStudyLogs,
  fetchTasks,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  // 編集モードかどうか

  const [editTask, setEditTask] = useState(task.text);
  // 編集中のタスク内容

  const [editTag, setEditTag] = useState(task.tag);
  // 編集用state


  const handleSave = async() => {

    // 差分計算(今回入力した時間 - これまでの合計時間)
    const diff = Number(minutes) - taskTotalMinutes;

     // 🔥 DB更新
  await supabase
    .from("tasks")
    .update({
      total_minutes: Number(minutes),
    })
    .eq("id", task.id);


    // 編集保存
    updateTask(index, {
      ...task, // 元のtaskオブジェクトをコピー
      text: editTask, // textだけ更新
      tag: editTag, // tagも更新
      totalMinutes: Number(minutes), // 合計時間も更新
    });

    // 🔥 差分だけログ追加
    if (diff > 0) {
      addStudyLog(task.id, diff);
    }

    // 入力リセット
    setMinutes("");

    // 編集モード終了
    setIsEditing(false);

  };

  // 学習時間入力用state
  const [minutes, setMinutes] = useState("");

  // タスクに紐づく学習ログを抽出(0分のログも含む)
  const taskTotalMinutes = task.totalMinutes ?? 0;

  return (
    <li className="border p-3 rounded">
      {isEditing ? (
        <>
          {/* 編集入力フォーム */}
          <div className="flex flex-wrap items-center gap-2 w-full">
            {/* 編集時タスク入力 */}
            <input
              value={editTask}
              onChange={(e) => setEditTask(e.target.value)}
              className="border px-2 py-1"
            />

            {/* 編集時タグ入力 */}
            <input
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              className="border px-2 py-1"
            />

            {/* 学習時間入力 */}
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="分"
              className="border px-2 py-1 w-20"
            />

            {/* タスク完了チェック */}
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(index)}
            />

            <button onClick={handleSave} className="text-green-500 ml-2">
              保存
            </button>

            {/* 削除ボタン */}

            <button
              onClick={() => deleteTask(index)}
              className="text-red-500 ml-2"
            >
              削除
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            {/* タスク表示 */}

            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.text} ({task.tag})（合計: {taskTotalMinutes}分）
            </span>

            <button
              onClick={() => {
                // 編集モードに切り替え
                setIsEditing(true)
                // 編集用stateに現在の値をセット
                setEditTask(task.text);
                setEditTag(task.tag);
                setMinutes(taskTotalMinutes.toString());
              }
              }
              className="text-blue-500 ml-2"
            >
              編集
            </button>

            {/* 削除ボタン */}

            <button
              onClick={() => deleteTask(index)}
              className="text-red-500 ml-2"
            >
              削除
            </button>
          </div>
        </>
      )}
    </li>
  );
}
