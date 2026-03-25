import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

export async function GET(req: NextRequest) {
  // 👇 認証（共通）
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
    // 🔥 ローカル（Prisma）
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return Response.json([], { status: 200 }); // 👈 404じゃなくてこれ推奨
    }


    const tasks = await prisma.task.findMany({
      where: { userId: dbUser.id },
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
  const { data, error } = await supabaseAuth
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
      total_minutes: body.totalMinutes,
    })
    .eq("id", body.id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}