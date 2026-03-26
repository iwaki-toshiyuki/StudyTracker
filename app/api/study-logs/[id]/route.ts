import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const id = Number(params.id);

    if (isLocal) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
      });

      if (!dbUser) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      await prisma.studyLog.deleteMany({
        where: {
          id: BigInt(id),
          userId: dbUser.id,
        },
      });

      return Response.json({ success: true });
    }

    // 本番（Supabase）
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("supabaseId", user.id)
      .single();

    if (userError || !dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("study_logs")
      .delete()
      .eq("id", id)
      .eq("userId", dbUser.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("削除エラー:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
