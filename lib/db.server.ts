// Prisma Clientを初期化
import { prisma } from "./prisma";


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