import { MemoryRouter } from 'react-router-dom'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { notify } from '@/utils/notify'

import { useWorkoutActions } from './useWorkoutActions'

const mutations = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/hooks/mutations/useWorkoutMutation', () => ({
  useCreateExerciseMutation: () => ({ mutate: mutations.create }),
  useUpdateExerciseMutation: () => ({ mutate: mutations.update }),
  useDeleteExerciseMutation: () => ({ mutate: mutations.delete }),
}))

vi.mock('@/utils/notify', () => ({ notify: vi.fn() }))

describe('useWorkoutActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('실패 이유가 비어 있으면 운동 기록을 등록하지 않는다', () => {
    const form = {
      date: new Date(2026, 8, 14),
      workoutResult: '실패' as const,
      memo: '',
      failReason: '  ',
      exercise: { id: 4, label: '헬스', color: '#D7EDFF' },
      imageFile: null,
    }
    const tickets = [
      {
        id: 4,
        user_id: 5,
        exercise_type: '헬스',
        color_code: '#D7EDFF',
        ticket_type: 'COUNT' as const,
        created_at: '2026-09-01',
      },
    ]

    const { result } = renderHook(() => useWorkoutActions(form, undefined, undefined, tickets), {
      wrapper: MemoryRouter,
    })

    act(() => result.current.handleSubmit())

    expect(mutations.create).not.toHaveBeenCalled()
    expect(notify).toHaveBeenCalledWith('운동에 실패한 이유를 입력해주세요.')
  })
})
