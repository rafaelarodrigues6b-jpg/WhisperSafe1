import * as React from "react"
import { useState } from "react"
import AuthScreen from "./screens/AuthScreen"
import HomeScreen from "./screens/HomeScreen"
import CommunityScreen from "./screens/CommunityScreen"
import ReportScreen from "./screens/ReportScreen"
import SecurityHintsScreen from "./screens/SecurityHintsScreen"
import ReportStatusScreen from "./screens/ReportStatusScreen"
import EmotionalSupportScreen from "./screens/EmotionalSupportScreen"
import SettingsScreen from "./screens/SettingsScreen"
import AdminHomeScreen from "./screens/AdminHomeScreen"
import AdminReportDetailScreen from "./screens/AdminReportDetailScreen"
import CounselorChatScreen from "./screens/CounselorChatScreen"
import AdminSupportScreen from "./screens/AdminSupportScreen"
import AdminCounselorChatScreen from "./screens/AdminCounselorChatScreen"
import DirectorScreen, { type DirectorCategory } from "./screens/DirectorScreen"
import { reportDeadline } from "./lib/reportWorkflow"
import SplashScreen from "./screens/SplashScreen"

export interface UserData {
  nome: string
  cpf: string
  escola: string
  gmail: string
  senha: string
}

export interface Report {
  id: string
  type: string
  transcript: string
  date: string
  location: string
  submittedAt: string
  status: "Enviada" | "Em análise" | "Respondida" | "Encerrada"
  studentName: string
  studentCPF: string
  studentGmail: string
  studentEscola: string
  responsibleId?: AdminId
  assumedAt?: string
  analyzedAt?: string
  completedAt?: string
  completedBy?: AdminId
  forwardedAt?: string
  history?: ReportEvent[]
  messages?: ReportMessage[]
  directorMessages?: ReportMessage[]
  suggestedCategories?: string[]
  classificationConfidence?: "baixa" | "média" | "alta"
}

export interface ReportEvent { id: string; at: string; text: string }
export interface ReportMessage { id: string; at: string; text: string; sender: "student" | "coordinator" | "director"; senderId?: AdminId; reportId?: string }

export interface CounselorMessage {
  id: string
  text: string
  senderType: "student" | "counselor"
  senderName: string
  timestamp: string
}

export interface CounselorConversation {
  id: string
  studentCPF: string
  studentName: string
  studentEscola: string
  counselorId: AdminId
  counselorName: string
  messages: CounselorMessage[]
  unreadByStudent: number
  unreadByCounselor: number
  lastUpdated: string
}

export type UserRole = "student" | "admin" | "director"
export type AdminId = "admin1" | "admin2" | "admin3"
export type CounselorAvailability = Record<AdminId, boolean>

export type Screen =
  | "auth"
  | "home"
  | "community"
  | "report"
  | "security"
  | "status"
  | "support"
  | "counselor-chat"
  | "settings"
  | "admin-home"
  | "admin-detail"
  | "admin-support"
  | "admin-counselor-chat"
  | "director-home"
  | "director-detail"

// Each admin has a unique password
export const ADMIN_ACCOUNTS = [
  {
    id: "admin1" as AdminId,
    cpf: "ADMIN001",
    senha: "WhisperAdmin1",
    nome: "Orientadora Ana Lima",
    role: "Orientadora Escolar",
  },
  {
    id: "admin2" as AdminId,
    cpf: "ADMIN002",
    senha: "WhisperAdmin2",
    nome: "Orientador Carlos Souza",
    role: "Coordenador Pedagógico",
  },
  {
    id: "admin3" as AdminId,
    cpf: "ADMIN003",
    senha: "WhisperAdmin3",
    nome: "Orientadora Maria Oliveira",
    role: "Psicóloga Escolar",
  },
] as const

export const DIRECTOR_ACCOUNT = { cpf: "DIRECTOR001", senha: "WhisperDirector1", nome: "Diretor Escolar" }

const SEED_REPORTS: Report[] = [
  {
    id: "DEN-0001",
    type: "Abuso verbal",
    transcript:
      "Safira: Olá, eu sou a Safira. Estou aqui para ouvir você.\nAluno: Na terça-feira, durante o intervalo no corredor do bloco B, um colega ficou me chamando de nomes feios.\nSafira: Que difícil. Isso está acontecendo há quanto tempo?\nAluno: Já faz algumas semanas. Fiquei com vergonha na frente de todos.",
    date: "2026-07-29",
    location: "Corredor do bloco B",
    submittedAt: "2026-07-29T10:14:00",
    status: "Em análise",
    studentName: "Jordan Rivera",
    studentCPF: "123.456.789-00",
    studentGmail: "jordan@escola.edu.br",
    studentEscola: "Escola Estadual Boa Esperança",
  },
  {
    id: "DEN-0002",
    type: "Assédio",
    transcript:
      "Safira: Olá, eu sou a Safira. Estou aqui para ouvir você.\nAluno: Um grupo de alunos ficou me seguindo e fazendo comentários ruins sobre minha aparência.\nSafira: Que pesado. Isso acontece com frequência?\nAluno: Três vezes na mesma semana, na quadra.",
    date: "2026-06-12",
    location: "Quadra esportiva",
    submittedAt: "2026-06-12T14:22:00",
    status: "Encerrada",
    studentName: "Ana Pereira",
    studentCPF: "987.654.321-00",
    studentGmail: "ana@escola.edu.br",
    studentEscola: "Escola Estadual Boa Esperança",
  },
]

const emptyUser: UserData = { nome: "", cpf: "", escola: "", gmail: "", senha: "" }

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [screen, setScreen] = useState<Screen>("auth")
  const [role, setRole] = useState<UserRole | null>(null)
  const [adminId, setAdminId] = useState<AdminId | null>(null)
  const [user, setUser] = useState<UserData>(emptyUser)
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS)
  const [adminHidden, setAdminHidden] = useState<Record<AdminId, string[]>>({
    admin1: [],
    admin2: [],
    admin3: [],
  })
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [directorCategory, setDirectorCategory] = useState<DirectorCategory | null>(null)
  const [directorMessages, setDirectorMessages] = useState<Record<AdminId, ReportMessage[]>>({ admin1: [], admin2: [], admin3: [] })
  const [today, setToday] = useState(() => new Date())
  React.useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  // Counselor system
  const [counselorConversations, setCounselorConversations] = useState<CounselorConversation[]>([])
  const [counselorAvailability, setCounselorAvailability] = useState<CounselorAvailability>({
    admin1: true,
    admin2: true,
    admin3: false,
  })
  const [selectedCounselorId, setSelectedCounselorId] = useState<AdminId | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const go = (s: Screen) => setScreen(s)

  const handleLogin = (data: UserData) => {
    if (data.cpf.trim().toUpperCase() === DIRECTOR_ACCOUNT.cpf && data.senha === DIRECTOR_ACCOUNT.senha) {
      setRole("director")
      setAdminId(null)
      setUser({ ...data, nome: DIRECTOR_ACCOUNT.nome })
      setDirectorCategory(null)
      go("director-home")
      return
    }
    const admin = ADMIN_ACCOUNTS.find(
      (a) => a.cpf === data.cpf.trim().toUpperCase() && a.senha === data.senha
    )
    if (admin) {
      setRole("admin")
      setAdminId(admin.id)
      setUser({ nome: admin.nome, cpf: admin.cpf, escola: "", gmail: "", senha: data.senha })
      go("admin-home")
    } else {
      setRole("student")
      setAdminId(null)
      setUser(data)
      go("home")
    }
  }

  const handleLogout = () => {
    setRole(null)
    setAdminId(null)
    setUser(emptyUser)
    go("auth")
  }

  const handleSubmitReport = (report: Report) => {
    setReports((prev) => [report, ...prev])
  }

  const handleAdminHide = (reportId: string) => {
    if (!adminId) return
    setAdminHidden((prev) => ({
      ...prev,
      [adminId]: [...(prev[adminId] ?? []), reportId],
    }))
  }

  const changeReport = (id: string, action: "assume" | "analyze" | "complete" | "forward" | "transfer", target?: AdminId) => {
    const actor = role === "director" ? DIRECTOR_ACCOUNT.nome : ADMIN_ACCOUNTS.find((a) => a.id === adminId)?.nome
    if (!actor) return
    setReports((prev) => prev.map((report) => {
      if (report.id !== id) return report
      const authorized = role === "director" || (adminId && report.responsibleId === adminId)
      if (action === "assume" && (role !== "admin" || report.responsibleId || report.status === "Respondida" || report.status === "Encerrada")) return report
      if (action !== "assume" && action !== "transfer" && !authorized) return report
      if (action === "transfer" && (!authorized || !target || target === report.responsibleId || report.status === "Respondida" || report.status === "Encerrada")) return report
      if (action === "forward" && (role !== "director" || reportDeadline(report).phase !== "escalate" || report.forwardedAt)) return report
      if (action === "complete" && report.status !== "Em análise") return report
      if (action === "analyze" && report.status !== "Enviada") return report
      const at = new Date().toISOString()
      const name = target ? ADMIN_ACCOUNTS.find((a) => a.id === target)?.nome : actor
      const text = action === "assume" ? `Assumida por ${actor}` : action === "transfer" ? `Responsabilidade transferida por ${actor} para ${name}` : action === "analyze" ? `Colocada em análise por ${actor}` : action === "complete" ? `Concluída por ${actor}` : `Encaminhada para Boletim de Ocorrência por ${actor}`
      return {
        ...report,
        responsibleId: action === "assume" ? adminId! : action === "transfer" ? target : report.responsibleId,
        assumedAt: action === "assume" ? at : report.assumedAt,
        status: action === "analyze" ? "Em análise" : action === "complete" ? "Respondida" : report.status,
        analyzedAt: action === "analyze" ? at : report.analyzedAt,
        completedAt: action === "complete" ? at : report.completedAt,
        completedBy: action === "complete" && adminId ? adminId : report.completedBy,
        forwardedAt: action === "forward" ? at : report.forwardedAt,
        history: [...(report.history ?? []), { id: crypto.randomUUID(), at, text }],
      }
    }))
  }

  const sendReportMessage = (id: string, text: string, sender: "student" | "coordinator") => {
    setReports((prev) => prev.map((report) => {
      if (report.id !== id || !text.trim() || (sender === "student" ? role !== "student" || report.studentCPF !== user.cpf : role !== "admin" || report.responsibleId !== adminId)) return report
      const at = new Date().toISOString()
      return { ...report, messages: [...(report.messages ?? []), { id: crypto.randomUUID(), at, text: text.trim(), sender, senderId: sender === "coordinator" ? adminId! : undefined }], history: [...(report.history ?? []), { id: crypto.randomUUID(), at, text: sender === "student" ? "Estudante enviou uma mensagem" : "Coordenador enviou uma mensagem" }] }
    }))
  }

  const sendDirectorMessage = (id: AdminId, text: string, reportId?: string) => {
    if (!text.trim() || (role !== "director" && adminId !== id)) return
    const report = reports.find((r) => r.id === reportId)
    if (reportId && (!report || report.responsibleId !== id)) return
    const message: ReportMessage = { id: crypto.randomUUID(), at: new Date().toISOString(), text: text.trim(), sender: role === "director" ? "director" : "coordinator", senderId: id, reportId }
    setDirectorMessages((prev) => ({ ...prev, [id]: [...prev[id], message] }))
    if (reportId) setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, directorMessages: [...(r.directorMessages ?? []), message], history: [...(r.history ?? []), { id: crypto.randomUUID(), at: message.at, text: `${role === "director" ? "Diretor" : "Coordenador"} enviou uma mensagem ao ${role === "director" ? "coordenador" : "Diretor"}` }] } : r))
  }

  // Find or create a conversation between student and counselor
  const getOrCreateConversation = (counselorId: AdminId): CounselorConversation => {
    const existing = counselorConversations.find(
      (c) => c.studentCPF === user.cpf && c.counselorId === counselorId
    )
    if (existing) return existing
    const counselor = ADMIN_ACCOUNTS.find((a) => a.id === counselorId)!
    const newConv: CounselorConversation = {
      id: `CONV-${Date.now()}`,
      studentCPF: user.cpf,
      studentName: user.nome || user.gmail?.split("@")[0] || "Estudante",
      studentEscola: user.escola || "",
      counselorId,
      counselorName: counselor.nome,
      messages: [],
      unreadByStudent: 0,
      unreadByCounselor: 0,
      lastUpdated: new Date().toISOString(),
    }
    setCounselorConversations((prev) => [...prev, newConv])
    return newConv
  }

  const handleStudentSendMessage = (conversationId: string, text: string) => {
    const msg: CounselorMessage = {
      id: `MSG-${Date.now()}`,
      text,
      senderType: "student",
      senderName: user.nome || user.gmail?.split("@")[0] || "Estudante",
      timestamp: new Date().toISOString(),
    }
    setCounselorConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              unreadByCounselor: c.unreadByCounselor + 1,
              lastUpdated: msg.timestamp,
            }
          : c
      )
    )
  }

  const handleCounselorSendMessage = (conversationId: string, text: string) => {
    if (!adminId) return
    const counselor = ADMIN_ACCOUNTS.find((a) => a.id === adminId)!
    const msg: CounselorMessage = {
      id: `MSG-${Date.now()}`,
      text,
      senderType: "counselor",
      senderName: counselor.nome,
      timestamp: new Date().toISOString(),
    }
    setCounselorConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              unreadByStudent: c.unreadByStudent + 1,
              lastUpdated: msg.timestamp,
            }
          : c
      )
    )
  }

  const handleMarkStudentRead = (conversationId: string) => {
    setCounselorConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadByStudent: 0 } : c))
    )
  }

  const handleMarkCounselorRead = (conversationId: string) => {
    setCounselorConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadByCounselor: 0 } : c))
    )
  }

  const handleToggleAvailability = (id: AdminId) => {
    setCounselorAvailability((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const visibleReports =
    adminId ? reports.filter((r) => !(adminHidden[adminId] ?? []).includes(r.id)) : []

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? null
  const studentReports = reports.filter((r) => r.studentCPF === user.cpf)

  // Conversations visible to current admin
  const adminConversations = adminId
    ? counselorConversations.filter((c) => c.counselorId === adminId)
    : []

  const selectedConversation =
    counselorConversations.find((c) => c.id === selectedConversationId) ?? null

  // Student's conversation with selected counselor
  const studentConversation = selectedCounselorId
    ? counselorConversations.find(
        (c) => c.studentCPF === user.cpf && c.counselorId === selectedCounselorId
      ) ?? null
    : null

  if (showSplash) {
    return <SplashScreen onContinue={() => setShowSplash(false)} />
  }

  return (
    <div className="flex justify-center items-start min-h-screen" style={{ background: "#d0d8cc" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ width: "100%", maxWidth: 430, minHeight: "100svh", background: "#ffffff" }}
      >
        <div className="flex-1 overflow-y-auto">
          {screen === "auth" && <AuthScreen initialData={user} onLogin={handleLogin} />}

          {screen === "home" && role === "student" && (
            <HomeScreen
              user={user}
              onCommunity={() => go("community")}
              onReport={() => go("report")}
              onSecurity={() => go("security")}
              onStatus={() => go("status")}
              onSupport={() => go("support")}
              onSettings={() => go("settings")}
            />
          )}

          {screen === "community" && role === "student" && (
            <CommunityScreen onBack={() => go("home")} onReport={() => go("report")} />
          )}

          {screen === "report" && role === "student" && (
            <ReportScreen
              user={user}
              onBack={() => go("home")}
              onSubmit={(report) => {
                handleSubmitReport(report)
              }}
            />
          )}

          {screen === "security" && role === "student" && (
            <SecurityHintsScreen onBack={() => go("home")} />
          )}

          {screen === "status" && role === "student" && (
            <ReportStatusScreen reports={studentReports} onBack={() => go("home")} onSend={(id, text) => sendReportMessage(id, text, "student")} now={today} />
          )}

          {screen === "support" && role === "student" && (
            <EmotionalSupportScreen
              onBack={() => go("home")}
              counselorAvailability={counselorAvailability}
              onSelectCounselor={(id) => {
                setSelectedCounselorId(id)
                getOrCreateConversation(id)
                go("counselor-chat")
              }}
            />
          )}

          {screen === "counselor-chat" && role === "student" && selectedCounselorId && (
            <CounselorChatScreen
              user={user}
              counselorId={selectedCounselorId}
              conversation={studentConversation}
              onSend={(text) => {
                if (studentConversation) {
                  handleStudentSendMessage(studentConversation.id, text)
                } else {
                  const conv = getOrCreateConversation(selectedCounselorId)
                  setTimeout(() => handleStudentSendMessage(conv.id, text), 0)
                }
              }}
              onBack={() => {
                if (studentConversation) handleMarkStudentRead(studentConversation.id)
                go("support")
              }}
            />
          )}

          {screen === "settings" && role === "student" && (
            <SettingsScreen
              user={user}
              onBack={() => go("home")}
              onSave={(data) => {
                setUser(data)
                go("home")
              }}
              onLogout={handleLogout}
            />
          )}

          {screen === "admin-home" && role === "admin" && adminId && (
            <AdminHomeScreen
              adminId={adminId}
              reports={visibleReports}
              now={today}
              isAvailable={counselorAvailability[adminId]}
              onSelect={(id) => {
                setSelectedReportId(id)
                go("admin-detail")
              }}
              onHide={handleAdminHide}
              onLogout={handleLogout}
              onSupport={() => go("admin-support")}
              onToggleAvailability={() => handleToggleAvailability(adminId)}
            />
          )}

          {screen === "admin-detail" && role === "admin" && adminId && selectedReport && !(adminHidden[adminId] ?? []).includes(selectedReport.id) && (
            <AdminReportDetailScreen report={selectedReport} adminId={adminId} now={today} directorMessages={selectedReport.directorMessages ?? []} onDirectorSend={(text) => sendDirectorMessage(adminId, text, selectedReport.id)} onAction={(action, target) => changeReport(selectedReport.id, action, target)} onSend={(text) => sendReportMessage(selectedReport.id, text, "coordinator")} onBack={() => go("admin-home")} />
          )}

          {screen === "director-home" && role === "director" && (
            <DirectorScreen reports={reports} now={today} messages={directorMessages} onSend={sendDirectorMessage} onSelect={(id) => { setSelectedReportId(id); go("director-detail") }} onLogout={handleLogout} category={directorCategory} onCategoryChange={setDirectorCategory} />
          )}

          {screen === "director-detail" && role === "director" && selectedReport && (
            <AdminReportDetailScreen report={selectedReport} director now={today} directorMessages={selectedReport.directorMessages ?? []} onDirectorSend={(text) => selectedReport.responsibleId && sendDirectorMessage(selectedReport.responsibleId, text, selectedReport.id)} onAction={(action, target) => changeReport(selectedReport.id, action, target)} onBack={() => go("director-home")} />
          )}

          {screen === "admin-support" && role === "admin" && adminId && (
            <AdminSupportScreen
              adminId={adminId}
              conversations={adminConversations}
              onSelect={(id) => {
                setSelectedConversationId(id)
                handleMarkCounselorRead(id)
                go("admin-counselor-chat")
              }}
              onBack={() => go("admin-home")}
            />
          )}

          {screen === "admin-counselor-chat" && role === "admin" && selectedConversation && (
            <AdminCounselorChatScreen
              conversation={selectedConversation}
              onSend={(text) => handleCounselorSendMessage(selectedConversation.id, text)}
              onBack={() => go("admin-support")}
            />
          )}
        </div>
      </div>
    </div>
  )
}
