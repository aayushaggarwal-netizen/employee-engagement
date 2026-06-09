"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Badge, Button, Card, Confetti, Field, Input, SuccessCheck } from "@/components/ui";
import { cn, formatINR, DONATION_TYPE_LABEL } from "@/lib/utils";
import {
  Gift, Repeat, Wallet, ArrowLeft, ArrowRight, Check, Info,
  Shield, Receipt, Share2, Users
} from "lucide-react";

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

const STUDENTS_AVATARS = ["Priya Sharma", "Arjun Nair", "Meena Pillai", "Imran Sheikh"];

type DonationType = "ONE_TIME" | "RECURRING" | "PAYROLL";
type Step = "type" | "amount" | "confirm" | "success";

function DonateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId") ?? "";

  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<DonationType>("ONE_TIME");
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [want80G, setWant80G] = useState(true);
  const [honour, setHonour] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [programName, setProgramName] = useState("Scholarship Programme");
  const [userName, setUserName] = useState("You");
  const [payrollCap, setPayrollCap] = useState(25000);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!programId) return;
    fetch(`/api/programs/${programId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.name) setProgramName(d.name);
        if (d.payrollCap) setPayrollCap(d.payrollCap);
      })
      .catch(() => {});
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => { if (d.name) setUserName(d.name); })
      .catch(() => {});
  }, [programId]);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  async function handleSubmit() {
    if (!programId) { setError("Programme not found"); return; }
    if (finalAmount < 100) { setError("Minimum donation is ₹100"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, amount: finalAmount, type, anonymous, want80G, honour: honour || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to process donation"); return; }
      setStep("success");
      setConfetti(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const stepNum = { type: 1, amount: 2, confirm: 3, success: 4 }[step];

  return (
    <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {step !== "success" && (
        <div className="mb-8 space-y-4">
          <button
            onClick={() => {
              if (step === "type") router.push(programId ? `/program/${programId}` : "/programs");
              if (step === "amount") setStep("type");
              if (step === "confirm") setStep("amount");
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Steps */}
          <div className="flex items-center gap-2">
            {(["type", "amount", "confirm"] as Step[]).map((s, i) => {
              const n = i + 1;
              const done = stepNum > n;
              const active = stepNum === n;
              return (
                <React.Fragment key={s}>
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    done ? "bg-success text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {done ? <Check className="w-3.5 h-3.5" /> : n}
                  </div>
                  {i < 2 && <div className={cn("flex-1 h-px", done ? "bg-success" : "bg-border")} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Type */}
      {step === "type" && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold">How would you like to give?</h1>
            <p className="text-sm text-muted-foreground mt-1">Choose the giving type that works for you.</p>
          </div>

          <div className="space-y-3">
            {(["ONE_TIME", "RECURRING", "PAYROLL"] as DonationType[]).map((t) => {
              const icons = { ONE_TIME: Gift, RECURRING: Repeat, PAYROLL: Wallet };
              const descs = {
                ONE_TIME: "Give once, any amount. Simple and immediate.",
                RECURRING: "Set a monthly amount. Cancel or pause anytime.",
                PAYROLL: "Give from your salary before tax. Maximum impact.",
              };
              const Icon = icons[t];
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    type === t
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-border-soft hover:bg-surface-muted"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    type === t ? "bg-primary/10 text-primary" : "bg-surface-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{DONATION_TYPE_LABEL[t]}</p>
                      {t === "PAYROLL" && <Badge tone="info">Tax-efficient</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{descs[t]}</p>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 shrink-0 mt-1",
                    type === t ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {type === t && <div className="w-full h-full rounded-full bg-white scale-50" />}
                  </div>
                </button>
              );
            })}
          </div>

          {type === "PAYROLL" && (
            <div className="flex gap-2.5 bg-warning-soft text-warning rounded-xl p-3.5 text-sm">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">HR approval required</p>
                <p className="text-warning/80 mt-0.5">Payroll giving requires your HR team to set up the deduction. We&apos;ll send them a request automatically after you submit.</p>
              </div>
            </div>
          )}

          <Button className="w-full gap-2" size="lg" onClick={() => setStep("amount")}>
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Amount */}
      {step === "amount" && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold">Choose an amount</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {type === "ONE_TIME" ? "How much would you like to donate?" :
               type === "RECURRING" ? "How much per month?" :
               `Payroll giving — up to ${formatINR(payrollCap)} per month`}
            </p>
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-2.5">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustomAmount(""); }}
                className={cn(
                  "py-3 rounded-xl border text-sm font-semibold transition-all",
                  amount === a && !customAmount
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {formatINR(a)}
              </button>
            ))}
          </div>

          <Field label="Or enter custom amount">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                className="pl-7"
                min="100"
              />
            </div>
          </Field>

          {type === "PAYROLL" && finalAmount > payrollCap && (
            <div className="flex gap-2.5 bg-destructive-soft text-destructive rounded-xl p-3.5 text-sm">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              Amount exceeds payroll cap of {formatINR(payrollCap)}. Please reduce the amount.
            </div>
          )}

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setAnonymous(!anonymous)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                  anonymous ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
              >
                {anonymous && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Donate anonymously</p>
                <p className="text-helper">Your name won&apos;t appear on the donor wall</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setWant80G(!want80G)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                  want80G ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
              >
                {want80G && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  Request 80G certificate
                  <Badge tone="success">Tax benefit</Badge>
                </p>
                <p className="text-helper">Eligible for income tax deduction under Section 80G</p>
              </div>
            </label>
          </div>

          <Field label="Give in honour of (optional)" htmlFor="honour">
            <Input
              id="honour"
              placeholder="e.g. In memory of my teacher, Mr. Sharma"
              value={honour}
              onChange={(e) => setHonour(e.target.value)}
            />
          </Field>

          {error && (
            <div className="rounded-lg bg-destructive-soft text-destructive px-3 py-2.5 text-sm">{error}</div>
          )}

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => {
              if (finalAmount < 100) { setError("Minimum donation is ₹100"); return; }
              if (type === "PAYROLL" && finalAmount > payrollCap) { setError(`Amount exceeds payroll cap of ${formatINR(payrollCap)}`); return; }
              setError("");
              setStep("confirm");
            }}
          >
            Review donation
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold">Review your donation</h1>
            <p className="text-sm text-muted-foreground mt-1">Please confirm the details below before proceeding.</p>
          </div>

          <Card className="divide-y divide-border">
            {[
              { label: "Programme", value: programName },
              { label: "Type", value: DONATION_TYPE_LABEL[type] },
              { label: "Amount", value: formatINR(finalAmount) + (type !== "ONE_TIME" ? " / month" : "") },
              { label: "Donor", value: anonymous ? "Anonymous" : userName },
              { label: "80G Certificate", value: want80G ? "Requested" : "Not requested" },
              ...(honour ? [{ label: "In honour of", value: honour }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-5 py-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </Card>

          <div className="flex items-start gap-2.5 bg-success-soft text-success rounded-xl p-3.5 text-sm">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <p>100% of your donation reaches the scholarship fund. Secure & encrypted.</p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive-soft text-destructive px-3 py-2.5 text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Button className="w-full gap-2" size="lg" onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing…" : type === "ONE_TIME" ? `Donate ${formatINR(finalAmount)}` :
               type === "RECURRING" ? `Start ${formatINR(finalAmount)}/mo` :
               "Set up payroll giving"}
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setStep("amount")}>
              Edit amount
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <div className="relative text-center space-y-6">
          <Confetti run={confetti} />

          <div className="flex flex-col items-center gap-4 py-4">
            <SuccessCheck size={80} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Thank you!</h1>
              <p className="text-muted-foreground mt-1">
                Your {DONATION_TYPE_LABEL[type].toLowerCase()} of {formatINR(finalAmount)}
                {type !== "ONE_TIME" ? "/mo" : ""} is confirmed.
              </p>
            </div>
          </div>

          {/* Student avatars */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-2">
              {STUDENTS_AVATARS.map((name) => (
                <Avatar key={name} name={name} size={40} className="ring-2 ring-surface" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Your contribution helps students like these reach their potential.</p>
          </div>

          {/* Receipt */}
          <Card className="text-left divide-y divide-border">
            <div className="px-5 py-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Receipt</span>
            </div>
            {[
              { label: "Programme", value: programName },
              { label: "Amount", value: formatINR(finalAmount) + (type !== "ONE_TIME" ? " / month" : "") },
              { label: "Type", value: DONATION_TYPE_LABEL[type] },
              ...(want80G ? [{ label: "80G", value: "Certificate will be emailed" }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-5 py-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </Card>

          {/* Upsell: make recurring */}
          {type === "ONE_TIME" && (
            <Card className="p-5 text-left space-y-3 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-primary">Make this a monthly gift?</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Recurring donors have 3× more impact over the scholarship year.
              </p>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                setType("RECURRING");
                setStep("confirm");
                setConfetti(false);
              }}>
                <Repeat className="w-3.5 h-3.5" />
                Set up monthly giving
              </Button>
            </Card>
          )}

          {/* Team rally */}
          <Card className="p-5 text-left space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Rally your team!</p>
            </div>
            <p className="text-sm text-muted-foreground">Share this programme with colleagues and climb the leaderboard together.</p>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Share with peers
            </Button>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/my-donations")}>
              My donations
            </Button>
            <Button className="flex-1" onClick={() => router.push("/programs")}>
              Browse programmes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="max-w-[600px] mx-auto px-4 py-10 text-muted-foreground text-sm">Loading…</div>}>
      <DonateInner />
    </Suspense>
  );
}
