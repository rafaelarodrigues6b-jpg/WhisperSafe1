interface Props {
  onBack: () => void
}

const contacts = [
  {
    id: "counselor",
    title: "School Counselor",
    name: "Ms. Elena Chen",
    detail: "Available Mon–Fri, 8am–4pm",
    action: "Call counselor",
    phone: "(555) 234-0011",
    color: "#4e8a5c",
    bg: "#f0f5f1",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4e8a5c" strokeWidth="2" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.92-.9a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
      </svg>
    ),
  },
  {
    id: "hotline",
    title: "Crisis Hotline",
    name: "National Youth Crisis Line",
    detail: "24/7 support — call or text",
    action: "Call now",
    phone: "1-800-442-HOPE",
    color: "#d97b4a",
    bg: "#fff0e8",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97b4a" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "police",
    title: "Local Authorities",
    name: "Non-emergency police line",
    detail: "For immediate physical danger call 911",
    action: "View contacts",
    phone: "(555) 867-5309",
    color: "#7a7a7a",
    bg: "#f8f8f8",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
]

const steps = [
  "Document the incident with dates, times, and witnesses",
  "Report to your school counselor or administrator",
  "Submit a report through WhisperSafe",
  "If no school response in 48h, contact your school district office",
  "Reach out to official government education oversight bodies",
  "If safety is at immediate risk, call 911",
]

export default function EmergencyScreen({ onBack }: Props) {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: "#faf8f4" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6" style={{ background: "linear-gradient(160deg,#8b3a1a,#c05a2a,#d97b4a)" }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="font-display text-xl text-white" style={{ fontFamily: "'DM Serif Display',serif" }}>Emergency Support</h1>
            <p className="text-white/70 text-xs">You are not alone. Help is available.</p>
          </div>
        </div>
        <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <p className="text-white text-xs font-semibold leading-relaxed">
            If you are in immediate danger, <strong>call 911</strong> or go to the nearest safe adult.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 py-5 pb-8">
        {/* Emergency contacts */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a8a8a8" }}>Emergency Contacts</h2>
          <div className="flex flex-col gap-3">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-2xl p-4" style={{ background: "#ffffff", border: "1.5px solid #f0ede8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.color }}>{c.title}</p>
                    <p className="text-sm font-bold" style={{ color: "#242424" }}>{c.name}</p>
                    <p className="text-xs" style={{ color: "#a8a8a8" }}>{c.detail}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "#525252" }}>{c.phone}</span>
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background: c.color }}
                  >
                    {c.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation steps */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a8a8a8" }}>Escalation Steps</h2>
          <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1.5px solid #f0ede8" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "#242424" }}>If your school has not responded:</p>
            <div className="flex flex-col gap-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5"
                    style={{ background: i < 3 ? "#4e8a5c" : i < 5 ? "#c4a84f" : "#d97b4a" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
