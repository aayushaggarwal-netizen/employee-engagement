"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

// ── Button ──
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "ghostNeutral" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "iconSm";
}
export function Button({ variant = "default", size = "default", className, children, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary-hover",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    outline: "border border-primary/30 bg-surface text-primary hover:bg-primary/5 hover:border-primary/50",
    secondary: "border border-input bg-surface text-foreground hover:bg-surface-muted",
    ghost: "text-primary hover:bg-primary/10",
    ghostNeutral: "text-muted-foreground hover:text-foreground hover:bg-surface-muted",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-[var(--radius)] px-3 text-sm",
    lg: "h-12 rounded-[var(--radius)] px-6 text-[15px]",
    icon: "h-10 w-10",
    iconSm: "h-9 w-9 p-0",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>{children}</button>;
}

// ── Input ──
export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-[var(--radius)] border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
        className
      )}
      {...rest}
    />
  );
}

// ── Textarea ──
export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-[var(--radius)] border border-input bg-surface px-3 py-2 text-sm leading-[1.55] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
        className
      )}
      {...rest}
    />
  );
}

// ── Field ──
interface FieldProps {
  label?: string;
  helper?: string;
  htmlFor?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}
export function Field({ label, helper, htmlFor, optional, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-[13px] font-medium text-foreground">
          {label}
          {optional && <span className="text-[11.5px] font-normal text-muted-foreground">Optional</span>}
        </label>
      )}
      {children}
      {helper && <p className="text-helper">{helper}</p>}
    </div>
  );
}

// ── Card ──
export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-[var(--radius-xl)] border bg-card text-card-foreground shadow-sm", className)} {...rest}>
      {children}
    </div>
  );
}

// ── Badge ──
interface BadgeProps {
  tone?: "muted" | "success" | "warning" | "destructive" | "info" | "foreground";
  className?: string;
  children: React.ReactNode;
}
export function Badge({ tone = "muted", className, children }: BadgeProps) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    destructive: "bg-destructive-soft text-destructive",
    info: "bg-primary/10 text-primary",
    foreground: "bg-foreground/5 text-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11.5px] font-medium whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  );
}

// ── Progress ──
interface ProgressProps {
  value: number;
  className?: string;
  barClass?: string;
  height?: number;
}
export function Progress({ value, className, barClass = "bg-primary", height = 8 }: ProgressProps) {
  return (
    <div className={cn("w-full rounded-full bg-muted overflow-hidden", className)} style={{ height }}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", barClass)}
        style={{ width: Math.min(100, Math.max(0, value)) + "%" }}
      />
    </div>
  );
}

// ── Avatar (initials) ──
const AVATAR_PALETTE: [string, string][] = [
  ["hsl(18 55% 33%)", "hsl(18 55% 95%)"],
  ["hsl(152 42% 34%)", "hsl(152 45% 94%)"],
  ["hsl(38 70% 40%)", "hsl(42 90% 94%)"],
  ["hsl(222 35% 32%)", "hsl(222 30% 94%)"],
  ["hsl(280 30% 40%)", "hsl(280 35% 95%)"],
  ["hsl(200 45% 34%)", "hsl(200 45% 94%)"],
];

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

interface AvatarProps { name: string; size?: number; className?: string; }
export function Avatar({ name, size = 40, className }: AvatarProps) {
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  const [fg, bg] = AVATAR_PALETTE[idx];
  return (
    <div
      className={cn("flex items-center justify-center rounded-full font-semibold shrink-0 select-none", className)}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.38) }}
    >
      {getInitials(name)}
    </div>
  );
}

// ── IconTile ──
interface IconTileProps {
  icon?: string;
  size?: number;
  tone?: "primary" | "success" | "warning" | "muted";
  className?: string;
  children?: React.ReactNode;
}
export function IconTile({ size = 48, tone = "primary", className, children }: IconTileProps) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    muted: "bg-surface-muted text-muted-foreground",
  };
  const r = size >= 44 ? "rounded-[var(--radius-xl)]" : "rounded-[var(--radius-lg)]";
  return (
    <div
      className={cn("flex items-center justify-center shrink-0", r, tones[tone], className)}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}

// ── NativeSelect ──
interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}
export function NativeSelect({ className, placeholder, children, ...rest }: NativeSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="appearance-none w-full h-10 pl-3 pr-9 rounded-[var(--radius)] border border-input bg-surface text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="6 9 12 15 18 9" /></svg>
    </div>
  );
}

// ── SuccessCheck ──
interface SuccessCheckProps { size?: number; tone?: "success" | "primary"; }
export function SuccessCheck({ size = 72, tone = "success" }: SuccessCheckProps) {
  const map: Record<string, { color: string; soft: string }> = {
    success: { color: "hsl(var(--success))", soft: "hsl(var(--success-soft))" },
    primary: { color: "hsl(var(--primary))", soft: "hsl(var(--primary) / 0.1)" },
  };
  const { color, soft } = map[tone] || map.success;
  return (
    <div className="relative flex items-center justify-center animate-ring-pop" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{ background: soft }} />
      <svg width={size} height={size} viewBox="0 0 72 72" className="relative">
        <circle cx="36" cy="36" r="22" fill="none" stroke={color} strokeWidth="3.5" strokeOpacity="0.25" />
        <path
          d="M25 37 L33 45 L48 28"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 48, animation: "draw-check .5s ease-out .2s both" }}
        />
      </svg>
    </div>
  );
}

// ── Modal ──
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}
export function Modal({ open, onClose, children, className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "hsl(222 25% 14% / 0.4)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={cn("bg-surface rounded-xl shadow-lg animate-scale-in max-h-[88vh] overflow-auto w-full sm:w-auto sm:min-w-[420px] sm:max-w-[600px]", className)}>
        {children}
      </div>
    </div>
  );
}

// ── Sheet (slides up from bottom on mobile, center on desktop) ──
export function Sheet({ open, onClose, children }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "hsl(222 25% 14% / 0.4)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface w-full sm:w-[480px] sm:rounded-xl rounded-t-2xl animate-sheet-up sm:animate-scale-in shadow-lg max-h-[88vh] overflow-auto">
        {children}
      </div>
    </div>
  );
}

// ── Confetti ──
export function Confetti({ run }: { run: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!run) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const rect = cv.parentElement!.getBoundingClientRect();
    cv.width = rect.width;
    cv.height = rect.height;
    const colors = ["hsl(18 55% 40%)", "hsl(48 100% 55%)", "hsl(152 42% 42%)", "hsl(38 78% 55%)", "hsl(222 25% 30%)"];
    const parts = Array.from({ length: 90 }, () => ({
      x: cv.width / 2 + (Math.random() - 0.5) * 80,
      y: cv.height * 0.32,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 11 - 5,
      g: 0.32 + Math.random() * 0.15,
      s: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    let raf: number, t = 0;
    const tick = () => {
      t++;
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - t / 130);
        if (p.shape === "rect") ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      if (t < 135) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

// ── Eyebrow ──
export function Eyebrow({ className, children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-eyebrow", className)} {...rest}>{children}</p>;
}

// ── Simple icon-only tooltip wrapper ──
export function Tooltip({ label, children, show = true }: { label: string; children: React.ReactNode; show?: boolean }) {
  if (!show) return <>{children}</>;
  return (
    <div className="relative group">
      {children}
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-foreground text-background text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {label}
      </span>
    </div>
  );
}
