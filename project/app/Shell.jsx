// ── App shell: top nav (Programme) + profile dropdown holding the "My" pages ──
const PROFILE_LINKS = [
  { id: "my-donations", label: "My donations", icon: "receipt" },
  { id: "my-nominations", label: "My nominations", icon: "user" },
  { id: "my-scholars", label: "Scholars", icon: "graduationCap" },
];

function programActive(route) {
  return ["program", "donate", "nominate"].includes(route);
}

function Brand({ compact }) {
  return (
    <img src="assets/b4s-foundation-logo.png" alt="Buddy4Study India Foundation"
      className="object-contain shrink-0" style={{ height: compact ? 26 : 34, width: "auto" }} />
  );
}

// ── Single hamburger menu: profile, switch role, and all "My" pages ──
const MENU_LINKS = [
  { id: "profile", label: "My profile", icon: "user" },
  { id: "my-donations", label: "My donations", icon: "receipt" },
  { id: "my-nominations", label: "My nominees", icon: "user" },
  { id: "my-scholars", label: "Scholars", icon: "graduationCap" },
];

function HamburgerMenu({ route, navigate, onLogout, role, setRole }) {
  const [open, setOpen] = React.useState(false);
  const go = (id) => { setOpen(false); navigate(id); };
  return (
    <div className="relative">
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
      <button onClick={() => setOpen(!open)} aria-label="Menu"
        className="inline-flex items-center gap-2 h-10 pl-2.5 pr-2 rounded-md border border-border bg-surface hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <Icon name="menu" size={18} className="text-foreground" />
        <Avatar name={EMPLOYEE.name} size={28} />
      </button>
      {open && (
        <div className="absolute top-[52px] right-0 z-50 w-64 rounded-xl border border-border bg-popover shadow-lg p-1.5 animate-scale-in origin-top-right">
          {/* profile summary */}
          <button onClick={() => go("profile")} className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-surface-muted transition-colors text-left">
            <Avatar name={EMPLOYEE.name} size={38} />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground truncate">{EMPLOYEE.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{EMPLOYEE.team} team · view profile</p>
            </div>
          </button>

          <div className="h-px bg-border-soft my-1" />
          {MENU_LINKS.map(l => {
            const active = route === l.id;
            return (
              <button key={l.id} onClick={() => go(l.id)}
                className={cn("w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors",
                  active ? "bg-accent text-foreground" : "text-foreground hover:bg-surface-muted")}>
                <Icon name={l.icon} size={16} className={active ? "text-primary" : "text-muted-foreground"} />{l.label}
              </button>
            );
          })}

          {/* switch to admin */}
          <div className="h-px bg-border-soft my-1" />
          <button onClick={() => { setOpen(false); setRole("Admin"); }}
            className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
            <Icon name="repeat" size={16} className="text-muted-foreground" />Switch to admin
          </button>

          <div className="h-px bg-border-soft my-1" />
          <button onClick={() => { setOpen(false); onLogout(); }}
            className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-surface-muted transition-colors">
            <Icon name="logout" size={16} className="text-muted-foreground" />Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function TopNav({ route, navigate, onLogout, role, setRole }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-[1120px] h-full px-5 sm:px-8 flex items-center gap-5">
        <button onClick={() => navigate("programs")} className="shrink-0"><Brand /></button>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-[13px] font-medium text-foreground">{EMPLOYEE.name}</span>
            <span className="text-[11px] text-muted-foreground">{EMPLOYEE.team} team</span>
          </div>
          <HamburgerMenu route={route} navigate={navigate} onLogout={onLogout} role={role} setRole={setRole} />
        </div>
      </div>
    </header>
  );
}

function Shell({ route, navigate, onLogout, role, setRole, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav route={route} navigate={navigate} onLogout={onLogout} role={role} setRole={setRole} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

window.Shell = Shell;
