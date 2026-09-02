import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { createTicket, deleteTicket, endTicket, type TicketCreatePayload } from '@/api/ticketApi'

import type { Exercise } from '@/components/summaryCard/SummaryCard'

type ErrorResponse = {
  message?: string
}

type EndTicketPayload = {
  ticketId: number
  endReason: Exercise
  refundAmount: string
}

export const useCreateTicketMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, TicketCreatePayload>({
    mutationFn: createTicket,
    onError: (error) => {
      console.error('createTicket failed:', error)
      alert('이용권 등록에 실패했어요')
    },
  })
}

export const useDeleteTicketMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteTicket,
    onError: (error) => {
      console.error('deleteTicket failed:', error)
      alert('이용권 삭제에 실패했어요. 다시 시도해주세요')
    },
  })
}

export const useEndTicketMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, EndTicketPayload>({
    mutationFn: ({ ticketId, endReason, refundAmount }) =>
      endTicket(ticketId, endReason, refundAmount),
    onError: (error) => {
      console.error('endTicket failed:', error)
      alert('이용권 종료에 실패했어요. 다시 시도해주세요')
    },
  })
}
