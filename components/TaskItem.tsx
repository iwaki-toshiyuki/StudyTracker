import { useState } from "react";


// propsの型定義
type Props = {
  task: string; // タスク内容
  index: number; // タスクの位置
  deleteTask: (index: number) => void; // 削除関数
  updateTask: (index: number, newTask: string) => void; // 編集保存関数
};

export default function TaskItem({ task, index, deleteTask, updateTask }: Props) {
const [isEditing, setIsEditing] = useState(false);
  // 編集モードかどうか

  const [editTask, setEditTask] = useState(task);
  // 編集中のタスク内容

  const handleSave = () => {
  // 編集保存

    updateTask(index, editTask);

    setIsEditing(false);

  };

  return (

    <li className="flex justify-between items-center border p-3 rounded">

      {isEditing ? (

        <>
          {/* 編集入力フォーム */}

          <input
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            className="border px-2 py-1 flex-1"
          />

          <button
            onClick={handleSave}
            className="text-green-500 ml-2"
          >
            保存
          </button>

        </>

      ) : (

        <>
          {/* タスク表示 */}

          <span>{task}</span>

          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 ml-2"
          >
            編集
          </button>

        </>

      )}

      {/* 削除ボタン */}

      <button
        onClick={() => deleteTask(index)}
        className="text-red-500 ml-2"
      >
        削除
      </button>

    </li>

  );

}