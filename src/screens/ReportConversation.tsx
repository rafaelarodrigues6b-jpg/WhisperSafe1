import { useState } from "react"
import type { ReportMessage } from "../App"

interface Props {
  messages: ReportMessage[]
  viewer: "student" | "coordinator" | "director"
  onSend?: (text: string) => void
  placeholder?: string
}

export default function ReportConversation({ messages, viewer, onSend, placeholder = "Escreva sua mensagem..." }: Props) {
  const [text, setText] = useState("")
  const send = () => {
    if (!text.trim() || !onSend) return
    onSend(text.trim())
    setText("")
  }
  return (
    <div className="rounded-3xl border border-sage-100 bg-white p-4">
      <div className="flex max-h-80 min-h-32 flex-col gap-3 overflow-y-auto pb-4" aria-live="polite">
        {messages.length === 0 && <p className="m-auto text-center text-sm text-neutral-500">Ainda não há mensagens. Inicie a conversa com segurança.</p>}
        {messages.map((message) => {
          const own = message.sender === viewer
          return <div key={message.id} className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
            <span className="mb-1 px-1 text-xs font-bold text-sage-700">{own ? "Você" : message.sender === "student" ? "Estudante" : message.sender === "director" ? "Diretor" : "Coordenador"}</span>
            {message.reportId && <span className="mb-1 px-1 text-xs text-neutral-500">Denúncia {message.reportId}</span>}
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${own ? "rounded-br-sm bg-sage-700 text-white" : "rounded-bl-sm bg-sage-50 text-neutral-800"}`}>{message.text}</div>
            <time className="mt-1 px-1 text-xs text-neutral-500" dateTime={message.at}>{new Date(message.at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
          </div>
        })}
      </div>
      {onSend && <form className="flex gap-2 border-t border-sage-100 pt-3" onSubmit={(e) => { e.preventDefault(); send() }}>
        <input aria-label="Mensagem" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 rounded-full bg-sage-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-400" />
        <button type="submit" disabled={!text.trim()} className="rounded-full bg-sage-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Enviar</button>
      </form>}
    </div>
  )
}
