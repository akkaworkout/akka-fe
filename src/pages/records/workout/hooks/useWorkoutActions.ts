import { useNavigate } from 'react-router-dom'

import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} from '@/hooks/mutations/useWorkoutMutation'

import type { WorkoutForm } from '../types/workoutTypes'

export const useWorkoutActions = (form: WorkoutForm, recordId?: number) => {
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
      onError: (error) => {
        console.error(error)
        alert(error.response?.data?.message ?? '운동 기록에 실패했어요. 잠시 후 다시 시도해주세요.')
      },
    })
  }

  const handleUpdate = () => {
    if (!recordId) return

    updateExerciseMutation.mutate(
      {
        recordId,
        form,
      },
      {
        onSuccess: () => {
          alert('운동 기록이 수정되었어요')
          navigate('/calendar')
        },
        onError: (error) => {
          console.error(error)
          alert(
            error.response?.data?.message ??
              '운동 기록 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
          )
        },
      },
    )
  }

  const handleDelete = () => {
    if (!recordId) return

    const ok = window.confirm('정말 삭제하시겠습니까?')
    if (!ok) return

    deleteExerciseMutation.mutate(recordId, {
      onSuccess: () => {
        alert('운동 기록이 삭제되었어요')
        navigate('/calendar')
      },
      onError: (error) => {
        console.error(error)
        alert(
          error.response?.data?.message ??
            '운동 기록 삭제에 실패했어요. 잠시 후 다시 시도해주세요.',
        )
      },
    })
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
