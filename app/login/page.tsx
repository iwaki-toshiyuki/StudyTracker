"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ページロード時に認証状態を確認
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    });
  }, [router]);

  // ログイン処理
  const handleLogin = async () => {
    setErrorMessage("");
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setIsLoggingIn(false);
      return;
    }

    // 認証トークンをサーバーに同期してからダッシュボードへ遷移
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/auth/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });

    router.push("/dashboard");
  };

  // 認証状態を確認中はローディングスピナーを表示
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">StudyTracker</h1>
      <p className="text-gray-500 mb-10 text-sm">学習記録を管理して、毎日の進捗を可視化しよう。</p>
      <div className="bg-white shadow rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ログイン</h2>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {isLoggingIn ? "ログイン中..." : "ログイン"}
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
