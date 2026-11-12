import { useState } from "react"
import type { Report, AdminId } from "../App"
import { ADMIN_ACCOUNTS } from "../App"
import { deadlineLabel, reportDeadline } from "../lib/reportWorkflow"
import BrandLogo from "../components/BrandLogo"

const CARD_ALT = "#eaf2e6"

interface Props {
  adminId: AdminId
  reports: Report[]
  now: Date
  isAvailable: boolean
  onSelect: (id: string) => void
  onHide: (id: string) => void
  onLogout: () => void
  onSupport: () => void
  onToggleAvailability: () => void
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
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

export default function AdminHomeScreen({
  adminId, reports, now, isAvailable, onSelect, onHide, onLogout, onSupport, onToggleAvailability,
}: Props) {
  const [confirmHide, setConfirmHide] = useState<string | null>(null)
  const [filter, setFilter] = useState<"Novas" | "Em análise" | "Respondidas">("Novas")
  const admin = ADMIN_ACCOUNTS.find((a) => a.id === adminId)!
  const filtered = reports.filter((r) => filter === "Novas" ? r.status === "Enviada" : filter === "Respondidas" ? r.status === "Respondida" || r.status === "Encerrada" : r.status === "Em análise")

  const handleHide = (id: string) => {
    onHide(id)
    setConfirmHide(null)
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f8faf8", fontFamily: "'Nunito',sans-serif" }}>
      {/* Admin header */}
      <div className="px-5 pt-12 pb-5" style={{ background: "#2a3a2c" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showName={false} imageClassName="rounded-xl" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#8aad84" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#8aad84" }}>Área Administrativa</span>
              </div>
              <h1 className="font-black text-xl text-white leading-tight">WhisperSafe</h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.1)", color: "#c8d8c4" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>

        {/* Admin identity card */}
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-3" style={{ background: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-center font-black text-white text-sm flex-shrink-0" style={{ width: 36, height: 36, borderRadius: "50%", background: "#4e7a52" }}>
            {admin.nome[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate">{admin.nome}</p>
            <p className="text-xs truncate" style={{ color: "#8aad84" }}>{admin.role}</p>
          </div>
          {/* Availability toggle */}
          <button
            onClick={onToggleAvailability}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: isAvailable ? "rgba(74,175,80,0.2)" : "rgba(255,255,255,0.08)",
              color: isAvailable ? "#81c784" : "#8aad84",
              border: isAvailable ? "1px solid rgba(74,175,80,0.35)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isAvailable ? "#81c784" : "#666" }} />
            {isAvailable ? "Disponível" : "Ausente"}
          </button>
        </div>

        {/* Navigation pills */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Denúncias
          </div>
          <button
            onClick={onSupport}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all active:opacity-75"
            style={{ background: "rgba(255,255,255,0.08)", color: "#8aad84" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Apoio
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-5 py-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {(["Novas", "Em análise", "Respondidas"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all"
            style={{
              background: filter === f ? "#3a6a3e" : "#ffffff",
              color: filter === f ? "white" : "#7a7a7a",
              border: filter === f ? "none" : "1.5px solid #dce9d8",
            }}
          >
            {f} <span className="ml-1 opacity-70">{reports.filter((r) => f === "Novas" ? r.status === "Enviada" : f === "Respondidas" ? r.status === "Respondida" || r.status === "Encerrada" : r.status === "Em análise").length}</span>
          </button>
        ))}
      </div>

      {/* Report list */}
      <div className="flex flex-col gap-3 px-5 pb-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-4xl mb-3">📭</span>
            <p className="font-black text-base" style={{ color: "#2a3a2c" }}>Nenhuma denúncia</p>
            <p className="text-sm mt-1" style={{ color: "#9ab09a" }}>
              {`Nenhuma denúncia na aba "${filter}".`}
            </p>
          </div>
        ) : (
          filtered.map((report) => {
            const sc = statusStyle(report.status)
            return (
              <div key={report.id} className="rounded-3xl overflow-hidden" style={{ background: "#ffffff", border: "1.5px solid #dce9d8" }}>
                <button onClick={() => onSelect(report.id)} className="w-full px-5 py-4 text-left active:opacity-75">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm" style={{ color: "#1e1e1e" }}>{report.id}</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{report.status}</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ab09a" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#2a2a2a" }}>{report.type}</p>
                  <p className="text-xs font-bold text-sage-700">Responsável: {ADMIN_ACCOUNTS.find((a) => a.id === report.responsibleId)?.nome ?? "Não atribuído"}</p>
                  <p className={`mt-1 text-xs font-black ${reportDeadline(report, now).initialExpired && reportDeadline(report, now).phase !== "closed" ? "text-orange-700" : "text-sage-700"}`}>{deadlineLabel(report, now)}</p>
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8aad84" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <p className="text-xs font-semibold" style={{ color: "#5a8a5e" }}>{report.studentName}</p>
                    <span className="text-xs" style={{ color: "#b0c8b0" }}>· {report.studentEscola}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#9ab09a" }}>📍 {report.location}</span>
                    <span className="text-xs" style={{ color: "#9ab09a" }}>🕐 {formatDateTime(report.submittedAt)}</span>
                  </div>
                </button>

                <div className="px-5 pb-4">
                  {confirmHide === report.id ? (
                    <div className="flex items-center gap-2">
                      <p className="text-xs flex-1" style={{ color: "#c05a2a" }}>Ocultar apenas para você?</p>
                      <button onClick={() => handleHide(report.id)} className="text-xs font-black px-3 py-1.5 rounded-xl" style={{ background: "#f5d9c8", color: "#c05a2a" }}>Confirmar</button>
                      <button onClick={() => setConfirmHide(null)} className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: "#eaf2e6", color: "#5a8a5e" }}>Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmHide(report.id)} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#b0c8b0" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                      Ocultar da minha visão
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}

        <div className="rounded-3xl px-5 py-4 flex items-start gap-3 mt-2" style={{ background: CARD_ALT, border: "1.5px solid #dce9d8" }}>
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#3a6a3e" }}>
            Ocultar uma denúncia remove-a <strong>somente da sua visão</strong>. Os demais administradores continuam vendo normalmente.
          </p>
        </div>
      </div>
    </div>
  )
}
