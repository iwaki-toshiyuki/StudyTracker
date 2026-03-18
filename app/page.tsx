import ClientApp from "../components/ClientApp";

async function getTasks() {
  const res = await fetch("http://localhost:3000/api/tasks", {
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


