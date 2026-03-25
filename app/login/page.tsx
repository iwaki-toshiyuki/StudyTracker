"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // ルーターの取得
  const router = useRouter();

  // メールアドレスとパスワードの状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ログイン処理
  const handleLogin = async () => {
    setErrorMessage("");
    // Supabaseの認証APIを呼び出してログイン
    const { data , error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
      return;
    }

    console.log("Supabase user id:", data.user?.id);

    // エラーがなければダッシュボードへリダイレクト
    if (!error) {

      // ログイン成功後、SupabaseのユーザーデータをPrismaに保存するAPIを呼び出す
      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      // ダッシュボードへリダイレクト
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">ログイン</h1>
        <div className="flex flex-col gap-4">
          {/* メールアドレス入力 */}
          <input
            type="email"
            placeholder="メールアドレス"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* パスワード入力 */}
          <input
            type="password"
            placeholder="パスワード"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            ログイン
          </button>
          {errorMessage && (
            <p className="text-sm text-center text-red-500">{errorMessage}</p>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          アカウントをお持ちでない方は{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}