import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MyDonationsClient from "./MyDonationsClient";

export default async function MyDonationsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const donations = await prisma.donation.findMany({
    where: { userId: user.id },
    include: { program: true },
    orderBy: { createdAt: "desc" },
  });

  return <MyDonationsClient donations={donations} />;
}
