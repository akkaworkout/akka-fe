import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useWorkoutForm } from './useWorkoutForm'

const tickets = [
  {
    id: 4,
    exercise_type: '헬스',
    color_code: '#D7EDFF',
    status: '환불',
    created_at: '2026-08-01',
  },
]

const exerciseDetail = {
  id: 7,
  ticket_id: 4,
  exercise_date: '2026-09-14',
  is_success: 0,
  failure_reason: '야근',
  memo: '못 갔어요',
  image_url: null,
}

vi.mock('./useWorkoutTickets', () => ({
  useWorkoutTickets: () => ({
    ticketList: [],
    allTickets: tickets,
    mappedTickets: [],
    remainingCount: 8,
    usedCount: 2,
    pricePerSession: 10000,
  }),
}))

vi.mock('@/hooks/queries/useWorkoutQuery', () => ({
  useExerciseDetailQuery: () => ({
    data: exerciseDetail,
  }),
}))

vi.mock('./useWorkoutActions', () => ({
  useWorkoutActions: () => ({
    handleSubmit: vi.fn(),
    handleUpdate: vi.fn(),
    handleDelete: vi.fn(),
  }),
}))

describe('useWorkoutForm', () => {
  it('종료된 이용권의 실패 기록도 원래 결과와 이유를 표시한다', async () => {
    const { result } = renderHook(() => useWorkoutForm(7))

    await waitFor(() => expect(result.current.form.exercise.id).toBe(4))

    expect(result.current.form.workoutResult).toBe('실패')
    expect(result.current.form.failReason).toBe('야근')
    expect(result.current.mappedTickets).toMatchObject([{ id: 4, label: '헬스' }])
  })
})
