import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (statusFilter) {
      where.status = statusFilter;
    }

    const disbursements = await prisma.disbursement.findMany({
      where,
      include: {
        scholar: true,
        program: true,
      },
      orderBy: { scheduledDate: "asc" },
    });

    return NextResponse.json(disbursements);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { scholarId, programId, tranche, amount, scheduledDate, note } = body;

    if (!scholarId || !programId || !amount || !scheduledDate) {
      return NextResponse.json(
        { error: "scholarId, programId, amount, and scheduledDate are required" },
        { status: 400 }
      );
    }

    const scholar = await prisma.scholar.findUnique({ where: { id: scholarId } });
    if (!scholar) {
      return NextResponse.json({ error: "Scholar not found" }, { status: 404 });
    }

    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const disbursement = await prisma.disbursement.create({
      data: {
        scholarId,
        programId,
        tranche: tranche ? Number(tranche) : 1,
        amount: Number(amount),
        scheduledDate: new Date(scheduledDate),
        note: note ?? null,
        status: "SCHEDULED",
      },
      include: { scholar: true, program: true },
    });

    return NextResponse.json(disbursement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
