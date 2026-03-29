import { redirect } from "next/navigation";

// ルートにアクセスした際にログインページへリダイレクトする
export default function Page() {
  redirect("/login");
}
