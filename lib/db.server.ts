// Prisma Clientを初期化
import { prisma } from "./prisma";


// タスク取得
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

// StudyLog取得
export async function getStudyLogsServer() {
  const logs = await prisma.studyLog.findMany({
    orderBy: { id: "desc" },
  });

  return logs.map((log) => ({
    ...log,
    id: Number(log.id),
    taskId: Number(log.taskId),
    date: log.date.toISOString(),
    createdAt: log.createdAt.toISOString(),
  }));
}