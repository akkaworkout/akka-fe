import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { createExercise, updateExercise, deleteExercise } from '@/api/workoutApi'
import { reportQueryKeys } from '@/hooks/queries/useReportQuery'

import type { WorkoutForm } from '@/pages/records/workout/types/workoutTypes'

type ErrorResponse = {
  message?: string
}

type UpdateExercisePayload = {
  recordId: number
  form: WorkoutForm
  previousDate?: Date
}

type DeleteExercisePayload = {
  recordId: number
  date: Date
}

const getReportMonth = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
})

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, AxiosError<ErrorResponse>, WorkoutForm>({
    mutationFn: createExercise,
    onSuccess: async (_data, form) => {
      const { year, month } = getReportMonth(form.date)

      await queryClient.invalidateQueries({ queryKey: reportQueryKeys.month(year, month) })
    },
  })
}

export const useUpdateExerciseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, AxiosError<ErrorResponse>, UpdateExercisePayload>({
    mutationFn: ({ recordId, form }) => updateExercise(recordId, form),
    onSuccess: async (_data, { form, previousDate }) => {
      const currentMonth = getReportMonth(form.date)
      const months = new Map([[`${currentMonth.year}-${currentMonth.month}`, currentMonth]])

      if (previousDate) {
        const previousMonth = getReportMonth(previousDate)
        months.set(`${previousMonth.year}-${previousMonth.month}`, previousMonth)
      }

      await Promise.all(
        Array.from(months.values()).map(({ year, month }) =>
          queryClient.invalidateQueries({ queryKey: reportQueryKeys.month(year, month) }),
        ),
      )
    },
  })
}

export const useDeleteExerciseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, AxiosError<ErrorResponse>, DeleteExercisePayload>({
    mutationFn: ({ recordId }) => deleteExercise(recordId),
    onSuccess: async (_data, { date }) => {
      const { year, month } = getReportMonth(date)

      await queryClient.invalidateQueries({ queryKey: reportQueryKeys.month(year, month) })
    },
  })
}
