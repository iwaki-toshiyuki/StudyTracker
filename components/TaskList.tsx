// TaskItemコンポーネントをインポート
import TaskItem from "./TaskItem";
import { Task } from "./Task";

// propsの型定義
type Props = {
  tasks: Task[]; // タスク一覧
  deleteTask: (index: number) => void; // 削除関数
  updateTask: (index: number, newTask: Task) => void; // 編集保存関数
  toggleTask: (index:number) => void; // タスク完了状態切り替え関数
};

export default function TaskList({ tasks, deleteTask, updateTask, toggleTask }: Props) {

  return (

    // タスク一覧
    <ul className="space-y-2">

      {tasks.map((task, index) => (
      // tasks配列をループして表示

        <TaskItem
          key={index}
          // Reactのリスト表示で必要

          task={task}
          // タスク内容

          index={index}
          // タスクの位置

          deleteTask={deleteTask}
          // 削除関数を子コンポーネントに渡す

          updateTask={updateTask}
            // 編集保存関数を子コンポーネントに渡す

          toggleTask={toggleTask}
          // タスク完了状態切り替え関数を子コンポーネントに渡す
        />

      ))}

    </ul>

  );

}