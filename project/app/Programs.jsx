// ── Employee landing: browse programmes, then open one's detail page ──
function ProgramStat({ icon, value, label }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5"><Icon name={icon} size={14} /></div>
      <p className="text-[18px] font-semibold text-foreground tabular-nums leading-none">{value}</p>
      <p className="text-helper mt-1">{label}</p>
    </div>
  );
}

// Large, prominent card for a single live programme — the whole card opens the detail
function FeaturedProgram({ p, openProgram }) {
  const pct = Math.round((p.raised / p.goal) * 100);
  return (
    <button onClick={() => openProgram(p.detail)}
      className="group w-full text-left rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8 transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-7">
        {/* left — identity + story */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap text-helper mb-4">
            <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="graduationCap" size={18} /></span>
            <span className="inline-flex items-center gap-1.5"><Icon name="building" size={13} />{p.org}</span>
            <span aria-hidden>·</span>
            <Badge tone="success">Active</Badge>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground">{p.category}</span>
          </div>
          <h2 className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.015em] leading-[1.1] text-foreground max-w-[18ch]">{p.name}</h2>
          <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-muted-foreground max-w-[52ch] mt-3">{p.tagline}</p>

          <div className="grid grid-cols-3 gap-x-6 gap-y-5 mt-7 max-w-md">
            <ProgramStat icon="users" value={p.donors.toLocaleString("en-IN")} label="donors" />
            <ProgramStat icon="graduationCap" value={p.scholars} label="scholars funded" />
            <ProgramStat icon="calendar" value={daysLeft(p.endDate)} label="days left" />
          </div>
        </div>

        {/* right — progress + CTA panel */}
        <div className="lg:w-[320px] shrink-0 flex flex-col lg:border-l lg:border-border-soft lg:pl-7">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <span className="text-[22px] sm:text-[26px] font-semibold text-foreground tabular-nums">{formatINR(p.raised)}</span>
              <span className="text-[14px] font-semibold text-primary tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} height={10} />
            <p className="text-helper mt-2">raised of {formatINR(p.goal)} goal · {formatINR(p.goal - p.raised)} to go</p>
          </div>

          <div className="mt-auto pt-6">
            <span className="inline-flex w-full items-center justify-center gap-2 h-11 rounded-md bg-primary text-primary-foreground text-[14px] font-medium transition-colors group-hover:bg-primary-hover">
              View programme<Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </span>
            <p className="text-helper text-center mt-2.5 flex items-center justify-center gap-1.5"><Icon name="shieldCheck" size={13} className="text-success" />100% reaches verified students</p>
          </div>
        </div>
      </div>
    </button>
  );
}

// Compact live-programme card — used when 2+ programmes are live, shown side by side
function LiveProgramCard({ p, openProgram }) {
  const pct = Math.round((p.raised / p.goal) * 100);
  return (
    <button onClick={() => openProgram(p.detail)}
      className="group flex flex-col text-left rounded-2xl border border-border bg-surface shadow-sm p-6 transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <div className="flex items-center gap-2.5 flex-wrap text-helper mb-3.5">
        <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="graduationCap" size={18} /></span>
        <Badge tone="success">Active</Badge>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground">{p.category}</span>
      </div>
      <p className="text-helper inline-flex items-center gap-1.5"><Icon name="building" size={13} />{p.org}</p>
      <h3 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.01em] leading-snug text-foreground mt-1">{p.name}</h3>
      <p className="text-[13.5px] leading-relaxed text-muted-foreground mt-2 line-clamp-2">{p.tagline}</p>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <span className="text-[18px] font-semibold text-foreground tabular-nums">{formatINR(p.raised)}</span>
          <span className="text-[13px] font-semibold text-primary tabular-nums">{pct}%</span>
        </div>
        <Progress value={pct} height={8} />
        <p className="text-helper mt-2">of {formatINR(p.goal)} goal</p>
      </div>

      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border-soft">
        <span className="inline-flex items-center gap-1.5 text-helper"><Icon name="users" size={13} />{p.donors.toLocaleString("en-IN")} donors</span>
        <span className="inline-flex items-center gap-1.5 text-helper"><Icon name="calendar" size={13} />{daysLeft(p.endDate)} days left</span>
      </div>

      <div className="mt-5 pt-px">
        <span className="inline-flex w-full items-center justify-center gap-2 h-10 rounded-md bg-primary text-primary-foreground text-[13.5px] font-medium transition-colors group-hover:bg-primary-hover">
          View programme<Icon name="arrowRight" size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

// Compact, display-only card for a completed programme
function PastProgram({ p }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="h-8 w-8 rounded-lg bg-surface-muted text-muted-foreground flex items-center justify-center shrink-0"><Icon name="graduationCap" size={16} /></span>
        <Badge tone="muted">Completed</Badge>
        <span className="ml-auto text-helper">Closed {p.closedOn}</span>
      </div>
      <p className="text-[15px] font-semibold text-foreground leading-snug">{p.name}</p>
      <p className="text-helper mt-1 leading-relaxed">{p.tagline}</p>
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border-soft">
        <div><p className="text-[16px] font-semibold text-foreground tabular-nums leading-none">{formatLakh(p.raised)}</p><p className="text-helper mt-1">raised</p></div>
        <div><p className="text-[16px] font-semibold text-foreground tabular-nums leading-none">{p.scholars}</p><p className="text-helper mt-1">scholars funded</p></div>
        <div><p className="text-[16px] font-semibold text-foreground tabular-nums leading-none">{p.donors.toLocaleString("en-IN")}</p><p className="text-helper mt-1">donors</p></div>
      </div>
    </div>
  );
}

function ProgramsBrowse({ navigate, openProgram }) {
  const live = EMPLOYEE_PROGRAMS.filter(p => p.live);
  const past = EMPLOYEE_PROGRAMS.filter(p => !p.live);
  const single = live.length === 1;
  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-8 py-8 sm:py-12 animate-fade-in">
      {/* header */}
      <header className="mb-7 sm:mb-9">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-primary">Employee giving</p>
        <h1 className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-[1.12] text-foreground mt-2">Hello {EMPLOYEE.name.split(" ")[0]} — choose a programme to support</h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[60ch] mt-2.5">Give to a live scholarship programme, or look back at the impact of past cohorts. Every rupee reaches a verified student.</p>
      </header>

      {/* live programmes */}
      <section>
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-success" /></span>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground whitespace-nowrap">Live now</h2>
          {!single && <span className="text-[12px] text-muted-foreground tabular-nums">· {live.length} programmes</span>}
        </div>
        {single ? (
          <FeaturedProgram p={live[0]} openProgram={openProgram} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
            {live.map(p => <LiveProgramCard key={p.id} p={p} openProgram={openProgram} />)}
          </div>
        )}
      </section>

      {/* past programmes */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3.5">Past programmes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map(p => <PastProgram key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

window.ProgramsBrowse = ProgramsBrowse;
