import { notify } from '@/utils/notify'
import { useNavigate } from 'react-router-dom'

import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} from '@/hooks/mutations/useWorkoutMutation'

import type { WorkoutForm } from '../types/workoutTypes'
import type { Ticket } from '@/api/ticketApi'
import { isBeforeTicketRegistration } from '@/utils/date'

export const useWorkoutActions = (
  form: WorkoutForm,
  recordId?: number,
  previousDate?: Date,
  tickets: Ticket[] = [],
) => {
  const navigate = useNavigate()

  const createExerciseMutation = useCreateExerciseMutation()
  const updateExerciseMutation = useUpdateExerciseMutation()
  const deleteExerciseMutation = useDeleteExerciseMutation()

  const isExerciseDateValid = () => {
    const ticket = tickets.find((item) => item.id === form.exercise.id)
    if (!ticket?.created_at) {
      notify('이용권 등록 날짜를 확인할 수 없어요. 이용권을 다시 선택해주세요.')
      return false
    }

    if (isBeforeTicketRegistration(form.date, ticket.created_at)) {
      notify(`운동 날짜는 이용권 등록일(${ticket.created_at})보다 빠를 수 없어요.`)
      return false
    }
    return true
  }

  const isFailReasonValid = () => {
    if (form.workoutResult === '실패' && !form.failReason.trim()) {
      notify('운동에 실패한 이유를 입력해주세요.')
      return false
    }
    return true
  }

  const handleSubmit = () => {
    if (!isExerciseDateValid() || !isFailReasonValid()) return
    createExerciseMutation.mutate(form, {
      onSuccess: () => {
        notify('운동 기록을 저장했어요')
        navigate('/calendar')
      },
    })
  }

  const handleUpdate = () => {
    if (!recordId) return
    if (!isExerciseDateValid() || !isFailReasonValid()) return

    updateExerciseMutation.mutate(
      {
        recordId,
        form,
        previousDate,
      },
      {
        onSuccess: () => {
          notify('운동 기록이 수정되었어요')
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
          notify('운동 기록이 삭제되었어요')
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
