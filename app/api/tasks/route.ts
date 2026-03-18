let tasks: any[] = [];

export async function GET() {
    return Response.json(tasks);
}


export async function POST(req: Request) {

  const body = await req.json();

  console.log(body);

  return Response.json({ message: "ok" });
}