// Prisma Clientのインスタンスを作成するファイル
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// グローバル変数にPrisma Clientを保持して、開発環境での再起動時に新しいインスタンスが作成されないようにする
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

// Prisma Clientを初期化
export const prisma =
  globalForPrisma.prisma ?? // Prisma Clientのインスタンスを作成
  new PrismaClient({
    // PostgreSQL用のアダプターを指定
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  // 開発環境では、グローバル変数にPrisma Clientを保存する
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}