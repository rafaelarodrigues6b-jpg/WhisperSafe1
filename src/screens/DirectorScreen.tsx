import { useMemo, useState } from "react"
import type { AdminId, Report, ReportMessage } from "../App"
import { ADMIN_ACCOUNTS } from "../App"
import { businessDaysOverdue, deadlineLabel, reportDeadline } from "../lib/reportWorkflow"
import ReportConversation from "./ReportConversation"
import BrandLogo from "../components/BrandLogo"

export type DirectorCategory = "pending" | "analysis" | "answered" | "near" | "overdue" | "extra" | "bo"

interface Props {
  reports: Report[]
  now: Date
  messages: Record<AdminId, ReportMessage[]>
  onSend: (id: AdminId, text: string) => void
  onSelect: (id: string) => void
  onLogout: () => void
  category: DirectorCategory | null
  onCategoryChange: (category: DirectorCategory | null) => void
}

const CATEGORIES: Array<{ id: DirectorCategory; label: string; description: string }> = [
  { id: "pending", label: "Pendentes", description: "Aguardando início do atendimento" },
  { id: "analysis", label: "Em análise", description: "Em atendimento pelos Coordenadores" },
  { id: "answered", label: "Respondidas", description: "Atendimentos concluídos" },
  { id: "near", label: "Perto do prazo", description: "Últimos 3 dias úteis" },
  { id: "overdue", label: "15 dias ultrapassados", description: "Precisam da atenção do Diretor" },
  { id: "extra", label: "Prazo extraordinário", description: "Dentro dos 5 dias adicionais" },
  { id: "bo", label: "Elegíveis para BO", description: "Os dois prazos foram encerrados" },
]

function inCategory(report: Report, category: DirectorCategory, now: Date) {
  const deadline = reportDeadline(report, now)
  if (category === "pending") return report.status === "Enviada"
  if (category === "analysis") return report.status === "Em análise"
  if (category === "answered") return report.status === "Respondida" || report.status === "Encerrada"
  if (category === "near") return deadline.phase === "soon"
  if (category === "overdue") return deadline.initialExpired && deadline.phase !== "closed"
  if (category === "extra") return deadline.phase === "extra"
  return deadline.phase === "escalate" && !report.forwardedAt
}

function formatDate(value?: string) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("pt-BR")
}

export default function DirectorScreen({ reports, now, messages, onSend, onSelect, onLogout, category, onCategoryChange }: Props) {
  const [tab, setTab] = useState<"dashboard" | "conversations">("dashboard")
  const [coordinator, setCoordinator] = useState<AdminId | null>(null)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"recent" | "oldest" | "deadline">("recent")
  const [responsible, setResponsible] = useState<AdminId | "all">("all")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState<Report["status"] | "all">("all")
  const activeCategory = CATEGORIES.find((item) => item.id === category)
  const types = [...new Set(reports.map((report) => report.type))].sort()
  const categoryReports = useMemo(() => {
    if (!category) return []
    return reports
      .filter((report) => inCategory(report, category, now))
      .filter((report) => report.id.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
      .filter((report) => responsible === "all" || report.responsibleId === responsible)
      .filter((report) => type === "all" || report.type === type)
      .filter((report) => status === "all" || report.status === status)
      .sort((a, b) => {
        if (sort === "deadline") return reportDeadline(a, now).initial.getTime() - reportDeadline(b, now).initial.getTime()
        const delta = new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        return sort === "recent" ? delta : -delta
      })
  }, [category, now, reports, responsible, search, sort, status, type])

  const openDashboard = () => {
    setTab("dashboard")
    onCategoryChange(null)
  }

  return <div className="min-h-screen bg-beige-50 font-sans">
    <header className="bg-sage-900 px-5 pb-5 pt-12 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" showName={false} imageClassName="rounded-xl" />
          <div><p className="text-xs font-black uppercase tracking-widest text-sage-300">Área do Diretor</p><h1 className="mt-1 text-xl font-black">WhisperSafe</h1><p className="text-sm text-sage-200">Acompanhamento e escalonamento</p></div>
        </div>
        <button onClick={onLogout} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold">Sair</button>
      </div>
      <nav className="mt-5 flex gap-2" aria-label="Área do diretor">
        <button onClick={openDashboard} className={`flex-1 rounded-xl py-2 text-xs font-black ${tab === "dashboard" ? "bg-white/20 text-white" : "bg-white/5 text-sage-300"}`}>Visão Geral</button>
        <button onClick={() => { setTab("conversations"); onCategoryChange(null) }} className={`flex-1 rounded-xl py-2 text-xs font-black ${tab === "conversations" ? "bg-white/20 text-white" : "bg-white/5 text-sage-300"}`}>Conversas com Coordenadores</button>
      </nav>
    </header>
    {tab === "dashboard" && !category ? <main className="space-y-5 px-5 py-6">
      {reports.filter((r) => reportDeadline(r, now).initialExpired && reportDeadline(r, now).phase !== "closed" && !r.forwardedAt).map((report) => <button key={report.id} onClick={() => onSelect(report.id)} className="block w-full rounded-2xl border border-orange-200 bg-orange-50 p-4 text-left">
        <span className="text-xs font-black uppercase tracking-wide text-orange-800">Notificação · Denúncia não resolvida dentro do prazo</span>
        <span className="mt-1 block text-sm font-bold text-orange-900">A denúncia {report.id} não foi concluída em 15 dias úteis.</span>
        <span className="mt-1 block text-xs text-orange-800">Coordenador responsável: {ADMIN_ACCOUNTS.find((a) => a.id === report.responsibleId)?.nome ?? "Ainda não atribuído"} · Abrir denúncia</span>
      </button>)}
      <div><h2 className="text-lg font-black text-sage-900">Visão Geral</h2><p className="text-sm text-neutral-500">Selecione uma categoria para abrir e gerenciar suas denúncias.</p></div>
      <div className="grid grid-cols-2 gap-2">{CATEGORIES.map((item) => {
        const count = reports.filter((report) => inCategory(report, item.id, now)).length
        const attention = item.id === "near" || item.id === "overdue" || item.id === "bo"
        return <button key={item.id} onClick={() => onCategoryChange(item.id)} className={`min-h-32 rounded-2xl border p-4 text-left active:opacity-75 ${attention ? "border-orange-200 bg-orange-50" : "border-sage-100 bg-white"}`}>
          <span className={`block text-2xl font-black ${attention ? "text-orange-800" : "text-sage-800"}`}>{count}</span>
          <span className={`mt-1 block text-sm font-black ${attention ? "text-orange-900" : "text-sage-900"}`}>{item.label}</span>
          <span className="mt-1 block text-xs text-neutral-500">{count === 1 ? "1 denúncia" : `${count} denúncias`}</span>
          <span className="mt-2 block text-xs text-neutral-500">{item.description} →</span>
        </button>
      })}</div>
    </main> : tab === "dashboard" && category && activeCategory ? <main className="space-y-4 px-5 py-6">
      <button onClick={() => onCategoryChange(null)} className="flex items-center gap-1 text-sm font-bold text-sage-700">← Voltar à Visão Geral</button>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-sage-600">Denúncias</p>
        <h2 className="text-xl font-black text-sage-900">{activeCategory.label}</h2>
        <p className="text-sm text-neutral-500">{activeCategory.description} · {categoryReports.length} {categoryReports.length === 1 ? "resultado" : "resultados"}</p>
      </div>

      <div className="rounded-3xl border border-sage-100 bg-white p-4">
        <label className="text-xs font-black uppercase tracking-wider text-sage-700" htmlFor="director-search">Pesquisar por número</label>
        <input id="director-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: DEN-0001" className="mt-2 w-full rounded-xl bg-sage-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-400" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <select aria-label="Ordenar denúncias" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="rounded-xl border border-sage-100 bg-white px-3 py-2.5 text-xs font-bold text-sage-800">
            <option value="recent">Mais recentes</option><option value="oldest">Mais antigas</option><option value="deadline">Prazo mais próximo</option>
          </select>
          <select aria-label="Filtrar por responsável" value={responsible} onChange={(event) => setResponsible(event.target.value as AdminId | "all")} className="rounded-xl border border-sage-100 bg-white px-3 py-2.5 text-xs font-bold text-sage-800">
            <option value="all">Todos responsáveis</option>{ADMIN_ACCOUNTS.map((admin) => <option key={admin.id} value={admin.id}>{admin.nome}</option>)}
          </select>
          <select aria-label="Filtrar por tipo" value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-sage-100 bg-white px-3 py-2.5 text-xs font-bold text-sage-800">
            <option value="all">Todos os tipos</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as Report["status"] | "all")} className="rounded-xl border border-sage-100 bg-white px-3 py-2.5 text-xs font-bold text-sage-800">
            <option value="all">Todos os status</option><option value="Enviada">Enviada</option><option value="Em análise">Em análise</option><option value="Respondida">Respondida</option><option value="Encerrada">Encerrada</option>
          </select>
        </div>
      </div>

      {categoryReports.length === 0 ? <div className="rounded-3xl border border-sage-100 bg-white px-5 py-12 text-center"><p className="font-black text-sage-900">Nenhuma denúncia encontrada</p><p className="mt-1 text-sm text-neutral-500">Ajuste os filtros ou volte à Visão Geral.</p></div> : categoryReports.map((report) => {
        const deadline = reportDeadline(report, now)
        const admin = ADMIN_ACCOUNTS.find((account) => account.id === report.responsibleId)
        const attention = category === "near" || category === "overdue" || category === "bo"
        return <button key={report.id} onClick={() => onSelect(report.id)} className={`block w-full rounded-2xl border p-4 text-left active:opacity-75 ${attention ? "border-orange-200 bg-orange-50" : "border-sage-100 bg-white"}`}>
          <div className="flex items-start justify-between gap-3"><span className="font-black text-sage-900">{report.id}</span><span className={`rounded-full px-2.5 py-1 text-xs font-black ${attention ? "bg-orange-100 text-orange-800" : "bg-sage-50 text-sage-700"}`}>{category === "extra" ? "Prazo extraordinário" : report.status}</span></div>
          <p className="mt-1 text-sm font-bold text-neutral-800">{report.type}</p>
          <div className="mt-3 space-y-1 text-xs text-neutral-600">
            <p>Recebida em: <strong>{formatDate(report.submittedAt)}</strong></p>
            <p>Responsável: <strong>{admin?.nome ?? "Não atribuído"}</strong></p>
            {category === "analysis" && <><p>Assumida em: <strong>{formatDate(report.assumedAt ?? report.analyzedAt)}</strong></p><p>Em análise desde: <strong>{formatDate(report.analyzedAt)}</strong></p></>}
            {category === "answered" && <p>Concluída em: <strong>{formatDate(report.completedAt)}</strong></p>}
            {category === "overdue" && <><p>Prazo inicial encerrado em: <strong>{formatDate(deadline.initial.toISOString())}</strong></p><p className="font-black text-orange-800">{businessDaysOverdue(deadline.initial, now)} dias úteis em atraso</p></>}
            {category === "extra" && <><p>Prazo extraordinário iniciado em: <strong>{formatDate(deadline.initial.toISOString())}</strong></p><p>Data limite: <strong>{formatDate(deadline.extra.toISOString())}</strong></p></>}
            {category === "bo" && <><p>Prazo inicial: <strong>{formatDate(deadline.initial.toISOString())}</strong></p><p>Prazo extraordinário: <strong>{formatDate(deadline.extra.toISOString())}</strong></p><p className="font-black text-orange-800">{businessDaysOverdue(deadline.extra, now)} dias úteis além dos dois prazos</p></>}
          </div>
          <p className={`mt-3 text-xs font-black ${attention ? "text-orange-800" : "text-sage-700"}`}>{deadlineLabel(report, now)} · Abrir denúncia →</p>
        </button>
      })}
    </main> : <main className="space-y-4 px-5 py-6">
      <div><h2 className="text-lg font-black text-sage-900">Conversas com Coordenadores</h2><p className="text-sm text-neutral-500">Canal privado para acompanhar as denúncias.</p></div>
      {ADMIN_ACCOUNTS.map((admin) => <button key={admin.id} onClick={() => setCoordinator(admin.id)} className={`w-full rounded-2xl border p-4 text-left ${coordinator === admin.id ? "border-sage-500 bg-sage-50" : "border-sage-100 bg-white"}`}>
        <span className="text-sm font-black text-sage-900">{admin.nome}</span><span className="block text-xs text-neutral-500">{reports.filter((r) => r.responsibleId === admin.id).map((r) => r.id).join(", ") || "Nenhuma denúncia atribuída"}</span>
      </button>)}
      {coordinator && <section><h3 className="mb-2 text-sm font-black text-sage-900">Conversa com {ADMIN_ACCOUNTS.find((a) => a.id === coordinator)?.nome}</h3><ReportConversation viewer="director" messages={messages[coordinator]} onSend={(text) => onSend(coordinator, text)} /></section>}
    </main>}
  </div>
}
