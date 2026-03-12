// propsの型定義
type Props = {
  task: string; // 現在入力中のタスク
  setTask: (task: string) => void; // 入力値を更新する関数
  addTask: () => void; // タスク追加関数
};

export default function TaskForm({ task, setTask, addTask }: Props) {

  return (

    // タスク入力エリア
    <div className="flex gap-2 mb-6">

      {/* タスク入力フォーム */}
      <input
        type="text"
        value={task} 
        // 入力フォームの値をstateと同期

        onChange={(e) => setTask(e.target.value)}
        // 入力された文字をtask stateに保存

        placeholder="タスクを入力"

        className="border rounded px-3 py-2 w-full"
      />

      {/* タスク追加ボタン */}
      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        追加
      </button>

    </div>

  );

}