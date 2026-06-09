import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const donations = await prisma.donation.findMany({
      where: { userId: user.id },
      include: { program: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(donations);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { programId, amount, type, anonymous, want80G, honour, frequency } = body;

    if (!programId || !amount || !type) {
      return NextResponse.json(
        { error: "programId, amount, and type are required" },
        { status: 400 }
      );
    }

    const validTypes = ["ONE_TIME", "RECURRING", "PAYROLL"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "type must be ONE_TIME, RECURRING, or PAYROLL" },
        { status: 400 }
      );
    }

    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const donation = await prisma.donation.create({
      data: {
        userId: user.id,
        programId,
        amount: Number(amount),
        type,
        anonymous: anonymous ?? false,
        want80G: want80G ?? true,
        honour: honour ?? null,
        frequency: frequency ?? null,
      },
      include: { program: true },
    });

    await prisma.program.update({
      where: { id: programId },
      data: {
        donors: { increment: 1 },
        raised: { increment: Number(amount) },
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
