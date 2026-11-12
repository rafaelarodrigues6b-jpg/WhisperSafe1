import type { Report } from "../App"

export function addBusinessDays(iso: string, days: number) {
  const date = new Date(iso)
  date.setHours(0, 0, 0, 0)
  let count = 0
  while (count < days) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() !== 0 && date.getDay() !== 6) count++
  }
  return date
}

export function businessDaysRemaining(deadline: Date, now: Date) {
  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)
  let count = 0
  while (cursor < deadline) {
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) count++
  }
  return count
}

export function businessDaysOverdue(deadline: Date, now: Date) {
  const cursor = new Date(deadline)
  cursor.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setHours(0, 0, 0, 0)
  let count = 0
  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) count++
  }
  return count
}

export function reportDeadline(report: Report, now = new Date()) {
  const initial = addBusinessDays(report.submittedAt, 15)
  const extra = addBusinessDays(report.submittedAt, 20)
  const closed = report.status === "Respondida" || report.status === "Encerrada"
  const initialExpired = now >= new Date(initial.getFullYear(), initial.getMonth(), initial.getDate() + 1)
  const extraExpired = now >= new Date(extra.getFullYear(), extra.getMonth(), extra.getDate() + 1)
  if (closed) return { phase: "closed" as const, remaining: 0, initial, extra, initialExpired, extraExpired }
  if (extraExpired) return { phase: "escalate" as const, remaining: 0, initial, extra, initialExpired, extraExpired }
  if (initialExpired) return { phase: "extra" as const, remaining: businessDaysRemaining(extra, now), initial, extra, initialExpired, extraExpired }
  const remaining = businessDaysRemaining(initial, now)
  return { phase: remaining <= 3 ? "soon" as const : "normal" as const, remaining, initial, extra, initialExpired, extraExpired }
}

export function deadlineLabel(report: Report, now = new Date()) {
  const deadline = reportDeadline(report, now)
  if (report.forwardedAt) return "Encaminhada para Boletim de Ocorrência"
  if (deadline.phase === "closed") return "Denúncia concluída"
  if (deadline.phase === "escalate") return "Prazo extraordinário ultrapassado"
  if (deadline.phase === "extra") return `Prazo extraordinário: ${deadline.remaining} dias úteis restantes`
  return `Prazo para resolução: ${deadline.remaining} dias úteis restantes`
}
