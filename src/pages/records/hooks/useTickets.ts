import type { TicketCreatePayload } from '@/api/ticketApi'

import { useTicketsQuery } from '@/hooks/queries/useTicketQuery'
import {
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useEndTicketMutation,
} from '@/hooks/mutations/useTicketMutation'

import { type Exercise } from '@/components/summaryCard/SummaryCard'

export const useTickets = () => {
  const {
    data: tickets = [],
    isLoading: loading,
    error,
    refetch,
  } = useTicketsQuery()

  const createTicketMutation = useCreateTicketMutation()
  const deleteTicketMutation = useDeleteTicketMutation()
  const endTicketMutation = useEndTicketMutation()

  // 티켓 생성
  const handleCreateTicket = (
    data: TicketCreatePayload,
    onSuccess?: () => void,
  ) => {
    createTicketMutation.mutate(data, {
      onSuccess: async () => {
        alert('이용권 등록이 완료되었어요')

        await refetch()

        onSuccess?.()
      },
      onError: (error: unknown) => {
        console.error('이용권 등록 실패:', error)

        alert('이용권 등록에 실패했어요')
      },
    })
  }

  // 티켓 삭제
  const handleDeleteTicket = (
    ticketId: number,
    onSuccess?: () => void,
  ) => {
    deleteTicketMutation.mutate(ticketId, {
      onSuccess: async () => {
        alert('이용권이 성공적으로 삭제되었어요')

        await refetch()

        onSuccess?.()
      },
      onError: (error: unknown) => {
        console.error('DELETE 실패:', error)

        alert('이용권 삭제에 실패했어요. 다시 시도해주세요')
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
        onError: (error: unknown) => {
          console.error('PATCH 실패:', error)

          alert('이용권 종료에 실패했어요. 다시 시도해주세요')
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