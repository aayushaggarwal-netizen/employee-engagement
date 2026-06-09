// ── Home: account / portfolio overview (across all programmes, lifetime) ──
function AdminDashboard({ go, onRestartSetup, openProgram }) {
  const T = PORTFOLIO_TOTALS;
  const lifetimePart = Math.round((T.lifetimeDonors / T.totalEmployees) * 100);

  return (
    <>
      <AdminPageHead title={`Welcome back, ${ADMIN_USER.name.split(" ")[0]}`} subtitle={`${COMPANY.name} · ${COMPANY.foundation}`}
        actions={<>
          {onRestartSetup && <Button variant="secondary" onClick={onRestartSetup}><Icon name="rocket" size={15} />Setup wizard</Button>}
          <Button onClick={() => go("programs")}><Icon name="plus" size={15} />New programme</Button>
        </>} />

      {/* lifetime KPIs — account level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard icon="trendingUp" label="Lifetime raised" value={cpInrShort(T.raised)} sub="Across all programmes" tone="primary" />
        <KpiCard icon="graduationCap" label="Scholars funded" value={T.scholars} sub="To date, all cohorts" tone="success" />
        <KpiCard icon="award" label="Programmes" value={T.active + T.ended} sub={`${T.active} active · ${T.ended} ended`} tone="primary" onClick={() => go("programs")} />
        <KpiCard icon="users" label="Lifetime participation" value={`${lifetimePart}%`} sub={`${T.lifetimeDonors.toLocaleString("en-IN")} of ${T.totalEmployees.toLocaleString("en-IN")} have ever given`} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* all programmes portfolio */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div><Eyebrow>Your programmes</Eyebrow><h2 className="text-section-title mt-1">Portfolio</h2></div>
            <button onClick={() => go("programs")} className="text-[12.5px] font-medium text-primary hover:underline">Manage</button>
          </div>
          <div className="space-y-2.5">
            {PROGRAM_PORTFOLIO.map(p => {
              const pct = Math.round((p.raised / p.goal) * 100);
              const isActive = p.status === "Active";
              return (
                <button key={p.id} disabled={!isActive} onClick={() => isActive && openProgram(p.id)}
                  className={cn("w-full text-left rounded-lg border border-border-soft p-3.5 transition-colors", isActive ? "hover:border-foreground/20 cursor-pointer" : "opacity-90 cursor-default")}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}><Icon name="graduationCap" size={17} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13.5px] font-medium text-foreground truncate">{p.name}</p>
                        <Badge tone={isActive ? "success" : "muted"} className="shrink-0">{p.status}</Badge>
                      </div>
                      <p className="text-helper mt-0.5 tabular-nums">{cpInrShort(p.raised)} of {cpInrShort(p.goal)} · {p.scholars} scholars · {p.year}</p>
                    </div>
                    <span className="text-[13px] font-semibold text-primary tabular-nums shrink-0">{pct}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* cross-programme activity */}
        <Card className="p-6">
          <Eyebrow>Recent activity</Eyebrow>
          <h2 className="text-section-title mt-1 mb-4">Across programmes</h2>
          <div className="space-y-1">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border-soft last:border-0">
                <div className="h-9 w-9 rounded-full bg-surface-muted flex items-center justify-center shrink-0 text-muted-foreground"><Icon name={a.icon} size={16} /></div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[13.5px] text-foreground leading-snug"><span className="font-medium">{a.who}</span> {a.action} <span className="font-medium">{a.detail}</span></p>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">Bright Futures 2025 · {a.t}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
window.AdminDashboard = AdminDashboard;
