import { useState, useEffect, useRef } from "react"
import type { UserData, Report } from "../App"
import {
  generateResponse,
  generatePostSubmitMessage,
  initialAIState,
  OPENING,
  type AIState,
} from "../lib/safiraAI"

interface Props {
  user: UserData
  onBack: () => void
  onSubmit: (report: Report) => void
}

const CARD_BG = "#dce9d8"
const AVATAR_BG = "#8aad84"
const INPUT_BG = "#c2d4bc"

interface Message {
  id: number
  sender: "ai" | "user"
  text: string
}

function AiAvatar() {
  return (
    <div
      className="flex items-center justify-center font-black text-white flex-shrink-0"
      style={{ width: 28, height: 28, borderRadius: "50%", background: AVATAR_BG, fontSize: 9 }}
    >
      IA
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <AiAvatar />
      <div className="px-4 py-3 rounded-2xl flex gap-1 items-center" style={{ background: "rgba(255,255,255,0.7)", borderBottomLeftRadius: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%", background: "#8aad84",
              animation: `bounce 1s ease ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const renderText = (raw: string) =>
  raw.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  )

let reportCounter = 3

export default function ReportScreen({ user, onBack, onSubmit }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", text: OPENING },
  ])
  const [text, setText] = useState("")
  const [aiState, setAiState] = useState<AIState>(initialAIState)
  const [typing, setTyping] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const sendMessage = () => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMsg: Message = { id: Date.now(), sender: "user", text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setText("")
    setTyping(true)

    const currentState = aiState

    setTimeout(() => {
      setTyping(false)

      if (submitted) {
        // Post-submit: Safira can still respond supportively
        const { text: response, newState } = generateResponse(trimmed, currentState)
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: response }])
        setAiState(newState)
      } else {
        const { text: response, newState } = generateResponse(trimmed, currentState)
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: response }])
        setAiState(newState)
      }
    }, 1100 + Math.random() * 400)
  }

  const handleSubmit = () => {
    if (submitted) return

    const transcript = messages
      .map((m) => `${m.sender === "ai" ? "Safira" : "Aluno"}: ${m.text}`)
      .join("\n")

    const userMsgs = messages.filter((m) => m.sender === "user").map((m) => m.text)
    const firstUserMsg = userMsgs[0] ?? ""
    const suggestedCategories = aiState.categories.filter(
      (category) => category !== "Categoria indeterminada",
    )
    const type =
      suggestedCategories.length > 0
        ? suggestedCategories.join(", ")
        : firstUserMsg.length < 45
          ? firstUserMsg || "Outra situação"
          : `${firstUserMsg.slice(0, 45)}...`

    // Extract location from anywhere in user messages
    const locationMsg = userMsgs.find((m) =>
      /corredor|sala|quadra|refeit|banheiro|portão|escola|ônibus|online|grupo|instagram|whatsapp/i.test(m)
    )
    const location = locationMsg
      ? locationMsg.length < 40
        ? locationMsg
        : locationMsg.slice(0, 40) + "..."
      : "Não informado"

    reportCounter += 1
    const report: Report = {
      id: `DEN-${String(reportCounter).padStart(4, "0")}`,
      type,
      transcript,
      date: new Date().toISOString().slice(0, 10),
      location,
      submittedAt: new Date().toISOString(),
      status: "Enviada",
      studentName: user?.nome || "Anônimo",
      studentCPF: user?.cpf || "",
      studentGmail: user?.gmail || "",
      studentEscola: user?.escola || "",
      suggestedCategories: aiState.categories,
      classificationConfidence: aiState.classificationConfidence,
    }

    setSubmitted(true)
    setAiState((current) => ({ ...current, reportSubmitted: true }))

    // Safira responds naturally after submit — not abruptly
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const postMsg = generatePostSubmitMessage(aiState.incidentType)
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: postMsg }])

      // Second follow-up after brief pause
      setTimeout(() => {
        setTyping(true)
        setTimeout(() => {
          setTyping(false)
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              sender: "ai",
              text: "Você pode continuar conversando enquanto aguarda a análise. Há mais alguma informação importante que queira acrescentar?",
            },
          ])
        }, 1200)
      }, 800)
    }, 1400)

    onSubmit(report)
  }

  // Show submit button only after at least 1 user message has been sent
  const userMsgCount = messages.filter((m) => m.sender === "user").length
  const canSubmit = userMsgCount >= 1 && !submitted
  const submitLabel = submitted ? "Denúncia registrada ✓" : "Enviar denúncia"

  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8" style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}>
        <div className="flex items-center justify-center mb-6" style={{ width: 80, height: 80, borderRadius: "50%", background: CARD_BG }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <polyline points="8 20 16 28 32 12" stroke="#5a8a5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9ab09a" }}>Safira IA</p>
        <h2 className="font-black text-xl text-center mb-2" style={{ color: "#1e1e1e" }}>Denúncia enviada! 💚</h2>
        <p className="text-sm text-center leading-relaxed" style={{ color: "#9ab09a" }}>
          Sua denúncia foi registrada com segurança.
        </p>
      </div>
    )
  }

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

      {/* AI header */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-4">
        <div
          className="flex items-center justify-center font-black text-white flex-shrink-0"
          style={{ width: 42, height: 42, borderRadius: "50%", background: AVATAR_BG, fontSize: 12 }}
        >
          IA
        </div>
        <div>
          <h1 className="font-black text-lg leading-tight" style={{ color: "#1e1e1e" }}>Safira IA</h1>
        <p className="text-xs" style={{ color: "#9ab09a" }}>Acolhimento · acesso restrito à equipe autorizada</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5a8a5e" }} />
          <span className="text-xs font-bold" style={{ color: "#5a8a5e" }}>Online</span>
        </div>
      </div>

      {/* Chat */}
      <div
        className="flex-1 mx-5 mb-4 rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto"
        style={{ background: CARD_BG, minHeight: 300 }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && <AiAvatar />}
            <div
              className="px-4 py-2.5 text-sm leading-relaxed max-w-[80%]"
              style={{
                background: msg.sender === "user" ? "#a8c0a2" : "rgba(255,255,255,0.72)",
                color: "#1e1e1e",
                borderRadius: 16,
                borderBottomRightRadius: msg.sender === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.sender === "ai" ? 4 : 16,
              }}
            >
              {renderText(msg.text)}
            </div>
          </div>
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-3 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
          onClick={sendMessage}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: typing ? "#c2d4bc" : AVATAR_BG,
            border: "none", flexShrink: 0,
            transition: "background 0.2s",
          }}
          className="flex items-center justify-center"
          disabled={typing}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
          </svg>
        </button>
      </div>

      {/* Submit */}
      <div className="px-5 pb-6">
        {submitted ? (
          <div
            className="w-full py-4 rounded-3xl font-black text-sm text-center"
            style={{ background: "#dce9d8", color: "#5a8a5e", border: "2px solid #b8d0b2" }}
          >
            Denúncia registrada ✓
          </div>
        ) : canSubmit ? (
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-3xl font-black text-sm active:opacity-75 transition-all"
            style={{ background: "#5a8a5e", color: "#ffffff", border: "none" }}
          >
            Enviar denúncia
          </button>
        ) : (
          <div
            className="w-full py-4 rounded-3xl font-black text-sm text-center"
            style={{ background: "#e8ede6", color: "#a8bfa2", border: "none" }}
          >
            {submitLabel}
          </div>
        )}
      </div>
    </div>
  )
}
