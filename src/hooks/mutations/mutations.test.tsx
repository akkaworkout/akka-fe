import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateExpenseMutation } from './useExpenseMutation'
import { useUpdateGoalsMutation } from './useGoalMutation'

const apiMocks = vi.hoisted(() => ({
  createExpense: vi.fn(),
  updateGoals: vi.fn(),
}))

vi.mock('@/api/expenseApi', () => ({
  createExpense: apiMocks.createExpense,
}))

vi.mock('@/api/calendarApi', () => ({
  updateGoals: apiMocks.updateGoals,
}))

const createWrapper = (queryClient: QueryClient) =>
  function TestQueryClientProvider({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

describe('Mutation 콜백', () => {
  beforeEach(() => {
    apiMocks.createExpense.mockReset()
    apiMocks.updateGoals.mockReset()
  })

  it('지출 저장에 성공하면 해당 월의 리포트 쿼리를 갱신한다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const invalidateQueries = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)
    apiMocks.createExpense.mockResolvedValue({ id: 1 })

    const { result } = renderHook(() => useCreateExpenseMutation(), {
      wrapper: createWrapper(queryClient),
    })
    const payload = {
      category: 'ETC',
      title: '운동복',
      amount: 30000,
      expense_date: '2026-09-02',
    }

    await act(async () => {
      await result.current.mutateAsync(payload)
    })

    expect(apiMocks.createExpense).toHaveBeenCalledWith(payload)
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['reports', 2026, 9],
    })
  })

  it('목표 저장에 실패하면 사용자에게 오류를 안내한다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    const error = new Error('network error')
    apiMocks.updateGoals.mockRejectedValue(error)
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const { result } = renderHook(() => useUpdateGoalsMutation(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await expect(
        result.current.mutateAsync({ year: 2026, month: 9, goals: ['주 3회 운동'] }),
      ).rejects.toThrow('network error')
    })

    expect(alert).toHaveBeenCalledWith('목표 저장에 실패했어요. 다시 시도해주세요.')
  })
})
