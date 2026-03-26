import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

// GET
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );


  // 🔥 認証トークンからユーザー情報を取得
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

    if (isLocal) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
    return Response.json([], { status: 200 });
    }

    const logs = await prisma.studyLog.findMany({
      where: { userId: dbUser.id },
      orderBy: { id: "desc" },
    });


    const formatted = logs.map((log: any) => ({
      ...log,
      id: Number(log.id),
      taskId: Number(log.taskId),
      date: log.date.toISOString(),
      createdAt: log.createdAt.toISOString(),
    }));

    return Response.json(formatted);
  }

  // 🔥 本番（Supabase）
  const { data: dbUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("supabaseId", user.id)
    .single();

  if (userError || !dbUser) {
    return Response.json([], { status: 200 });
  }

  const { data, error } = await supabase
    .from("study_logs")
    .select("*")
    .eq("userId", dbUser.id);

  if (error || !data) {
  return Response.json([], { status: 200 });
  }

  const formatted = data.map((log: any) => ({
    id: Number(log.id),
    taskId: Number(log.taskId),
    minutes: log.minutes,
    date: log.date,
    createdAt: log.createdAt,
  }));

  return Response.json(formatted);
}

// POST
export async function POST(req: Request) {
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

  const body = await req.json();

  if (isLocal) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const log = await prisma.studyLog.create({
      data: {
        taskId: BigInt(body.taskId),
        userId: dbUser.id,
        minutes: body.minutes,
        date: new Date(),
      },
    });

    return Response.json({
      ...log,
      id: Number(log.id),
      taskId: Number(log.taskId),
      date: log.date.toISOString(),
      createdAt: log.createdAt.toISOString(),
    });
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

  const { data, error } = await supabase.from("study_logs").insert({
    taskId: body.taskId,
    minutes: body.minutes,
    date: new Date().toISOString(),
    userId: dbUser.id,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}