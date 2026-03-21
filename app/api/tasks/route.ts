import { prisma } from "@/lib/prisma";



export async function GET() {
    // タスクを全件取得して、作成日時の降順で並べる
    const tasks = await prisma.task.findMany({
    orderBy: { id: "desc" },
  });

   // 🔥 BigInt → number 変換
  const formatted = tasks.map((task) => ({
      ...task,
    tag: task.tag ?? "", // tagがnullの場合は空文字にする
    id: Number(task.id), // IDを数値に変換
    date: task.date.toISOString(), // 日付をISO文字列に変換
    createdAt: task.createdAt.toISOString(), // 作成日時もISO文字列に変換
  }));

  return Response.json(formatted);
}


export async function POST(req: Request) {

  // リクエストボディをJSONとして解析
  const body = await req.json();

  // タスクを新規作成
  const task = await prisma.task.create({
    data: {
      text: body.text,
      tag: body.tag,
      date: new Date(),
    },
  });

  // 🔥 BigInt → number 変換
  const formatted ={
      ...task,
    tag: task.tag ?? "", // tagがnullの場合は空文字にする
    id: Number(task.id), // IDを数値に変換
    date: task.date.toISOString(), // 日付をISO文字列に変換
    createdAt: task.createdAt.toISOString(), // 作成日時もISO文字列に変換
  };

  return Response.json(formatted);
}