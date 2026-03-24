import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // SupabaseのユーザーデータをPrismaに保存（upsert）
  await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {},
    create: {
      email: user.email!,
      supabaseId: user.id,
    },
  });

  return Response.json({ ok: true });
}