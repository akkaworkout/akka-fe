import api from '@/api/api'

export type Ticket = {
  id: number
  exercise_type: string
  color_code: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count: number
  total_amount: number
  start_date: string
  end_date: string
  status: string
  refund_amount?: number
}

const mapTicket = (item: any): Ticket => {
  const statusMap: Record<string, string> = {
    COMPLETED: '완료',
    EXPIRED: '기간만료',
    REFUNDED: '환불',
  }

  const formattedStatus =
    item.status === 'ENDED'
      ? statusMap[item.end_reason] ?? '기타'
      : '진행 중'

  return {
    id: item.id,
    exercise_type: item.exercise_type,
    color_code: item.color_code,
    ticket_type: item.ticket_type,
    target_count: item.target_count,
    total_amount: item.total_amount,
    start_date: item.start_date.split('T')[0],
    end_date: item.end_date.split('T')[0],
    status: formattedStatus,
    refund_amount: item.refund_amount,
  }
}

export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await api.get('/tickets')

  return data.map(mapTicket)
}

export const createTicket = async (data: any) => {
  const payload = {
    exercise_type: data.exerciseType,
    color_code: data.colorCode,
    ticket_type: data.ticketType,
    target_count: data.targetCount,
    total_amount: data.totalAmount,
    start_date: data.startDate,
    end_date: data.endDate,
  }

  const response = await api.post('/tickets', payload)

  return response.data
}

export const deleteTicket = async (ticketId: number) => {
  const response = await api.delete(`/tickets/${ticketId}`)

  return response.data
}

export const endTicket = async (
  ticketId: number,
  endReason: any,
  refundAmount: string
) => {
  const payload = {
    end_reason:
      endReason.label === '완료'
        ? 'COMPLETED'
        : endReason.label === '기간만료'
          ? 'EXPIRED'
          : endReason.label === '환불'
            ? 'REFUNDED'
            : 'ETC',

    refund_amount:
      endReason.label === '환불'
        ? Number(refundAmount)
        : null,
  }

  const response = await api.patch(
    `/tickets/${ticketId}/end`,
    payload
  )

  return response.data
}