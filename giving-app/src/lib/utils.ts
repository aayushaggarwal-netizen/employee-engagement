import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(n: number): string {
  const s = Math.round(n).toString();
  if (s.length <= 3) return "₹" + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return "₹" + rest + "," + last3;
}

export function formatLakh(n: number): string {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(n % 10000000 ? 1 : 0) + "Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(n % 100000 ? 1 : 0) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n;
}

export function daysLeft(end: Date): number {
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
}

export const DONATION_TYPE_LABEL: Record<string, string> = {
  ONE_TIME: "One-time",
  RECURRING: "Recurring",
  PAYROLL: "Payroll giving",
};

export const NOMINATION_STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  SELECTED: "Selected",
  NOT_SELECTED: "Not selected",
};

export const NOMINATION_STATUS_TONE: Record<string, string> = {
  SUBMITTED: "muted",
  UNDER_REVIEW: "info",
  SHORTLISTED: "warning",
  SELECTED: "success",
  NOT_SELECTED: "destructive",
};

export const DISBURSEMENT_STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Scheduled",
  RELEASED: "Released",
  CONFIRMED: "Confirmed",
};
