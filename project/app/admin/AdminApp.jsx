// ── Admin app: first-run setup gate + internal router wrapped in shell + toast provider ──
function AdminApp({ onLogout, role, setRole, navigate }) {
  const LS_ADMIN = "eg_admin_page_v1";
  const LS_SETUP = "eg_admin_setup_done_v1";
  const [setupDone, setSetupDone] = React.useState(() => {
    try { return localStorage.getItem(LS_SETUP) === "1"; } catch { return false; }
  });
  const [page, setPage] = React.useState(() => {
    try { return localStorage.getItem(LS_ADMIN) || "dashboard"; } catch { return "dashboard"; }
  });
  const [scholarId, setScholarId] = React.useState(ADMIN_SCHOLARS[0].id);
  const [wsProgram, setWsProgram] = React.useState(PROGRAMS[0].id);
  const [wsTab, setWsTab] = React.useState("dashboard");

  const finishSetup = () => { try { localStorage.setItem(LS_SETUP, "1"); } catch {} setSetupDone(true); setPage("dashboard"); try { localStorage.setItem(LS_ADMIN, "dashboard"); } catch {} };
  const restartSetup = () => { try { localStorage.setItem(LS_SETUP, "0"); } catch {} setSetupDone(false); };

  const go = (p) => {
    setPage(p);
    try { localStorage.setItem(LS_ADMIN, p); } catch {}
    requestAnimationFrame(() => { const m = document.querySelector("main"); if (m) m.scrollTop = 0; });
  };
  const openProgram = (id, tab = "dashboard") => { setWsProgram(id); setWsTab(tab); go("program-workspace"); };

  const prog = PROGRAMS.find(p => p.id === wsProgram) || PROGRAMS[0];
  const crumbs = page === "program-workspace"
    ? [{ label: "Programs", onClick: () => go("programs") }, { label: prog.name, onClick: () => setWsTab("dashboard") }, { label: (WS_LABEL[wsTab] || "Dashboard") }]
    : undefined;

  let body;
  switch (page) {
    case "dashboard": body = <AdminDashboard go={go} onRestartSetup={restartSetup} openProgram={openProgram} />; break;
    case "programs": body = <ProgramsList go={go} openProgram={openProgram} />; break;
    case "programs-new": body = <ProgramsList go={go} openProgram={openProgram} />; break;
    case "program-workspace": body = <ProgramWorkspace programId={wsProgram} tab={wsTab} setTab={setWsTab} onBack={() => go("programs")} />; break;
    case "employees": body = <EmployeesPage go={go} />; break;
    case "leaderboards": body = <LeaderboardsPage />; break;
    case "nudges": body = <NudgesPage />; break;
    case "stories": body = <StoriesPage />; break;
    case "nominations": body = <NominationsPage go={go} />; break;
    case "scholars":
    case "scholar-detail": body = <ScholarsPage page={page} go={go} scholarId={scholarId} setScholarId={setScholarId} />; break;
    case "disbursements": body = <DisbursementsPage />; break;
    case "analytics": body = <AnalyticsPage />; break;
    case "settings": body = <SettingsPage />; break;
    default: body = <AdminDashboard go={go} onRestartSetup={restartSetup} openProgram={openProgram} />;
  }

  return (
    <ToastProvider>
      {setupDone
        ? <AdminShell page={page} go={go} onLogout={onLogout} role={role} setRole={setRole} navigate={navigate} crumbs={crumbs}
            inWorkspace={page === "program-workspace"} wsTab={wsTab} setWsTab={setWsTab} wsTitle={prog.name}>{body}</AdminShell>
        : <AdminOnboarding onComplete={finishSetup} onSkip={finishSetup} />}
    </ToastProvider>
  );
}
window.AdminApp = AdminApp;
