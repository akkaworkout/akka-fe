import { useEffect, useState } from 'react'

import { buildApiUrl } from '@/api/api'

import { useExerciseDetailQuery } from '@/hooks/queries/useWorkoutQuery'

import type { WorkoutForm } from '../types/workoutTypes'
import { useWorkoutActions } from './useWorkoutActions'
import { useWorkoutTickets } from './useWorkoutTickets'

export const useWorkoutForm = (recordId?: number) => {
  const [form, setForm] = useState<WorkoutForm>({
    date: new Date(),
    workoutResult: '성공',
    memo: '',
    failReason: '',
    exercise: {
      id: 0,
      label: '',
      color: '',
    },
    imageFile: null,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { ticketList, mappedTickets, remainingCount, usedCount, pricePerSession } =
    useWorkoutTickets(form.exercise.id)

  const { data: exerciseDetail } = useExerciseDetailQuery(recordId)
  const previousDate = exerciseDetail?.exercise_date
    ? new Date(exerciseDetail.exercise_date)
    : undefined

  const { handleSubmit, handleUpdate, handleDelete } = useWorkoutActions(
    form,
    recordId,
    previousDate,
  )

  useEffect(() => {
    if (ticketList.length === 0) return

    setForm((prev) => {
      if (prev.exercise.id !== 0) return prev

      const firstTicket = ticketList[0]

      return {
        ...prev,
        exercise: {
          id: firstTicket.id,
          label: firstTicket.exercise_type,
          color: firstTicket.color_code,
        },
      }
    })
  }, [ticketList])

  useEffect(() => {
    if (!exerciseDetail || ticketList.length === 0) {
      return
    }

    const isSuccess = exerciseDetail.success === 1 || exerciseDetail.success === true

    const exerciseDate = exerciseDetail.exercise_date
      ? new Date(exerciseDetail.exercise_date)
      : new Date()

    const ticket = ticketList.find((t) => t.id === exerciseDetail.ticket_id)

    setForm((prev) => ({
      ...prev,
      date: exerciseDate,
      memo: exerciseDetail.memo ?? '',
      workoutResult: isSuccess ? '성공' : '실패',
      failReason: exerciseDetail.fail_reason ?? '',
      exercise: ticket
        ? {
            id: ticket.id,
            label: ticket.exercise_type,
            color: ticket.color_code,
          }
        : prev.exercise,
    }))

    setPreviewUrl(exerciseDetail.image_url ? buildApiUrl(exerciseDetail.image_url) : null)
  }, [exerciseDetail, ticketList])

  return {
    form,
    setForm,
    mappedTickets,
    remainingCount,
    usedCount,
    pricePerSession,
    handleSubmit,
    handleUpdate,
    handleDelete,
    previewUrl,
    setPreviewUrl,
  }
}
