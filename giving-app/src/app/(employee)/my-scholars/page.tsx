import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MyScholarsClient from "./MyScholarsClient";

export default async function MyScholarsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const scholars = await prisma.scholar.findMany({
    include: {
      program: true,
      nomination: {
        include: { user: true },
      },
      disbursements: {
        orderBy: { scheduledDate: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <MyScholarsClient scholars={scholars} />;
}
