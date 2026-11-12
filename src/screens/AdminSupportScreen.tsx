import type { AdminId, CounselorConversation } from "../App"
import { ADMIN_ACCOUNTS } from "../App"

interface Props {
  adminId: AdminId
  conversations: CounselorConversation[]
  onSelect: (id: string) => void
  onBack: () => void
}

const CARD_ALT = "#eaf2e6"
const CARD_BG = "#dce9d8"

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return "agora"
    if (diffMin < 60) return `há ${diffMin} min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `há ${diffH}h`
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  } catch {
    return ""
  }
}

export default function AdminSupportScreen({ adminId, conversations, onSelect, onBack }: Props) {
  const admin = ADMIN_ACCOUNTS.find((a) => a.id === adminId)!
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadByCounselor, 0)

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f8faf8", fontFamily: "'Nunito',sans-serif" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "#2a3a2c" }}>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white">Apoio ao Estudante</h1>
              {totalUnread > 0 && (
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: "#c05a2a", color: "white" }}
                >
                  {totalUnread}
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: "#9ab09a" }}>
              {admin.nome} · Conversas com estudantes
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 pb-10">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">💬</span>
            <p className="font-black text-base" style={{ color: "#1e1e1e" }}>Nenhuma conversa ainda</p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: "#9ab09a" }}>
              Quando um estudante iniciar uma conversa com você, ela aparecerá aqui.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9ab09a" }}>
              {conversations.length} conversa{conversations.length !== 1 ? "s" : ""}
            </p>
            {conversations
              .slice()
              .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
              .map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1]
                const hasUnread = conv.unreadByCounselor > 0
                return (
                  <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className="w-full flex items-center gap-4 rounded-3xl px-5 py-4 text-left active:opacity-80 transition-all"
                    style={{
                      background: hasUnread ? CARD_BG : "#ffffff",
                      border: hasUnread ? "2px solid #a8c8a0" : "1.5px solid #e8ede6",
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="flex items-center justify-center font-black text-white"
                        style={{ width: 46, height: 46, borderRadius: "50%", background: "#8aad84", fontSize: 18 }}
                      >
                        {conv.studentName[0]?.toUpperCase() ?? "E"}
                      </div>
                      {hasUnread && (
                        <div
                          className="absolute -top-1 -right-1 rounded-full border-2 border-white flex items-center justify-center text-white font-black"
                          style={{ width: 20, height: 20, background: "#c05a2a", fontSize: 10 }}
                        >
                          {conv.unreadByCounselor}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-black text-sm truncate" style={{ color: "#1e1e1e" }}>
                          {conv.studentName}
                        </p>
                        <span className="text-xs flex-shrink-0 ml-2" style={{ color: "#9ab09a" }}>
                          {formatTime(conv.lastUpdated)}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#9ab09a" }}>{conv.studentEscola || "Escola não informada"}</p>
                      {lastMsg && (
                        <p
                          className="text-xs mt-1 truncate"
                          style={{ color: hasUnread ? "#2a2a2a" : "#9ab09a", fontWeight: hasUnread ? 700 : 400 }}
                        >
                          {lastMsg.senderType === "student" ? "" : "Você: "}
                          {lastMsg.text}
                        </p>
                      )}
                    </div>

                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ab09a" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              })}
          </>
        )}

        {/* Info note */}
        <div className="rounded-3xl px-5 py-4 flex items-start gap-3 mt-2" style={{ background: CARD_ALT }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a8a5e" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "#5a8a5e" }}>
            Estas conversas são privadas. Somente você e o estudante têm acesso ao conteúdo da conversa.
          </p>
        </div>
      </div>
    </div>
  )
}
