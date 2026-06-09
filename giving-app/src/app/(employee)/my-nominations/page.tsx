import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MyNominationsClient from "./MyNominationsClient";

export default async function MyNominationsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const nominations = await prisma.nomination.findMany({
    where: { userId: user.id },
    include: { program: true },
    orderBy: { createdAt: "desc" },
  });

  return <MyNominationsClient nominations={nominations} />;
}
