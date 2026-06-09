// ── Admin shell: left sidebar + top bar ──
const ADMIN_NAV = [
  { id: "dashboard", label: "Home", icon: "layoutGrid" },
  { id: "programs", label: "Programs", icon: "award" },
  { id: "employees", label: "People", icon: "users" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// L2 sub-menu shown under Programs when a program workspace is open
const PROGRAM_SUBNAV = [
  { id: "dashboard", label: "Dashboard", icon: "layoutGrid" },
  { id: "details", label: "Details", icon: "fileText" },
  { id: "donors", label: "Donors", icon: "heart" },
  { id: "passbook", label: "Passbook", icon: "wallet" },
  { id: "nominations", label: "Applications", icon: "clipboard" },
  { id: "scholars", label: "Scholars", icon: "userCheck" },
  { id: "analytics", label: "Analytics", icon: "barChart" },
];

const WS_LABEL = {
  dashboard: "Dashboard", details: "Details", form: "Form", donors: "Donors", passbook: "Passbook", nominations: "Applications",
  scholars: "Scholars", analytics: "Analytics",
};

const BREADCRUMB = {
  dashboard: ["Home"],
  programs: ["Programs"],
  "programs-new": ["Programs", "Create program"],
  employees: ["People"],
  leaderboards: ["Leaderboards"],
  nudges: ["Nudges"],
  stories: ["Student stories"],
  nominations: ["Applications"],
  scholars: ["Scholars"],
  "scholar-detail": ["Scholars", "Scholar detail"],
  disbursements: ["Disbursements"],
  analytics: ["Analytics"],
  settings: ["Settings"],
};

function AdminSidebar({ page, go, collapsed, inWorkspace, wsTab, setWsTab, wsTitle, onExitWorkspace }) {
  // When a program workspace is open, the L1 rail compresses to icons only
  // and the L2 (program) menu opens as a second expanded panel beside it.
  const iconOnly = collapsed || inWorkspace;
  return (
    <div className="shrink-0 h-full flex">
      {/* L1 rail */}
      <aside style={{ flex: "0 0 " + (iconOnly ? 68 : 228) + "px", width: iconOnly ? 68 : 228 }} className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* logo zone */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
          <button onClick={() => go("dashboard")} className="flex items-center gap-2.5 min-w-0">
            <img src="assets/b4s-logo.png" alt="" className="h-8 w-8 object-contain shrink-0" />
            {!iconOnly && (
              <div className="leading-tight min-w-0 text-left">
                <p className="text-[14px] font-bold tracking-tight text-foreground truncate">Buddy4Study</p>
                <p className="text-[10.5px] text-muted-foreground -mt-0.5 truncate">Admin · {COMPANY.foundation}</p>
              </div>
            )}
          </button>
        </div>
        {/* nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {ADMIN_NAV.map(n => {
            const active = page === n.id
              || (n.id === "programs" && (page === "programs-new" || page === "program-workspace"))
              || (n.id === "scholars" && page === "scholar-detail");
            return (
              <IconTip key={n.id} label={n.label} show={iconOnly}>
                <button onClick={() => go(n.id)}
                  className={cn("relative w-full flex items-center gap-3 h-9 rounded-md text-[13.5px] transition-colors",
                    iconOnly ? "justify-center px-0" : "px-3",
                    active ? "bg-[#EFEFF1] text-[#3a4150] font-semibold" : "text-[#6b7280] font-medium hover:text-[#3a4150] hover:bg-[#f6f6f7]")}>
                  <Icon name={n.icon} size={18} stroke={active ? 2 : 1.75} className={active ? "text-[#3a4150]" : ""} />
                  {!iconOnly && n.label}
                </button>
              </IconTip>
            );
          })}
        </nav>
        {/* user */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3", iconOnly && "justify-center")}>
            <Avatar name={ADMIN_USER.name} size={34} />
            {!iconOnly && (
              <div className="min-w-0 leading-tight">
                <p className="text-[13px] font-medium text-foreground truncate">{ADMIN_USER.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{ADMIN_USER.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* L2 panel — program workspace menu */}
      {inWorkspace && (
        <aside style={{ flex: "0 0 232px", width: 232 }} className="h-full bg-surface border-r border-sidebar-border flex flex-col">
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
            <button onClick={onExitWorkspace} className="flex items-center gap-2 min-w-0 text-left group">
              <span className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-surface-muted transition-colors shrink-0"><Icon name="arrowLeft" size={16} /></span>
              <div className="leading-tight min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">Programme</p>
                <p className="text-[13px] font-semibold text-foreground truncate -mt-0.5">{wsTitle || "Programme"}</p>
              </div>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
            {PROGRAM_SUBNAV.map(s => {
              const subActive = wsTab === s.id;
              return (
                <button key={s.id} onClick={() => setWsTab && setWsTab(s.id)}
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
  );
}

function AdminTopbar({ page, go, onToggleSidebar, onLogout, role, setRole, navigate, crumbs: crumbsOverride }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const crumbs = crumbsOverride || BREADCRUMB[page] || ["Home"];
  const lastCrumb = crumbs[crumbs.length - 1];
  const title = typeof lastCrumb === "string" ? lastCrumb : lastCrumb.label;
  return (
    <header className="shrink-0 h-16 bg-surface border-b border-border flex items-center gap-3 px-5">
      <button onClick={onToggleSidebar} className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors shrink-0">
        <Icon name="panelLeft" size={18} />
      </button>
      <div className="min-w-0">
        <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          {crumbs.map((c, i) => {
            const item = typeof c === "string" ? { label: c } : c;
            const isLast = i === crumbs.length - 1;
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
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* profile menu */}
        <div className="relative">
          {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-md hover:bg-surface-muted transition-colors">
            <Avatar name={ADMIN_USER.name} size={28} />
            <Icon name="chevDown" size={14} className="text-muted-foreground" />
          </button>
          {menuOpen && (
            <div className="absolute top-[42px] right-0 z-50 w-56 rounded-xl border border-border bg-popover shadow-lg p-1.5 animate-scale-in origin-top-right">
              <div className="flex items-center gap-3 px-2.5 py-2">
                <Avatar name={ADMIN_USER.name} size={36} />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{ADMIN_USER.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{ADMIN_USER.email}</p>
                </div>
              </div>
              <div className="h-px bg-border-soft my-1" />
              <button onClick={() => { setMenuOpen(false); go("settings"); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
                <Icon name="settings" size={16} className="text-muted-foreground" />Settings
              </button>
              <button onClick={() => { setMenuOpen(false); setRole && setRole("Employee"); navigate && navigate("program"); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
                <Icon name="repeat" size={16} className="text-muted-foreground" />Switch to employee view
              </button>
              <button onClick={() => { setMenuOpen(false); setRole && setRole("B4S"); }} className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
                <Icon name="shield" size={16} className="text-muted-foreground" />Switch to B4S platform
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
  );
}

function AdminShell({ page, go, onLogout, role, setRole, navigate, crumbs, inWorkspace, wsTab, setWsTab, wsTitle, children }) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AdminSidebar page={page} go={go} collapsed={collapsed} inWorkspace={inWorkspace} wsTab={wsTab} setWsTab={setWsTab} wsTitle={wsTitle} onExitWorkspace={() => go("programs")} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar page={page} go={go} onToggleSidebar={() => setCollapsed(c => !c)} onLogout={onLogout} role={role} setRole={setRole} navigate={navigate} crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8 py-8 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { ADMIN_NAV, AdminShell });
