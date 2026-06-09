"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import {
  CheckCircle,
  Plus,
  X,
  Upload,
  ArrowLeft,
  ChevronRight,
  Rocket,
  FileText,
  Award,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Goal & Timeline" },
  { id: 3, label: "Eligibility" },
  { id: 4, label: "Students" },
  { id: 5, label: "Review" },
];

interface FormData {
  name: string;
  description: string;
  orgName: string;
  goal: string;
  startDate: string;
  endDate: string;
  maxScholars: string;
  eligibility: string[];
  csvFile: File | null;
}

const SAMPLE_STUDENTS = [
  { name: "Priya Sharma", email: "priya.sharma@example.com", college: "IIT Delhi", course: "B.Tech CSE", year: "3rd Year" },
  { name: "Rahul Kumar", email: "rahul.kumar@example.com", college: "NIT Warangal", course: "B.Tech ECE", year: "2nd Year" },
  { name: "Anjali Singh", email: "anjali.singh@example.com", college: "Delhi University", course: "BA Economics", year: "1st Year" },
];

export default function NewProgramPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    orgName: "",
    goal: "",
    startDate: "",
    endDate: "",
    maxScholars: "50",
    eligibility: [""],
    csvFile: null,
  });

  function update(field: keyof FormData, value: string | string[] | File | null) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addEligibilityItem() {
    update("eligibility", [...form.eligibility, ""]);
  }

  function updateEligibilityItem(i: number, val: string) {
    const arr = [...form.eligibility];
    arr[i] = val;
    update("eligibility", arr);
  }

  function removeEligibilityItem(i: number) {
    update("eligibility", form.eligibility.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(publish: boolean) {
    setLoading(true);
    try {
      const body = {
        name: form.name,
        tagline: form.description || form.name,
        mission: form.description || form.name,
        orgName: form.orgName,
        goal: parseInt(form.goal) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        maxScholars: parseInt(form.maxScholars) || 50,
        eligibility: form.eligibility.filter(Boolean),
        status: publish ? "ACTIVE" : "DRAFT",
      };
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/admin/programs");
    } finally {
      setLoading(false);
    }
  }

  function canNext() {
    if (step === 1) return form.name && form.orgName;
    if (step === 2) return form.goal && form.startDate && form.endDate;
    return true;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Program</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Set up a new scholarship or giving program
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors shrink-0",
                    isActive && "bg-primary text-primary-foreground",
                    isDone && "bg-success text-success-foreground",
                    !isActive && !isDone && "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckCircle size={14} /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-[13px] font-medium hidden sm:block",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-3",
                    s.id < step ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Program Basics</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Name your program and describe its mission
              </p>
            </div>
            <Field label="Program Name" htmlFor="name">
              <Input
                id="name"
                placeholder="e.g. STEM Scholars 2025"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>
            <Field label="Description" htmlFor="desc" optional>
              <Textarea
                id="desc"
                rows={3}
                placeholder="Describe what this program aims to achieve..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </Field>
            <Field label="Organisation Name" htmlFor="orgName">
              <Input
                id="orgName"
                placeholder="e.g. Buddy4Study Foundation"
                value={form.orgName}
                onChange={(e) => update("orgName", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Goal & Timeline</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Set funding targets and program dates
              </p>
            </div>
            <Field label="Fundraising Goal (₹)" htmlFor="goal">
              <Input
                id="goal"
                type="number"
                placeholder="e.g. 5000000"
                value={form.goal}
                onChange={(e) => update("goal", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" htmlFor="startDate">
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                />
              </Field>
              <Field label="End Date" htmlFor="endDate">
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Maximum Scholars" htmlFor="maxScholars">
              <Input
                id="maxScholars"
                type="number"
                value={form.maxScholars}
                onChange={(e) => update("maxScholars", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Eligibility Criteria</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Define who can apply for this scholarship
              </p>
            </div>
            <div className="space-y-2.5">
              {form.eligibility.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <Input
                    placeholder={`Criteria ${i + 1}...`}
                    value={item}
                    onChange={(e) => updateEligibilityItem(i, e.target.value)}
                    className="flex-1"
                  />
                  {form.eligibility.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEligibilityItem(i)}
                      className="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive-soft transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEligibilityItem}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add Criteria
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Student Upload</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Upload a CSV with initial student data (optional)
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) update("csvFile", f);
              }}
              className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer",
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}
              onClick={() => document.getElementById("csvInput")?.click()}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload size={20} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-medium text-foreground">
                  {form.csvFile ? form.csvFile.name : "Drop CSV here or click to browse"}
                </p>
                <p className="text-helper mt-0.5">
                  Columns: Name, Email, College, Course, Year, Hometown
                </p>
              </div>
              <input
                id="csvInput"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) update("csvFile", f);
                }}
              />
            </div>

            {/* Sample preview */}
            <div>
              <p className="text-[12.5px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <FileText size={13} />
                Sample data preview
              </p>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="bg-surface-muted border-b border-border">
                      {["Name", "Email", "College", "Course", "Year"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SAMPLE_STUDENTS.map((s) => (
                      <tr key={s.email}>
                        <td className="px-3 py-2 font-medium text-foreground">{s.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{s.email}</td>
                        <td className="px-3 py-2 text-muted-foreground">{s.college}</td>
                        <td className="px-3 py-2 text-muted-foreground">{s.course}</td>
                        <td className="px-3 py-2 text-muted-foreground">{s.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">Review & Publish</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Review your program details before publishing
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-muted border border-border-soft">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={15} className="text-primary" />
                  <span className="font-semibold text-[13.5px]">Program Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <p className="text-helper">Name</p>
                    <p className="font-medium text-foreground mt-0.5">{form.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-helper">Organisation</p>
                    <p className="font-medium text-foreground mt-0.5">{form.orgName || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-helper">Description</p>
                    <p className="font-medium text-foreground mt-0.5">{form.description || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-muted border border-border-soft">
                <div className="grid grid-cols-3 gap-3 text-[13px]">
                  <div>
                    <p className="text-helper">Goal</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      ₹{parseInt(form.goal || "0").toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-helper">Start Date</p>
                    <p className="font-medium text-foreground mt-0.5">{form.startDate || "—"}</p>
                  </div>
                  <div>
                    <p className="text-helper">End Date</p>
                    <p className="font-medium text-foreground mt-0.5">{form.endDate || "—"}</p>
                  </div>
                  <div>
                    <p className="text-helper">Max Scholars</p>
                    <p className="font-medium text-foreground mt-0.5">{form.maxScholars}</p>
                  </div>
                </div>
              </div>

              {form.eligibility.filter(Boolean).length > 0 && (
                <div className="p-4 rounded-xl bg-surface-muted border border-border-soft">
                  <p className="font-semibold text-[13.5px] mb-2">Eligibility Criteria</p>
                  <ul className="space-y-1.5">
                    {form.eligibility.filter(Boolean).map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                        <CheckCircle size={13} className="text-success mt-0.5 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {form.csvFile && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success-soft border border-success/20 text-[13px]">
                  <FileText size={14} className="text-success" />
                  <span className="text-success font-medium">{form.csvFile.name} ready to upload</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft size={14} />
            Back
          </Button>

          {step < 5 ? (
            <Button
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="gap-1.5"
            >
              Continue
              <ChevronRight size={14} />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSubmit(false)}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="gap-1.5"
              >
                <Rocket size={14} />
                {loading ? "Publishing…" : "Publish Program"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
