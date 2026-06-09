import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Auto-create employee for unknown emails
    const name = email.split("@")[0].split(".").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    user = await prisma.user.create({ data: { email, name, department: "General", role: "EMPLOYEE" } });
  }

  // Generate 4-digit OTP
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate old OTPs
  await prisma.otpCode.updateMany({ where: { userId: user.id, used: false }, data: { used: true } });

  await prisma.otpCode.create({ data: { userId: user.id, code, expiresAt } });

  // Send email via Resend (if API key is set)
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@giving.example.com",
      to: email,
      subject: "Your sign-in code — Employee Giving",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 420px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="font-size: 24px; font-weight: 600; color: #1e2330; margin: 0 0 8px;">Your sign-in code</h1>
          <p style="color: #6b7280; font-size: 15px; margin: 0 0 28px;">Use this 4-digit code to sign in to the Employee Giving platform.</p>
          <div style="background: #f5f5f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 700; letter-spacing: 0.2em; color: #7c3419;">${code}</span>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Powered by Buddy4Study · Your data is private and secure.</p>
        </div>
      `,
    });
  }

  // In dev / no API key: log the code to console
  if (!RESEND_API_KEY) {
    console.log(`\n🔑 OTP for ${email}: ${code}\n`);
  }

  return NextResponse.json({ success: true, ...(process.env.NODE_ENV === "development" && !RESEND_API_KEY ? { code } : {}) });
}
