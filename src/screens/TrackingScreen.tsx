interface Props {
  onBack: () => void
  onEmergency: () => void
}

const timeline = [
  { id: 1, label: "Submitted", date: "Jul 29, 2026 · 10:14 AM", done: true, note: "Your report was securely received." },
  { id: 2, label: "Received", date: "Jul 29, 2026 · 10:15 AM", done: true, note: "Assigned to the school safety coordinator." },
  { id: 3, label: "Under Review", date: "Jul 30, 2026 · 9:00 AM", done: true, note: "The coordinator is reviewing the details you provided." },
  { id: 4, label: "School Response", date: "Est. Aug 1, 2026", done: false, note: "Awaiting official response from Lakewood High School." },
  { id: 5, label: "Closed", date: "Pending", done: false, note: "Case will be closed once action is confirmed." },
]

const reports = [
  { id: "RPT-2024", type: "Verbal Abuse", date: "Jul 29", status: "Under Review", statusColor: "#4e8a5c" },
  { id: "RPT-2019", type: "Harassment", date: "Jun 12", status: "Closed", statusColor: "#a8a8a8" },
]

export default function TrackingScreen({ onBack, onEmergency }: Props) {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: "#faf8f4" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-5">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#f0f5f1" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4e8a5c" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="font-display text-xl" style={{ fontFamily: "'DM Serif Display',serif", color: "#242424" }}>Report Tracking</h1>
      </div>

      <div className="px-5 flex flex-col gap-5 pb-8">
        {/* Report selector */}
        <div className="flex flex-col gap-2">
          {reports.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-2xl p-4 border"
              style={{
                background: i === 0 ? "#ffffff" : "#faf8f4",
                borderColor: i === 0 ? "#dceae0" : "#f0ede8",
                boxShadow: i === 0 ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: i === 0 ? "#dceae0" : "#f0ede8" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#4e8a5c" : "#a8a8a8"} strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#242424" }}>{r.id}</p>
                  <p className="text-xs" style={{ color: "#a8a8a8" }}>{r.type} · {r.date}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${r.statusColor}18`, color: r.statusColor }}>{r.status}</span>
            </div>
          ))}
        </div>

        {/* Estimated time banner */}
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#f0f5f1", border: "1.5px solid #dceae0" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4e8a5c" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-sm" style={{ color: "#3d7049" }}>
            <strong>Estimated response:</strong> within 24–48 hours
          </p>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "#a8a8a8" }}>Timeline</h2>
          <div className="flex flex-col">
            {timeline.map((item, idx) => (
              <div key={item.id} className="flex gap-4">
                {/* Line + dot */}
                <div className="flex flex-col items-center w-5 flex-shrink-0">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: item.done ? "#4e8a5c" : "#f0ede8",
                      border: item.done ? "none" : "2px solid #d1d1d1",
                      zIndex: 1,
                    }}
                  >
                    {item.done && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 mt-1 mb-1" style={{ background: item.done ? "#b8d4bd" : "#e6dece", minHeight: 32 }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-5">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold" style={{ color: item.done ? "#242424" : "#a8a8a8" }}>{item.label}</p>
                    <p className="text-xs" style={{ color: "#a8a8a8" }}>{item.date}</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: item.done ? "#7a7a7a" : "#c0c0c0" }}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No response CTA */}
        <div className="rounded-2xl p-4 border" style={{ background: "#fff8f5", borderColor: "#f5d9c8" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#d97b4a" }}>School hasn"t responded?</p>
          <p className="text-xs mb-3" style={{ color: "#a8a8a8" }}>If the school doesn"t respond within the expected timeframe, you can escalate.</p>
          <button
            onClick={onEmergency}
            className="text-sm font-bold py-2 px-4 rounded-xl"
            style={{ background: "#d97b4a", color: "white" }}
          >
            View Escalation Options
          </button>
        </div>
      </div>
    </div>
  )
}
