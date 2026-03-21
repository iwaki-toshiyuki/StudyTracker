import { prisma } from "@/lib/prisma";

export async function DELETE(
// タスク削除API。関連する学習ログも一緒に消える。
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // URLパラメータからIDを取得
    const params = await context.params;
    const id = Number(params.id);

    // 🔥 タスク削除（関連ログも消える）
    await prisma.task.delete({
      where: {
        id: BigInt(id),
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