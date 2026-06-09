import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const scholars = await prisma.scholar.findMany({
      where: {
        program: { status: "ACTIVE" },
      },
      include: {
        program: true,
        nomination: {
          include: { user: true },
        },
        disbursements: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = scholars.map((scholar) => ({
      ...scholar,
      source: scholar.nominationId ? "nomination" : "pool",
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
