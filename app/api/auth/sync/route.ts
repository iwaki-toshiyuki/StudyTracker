import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.email) {
  return Response.json({ error: "Email is required" }, { status: 400 });
  }

  // SupabaseのユーザーデータをPrismaに保存（upsert）
  await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {},
    create: {
      email: user.email,
      supabaseId: user.id,
    },
  });

  return Response.json({ ok: true });
}