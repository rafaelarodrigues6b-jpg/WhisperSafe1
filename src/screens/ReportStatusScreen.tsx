import { useState } from "react"
import type { Report } from "../App"
import { generateResponse, initialAIState, type AIState } from "../lib/safiraAI"
import ReportConversation from "./ReportConversation"
import { deadlineLabel, reportDeadline } from "../lib/reportWorkflow"

const CARD_BG = "#dce9d8"
const CARD_ALT = "#eaf2e6"
const AVATAR_BG = "#8aad84"
const INPUT_BG = "#c2d4bc"

interface Props {
  reports: Report[]
  onBack: () => void
  onSend: (id: string, text: string) => void
  now: Date
}

const STATUS_STEPS = ["Enviada", "Em análise", "Respondida", "Encerrada"] as const

function statusColor(s: Report["status"]) {
  if (s === "Encerrada") return { color: "#9ab09a", bg: "#eaf2e6" }
  if (s === "Respondida") return { color: "#4a8f6a", bg: "#dce9d8" }
  return { color: "#5a8a5e", bg: "#dce9d8" }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
  } catch {
    return iso
  }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

// Per-report AI chat widget
interface ChatMessage { id: number; sender: "ai" | "user"; text: string }

function statusOpener(report: Report): string[] {
  const base = `Sua denúncia **${report.id}** está em **${report.status}** agora.`
  if (report.status === "Encerrada") {
    return [
      base,
      "A escola concluiu a análise. Se a situação continuar ou voltar a acontecer, pode abrir uma nova denúncia. Tem alguma coisa que queira me contar sobre como as coisas estão indo?",
    ]
  }
  if (report.status === "Respondida") {
    return [
      base,
      "A escola já se manifestou. Se a resposta não foi suficiente ou se a situação continuou, me conta — posso te ajudar a pensar nos próximos passos.",
    ]
  }
  if (report.status === "Em análise") {
    return [
      base,
      "A equipe já está analisando o que você relatou. Enquanto isso, como você está se sentindo? Se quiser conversar ou se surgiu alguma coisa nova, estou aqui.",
    ]
  }
  return [
    base,
    "Em breve a escola começará a analisar o que você relatou. Tem mais alguma coisa que queira adicionar, ou quer conversar enquanto aguarda?",
  ]
}

function AiChat({ report }: { report: Report }) {
  const openers = statusOpener(report)
  const [messages, setMessages] = useState<ChatMessage[]>(
    openers.map((text, i) => ({ id: i + 1, sender: "ai" as const, text }))
  )
  const [text, setText] = useState("")
  const [typing, setTyping] = useState(false)
  const [chatState, setChatState] = useState<AIState>({
    ...initialAIState,
    collected: ["what"],
    guidanceGiven: true,
    reportSubmitted: true,
  })

  const renderText = (raw: string) =>
    raw.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    )

  const send = () => {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((p) => [...p, { id: Date.now(), sender: "user", text: trimmed }])
    setText("")
    setTyping(true)
    const state = chatState
    setTimeout(() => {
      setTyping(false)
      const { text: response, newState } = generateResponse(trimmed, state)
      setMessages((p) => [...p, { id: Date.now() + 1, sender: "ai", text: response }])
      setChatState(newState)
    }, 900 + Math.random() * 400)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center font-black text-white flex-shrink-0" style={{ width: 30, height: 30, borderRadius: "50%", background: AVATAR_BG, fontSize: 9 }}>IA</div>
        <div>
          <p className="text-sm font-black" style={{ color: "#1e1e1e" }}>Safira IA</p>
          <p className="text-xs" style={{ color: "#9ab09a" }}>Assistente de acolhimento</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5a8a5e" }} />
          <span className="text-xs font-bold" style={{ color: "#5a8a5e" }}>Online</span>
        </div>
      </div>
      <div className="rounded-2xl p-4 flex flex-col gap-2.5 mb-3" style={{ background: CARD_BG }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "ai" && (
              <div className="flex items-center justify-center font-black text-white flex-shrink-0" style={{ width: 22, height: 22, borderRadius: "50%", background: AVATAR_BG, fontSize: 8 }}>IA</div>
            )}
            <div
              className="px-3 py-2 text-xs leading-relaxed max-w-[80%]"
              style={{
                background: msg.sender === "user" ? "#a8c0a2" : "rgba(255,255,255,0.72)",
                color: "#1e1e1e", borderRadius: 12,
                borderBottomRightRadius: msg.sender === "user" ? 3 : 12,
                borderBottomLeftRadius: msg.sender === "ai" ? 3 : 12,
              }}
            >
              {renderText(msg.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="flex items-center justify-center font-black text-white flex-shrink-0" style={{ width: 22, height: 22, borderRadius: "50%", background: AVATAR_BG, fontSize: 8 }}>IA</div>
            <div className="px-3 py-2 rounded-xl flex gap-1" style={{ background: "rgba(255,255,255,0.72)" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#8aad84", animation: `bounce 1s ease ${i*0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text" placeholder="Pergunte à Safira..." value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 px-4 py-2.5 text-xs outline-none"
          style={{ background: INPUT_BG, borderRadius: 999, color: "#1e1e1e", border: "none", fontFamily: "'Nunito',sans-serif" }}
        />
        <button onClick={send} style={{ width: 34, height: 34, borderRadius: "50%", background: AVATAR_BG, border: "none", flexShrink: 0 }} className="flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ReportStatusScreen({ reports, onBack, onSend, now }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [openChat, setOpenChat] = useState<string | null>(null)

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

      <div className="px-5 pt-3 pb-5">
        <h1 className="font-black text-2xl" style={{ color: "#1e1e1e" }}>Status da Denúncia 📋</h1>
        <p className="text-sm mt-1" style={{ color: "#9ab09a" }}>
          {reports.length === 0
            ? "Você ainda não fez nenhuma denúncia."
            : "Toque em uma denúncia para acompanhar o atendimento e conversar com a equipe."}
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-8 pb-20">
          <span className="text-5xl mb-4">📭</span>
          <p className="font-black text-base text-center" style={{ color: "#1e1e1e" }}>Nenhuma denúncia ainda</p>
          <p className="text-sm text-center mt-1 leading-relaxed" style={{ color: "#9ab09a" }}>
            Suas denúncias aparecerão aqui assim que você as enviar.
          </p>
        </div>
      ) : (
        <>
          <div className="mx-5 mb-5 rounded-3xl bg-sage-50 px-4 py-3 text-sm font-bold text-sage-800">A escola tem 15 dias úteis para resolver a denúncia. Se necessário, o Diretor acompanhará por mais 5 dias úteis.</div>

          <div className="flex flex-col gap-4 px-5 pb-10">
            {reports.map((report) => {
              const open = expanded === report.id
              const sc = statusColor(report.status)
              const stepIdx = STATUS_STEPS.indexOf(report.status)

              return (
                <div key={report.id}>
                  {/* Card header — clickable */}
                  <button
                    onClick={() => setExpanded(open ? null : report.id)}
                    className="w-full rounded-3xl px-5 py-4 text-left active:opacity-75"
                    style={{ background: open ? CARD_BG : CARD_ALT }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-base" style={{ color: "#1e1e1e" }}>{report.id}</span>
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{report.status}</span>
                        </div>
                        <p className="text-xs" style={{ color: "#5a8a5e" }}>{report.type} · {formatDate(report.date)}</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ab09a" strokeWidth="2.5" strokeLinecap="round"
                        style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {open && (
                    <div className="rounded-3xl px-5 py-5 mt-2 flex flex-col gap-5" style={{ background: "#f8faf8", border: "1.5px solid #dce9d8" }}>
                      <div className={`rounded-2xl px-4 py-3 text-sm font-black ${report.forwardedAt ? "bg-neutral-100 text-neutral-700" : reportDeadline(report, now).initialExpired ? "bg-orange-50 text-orange-800" : "bg-sage-50 text-sage-800"}`}>{deadlineLabel(report, now)}</div>
                      <section>
                        <p className="mb-2 text-xs font-black uppercase tracking-widest text-sage-700">Conversa sobre esta denúncia</p>
                        <button onClick={() => setOpenChat(openChat === report.id ? null : report.id)} className="w-full rounded-xl bg-sage-700 px-4 py-3 text-sm font-black text-white">{openChat === report.id ? "Fechar conversa" : "Abrir conversa"}{(report.messages ?? []).some((m) => m.sender === "coordinator") && openChat !== report.id ? " · resposta da equipe" : ""}</button>
                        {openChat === report.id && <div className="mt-3"><ReportConversation viewer="student" messages={report.messages ?? []} onSend={(text) => onSend(report.id, text)} placeholder="Mensagem para o responsável..." /></div>}
                        <p className="mt-2 text-xs text-sage-700">O acesso à sua identidade é restrito à equipe autorizada responsável pelo atendimento.</p>
                      </section>
                      {/* What was written */}
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#9ab09a" }}>O que você escreveu</p>
                        <div className="rounded-2xl px-4 py-3" style={{ background: CARD_BG }}>
                          <p className="text-sm leading-relaxed" style={{ color: "#2a2a2a" }}>
                            {report.transcript
                              .split("\n")
                              .filter((l) => l.startsWith("Aluno:"))
                              .map((l) => l.replace("Aluno: ", ""))
                              .join(" ") || "Sem descrição."}
                          </p>
                          <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #c2d4bc" }}>
                            <span className="text-xs" style={{ color: "#5a8a5e" }}>📍 {report.location}</span>
                            <span className="text-xs" style={{ color: "#5a8a5e" }}>🕐 {formatDateTime(report.submittedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#9ab09a" }}>Progresso</p>
                        <div className="flex flex-col">
                          {STATUS_STEPS.map((step, idx) => {
                            const done = idx <= stepIdx
                            return (
                              <div key={step} className="flex gap-3">
                                <div className="flex flex-col items-center w-5 flex-shrink-0">
                                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? "#8aad84" : "#e4eee2", border: done ? "none" : "2px solid #c2d4bc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {done && (
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                  {idx < STATUS_STEPS.length - 1 && (
                                    <div style={{ width: 2, flex: 1, minHeight: 20, background: done ? "#b5c9b0" : "#e4eee2", margin: "3px 0" }} />
                                  )}
                                </div>
                                <div className="pb-3">
                                  <p className="text-xs font-bold" style={{ color: done ? "#1e1e1e" : "#b0c8b0" }}>{step}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Safira AI chat */}
                      <div style={{ borderTop: "1.5px solid #dce9d8", paddingTop: 16 }}>
                        <AiChat report={report} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <div className="rounded-3xl px-5 py-4 flex items-start gap-4 mt-2" style={{ background: "#fff0e8", border: "1.5px solid #f5d9c8" }}>
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-black text-sm" style={{ color: "#c05a2a" }}>A escola não respondeu?</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#a06040" }}>
                  Ligue para o <strong>0800 644 0007</strong> (Ouvidoria de Educação) ou busque o Conselho Tutelar.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
