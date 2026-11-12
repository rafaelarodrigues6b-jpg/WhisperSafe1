import { useState } from "react"
import type { AdminId, Report, ReportMessage } from "../App"
import { ADMIN_ACCOUNTS } from "../App"
import { deadlineLabel, reportDeadline } from "../lib/reportWorkflow"
import ReportConversation from "./ReportConversation"

const CARD_BG = "#dce9d8"
const CARD_ALT = "#eaf2e6"

interface Props {
  report: Report
  onBack: () => void
  adminId?: AdminId
  director?: boolean
  now: Date
  directorMessages: ReportMessage[]
  onAction: (action: "assume" | "analyze" | "complete" | "forward" | "transfer", target?: AdminId) => void
  onSend?: (text: string) => void
  onDirectorSend: (text: string) => void
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function statusStyle(s: Report["status"]) {
  if (s === "Encerrada") return { color: "#9ab09a", bg: "#f0f0f0" }
  if (s === "Respondida") return { color: "#4a8f6a", bg: "#dce9d8" }
  if (s === "Em análise") return { color: "#5a8a5e", bg: "#eaf2e6" }
  return { color: "#c8a040", bg: "#fdf6e3" }
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid #e4eee2" }}>
      <span className="text-xs font-black uppercase tracking-widest w-24 flex-shrink-0 pt-0.5" style={{ color: "#9ab09a" }}>{label}</span>
      <span className="text-sm font-semibold leading-relaxed" style={{ color: "#1e1e1e" }}>{value || "—"}</span>
    </div>
  )
}

export default function AdminReportDetailScreen({ report, onBack, adminId, director = false, now, directorMessages, onAction, onSend, onDirectorSend }: Props) {
  const [chatOpen, setChatOpen] = useState(false)
  const [directorChatOpen, setDirectorChatOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [confirmForward, setConfirmForward] = useState(false)
  const sc = statusStyle(report.status)
  const deadline = reportDeadline(report, now)
  const responsible = ADMIN_ACCOUNTS.find((a) => a.id === report.responsibleId)
  const owner = !director && !!adminId && adminId === report.responsibleId
  const closed = report.status === "Respondida" || report.status === "Encerrada"
  const timeline = [
    { id: "received", at: report.submittedAt, text: "Denúncia recebida · prazo inicial de 15 dias úteis" },
    ...(report.history ?? []),
    ...(deadline.initialExpired && !closed ? [{ id: "deadline", at: deadline.initial.toISOString(), text: `Prazo inicial ultrapassado · Diretor notificado · prazo extraordinário de 5 dias úteis${responsible ? ` · Responsável: ${responsible.nome}` : ""}` }] : []),
  ].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

  // Parse transcript into chat lines
  const lines = report.transcript.split("\n").filter(Boolean)

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f8faf8", fontFamily: "'Nunito',sans-serif" }}>

      {/* Admin top bar */}
      <div className="px-5 pt-10 pb-4" style={{ background: "#2a3a2c" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "#8aad84" }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#8aad84" }}>{director ? "Área do Diretor" : "Área Administrativa"}</span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#c8d8c4" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar à lista
        </button>
      </div>

      {/* Report header */}
      <div className="px-5 py-5" style={{ background: "#ffffff", borderBottom: "1.5px solid #dce9d8" }}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-black text-xl" style={{ color: "#1e1e1e" }}>{report.id}</h1>
          <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
            {report.status}
          </span>
        </div>
        <p className="text-sm font-semibold" style={{ color: "#5a8a5e" }}>{report.type}</p>
        <p className="text-xs mt-1" style={{ color: "#9ab09a" }}>Enviada em {formatDateTime(report.submittedAt)}</p>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 pb-10">

        <section className="rounded-3xl border border-sage-100 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-widest text-sage-600">Acompanhamento</p>
          <p className="mt-2 text-sm font-black text-sage-900">Responsável: {responsible?.nome ?? "Aguardando coordenador"}</p>
          <div className={`mt-3 rounded-2xl px-4 py-3 text-sm font-black ${report.forwardedAt ? "bg-neutral-100 text-neutral-700" : deadline.phase === "closed" ? "bg-sage-100 text-sage-800" : deadline.phase === "normal" ? "bg-sage-50 text-sage-800" : "bg-orange-50 text-orange-800"}`}>
            {deadlineLabel(report, now)}
            {!closed && !report.forwardedAt && <span className="mt-1 block text-xs font-semibold">{deadline.phase === "extra" || deadline.phase === "escalate" ? `Prazo inicial encerrado em ${deadline.initial.toLocaleDateString("pt-BR")}. Prazo extra até ${deadline.extra.toLocaleDateString("pt-BR")}.` : `15 dias úteis · até ${deadline.initial.toLocaleDateString("pt-BR")}`}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!director && !responsible && !closed && <button onClick={() => onAction("assume")} className="rounded-xl bg-sage-700 px-4 py-2.5 text-sm font-black text-white">Assumir denúncia</button>}
            {owner && !closed && report.status === "Enviada" && <button onClick={() => onAction("analyze")} className="rounded-xl bg-sage-700 px-4 py-2.5 text-sm font-black text-white">Colocar em análise</button>}
            {owner && report.status === "Em análise" && <button onClick={() => onAction("complete")} className="rounded-xl bg-sage-100 px-4 py-2.5 text-sm font-black text-sage-800">Concluir denúncia</button>}
            {(owner || director) && responsible && !closed && <button onClick={() => setTransferOpen(!transferOpen)} className="rounded-xl border border-sage-200 px-4 py-2.5 text-sm font-bold text-sage-800">Transferir responsabilidade</button>}
          </div>
          {transferOpen && <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-sage-50 p-3"><p className="text-xs font-bold text-sage-800">Escolha outro administrador autorizado:</p>{ADMIN_ACCOUNTS.filter((a) => a.id !== report.responsibleId).map((a) => <button key={a.id} onClick={() => { onAction("transfer", a.id); setTransferOpen(false) }} className="rounded-xl bg-white p-2 text-left text-sm font-bold text-sage-800">{a.nome}</button>)}</div>}
          {director && deadline.phase === "escalate" && !report.forwardedAt && <div className="mt-3">{confirmForward ? <div className="rounded-2xl bg-orange-50 p-3"><p className="mb-2 text-sm text-orange-900">Confirmar encaminhamento para Boletim de Ocorrência? O histórico será mantido.</p><div className="flex gap-2"><button onClick={() => { onAction("forward"); setConfirmForward(false) }} className="rounded-xl bg-orange-800 px-3 py-2 text-sm font-bold text-white">Confirmar</button><button onClick={() => setConfirmForward(false)} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-sage-800">Cancelar</button></div></div> : <button onClick={() => setConfirmForward(true)} className="rounded-xl bg-orange-800 px-4 py-3 text-sm font-black text-white">Encaminhar para Boletim de Ocorrência</button>}</div>}
          {report.completedAt && <p className="mt-3 text-xs text-sage-700">Concluída por {report.completedBy ? ADMIN_ACCOUNTS.find((a) => a.id === report.completedBy)?.nome : "Diretor"} em {formatDateTime(report.completedAt)}</p>}
        </section>

        <section className="rounded-3xl border border-sage-100 bg-sage-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-sage-600">Estudante · Coordenador</p>
          <p className="mt-2 text-xs text-sage-700">Conversa privada vinculada à denúncia {report.id}. A identidade do estudante não é compartilhada no chat.</p>
          <button onClick={() => setChatOpen(!chatOpen)} className="mt-3 w-full rounded-xl bg-sage-700 px-4 py-3 text-sm font-black text-white">{chatOpen ? "Fechar conversa" : "Abrir conversa"}</button>
          {chatOpen && <div className="mt-3"><ReportConversation viewer={director ? "director" : "coordinator"} messages={report.messages ?? []} onSend={owner && !closed ? onSend : undefined} placeholder="Responder ao estudante..." /></div>}
          {!director && !owner && <p className="mt-2 text-xs text-sage-700">Somente o responsável pode responder ao estudante.</p>}
        </section>

        {responsible && (director || owner) && <section className="rounded-3xl border border-sage-100 bg-white p-5"><p className="text-xs font-black uppercase tracking-widest text-sage-600">Diretor · Coordenador</p><button onClick={() => setDirectorChatOpen(!directorChatOpen)} className="mt-3 w-full rounded-xl bg-sage-100 px-4 py-3 text-sm font-black text-sage-800">{directorChatOpen ? "Fechar conversa com responsável" : director ? "Conversar com responsável" : "Conversar com Diretor"}</button>{directorChatOpen && <div className="mt-3"><ReportConversation viewer={director ? "director" : "coordinator"} messages={directorMessages} onSend={onDirectorSend} /></div>}</section>}

        <section className="rounded-3xl border border-sage-100 bg-white p-5"><p className="mb-4 text-xs font-black uppercase tracking-widest text-sage-600">Histórico da denúncia</p><ol className="border-l-2 border-sage-200 pl-4">{timeline.map((event) => <li key={event.id} className="relative pb-4 last:pb-0"><span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-sage-500" /><p className="text-sm font-bold text-sage-900">{event.text}</p><time dateTime={event.at} className="text-xs text-neutral-500">{formatDateTime(event.at)}</time></li>)}</ol></section>

        {/* ── Student identity — ADMIN ONLY ── */}
        <div className="rounded-3xl overflow-hidden" style={{ border: "2px solid #4e7a52" }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: "#2a3a2c" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8aad84" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#8aad84" }}>
              Identidade do denunciante — Restrito a administradores
            </span>
          </div>
          <div className="px-5 py-4" style={{ background: "#f0f6f0" }}>
            <InfoRow label="Nome" value={report.studentName} />
            <InfoRow label="CPF" value={report.studentCPF} />
            <InfoRow label="Gmail" value={report.studentGmail} />
            <InfoRow label="Escola" value={report.studentEscola} />
          </div>
        </div>

        {/* ── Report details ── */}
        <div className="rounded-3xl px-5 py-4" style={{ background: "#ffffff", border: "1.5px solid #dce9d8" }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#9ab09a" }}>Detalhes da ocorrência</p>
          <InfoRow label="Tipo" value={report.type} />
          <InfoRow label="Data" value={report.date} />
          <InfoRow label="Local" value={report.location} />
          <InfoRow label="Status" value={report.status} />
        </div>

        {/* ── Full transcript ── */}
        <div className="rounded-3xl px-5 py-4" style={{ background: "#ffffff", border: "1.5px solid #dce9d8" }}>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#9ab09a" }}>
            Transcrição da conversa com Safira IA
          </p>
          <div className="flex flex-col gap-2">
            {lines.map((line, i) => {
              const isStudent = line.startsWith("Aluno:")
              const isSafira = line.startsWith("Safira:")
              const speaker = isStudent ? "Aluno" : isSafira ? "Safira IA" : ""
              const content = line.replace(/^(Aluno|Safira):\s*/, "")
              return (
                <div
                  key={i}
                  className={`flex flex-col rounded-xl px-3 py-2 ${isStudent ? "self-end items-end" : "self-start items-start"}`}
                  style={{
                    background: isStudent ? CARD_BG : "#f0f0f0",
                    maxWidth: "85%",
                  }}
                >
                  {speaker && (
                    <span className="text-xs font-black mb-0.5" style={{ color: isStudent ? "#3a6a3e" : "#7a7a7a" }}>
                      {speaker}
                    </span>
                  )}
                  <p className="text-xs leading-relaxed" style={{ color: "#1e1e1e" }}>{content}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Admin note */}
        <div className="rounded-3xl px-5 py-4 flex items-start gap-3" style={{ background: CARD_ALT }}>
          <span className="text-lg flex-shrink-0">🔒</span>
          <p className="text-xs leading-relaxed" style={{ color: "#3a6a3e" }}>
            As informações de identidade do denunciante são visíveis <strong>apenas para administradores</strong>. Nenhum estudante tem acesso a esses dados.
          </p>
        </div>
      </div>
    </div>
  )
}
