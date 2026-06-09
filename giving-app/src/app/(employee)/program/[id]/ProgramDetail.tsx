"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Badge, Button, Card, Progress } from "@/components/ui";
import { cn, daysLeft, formatINR, formatLakh } from "@/lib/utils";
import {
  Users, GraduationCap, Calendar, Building, Target, CheckCircle,
  Gift, User, Share2, ChevronDown,
  Trophy
} from "lucide-react";

const STUDENTS = [
  { id: "s1", first: "Priya", name: "Priya Sharma", college: "Lady Shri Ram College, Delhi", course: "B.A. Economics", year: "1st year", hometown: "Sitapur, UP", story: "Daughter of a cycle-repair shop owner, Priya topped her district and earned a seat in Delhi her family couldn't afford.", aspiration: "Shape rural economic policy" },
  { id: "s2", first: "Arjun", name: "Arjun Nair", college: "NIT Calicut", course: "B.Tech Civil", year: "2nd year", hometown: "Wayanad, Kerala", story: "Raised on a tea estate by a daily-wage mother, Arjun cleared the entrance with a rank that stunned his village.", aspiration: "Build roads for villages like his own" },
  { id: "s3", first: "Meena", name: "Meena Pillai", college: "St. Xavier's College, Mumbai", course: "B.Sc Mathematics", year: "1st year", hometown: "Alappuzha, Kerala", story: "Meena lost her father young and was raised by her mother, a tailor in a small coastal town.", aspiration: "Teach maths where she grew up" },
  { id: "s4", first: "Imran", name: "Imran Sheikh", college: "VJTI, Mumbai", course: "B.Tech Mechanical", year: "1st year", hometown: "Nanded, Maharashtra", story: "After losing his father two years ago, Imran kept his grades steady and became the first in his family at college.", aspiration: "Become a mechanical engineer" },
  { id: "s5", first: "Kavya", name: "Kavya Reddy", college: "Osmania University, Hyderabad", course: "B.Sc Computer Science", year: "1st year", hometown: "Warangal, Telangana", story: "Kavya tutors younger kids in her lane every evening while supporting her family's tailoring work.", aspiration: "Work in software and lift her family" },
  { id: "s6", first: "Ananya", name: "Ananya Das", college: "Maulana Azad Medical College, Delhi", course: "MBBS", year: "1st year", hometown: "Howrah, West Bengal", story: "Ananya scored in the top 2% of NEET from a government school with no coaching at all.", aspiration: "Become a doctor for her community" },
];

const TEAMS = [
  { name: "Engineering", pct: 79, count: 38, amount: 412000 },
  { name: "Product", pct: 80, count: 27, amount: 318500 },
  { name: "Sales", pct: 63, count: 14, amount: 264000 },
  { name: "Operations", pct: 62, count: 31, amount: 191000 },
  { name: "Marketing", pct: 61, count: 19, amount: 142500 },
  { name: "Customer Success", pct: 80, count: 12, amount: 128000 },
  { name: "Finance", pct: 71, count: 9, amount: 112000 },
  { name: "Design", pct: 78, count: 8, amount: 98000 },
];

const TEAMS_NOMINATIONS = [
  { name: "Engineering", count: 38 },
  { name: "Operations", count: 31 },
  { name: "Product", count: 27 },
  { name: "Marketing", count: 19 },
  { name: "Sales", count: 14 },
];

const FAQS = [
  { q: "Is my donation tax-deductible?", a: "Yes — all donations are eligible for 80G deduction under the Income Tax Act. You will receive a certificate by email within 30 days." },
  { q: "Can I stop or change my recurring donation?", a: "Absolutely. Head to My Donations, tap Manage, and you can pause, change the amount, or cancel at any time." },
  { q: "How are scholars selected?", a: "Scholars are shortlisted by the programme team based on academic merit, financial need, and recommendations. Employee nominations are given priority." },
  { q: "When will I hear back about my nomination?", a: "You'll get an email update within 4–6 weeks. You can also track the status live on the My Nominations page." },
  { q: "What is payroll giving?", a: "Payroll giving lets you contribute a fixed amount every month directly from your salary before tax, making the process seamless and maximising tax efficiency." },
];

const CODE_OF_PRACTICE = [
  "All funds are disbursed directly to institutions — no cash handled by students",
  "100% of your donation reaches the scholarship; admin costs are covered separately",
  "Scholars submit utilisation reports each semester, reviewed by our team",
  "You will receive an annual impact report detailing how funds were used",
  "Buddy4Study Foundation is registered under 12A and 80G, FCRA compliant",
];

interface Program {
  id: string;
  name: string;
  orgName: string;
  tagline: string;
  mission: string;
  goal: number;
  raised: number;
  donors: number;
  scholarsFunded: number;
  nominations: number;
  status: string;
  category: string;
  endDate: Date;
  eligibility: string;
  howItWorks: string;
}

interface Donor {
  id: string;
  amount: number;
  anonymous: boolean;
  createdAt: Date;
  user: { name: string } | null;
}

interface CurrentUser {
  id: string;
  name: string;
}

interface Props {
  program: Program;
  donors: Donor[];
  currentUser: CurrentUser;
}

export default function ProgramDetail({ program: p, donors }: Props) {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  const days = daysLeft(new Date(p.endDate));
  const [showAllDonors, setShowAllDonors] = useState(false);
  const [leaderTab, setLeaderTab] = useState<"participation" | "nominations">("participation");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  let eligibility: string[] = [];
  let howItWorks: Array<{ icon?: string; title: string; body: string }> = [];
  try { eligibility = JSON.parse(p.eligibility); } catch { /* empty */ }
  try { howItWorks = JSON.parse(p.howItWorks); } catch { /* empty */ }

  const visibleDonors = showAllDonors ? donors : donors.slice(0, 8);
  const sortedTeams = [...TEAMS].sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-[var(--page-max)] mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* LEFT: scrolling content */}
        <div className="space-y-0 bg-card rounded-[var(--radius-xl)] border divide-y divide-border overflow-hidden">
          {/* HERO */}
          <section className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                Active
              </Badge>
              <Badge tone="muted">{p.category}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building className="w-3.5 h-3.5" />
                {p.orgName}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{p.name}</h1>
              <p className="text-muted-foreground text-base leading-relaxed">{p.tagline}</p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-bold text-foreground">{formatLakh(p.raised)}</span>
                  <span className="text-muted-foreground text-sm ml-1.5">raised of {formatLakh(p.goal)}</span>
                </div>
                <span className="text-sm font-semibold text-primary">{pct}%</span>
              </div>
              <Progress value={pct} height={10} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Donors", value: p.donors, icon: <Users className="w-4 h-4" /> },
                { label: "Scholars funded", value: p.scholarsFunded, icon: <GraduationCap className="w-4 h-4" /> },
                { label: "Nominations", value: p.nominations, icon: <User className="w-4 h-4" /> },
                { label: "Days left", value: days, icon: <Calendar className="w-4 h-4" /> },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-surface-muted p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    {s.icon}
                    {s.label}
                  </div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT */}
          <section className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold">About the programme</h2>
            <p className="text-muted-foreground leading-relaxed">{p.mission}</p>

            {howItWorks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">How it works</h3>
                <div className="space-y-4">
                  {howItWorks.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{step.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {eligibility.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Eligibility criteria</h3>
                <ul className="space-y-2">
                  {eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* STUDENTS */}
          <section className="p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Who you&apos;re helping</h2>
              <p className="text-sm text-muted-foreground mt-1">Meet the students whose futures you&apos;re shaping.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {STUDENTS.map((s) => (
                <div key={s.id} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={44} />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{s.name}</p>
                      <p className="text-helper">{s.course} · {s.year}</p>
                      <p className="text-helper">{s.college}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.story}</p>
                  <div className="flex items-start gap-2 bg-primary/5 rounded-lg px-3 py-2">
                    <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary font-medium">{s.aspiration}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CODE OF PRACTICE */}
          <section className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold">Code of practice</h2>
            <ul className="space-y-2.5">
              {CODE_OF_PRACTICE.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* DONOR WALL */}
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Donor wall</h2>
              <span className="text-helper">{donors.length} donors</span>
            </div>
            {donors.length === 0 ? (
              <p className="text-muted-foreground text-sm">Be the first to donate!</p>
            ) : (
              <>
                <div className="space-y-2">
                  {visibleDonors.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 py-2">
                      <Avatar name={d.anonymous ? "Anonymous" : (d.user?.name ?? "?")} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {d.anonymous ? "Anonymous donor" : (d.user?.name ?? "Donor")}
                        </p>
                        <p className="text-helper">
                          {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0">{formatINR(d.amount)}</span>
                    </div>
                  ))}
                </div>
                {donors.length > 8 && (
                  <button
                    onClick={() => setShowAllDonors(!showAllDonors)}
                    className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                  >
                    {showAllDonors ? "Show less" : `Show all ${donors.length} donors`}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showAllDonors && "rotate-180")} />
                  </button>
                )}
              </>
            )}
          </section>

          {/* FAQ */}
          <section className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold">Frequently asked questions</h2>
            <div className="space-y-1">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
                  >
                    {faq.q}
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", openFaq === i && "rotate-180")} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border-soft pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: sticky rail */}
        <div className="space-y-4 lg:sticky lg:top-24">
          {/* Action card */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Make a difference today</h3>
            <div className="space-y-2">
              <Link href={`/donate?programId=${p.id}`} className="block">
                <Button className="w-full gap-2" size="lg">
                  <Gift className="w-4 h-4" />
                  Donate now
                </Button>
              </Link>
              <Link href={`/nominate?programId=${p.id}`} className="block">
                <Button variant="outline" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  Nominate a student
                </Button>
              </Link>
              <Button variant="secondary" className="w-full gap-2">
                <Share2 className="w-4 h-4" />
                Share this programme
              </Button>
            </div>

            <div className="pt-2 border-t border-border-soft space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Raised</span>
                <span className="font-semibold">{formatLakh(p.raised)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goal</span>
                <span className="font-medium">{formatLakh(p.goal)}</span>
              </div>
              <Progress value={pct} height={6} className="mt-2" />
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                Team leaderboard
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setLeaderTab("participation")}
                className={cn(
                  "flex-1 text-xs font-medium py-2.5 transition-colors",
                  leaderTab === "participation"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Participation
              </button>
              <button
                onClick={() => setLeaderTab("nominations")}
                className={cn(
                  "flex-1 text-xs font-medium py-2.5 transition-colors",
                  leaderTab === "nominations"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Nominations
              </button>
            </div>

            <div className="p-3 space-y-1 max-h-72 overflow-y-auto no-scrollbar">
              {leaderTab === "participation" ? (
                sortedTeams.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-muted">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      i === 0 ? "bg-warning-soft text-warning" :
                      i === 1 ? "bg-muted text-muted-foreground" :
                      i === 2 ? "bg-warning-soft/50 text-warning/80" :
                      "bg-surface-muted text-muted-foreground"
                    )}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{t.name}</p>
                      <p className="text-helper">{t.count} donors · {t.pct}%</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground shrink-0">{formatLakh(t.amount)}</span>
                  </div>
                ))
              ) : (
                TEAMS_NOMINATIONS.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-muted">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      i === 0 ? "bg-warning-soft text-warning" :
                      i === 1 ? "bg-muted text-muted-foreground" :
                      i === 2 ? "bg-warning-soft/50 text-warning/80" :
                      "bg-surface-muted text-muted-foreground"
                    )}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{t.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground shrink-0">{t.count} noms</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
