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
    mutationFn: ({ year, month, goals }) =>
      updateGoals(year, month, goals),
  })
}