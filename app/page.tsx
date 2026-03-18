import ClientApp from "../components/ClientApp";

async function getTasks() {
  // 仮API（後で自作APIに置き換える）
  return [];
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