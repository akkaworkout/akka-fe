import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useReportExerciseQuery, useReportQuery } from './useReportQuery'

const getReportMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/reportApi', () => ({ getReport: getReportMock }))

describe('월간 리포트 캐시', () => {
  it('같은 달의 공통 데이터는 유지하고 처음 선택한 종목만 추가 요청한다', async () => {
    getReportMock.mockImplementation(async (_year: number, _month: number, exercise?: string) => ({
      kpi: { totalExerciseCount: 5 },
      goal: { exerciseType: exercise, exerciseAchievementRate: exercise === '헬스' ? 30 : 50 },
    }))

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )

    const { result, rerender, unmount } = renderHook(
      ({ exercise }: { exercise: string }) => {
        const monthData = useReportQuery(2026, 9, exercise)
        const goalData = useReportExerciseQuery(2026, 9, exercise, Boolean(monthData.data))
        return { monthData, goalData }
      },
      { wrapper, initialProps: { exercise: '헬스' } },
    )

    await waitFor(() => expect(result.current.goalData.data?.goal?.exerciseType).toBe('헬스'))
    expect(getReportMock).toHaveBeenCalledTimes(1)

    rerender({ exercise: '수영' })
    await waitFor(() => expect(result.current.goalData.data?.goal?.exerciseType).toBe('수영'))
    expect(result.current.monthData.data?.kpi?.totalExerciseCount).toBe(5)
    expect(getReportMock).toHaveBeenCalledTimes(2)

    rerender({ exercise: '헬스' })
    await waitFor(() => expect(result.current.goalData.data?.goal?.exerciseType).toBe('헬스'))
    expect(getReportMock).toHaveBeenCalledTimes(2)

    unmount()
    client.clear()
  })
})
