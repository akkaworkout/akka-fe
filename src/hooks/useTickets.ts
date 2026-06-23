import { useState, useEffect } from 'react'

import api from '../api/api'

import {
  createTicket,
  deleteTicket,
  endTicket,
} from '@/api/ticketApi'

import { type Exercise } from '@/components/summaryCard/SummaryCard'

export type TicketItem = {
  id: number
  user_id: number
  exercise_type: string
  color_code: string
  color?: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count?: number
  total_amount?: number
  refund_amount?: number
  status?: string
  end_reason?: string
  created_at?: string
  start_date?: string
  end_date?: string
  remaining_count?: number
  forfeited_amount?: number
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 티켓 조회
  const getTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await api.get('/tickets')

      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : []

      setTickets(list)
    } catch (error: any) {
      console.error('티켓 조회 실패:', error)

      setError('티켓 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 티켓 생성
  const handleCreateTicket = async (
    data: any,
    onSuccess?: () => void,
  ) => {
    try {
      await createTicket(data)

      alert('이용권 등록이 완료되었습니다.')

      await getTickets()

      onSuccess?.()
    } catch (error: any) {
      console.error('이용권 등록 실패:', error)

      alert(
        error?.response?.data?.message ??
        '이용권 등록에 실패했습니다.'
      )
    }
  }

  // 티켓 삭제
  const handleDeleteTicket = async (
    ticketId: number,
    onSuccess?: () => void,
  ) => {
    try {
      await deleteTicket(ticketId)

      setTickets(prev =>
        prev.filter(ticket => ticket.id !== ticketId),
      )

      alert('이용권이 정상적으로 삭제되었습니다.')

      onSuccess?.()
    } catch (error) {
      console.log('DELETE 실패:', error)
      alert('이용권 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 티켓 종료
  const handleEndTicket = async (
    ticketId: number,
    endReason: Exercise,
    refundAmount: string,
    onSuccess?: () => void,
  ) => {
    try {
      await endTicket(
        ticketId,
        endReason,
        refundAmount,
      )

      alert('이용권이 정상적으로 종료되었습니다.')

      await getTickets()

      onSuccess?.()
    } catch (error) {
      console.log('PATCH 실패:', error)
      alert('이용권 종료에 실패했습니다. 다시 시도해주세요.')
    }
  }

  useEffect(() => {
    getTickets()
  }, [])

  return {
    tickets,
    loading,
    error,
    refetch: getTickets,

    handleCreateTicket,
    handleDeleteTicket,
    handleEndTicket,
  }
}