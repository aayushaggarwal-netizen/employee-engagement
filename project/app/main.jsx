// ── App root: routing, auth, role switcher, view toggle ──
const { useState, useEffect } = React;
const LS = "eg_state_v1";

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; }
}

function App() {
  const saved = loadState();
  const [authed, setAuthed] = useState(saved.authed || false);
  const [route, setRoute] = useState(saved.route || "programs");
  const [role, setRole] = useState(saved.role || "Employee");
  const viewMode = "desktop";

  useEffect(() => {
    localStorage.setItem(LS, JSON.stringify({ authed, route, role }));
  }, [authed, route, role]);

  const navigate = (r) => { setRoute(r); };
  const openProgram = (detail) => { window.setActiveProgram(detail); setRoute("program"); };
  const mobile = viewMode === "mobile";
  const logout = () => { setAuthed(false); setRoute("programs"); setRole("Employee"); };

  let content;
  if (!authed) {
    content = <Login onAuthed={(chosenRole) => {
      const r = chosenRole || "Employee";
      setRole(r);
      setAuthed(true);
      setRoute(r === "Admin" ? "dashboard" : "programs");
    }} />;
  } else if (role === "Admin") {
    return <AdminApp onLogout={logout} role={role} setRole={setRole} navigate={navigate} />;
  } else if (role === "B4S") {
    return <B4SApp onLogout={logout} role={role} setRole={setRole} navigate={navigate} />;
  } else if (role !== "Employee") {
    content = <Shell route={route} navigate={navigate} onLogout={logout} role={role} setRole={setRole}><RoleStub role={role} navigate={(r) => { setRole("Employee"); navigate(r); }} /></Shell>;
  } else {
    const page = {
      programs: <ProgramsBrowse navigate={navigate} openProgram={openProgram} />,
      program: <Program navigate={navigate} />,
      donate: <Donate navigate={navigate} mobile={mobile} />,
      nominate: <Nominate navigate={navigate} />,
      "my-donations": <MyDonations navigate={navigate} mobile={mobile} />,
      "my-nominations": <MyNominations navigate={navigate} />,
      "my-scholars": <MyScholars navigate={navigate} />,
      profile: <MyProfile navigate={navigate} />,
    }[route] || <ProgramsBrowse navigate={navigate} openProgram={openProgram} />;
    content = <Shell route={route} navigate={navigate} onLogout={logout} role={role} setRole={setRole}>{page}</Shell>;
  }

  return content;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
