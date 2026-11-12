import { useState } from "react"

interface Props {
  onBack: () => void
  onLogout: () => void
}

export default function ProfileScreen({ onBack, onLogout }: Props) {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0 rounded-full transition-all"
      style={{ width: 48, height: 26, background: value ? "#4e8a5c" : "#d1d1d1" }}
    >
      <span
        className="absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow transition-all"
        style={{ left: value ? 26 : 4, width: 18, height: 18 }}
      />
    </button>
  )

  const reportHistory = [
    { id: "RPT-2024", type: "Verbal Abuse", date: "Jul 29, 2026", status: "Under Review", color: "#4e8a5c" },
    { id: "RPT-2019", type: "Harassment", date: "Jun 12, 2026", status: "Closed", color: "#a8a8a8" },
    { id: "RPT-2014", type: "Bullying", date: "Apr 3, 2026", status: "Closed", color: "#a8a8a8" },
  ]

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: "#faf8f4" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-5">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#f0f5f1" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4e8a5c" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="font-display text-xl" style={{ fontFamily: "'DM Serif Display',serif", color: "#242424" }}>Profile</h1>
      </div>

      <div className="flex flex-col gap-5 px-5 pb-10">
        {/* Student card */}
        <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg,#3d7049,#4e8a5c)", boxShadow: "0 8px 24px rgba(61,112,73,0.25)" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop&auto=format"
                alt="Student profile photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-white font-display text-lg" style={{ fontFamily: "'DM Serif Display',serif" }}>Jordan Rivera</p>
              <p className="text-white/70 text-xs mt-0.5">jordan.rivera@lakewood.edu</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                  🏫 Lakewood High
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                  Grade 10
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-white/70 text-xs">Identity verified · Privacy protected</p>
          </div>
        </div>

        {/* Report history */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a8a8a8" }}>Report History</h2>
          <div className="flex flex-col gap-2">
            {reportHistory.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-2xl p-4" style={{ background: "#ffffff", border: "1.5px solid #f0ede8" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f0f5f1" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4e8a5c" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#242424" }}>{r.id}</p>
                    <p className="text-xs" style={{ color: "#a8a8a8" }}>{r.type} · {r.date}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${r.color}18`, color: r.color }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy settings */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a8a8a8" }}>Privacy & Notifications</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1.5px solid #f0ede8" }}>
            {[
              { label: "Push Notifications", desc: "Receive updates about your reports", value: notifications, onChange: setNotifications },
              { label: "Email Alerts", desc: "Get updates in your inbox", value: emailAlerts, onChange: setEmailAlerts },
              { label: "Anonymous Data Sharing", desc: "Help improve school safety research", value: dataSharing, onChange: setDataSharing },
            ].map((setting, i, arr) => (
              <div
                key={setting.label}
                className="flex items-center justify-between px-4 py-4"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid #f0ede8" : "none" }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#242424" }}>{setting.label}</p>
                  <p className="text-xs" style={{ color: "#a8a8a8" }}>{setting.desc}</p>
                </div>
                <Toggle value={setting.value} onChange={setting.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1.5px solid #f0ede8" }}>
          {["Privacy Policy", "Terms of Service", "Help & Support"].map((item, i, arr) => (
            <button
              key={item}
              className="flex items-center justify-between w-full px-4 py-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #f0ede8" : "none" }}
            >
              <span className="text-sm font-semibold" style={{ color: "#242424" }}>{item}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-4 rounded-2xl font-bold text-sm border transition-all active:scale-95"
          style={{ background: "transparent", borderColor: "#f5d9c8", color: "#d97b4a" }}
        >
          Sign Out
        </button>

        <p className="text-center text-xs" style={{ color: "#c0c0c0" }}>WhisperSafe v2.4.1 · © 2026 WhisperSafe Inc.</p>
      </div>
    </div>
  )
}
