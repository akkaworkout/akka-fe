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

  // 티켓 조회
  const getTickets = async () => {
    try {
      setLoading(true)

      const { data } = await api.get('/tickets')

      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : []

      setTickets(list)
    } catch (error) {
      console.error('티켓 조회 실패:', error)
      setTickets([])
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
    } catch (error) {
      console.log('POST 실패:', error)
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
      console.log('DELETE 실패', error)
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
      console.log('PATCH 실패', error)
    }
  }

  useEffect(() => {
    getTickets()
  }, [])

  return {
    tickets,
    loading,
    refetch: getTickets,

    handleCreateTicket,
    handleDeleteTicket,
    handleEndTicket,
  }
}