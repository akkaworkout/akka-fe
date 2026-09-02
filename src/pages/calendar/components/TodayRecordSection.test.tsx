import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import TodayRecordSection from './TodayRecordSection'

describe('TodayRecordSection', () => {
  it('이용권 등록 항목은 0원 대신 등록 완료로 표시한다', () => {
    render(
      <MemoryRouter>
        <TodayRecordSection
          year={2026}
          month={8}
          selectedDate={3}
          todayItems={[
            {
              id: 1,
              date: '2026-09-03',
              name: '발레',
              status: '이용권 등록',
              color_code: '#D7D5FF',
              amount: 0,
            },
          ]}
          isLoading={false}
          onItemClick={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('등록 완료')).toBeInTheDocument()
    expect(screen.queryByText('0원')).not.toBeInTheDocument()
  })
})
