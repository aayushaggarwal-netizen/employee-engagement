import { prisma } from "@/lib/prisma";
import { ScholarsClient } from "./ScholarsClient";

async function getScholars() {
  return prisma.scholar.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      program: { select: { id: true, name: true } },
      disbursements: { orderBy: { scheduledDate: "asc" } },
    },
  });
}

export default async function ScholarsPage() {
  const scholars = await getScholars();
  return <ScholarsClient initialScholars={scholars} />;
}
