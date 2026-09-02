import type { TicketCreatePayload } from '@/api/ticketApi'

import { useTicketsQuery } from '@/hooks/queries/useTicketQuery'
import {
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useEndTicketMutation,
} from '@/hooks/mutations/useTicketMutation'

import { type Exercise } from '@/components/summaryCard/SummaryCard'

export const useTickets = () => {
  const { data: tickets = [], isLoading: loading, error, refetch } = useTicketsQuery()

  const createTicketMutation = useCreateTicketMutation()
  const deleteTicketMutation = useDeleteTicketMutation()
  const endTicketMutation = useEndTicketMutation()

  // 티켓 생성
  const handleCreateTicket = (data: TicketCreatePayload, onSuccess?: () => void) => {
    createTicketMutation.mutate(data, {
      onSuccess: async () => {
        alert('이용권 등록이 완료되었어요')

        await refetch()

        onSuccess?.()
      },
    })
  }

  // 티켓 삭제
  const handleDeleteTicket = (ticketId: number, onSuccess?: () => void) => {
    deleteTicketMutation.mutate(ticketId, {
      onSuccess: async () => {
        alert('이용권이 성공적으로 삭제되었어요')

        await refetch()

        onSuccess?.()
      },
    })
  }

  // 티켓 종료
  const handleEndTicket = (
    ticketId: number,
    endReason: Exercise,
    refundAmount: string,
    onSuccess?: () => void,
  ) => {
    endTicketMutation.mutate(
      {
        ticketId,
        endReason,
        refundAmount,
      },
      {
        onSuccess: async () => {
          alert('이용권이 성공적으로 종료되었어요')

          await refetch()

          onSuccess?.()
        },
      },
    )
  }

  return {
    tickets,
    loading,
    error,
    refetch,

    isCreatingTicket: createTicketMutation.isPending,
    isDeletingTicket: deleteTicketMutation.isPending,
    isEndingTicket: endTicketMutation.isPending,

    handleCreateTicket,
    handleDeleteTicket,
    handleEndTicket,
  }
}
