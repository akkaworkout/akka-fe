import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { ReportData } from '@/api/reportApi'
import { useInsightCalculations } from './useInsightCalculations'
import { useReportMetrics } from './useReportMetrics'

const reportData: ReportData = {
  kpi: {
    totalExerciseCount: 8,
    noShowCount: 2,
    noshowLossAmount: 24000,
  },
  goal: {
    exerciseAchievementRate: 75,
  },
  charts: {
    exerciseByDow: [0, 3, 1, 0, 2, 0, 0],
    expenseByDow: [0, 12000, 0, 8000, 0, 0, 0],
  },
  breakdown: {
    exercise: [{ label: '헬스', count: 6 }],
    noshow: [{ label: '헬스', count: 2 }],
    expense: [
      { label: '운동복', amount: 12000 },
      { label: '물', amount: 8000 },
    ],
    failMemo: [
      { date: '2026-09-01', category: '헬스', reason: '야근' },
      { date: '2026-09-02', category: '요가', reason: '감기' },
    ],
  },
}

describe('리포트 계산 훅', () => {
  it('운동 횟수와 지출 합계를 계산하고 선택한 운동의 실패 메모만 반환한다', () => {
    const { result } = renderHook(() => useReportMetrics(reportData, '헬스'))

    expect(result.current.totalExerciseCount).toBe(8)
    expect(result.current.totalExpenseAmount).toBe(20000)
    expect(result.current.noShowCount).toBe(2)
    expect(result.current.ringPercent).toBe(75)
    expect(result.current.failMemoRows).toEqual([
      { date: '2026-09-01', label: '헬스', reason: '야근' },
    ])
  })

  it('리포트 데이터가 없으면 안전한 기본값을 반환한다', () => {
    const { result } = renderHook(() => useReportMetrics(null))

    expect(result.current.totalExerciseCount).toBe(0)
    expect(result.current.totalExpenseAmount).toBe(0)
    expect(result.current.noShowCount).toBe(0)
    expect(result.current.exerciseItems).toEqual([])
    expect(result.current.failMemoRows).toEqual([])
  })

  it('가장 많이 운동한 요일과 추천값을 계산한다', () => {
    const { result } = renderHook(() => useInsightCalculations(reportData))

    expect(result.current.집중요일).toBe('화요일')
    expect(result.current.추천요일).toBe('주말')
    expect(result.current.추천횟수).toBe(3)
  })

  it('요일 데이터가 비어 있으면 일주일 기본값을 사용한다', () => {
    const { result } = renderHook(() => useInsightCalculations(null))

    expect(result.current.exerciseByDow).toEqual([0, 0, 0, 0, 0, 0, 0])
    expect(result.current.expenseByDow).toEqual([0, 0, 0, 0, 0, 0, 0])
    expect(result.current.집중요일).toBe('데이터 없음')
    expect(result.current.추천횟수).toBe(1)
  })
})
