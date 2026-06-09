import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import TopNav from "./TopNav";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <TopNav user={user} />
      <main>{children}</main>
    </div>
  );
}
