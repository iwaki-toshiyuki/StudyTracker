import { useState } from "react";
import { Task, StudyLog } from "./Types";

// propsの型定義
type Props = {
  task: Task; // タスク内容
  index: number; // タスクの位置
  deleteTask: (index: number) => void; // 削除関数
  updateTask: (index: number, newTask: Task) => void; // 編集保存関数
  toggleTask: (index: number) => void; // タスク完了状態切り替え関数
  addStudyLog: (index: number, minutes: number) => void; // 学習ログ追加関数
  studyLogs: StudyLog[]; // 学習ログ一覧
};

export default function TaskItem({
  task,
  index,
  deleteTask,
  updateTask,
  toggleTask,
  addStudyLog,
  studyLogs,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  // 編集モードかどうか

  const [editTask, setEditTask] = useState(task.text);
  // 編集中のタスク内容

  const [editTag, setEditTag] = useState(task.tag);
  // 編集用state

  const handleSave = () => {
    // 編集保存

    updateTask(index, {
      ...task, // 元のtaskオブジェクトをコピー
      text: editTask, // textだけ更新
      tag: editTag, // tagも更新
    });

    // 🔥 学習ログ追加（ここが重要）
    if (minutes) {
      addStudyLog(task.id, Number(minutes));
    }

    // 入力リセット
    setMinutes("");

    // 編集モード終了
    setIsEditing(false);
  };

  // 学習時間入力用state
  const [minutes, setMinutes] = useState("");

  // このタスクのログだけ取得
  const filteredLogs = studyLogs.filter((log) => log.taskId === task.id);

  // 合計時間を計算
  const totalMinutes = filteredLogs.reduce((sum, log) => sum + log.minutes, 0);

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
              {task.text} ({task.tag})（合計: {totalMinutes}分）
            </span>

            <button
              onClick={() => setIsEditing(true)}
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
