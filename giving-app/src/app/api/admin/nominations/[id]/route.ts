import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const VALID_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["SHORTLISTED"],
  SHORTLISTED: ["SELECTED", "NOT_SELECTED"],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const nomination = await prisma.nomination.findUnique({
      where: { id },
      include: {
        user: true,
        program: true,
      },
    });

    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    return NextResponse.json(nomination);
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

    const nomination = await prisma.nomination.findUnique({ where: { id } });
    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const allowedNext = VALID_TRANSITIONS[nomination.status] ?? [];
    if (!allowedNext.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid transition from ${nomination.status} to ${status}. Allowed: ${allowedNext.join(", ") || "none"}`,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.nomination.update({
      where: { id },
      data: { status },
      include: { user: true, program: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
