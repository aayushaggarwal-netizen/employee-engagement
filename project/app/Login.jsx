// ── Login: choose role → email → OTP (mock) ──
function Login({ onAuthed }) {
  const [role, setRole] = React.useState(null);      // "Employee" | "Admin"
  const [step, setStep] = React.useState("role");     // role | email | otp
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const [error, setError] = React.useState("");
  const refs = [React.useRef(), React.useRef(), React.useRef(), React.useRef()];

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  function chooseRole(r) {
    setRole(r);
    setEmail(r === "B4S" ? "aditi@buddy4study.com" : r === "Admin" ? "sana.verma@infosys.com" : "rohan.mehta@infosys.com");
    setError("");
    setStep("email");
  }
  function sendOtp(e) {
    e.preventDefault();
    if (!validEmail) { setError("Enter a valid work email address."); return; }
    setError("");
    setStep("otp");
    setTimeout(() => refs[0].current && refs[0].current.focus(), 60);
  }
  function setDigit(i, v) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 3) refs[i + 1].current.focus();
  }
  function onKey(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs[i - 1].current.focus();
  }
  function verify(e) {
    e.preventDefault();
    if (otp.join("").length < 4) { setError("Enter the 4-digit code."); return; }
    onAuthed(role);
  }

  const roleMeta = {
    Employee: { icon: "heart", title: "Employee", desc: "Donate, nominate a student, and track your impact." },
    Admin: { icon: "sliders", title: "HR admin", desc: "Set up programmes, onboard employees, and drive the campaign." },
    B4S: { icon: "shield", title: "B4S platform admin", desc: "Manage every client org, programmes, and the verified pool." },
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-[420px] animate-fade-in">
        {/* brand */}
        <div className="flex flex-col items-center mb-8">
          <img src="assets/b4s-foundation-logo.png" alt="Buddy4Study India Foundation" className="h-9 w-auto object-contain mb-4" />
          <Badge tone="foreground" className="gap-1.5"><Icon name="building" size={12} />Infosys Foundation · Bright Futures 2025</Badge>
        </div>

        <Card className="p-7">
          {/* STEP 1 — choose role */}
          {step === "role" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <h1 className="text-group-title">How are you signing in?</h1>
                <p className="text-body text-muted-foreground">Choose how you'd like to use the platform.</p>
              </div>
              <div className="space-y-3">
                {["Employee", "Admin", "B4S"].map(r => {
                  const m = roleMeta[r];
                  return (
                    <button key={r} onClick={() => chooseRole(r)}
                      className="group w-full text-left rounded-xl border border-border bg-surface p-4 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/[0.03] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      <IconTile name={m.icon} size={44} tone="primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-card-title">{m.title}</p>
                        <p className="text-helper mt-0.5">{m.desc}</p>
                      </div>
                      <Icon name="arrowRight" size={18} className="text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                    </button>
                  );
                })}
              </div>
              <p className="text-helper text-center">Powered by Buddy4Study · Your data is private and secure.</p>
            </div>
          )}

          {/* STEP 2 — email */}
          {step === "email" && (
            <form onSubmit={sendOtp} className="space-y-5 animate-fade-in">
              <button type="button" onClick={() => { setStep("role"); setError(""); }}
                className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="arrowLeft" size={14} />Back
              </button>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-group-title">Sign in as {role.toLowerCase()}</h1>
                  <Badge tone="info" className="gap-1"><Icon name={roleMeta[role].icon} size={11} />{role}</Badge>
                </div>
                <p className="text-body text-muted-foreground">Use your work email. We'll send a one-time code to verify it's you.</p>
              </div>
              <Field label="Work email" htmlFor="email">
                <Input id="email" type="email" value={email} placeholder="you@infosys.com"
                  onChange={(e) => { setEmail(e.target.value); setError(""); }} />
              </Field>
              {error && <p className="text-[13px] text-destructive flex items-center gap-1.5"><Icon name="info" size={14} />{error}</p>}
              <Button size="lg" className="w-full" type="submit">Continue<Icon name="arrowRight" size={16} /></Button>
              <p className="text-helper text-center">Powered by Buddy4Study · Your data is private and secure.</p>
            </form>
          )}

          {/* STEP 3 — OTP */}
          {step === "otp" && (
            <form onSubmit={verify} className="space-y-5 animate-fade-in">
              <button type="button" onClick={() => { setStep("email"); setError(""); }}
                className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="arrowLeft" size={14} />Back
              </button>
              <div className="space-y-1.5">
                <h1 className="text-group-title">Enter the code</h1>
                <p className="text-body text-muted-foreground">We sent a 4-digit code to <span className="font-medium text-foreground">{email}</span>.</p>
              </div>
              <div className="flex gap-3 justify-center py-1">
                {otp.map((d, i) => (
                  <input key={i} ref={refs[i]} value={d} inputMode="numeric" maxLength={1}
                    onChange={(e) => { setDigit(i, e.target.value); setError(""); }}
                    onKeyDown={(e) => onKey(i, e)}
                    className="h-14 w-14 text-center text-[22px] font-semibold rounded-md border border-input bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
                ))}
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Code: any 4 digits (demo)</span>
                <button type="button" className="text-primary font-medium hover:underline">Resend code</button>
              </div>
              {error && <p className="text-[13px] text-destructive flex items-center gap-1.5"><Icon name="info" size={14} />{error}</p>}
              <Button size="lg" className="w-full" type="submit">Verify &amp; continue<Icon name="arrowRight" size={16} /></Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
window.Login = Login;
