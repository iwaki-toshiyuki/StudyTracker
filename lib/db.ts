import { supabase } from "./supabase";
import { Task } from "@/components/Types";

// ローカル環境かどうかを判定するフラグ
const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function getTasks() {
  // 👇 セッション取得
  const { data: { session } } = await supabase.auth.getSession();

  // 👇 セッションがない場合は空配列を返す
  if (!session) {
    console.warn("No session");
    return [];
  }

  // 👇 API呼び出し（トークン付き）
  const res = await fetch("/api/tasks", {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const data = await res.json();

  // 🔥 追加（ここ）
  console.log("tasks data:", data);

  // 👇 安全対策
  if (!Array.isArray(data)) {
    console.error("Invalid response:", data);
    return [];
  }

  return data;
}

// 追加
export async function createTask(text: string, tag: string) {
  // 追加する関数
  const { data: { session } } = await supabase.auth.getSession();
  if (isLocal) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
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
  // タスクを削除する関数
  const { data: { session } } = await supabase.auth.getSession();

  if (isLocal) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
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

  const { data: { session } } = await supabase.auth.getSession();

  // ローカル環境ならAPI経由で更新
  if (isLocal) {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
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
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch("/api/study-logs", { 
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
   });
  return await res.json();
}

// 学習ログ追加
export async function createStudyLog(taskId: number, minutes: number) {
  // 学習ログを追加する関数
  const { data: { session } } = await supabase.auth.getSession();

  if (isLocal) {
    await fetch("/api/study-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
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
  const { data: { session } } = await supabase.auth.getSession();

  if (isLocal) {
    const res = await fetch(`/api/study-logs/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    return;
  }

  await supabase
    .from("study_logs")
    .delete()
    .eq("task_id", taskId);
}