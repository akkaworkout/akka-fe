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
    onError: (error) => {
      console.error('createExercise failed:', error)
      alert(error.response?.data?.message ?? '운동 기록에 실패했어요. 잠시 후 다시 시도해주세요.')
    },
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
    onError: (error) => {
      console.error('updateExercise failed:', error)
      alert(
        error.response?.data?.message ?? '운동 기록 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
      )
    },
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
    onError: (error) => {
      console.error('deleteExercise failed:', error)
      alert(
        error.response?.data?.message ?? '운동 기록 삭제에 실패했어요. 잠시 후 다시 시도해주세요.',
      )
    },
    onSuccess: async (_data, { date }) => {
      const { year, month } = getReportMonth(date)

      await queryClient.invalidateQueries({ queryKey: reportQueryKeys.month(year, month) })
    },
  })
}
