import ClientApp from "@/components/ClientApp";
import { getTasksServer } from "@/lib/db.server";

export default async function Page() {
  const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

  let tasks = [];

  if (isLocal) {
    // ローカル → Prisma
    tasks = await getTasksServer();
  } else {
    // 本番 → Server ComponentはAuthトークンを持てないため空配列で初期化
    // ClientApp内のuseEffectで認証後にデータ取得する
    tasks = [];
  }

  return(

    // クライアントコンポーネントにデータを渡す
    <ClientApp
      initialTasks={tasks}
      initialLogs={[]}
    />
  );
}


