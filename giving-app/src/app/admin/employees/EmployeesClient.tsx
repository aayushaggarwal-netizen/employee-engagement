"use client";

import React, { useState, useMemo } from "react";
import { cn, formatINR } from "@/lib/utils";
import { Button, Card, Badge, Avatar, Modal, Field, Input, NativeSelect } from "@/components/ui";
import {
  Search,
  Plus,
  Upload,
  X,
  Mail,
  Building,
  Calendar,
  ChevronRight,
} from "lucide-react";

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  joinedAt: Date;
  donations: Array<{
    amount: number;
    createdAt: Date;
    type: string;
    program: { name: string };
  }>;
  nominations: Array<{
    id: string;
    nomineeName: string;
    status: string;
    createdAt: Date;
    program: { name: string };
  }>;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "success" | "muted" | "warning" | "destructive"; label: string }> = {
    Active: { tone: "success", label: "Active" },
    Pending: { tone: "warning", label: "Pending" },
    Offboarded: { tone: "destructive", label: "Offboarded" },
  };
  const cfg = map[status] ?? { tone: "muted", label: status };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

function NomStatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "muted" | "success" | "warning" | "destructive" | "info"; label: string }> = {
    SUBMITTED: { tone: "muted", label: "Submitted" },
    UNDER_REVIEW: { tone: "info", label: "Under Review" },
    SHORTLISTED: { tone: "warning", label: "Shortlisted" },
    SELECTED: { tone: "success", label: "Selected" },
    NOT_SELECTED: { tone: "destructive", label: "Not Selected" },
  };
  const cfg = map[status] ?? { tone: "muted", label: status };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

export function EmployeesClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", department: "", role: "EMPLOYEE" });
  const [addLoading, setAddLoading] = useState(false);

  const STATUS_OPTIONS = ["All", "Active", "Pending", "Offboarded"];

  const filtered = useMemo(() => {
    return initialEmployees.filter((e) => {
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [initialEmployees, search, statusFilter]);

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    try {
      await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      setShowAddModal(false);
      setAddForm({ name: "", email: "", department: "", role: "EMPLOYEE" });
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {initialEmployees.length} total employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowInviteModal(true)} className="gap-1.5">
            <Upload size={14} />
            Invite via CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5">
            <Plus size={14} />
            Add Individual
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "h-8 px-3 rounded-full text-[12.5px] font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <Card className={cn("overflow-hidden flex-1 transition-all", selected ? "hidden lg:block" : "")}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  {["Name", "Email", "Department", "Status", "Joined", "Donated", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground text-sm">
                      No employees found
                    </td>
                  </tr>
                )}
                {filtered.map((emp) => {
                  const totalDonated = emp.donations.reduce((s, d) => s + d.amount, 0);
                  return (
                    <tr
                      key={emp.id}
                      className={cn(
                        "hover:bg-surface-muted/50 transition-colors cursor-pointer",
                        selected?.id === emp.id && "bg-primary/5"
                      )}
                      onClick={() => setSelected(emp)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={emp.name} size={30} />
                          <span className="font-medium text-foreground">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.department}</td>
                      <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(emp.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {totalDonated > 0 ? formatINR(totalDonated) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail drawer */}
        {selected && (
          <Card className="w-full lg:w-[360px] shrink-0 overflow-hidden animate-fade-in max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border sticky top-0 bg-card z-10">
              <span className="font-semibold text-[14px]">Employee Details</span>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-5">
              {/* Profile */}
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} size={48} />
                <div>
                  <p className="font-semibold text-[15px] text-foreground">{selected.name}</p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Mail size={13} className="shrink-0" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Building size={13} className="shrink-0" />
                  {selected.department}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Calendar size={13} className="shrink-0" />
                  Joined {new Date(selected.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              {/* Donations */}
              <div>
                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Donation History
                </p>
                {selected.donations.length === 0 ? (
                  <p className="text-helper">No donations yet</p>
                ) : (
                  <div className="space-y-1.5">
                    {selected.donations.slice(0, 5).map((d, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-border-soft">
                        <div>
                          <p className="text-[12.5px] font-medium text-foreground truncate max-w-[180px]">{d.program.name}</p>
                          <p className="text-helper">{d.type}</p>
                        </div>
                        <span className="text-[12.5px] font-semibold text-foreground">{formatINR(d.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nominations */}
              <div>
                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Nominations
                </p>
                {selected.nominations.length === 0 ? (
                  <p className="text-helper">No nominations yet</p>
                ) : (
                  <div className="space-y-2">
                    {selected.nominations.slice(0, 5).map((n) => (
                      <div key={n.id} className="p-3 rounded-lg bg-surface-muted border border-border-soft">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[12.5px] font-medium text-foreground">{n.nomineeName}</p>
                          <NomStatusBadge status={n.status} />
                        </div>
                        <p className="text-helper mt-0.5">{n.program.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Invite via CSV modal */}
      <Modal open={showInviteModal} onClose={() => setShowInviteModal(false)}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">Invite via CSV</h2>
            <button onClick={() => setShowInviteModal(false)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a CSV with columns: Name, Email, Department. Each employee will receive an invite email.
          </p>
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer">
            <Upload size={24} className="text-muted-foreground" />
            <p className="text-[14px] font-medium text-foreground">Drop CSV here or click to browse</p>
            <p className="text-helper">CSV format: Name, Email, Department</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button size="sm">Upload & Send Invites</Button>
          </div>
        </div>
      </Modal>

      {/* Add Individual modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">Add Employee</h2>
            <button type="button" onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
          <Field label="Full Name" htmlFor="empName">
            <Input
              id="empName"
              required
              placeholder="Priya Sharma"
              value={addForm.name}
              onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Email" htmlFor="empEmail">
            <Input
              id="empEmail"
              type="email"
              required
              placeholder="priya@company.com"
              value={addForm.email}
              onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
            />
          </Field>
          <Field label="Department" htmlFor="empDept">
            <Input
              id="empDept"
              placeholder="Engineering"
              value={addForm.department}
              onChange={(e) => setAddForm((f) => ({ ...f, department: e.target.value }))}
            />
          </Field>
          <Field label="Role" htmlFor="empRole">
            <NativeSelect
              id="empRole"
              value={addForm.role}
              onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </NativeSelect>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={addLoading}>
              {addLoading ? "Adding…" : "Add Employee"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
