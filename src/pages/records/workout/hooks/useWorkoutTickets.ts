import { useMemo } from 'react'

import { useTicketsQuery, useTicketSummaryQuery } from '@/hooks/queries/useTicketQuery'
import type { Ticket } from '@/api/ticketApi'

import type { Exercise } from '@/components/summaryCard/SummaryCard'

export const useWorkoutTickets = (ticketId: number) => {
  const { data: allTickets } = useTicketsQuery()
  const { data: ticketSummary } = useTicketSummaryQuery(ticketId)

  const ticketList: Ticket[] = useMemo(
    () => (allTickets ?? []).filter((ticket) => ticket.status === '진행 중'),
    [allTickets],
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
    allTickets: allTickets ?? [],
    mappedTickets,
    remainingCount: ticketSummary?.remainingCount ?? null,
    usedCount: ticketSummary?.usedCount ?? null,
    pricePerSession: ticketSummary?.amountPerSession ?? null,
  }
}
