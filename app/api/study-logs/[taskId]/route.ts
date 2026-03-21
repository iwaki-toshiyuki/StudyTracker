import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    const params = await context.params;
    const taskId = Number(params.taskId);

    console.log("🔥 削除対象 taskId:", taskId);

    const result = await prisma.studyLog.deleteMany({
      where: {
        taskId: BigInt(taskId), // ← ここ重要
      },
    });

    console.log("🔥 削除件数:", result.count);

    return Response.json({ success: true });

  } catch (error) {
    console.error("削除エラー:", error);
    return Response.json({ success: true });
  }
}