// TaskItemコンポーネントをインポート
import TaskItem from "./TaskItem";
import { Task, StudyLog } from "./Types";

// propsの型定義
type Props = {
  tasks: Task[]; // タスク一覧
  deleteTask: (id: number) => void; // 削除関数
  updateTask: (id: number, newTask: Task) => void; // 編集保存関数
  toggleTask: (id: number) => void; // タスク完了状態切り替え関数
  addStudyLog: (taskId: number, minutes: number) => void; //学習ログ追加関数
  studyLogs: StudyLog[]; // 学習ログ一覧
  setStudyLogs: React.Dispatch<React.SetStateAction<StudyLog[]>>; // 学習ログ更新関数
  fetchTasks: () => Promise<void>; // タスク再取得関数
  fetchStudyLogs: () => Promise<void>; // 学習ログ再取得関数
  uniqueTags: string[]; // 重複なしタグ一覧
};

export default function TaskList({
  tasks,
  deleteTask,
  updateTask,
  toggleTask,
  addStudyLog,
  studyLogs,
  setStudyLogs,
  fetchTasks,
  fetchStudyLogs,
  uniqueTags,
}: Props) {
  return (
    // タスク一覧
    <ul className="space-y-2">
      {tasks.map((task) => (
        // tasks配列をループして表示

        <TaskItem
          key={task.id} // タスクのIDをkeyにする（Reactのリスト表示で必要）
          // Reactのリスト表示で必要

          task={task}
          // タスク内容

          deleteTask={deleteTask}
          // 削除関数を子コンポーネントに渡す

          updateTask={updateTask}
          // 編集保存関数を子コンポーネントに渡す

          toggleTask={toggleTask}
          // タスク完了状態切り替え関数を子コンポーネントに渡す

          addStudyLog={addStudyLog}
          // 学習ログ追加関数を子コンポーネントに渡す

          studyLogs={studyLogs}
          // 学習ログ一覧を子コンポーネントに渡す

          setStudyLogs={setStudyLogs}
          // 学習ログ更新関数を子コンポーネントに渡す

          fetchTasks={fetchTasks}
          // タスク再取得関数を子コンポーネントに渡す

          fetchStudyLogs={fetchStudyLogs}
          // 学習ログ再取得関数を子コンポーネントに渡す

          uniqueTags={uniqueTags}
          // 重複なしタグ一覧を子コンポーネントに渡す
        />
      ))}
    </ul>
  );
}
