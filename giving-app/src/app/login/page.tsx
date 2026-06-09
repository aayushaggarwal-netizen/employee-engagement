"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Field, Input } from "@/components/ui";
import { ArrowRight, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP"); return; }
      if (data.code) setDevCode(data.code);
      setStep("otp");
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 3) {
      otpRefs[idx + 1].current?.focus();
    }
    if (next.every(Boolean)) {
      verifyOtp(next.join(""));
    }
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (text.length === 4) {
      const next = text.split("");
      setOtp(next);
      otpRefs[3].current?.focus();
      verifyOtp(text);
    }
    e.preventDefault();
  }

  async function verifyOtp(code: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid code");
        setOtp(["", "", "", ""]);
        setTimeout(() => otpRefs[0].current?.focus(), 50);
        return;
      }
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/programs");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-foreground text-lg">Buddy4Study Foundation</span>
          </div>
        </div>

        <Card className="p-8">
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">Sign in to Employee Giving</h1>
                <p className="text-sm text-muted-foreground">Enter your work email to receive a sign-in code.</p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive-soft text-destructive px-3 py-2.5 text-sm">
                  {error}
                </div>
              )}

              <Field label="Work email" htmlFor="email">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@infosys.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                    autoFocus
                  />
                </div>
              </Field>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Sending…" : "Continue"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">Check your email</h1>
                <p className="text-sm text-muted-foreground">
                  We sent a 4-digit code to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              {devCode && (
                <div className="rounded-lg bg-warning-soft text-warning px-3 py-2.5 text-sm font-mono">
                  Dev hint — your OTP code: <strong>{devCode}</strong>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-destructive-soft text-destructive px-3 py-2.5 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-[13px] font-medium text-foreground mb-3 block">Enter code</label>
                <div className="flex gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="flex-1 h-14 text-center text-2xl font-semibold rounded-[var(--radius-lg)] border border-input bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    />
                  ))}
                </div>
              </div>

              {loading && (
                <p className="text-sm text-muted-foreground text-center">Verifying…</p>
              )}

              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(["", "", "", ""]); setError(""); setDevCode(null); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </Card>

        <p className="text-center text-helper mt-6">
          Powered by Buddy4Study Foundation · Employee data is private and secure.
        </p>
      </div>
    </div>
  );
}
