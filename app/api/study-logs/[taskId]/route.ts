import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    const params = await context.params;
    const taskId = Number(params.taskId);

    if (isLocal) {
      const result = await prisma.studyLog.deleteMany({
        where: {
          taskId: BigInt(taskId),
        },
      });

      console.log("🔥 削除件数:", result.count);
      return Response.json({ success: true });
    }

    // 本番（Supabase）
    const { error } = await supabase
      .from("study_logs")
      .delete()
      .eq("task_id", taskId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("削除エラー:", error);
    return Response.json({ success: false });
  }
}