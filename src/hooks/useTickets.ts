import { useState, useEffect } from 'react'
import { apiFetch } from '../api/api'

export type TicketItem = {
  id: number
  user_id: number
  exercise_type: string
  color_code?: string
  color?: string
  ticket_type: string
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
      const res = await apiFetch('/tickets')
      
      const list = Array.isArray(res?.data) 
        ? res.data 
        : Array.isArray(res) 
          ? res 
          : []
      
      setTickets(list)
    } catch (error) {
      console.error('티켓 조회 실패:', error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTickets()
  }, [])

  return {
    tickets,
    loading,
    refetch: getTickets
  }
}