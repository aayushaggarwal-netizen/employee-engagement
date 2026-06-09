import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import ProgramDetail from "./ProgramDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProgramPage({ params }: Props) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { id } = await params;

  const [program, donors] = await Promise.all([
    prisma.program.findUnique({ where: { id } }),
    prisma.donation.findMany({
      where: { programId: id, status: "ACTIVE" },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  if (!program) notFound();

  return <ProgramDetail program={program} donors={donors} currentUser={user} />;
}
