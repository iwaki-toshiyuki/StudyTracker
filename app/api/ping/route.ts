// ping APIは、Supabaseへの接続が成功しているかを確認するためのエンドポイントです。
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 🔥 軽くDBアクセス（重要）
  await supabase.from("tasks").select("id").limit(1);

  return new Response("OK");
}