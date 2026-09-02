import { useNavigate } from 'react-router-dom'

import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} from '@/hooks/mutations/useWorkoutMutation'

import type { WorkoutForm } from '../types/workoutTypes'

export const useWorkoutActions = (form: WorkoutForm, recordId?: number, previousDate?: Date) => {
  const navigate = useNavigate()

  const createExerciseMutation = useCreateExerciseMutation()
  const updateExerciseMutation = useUpdateExerciseMutation()
  const deleteExerciseMutation = useDeleteExerciseMutation()

  const handleSubmit = () => {
    createExerciseMutation.mutate(form, {
      onSuccess: () => {
        alert('운동 기록을 저장했어요')
        navigate('/calendar')
      },
    })
  }

  const handleUpdate = () => {
    if (!recordId) return

    updateExerciseMutation.mutate(
      {
        recordId,
        form,
        previousDate,
      },
      {
        onSuccess: () => {
          alert('운동 기록이 수정되었어요')
          navigate('/calendar')
        },
      },
    )
  }

  const handleDelete = () => {
    if (!recordId) return

    const ok = window.confirm('정말 삭제하시겠습니까?')
    if (!ok) return

    deleteExerciseMutation.mutate(
      { recordId, date: previousDate ?? form.date },
      {
        onSuccess: () => {
          alert('운동 기록이 삭제되었어요')
          navigate('/calendar')
        },
      },
    )
  }

  return {
    handleSubmit,
    handleUpdate,
    handleDelete,
    isCreatingExercise: createExerciseMutation.isPending,
    isUpdatingExercise: updateExerciseMutation.isPending,
    isDeletingExercise: deleteExerciseMutation.isPending,
  }
}
