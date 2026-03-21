// 学習ログもタスクと同様に、APIルートを作成してデータベースとやり取りする

import { prisma } from "@/lib/prisma";

// GET
export async function GET() {
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

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const log = await prisma.studyLog.create({
    data: {
      taskId: body.taskId,
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
