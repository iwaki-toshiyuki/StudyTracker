import ClientApp from "@/components/ClientApp";
import { getTasksServer } from "@/lib/db.server";

export default async function Page() {
  const isLocal = process.env.NEXT_PUBLIC_DB_MODE === "local";

  let tasks = [];

  if (isLocal) {
    // ローカル → Prisma
    tasks = await getTasksServer();
  } else {
    // 本番 → API経由（Supabase）
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
      cache: "no-store",
    });
    tasks = await res.json();
  }

  return(

    // クライアントコンポーネントにデータを渡す
    <ClientApp
      initialTasks={tasks}
      initialLogs={[]}
    />
  );
}


