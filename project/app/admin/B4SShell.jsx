// ── B4S Superadmin console: shell + all platform pages ──
const B4S_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "layoutGrid" },
  { id: "programmes", label: "All programmes", icon: "award" },
  { id: "scholars", label: "All scholars", icon: "userCheck" },
  { id: "disbursements", label: "Disbursements", icon: "coin" },
  { id: "analytics", label: "Platform analytics", icon: "barChart" },
  { id: "pool", label: "Verified student pool", icon: "graduationCap" },
];
const B4S_LABEL = Object.fromEntries(B4S_NAV.map(n => [n.id, n.label]));
B4S_LABEL.clients = "Clients";

// L2 menu shown when a specific client is open
const B4S_CLIENT_SUBNAV = [
  { id: "overview", label: "Overview", icon: "layoutGrid" },
  { id: "donors", label: "Donors", icon: "heart" },
  { id: "nominations", label: "Nominations", icon: "userPlus" },
  { id: "scholars", label: "Scholars", icon: "userCheck" },
  { id: "employees", label: "Employees", icon: "users" },
  { id: "billing", label: "Billing", icon: "fileText" },
];
const B4S_CLIENT_SUB_LABEL = Object.fromEntries(B4S_CLIENT_SUBNAV.map(n => [n.id, n.label]));

// L3 menu shown when a specific programme is open
const B4S_PROG_SUBNAV = [
  { id: "dashboard", label: "Dashboard", icon: "layoutGrid" },
  { id: "details", label: "Details", icon: "fileText" },
  { id: "donors", label: "Donors", icon: "heart" },
  { id: "passbook", label: "Passbook", icon: "wallet" },
  { id: "nominations", label: "Applications", icon: "clipboard" },
  { id: "scholars", label: "Scholars", icon: "userCheck" },
  { id: "analytics", label: "Analytics", icon: "barChart" },
];
const B4S_PROG_SUB_LABEL = Object.fromEntries(B4S_PROG_SUBNAV.map(n => [n.id, n.label]));

function fmtCr(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + " L";
  return formatINR(n);
}

// ════════════════ SHELL ════════════════
function B4SShell({ page, go, onLogout, role, setRole, navigate, crumbs, inClient, inProgramme, clientName, programmeName, wsTab, setWsTab, progTab, setProgTab, onExitClient, onExitProgramme, children }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const l1IconOnly = collapsed || (inClient && !inProgramme);
  const l2IconOnly = inProgramme;
  return (
    <div className="min-h-screen flex bg-background">
      {/* sidebar rails — drill-down: each level pushes its parent down a notch */}
      <div className="shrink-0 flex sticky top-0 h-screen">
        {/* L1 platform rail — hidden once a programme is open */}
        {!inProgramme && (
          <aside style={{ flex: "0 0 " + (l1IconOnly ? 60 : 228) + "px", width: l1IconOnly ? 60 : 228 }} className="bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
              <button onClick={() => go("dashboard")} className="flex items-center gap-2.5 min-w-0">
                <img src="assets/b4s-logo.png" alt="Buddy4Study" className="h-8 w-8 object-contain shrink-0" />
                {!l1IconOnly && (
                  <div className="leading-tight min-w-0 text-left">
                    <p className="text-[14px] font-bold tracking-tight text-foreground truncate">Buddy4Study</p>
                    <p className="text-[10.5px] text-muted-foreground -mt-0.5">Platform console</p>
                  </div>
                )}
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {B4S_NAV.map(n => {
                const active = page === n.id || (n.id === "clients" && page === "client-detail");
                return (
                  <IconTip key={n.id} label={n.label} show={l1IconOnly}>
                    <button onClick={() => go(n.id)}
                      className={cn("relative w-full flex items-center gap-3 h-9 rounded-md text-[13.5px] transition-colors",
                        l1IconOnly ? "justify-center px-0" : "px-3",
                        active ? "bg-[#EFEFF1] text-[#3a4150] font-semibold" : "text-[#6b7280] font-medium hover:text-[#3a4150] hover:bg-[#f6f6f7]")}>
                      <Icon name={n.icon} size={18} stroke={active ? 2 : 1.75} className={active ? "text-[#3a4150]" : ""} />
                      {!l1IconOnly && n.label}
                    </button>
                  </IconTip>
                );
              })}
            </nav>
            {!inClient && (
              <div className="p-2 border-t border-sidebar-border">
                <button onClick={() => setCollapsed(c => !c)} className="w-full flex items-center gap-3 h-9 px-3 rounded-md text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors">
                  <Icon name={collapsed ? "chevRight" : "panelLeft"} size={18} />{!collapsed && "Collapse"}
                </button>
              </div>
            )}
          </aside>
        )}

        {/* L2 client rail — expanded in a client, icons-only once a programme is open */}
        {inClient && (
          <aside style={{ flex: "0 0 " + (l2IconOnly ? 60 : 232) + "px", width: l2IconOnly ? 60 : 232 }} className="bg-surface border-r border-sidebar-border flex flex-col h-screen">
            <div className="h-16 flex items-center px-3 border-b border-sidebar-border shrink-0">
              {l2IconOnly ? (
                <button onClick={onExitClient} title="All clients" className="h-9 w-9 mx-auto rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"><Icon name="arrowLeft" size={17} /></button>
              ) : (
                <button onClick={onExitClient} className="flex items-center gap-2 min-w-0 text-left group px-1">
                  <span className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-surface-muted transition-colors shrink-0"><Icon name="arrowLeft" size={16} /></span>
                  <div className="leading-tight min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">Client</p>
                    <p className="text-[13px] font-semibold text-foreground truncate -mt-0.5">{clientName || "Client"}</p>
                  </div>
                </button>
              )}
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {B4S_CLIENT_SUBNAV.map(s => {
                const subActive = !inProgramme && wsTab === s.id;
                return (
                  <IconTip key={s.id} label={s.label} show={l2IconOnly}>
                    <button onClick={() => setWsTab && setWsTab(s.id)}
                      className={cn("w-full flex items-center gap-3 h-9 rounded-md text-[13.5px] transition-colors",
                        l2IconOnly ? "justify-center px-0" : "px-3",
                        subActive ? "bg-[#EFEFF1] text-[#3a4150] font-semibold" : "text-[#6b7280] font-medium hover:text-[#3a4150] hover:bg-[#f6f6f7]")}>
                      <Icon name={s.icon} size={17} stroke={subActive ? 2 : 1.75} className={subActive ? "text-[#3a4150]" : ""} />{!l2IconOnly && s.label}
                    </button>
                  </IconTip>
                );
              })}
            </nav>
          </aside>
        )}

        {/* L3 programme rail */}
        {inProgramme && (
          <aside style={{ flex: "0 0 232px", width: 232 }} className="bg-surface border-r border-sidebar-border flex flex-col h-screen">
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
              <button onClick={onExitProgramme} className="flex items-center gap-2 min-w-0 text-left group">
                <span className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-surface-muted transition-colors shrink-0"><Icon name="arrowLeft" size={16} /></span>
                <div className="leading-tight min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">Programme</p>
                  <p className="text-[13px] font-semibold text-foreground truncate -mt-0.5">{programmeName || "Programme"}</p>
                </div>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {B4S_PROG_SUBNAV.map(s => {
                const subActive = progTab === s.id;
                return (
                  <button key={s.id} onClick={() => setProgTab && setProgTab(s.id)}
                    className={cn("w-full flex items-center gap-3 h-9 px-3 rounded-md text-[13.5px] transition-colors",
                      subActive ? "bg-[#EFEFF1] text-[#3a4150] font-semibold" : "text-[#6b7280] font-medium hover:text-[#3a4150] hover:bg-[#f6f6f7]")}>
                    <Icon name={s.icon} size={17} stroke={subActive ? 2 : 1.75} className={subActive ? "text-[#3a4150]" : ""} />{s.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}
      </div>

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-surface/95 backdrop-blur-sm border-b border-border flex items-center px-6 sticky top-0 z-30">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            {(crumbs || [{ label: B4S_LABEL[page] || "Dashboard" }]).map((c, i, arr) => {
              const item = typeof c === "string" ? { label: c } : c;
              const isLast = i === arr.length - 1;
              return (
                <React.Fragment key={i}>
                  {i > 0 && <Icon name="chevRight" size={12} />}
                  {item.onClick && !isLast
                    ? <button onClick={item.onClick} className="hover:text-foreground transition-colors">{item.label}</button>
                    : <span className={isLast ? "text-foreground font-medium" : ""}>{item.label}</span>}
                </React.Fragment>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Badge tone="foreground" className="gap-1.5 hidden sm:inline-flex"><Icon name="shield" size={11} />Platform admin</Badge>
            <div className="relative">
              {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-md hover:bg-surface-muted transition-colors">
                <Avatar name={B4S_USER.name} size={28} /><Icon name="chevDown" size={14} className="text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute top-[42px] right-0 z-50 w-60 rounded-xl border border-border bg-popover shadow-lg p-1.5 animate-scale-in origin-top-right">
                  <div className="flex items-center gap-3 px-2.5 py-2">
                    <Avatar name={B4S_USER.name} size={36} />
                    <div className="min-w-0"><p className="text-[13px] font-medium text-foreground truncate">{B4S_USER.name}</p><p className="text-[11px] text-muted-foreground truncate">{B4S_USER.email}</p></div>
                  </div>
                  <div className="h-px bg-border-soft my-1" />
                  <p className="text-eyebrow px-2.5 pt-1.5 pb-1">Switch role — demo</p>
                  <button onClick={() => { setMenuOpen(false); setRole && setRole("Admin"); navigate && navigate("dashboard"); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
                    <Icon name="sliders" size={16} className="text-muted-foreground" />HR admin view
                  </button>
                  <button onClick={() => { setMenuOpen(false); setRole && setRole("Employee"); navigate && navigate("program"); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
                    <Icon name="heart" size={16} className="text-muted-foreground" />Employee view
                  </button>
                  <div className="h-px bg-border-soft my-1" />
                  <button onClick={() => { setMenuOpen(false); onLogout(); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
                    <Icon name="logout" size={16} className="text-muted-foreground" />Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><div className="max-w-[1180px] mx-auto px-6 py-8 animate-fade-in">{children}</div></main>
      </div>
    </div>
  );
}

// ════════════════ DASHBOARD ════════════════
function B4SDashboard({ go, openClient, clients = B4S_CLIENTS, onOnboard }) {
  const [clientQuery, setClientQuery] = React.useState("");
  const q = clientQuery.trim().toLowerCase();
  // predictive search kicks in after 3 characters
  const shownClients = q.length < 3 ? clients : clients.filter(c => (c.name + " " + c.foundation + " " + c.industry).toLowerCase().includes(q));
  const k = {
    clients: clients.length,
    activeClients: clients.filter(c => c.status === "Active").length,
    raised: clients.reduce((s, c) => s + c.raised, 0),
    scholars: clients.reduce((s, c) => s + c.scholars, 0),
    employees: clients.reduce((s, c) => s + c.employees, 0),
    nominations: clients.reduce((s, c) => s + Math.round(c.scholars * 5.5), 0),
  };
  const kpis = [
    { label: "Onboarded clients", value: k.clients, sub: `${k.activeClients} active`, icon: "building" },
    { label: "Employees onboarded", value: k.employees.toLocaleString("en-IN"), sub: "across all clients", icon: "users" },
    { label: "Total funds raised", value: fmtCr(k.raised), sub: "platform-wide", icon: "trendingUp" },
    { label: "Total nominations", value: k.nominations.toLocaleString("en-IN"), sub: "students put forward", icon: "userPlus" },
    { label: "Scholars funded", value: k.scholars.toLocaleString("en-IN"), sub: "platform-wide", icon: "graduationCap" },
  ];
  return (
    <>
      <AdminPageHead title="Platform overview" subtitle="Aggregate performance across every client on Buddy4Study."
        actions={<Button onClick={onOnboard}><Icon name="plus" size={15} />Onboard company</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {kpis.map(c => <KpiCard key={c.label} {...c} />)}
      </div>

      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h2 className="text-section-title">Client organisations</h2>
        <div className="flex items-center gap-2.5">
          <SearchInput value={clientQuery} onChange={e => setClientQuery(e.target.value)} placeholder="Search clients…" className="w-56" />
          <Button variant="outline" size="sm" onClick={() => go("clients")}>View all<Icon name="arrowRight" size={14} /></Button>
        </div>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Client" }, { label: "Plan" }, { label: "Raised", align: "right" }, { label: "Progress" }, { label: "Scholars", align: "right" }, { label: "Status" }, { label: "", w: "w-10" }]}>
          {shownClients.map(c => {
            const pct = c.goal ? Math.round((c.raised / c.goal) * 100) : 0;
            return (
              <tr key={c.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors cursor-pointer" onClick={() => openClient(c.id)}>
                <Td><div className="flex items-center gap-2.5"><Avatar name={c.name} size={30} /><div><div className="font-medium text-foreground flex items-center gap-1.5">{c.name}{c.isHome && <Badge tone="info">You</Badge>}</div><div className="text-helper">{c.foundation}</div></div></div></Td>
                <Td><Badge tone={B4S_PLAN_TONE[c.plan]}>{c.plan}</Badge></Td>
                <Td align="right" className="tabular-nums font-medium">{fmtCr(c.raised)}</Td>
                <Td><div className="flex items-center gap-2 min-w-[120px]"><div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: pct + "%" }} /></div><span className="text-[12px] text-muted-foreground tabular-nums w-8">{pct}%</span></div></Td>
                <Td align="right" className="tabular-nums">{c.scholars}</Td>
                <Td><Badge tone={B4S_CLIENT_STATUS_TONE[c.status]}>{c.status}</Badge></Td>
                <Td align="right"><Icon name="chevRight" size={16} className="text-muted-foreground" /></Td>
              </tr>
            );
          })}
        </Table>
        {shownClients.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No clients match “{clientQuery}”.</div>}
      </Card>
    </>
  );
}

window.B4SShell = B4SShell;
window.B4SDashboard = B4SDashboard;
window.B4S_NAV = B4S_NAV;
window.B4S_LABEL = B4S_LABEL;
window.B4S_CLIENT_SUBNAV = B4S_CLIENT_SUBNAV;
window.B4S_CLIENT_SUB_LABEL = B4S_CLIENT_SUB_LABEL;
window.B4S_PROG_SUBNAV = B4S_PROG_SUBNAV;
window.B4S_PROG_SUB_LABEL = B4S_PROG_SUB_LABEL;
window.b4sFmtCr = fmtCr;
