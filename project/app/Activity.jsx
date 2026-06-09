// ── My Activity: Donations, Nominations, Scholars + role stubs ──

const TYPE_META = {
  "one-time": { label: "One-time", icon: "gift" },
  "recurring": { label: "Recurring", icon: "repeat" },
  "payroll": { label: "Payroll pledge", icon: "wallet" },
};

function PageHead({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-start gap-4 mb-7">
      <IconTile name={icon} size={48} />
      <div className="flex-1 min-w-0">
        <h1 className="text-group-title">{title}</h1>
        <p className="text-body text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

// Date helpers for "given so far"
const _MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
function parseDmy(s) { const [d, m, y] = s.split(" "); return new Date(+y, _MONTHS[m], +d); }
const _NOW = new Date("2026-05-30");
function paymentsToDate(p) {
  if (p.status === "pending" || p.status === "cancelled") return 0;
  const cur = parseDmy(p.startDate); let n = 0;
  while (cur <= _NOW) { n++; cur.setMonth(cur.getMonth() + 1); }
  return n;
}
const _MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function nextDueDate(p) {
  const cur = parseDmy(p.startDate);
  while (cur <= _NOW) cur.setMonth(cur.getMonth() + 1);
  return cur;
}
function fmtDue(dt) { return `${dt.getDate()} ${_MONTH_NAMES[dt.getMonth()]}`; }
// Earliest upcoming deduction across active/pending recurring + payroll
function upcomingDonation(list) {
  const ongoing = list.filter(d => d.type !== "one-time" && (d.status === "active" || d.status === "pending"));
  if (!ongoing.length) return null;
  return ongoing.map(p => ({ ...p, due: nextDueDate(p) })).sort((a, b) => a.due - b.due)[0];
}

function TypeChip({ type }) {
  const m = TYPE_META[type];
  return <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground"><Icon name={m.icon} size={13} />{m.label}</span>;
}

// ---------------- My Donations ----------------
function ManageSheet({ open, onClose, pledge, onSave, mobile }) {
  const [paused, setPaused] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  React.useEffect(() => {
    if (pledge) { setPaused(pledge.status === "paused"); setAmount(pledge.amount); setConfirmCancel(false); }
  }, [pledge]);
  if (!pledge) return null;
  const isRecurring = pledge.type === "recurring";
  const unit = isRecurring ? "/ month" : "/ paycheck";

  return (
    <Overlay open={open} onClose={onClose} mobile={mobile}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-section-title">Manage {isRecurring ? "recurring donation" : "payroll pledge"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
        </div>
        <p className="text-helper mb-5">{formatINR(pledge.amount)} {unit} · started {pledge.startDate}</p>

        {!confirmCancel ? (
          <div className="space-y-1">
            {isRecurring && (
              <div className="flex items-center justify-between py-3.5 border-b border-border-soft">
                <div>
                  <p className="text-[14px] font-medium text-foreground">Pause donation</p>
                  <p className="text-helper">Temporarily stop monthly deductions.</p>
                </div>
                <button onClick={() => setPaused(!paused)}
                  className={cn("relative h-6 w-11 rounded-full transition-colors shrink-0", paused ? "bg-primary" : "bg-input")}>
                  <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all", paused ? "left-[22px]" : "left-0.5")} />
                </button>
              </div>
            )}
            <div className="py-3.5 border-b border-border-soft">
              <p className="text-[14px] font-medium text-foreground mb-2">Change amount</p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]">₹</span>
                  <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="pl-7" />
                </div>
                <span className="text-[13px] text-muted-foreground whitespace-nowrap">{unit}</span>
              </div>
            </div>
            <button onClick={() => setConfirmCancel(true)}
              className="w-full text-left py-3.5 flex items-center justify-between text-destructive hover:opacity-80 transition-opacity">
              <span className="text-[14px] font-medium">Cancel {isRecurring ? "donation" : "pledge"}</span>
              <Icon name="chevRight" size={16} />
            </button>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>Discard</Button>
              <Button className="flex-1" onClick={() => onSave({ ...pledge, amount, status: paused ? "paused" : (pledge.type === "payroll" ? "pending" : "active") })}>Save changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-destructive-soft border border-destructive/15 p-4 flex gap-3">
              <Icon name="info" size={18} className="text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-foreground">Are you sure?</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">This will stop future deductions. Your past giving stays on record.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmCancel(false)}>Keep it</Button>
              <Button variant="destructive" className="flex-1" onClick={() => onSave({ ...pledge, status: "cancelled" })}>Confirm cancel</Button>
            </div>
          </div>
        )}
      </div>
    </Overlay>
  );
}

function pledgeStatusBadge(p) {
  if (p.status === "cancelled") return <Badge tone="muted">Cancelled</Badge>;
  if (p.status === "paused") return <Badge tone="warning">Paused</Badge>;
  if (p.type === "payroll") return p.status === "pending"
    ? <Badge tone="warning"><Icon name="clock" size={11} />Pending HR confirmation</Badge>
    : <Badge tone="success">Active</Badge>;
  return <Badge tone="success">Active</Badge>;
}

function MyDonations({ navigate, mobile }) {
  const [list, setList] = React.useState(DONATIONS);
  const [manageId, setManageId] = React.useState(null);
  const managing = list.find(d => d.id === manageId);

  const active = list.filter(d => d.type !== "one-time");
  const history = list.filter(d => d.type === "one-time");
  const live = list.filter(d => d.status !== "cancelled");
  const total = live.reduce((s, d) => s + d.amount, 0);
  const ongoing = active.filter(d => d.status === "active" || d.status === "pending");
  const ongoingSum = ongoing.reduce((s, d) => s + d.amount, 0);
  const upcoming = upcomingDonation(list);

  return (
    <div className="mx-auto w-full max-w-[820px] px-5 py-7 sm:py-10 animate-fade-in">
      <PageHead icon="receipt" title="My donations" subtitle="Everything you've given, and the giving you've set up."
        action={<Button onClick={() => navigate("donate")}><Icon name="gift" size={16} />Give again</Button>} />

      {/* summary stat strip */}
      <Card className="p-0 mb-8 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-soft">
          <div className="p-5 sm:p-6">
            <Eyebrow>Total given</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{formatINR(total)}</p>
            <p className="text-helper mt-2">across {live.length} donations to {PROGRAM.org}</p>
          </div>
          <div className="p-5 sm:p-6">
            <Eyebrow>Ongoing giving</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{ongoingSum ? formatINR(ongoingSum) : "—"}</p>
            <p className="text-helper mt-2">{ongoing.length ? `${ongoing.length} active commitment${ongoing.length > 1 ? "s" : ""} per cycle` : "No active commitments"}</p>
          </div>
          <div className="p-5 sm:p-6">
            <Eyebrow>Upcoming donation</Eyebrow>
            {upcoming ? (
              <>
                <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{formatINR(upcoming.amount)}</p>
                <p className="text-helper mt-2">{TYPE_META[upcoming.type].label} · due {fmtDue(upcoming.due)}</p>
              </>
            ) : (
              <>
                <p className="text-[28px] font-semibold text-foreground mt-1.5 leading-none">—</p>
                <p className="text-helper mt-2">No upcoming donations</p>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* active giving */}
      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="text-section-title mb-3">Active giving</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {active.map(p => {
              const cancelled = p.status === "cancelled";
              const n = paymentsToDate(p);
              const given = n * p.amount;
              return (
                <Card key={p.id} className={cn("p-5 flex flex-col", cancelled && "opacity-70")}>
                  <div className="flex items-center justify-between gap-2">
                    <TypeChip type={p.type} />
                    {pledgeStatusBadge(p)}
                  </div>
                  <p className="text-[22px] font-semibold text-foreground tabular-nums mt-3 leading-none">
                    {formatINR(p.amount)}<span className="text-[13px] font-normal text-muted-foreground"> {p.type === "recurring" ? "/ month" : "/ paycheck"}</span>
                  </p>
                  <p className="text-helper mt-1.5">Started {p.startDate}{p.honour ? ` · in honour of ${p.honour}` : ""}</p>
                  <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border-soft">
                    <span className="text-[12.5px] text-muted-foreground">
                      {cancelled ? "No further deductions" : p.status === "pending" ? "Awaiting first deduction" : <><span className="font-semibold text-foreground tabular-nums">{formatINR(given)}</span> given · {n} payment{n > 1 ? "s" : ""}</>}
                    </span>
                    {!cancelled && <Button variant="outline" size="sm" onClick={() => setManageId(p.id)}>Manage</Button>}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* history */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-section-title">Donation history</h2>
          <span className="text-helper">{history.length} one-time gifts</span>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[7rem_1fr_auto] gap-4 px-5 py-2.5 border-b border-border-soft bg-surface-muted/40">
            <span className="text-eyebrow">Date</span><span className="text-eyebrow">Type</span><span className="text-eyebrow text-right">Amount</span>
          </div>
          <div className="divide-y divide-border-soft">
            {history.map(d => (
              <div key={d.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[7rem_1fr_auto] gap-x-4 gap-y-1 items-center px-5 py-3.5">
                <span className="text-[13px] text-muted-foreground tabular-nums order-2 sm:order-none">{d.date}</span>
                <span className="order-1 sm:order-none min-w-0 flex items-center gap-2 flex-wrap">
                  <TypeChip type={d.type} />
                  {d.honour && <span className="text-helper">in honour of {d.honour}</span>}
                </span>
                <span className="text-[15px] font-semibold text-foreground tabular-nums text-right order-3 sm:order-none">{formatINR(d.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <ManageSheet open={!!managing} onClose={() => setManageId(null)} pledge={managing} mobile={mobile}
        onSave={(updated) => { setList(list.map(d => d.id === updated.id ? updated : d)); setManageId(null); }} />
    </div>
  );
}

// ---------------- My Nominations ----------------
const NOM_STAGES = ["Submitted", "Under review", "Shortlisted", "Decision"];
function NomProgress({ status }) {
  const idx = { "Submitted": 0, "Under review": 1, "Shortlisted": 2, "Selected": 3, "Not selected": 3 }[status];
  const decided = status === "Selected" || status === "Not selected";
  const positive = status === "Selected";
  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5">
        {NOM_STAGES.map((_, i) => {
          const done = i <= idx;
          const color = !done ? "bg-muted" : (i === 3 && decided ? (positive ? "bg-success" : "bg-destructive") : "bg-primary");
          return <div key={i} className={cn("h-1.5 rounded-full", color)} />;
        })}
      </div>
      <div className="grid grid-cols-4 gap-1.5 mt-2">
        {NOM_STAGES.map((label, i) => {
          const done = i <= idx;
          const lbl = i === 3 && decided ? status : label;
          const tone = i === 3 && decided ? (positive ? "text-success" : "text-destructive") : done ? "text-foreground" : "text-muted-foreground";
          return <span key={i} className={cn("text-[11px] font-medium", tone, i === 0 ? "text-left" : i === 3 ? "text-right" : "text-center")}>{lbl}</span>;
        })}
      </div>
    </div>
  );
}

function NomContact({ nom, onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [email, setEmail] = React.useState(nom.email);
  const [phone, setPhone] = React.useState(nom.phone);
  React.useEffect(() => { setEmail(nom.email); setPhone(nom.phone); }, [nom.id]);
  const locked = nom.status === "Selected" || nom.status === "Not selected";

  const start = () => { setEmail(nom.email); setPhone(nom.phone); setEditing(true); };
  const cancel = () => { setEmail(nom.email); setPhone(nom.phone); setEditing(false); };
  const save = () => { onSave({ email: email.trim(), phone }); setEditing(false); };

  return (
    <div className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Contact details</Eyebrow>
        {!editing && !locked && (
          <button onClick={start} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline"><Icon name="pencil" size={13} />Edit</button>
        )}
        {locked && <span className="text-[11.5px] text-muted-foreground">Locked — {nom.status.toLowerCase()}</span>}
      </div>

      {!editing ? (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon name="mail" size={15} className="text-muted-foreground shrink-0" />
            <span className="text-[13.5px] text-foreground truncate">{nom.email}</span>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon name="phone" size={15} className="text-muted-foreground shrink-0" />
            <span className="text-[13.5px] text-foreground truncate">+91 {nom.phone}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Email ID" htmlFor={`ne-${nom.id}`}>
            <Input id={`ne-${nom.id}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@email.com" />
          </Field>
          <Field label="Phone number" htmlFor={`np-${nom.id}`}>
            <div className="flex h-10 w-full rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
              <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
              <input id={`np-${nom.id}`} inputMode="numeric" maxLength={10} value={phone} placeholder="98765 43210"
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 min-w-0 px-3 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none" />
            </div>
          </Field>
          <div className="flex gap-2.5 pt-1">
            <Button variant="secondary" size="sm" onClick={cancel}>Cancel</Button>
            <Button size="sm" onClick={save}>Save changes</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MyNominations({ navigate }) {
  const [open, setOpen] = React.useState(null);
  const [list, setList] = React.useState(NOMINATIONS);
  if (list.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[820px] px-5 py-10 animate-fade-in">
        <PageHead icon="user" title="My nominations" subtitle="Students you've put forward, and where they are in review."
          action={<Button onClick={() => navigate("nominate")}><Icon name="plus" size={16} />Nominate</Button>} />
        <EmptyState icon="user" title="You haven't nominated anyone yet" body="Know a deserving student?" cta="Nominate a student" onCta={() => navigate("nominate")} />
      </div>
    );
  }

  const inReview = list.filter(n => n.status === "Submitted" || n.status === "Under review").length;
  const shortlisted = list.filter(n => n.status === "Shortlisted").length;
  const selected = list.filter(n => n.status === "Selected").length;
  const updateContact = (id, patch) => setList(list.map(n => n.id === id ? { ...n, ...patch } : n));

  return (
    <div className="mx-auto w-full max-w-[820px] px-5 py-7 sm:py-10 animate-fade-in">
      <PageHead icon="user" title="My nominations" subtitle="Students you've put forward, and where they are in review."
        action={<Button onClick={() => navigate("nominate")}><Icon name="plus" size={16} />Nominate</Button>} />

      {/* summary stat strip */}
      <Card className="p-0 mb-8 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-border-soft">
          <div className="p-5 sm:p-6">
            <Eyebrow>Nominations</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{list.length}</p>
            <p className="text-helper mt-2">put forward to {PROGRAM.org}</p>
          </div>
          <div className="p-5 sm:p-6">
            <Eyebrow>In review</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{inReview}</p>
            <p className="text-helper mt-2">awaiting a decision</p>
          </div>
          <div className="p-5 sm:p-6">
            <Eyebrow>Selected</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{selected}</p>
            <p className="text-helper mt-2">{shortlisted} shortlisted</p>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden divide-y divide-border-soft">
        {list.map(n => {
          const expanded = open === n.id;
          return (
            <div key={n.id}>
              <button onClick={() => setOpen(expanded ? null : n.id)}
                className={cn("w-full text-left flex items-center gap-3.5 px-4 sm:px-5 py-3.5 hover:bg-surface-muted/40 transition-colors", expanded && "bg-surface-muted/30")}>
                <Avatar name={n.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-foreground truncate">{n.name}</p>
                  <p className="text-helper">{n.date} · {n.relationship}</p>
                </div>
                <Badge tone={NOM_STATUS_TONE[n.status]}>{n.status}</Badge>
                <Icon name="chevDown" size={16} className={cn("text-muted-foreground transition-transform shrink-0", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 animate-fade-in space-y-4">
                  <div className="rounded-lg border border-border-soft bg-surface px-4 py-4">
                    <Eyebrow className="mb-3">Status</Eyebrow>
                    <NomProgress status={n.status} />
                  </div>
                  <NomContact nom={n} onSave={(patch) => updateContact(n.id, patch)} />
                  <div className="rounded-lg border border-border-soft bg-surface-muted/40 p-4">
                    <Eyebrow className="mb-1.5">Why this nomination</Eyebrow>
                    <p className="text-body text-foreground">{n.reason}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ---------------- Scholars (all under the programme) ----------------
function ScholarSource({ s }) {
  if (s.source === "nomination") {
    return (
      <div className="flex items-center gap-2 text-[12.5px]">
        <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="userCheck" size={13} /></span>
        <span className="text-muted-foreground truncate">
          Nominated by <span className="font-medium text-foreground">{s.you ? "you" : s.nominator}</span>
          {!s.you && s.nominatorTeam ? ` · ${s.nominatorTeam}` : ""}
        </span>
        {s.you && <Badge tone="info">You</Badge>}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-[12.5px]">
      <span className="h-6 w-6 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"><Icon name="shieldCheck" size={13} /></span>
      <span className="text-muted-foreground">Pre-verified pool</span>
    </div>
  );
}

function MyScholars({ navigate }) {
  const [filter, setFilter] = React.useState("all");
  const fromNom = SCHOLARS.filter(s => s.source === "nomination");
  const fromPool = SCHOLARS.filter(s => s.source === "pool");
  const shown = filter === "nomination" ? fromNom : filter === "pool" ? fromPool : SCHOLARS;
  const filters = [
    ["all", "All", SCHOLARS.length],
    ["nomination", "Employee nominations", fromNom.length],
    ["pool", "Pre-verified pool", fromPool.length],
  ];

  return (
    <div className="mx-auto w-full max-w-[860px] px-5 py-7 sm:py-10 animate-fade-in">
      <PageHead icon="graduationCap" title="Scholars" subtitle={`Students currently funded by ${PROGRAM.name}.`} />

      {/* summary strip */}
      <Card className="p-0 mb-6 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-border-soft">
          <div className="p-5 sm:p-6">
            <Eyebrow>Scholars</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{SCHOLARS.length}</p>
            <p className="text-helper mt-2">funded by {PROGRAM.org}</p>
          </div>
          <div className="p-5 sm:p-6">
            <Eyebrow>From nominations</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{fromNom.length}</p>
            <p className="text-helper mt-2">put forward by employees</p>
          </div>
          <div className="p-5 sm:p-6">
            <Eyebrow>Pre-verified pool</Eyebrow>
            <p className="text-[28px] font-semibold text-foreground tabular-nums mt-1.5 leading-none">{fromPool.length}</p>
            <p className="text-helper mt-2">sourced by the foundation</p>
          </div>
        </div>
      </Card>

      {/* source filter */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar">
        {filters.map(([id, label, count]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={cn("inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium border whitespace-nowrap transition-colors",
              filter === id ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/20")}>
            {label}<span className="tabular-nums opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {shown.map(s => (
          <Card key={s.id} className="p-5">
            <div className="flex items-center gap-3.5">
              <Avatar name={s.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="text-card-title truncate">{s.name}</p>
                <p className="text-helper truncate">{s.course} · {s.year}</p>
              </div>
              <Badge tone={SCHOLAR_STATUS_TONE[s.status]}>{s.status}</Badge>
            </div>
            <div className="space-y-2 text-[13px] mt-4 pt-4 border-t border-border-soft">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="building" size={14} className="shrink-0" /><span className="truncate">{s.college}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="mapPin" size={14} className="shrink-0" /><span className="truncate">{s.hometown}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border-soft">
              <ScholarSource s={s} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------- My Profile ----------------
function BadgeCard({ b }) {
  const earned = b.earned;
  const tone = b.tone || "primary";
  const tileCls = !earned ? "bg-surface-muted text-muted-foreground/60"
    : tone === "success" ? "bg-success-soft text-success" : "bg-primary/10 text-primary";
  let pctText = null, pct = 0;
  if (!earned && b.progress) {
    pct = Math.min(100, Math.round((b.progress.value / b.progress.target) * 100));
    pctText = b.progress.money ? `${formatINR(b.progress.value)} / ${formatINR(b.progress.target)}` : `${b.progress.value} / ${b.progress.target}`;
  }
  return (
    <div className={cn("rounded-xl border p-4", earned ? "border-border-soft bg-surface" : "border-dashed border-border bg-surface-muted/30")}>
      <div className="flex items-start gap-3">
        <span className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", tileCls)}><Icon name={b.icon} size={22} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className={cn("text-[13.5px] font-semibold truncate", earned ? "text-foreground" : "text-muted-foreground")}>{b.name}</p>
            {earned && <Icon name="checkCircle" size={14} className={tone === "success" ? "text-success" : "text-primary"} />}
          </div>
          <p className="text-helper mt-0.5 leading-snug">{b.desc}</p>
        </div>
      </div>
      {earned ? (
        <p className="text-[11.5px] text-muted-foreground mt-3">Earned · {b.date || "this programme"}</p>
      ) : (
        <div className="mt-3">
          <Progress value={pct} height={5} />
          <p className="text-[11.5px] text-muted-foreground mt-1.5 tabular-nums">{pctText} · keep going</p>
        </div>
      )}
    </div>
  );
}

function BadgeSection({ icon, title, badges, flush }) {
  const earnedCount = badges.filter(b => b.earned).length;
  return (
    <div className={cn("px-6 sm:px-8 py-6", !flush && "border-t border-border-soft")}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={15} className="text-primary" />
          <Eyebrow>{title}</Eyebrow>
        </div>
        <span className="text-helper tabular-nums">{earnedCount} of {badges.length} earned</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {badges.map(b => <BadgeCard key={b.id} b={b} />)}
      </div>
    </div>
  );
}

function MyProfile({ navigate }) {
  const totalDonated = DONATIONS.filter(d => d.status !== "cancelled").reduce((s, d) => s + d.amount, 0);
  const profile = { name: EMPLOYEE.name, designation: "Product Manager", phone: "98765 43210", email: "rohan.mehta@infosys.com", empId: "EMP1001" };
  const stats = [
    { label: "My donations", value: formatINR(totalDonated), to: "my-donations" },
    { label: "My nominations", value: EMPLOYEE.nominationsSubmitted, to: "my-nominations" },
    { label: "Scholars", value: EMPLOYEE.scholarsSupported, to: "my-scholars" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      <div className="grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 items-start">

        {/* ░░ LEFT — profile details, payment methods & impact (sticky) ░░ */}
        <aside className="space-y-6 order-1 lg:sticky lg:top-[84px]">

          {/* profile details card */}
          <div className="bg-surface rounded-2xl border border-border-soft shadow-sm overflow-hidden">
            <div className="px-6 pt-7 pb-6 border-b border-border-soft">
              <div className="flex flex-col items-center text-center">
                <Avatar name={profile.name} size={76} />
                <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-foreground leading-tight mt-3">{profile.name}</h1>
                <p className="text-body text-muted-foreground mt-1">{profile.designation}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <Badge tone="foreground" className="gap-1.5"><Icon name="users" size={11} />{EMPLOYEE.team} team</Badge>
                  <Badge tone="foreground" className="gap-1.5"><Icon name="clipboard" size={11} />{profile.empId}</Badge>
                </div>
              </div>
            </div>

            {/* my impact — compact stats */}
            <div className="px-6 py-5 border-b border-border-soft grid grid-cols-3 divide-x divide-border-soft">
              {stats.map(s => (
                <button key={s.label} onClick={() => navigate(s.to)} className="px-2 text-center group first:pl-0 last:pr-0">
                  <p className="text-[20px] font-semibold text-foreground tabular-nums leading-none group-hover:text-primary transition-colors">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight">{s.label}</p>
                </button>
              ))}
            </div>

            <ContactDetails email={profile.email} phone={profile.phone} />

            <div className="border-t border-border-soft"><PaymentMethods /></div>
          </div>

        </aside>

        {/* ░░ RIGHT — badges ░░ */}
        <div className="bg-surface rounded-2xl border border-border-soft shadow-sm overflow-hidden order-2">
          <BadgeSection icon="award" title="My badges" badges={MY_BADGES} flush />
          <BadgeSection icon="users" title="My team badges" badges={TEAM_BADGES} />
        </div>

      </div>
    </div>
  );
}

// ---------------- Contact details (collapsible) ----------------
function ContactDetails({ email, phone }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="px-6 sm:px-8 py-5 border-t border-border-soft">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-2.5">
        <Icon name="mail" size={15} className="text-primary shrink-0" />
        <Eyebrow>Contact details</Eyebrow>
        <Icon name="chevDown" size={16} className={cn("ml-auto text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-4 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-lg bg-surface-muted text-muted-foreground flex items-center justify-center shrink-0"><Icon name="mail" size={16} /></span>
              <div className="min-w-0"><p className="text-helper">Work email</p><p className="text-[14px] font-medium text-foreground truncate">{email}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-lg bg-surface-muted text-muted-foreground flex items-center justify-center shrink-0"><Icon name="phone" size={16} /></span>
              <div className="min-w-0"><p className="text-helper">Phone number</p><p className="text-[14px] font-medium text-foreground truncate">+91 {phone}</p></div>
            </div>
          </div>
          <p className="text-helper mt-4 flex items-start gap-1.5"><Icon name="info" size={13} className="shrink-0 mt-0.5" />Managed by your organisation's HR team and can't be changed here.</p>
        </div>
      )}
    </div>
  );
}

// ---------------- Payment methods (employee profile) ----------------
const PM_META = {
  upi: { label: "UPI", icon: "smartphone" },
  card: { label: "Card", icon: "creditCard" },
  netbanking: { label: "Net banking", icon: "landmark" },
};

function PaymentMethods() {
  const [methods, setMethods] = React.useState([
    { id: "pm1", type: "upi", title: "rohan@okhdfc", detail: "UPI · HDFC Bank", isDefault: true },
    { id: "pm2", type: "card", title: "HDFC Credit Card", detail: "•••• 4821 · expires 08/27", isDefault: false },
  ]);
  const [adding, setAdding] = React.useState(false);

  const setDefault = (id) => setMethods(ms => ms.map(m => ({ ...m, isDefault: m.id === id })));
  const remove = (id) => setMethods(ms => {
    const next = ms.filter(m => m.id !== id);
    if (next.length && !next.some(m => m.isDefault)) next[0].isDefault = true;
    return next;
  });
  const add = (m) => {
    setMethods(ms => {
      const id = "pm" + (Date.now());
      const makeDefault = ms.length === 0;
      return [...ms.map(x => makeDefault ? { ...x, isDefault: false } : x), { ...m, id, isDefault: makeDefault }];
    });
    setAdding(false);
  };
  const [open, setOpen] = React.useState(false);

  return (
    <div className="px-6 sm:px-8 py-5">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-2.5 group">
        <Icon name="creditCard" size={15} className="text-primary shrink-0" />
        <Eyebrow>Payment methods</Eyebrow>
        <span className="text-helper tabular-nums">{methods.length}</span>
        <Icon name="chevDown" size={16} className={cn("ml-auto text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-4 animate-fade-in">
          {methods.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <p className="text-[13.5px] text-muted-foreground">No payment methods saved. Add one to make donating faster.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border-soft divide-y divide-border-soft overflow-hidden">
              {methods.map(m => {
                const meta = PM_META[m.type];
                return (
                  <div key={m.id} className="flex items-center gap-3.5 px-4 py-3.5">
                    <span className="h-10 w-10 rounded-lg bg-surface-muted text-foreground flex items-center justify-center shrink-0"><Icon name={meta.icon} size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium text-foreground truncate">{m.title}</p>
                        {m.isDefault && <Badge tone="success">Default</Badge>}
                      </div>
                      <p className="text-helper truncate">{m.detail}</p>
                    </div>
                    {!m.isDefault && <button onClick={() => setDefault(m.id)} className="text-[12.5px] font-medium text-primary hover:underline shrink-0">Set default</button>}
                    <button onClick={() => remove(m.id)} className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-surface-muted transition-colors shrink-0" aria-label="Remove"><Icon name="trash" size={15} /></button>
                  </div>
                );
              })}
            </div>
          )}
          <Button variant="outline" className="w-full mt-3" onClick={() => setAdding(true)}><Icon name="plus" size={14} />Add payment method</Button>
          <p className="text-helper mt-3 flex items-center gap-1.5"><Icon name="shield" size={13} className="text-success shrink-0" />Payment details are stored securely with our payment partner — never on this device.</p>
        </div>
      )}

      <AddPaymentModal open={adding} onClose={() => setAdding(false)} onAdd={add} />
    </div>
  );
}

function AddPaymentModal({ open, onClose, onAdd }) {
  const [type, setType] = React.useState("upi");
  const [fields, setFields] = React.useState({ upi: "", cardNum: "", cardName: "", expiry: "", bank: "HDFC Bank" });
  React.useEffect(() => { if (open) { setType("upi"); setFields({ upi: "", cardNum: "", cardName: "", expiry: "", bank: "HDFC Bank" }); } }, [open]);
  if (!open) return null;
  const setF = (k, v) => setFields(f => ({ ...f, [k]: v }));

  const valid = type === "upi" ? /.+@.+/.test(fields.upi)
    : type === "card" ? fields.cardNum.replace(/\s/g, "").length >= 12 && fields.expiry.length >= 4
    : !!fields.bank;

  const submit = () => {
    if (!valid) return;
    if (type === "upi") onAdd({ type: "upi", title: fields.upi.trim(), detail: "UPI" });
    else if (type === "card") {
      const last4 = fields.cardNum.replace(/\s/g, "").slice(-4);
      onAdd({ type: "card", title: fields.cardName.trim() || "Card", detail: `•••• ${last4} · expires ${fields.expiry}` });
    } else onAdd({ type: "netbanking", title: fields.bank, detail: "Net banking" });
  };

  const types = [["upi", "UPI", "smartphone"], ["card", "Card", "creditCard"], ["netbanking", "Net banking", "landmark"]];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:w-[440px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-semibold text-foreground">Add payment method</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {types.map(([id, label, icon]) => {
            const sel = type === id;
            return (
              <button key={id} onClick={() => setType(id)}
                className={cn("flex flex-col items-center gap-1.5 rounded-lg border py-3 transition-colors", sel ? "border-primary bg-primary/[0.04] ring-1 ring-primary/15" : "border-border hover:border-foreground/20")}>
                <Icon name={icon} size={18} className={sel ? "text-primary" : "text-muted-foreground"} />
                <span className={cn("text-[12px] font-medium", sel ? "text-primary" : "text-foreground")}>{label}</span>
              </button>
            );
          })}
        </div>

        {type === "upi" && (
          <Field label="UPI ID" htmlFor="pm-upi" helper="e.g. yourname@okhdfc, 98765xxxxx@ybl">
            <Input id="pm-upi" value={fields.upi} onChange={(e) => setF("upi", e.target.value)} placeholder="name@bank" />
          </Field>
        )}
        {type === "card" && (
          <div className="space-y-3">
            <Field label="Card number" htmlFor="pm-card"><Input id="pm-card" inputMode="numeric" value={fields.cardNum} onChange={(e) => setF("cardNum", e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} placeholder="1234 5678 9012 3456" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name on card" htmlFor="pm-cn"><Input id="pm-cn" value={fields.cardName} onChange={(e) => setF("cardName", e.target.value)} placeholder="Rohan Mehta" /></Field>
              <Field label="Expiry" htmlFor="pm-exp"><Input id="pm-exp" value={fields.expiry} onChange={(e) => setF("expiry", e.target.value.replace(/[^\d/]/g, "").slice(0, 5))} placeholder="MM/YY" /></Field>
            </div>
          </div>
        )}
        {type === "netbanking" && (
          <Field label="Bank" htmlFor="pm-bank">
            <NativeSelect value={fields.bank} onChange={(e) => setF("bank", e.target.value)}>
              {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda"].map(b => <option key={b}>{b}</option>)}
            </NativeSelect>
          </Field>
        )}

        <Button className="w-full mt-5" disabled={!valid} onClick={submit}><Icon name="plus" size={15} />Add method</Button>
        <p className="text-helper mt-2.5 text-center">Demo only — no real payment details are stored.</p>
      </div>
    </div>,
    document.body
  );
}

// ---------------- Empty state ----------------
function EmptyState({ icon, title, body, cta, onCta }) {
  return (
    <Card className="p-12 text-center">
      <div className="flex justify-center mb-4"><IconTile name={icon} size={56} tone="muted" /></div>
      <h3 className="text-section-title">{title}</h3>
      <p className="text-body text-muted-foreground mt-1.5 max-w-[40ch] mx-auto">{body}</p>
      {cta && <Button className="mt-6" onClick={onCta}><Icon name="plus" size={16} />{cta}</Button>}
    </Card>
  );
}

// ---------------- Role stubs (Admin / Reviewer) ----------------
function RoleStub({ role, navigate }) {
  const meta = {
    Admin: { icon: "sliders", title: "Admin console", body: "Programme setup, donor reporting, and disbursement controls live here. This demo focuses on the employee experience." },
    Reviewer: { icon: "clipboard", title: "Reviewer console", body: "Shortlisting, scoring, and panel decisions for student nominations live here. This demo focuses on the employee experience." },
    Student: { icon: "graduationCap", title: "Student portal", body: "Application, document upload, and award tracking for students live here. This demo focuses on the employee experience." },
  }[role] || { icon: "info", title: (role || "This") + " view", body: "This view isn't part of the demo. Head back to the employee experience." };
  return (
    <div className="mx-auto w-full max-w-[640px] px-5 py-14 animate-fade-in">
      <div className="text-center mb-7">
        <Badge tone="foreground" className="mb-4">{role} view</Badge>
        <h1 className="text-page-title">{meta.title}</h1>
      </div>
      <EmptyState icon={meta.icon} title="Coming soon" body={meta.body} cta="Back to employee view" onCta={() => navigate("program")} />
    </div>
  );
}

Object.assign(window, { MyDonations, MyNominations, MyScholars, MyProfile, RoleStub, EmptyState });
