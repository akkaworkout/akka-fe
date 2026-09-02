import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { updateGoals } from '@/api/calendarApi'

type ErrorResponse = {
  message?: string
}

type UpdateGoalsPayload = {
  year: number
  month: number
  goals: string[]
}

export const useUpdateGoalsMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, UpdateGoalsPayload>({
    mutationFn: ({ year, month, goals }) => updateGoals(year, month, goals),
    onError: (error) => {
      console.error('updateGoals failed:', error)
      alert('목표 저장에 실패했어요. 다시 시도해주세요.')
    },
  })
}
