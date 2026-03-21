import ClientApp from "../components/ClientApp";
import { getTasksServer } from "@/lib/db.server";

export default async function Page() {

  // サーバーコンポーネント内でデータを取得
  const tasks = await getTasksServer();

  return(

    // クライアントコンポーネントにデータを渡す
    <ClientApp
      initialTasks={tasks}
      initialLogs={[]}
    />
  );
}


