import { supabase } from "./supabase";
import { Task } from "@/components/Types";

// ローカル環境かどうかを判定するフラグ
const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

// 取得
export async function getTasks() {

  if (isLocal) {
    // ローカル → API経由
    const res = await fetch("/api/tasks");
    return await res.json();
    };

  // 🔥 本番もAPI経由にする
    const res = await fetch("/api/tasks");
    return await res.json();
}

// 追加
export async function createTask(text: string, tag: string) {
  if (isLocal) {
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ text, tag }),
    });
    return;
  }

  const { data, error } = await supabase.from("tasks").insert({
    text,
    tag,
    done: false,
    total_minutes: 0,
    date: new Date().toISOString(),
  });

  if (error) throw error;

  return data;
}

// 削除
export async function deleteTask(id: number) {
  if (isLocal) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    return;
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateTaskDB(task: Task) {
  // タスクを更新する関数
  // ローカル環境ならAPI経由で更新
  if (isLocal) {
    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify(task),
    });
    return;
  }

  // DB更新
  await supabase
    .from("tasks")
    .update({
      text: task.text,
      tag: task.tag,
      done: task.done,
      total_minutes: task.totalMinutes,
    })
    .eq("id", task.id);
}


// study_logs取得
export async function getStudyLogs() {
  if (isLocal) {
    const res = await fetch("/api/study-logs");
    return await res.json();
  }

  const res = await fetch("/api/study-logs");
  return await res.json();
}

// 学習ログ追加
export async function createStudyLog(taskId: number, minutes: number) {
  if (isLocal) {
    await fetch("/api/study-logs", {
      method: "POST",
      body: JSON.stringify({ taskId, minutes }),
    });
    return;
  }

  await supabase.from("study_logs").insert({
    task_id: taskId,
    minutes,
    date: new Date().toISOString(),
  });
}

// タスクに紐づく学習ログを削除する関数
export async function deleteStudyLogsByTask(taskId: number) {
  console.log("🔥 delete呼ばれた", taskId);
  if (isLocal) {
    const res = await fetch(`/api/study-logs/${taskId}`, {
      method: "DELETE",
    });

    console.log("DELETE status:", res.status);

    return;
  }

  await supabase
    .from("study_logs")
    .delete()
    .eq("task_id", taskId);
}