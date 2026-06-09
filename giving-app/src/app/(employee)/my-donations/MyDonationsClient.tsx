"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Eyebrow, Field, Input, Sheet } from "@/components/ui";
import { cn, formatINR, DONATION_TYPE_LABEL } from "@/lib/utils";
import { Gift, Repeat, Wallet, Settings, ArrowRight } from "lucide-react";

interface Program {
  id: string;
  name: string;
  orgName: string;
}

interface Donation {
  id: string;
  amount: number;
  type: string;
  status: string;
  anonymous: boolean;
  want80G: boolean;
  createdAt: Date;
  program: Program;
}

interface Props {
  donations: Donation[];
}

const STATUS_TONE: Record<string, "success" | "warning" | "destructive" | "muted"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  CANCELLED: "destructive",
  COMPLETED: "muted",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export default function MyDonationsClient({ donations: initial }: Props) {
  const [donations, setDonations] = useState(initial);
  const [manageDonation, setManageDonation] = useState<Donation | null>(null);
  const [newAmount, setNewAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const active = donations.filter((d) => d.type !== "ONE_TIME" && d.status === "ACTIVE");
  const paused = donations.filter((d) => d.type !== "ONE_TIME" && d.status === "PAUSED");
  const recurring = [...active, ...paused];
  const oneTime = donations.filter((d) => d.type === "ONE_TIME");

  const totalGiven = donations
    .filter((d) => d.status !== "CANCELLED")
    .reduce((s, d) => s + d.amount, 0);

  const ongoingMonthly = active
    .filter((d) => d.type === "RECURRING" || d.type === "PAYROLL")
    .reduce((s, d) => s + d.amount, 0);

  async function patchDonation(id: string, data: Record<string, unknown>) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) { setError(updated.error || "Failed to update"); return false; }
      setDonations((prev) => prev.map((d) => d.id === id ? { ...d, ...updated } : d));
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePause() {
    if (!manageDonation) return;
    const newStatus = manageDonation.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const ok = await patchDonation(manageDonation.id, { status: newStatus });
    if (ok) {
      setManageDonation((d) => d ? { ...d, status: newStatus } : null);
    }
  }

  async function handleChangeAmount() {
    if (!manageDonation || !newAmount) return;
    const amt = parseInt(newAmount);
    if (isNaN(amt) || amt < 100) { setError("Minimum amount is ₹100"); return; }
    const ok = await patchDonation(manageDonation.id, { amount: amt });
    if (ok) {
      setManageDonation((d) => d ? { ...d, amount: amt } : null);
      setNewAmount("");
    }
  }

  async function handleCancel() {
    if (!manageDonation) return;
    const ok = await patchDonation(manageDonation.id, { status: "CANCELLED" });
    if (ok) {
      setManageDonation(null);
      setConfirmCancel(false);
    }
  }

  const typeIcon = (type: string) => {
    if (type === "RECURRING") return <Repeat className="w-4 h-4" />;
    if (type === "PAYROLL") return <Wallet className="w-4 h-4" />;
    return <Gift className="w-4 h-4" />;
  };

  return (
    <div className="max-w-[var(--page-max)] mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <Eyebrow>Your giving</Eyebrow>
        <h1 className="text-2xl font-semibold text-foreground mt-1">My donations</h1>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total given", value: formatINR(totalGiven) },
          { label: "Monthly giving", value: ongoingMonthly > 0 ? `${formatINR(ongoingMonthly)}/mo` : "—" },
          { label: "Total donations", value: donations.length.toString() },
        ].map((s) => (
          <Card key={s.label} className="p-4 space-y-1">
            <p className="text-helper">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Active & paused giving */}
      {recurring.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Active giving</h2>
          <div className="space-y-3">
            {recurring.map((d) => (
              <Card key={d.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      d.status === "ACTIVE" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {typeIcon(d.type)}
                    </div>
                    <div>
                      <Link href={`/program/${d.program.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                        {d.program.name}
                      </Link>
                      <p className="text-helper">{d.program.orgName}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge tone={STATUS_TONE[d.status] ?? "muted"}>{STATUS_LABEL[d.status] ?? d.status}</Badge>
                        <span className="text-helper">{DONATION_TYPE_LABEL[d.type]}</span>
                        <span className="text-sm font-semibold text-foreground">{formatINR(d.amount)}/mo</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0 gap-1.5"
                    onClick={() => { setManageDonation(d); setNewAmount(""); setError(""); setConfirmCancel(false); }}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Manage
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Donation history */}
      {oneTime.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Donation history</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-helper font-medium">Programme</th>
                    <th className="text-left px-5 py-3 text-helper font-medium hidden sm:table-cell">Date</th>
                    <th className="text-left px-5 py-3 text-helper font-medium hidden sm:table-cell">Type</th>
                    <th className="text-right px-5 py-3 text-helper font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {oneTime.map((d) => (
                    <tr key={d.id} className="hover:bg-surface-muted transition-colors">
                      <td className="px-5 py-3.5">
                        <div>
                          <Link href={`/program/${d.program.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {d.program.name}
                          </Link>
                          <p className="text-helper">{d.program.orgName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <Badge tone="muted">{DONATION_TYPE_LABEL[d.type]}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-foreground whitespace-nowrap">
                        {formatINR(d.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      )}

      {donations.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto">
            <Gift className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No donations yet</p>
            <p className="text-muted-foreground text-sm mt-1">Browse active programmes and make your first contribution.</p>
          </div>
          <Link href="/programs">
            <Button className="gap-1.5">
              Browse programmes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Manage sheet */}
      <Sheet open={!!manageDonation} onClose={() => { setManageDonation(null); setConfirmCancel(false); setError(""); }}>
        {manageDonation && (
          <div className="p-5 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Manage giving</h2>
              <p className="text-helper mt-0.5">{manageDonation.program.name}</p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Status</p>
                <p className="text-helper">
                  {manageDonation.status === "ACTIVE" ? "Currently donating each month" : "Giving is paused"}
                </p>
              </div>
              <Badge tone={STATUS_TONE[manageDonation.status] ?? "muted"}>{STATUS_LABEL[manageDonation.status]}</Badge>
            </div>

            {/* Pause toggle (recurring only) */}
            {manageDonation.type === "RECURRING" && (
              <Button
                variant={manageDonation.status === "ACTIVE" ? "secondary" : "outline"}
                className="w-full"
                onClick={handleTogglePause}
                disabled={loading}
              >
                {manageDonation.status === "ACTIVE" ? "Pause giving" : "Resume giving"}
              </Button>
            )}

            {/* Change amount */}
            <div className="space-y-2 pt-2 border-t border-border-soft">
              <p className="text-sm font-medium text-foreground">Current amount</p>
              <p className="text-xl font-bold text-foreground">{formatINR(manageDonation.amount)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <Field label="Change amount" htmlFor="newAmount">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                    <Input
                      id="newAmount"
                      type="number"
                      placeholder="New amount"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="pl-7"
                      min="100"
                    />
                  </div>
                  <Button onClick={handleChangeAmount} disabled={loading || !newAmount} variant="outline">
                    Update
                  </Button>
                </div>
              </Field>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive-soft text-destructive px-3 py-2.5 text-sm">{error}</div>
            )}

            {/* Cancel */}
            {!confirmCancel ? (
              <button
                onClick={() => setConfirmCancel(true)}
                className="w-full text-sm text-destructive hover:underline pt-2"
              >
                Cancel this giving
              </button>
            ) : (
              <div className="space-y-2 pt-2 border-t border-border-soft">
                <p className="text-sm font-medium text-destructive">Are you sure you want to cancel?</p>
                <p className="text-helper">This action cannot be undone. You can always start a new donation.</p>
                <div className="flex gap-2">
                  <Button variant="destructive" className="flex-1" onClick={handleCancel} disabled={loading}>
                    Yes, cancel
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => setConfirmCancel(false)}>
                    Keep it
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
