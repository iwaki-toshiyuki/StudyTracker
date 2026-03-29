import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function GET(req: NextRequest) {
  // 👇 認証（共通）
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  // 🔥 クエリパラメータの取得
  const { searchParams } = new URL(req.url);

  // 🔥 ページ情報
  const all = searchParams.get("all") === "true";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);
  const offset = (page - 1) * limit;

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
    // 🔥 ローカル（Prisma）
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
    return Response.json({
      data: [],
      total: 0,
    });
  }

    // 🔥 ページネーション追加（重要）
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: { userId: dbUser.id },
      orderBy: { id: "desc" },
      ...(all ? {} : { skip: offset, take: limit }),
    }),
    prisma.task.count({
      where: { userId: dbUser.id },
    }),
  ]);

    const formatted = tasks.map((task: any) => ({
      ...task,
      tag: task.tag ?? "",
      id: Number(task.id),
      date: task.date.toISOString(),
      createdAt: task.createdAt.toISOString(),
    }));

    // 🔥 完了済みタスクの数も取得（ダッシュボード用）
    const completedCount = await prisma.task.count({
      where: {
        userId: dbUser.id,
        done: true,
      },
    });

    // クライアントにタスクと総数を返す
    return Response.json({
      data: formatted,
      total: total,
      completedCount: completedCount,
  });
  }

  // 🔥 本番（Supabase）
  // 🔥 usersテーブルからID取得
  const { data: dbUser } = await supabaseAuth
    .from("users")
    .select("id")
    .eq("supabaseId", user.id)
    .single();

  if (!dbUser) {
    return Response.json([], { status: 200 });
  }

  // 🔥 tasksテーブルからタスク取得（ページネーション対応）
  const query = supabaseAuth
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("userId", dbUser.id)
    .order("id", { ascending: false });

  const { data, count, error } = all
    ? await query
    : await query.range(offset, offset + limit - 1);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Supabaseは日付が文字列で来るので、必要に応じて変換
  const formatted = data.map((task: any) => ({
    id: Number(task.id),
    text: task.text,
    tag: task.tag ?? "",
    done: task.done,
    totalMinutes: task.totalMinutes ?? task.total_minutes ?? 0,

    // Supabaseは日付が文字列で来るので、必要に応じて変換
    date: task.date
    ? new Date(task.date).toISOString()
    : null,

    createdAt:
      task.createdAt || task.created_at
        ? new Date(task.createdAt ?? task.created_at).toISOString()
        : null,

}));

  // 🔥 完了済みタスクの数も取得（ダッシュボード用）
  const { count: completedCount } = await supabaseAuth
  .from("tasks")
  .select("*", { count: "exact" })
  .eq("userId", dbUser.id)
  .eq("done", true);

// クライアントにタスクと総数を返す
return Response.json({
  data: formatted,
  total: count,
  completedCount: completedCount,
});
}

// POST
export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isLocal) {
    // 🔥 ローカル（Prisma）
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();


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

  const body = await req.json();

  // 🔥 本番
  const { data: dbUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("supabaseId", user.id)
    .single();

  if (userError || !dbUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const { data, error } = await supabase.from("tasks").insert({
    text: body.text,
    tag: body.tag,
    done: false,
    totalMinutes: 0,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    userId: dbUser.id,
  });


  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

// PUT
export async function PUT(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

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
      totalMinutes: body.totalMinutes,
    })
    .eq("id", body.id)
    .eq("userId", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}