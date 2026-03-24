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

  // ログイン処理
  const handleLogin = async () => {
    // Supabaseの認証APIを呼び出してログイン
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // エラーがなければダッシュボードへリダイレクト
    if (!error) {

      // ログイン成功後、SupabaseのユーザーデータをPrismaに保存するAPIを呼び出す
      await fetch("/api/auth/sync", {
        method: "POST",
      });

      // ダッシュボードへリダイレクト
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      {/* メールアドレス入力 */}
      <input onChange={(e) => setEmail(e.target.value)} />
      {/* パスワード入力 */}
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
}