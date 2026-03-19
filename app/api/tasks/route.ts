let tasks: any[] = [];

export async function GET() {
    return Response.json(tasks);
}


export async function POST(req: Request) {

  const body = await req.json();

  // タスクが空の場合はエラーを返す
  if (!body.text || !body.text.trim()) {
    return Response.json(
    { error: "タスクが空です" },
    { status: 400 }
    );
  }


    // 新しいタスクオブジェクトを作成
   const newTask = {
    id: Date.now(),   // 仮のID（実際はUUIDなどを使用することが多い）
    text: body.text, // タスクの内容
    tag: body.tag,  // タグ
    done: false,    // 完了状態
    totalMinutes: 0, // 学習時間（分）
    date: new Date().toISOString(), // タスク作成日時
  };

  // タスクを配列に追加
  tasks.push(newTask);

  return Response.json({ message: "ok" });
}