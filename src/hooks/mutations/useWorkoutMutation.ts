import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import {
  createExercise,
  updateExercise,
  deleteExercise,
} from '@/api/workoutApi'

import type { WorkoutForm } from '@/pages/records/workout/types/workoutTypes'

type ErrorResponse = {
  message?: string
}

type UpdateExercisePayload = {
  recordId: number
  form: WorkoutForm
}

export const useCreateExerciseMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, WorkoutForm>({
    mutationFn: createExercise,
  })
}

export const useUpdateExerciseMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, UpdateExercisePayload>({
    mutationFn: ({ recordId, form }) =>
      updateExercise(recordId, form),
  })
}

export const useDeleteExerciseMutation = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteExercise,
  })
}