import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import TodayItemModal from './TodayItemModal'

describe('TodayItemModal', () => {
  it('이미지와 메모가 없으면 빈 영역 대신 안내 문구를 표시한다', () => {
    render(
      <MemoryRouter>
        <TodayItemModal
          item={{
            id: 1,
            date: '2026-09-03',
            name: '발레',
            status: '성공',
            amount: 10000,
          }}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('등록된 이미지가 없어요')).toBeInTheDocument()
    expect(screen.getByText('작성된 메모가 없어요')).toBeInTheDocument()
  })
})
