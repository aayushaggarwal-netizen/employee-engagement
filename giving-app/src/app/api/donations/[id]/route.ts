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

    const { id } = await params;

    const donation = await prisma.donation.findUnique({ where: { id } });
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    if (donation.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, amount } = body;

    const validStatuses = ["ACTIVE", "PAUSED", "CANCELLED", "COMPLETED"];
    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "status must be ACTIVE, PAUSED, CANCELLED, or COMPLETED" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (amount !== undefined) updateData.amount = Number(amount);

    const updated = await prisma.donation.update({
      where: { id },
      data: updateData,
      include: { program: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
