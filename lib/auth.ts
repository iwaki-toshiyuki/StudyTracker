import { supabase } from "./supabase";

// 現在のユーザーを取得する関数
export async function getCurrentUser() {

  // Supabaseの認証APIを呼び出してユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}