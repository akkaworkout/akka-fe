import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Calendar from './Calendar'

describe('Calendar', () => {
  it('표시 중인 월의 운동 기록만 해당 날짜에 표시한다', () => {
    render(
      <Calendar
        year={2026}
        month={9}
        selectedYear={2026}
        selectedMonth={9}
        selectedDate={15}
        schedules={[
          { date: '2026-08-14', label: '8월 이용권', color_code: '#111111', type: 'ticket' },
          { date: '2026-08-14', label: '8월 운동', color_code: '#444444', type: 'exercise' },
          { date: '2026-09-14', label: '9월 이용권', color_code: '#222222', type: 'ticket' },
          { date: '2026-09-14', label: '운동', color_code: '#333333', type: 'exercise' },
        ]}
        onPrevMonth={vi.fn()}
        onNextMonth={vi.fn()}
        isNextMonthDisabled={false}
        onSelectDay={vi.fn()}
      />,
    )

    const septemberFourteenth = screen.getByRole('button', { name: '2026년 9월 14일 선택' })
    expect(within(septemberFourteenth).getByText('9월 이용권')).toBeInTheDocument()
    expect(within(septemberFourteenth).queryByText('8월 이용권')).not.toBeInTheDocument()
    expect(septemberFourteenth.querySelectorAll('span[style]')).toHaveLength(1)
  })
})
