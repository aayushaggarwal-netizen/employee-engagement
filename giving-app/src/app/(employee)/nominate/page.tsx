"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Card, Field, Input, NativeSelect, SuccessCheck, Textarea } from "@/components/ui";
import { ArrowLeft, User } from "lucide-react";

const RELATIONSHIPS = [
  "Family friend",
  "Known to family",
  "Student or mentee",
  "Others",
];

function NominateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId") ?? "";

  const [form, setForm] = useState({
    nomineeName: "",
    nomineeEmail: "",
    nomineePhone: "",
    relationship: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!programId) { setError("Programme not found. Go back and try again."); return; }
    if (form.reason.length < 300) { setError(`Reason must be at least 300 characters (${form.reason.length}/300)`); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to submit nomination"); return; }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-[500px] mx-auto px-4 sm:px-6 py-16 animate-fade-in flex flex-col items-center gap-6 text-center">
        <SuccessCheck size={80} />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Nomination submitted!</h1>
          <p className="text-muted-foreground">
            Your nomination for <span className="font-semibold text-foreground">{form.nomineeName}</span> has been received.
          </p>
        </div>
        <Badge tone="info" className="text-sm px-4 py-1 h-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          Under review
        </Badge>
        <Card className="w-full text-left divide-y divide-border">
          {[
            { label: "Nominee", value: form.nomineeName },
            { label: "Relationship", value: form.relationship },
            { label: "Status", value: "Under review" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between px-5 py-3 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
        </Card>
        <p className="text-sm text-muted-foreground">
          You&apos;ll get an email update within 4–6 weeks. Track live on My Nominations.
        </p>
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/my-nominations")}>
            My nominations
          </Button>
          <Button className="flex-1" onClick={() => router.push("/programs")}>
            Browse programmes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-6 space-y-3">
        <button
          onClick={() => router.push(programId ? `/program/${programId}` : "/programs")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Nominate a student</h1>
            <p className="text-sm text-muted-foreground">Help a deserving student access this scholarship.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide text-muted-foreground">Nominee details</h2>

          <Field label="Full name" htmlFor="nomineeName">
            <Input
              id="nomineeName"
              placeholder="Student's full name"
              value={form.nomineeName}
              onChange={(e) => update("nomineeName", e.target.value)}
              required
            />
          </Field>

          <Field label="Email address" htmlFor="nomineeEmail">
            <Input
              id="nomineeEmail"
              type="email"
              placeholder="student@example.com"
              value={form.nomineeEmail}
              onChange={(e) => update("nomineeEmail", e.target.value)}
              required
            />
          </Field>

          <Field label="Phone number" htmlFor="nomineePhone">
            <div className="flex gap-2">
              <div className="h-10 px-3 rounded-[var(--radius)] border border-input bg-surface-muted flex items-center text-sm text-muted-foreground shrink-0">
                +91
              </div>
              <Input
                id="nomineePhone"
                type="tel"
                placeholder="98765 43210"
                value={form.nomineePhone}
                onChange={(e) => update("nomineePhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
          </Field>

          <Field label="Your relationship with the student" htmlFor="relationship">
            <NativeSelect
              id="relationship"
              placeholder="Select relationship"
              value={form.relationship}
              onChange={(e) => update("relationship", e.target.value)}
              required
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
        </Card>

        <Card className="p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Why should they receive this scholarship?</h2>
            <p className="text-helper mt-1">Minimum 300 characters. Include academic background, financial situation, and aspirations.</p>
          </div>

          <Field htmlFor="reason">
            <Textarea
              id="reason"
              placeholder="Tell us about the student — their academic journey, challenges they've overcome, and why this scholarship would be life-changing for them…"
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              rows={7}
              required
            />
            <div className={`text-right text-helper mt-1 ${form.reason.length >= 300 ? "text-success" : form.reason.length >= 200 ? "text-warning" : ""}`}>
              {form.reason.length} / 300 min
            </div>
          </Field>
        </Card>

        {error && (
          <div className="rounded-lg bg-destructive-soft text-destructive px-3 py-2.5 text-sm">{error}</div>
        )}

        <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
          {loading ? "Submitting…" : "Submit nomination"}
        </Button>

        <p className="text-center text-helper">
          Nominations are reviewed within 4–6 weeks. You&apos;ll receive email updates on progress.
        </p>
      </form>
    </div>
  );
}

export default function NominatePage() {
  return (
    <Suspense fallback={<div className="max-w-[600px] mx-auto px-4 py-10 text-muted-foreground text-sm">Loading…</div>}>
      <NominateInner />
    </Suspense>
  );
}
