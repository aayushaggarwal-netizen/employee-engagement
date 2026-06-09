import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const scholar = await prisma.scholar.findUnique({
      where: { id },
      include: {
        disbursements: { orderBy: { tranche: "asc" } },
        program: true,
        nomination: { include: { user: true } },
      },
    });

    if (!scholar) {
      return NextResponse.json({ error: "Scholar not found" }, { status: 404 });
    }

    return NextResponse.json(scholar);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const scholar = await prisma.scholar.findUnique({ where: { id } });
    if (!scholar) {
      return NextResponse.json({ error: "Scholar not found" }, { status: 404 });
    }

    const body = await request.json();
    const { notes, utilizationStatus } = body;

    const updateData: Record<string, unknown> = {};
    if (notes !== undefined) updateData.notes = notes;
    if (utilizationStatus !== undefined) updateData.utilizationStatus = utilizationStatus;

    const updated = await prisma.scholar.update({
      where: { id },
      data: updateData,
      include: {
        disbursements: { orderBy: { tranche: "asc" } },
        program: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
