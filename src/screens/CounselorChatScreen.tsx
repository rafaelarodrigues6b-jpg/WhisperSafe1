import { useState, useEffect, useRef } from "react"
import type { UserData, AdminId, CounselorConversation } from "../App"
import { ADMIN_ACCOUNTS } from "../App"

interface Props {
  user: UserData
  counselorId: AdminId
  conversation: CounselorConversation | null
  onSend: (text: string) => void
  onBack: () => void
}

const CARD_BG = "#dce9d8"
const AVATAR_BG = "#8aad84"
const INPUT_BG = "#c2d4bc"

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

function CounselorAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center font-black text-white flex-shrink-0"
      style={{ width: 32, height: 32, borderRadius: "50%", background: AVATAR_BG, fontSize: 13 }}
    >
      {name[0]?.toUpperCase() ?? "O"}
    </div>
  )
}

export default function CounselorChatScreen({ user, counselorId, conversation, onSend, onBack }: Props) {
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const counselor = ADMIN_ACCOUNTS.find((a) => a.id === counselorId)!
  const messages = conversation?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
  }

  const displayName = user?.nome?.trim() || user?.gmail?.split("@")[0] || "Você"

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-1">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "#5a8a5e" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      {/* Counselor info bar */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-4">
        <div className="relative flex-shrink-0">
          <div
            className="flex items-center justify-center font-black text-white"
            style={{ width: 44, height: 44, borderRadius: "50%", background: AVATAR_BG, fontSize: 18 }}
          >
            {counselor.nome[0]?.toUpperCase()}
          </div>
          <div
            className="absolute bottom-0 right-0 rounded-full border-2 border-white"
            style={{ width: 12, height: 12, background: "#4caf50" }}
          />
        </div>
        <div>
          <h1 className="font-black text-base leading-tight" style={{ color: "#1e1e1e" }}>{counselor.nome}</h1>
          <p className="text-xs" style={{ color: "#9ab09a" }}>{counselor.role} · Conversa privada e segura</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50" }} />
          <span className="text-xs font-bold" style={{ color: "#5a8a5e" }}>Online</span>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 mx-5 mb-4 rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto"
        style={{ background: CARD_BG, minHeight: 300 }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
            <span className="text-4xl mb-3">💚</span>
            <p className="font-black text-sm" style={{ color: "#1e1e1e" }}>Início da conversa</p>
            <p className="text-xs mt-1 leading-relaxed px-4" style={{ color: "#9ab09a" }}>
              Sua conversa com {counselor.nome.split(" ")[0]} é privada e segura. Pode começar quando quiser.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isStudent = msg.senderType === "student"
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isStudent ? "justify-end" : "justify-start"}`}>
                {!isStudent && <CounselorAvatar name={msg.senderName} />}
                <div className="flex flex-col max-w-[78%]">
                  {!isStudent && (
                    <span className="text-xs mb-1 ml-1" style={{ color: "#9ab09a" }}>{msg.senderName.split(" ")[0]}</span>
                  )}
                  <div
                    className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: isStudent ? "#a8c0a2" : "rgba(255,255,255,0.8)",
                      color: "#1e1e1e",
                      borderRadius: 16,
                      borderBottomRightRadius: isStudent ? 4 : 16,
                      borderBottomLeftRadius: !isStudent ? 4 : 16,
                    }}
                  >
                    {msg.text}
                  </div>
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: "#9ab09a", alignSelf: isStudent ? "flex-end" : "flex-start", marginLeft: isStudent ? 0 : 4 }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Privacy note */}
      <div className="mx-5 mb-3 flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ab09a" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-xs" style={{ color: "#9ab09a" }}>
          Conversa privada · somente você e o orientador têm acesso
        </p>
      </div>

      {/* Input */}
      <div className="px-5 pb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-5 py-3 text-sm outline-none"
          style={{
            background: INPUT_BG,
            borderRadius: 999,
            color: "#1e1e1e",
            border: "none",
            fontFamily: "'Nunito',sans-serif",
          }}
        />
        <button
          onClick={handleSend}
          style={{ width: 44, height: 44, borderRadius: "50%", background: AVATAR_BG, border: "none", flexShrink: 0 }}
          className="flex items-center justify-center active:opacity-75"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
          </svg>
        </button>
      </div>
    </div>
  )
}
