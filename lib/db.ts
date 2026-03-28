import { supabase } from "./supabase";
import { Task, GetTasksResponse } from "@/components/Types";

// ローカル環境かどうかを判定するフラグ
const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function getTasks(page: number, limit: number): Promise<GetTasksResponse> {
  // 👇 セッション取得
  const { data: { session } } = await supabase.auth.getSession();

  // 👇 セッションがない場合は空配列を返す
  if (!session) {
    console.warn("No session");
    return {
      data: [],
      total: 0,
      completedCount: 0,
    };
  }

  // 👇 API呼び出し（トークン付き）
  const res = await fetch(
    // 🔥 ページネーション対応
    `/api/tasks?page=${page}&limit=${limit}`,
    {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  console.log("res:", res);

  if (!res.ok) {
  const text = await res.text();
  console.error("API Error:", text);
  return { 
    data: [], 
    total: 0,
    completedCount: 0,};
}

  const json = await res.json();

  console.log("json:", json);

  // 🔥 APIからタスクと総数を受け取る
  const formatted = json.data.map((task: any) => ({
    ...task,
    totalMinutes:
      task.totalMinutes ?? task.total_minutes ?? 0,
  }));

  // レスポンスの形式が正しいか確認
  if (!Array.isArray(formatted)) {
    console.error("Invalid response:", json);
    return {
      data: [],
      total: 0,
      completedCount: 0,
    };
  }

  return {
    data: formatted,
    total: json.total,
    completedCount: json.completedCount ?? 0,
  };
}

// 全タスク取得（チャート・ダッシュボード計算用）
export async function getAllTasks(): Promise<Task[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const res = await fetch("/api/tasks?all=true", {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return [];

  const json = await res.json();
  return json.data.map((task: any) => ({
    ...task,
    totalMinutes: task.totalMinutes ?? task.total_minutes ?? 0,
  }));
}

// 追加
export async function createTask(text: string, tag: string) {
  // 追加する関数
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
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

  const { data: dbUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("supabaseId", session.user.id)
    .single();

  if (userError || !dbUser) throw new Error("User not found");

  const { data, error } = await supabase.from("tasks").insert({
    text,
    tag,
    done: false,
    totalMinutes: 0,
    date: new Date().toISOString(),
    userId: dbUser.id,
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
      totalMinutes: task.totalMinutes,
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
  const data = await res.json();

  return data;
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

  // 🔥 追加：ユーザー取得
  const { data: { user } } = await supabase.auth.getUser();

  // 🔥 usersテーブルからid取得
  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("supabaseId", user?.id)
    .single();

  if (!dbUser) throw new Error("User not found");


  // 🔥 study_logsテーブルに挿入
  await supabase.from("study_logs").insert({
    taskId,
    minutes,
    date: new Date().toISOString(),
    userId: dbUser.id
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
    .eq("taskId", taskId);
}