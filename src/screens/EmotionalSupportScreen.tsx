import { useState } from "react"
import type { AdminId, CounselorAvailability } from "../App"
import { ADMIN_ACCOUNTS } from "../App"

interface Props {
  onBack: () => void
  counselorAvailability: CounselorAvailability
  onSelectCounselor: (id: AdminId) => void
}

const CARD_BG = "#dce9d8"
const CARD_ALT = "#eaf2e6"
const AVATAR_BG = "#8aad84"

const affirmations = [
  "Você é importante. 💚",
  "Pedir ajuda é um ato de coragem.",
  "Seus sentimentos são válidos.",
  "Esta fase vai passar. Você não está sozinho(a).",
  "Existe apoio. Existe saída. Existe esperança.",
]

const resources = [
  {
    emoji: "📞",
    title: "CVV — Centro de Valorização da Vida",
    desc: "Apoio emocional 24h por dia, 7 dias por semana.",
    contact: "188",
    type: "Ligue",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Conselho Tutelar",
    desc: "Protege os direitos de crianças e adolescentes.",
    contact: "Disque 100",
    type: "Ligue",
  },
]

function initial(name: string) {
  return name.trim()[0]?.toUpperCase() ?? "?"
}

export default function EmotionalSupportScreen({
  onBack,
  counselorAvailability,
  onSelectCounselor,
}: Props) {
  const [msgIdx, setMsgIdx] = useState(0)

  const availableCounselors = ADMIN_ACCOUNTS.filter((a) => counselorAvailability[a.id])
  const unavailableCounselors = ADMIN_ACCOUNTS.filter((a) => !counselorAvailability[a.id])
  const hasAnyAvailable = availableCounselors.length > 0

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}>
      {/* Back */}
      <div className="px-5 pt-12 pb-1">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "#5a8a5e" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      {/* Header */}
      <div className="px-5 pt-3 pb-5">
        <h1 className="font-black text-2xl" style={{ color: "#1e1e1e" }}>Apoio Emocional 🤝</h1>
        <p className="text-sm mt-1" style={{ color: "#9ab09a" }}>Você não precisa passar por isso sozinho(a).</p>
      </div>

      <div className="flex flex-col gap-5 px-5 pb-10">
        {/* Affirmation */}
        <button
          onClick={() => setMsgIdx((i) => (i + 1) % affirmations.length)}
          className="rounded-3xl px-6 py-6 text-center w-full active:opacity-80 transition-all"
          style={{ background: CARD_BG }}
        >
          <p className="font-black text-lg leading-snug" style={{ color: "#1e1e1e" }}>{affirmations[msgIdx]}</p>
          <p className="text-xs mt-3" style={{ color: "#9ab09a" }}>Toque para ver outra mensagem</p>
        </button>

        {/* Human counselor section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-base" style={{ color: "#1e1e1e" }}>Fale com um orientador</h2>
            {hasAnyAvailable && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#dce9d8", color: "#5a8a5e" }}>
                {availableCounselors.length} disponível{availableCounselors.length > 1 ? "is" : ""}
              </span>
            )}
          </div>
          <p className="text-xs mb-3" style={{ color: "#9ab09a" }}>
            Converse em tempo real com um orientador da escola.
          </p>

          {/* Available counselors */}
          {availableCounselors.map((counselor) => (
            <button
              key={counselor.id}
              onClick={() => onSelectCounselor(counselor.id)}
              className="w-full flex items-center gap-4 rounded-3xl px-5 py-4 mb-3 text-left active:opacity-80 transition-all"
              style={{ background: CARD_BG, border: "2px solid #b8d4b2" }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center justify-center font-black text-white"
                  style={{ width: 48, height: 48, borderRadius: "50%", background: AVATAR_BG, fontSize: 20 }}
                >
                  {initial(counselor.nome)}
                </div>
                {/* Online dot */}
                <div
                  className="absolute bottom-0 right-0 rounded-full border-2 border-white"
                  style={{ width: 14, height: 14, background: "#4caf50" }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-sm" style={{ color: "#1e1e1e" }}>{counselor.nome}</p>
                <p className="text-xs" style={{ color: "#5a8a5e" }}>{counselor.role}</p>
                <p className="text-xs mt-0.5 font-bold" style={{ color: "#5a8a5e" }}>● Disponível agora</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl flex-shrink-0" style={{ background: "#5a8a5e" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs font-black text-white">Conversar</span>
              </div>
            </button>
          ))}

          {/* Unavailable counselors */}
          {unavailableCounselors.map((counselor) => (
            <div
              key={counselor.id}
              className="flex items-center gap-4 rounded-3xl px-5 py-4 mb-3 opacity-60"
              style={{ background: "#f5f5f5", border: "1.5px solid #e8e8e8" }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center justify-center font-black text-white"
                  style={{ width: 48, height: 48, borderRadius: "50%", background: "#b0b0b0", fontSize: 20 }}
                >
                  {initial(counselor.nome)}
                </div>
                <div
                  className="absolute bottom-0 right-0 rounded-full border-2 border-white"
                  style={{ width: 14, height: 14, background: "#bdbdbd" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm" style={{ color: "#555" }}>{counselor.nome}</p>
                <p className="text-xs" style={{ color: "#888" }}>{counselor.role}</p>
                <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>● Indisponível no momento</p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-2xl flex-shrink-0" style={{ background: "#e8e8e8", color: "#aaa" }}>
                Ausente
              </span>
            </div>
          ))}

          {!hasAnyAvailable && (
            <div className="rounded-3xl px-5 py-4 mb-3" style={{ background: "#fff8f0", border: "1.5px solid #f5d9c8" }}>
              <p className="font-black text-sm" style={{ color: "#c05a2a" }}>Nenhum orientador disponível agora</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "#a06040" }}>
                Todos os orientadores estão ausentes no momento. Você pode deixar uma mensagem e um orientador responderá assim que possível, ou usar os recursos abaixo.
              </p>
            </div>
          )}
        </div>

        {/* External resources */}
        <div>
          <h2 className="font-black text-base mb-3" style={{ color: "#1e1e1e" }}>Recursos externos</h2>
          <div className="flex flex-col gap-3">
            {resources.map((r) => (
              <div key={r.title} className="flex items-start gap-4 rounded-3xl px-5 py-4" style={{ background: CARD_ALT }}>
                <span className="text-2xl flex-shrink-0">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm leading-snug" style={{ color: "#1e1e1e" }}>{r.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#9ab09a" }}>{r.desc}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-bold" style={{ color: "#9ab09a" }}>{r.type}</p>
                  <p className="font-black text-sm" style={{ color: "#5a8a5e" }}>{r.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl px-5 py-4 flex items-center gap-4" style={{ background: CARD_BG }}>
          <span className="text-3xl">💚</span>
          <p className="text-sm leading-relaxed" style={{ color: "#2a2a2a" }}>
            Buscar ajuda é um sinal de força, não de fraqueza. Estamos aqui por você.
          </p>
        </div>
      </div>
    </div>
  )
}
