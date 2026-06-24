import { useMemo } from 'react'
import type { Exercise } from '@/components/summaryCard/SummaryCard'
import type { TicketItem } from '@/pages/records/hooks/useTickets'

const EXERCISES: Exercise[] = [
  { id: 1, label: '발레', color: 'rgb(252, 215, 255)' },
  { id: 2, label: '헬스', color: '#DAD7FF' },
  { id: 3, label: '필라테스', color: '#FFE6CC' },
  { id: 4, label: '수영', color: '#E0F0FF' },
]

function isTicketIncludedInMonth(
  ticket: TicketItem,
  year: number,
  month: number,
) {
  if (!ticket.start_date || !ticket.end_date) return false

  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0)

  const ticketStart = new Date(ticket.start_date)
  const ticketEnd = new Date(ticket.end_date)

  return ticketStart <= monthEnd && ticketEnd >= monthStart
}

export const useExerciseOptions = (
  tickets: TicketItem[],
  year: number,
  month: number,
) => {
  return useMemo(() => {
    const monthlyTickets = tickets.filter((ticket) =>
      isTicketIncludedInMonth(ticket, year, month),
    )

    const unique = new Map<string, Exercise>()

    monthlyTickets.forEach((t, idx) => {
      const label = String(t.exercise_type || '').trim()
      if (!label) return
      if (unique.has(label)) return

      unique.set(label, {
        id: idx + 1,
        label,
        color: t.color_code || t.color || '#DAD7FF',
      })
    })

    const exercises = Array.from(unique.values())

    return exercises.length ? exercises : EXERCISES
  }, [tickets, year, month])
}