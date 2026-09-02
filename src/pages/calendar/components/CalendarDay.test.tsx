import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CalendarDay from './CalendarDay'

describe('CalendarDay', () => {
  it('이용권과 일정 요약을 표시하고 날짜 선택을 전달한다', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <CalendarDay
        year={2026}
        month={9}
        day={3}
        schedules={[
          { date: '2026-09-03', label: '발레 이용권', color_code: '#D7D5FF', type: 'ticket' },
          { date: '2026-09-03', label: '운동 1', color_code: '#111111', type: 'exercise' },
          { date: '2026-09-03', label: '운동 2', color_code: '#222222', type: 'exercise' },
          { date: '2026-09-03', label: '운동 3', color_code: '#333333', type: 'exercise' },
          { date: '2026-09-03', label: '운동 4', color_code: '#444444', type: 'exercise' },
        ]}
        isSelected={false}
        isLoading={false}
        onSelect={onSelect}
      />,
    )

    expect(screen.getByText('발레 이용권')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '2026년 9월 3일 선택' }))

    expect(onSelect).toHaveBeenCalledWith(3)
  })
})
