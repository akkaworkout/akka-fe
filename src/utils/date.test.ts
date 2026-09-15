import { describe, expect, it } from 'vitest'

import {
  clampDayToMonth,
  formatDateForApi,
  formatDateForDisplay,
  getYearMonth,
  isBeforeTicketRegistration,
  isDateRangeValid,
} from './date'

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

  it('등록일 이전 운동은 막고 등록 당일 운동은 허용한다', () => {
    expect(isBeforeTicketRegistration(new Date(2026, 8, 14), '2026-09-15')).toBe(true)
    expect(isBeforeTicketRegistration(new Date(2026, 8, 15), '2026-09-15')).toBe(false)
  })
})

describe('날짜 검증', () => {
  it('31일을 선택한 채 30일짜리 달로 이동해도 표시 달을 벗어나지 않는다', () => {
    expect(clampDayToMonth(2026, 9, 31)).toBe(30)
    expect(clampDayToMonth(2026, 8, 31)).toBe(31)
  })

  it('이용권 시작일과 종료일은 같은 날이면 시각과 관계없이 유효하다', () => {
    expect(isDateRangeValid(new Date(2026, 8, 15, 20), new Date(2026, 8, 15))).toBe(true)
    expect(isDateRangeValid(new Date(2026, 8, 16), new Date(2026, 8, 15))).toBe(false)
  })
})
