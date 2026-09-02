import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
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
})
