import { useState } from "react"

interface Props {
  onBack: () => void
}

const CARD_BG = "#dce9d8"
const CARD_ALT = "#eaf2e6"

const tips = [
  {
    id: "bullying",
    emoji: "🚫",
    title: "O que é bullying?",
    body: "Bullying é quando alguém repete ações agressivas — palavras, gestos ou exclusão — contra outra pessoa que tem dificuldade de se defender. Não é brincadeira, é violência.",
  },
  {
    id: "cyber",
    emoji: "💻",
    title: "Cyberbullying",
    body: "Acontece pela internet: mensagens ofensivas, fotos sem autorização, exclusão de grupos ou perfis falsos. Se isso acontecer com você, guarde as provas (prints) e conte para um adulto de confiança.",
  },
  {
    id: "trusted",
    emoji: "🧑‍🤝‍🧑",
    title: "Fale com alguém de confiança",
    body: "Um familiar, professor, orientador ou amigo próximo pode ajudar. Você não precisa enfrentar isso sozinho(a). Guardar segredo sobre situações de violência não é obrigação sua.",
  },
  {
    id: "report",
    emoji: "📢",
    title: "Como denunciar com segurança",
    body: "Use o Disque Denúncia deste aplicativo. Você pode ser anônimo(a). Quanto mais detalhes você fornecer (data, local, o que aconteceu), mais a escola consegue agir.",
  },
  {
    id: "rights",
    emoji: "⚖️",
    title: "Seus direitos como estudante",
    body: "Todo aluno tem direito a um ambiente escolar seguro e respeitoso. A escola é obrigada por lei a investigar casos de violência e tomar medidas. Você pode exigir isso.",
  },
  {
    id: "react",
    emoji: "💪",
    title: "O que fazer na hora",
    body: "Tente manter a calma, afaste-se da situação se for seguro, não revide com violência e procure um adulto imediatamente. Documentar o que aconteceu também ajuda muito.",
  },
]

export default function SecurityHintsScreen({ onBack }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}
    >
      {/* Back */}
      <div className="px-5 pt-12 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#5a8a5e" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      {/* Header */}
      <div className="px-5 pt-3 pb-6">
        <h1 className="font-black text-2xl" style={{ color: "#1e1e1e" }}>
          Dicas de Segurança 🛡️
        </h1>
        <p className="text-sm mt-1" style={{ color: "#9ab09a" }}>
          Informação protege. Toque em cada card para ler mais.
        </p>
      </div>

      {/* Tips */}
      <div className="flex flex-col gap-3 px-5 pb-10">
        {tips.map((tip) => {
          const open = expanded === tip.id
          return (
            <button
              key={tip.id}
              onClick={() => setExpanded(open ? null : tip.id)}
              className="rounded-3xl text-left w-full transition-all active:opacity-80"
              style={{ background: open ? CARD_BG : CARD_ALT }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="text-3xl flex-shrink-0">{tip.emoji}</span>
                <span className="font-black text-sm flex-1 leading-snug" style={{ color: "#1e1e1e" }}>
                  {tip.title}
                </span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#9ab09a" strokeWidth="2.5" strokeLinecap="round"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {open && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: "#2a2a2a" }}>
                    {tip.body}
                  </p>
                </div>
              )}
            </button>
          )
        })}

        {/* Emergency note */}
        <div
          className="rounded-3xl px-5 py-4 mt-2 flex items-start gap-4"
          style={{ background: "#fff0e8", border: "1.5px solid #f5d9c8" }}
        >
          <span className="text-2xl flex-shrink-0">🆘</span>
          <div>
            <p className="font-black text-sm" style={{ color: "#c05a2a" }}>
              Em perigo imediato?
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#a06040" }}>
              Ligue <strong>190</strong> (Polícia) ou <strong>100</strong> (Direitos Humanos). Sua segurança vem primeiro.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
