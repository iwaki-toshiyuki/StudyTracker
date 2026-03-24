import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Page() {
  // セッションを取得して認証状態を確認
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッションがない場合はログインページへリダイレクト
  if (!session) {
    redirect("/login");
  }

  // 認証されている場合はダッシュボードへリダイレクト
  redirect("/dashboard");
}