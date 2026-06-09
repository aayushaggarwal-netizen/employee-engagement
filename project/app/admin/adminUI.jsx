// ── Admin shared UI: Drawer, Tabs, Toolbar, charts, toast ──

// ---------- Page header ----------
function AdminPageHead({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-body text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}

// ---------- Mini team leaderboard (toggle: Participation / Nominations) ----------
function MiniLeaderboard({ onViewAll, className = "" }) {
  const [tab, setTab] = React.useState("participation");
  const isPart = tab === "participation";
  const rows = isPart ? LB_DONATIONS.slice(0, 5) : LB_NOMINATIONS.slice(0, 5);
  const maxNoms = LB_NOMINATIONS[0] ? LB_NOMINATIONS[0].submitted : 1;
  const medal = { 0: "bg-[hsl(45_90%_50%)] text-[hsl(40_60%_20%)]", 1: "bg-[hsl(220_12%_72%)] text-[hsl(220_15%_28%)]", 2: "bg-[hsl(28_55%_55%)] text-white" };
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2"><Icon name="trophy" size={15} className="text-warning" /><Eyebrow>Team leaderboard</Eyebrow></div>
          <p className="text-helper mt-1">{isPart ? "First team to 100% participation wins." : "Ranked by students nominated."}</p>
        </div>
        {onViewAll && <Button variant="outline" size="sm" onClick={onViewAll}>View all<Icon name="arrowRight" size={14} /></Button>}
      </div>

      <div className="inline-flex rounded-md border border-border bg-surface p-0.5 mb-3">
        {[["participation", "Participation"], ["nominations", "Nominations"]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={cn("px-3 h-7 rounded text-[12px] font-medium transition-colors",
              tab === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
        ))}
      </div>

      <div className="space-y-1">
        {rows.map((t, i) => {
          const val = isPart ? t.participation : t.submitted;
          const barPct = isPart ? t.participation : Math.round((t.submitted / maxNoms) * 100);
          return (
            <div key={t.team} className="flex items-center gap-2.5 py-2 border-b border-border-soft last:border-0">
              <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0", i < 3 ? medal[i] : "bg-muted text-muted-foreground")}>{i + 1}</span>
              <span className="text-[13px] font-medium text-foreground flex-1 min-w-0 truncate">{t.team}</span>
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden shrink-0"><div className="h-full rounded-full bg-primary" style={{ width: barPct + "%" }} /></div>
              <span className="text-[12.5px] font-semibold text-foreground tabular-nums w-12 text-right shrink-0">{isPart ? `${val}%` : val}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------- KPI card ----------
function KpiCard({ icon, label, value, sub, tone = "primary", onClick, active = false, filter = false }) {
  const inner = (
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-helper">{label}</p>
        <p className="text-[26px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{value}</p>
        {sub && <p className="text-[12.5px] text-muted-foreground mt-2">{sub}</p>}
      </div>
      <IconTile name={icon} size={40} tone={tone} />
    </div>
  );
  if (onClick && filter) {
    // acts as a filter toggle — active state ringed, no "View" affordance
    return (
      <Card className={cn("p-5 text-left w-full cursor-pointer transition-colors", active ? "border-primary ring-1 ring-primary/20 bg-primary/[0.03]" : "hover:border-foreground/20")}
        onClick={onClick} role="button" aria-pressed={active} tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}>
        {inner}
      </Card>
    );
  }
  if (onClick) {
    return (
      <Card className="p-5 text-left w-full cursor-pointer hover:border-foreground/20 transition-colors" onClick={onClick} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}>
        {inner}
        <div className="flex items-center gap-1 text-[12px] font-medium text-primary mt-3"><span>View</span><Icon name="arrowRight" size={12} /></div>
      </Card>
    );
  }
  return <Card className="p-5">{inner}</Card>;
}

// ---------- Right-side Drawer ----------
function Drawer({ open, onClose, title, eyebrow, children, footer, headerAction, width = 460 }) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return ReactDOM.createPortal(
    <div className={cn("fixed inset-0 z-[100]", open ? "" : "pointer-events-none")}>
      <div className={cn("absolute inset-0 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
        style={{ background: "hsl(222 25% 14% / 0.4)" }} onClick={onClose} />
      <div className="absolute top-0 right-0 h-full bg-surface shadow-lg flex flex-col transition-transform duration-300 ease-out"
        style={{ width: `min(${width}px, 100vw)`, transform: open ? "translateX(0)" : "translateX(100%)" }}>
        <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-border-soft">
          <div className="min-w-0">
            {eyebrow && <Eyebrow className="mb-1">{eyebrow}</Eyebrow>}
            <h2 className="text-[17px] font-semibold text-foreground leading-tight truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerAction}
            <button onClick={onClose} className="h-8 w-8 -mr-1 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors">
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{open && children}</div>
        {footer && <div className="shrink-0 border-t border-border-soft px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// ---------- Tabs ----------
function Tabs({ tabs, value, onChange, className = "" }) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-border-soft", className)}>
      {tabs.map(t => {
        const id = typeof t === "string" ? t : t.id;
        const label = typeof t === "string" ? t : t.label;
        const active = value === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={cn("relative px-3.5 h-10 text-[13.5px] font-medium transition-colors -mb-px",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {label}
            {active && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Segmented control ----------
function Segmented({ options, value, onChange, size = "default" }) {
  return (
    <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)}
          className={cn("rounded font-medium transition-colors", size === "sm" ? "px-2.5 h-7 text-[12px]" : "px-3 h-8 text-[12.5px]",
            value === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
      ))}
    </div>
  );
}

// ---------- Compact labelled filter select (shows "Label: value", tints when active) ----------
function FilterSelect({ label, value, onChange, options, allValue = "All", className = "" }) {
  const active = value !== allValue;
  const current = (options.find(o => o[0] === value) || [null, ""])[1];
  return (
    <div className={cn("relative", className)}>
      <select value={value} onChange={e => onChange(e.target.value)}
        className={cn("peer h-10 appearance-none rounded-md border bg-surface pl-3 pr-8 text-[13px] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
          active ? "border-primary/50 text-foreground font-medium" : "border-input text-muted-foreground hover:border-primary/40")}>
        {options.map(([v, l]) => <option key={v} value={v}>{label}: {l}</option>)}
      </select>
      <Icon name="chevDown" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

// ---------- Searchable select (combobox) ----------
function SearchableSelect({ value, onChange, options, allLabel = "All", placeholder = "Search…", className = "" }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [pos, setPos] = React.useState(null);
  const btnRef = React.useRef(null);
  const open_ = () => { const r = btnRef.current.getBoundingClientRect(); setPos({ x: r.left, y: r.bottom + 4, w: r.width }); setQ(""); setOpen(true); };
  const ql = q.trim().toLowerCase();
  const list = ql.length < 1 ? options : options.filter(o => o.toLowerCase().includes(ql));
  const pick = (v) => { onChange(v); setOpen(false); };
  return (
    <div className={cn("relative", className)}>
      <button ref={btnRef} type="button" onClick={() => open ? setOpen(false) : open_()}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-surface px-3 text-[13.5px] text-foreground hover:border-primary/50 transition-colors">
        <span className="truncate">{value === "All" ? allLabel : value}</span>
        <Icon name="chevDown" size={15} className="text-muted-foreground shrink-0" />
      </button>
      {open && pos && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-[120]" onClick={() => setOpen(false)} />
          <div className="fixed z-[121] bg-popover rounded-md border border-border shadow-lg py-1.5" style={{ left: pos.x, top: pos.y, width: Math.max(pos.w, 200) }}>
            <div className="px-2 pb-1.5">
              <div className="relative">
                <Icon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder}
                  className="w-full h-8 pl-8 pr-2 text-[13px] rounded border border-input bg-surface focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="max-h-56 overflow-auto">
              <button onClick={() => pick("All")} className={cn("w-full px-3 py-1.5 text-left text-[13px] hover:bg-accent flex items-center justify-between", value === "All" && "text-primary font-medium")}>{allLabel}{value === "All" && <Icon name="check" size={13} />}</button>
              {list.map(o => (
                <button key={o} onClick={() => pick(o)} className={cn("w-full px-3 py-1.5 text-left text-[13px] hover:bg-accent flex items-center justify-between gap-2", value === o && "text-primary font-medium")}>
                  <span className="truncate">{o}</span>{value === o && <Icon name="check" size={13} className="shrink-0" />}
                </button>
              ))}
              {list.length === 0 && <p className="px-3 py-2.5 text-[12.5px] text-muted-foreground">No matches</p>}
            </div>
          </div>
        </>, document.body
      )}
    </div>
  );
}

// ---------- Search input ----------
// Predictive-search gate: only filter once the query reaches 3 characters.
function predQ(s) { s = (s || "").trim().toLowerCase(); return s.length >= 3 ? s : ""; }
window.predQ = predQ;

function SearchInput({ value, onChange, placeholder = "Search", className = "" }) {
  return (
    <div className={cn("relative", className)}>
      <Icon name="search" size={15} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input value={value} onChange={onChange} placeholder={placeholder}
        className="h-9 w-full pl-9 pr-3 rounded-md border border-input bg-surface text-[13.5px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
    </div>
  );
}

// ---------- Filter pill row ----------
function FilterPills({ options, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={cn("h-8 px-3 rounded-full text-[12.5px] font-medium border transition-colors",
            value === o ? "bg-foreground text-background border-foreground" : "bg-surface text-muted-foreground border-border hover:text-foreground hover:border-foreground/30")}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ---------- Data table ----------
function Table({ columns, children, className = "" }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b border-border-soft">
            {columns.map((c, i) => (
              <th key={i} className={cn("text-[11.5px] font-medium uppercase tracking-[0.06em] text-muted-foreground px-4 py-2.5 whitespace-nowrap", c.align === "right" && "text-right", c.w)}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Td({ children, className = "", align }) {
  return <td className={cn("px-4 py-3 text-[13.5px] text-foreground align-middle", align === "right" && "text-right", className)}>{children}</td>;
}

// ---------- Toast ----------
const ToastCtx = React.createContext(() => {});
function useToast() { return React.useContext(ToastCtx); }
function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, ...opts }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="animate-scale-in pointer-events-auto flex items-start gap-3 rounded-lg bg-foreground text-background shadow-lg px-4 py-3 max-w-[420px]">
            <Icon name={t.icon || "checkCircle"} size={17} className="shrink-0 mt-0.5" stroke={2} />
            <div className="text-[13px] leading-snug">{t.msg}{t.sub && <span className="block text-background/70 text-[12px] mt-0.5">{t.sub}</span>}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ---------- Toggle ----------
function Toggle({ on, onChange, className = "" }) {
  return (
    <button onClick={() => onChange(!on)}
      className={cn("relative h-6 w-11 rounded-full transition-colors shrink-0", on ? "bg-primary" : "bg-input", className)}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

// ════════════════════════════════ CHARTS ════════════════════════════════
// Calm, flat SVG charts using design-system token colors. No gradients.

const CHART = {
  primary: "hsl(18 55% 40%)",
  primarySoft: "hsl(18 45% 88%)",
  success: "hsl(152 42% 42%)",
  info: "hsl(212 50% 48%)",
  warning: "hsl(38 80% 52%)",
  muted: "hsl(220 14% 80%)",
  track: "hsl(220 16% 92%)",
  grid: "hsl(220 16% 94%)",
  text: "hsl(220 12% 46%)",
};

// Donut
function DonutChart({ segments, centerLabel, centerSub, size = 180 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2 - 14, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={CHART.track} strokeWidth="14" />
          {segments.map((s, i) => {
            const len = (s.value / total) * circ;
            const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="14"
              strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[24px] font-semibold text-foreground tabular-nums leading-none">{centerLabel}</span>
          {centerSub && <span className="text-[11.5px] text-muted-foreground mt-1">{centerSub}</span>}
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-[13px] text-foreground">{s.label}</span>
            <span className="text-[13px] text-muted-foreground tabular-nums ml-auto pl-4">{s.display ?? s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Line chart
function LineChart({ data, height = 220, valueFmt = (v) => v }) {
  const [hover, setHover] = React.useState(null);
  const w = 560, padL = 8, padR = 8, padT = 16, padB = 28;
  const max = Math.max(...data.map(d => d.value)) * 1.12 || 1;
  const innerW = w - padL - padR, innerH = height - padT - padB;
  const x = (i) => padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = path + ` L ${x(data.length - 1).toFixed(1)} ${(padT + innerH)} L ${x(0).toFixed(1)} ${(padT + innerH)} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const bandW = innerW / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ maxHeight: height }} onMouseLeave={() => setHover(null)}>
      {gridLines.map((g, i) => (
        <line key={i} x1={padL} x2={w - padR} y1={padT + innerH - g * innerH} y2={padT + innerH - g * innerH} stroke={CHART.grid} strokeWidth="1" />
      ))}
      <path d={area} fill={CHART.primary} opacity="0.08" />
      <path d={path} fill="none" stroke={CHART.primary} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {hover != null && <line x1={pts[hover][0]} x2={pts[hover][0]} y1={padT} y2={padT + innerH} stroke={CHART.primary} strokeWidth="1" opacity="0.3" />}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={hover === i ? 5 : 3.5} fill={hover === i ? CHART.primary : "hsl(0 0% 100%)"} stroke={CHART.primary} strokeWidth="2" />)}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill={CHART.text}>{d.label}</text>
      ))}
      {/* tooltip */}
      {hover != null && (() => {
        const cx = pts[hover][0], cy = pts[hover][1];
        const label = valueFmt(data[hover].value), sub = data[hover].label;
        const tw = Math.max(54, String(label).length * 7 + 24);
        const tx = Math.min(Math.max(cx - tw / 2, padL), w - padR - tw);
        const ty = Math.max(cy - 46, 2);
        return (
          <g pointerEvents="none">
            <rect x={tx} y={ty} width={tw} height={36} rx="6" fill="hsl(20 14% 12%)" />
            <text x={tx + tw / 2} y={ty + 15} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="hsl(0 0% 100%)">{label}</text>
            <text x={tx + tw / 2} y={ty + 28} textAnchor="middle" fontSize="10" fill="hsl(0 0% 80%)">{sub}</text>
          </g>
        );
      })()}
      {/* hover targets */}
      {data.map((d, i) => (
        <rect key={"h" + i} x={padL + i * bandW} y={padT} width={bandW} height={innerH} fill="transparent"
          onMouseEnter={() => setHover(i)} onMouseMove={() => setHover(i)} style={{ cursor: "pointer" }} />
      ))}
    </svg>
  );
}

// Grouped/simple vertical bar chart
function VBarChart({ data, height = 220, colors }) {
  const w = 480, padL = 8, padR = 8, padT = 16, padB = 28;
  const max = Math.max(...data.map(d => d.value)) * 1.15 || 1;
  const innerW = w - padL - padR, innerH = height - padT - padB;
  const bw = innerW / data.length;
  const palette = colors || [CHART.muted, CHART.info, CHART.success, CHART.warning, CHART.primary];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ maxHeight: height }}>
      {[0, 0.5, 1].map((g, i) => (
        <line key={i} x1={padL} x2={w - padR} y1={padT + innerH - g * innerH} y2={padT + innerH - g * innerH} stroke={CHART.grid} strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const bx = padL + i * bw + bw * 0.22;
        const barW = bw * 0.56;
        return (
          <g key={i}>
            <rect x={bx} y={padT + innerH - h} width={barW} height={h} rx="3" fill={d.color || palette[i % palette.length]} />
            <text x={bx + barW / 2} y={padT + innerH - h - 6} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={CHART.text}>{d.value}</text>
            <text x={bx + barW / 2} y={height - 8} textAnchor="middle" fontSize="11" fill={CHART.text}>{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Horizontal bar chart (ranked)
function HBarChart({ data, valueFmt = (v) => v }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="space-y-3.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[13px] text-foreground w-24 shrink-0 truncate">{d.name}</span>
          <div className="flex-1 h-7 rounded bg-muted overflow-hidden">
            <div className="h-full rounded flex items-center justify-end pr-2 transition-[width] duration-700" style={{ width: Math.max(8, (d.value / max) * 100) + "%", background: CHART.primary }}>
              <span className="text-[11.5px] font-medium text-primary-foreground tabular-nums whitespace-nowrap">{valueFmt(d.value)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  AdminPageHead, KpiCard, MiniLeaderboard, Drawer, Tabs, Segmented, SearchInput, SearchableSelect, FilterSelect, FilterPills, Table, Td,
  ToastProvider, useToast, Toggle, DonutChart, LineChart, VBarChart, HBarChart, CHART, IconTip,
});

// Hover tooltip for icon-only nav items — portaled so the scrolling rail never clips it
function IconTip({ label, show, children }) {
  const [pos, setPos] = React.useState(null);
  if (!show) return children;
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onMouseEnter: (e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: r.right + 8, y: r.top + r.height / 2 }); },
    onMouseLeave: () => setPos(null),
  }, child.props.children, pos && ReactDOM.createPortal(
    <div style={{ position: "fixed", left: pos.x + 4, top: pos.y, transform: "translateY(-50%)" }} className="z-[200] pointer-events-none animate-fade-in">
      <div className="relative bg-foreground text-background text-[12.5px] font-medium leading-none px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent" style={{ borderRightColor: "hsl(var(--foreground))" }} />
        {label}
      </div>
    </div>,
    document.body
  ));
}
window.IconTip = IconTip;
