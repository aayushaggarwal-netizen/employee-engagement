// ── Primitives for the Employee Giving app, styled to the Buddy4Study DS ──
const cn = (...c) => c.filter(Boolean).join(" ");

// Indian-format currency: ₹25,00,000
function formatINR(n) {
  const s = Math.round(n).toString();
  if (s.length <= 3) return "₹" + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return "₹" + rest + "," + last3;
}
// Short form: ₹25L / ₹50L
function formatLakh(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(n % 10000000 ? 1 : 0) + "Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(n % 100000 ? 1 : 0) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n;
}

// ---------- Button ----------
function Button({ variant = "default", size = "default", className = "", children, ...rest }) {
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-primary/30 bg-surface text-primary hover:bg-primary/5 hover:border-primary/50",
    secondary: "border border-input bg-surface text-foreground hover:bg-surface-muted",
    ghost: "text-primary hover:bg-primary/10",
    ghostNeutral: "text-muted-foreground hover:text-foreground hover:bg-surface-muted",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3 text-sm", lg: "h-12 rounded-md px-6 text-[15px]",
    icon: "h-10 w-10", iconSm: "h-9 w-9 p-0",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>{children}</button>;
}

// ---------- Input / Textarea / Field ----------
function Input({ className = "", ...rest }) {
  return <input className={cn("flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50", className)} {...rest} />;
}
function Textarea({ className = "", ...rest }) {
  return <textarea className={cn("flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm leading-[1.55] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50", className)} {...rest} />;
}
function Field({ label, helper, htmlFor, children, optional }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-[13px] font-medium text-foreground">
          {label}{optional && <span className="text-[11.5px] font-normal text-muted-foreground">Optional</span>}
        </label>
      )}
      {children}
      {helper && <p className="text-helper">{helper}</p>}
    </div>
  );
}

// ---------- Card ----------
function Card({ className = "", children, ...rest }) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...rest}>{children}</div>;
}

// ---------- Badge / status pill ----------
function Badge({ tone = "muted", className = "", children }) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    destructive: "bg-destructive-soft text-destructive",
    info: "bg-primary/10 text-primary",
    foreground: "bg-foreground/5 text-foreground",
  };
  return <span className={cn("inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11.5px] font-medium whitespace-nowrap", tones[tone], className)}>{children}</span>;
}

// ---------- IconTile ----------
function IconTile({ name, size = 48, tone = "primary", className = "" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    muted: "bg-surface-muted text-muted-foreground",
  };
  const r = size >= 44 ? "rounded-xl" : "rounded-lg";
  return (
    <div className={cn("flex items-center justify-center shrink-0", r, tones[tone], className)} style={{ width: size, height: size }}>
      <Icon name={name} size={Math.round(size * 0.46)} stroke={1.75} />
    </div>
  );
}

// ---------- Avatar (initials) ----------
const AVATAR_PALETTE = [
  ["hsl(18 55% 33%)", "hsl(18 55% 95%)"],   // sienna
  ["hsl(152 42% 34%)", "hsl(152 45% 94%)"], // green
  ["hsl(38 70% 40%)", "hsl(42 90% 94%)"],   // amber
  ["hsl(222 35% 32%)", "hsl(222 30% 94%)"], // ink blue
  ["hsl(280 30% 40%)", "hsl(280 35% 95%)"], // plum
  ["hsl(200 45% 34%)", "hsl(200 45% 94%)"], // teal-blue
];
function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
function Avatar({ name, size = 40, className = "" }) {
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  const [fg, bg] = AVATAR_PALETTE[idx];
  return (
    <div className={cn("flex items-center justify-center rounded-full font-semibold shrink-0 select-none", className)}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.38) }}>
      {initials(name)}
    </div>
  );
}

// ---------- Progress bar ----------
function Progress({ value, className = "", barClass = "bg-primary", height = 8 }) {
  return (
    <div className={cn("w-full rounded-full bg-muted overflow-hidden", className)} style={{ height }}>
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", barClass)} style={{ width: Math.min(100, Math.max(0, value)) + "%" }} />
    </div>
  );
}

// ---------- Select (native, styled) ----------
function NativeSelect({ value, onChange, children, className = "", placeholder }) {
  return (
    <div className={cn("relative", className)}>
      <select value={value} onChange={onChange}
        className="appearance-none w-full h-10 pl-3 pr-9 rounded-md border border-input bg-surface text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <Icon name="chevDown" size={16} className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

// ---------- Eyebrow ----------
function Eyebrow({ children, className = "", ...rest }) {
  return <p className={cn("text-eyebrow", className)} {...rest}>{children}</p>;
}

// ---------- Modal / Sheet (responsive: sheet on mobile, dialog on desktop) ----------
function Overlay({ open, onClose, children, mobile }) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={cn("z-50 flex", mobile ? "absolute inset-0" : "fixed inset-0")} style={{ background: "hsl(222 25% 14% / 0.4)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={cn("bg-surface", mobile
        ? "w-full mt-auto rounded-t-2xl animate-sheet-up max-h-[88%] overflow-auto"
        : "w-fit max-w-[calc(100vw-2rem)] m-auto rounded-xl shadow-lg animate-scale-in max-h-[88%] overflow-auto")}>
        {children}
      </div>
    </div>
  );
}

// ---------- Confetti (tasteful, brand-adjacent) ----------
function Confetti({ run }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!run) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const rect = cv.parentElement.getBoundingClientRect();
    cv.width = rect.width; cv.height = rect.height;
    const colors = ["hsl(18 55% 40%)", "hsl(48 100% 55%)", "hsl(152 42% 42%)", "hsl(38 78% 55%)", "hsl(222 25% 30%)"];
    const N = 90;
    const parts = Array.from({ length: N }, () => ({
      x: cv.width / 2 + (Math.random() - 0.5) * 80,
      y: cv.height * 0.32,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 11 - 5,
      g: 0.32 + Math.random() * 0.15,
      s: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0],
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    let raf, t = 0;
    const tick = () => {
      t++;
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(p => {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 130);
        if (p.shape === "rect") ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); }
        ctx.restore();
      });
      if (t < 135) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

// ---------- Animated success check ----------
function SuccessCheck({ size = 72, tone = "success" }) {
  const map = {
    success: { color: "hsl(var(--success))", soft: "hsl(var(--success-soft))" },
    primary: { color: "hsl(var(--primary))", soft: "hsl(var(--primary) / 0.1)" },
    "primary-on-dark": { color: "#ffffff", soft: "rgba(255,255,255,0.18)" },
  };
  const { color, soft } = map[tone] || map.success;
  return (
    <div className="relative flex items-center justify-center animate-ring-pop" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{ background: soft }} />
      <svg width={size} height={size} viewBox="0 0 72 72" className="relative">
        <circle cx="36" cy="36" r="22" fill="none" stroke={color} strokeWidth="3.5" strokeOpacity="0.25" />
        <path d="M25 37 L33 45 L48 28" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 48, animation: "draw-check .5s ease-out .2s both" }} />
      </svg>
    </div>
  );
}

Object.assign(window, {
  cn, formatINR, formatLakh, Button, Input, Textarea, Field, Card, Badge,
  IconTile, Avatar, initials, Progress, NativeSelect, Eyebrow, Overlay, Confetti, SuccessCheck,
});
