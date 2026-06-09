import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const nominations = await prisma.nomination.findMany({
      where: { userId: user.id },
      include: { program: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(nominations);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { programId, nomineeName, nomineeEmail, nomineePhone, relationship, reason } =
      body;

    if (
      !programId ||
      !nomineeName ||
      !nomineeEmail ||
      !nomineePhone ||
      !relationship ||
      !reason
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (reason.length < 300) {
      return NextResponse.json(
        { error: "Reason must be at least 300 characters" },
        { status: 400 }
      );
    }

    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const nomination = await prisma.nomination.create({
      data: {
        userId: user.id,
        programId,
        nomineeName,
        nomineeEmail,
        nomineePhone,
        relationship,
        reason,
      },
      include: { program: true },
    });

    await prisma.program.update({
      where: { id: programId },
      data: { nominations: { increment: 1 } },
    });

    return NextResponse.json(nomination, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
