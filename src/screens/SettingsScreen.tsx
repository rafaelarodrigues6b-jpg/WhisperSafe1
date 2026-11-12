import { useState } from "react"
import type { UserData } from "../App"

const SAGE = "#c2d4bc"
const SAGE_DARK = "#a8bfa2"
const CARD_ALT = "#eaf2e6"
const CARD_BG = "#dce9d8"
const AVATAR_BG = "#8aad84"
const TEXT = "#1e1e1e"

interface Props {
  user: UserData
  onBack: () => void
  onSave: (data: UserData) => void
  onLogout: () => void
}

const emptyUser: UserData = { nome: "", cpf: "", escola: "", gmail: "", senha: "" }

function EditField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#9ab09a" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="outline-none text-sm px-5 py-3"
        style={{
          background: SAGE,
          borderRadius: 999,
          color: TEXT,
          fontFamily: "'Nunito', sans-serif",
          border: "none",
          width: "100%",
        }}
      />
    </div>
  )
}

export default function SettingsScreen({ user = emptyUser, onBack, onSave, onLogout }: Props) {
  const [nome, setNome] = useState(user?.nome ?? "")
  const [cpf, setCpf] = useState(user?.cpf ?? "")
  const [escola, setEscola] = useState(user?.escola ?? "")
  const [gmail, setGmail] = useState(user?.gmail ?? "")
  const [senha, setSenha] = useState(user?.senha ?? "")
  const [confirmSenha, setConfirmSenha] = useState("")
  const [saved, setSaved] = useState(false)

  const displayName = nome.trim() || gmail.split("@")[0] || "Estudante"
  const inicial = displayName[0]?.toUpperCase() ?? "E"
  const senhasMismatch = confirmSenha.length > 0 && senha !== confirmSenha

  const handleSave = () => {
    if (senhasMismatch) return
    onSave({ nome, cpf, escola, gmail, senha })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}
    >
      {/* Back */}
      <div className="px-5 pt-12 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#5a8a5e" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      {/* Avatar + name preview */}
      <div className="flex flex-col items-center pt-4 pb-6 px-5">
        <div
          className="flex items-center justify-center font-black text-white mb-3"
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: AVATAR_BG, fontSize: 32,
            fontFamily: "'Nunito',sans-serif",
          }}
        >
          {inicial}
        </div>
        <h1 className="font-black text-xl" style={{ color: TEXT }}>{displayName}</h1>
        {escola.trim() && (
          <p className="text-sm mt-0.5" style={{ color: "#9ab09a" }}>{escola}</p>
        )}
        {gmail.trim() && (
          <p className="text-xs mt-0.5" style={{ color: "#b0c8b0" }}>{gmail}</p>
        )}
      </div>

      <div className="flex flex-col gap-5 px-5 pb-10">

        {/* Personal info section */}
        <div className="rounded-3xl px-5 py-5 flex flex-col gap-4" style={{ background: CARD_ALT }}>
          <p className="font-black text-sm" style={{ color: TEXT }}>Dados pessoais</p>
          <EditField label="Nome completo" value={nome} onChange={setNome} placeholder="Seu nome" />
          <EditField label="CPF" value={cpf} onChange={setCpf} placeholder="000.000.000-00" />
          <EditField label="Gmail escolar" type="email" value={gmail} onChange={setGmail} placeholder="voce@escola.edu.br" />
          <EditField label="Escola" value={escola} onChange={setEscola} placeholder="Nome da escola" />
        </div>

        {/* Password section */}
        <div className="rounded-3xl px-5 py-5 flex flex-col gap-4" style={{ background: CARD_ALT }}>
          <p className="font-black text-sm" style={{ color: TEXT }}>Alterar senha</p>
          <EditField label="Nova senha" type="password" value={senha} onChange={setSenha} />
          <EditField label="Confirmar nova senha" type="password" value={confirmSenha} onChange={setConfirmSenha} />
          {senhasMismatch && (
            <p className="text-xs font-semibold px-2" style={{ color: "#c05a2a" }}>
              As senhas não coincidem.
            </p>
          )}
        </div>

        {/* Privacy note */}
        <div className="rounded-3xl px-5 py-4 flex items-start gap-3" style={{ background: CARD_BG }}>
          <span className="text-xl flex-shrink-0">🔒</span>
          <p className="text-xs leading-relaxed" style={{ color: "#3a6a3e" }}>
            Seus dados são salvos localmente. As alterações feitas aqui também serão refletidas na tela de login.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={senhasMismatch}
          className="w-full py-4 rounded-3xl font-black text-sm transition-all active:opacity-75"
          style={{
            background: saved ? "#8aad84" : SAGE_DARK,
            color: TEXT,
            border: "none",
            opacity: senhasMismatch ? 0.45 : 1,
          }}
        >
          {saved ? "✓  Dados salvos!" : "Salvar alterações"}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-4 rounded-3xl font-black text-sm active:opacity-75"
          style={{
            background: "transparent",
            border: "1.5px solid #f5d9c8",
            color: "#c05a2a",
          }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  )
}
