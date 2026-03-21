import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

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
    ...log,
    id: log.id,
    taskId: log.task_id,
    minutes: log.minutes,
    date: log.date,
    createdAt: log.created_at,
  }));

  return Response.json(formatted);
}