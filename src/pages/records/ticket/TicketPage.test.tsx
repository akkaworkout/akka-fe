import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import TicketPage from './TicketPage'

const useTicketsMock = vi.hoisted(() => vi.fn())

vi.mock('@/pages/records/hooks/useTickets', () => ({
  useTickets: useTicketsMock,
}))

const createTicketsResult = (overrides: Record<string, unknown> = {}) => ({
  tickets: [],
  loading: false,
  error: null,
  refetch: vi.fn(),
  isCreatingTicket: false,
  isDeletingTicket: false,
  isEndingTicket: false,
  handleCreateTicket: vi.fn(),
  handleDeleteTicket: vi.fn(),
  handleEndTicket: vi.fn(),
  ...overrides,
})

const renderTicketPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/ticket']}>
        <TicketPage />
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('TicketPage 데이터 상태', () => {
  beforeEach(() => {
    useTicketsMock.mockReset()
  })

  it('이용권 목록이 비어 있으면 빈 상태를 보여준다', () => {
    useTicketsMock.mockReturnValue(createTicketsResult())

    renderTicketPage()

    expect(screen.getByText('등록된 티켓이 없어요')).toBeInTheDocument()
  })

  it('이용권 요청이 실패하면 오류 상태를 보여준다', () => {
    useTicketsMock.mockReturnValue(createTicketsResult({ error: new Error('request failed') }))

    renderTicketPage()

    expect(screen.getByText('티켓을 불러오지 못했어요')).toBeInTheDocument()
  })

  it('행을 선택하면 상세보기가 열리고 메뉴 선택은 상세보기를 열지 않는다', async () => {
    useTicketsMock.mockReturnValue(
      createTicketsResult({
        tickets: [
          {
            id: 1,
            exercise_type: '헬스',
            color_code: '#D7EDFF',
            ticket_type: 'COUNT',
            target_count: 10,
            remaining_count: 8,
            total_amount: 200000,
            start_date: '2026-09-01',
            end_date: '2026-09-30',
            status: '진행 중',
          },
        ],
      }),
    )

    const user = userEvent.setup()
    renderTicketPage()

    expect(screen.queryByText('상세 보기')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '헬스 이용권 메뉴' }))
    expect(screen.queryByText('이용권 조회')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '헬스 이용권 상세 보기' }))
    expect(screen.getByText('이용권 조회')).toBeInTheDocument()
  })
})
