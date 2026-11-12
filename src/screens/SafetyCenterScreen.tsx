import { useState } from "react"

interface Props {
  onBack: () => void
  onEmergency: () => void
}

const articles = [
  {
    id: "bullying",
    emoji: "🚫",
    category: "Bullying",
    title: "What is bullying and how to recognize it",
    preview: "Bullying is repeated aggressive behavior that involves a power imbalance. Learn the warning signs and how to protect yourself or others.",
    readTime: "3 min read",
    color: "#4e8a5c",
    bg: "#f0f5f1",
  },
  {
    id: "cyber",
    emoji: "💻",
    category: "Cyberbullying",
    title: "Staying safe online and reporting digital harassment",
    preview: "Cyberbullying happens on social media, messaging apps, and gaming platforms. Know your rights and what steps to take.",
    readTime: "4 min read",
    color: "#6aa076",
    bg: "#f0f5f1",
  },
  {
    id: "emotional",
    emoji: "💛",
    category: "Emotional Abuse",
    title: "Recognizing emotional and verbal abuse at school",
    preview: "Emotional abuse can be subtle — name-calling, humiliation, or exclusion. Your feelings are valid. Here is how to seek help.",
    readTime: "5 min read",
    color: "#c4a84f",
    bg: "#fdf7e8",
  },
  {
    id: "rights",
    emoji: "⚖️",
    category: "Student Rights",
    title: "Your rights as a student in school",
    preview: "Every student has the right to a safe, inclusive learning environment. Learn about laws and protections that apply to you.",
    readTime: "6 min read",
    color: "#7a7a7a",
    bg: "#f8f8f8",
  },
  {
    id: "help",
    emoji: "🤝",
    category: "How to Seek Help",
    title: "Steps to take when you need support",
    preview: "From talking to a trusted adult to submitting a formal report — here are clear, practical steps you can take today.",
    readTime: "3 min read",
    color: "#4e8a5c",
    bg: "#f0f5f1",
  },
]

export default function SafetyCenterScreen({ onBack, onEmergency }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: "#faf8f4" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6" style={{ background: "linear-gradient(160deg,#3d7049,#4e8a5c 70%,#6aa076)" }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="font-display text-xl text-white" style={{ fontFamily: "'DM Serif Display',serif" }}>Safety Center</h1>
            <p className="text-white/60 text-xs">Educational resources for every student</p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden h-32 relative">
          <img
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=200&fit=crop&auto=format"
            alt="Students in a safe school environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "rgba(61,112,73,0.5)" }} />
          <div className="absolute inset-0 flex items-center pl-4">
            <p className="text-white font-bold text-sm max-w-[180px] leading-snug font-display" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16 }}>
              Knowledge is your first line of defense.
            </p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="flex flex-col gap-3 px-5 py-5 pb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#a8a8a8" }}>Educational Resources</h2>
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => setExpanded(expanded === article.id ? null : article.id)}
            className="rounded-2xl overflow-hidden text-left w-full transition-all"
            style={{ background: "#ffffff", border: "1.5px solid #f0ede8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-start gap-4 p-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: article.bg }}>
                {article.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold" style={{ color: article.color }}>{article.category}</span>
                <p className="text-sm font-bold mt-0.5 leading-snug" style={{ color: "#242424" }}>{article.title}</p>
                <p className="text-xs mt-1" style={{ color: "#a8a8a8" }}>{article.readTime}</p>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round"
                className="flex-shrink-0 mt-1 transition-transform"
                style={{ transform: expanded === article.id ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {expanded === article.id && (
              <div className="px-4 pb-4 animate-fade-in">
                <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{article.preview}</p>
                <button className="mt-3 text-sm font-bold" style={{ color: article.color }}>Read full article →</button>
              </div>
            )}
          </button>
        ))}

        {/* Emergency link */}
        <button
          onClick={onEmergency}
          className="flex items-center justify-between rounded-2xl p-4 mt-2"
          style={{ background: "#fff0e8", border: "1.5px solid #f5d9c8" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#f5d9c8" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97b4a" strokeWidth="2" strokeLinecap="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#d97b4a" }}>Need immediate help?</p>
              <p className="text-xs" style={{ color: "#a8a8a8" }}>View emergency contacts & escalation</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97b4a" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
