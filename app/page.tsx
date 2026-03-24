import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  // セッションを取得して認証状態を確認
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 認証されている場合はダッシュボードへリダイレクト
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow rounded-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Study Tracker</h1>
        <p className="text-gray-500 mb-8">
          学習記録を管理して、毎日の進捗を可視化しよう。
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="w-full bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 rounded-lg border border-blue-600 transition-colors"
          >
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}