// Prisma Clientを初期化
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma Clientのインスタンスを作成
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// サーバー専用
export async function getTasksServer() {
  const tasks = await prisma.task.findMany({
    orderBy: { id: "desc" },
  });

  return tasks.map((task) => ({
      ...task,
    tag: task.tag ?? "", // tagがnullの場合は空文字にする
    id: Number(task.id), // IDを数値に変換
    date: task.date.toISOString(), // 日付をISO文字列に変換
    createdAt: task.createdAt.toISOString(), // 作成日時もISO文字列に変換
  }));
}