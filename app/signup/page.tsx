"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  // サインアップページコンポーネント
  const router = useRouter();


  // メールアドレスの状態管理
  const [email, setEmail] = useState("");

  // パスワードの状態管理
  const [password, setPassword] = useState("");

  // エラーメッセージの状態管理
  const [errorMessage, setErrorMessage] = useState("");

  // サインアップ処理
  const handleSignup = async () => {
    setErrorMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // 🔥 session取得
    const { data: { session } } = await supabase.auth.getSession();

    // 🔥 DB同期（超重要）
    await fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">新規登録</h1>
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
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            登録
          </button>
          {errorMessage && (
            <p className="text-sm text-center text-red-500">{errorMessage}</p>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          すでにアカウントをお持ちの方は{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            ログイン
          </a>
        </p>
      </div>
    </div>
  );
}