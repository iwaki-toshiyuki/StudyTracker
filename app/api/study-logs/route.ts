import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

// GET
export async function GET() {
  if (isLocal) {
    const logs = await prisma.studyLog.findMany({
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
  const body = await req.json();

  if (isLocal) {
    const log = await prisma.studyLog.create({
      data: {
        taskId: BigInt(body.taskId),
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