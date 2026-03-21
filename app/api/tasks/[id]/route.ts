import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

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