import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProgramsBrowse from "./ProgramsBrowse";

export default async function ProgramsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProgramsBrowse user={user} programs={programs} />;
}
