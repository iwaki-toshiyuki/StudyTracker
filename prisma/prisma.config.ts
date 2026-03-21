import { defineConfig } from "prisma/config";

// envファイルからDATABASE_URLを読み込む設定
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});