import { prisma } from "@/lib/prisma";

export async function DELETE(
// タスク削除API。関連する学習ログも一緒に消える。
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // URLパラメータからIDを取得
    const params = await context.params;
    const taskId = Number(params.id);

      // 🔥 IDが不正な場合はエラーにせず成功扱いにする（フロントでの削除後にAPI呼び出しが来るケースを考慮）
    if (!taskId || isNaN(taskId)) {
      return Response.json({ success: true });
    }

    // 🔥 タスク削除
    await prisma.task.deleteMany({
      where: {
        id: BigInt(taskId),
      },
    });

    return Response.json({ success: true });

  } catch (error: any) {
    console.error("削除エラー:", error);

    return Response.json(
      { error: "削除失敗", message: error.message },
      { status: 500 }
    );
  }
}