import type { UserData } from "../App"
import BrandLogo from "../components/BrandLogo"

const CARD_BG = "#dce9d8"
const CARD_ALT = "#eaf2e6"
const AVATAR_BG = "#8aad84"

interface Props {
  user: UserData
  onCommunity: () => void
  onReport: () => void
  onSecurity: () => void
  onStatus: () => void
  onSupport: () => void
  onSettings: () => void
}

const emptyUser: UserData = { nome: "", cpf: "", escola: "", gmail: "", senha: "" }

function Card({
  emoji,
  title,
  subtitle,
  onClick,
  bg = CARD_BG,
}: {
  emoji: string
  title: string
  subtitle: string
  onClick?: () => void
  bg?: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start rounded-3xl px-5 py-5 text-left w-full transition-all active:opacity-75"
      style={{ background: bg, border: "none" }}
    >
      <span className="text-3xl mb-3">{emoji}</span>
      <span className="font-black text-base leading-snug" style={{ color: "#1e1e1e" }}>
        {title}
      </span>
      <span className="text-xs mt-1 leading-relaxed" style={{ color: "#5a8a5e" }}>
        {subtitle}
      </span>
    </button>
  )
}

export default function HomeScreen({
  user = emptyUser,
  onCommunity,
  onReport,
  onSecurity,
  onStatus,
  onSupport,
  onSettings,
}: Props) {
  const displayName = user?.nome?.trim() || user?.gmail?.split("@")[0] || "Estudante"
  const inicial = displayName[0]?.toUpperCase() ?? "E"
  const escolaNome = user?.escola?.trim() || ""

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return (
    <div
      className="flex flex-col min-h-screen px-5"
      style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}
    >
      {/* Header: greeting + clickable avatar */}
      <div className="flex items-center justify-between pt-14 pb-5">
        <div>
          <div className="mb-2">
            <BrandLogo size="sm" imageClassName="rounded-xl" />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#9ab09a" }}>
            {greeting},
          </p>
          <h1 className="font-black text-2xl leading-tight" style={{ color: "#1e1e1e" }}>
            {displayName} 👋
          </h1>
        </div>

        {/* Avatar — opens profile/settings */}
        <button
          onClick={onSettings}
          aria-label="Abrir perfil"
          className="flex items-center justify-center font-black text-white text-lg flex-shrink-0 transition-all active:opacity-75"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: AVATAR_BG,
            border: "none",
            fontFamily: "'Nunito',sans-serif",
          }}
        >
          {inicial}
        </button>
      </div>

      {/* School tag — only shown when escola is filled */}
      {escolaNome ? (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6"
          style={{ background: CARD_ALT }}
        >
          <span className="text-xl flex-shrink-0">🏫</span>
          <div className="min-w-0">
            <p className="text-sm font-black truncate" style={{ color: "#1e1e1e" }}>
              {escolaNome}
            </p>
            <p className="text-xs" style={{ color: "#5a8a5e" }}>
              1 denúncia em análise · Resposta em até 48h
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6" />
      )}

      {/* Main action */}
      <button
        onClick={onReport}
        className="flex items-center gap-4 rounded-3xl px-5 py-5 mb-4 w-full text-left active:opacity-75"
        style={{ background: CARD_BG, border: "none" }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.55)" }}
        >
          📢
        </div>
        <div>
          <p className="font-black text-base" style={{ color: "#1e1e1e" }}>
            Fazer uma denúncia
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#5a8a5e" }}>
            Anônima e segura · Disque denúncia
          </p>
        </div>
        <svg
          className="ml-auto flex-shrink-0"
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="#9ab09a" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card emoji="📋" title="Status da denúncia" subtitle="Acompanhe seus registros" onClick={onStatus} bg={CARD_ALT} />
        <Card emoji="👥" title="Comunidade" subtitle="Veja o que a escola compartilhou" onClick={onCommunity} bg={CARD_ALT} />
        <Card emoji="🛡️" title="Dicas de segurança" subtitle="Aprenda a se proteger" onClick={onSecurity} bg={CARD_ALT} />
        <Card emoji="🤝" title="Apoio emocional" subtitle="Fale com um orientador" onClick={onSupport} bg={CARD_ALT} />
      </div>

      {/* Banner */}
      <div className="rounded-3xl px-5 py-4 mb-6 flex items-center gap-4" style={{ background: CARD_BG }}>
        <span className="text-3xl">💚</span>
        <div>
          <p className="font-black text-sm" style={{ color: "#1e1e1e" }}>Você não está sozinho(a)</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#5a8a5e" }}>
            Cada denúncia ajuda a tornar a escola mais segura para todos.
          </p>
        </div>
      </div>
    </div>
  )
}
