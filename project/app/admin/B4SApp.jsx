// ── B4S Superadmin app router ──
function B4SApp({ onLogout, role, setRole, navigate }) {
  const LS = "eg_b4s_page_v1";
  const [page, setPage] = React.useState(() => { try { return localStorage.getItem(LS) || "dashboard"; } catch { return "dashboard"; } });
  const [clientId, setClientId] = React.useState(B4S_CLIENTS[0].id);
  const [clients, setClients] = React.useState(B4S_CLIENTS);
  const [onboarding, setOnboarding] = React.useState(false);
  const [wsTab, setWsTab] = React.useState("overview");
  const [progId, setProgId] = React.useState(null);
  const [progTab, setProgTab] = React.useState("dashboard");

  const go = (p) => { setProgId(null); setPage(p); try { localStorage.setItem(LS, p); } catch {} requestAnimationFrame(() => { const m = document.querySelector("main"); if (m) m.scrollTop = 0; }); };
  const openClient = (id) => { setProgId(null); setClientId(id); setWsTab("overview"); go("client-detail"); };
  const openProgramme = (id) => { setProgId(id); setProgTab("dashboard"); requestAnimationFrame(() => { const m = document.querySelector("main"); if (m) m.scrollTop = 0; }); };
  // open a programme from the platform-wide list → resolve its client, enter client→programme
  const openProgFromList = (p) => {
    const c = clients.find(x => x.name === p.client || (x.name.indexOf("Larsen") === 0 && p.client === "L&T")) || clients[0];
    setClientId(c.id); setWsTab("overview"); setProgId(p.id); setProgTab("dashboard");
    setPage("client-detail"); try { localStorage.setItem(LS, "client-detail"); } catch {}
    requestAnimationFrame(() => { const m = document.querySelector("main"); if (m) m.scrollTop = 0; });
  };
  const selectWsTab = (t) => { setProgId(null); setWsTab(t); };
  // "Manage as admin" → hand off to the HR admin console for that client
  const manageAs = (client) => { setRole && setRole("Admin"); navigate && navigate("dashboard"); };
  const addClient = (c) => setClients(list => [c, ...list]);

  const client = clients.find(c => c.id === clientId) || clients[0];
  const inClient = page === "client-detail";
  const prog = progId ? B4S_PROGRAMMES.find(p => p.id === progId) : null;
  const inProgramme = inClient && !!prog;
  const crumbs = inProgramme
    ? [{ label: "Clients", onClick: () => go("clients") }, { label: client.name, onClick: () => setProgId(null) }, { label: prog.name, onClick: () => setProgTab("dashboard") }, { label: B4S_PROG_SUB_LABEL[progTab] || "Dashboard" }]
    : inClient ? [{ label: "Clients", onClick: () => go("clients") }, { label: client.name, onClick: () => selectWsTab("overview") }, { label: B4S_CLIENT_SUB_LABEL[wsTab] || "Overview" }] : undefined;

  let body;
  if (inProgramme) {
    body = <B4SProgrammeWorkspace prog={prog} client={client} progTab={progTab} setProgTab={setProgTab} />;
  } else switch (page) {
    case "dashboard": body = <B4SDashboard go={go} openClient={openClient} clients={clients} onOnboard={() => setOnboarding(true)} />; break;
    case "clients": body = <B4SClients openClient={openClient} clients={clients} onOnboard={() => setOnboarding(true)} />; break;
    case "client-detail": body = <B4SClientDetail clientId={clientId} clients={clients} wsTab={wsTab} setWsTab={setWsTab} openProgramme={openProgramme} onBack={() => go("clients")} />; break;
    case "programmes": body = <B4SProgrammes openProgFromList={openProgFromList} />; break;
    case "scholars": body = <B4SScholars />; break;
    case "disbursements": body = <B4SDisbursements />; break;
    case "analytics": body = <B4SAnalytics />; break;
    case "pool": body = <B4SPool />; break;
    default: body = <B4SDashboard go={go} openClient={openClient} clients={clients} onOnboard={() => setOnboarding(true)} />;
  }

  return (
    <ToastProvider>
      <B4SShell page={page} go={go} onLogout={onLogout} role={role} setRole={setRole} navigate={navigate} crumbs={crumbs}
        inClient={inClient} inProgramme={inProgramme} clientName={client.name} programmeName={prog ? prog.name : ""}
        wsTab={wsTab} setWsTab={selectWsTab} progTab={progTab} setProgTab={setProgTab}
        onExitClient={() => go("clients")} onExitProgramme={() => setProgId(null)}>{body}</B4SShell>
      <B4SOnboardClient open={onboarding} onClose={() => setOnboarding(false)} onDone={addClient} />
    </ToastProvider>
  );
}
window.B4SApp = B4SApp;
