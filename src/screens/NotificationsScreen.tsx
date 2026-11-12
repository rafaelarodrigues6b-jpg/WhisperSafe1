interface Props {
  onBack: () => void
  onTracking: () => void
}

const notifications = [
  {
    id: 1,
    icon: "✅",
    iconBg: "#f0f5f1",
    title: "Report Received",
    body: "Your report RPT-2024 has been received and assigned to Ms. Chen.",
    time: "2 hours ago",
    unread: true,
    action: "tracking",
  },
  {
    id: 2,
    icon: "📢",
    iconBg: "#fff8f5",
    title: "Safety Announcement",
    body: "New anti-bullying resources are now available in the Safety Center.",
    time: "5 hours ago",
    unread: true,
    action: null,
  },
  {
    id: 3,
    icon: "🏫",
    iconBg: "#f0f5f1",
    title: "Community Update",
    body: "Student Assembly scheduled for August 5th in the main auditorium.",
    time: "Yesterday",
    unread: false,
    action: null,
  },
  {
    id: 4,
    icon: "💬",
    iconBg: "#f0f5f1",
    title: "School Responded",
    body: "Lakewood High has responded to report RPT-2019. Tap to view details.",
    time: "Jun 14",
    unread: false,
    action: "tracking",
  },
  {
    id: 5,
    icon: "🔒",
    iconBg: "#f3efe7",
    title: "Privacy Reminder",
    body: "Your reports are end-to-end protected. Your identity remains secure.",
    time: "Jun 12",
    unread: false,
    action: null,
  },
]

export default function NotificationsScreen({ onBack, onTracking }: Props) {
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: "#faf8f4" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#f0f5f1" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4e8a5c" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="font-display text-xl" style={{ fontFamily: "'DM Serif Display',serif", color: "#242424" }}>Notifications</h1>
            {unreadCount > 0 && <p className="text-xs" style={{ color: "#4e8a5c" }}>{unreadCount} unread</p>}
          </div>
        </div>
        <button className="text-xs font-semibold" style={{ color: "#4e8a5c" }}>Mark all read</button>
      </div>

      <div className="flex flex-col px-5 gap-2 pb-8">
        {notifications.map((notif) => (
          <button
            key={notif.id}
            onClick={notif.action === "tracking" ? onTracking : undefined}
            className="flex items-start gap-4 rounded-2xl p-4 text-left w-full transition-all active:scale-98"
            style={{
              background: notif.unread ? "#ffffff" : "#faf8f4",
              border: notif.unread ? "1.5px solid #dceae0" : "1.5px solid #f0ede8",
              boxShadow: notif.unread ? "0 2px 12px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{ background: notif.iconBg }}
            >
              {notif.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-bold" style={{ color: "#242424" }}>{notif.title}</p>
                {notif.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#4e8a5c" }} />}
              </div>
              <p className="text-xs leading-relaxed mb-1" style={{ color: "#7a7a7a" }}>{notif.body}</p>
              <p className="text-xs" style={{ color: "#a8a8a8" }}>{notif.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
