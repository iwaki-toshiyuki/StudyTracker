import ClientApp from "../components/ClientApp";
import { Task } from "../components/Types";

async function getTasks(): Promise<Task[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
    cache: "no-store", // 常に最新取得
  });
  return res.json();
}

export default async function Page() {

  // サーバーコンポーネント内でデータを取得
  const tasks = await getTasks();

  return(

    // クライアントコンポーネントにデータを渡す
    <ClientApp
      initialTasks={tasks}
      initialLogs={[]}
    />
  );
}


