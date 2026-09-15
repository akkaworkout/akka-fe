import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DateSelect from './DateSelect'

describe('DateSelect', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 8, 15))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('기본 날짜 선택기는 현재 달 이후로 이동할 수 없다', () => {
    render(<DateSelect value={new Date(2026, 8, 15)} onChange={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /2026\.09\.15/ }))

    expect(screen.getByRole('button', { name: '다음 달로 이동' })).toBeDisabled()
  })

  it('이용권 날짜 선택기는 다음 달 날짜를 고를 수 있다', () => {
    const onChange = vi.fn()
    render(<DateSelect value={new Date(2026, 8, 15)} onChange={onChange} allowFutureMonths />)

    fireEvent.click(screen.getByRole('button', { name: /2026\.09\.15/ }))
    fireEvent.click(screen.getByRole('button', { name: '다음 달로 이동' }))

    expect(screen.getByText('2026년 10월')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '14' }))
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 14))
  })
})
