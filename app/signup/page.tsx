"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  // メールアドレスの状態管理
  const [email, setEmail] = useState("");

  // パスワードの状態管理
  const [password, setPassword] = useState("");

  // サインアップ処理
  const handleSignup = async () => {
    const { data } = await supabase.auth.signUp({
      email,
      password,
    });

    alert("登録完了");
  };

  return (
    <div>
      <h1>新規登録</h1>
      
      {/* メールアドレス入力 */}
      <input onChange={(e) => setEmail(e.target.value)} />
      {/* パスワード入力 */}
      <input onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSignup}>登録</button>
    </div>
  );
}