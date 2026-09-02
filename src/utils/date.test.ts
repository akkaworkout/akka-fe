import { describe, expect, it } from 'vitest'

import { formatDateForApi, formatDateForDisplay, getYearMonth } from './date'

describe('날짜 공통 함수', () => {
  const date = new Date(2026, 8, 3)

  it('로컬 날짜를 API 형식으로 변환한다', () => {
    expect(formatDateForApi(date)).toBe('2026-09-03')
  })

  it('로컬 날짜를 화면 표시 형식으로 변환한다', () => {
    expect(formatDateForDisplay(date)).toBe('2026.09.03')
  })

  it('날짜에서 연도와 1부터 시작하는 월을 반환한다', () => {
    expect(getYearMonth(date)).toEqual({ year: 2026, month: 9 })
  })
})
