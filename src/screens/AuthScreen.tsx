import { useState } from "react"
import type { UserData } from "../App"
import { ADMIN_ACCOUNTS, DIRECTOR_ACCOUNT } from "../App"
import BrandLogo from "../components/BrandLogo"

interface Props {
  initialData?: UserData
  onLogin: (data: UserData) => void
}

const SAGE = "#c2d4bc"
const SAGE_DARK = "#a8bfa2"
const TEXT = "#1e1e1e"
const emptyData: UserData = { nome: "", cpf: "", escola: "", gmail: "", senha: "" }

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold" style={{ color: "#2a2a2a" }}>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

export default function AuthScreen({ initialData = emptyData, onLogin }: Props) {
  const [nome, setNome] = useState(initialData?.nome ?? "")
  const [cpf, setCpf] = useState(initialData?.cpf ?? "")
  const [senha, setSenha] = useState(initialData?.senha ?? "")
  const [escola, setEscola] = useState(initialData?.escola ?? "")
  const [gmail, setGmail] = useState(initialData?.gmail ?? "")
  const [showAdminHint, setShowAdminHint] = useState(false)

  // Detect if CPF matches an admin account to show hint
  const isAdminCpf = ADMIN_ACCOUNTS.some(
    (a) => a.cpf === cpf.trim().toUpperCase()
  ) || cpf.trim().toUpperCase() === DIRECTOR_ACCOUNT.cpf

  const handleLogin = () => {
    onLogin({ nome, cpf, escola, gmail, senha })
  }

  return (
    <div
      className="flex flex-col items-center min-h-screen px-10 pt-16 pb-12"
      style={{ background: "#ffffff", fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Official brand */}
      <div className="mb-10">
        <BrandLogo size="lg" stacked />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Admin-only fields collapse when admin CPF detected */}
        {!isAdminCpf && (
          <Field label="Nome completo" placeholder="Seu nome" value={nome} onChange={setNome} />
        )}
        <Field label="CPF" placeholder="000.000.000-00 ou código admin" value={cpf} onChange={setCpf} />
        <Field label="Senha" type="password" placeholder="" value={senha} onChange={setSenha} />
        {!isAdminCpf && (
          <>
            <Field label="Escola" placeholder="Nome da escola" value={escola} onChange={setEscola} />
            <Field label="Gmail escolar" type="email" placeholder="voce@escola.edu.br" value={gmail} onChange={setGmail} />
          </>
        )}

        {isAdminCpf && (
          <div
            className="rounded-2xl px-4 py-3 flex items-center gap-2"
            style={{ background: "#eaf2e6" }}
          >
            <span className="text-base">🔐</span>
            <p className="text-xs font-semibold" style={{ color: "#3a6a3e" }}>
              {cpf.trim().toUpperCase() === DIRECTOR_ACCOUNT.cpf ? "Acesso do Diretor detectado." : "Acesso de administrador detectado."}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleLogin}
        className="mt-10 font-bold text-base active:opacity-75"
        style={{
          background: SAGE_DARK, borderRadius: 999, color: TEXT,
          width: "100%", maxWidth: 280, padding: "14px 0", border: "none",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Entrar
      </button>

      {/* Admin hint toggle */}
      <button
        onClick={() => setShowAdminHint((v) => !v)}
        className="mt-5 text-xs"
        style={{ color: "#c2d4bc" }}
      >
        {showAdminHint ? "Ocultar acesso admin" : "Acesso de administrador"}
      </button>

      {showAdminHint && (
        <div
          className="mt-3 rounded-2xl px-4 py-3 w-full max-w-xs"
          style={{ background: "#f0f5f1", border: "1.5px solid #dce9d8" }}
        >
          <p className="text-xs font-black mb-1" style={{ color: "#3a6a3e" }}>Credenciais administrativas:</p>
          {ADMIN_ACCOUNTS.map((a) => (
            <p key={a.id} className="text-xs" style={{ color: "#5a8a5e" }}>
              CPF: <strong>{a.cpf}</strong> · Senha: <strong>{a.senha}</strong>
            </p>
          ))}
          <p className="mt-2 text-xs font-bold text-sage-700">Diretor: {DIRECTOR_ACCOUNT.cpf} · {DIRECTOR_ACCOUNT.senha}</p>
        </div>
      )}

      <p className="mt-5 text-xs text-center" style={{ color: "#9ab09a" }}>
        Sua identidade está protegida.
      </p>
    </div>
  )
}
