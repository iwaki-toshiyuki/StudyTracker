import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function GET() {
  const user = await getCurrentUser();

  // 認証されていない場合は401を返す
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isLocal) {
    // 🔥 ローカル（Prisma）
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });


    const tasks = await prisma.task.findMany({
      where: { userId: dbUser?.id },
      orderBy: { id: "desc" },
    });

    const formatted = tasks.map((task: any) => ({
      ...task,
      tag: task.tag ?? "",
      id: Number(task.id),
      date: task.date.toISOString(),
      createdAt: task.createdAt.toISOString(),
    }));

    return Response.json(formatted);
  }

  // 🔥 本番（Supabase）
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // 🔥 ここ追加
  const formatted = data.map((task: any) => ({
    id: Number(task.id),
    text: task.text,
    tag: task.tag ?? "",
    done: task.done,
    totalMinutes: task.total_minutes,
    date: task.date,
    createdAt: task.created_at,
}));

return Response.json(formatted);
}

// POST
export async function POST(req: Request) {
  // 認証チェック
  const user = await getCurrentUser();

  // 認証されていない場合は401を返す
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (isLocal) {
    // 🔥 ローカル（Prisma）
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });


    const task = await prisma.task.create({
      data: {
        text: body.text,
        tag: body.tag,
        date: new Date(),
        userId: dbUser!.id,
      },
    });

    return Response.json({
      ...task,
      tag: task.tag ?? "",
      id: Number(task.id),
      date: task.date.toISOString(),
      createdAt: task.createdAt.toISOString(),
    });
  }

  // 🔥 本番
  const { data, error } = await supabase.from("tasks").insert({
    text: body.text,
    tag: body.tag,
    done: false,
    total_minutes: 0,
    date: new Date().toISOString(),
    user_id: user.id,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// PUT
export async function PUT(req: Request) {
  // 認証チェック
  const user = await getCurrentUser();

  // 認証されていない場合は401を返す
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  if (isLocal) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    const updated = await prisma.task.update({
      where: { id: body.id },
      data: {
        text: body.text,
        tag: body.tag,
        done: body.done,
        totalMinutes: body.totalMinutes,
      },
    });

    return Response.json({
      ...updated,
      id: Number(updated.id),
      date: updated.date.toISOString(),
      createdAt: updated.createdAt.toISOString(),
    });
  }

  // 🔥 本番
  const { data, error } = await supabase
    .from("tasks")
    .update({
      text: body.text,
      tag: body.tag,
      done: body.done,
      total_minutes: body.totalMinutes,
    })
    .eq("id", body.id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}