import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const disbursement = await prisma.disbursement.findUnique({ where: { id } });
    if (!disbursement) {
      return NextResponse.json({ error: "Disbursement not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["RELEASED", "CONFIRMED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "status must be RELEASED or CONFIRMED" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };

    if (status === "RELEASED") {
      updateData.releasedAt = new Date();
    }

    const updated = await prisma.disbursement.update({
      where: { id },
      data: updateData,
      include: { scholar: true, program: true },
    });

    if (status === "RELEASED") {
      await prisma.scholar.update({
        where: { id: disbursement.scholarId },
        data: { disbursedAmount: { increment: disbursement.amount } },
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
