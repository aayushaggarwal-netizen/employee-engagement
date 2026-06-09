"use client";

import React, { useState, useEffect } from "react";
import { cn, formatLakh } from "@/lib/utils";
import { Button, Card, IconTile } from "@/components/ui";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, RefreshCw, TrendingUp, Users, Wallet, BarChart3 } from "lucide-react";

type DateRange = "30d" | "90d" | "all";

interface AnalyticsData {
  participationDonut: { name: string; value: number }[];
  donationsOverTime: { date: string; amount: number }[];
  disbursementStatus: { name: string; count: number }[];
  topDepartments: { department: string; amount: number }[];
  totalRaised: number;
  totalDonors: number;
  totalDisbursed: number;
}

function mockData(range: DateRange): AnalyticsData {
  const multiplier = range === "all" ? 1 : range === "90d" ? 0.7 : 0.35;
  return {
    participationDonut: [
      { name: "Donors", value: Math.round(142 * multiplier) },
      { name: "Non-donors", value: Math.round(258 * multiplier) },
    ],
    donationsOverTime:
      range === "30d"
        ? [
            { date: "Week 1", amount: 125000 },
            { date: "Week 2", amount: 340000 },
            { date: "Week 3", amount: 220000 },
            { date: "Week 4", amount: 480000 },
          ]
        : range === "90d"
        ? [
            { date: "Jan", amount: 450000 },
            { date: "Feb", amount: 720000 },
            { date: "Mar", amount: 580000 },
          ]
        : [
            { date: "Q1", amount: 1200000 },
            { date: "Q2", amount: 1850000 },
            { date: "Q3", amount: 1420000 },
            { date: "Q4", amount: 2100000 },
          ],
    disbursementStatus: [
      { name: "Scheduled", count: Math.round(24 * multiplier) },
      { name: "Released", count: Math.round(18 * multiplier) },
      { name: "Confirmed", count: Math.round(56 * multiplier) },
    ],
    topDepartments: [
      { department: "Engineering", amount: Math.round(1840000 * multiplier) },
      { department: "Finance", amount: Math.round(1350000 * multiplier) },
      { department: "Product", amount: Math.round(920000 * multiplier) },
      { department: "HR", amount: Math.round(680000 * multiplier) },
      { department: "Marketing", amount: Math.round(450000 * multiplier) },
    ],
    totalRaised: Math.round(5840000 * multiplier),
    totalDonors: Math.round(142 * multiplier),
    totalDisbursed: Math.round(3200000 * multiplier),
  };
}

const COLORS = {
  primary: "hsl(18 55% 33%)",
  success: "hsl(152 42% 42%)",
  warning: "hsl(38 78% 50%)",
  info: "hsl(222 35% 32%)",
  muted: "hsl(220 10% 80%)",
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("90d");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData>(mockData("90d"));

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockData(range));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [range]);

  function downloadCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Total Raised", data.totalRaised],
      ["Total Donors", data.totalDonors],
      ["Total Disbursed", data.totalDisbursed],
      ...data.topDepartments.map((d) => [d.department, d.amount]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Insights on giving, participation, and disbursements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface border border-border rounded-[var(--radius-lg)] p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={cn(
                  "h-7 px-3 rounded-[var(--radius)] text-[12.5px] font-medium transition-colors",
                  range === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={downloadCSV} className="gap-1.5">
            <Download size={14} />
            Download
          </Button>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Raised", value: formatLakh(data.totalRaised), icon: <TrendingUp size={18} />, tone: "primary" as const },
          { label: "Total Donors", value: data.totalDonors.toString(), icon: <Users size={18} />, tone: "success" as const },
          { label: "Total Disbursed", value: formatLakh(data.totalDisbursed), icon: <Wallet size={18} />, tone: "warning" as const },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-helper mb-1">{kpi.label}</p>
                <p className="text-xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block w-16 h-5 rounded bg-muted animate-pulse" />
                  ) : (
                    kpi.value
                  )}
                </p>
              </div>
              <IconTile size={40} tone={kpi.tone}>{kpi.icon}</IconTile>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation donut */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={15} className="text-primary" />
            <h3 className="font-semibold text-[14px]">Employee Participation</h3>
          </div>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <RefreshCw size={20} className="text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie
                    data={data.participationDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill={COLORS.primary} />
                    <Cell fill={COLORS.muted} />
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      background: "hsl(0 0% 100%)",
                      border: "1px solid hsl(220 16% 92%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {data.participationDonut.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: i === 0 ? COLORS.primary : COLORS.muted }}
                    />
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-foreground">{item.name}</p>
                      <p className="text-helper">{item.value} employees</p>
                    </div>
                  </div>
                ))}
                <div className="pt-1 border-t border-border">
                  <p className="text-[12px] text-muted-foreground">
                    Participation rate:{" "}
                    <span className="font-semibold text-foreground">
                      {data.participationDonut[0] && data.participationDonut[1]
                        ? Math.round(
                            (data.participationDonut[0].value /
                              (data.participationDonut[0].value + data.participationDonut[1].value)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Donations over time */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-primary" />
            <h3 className="font-semibold text-[14px]">Donations Over Time</h3>
          </div>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <RefreshCw size={20} className="text-muted-foreground animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.donationsOverTime} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 92%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => formatLakh(v)}
                  tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <ReTooltip
                  formatter={(v) => [formatLakh(Number(v)), "Amount"]}
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(220 16% 92%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  dot={{ fill: COLORS.primary, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Disbursement status */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={15} className="text-primary" />
            <h3 className="font-semibold text-[14px]">Disbursement Status</h3>
          </div>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <RefreshCw size={20} className="text-muted-foreground animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.disbursementStatus} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 92%)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <ReTooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(220 16% 92%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill={COLORS.muted} />
                  <Cell fill={COLORS.warning} />
                  <Cell fill={COLORS.success} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top departments */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={15} className="text-primary" />
            <h3 className="font-semibold text-[14px]">Top Donating Departments</h3>
          </div>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <RefreshCw size={20} className="text-muted-foreground animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.topDepartments}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 92%)" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatLakh(v)}
                  tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="department"
                  tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <ReTooltip
                  formatter={(v) => [formatLakh(Number(v)), "Donated"]}
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(220 16% 92%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="amount" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
