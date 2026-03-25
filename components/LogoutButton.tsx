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

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1.5 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
    >
      ログアウト
    </button>
  );
}