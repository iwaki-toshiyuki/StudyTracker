"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  // メールアドレスの状態管理
  const [email, setEmail] = useState("");

  // パスワードの状態管理
  const [password, setPassword] = useState("");

  // ローディング状態の管理
  const [loading, setLoading] = useState(false);

  // サインアップ処理
  const handleSignup = async () => {
    // ローディング開始
    if (loading) return;

    // ローディング状態をtrueに設定
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    // サインアップ成功後、確認メールが送信されたことをユーザーに通知
    setLoading(false);

    if (error) {
    console.log(error);
  }
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
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? "登録中..." : "登録"}
          </button>
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