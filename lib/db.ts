import { supabase } from "./supabase";

// ローカル環境かどうかを判定するフラグ
const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

// 取得
export async function getTasks() {

  if (isLocal) {
    // ローカル → API経由
    const res = await fetch("/api/tasks");
    return await res.json();
    };

  // 本番 → Supabase直接
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) throw error;

  return data;
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