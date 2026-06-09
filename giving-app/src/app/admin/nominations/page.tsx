import { prisma } from "@/lib/prisma";
import { NominationsClient } from "./NominationsClient";

async function getNominations() {
  return prisma.nomination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, department: true } },
      program: { select: { id: true, name: true } },
    },
  });
}

export default async function NominationsPage() {
  const nominations = await getNominations();
  return <NominationsClient initialNominations={nominations} />;
}
