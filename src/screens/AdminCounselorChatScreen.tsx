import { useState, useEffect, useRef } from "react"
import type { CounselorConversation } from "../App"

interface Props {
  conversation: CounselorConversation
  onSend: (text: string) => void
  onBack: () => void
}

const CARD_BG = "#2a3a2c"
const BUBBLE_COUNSELOR = "#3d6b45"
const BUBBLE_STUDENT = "rgba(255,255,255,0.12)"

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

export default function AdminCounselorChatScreen({ conversation, onSend, onBack }: Props) {
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages.length])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#1e2c20", fontFamily: "'Nunito',sans-serif" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4" style={{ background: CARD_BG }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            className="flex items-center justify-center font-black text-white flex-shrink-0"
            style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", fontSize: 16 }}
          >
            {conversation.studentName[0]?.toUpperCase() ?? "E"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-sm truncate">{conversation.studentName}</p>
            <p className="text-xs truncate" style={{ color: "#9ab09a" }}>
              {conversation.studentEscola || "Escola não informada"} · Conversa privada
            </p>
          </div>

          {/* Restricted badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ab09a" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs font-bold" style={{ color: "#9ab09a" }}>Restrito</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-5 overflow-y-auto flex flex-col gap-3">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
            <span className="text-4xl mb-3">💬</span>
            <p className="font-black text-sm text-white">Nenhuma mensagem ainda</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#9ab09a" }}>
              O estudante ainda não enviou nenhuma mensagem. Você pode iniciar a conversa.
            </p>
          </div>
        ) : (
          conversation.messages.map((msg) => {
            const isCounselor = msg.senderType === "counselor"
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isCounselor ? "justify-end" : "justify-start"}`}>
                {!isCounselor && (
                  <div
                    className="flex items-center justify-center font-black text-white flex-shrink-0"
                    style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", fontSize: 12 }}
                  >
                    {conversation.studentName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col max-w-[78%]">
                  {!isCounselor && (
                    <span className="text-xs mb-1 ml-1" style={{ color: "#9ab09a" }}>Estudante</span>
                  )}
                  <div
                    className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: isCounselor ? BUBBLE_COUNSELOR : BUBBLE_STUDENT,
                      color: "white",
                      borderRadius: 16,
                      borderBottomRightRadius: isCounselor ? 4 : 16,
                      borderBottomLeftRadius: !isCounselor ? 4 : 16,
                    }}
                  >
                    {msg.text}
                  </div>
                  <span
                    className="text-xs mt-0.5"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      alignSelf: isCounselor ? "flex-end" : "flex-start",
                      marginLeft: isCounselor ? 0 : 4,
                    }}
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

      {/* Student info ribbon */}
      <div
        className="mx-5 mb-3 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ab09a" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <p className="text-xs" style={{ color: "#9ab09a" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>{conversation.studentName}</span>
          {conversation.studentEscola ? ` · ${conversation.studentEscola}` : ""}
        </p>
      </div>

      {/* Input */}
      <div className="px-5 pb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Responder ao estudante..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-5 py-3 text-sm outline-none text-white"
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.15)",
            fontFamily: "'Nunito',sans-serif",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#5a8a5e", border: "none", flexShrink: 0,
          }}
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
