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
  const { data, error } = await supabase
    .from("study_logs")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // 🔥 camelCaseに変換（超重要）
  const formatted = data.map((log: any) => ({
    id: Number(log.id),
    taskId: Number(log.task_id),
    minutes: log.minutes,
    date: log.date,
    createdAt: log.created_at,
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

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const body = await req.json();

  if (isLocal) {
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
  const { data, error } = await supabase.from("study_logs").insert({
    task_id: body.taskId,
    minutes: body.minutes,
    date: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}