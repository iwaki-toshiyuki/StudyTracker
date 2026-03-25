"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ログアウトボタンコンポーネント
export default function LogoutButton() {
  const router = useRouter();

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return <button onClick={handleLogout}>ログアウト</button>;
}