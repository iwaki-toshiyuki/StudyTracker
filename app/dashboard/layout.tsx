import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-500 tracking-tight">Study Tracker</h1>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </>
  );
}
