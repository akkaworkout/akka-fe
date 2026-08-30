import api from '@/api/api'

import type { Exercise } from '@/components/summaryCard/SummaryCard'

export type Ticket = {
  id: number
  user_id: number
  exercise_type: string
  color_code: string
  color?: string

  ticket_type: 'COUNT' | 'PERIOD'

  target_count?: number
  total_amount?: number

  start_date?: string
  end_date?: string
  created_at?: string

  status?: string
  end_reason?: string

  remaining_count?: number
  refund_amount?: number
  forfeited_amount?: number
}

type TicketResponse = {
  id: number
  user_id: number
  exercise_type: string
  color_code: string
  color?: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count?: number
  total_amount?: number
  start_date?: string
  end_date?: string
  created_at?: string
  status: 'ACTIVE' | 'ENDED'
  end_reason?: 'COMPLETED' | 'EXPIRED' | 'REFUNDED' | 'ETC'
  remaining_count?: number
  refund_amount?: number
  forfeited_amount?: number
}

export type TicketCreatePayload = {
  exerciseType: string
  colorCode: string
  ticketType: 'COUNT' | 'PERIOD'
  targetCount: number
  totalAmount: number
  startDate: string
  endDate: string
}

const mapTicket = (item: TicketResponse): Ticket => {
  const statusMap: Record<string, string> = {
    COMPLETED: '완료',
    EXPIRED: '기간만료',
    REFUNDED: '환불',
  }

  const formattedStatus =
    item.status === 'ENDED'
      ? item.end_reason
        ? (statusMap[item.end_reason] ?? '기타')
        : '기타'
      : '진행 중'

  return {
    id: item.id,
    user_id: item.user_id,
    exercise_type: item.exercise_type,
    color_code: item.color_code,
    color: item.color,

    ticket_type: item.ticket_type,

    target_count: item.target_count,
    total_amount: item.total_amount,

    start_date: item.start_date?.split('T')[0],
    end_date: item.end_date?.split('T')[0],
    created_at: item.created_at?.split('T')[0],

    status: formattedStatus,
    end_reason: item.end_reason,

    remaining_count: item.remaining_count,
    refund_amount: item.refund_amount,
    forfeited_amount: item.forfeited_amount,
  }
}

// 전체 이용권 조회
export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await api.get('/tickets')

  return data.data.map(mapTicket)
}

// 진행 중인 이용권 조회
export const getActiveTickets = async (): Promise<Ticket[]> => {
  const { data } = await api.get('/tickets/active')

  return data.data
}

// 이용권 요약 정보 조회
export const getTicketSummary = async (ticketId: number) => {
  const { data } = await api.get(`/tickets/${ticketId}/summary`)

  return data.data
}

// 이용권 등록
export const createTicket = async (form: TicketCreatePayload) => {
  const payload = {
    exercise_type: form.exerciseType,
    color_code: form.colorCode,
    ticket_type: form.ticketType,
    target_count: form.targetCount,
    total_amount: form.totalAmount,
    start_date: form.startDate,
    end_date: form.endDate,
  }

  const { data } = await api.post('/tickets', payload)

  return data.data
}

// 이용권 삭제
export const deleteTicket = async (ticketId: number) => {
  const { data } = await api.delete(`/tickets/${ticketId}`)

  return data.data
}

// 이용권 종료
export const endTicket = async (ticketId: number, endReason: Exercise, refundAmount: string) => {
  const payload = {
    end_reason:
      endReason.label === '완료'
        ? 'COMPLETED'
        : endReason.label === '기간만료'
          ? 'EXPIRED'
          : endReason.label === '환불'
            ? 'REFUNDED'
            : 'ETC',

    refund_amount: endReason.label === '환불' ? Number(refundAmount) : null,
  }

  const { data } = await api.patch(`/tickets/${ticketId}/end`, payload)

  return data.data
}
