import { prisma } from "@/lib/prisma";
import { DisbursementsClient } from "./DisbursementsClient";

async function getData() {
  const [disbursements, scholars, programs] = await Promise.all([
    prisma.disbursement.findMany({
      orderBy: { scheduledDate: "asc" },
      include: {
        scholar: { select: { id: true, name: true } },
        program: { select: { id: true, name: true } },
      },
    }),
    prisma.scholar.findMany({ select: { id: true, name: true } }),
    prisma.program.findMany({ select: { id: true, name: true } }),
  ]);

  const totalDisbursed = disbursements
    .filter((d) => d.status !== "SCHEDULED")
    .reduce((s, d) => s + d.amount, 0);

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const upcomingThisMonth = disbursements
    .filter(
      (d) =>
        d.status === "SCHEDULED" &&
        new Date(d.scheduledDate) >= now &&
        new Date(d.scheduledDate) <= endOfMonth
    )
    .reduce((s, d) => s + d.amount, 0);

  return { disbursements, scholars, programs, totalDisbursed, upcomingThisMonth };
}

export default async function DisbursementsPage() {
  const data = await getData();
  return <DisbursementsClient {...data} />;
}
