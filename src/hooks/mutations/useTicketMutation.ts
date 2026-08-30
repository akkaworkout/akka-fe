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
  })
}

export const useDeleteTicketMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteTicket,
  })
}

export const useEndTicketMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, EndTicketPayload>({
    mutationFn: ({ ticketId, endReason, refundAmount }) =>
      endTicket(ticketId, endReason, refundAmount),
  })
}
