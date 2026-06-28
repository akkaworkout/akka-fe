import { useMemo } from 'react'

import { useActiveTicketsQuery, useTicketSummaryQuery } from '@/hooks/queries/useTicketQuery'

import type { Exercise } from '@/components/summaryCard/SummaryCard'

type Ticket = {
  id: number
  exercise_type: string
  color_code: string
}

export const useWorkoutTickets = (ticketId: number) => {
  const { data: activeTickets } = useActiveTicketsQuery()
  const { data: ticketSummary } = useTicketSummaryQuery(ticketId)

  const ticketList: Ticket[] = useMemo(
    () => activeTickets ?? [],
    [activeTickets],
  )

  const mappedTickets: Exercise[] = useMemo(
    () =>
      ticketList.map((ticket) => ({
        id: ticket.id,
        label: ticket.exercise_type,
        color: ticket.color_code,
      })),
    [ticketList],
  )

  return {
    ticketList,
    mappedTickets,
    remainingCount: ticketSummary?.remainingCount ?? null,
    usedCount: ticketSummary?.usedCount ?? null,
    pricePerSession: ticketSummary?.amountPerSession ?? null,
  }
}