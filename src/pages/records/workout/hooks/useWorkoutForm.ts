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

  const { ticketList, allTickets, mappedTickets, remainingCount, usedCount, pricePerSession } =
    useWorkoutTickets(form.exercise.id)
  const availableTickets = recordId
    ? allTickets.map((ticket) => ({
        id: ticket.id,
        label: ticket.exercise_type,
        color: ticket.color_code,
      }))
    : mappedTickets

  const { data: exerciseDetail } = useExerciseDetailQuery(recordId)
  const previousDate = exerciseDetail?.exercise_date
    ? new Date(exerciseDetail.exercise_date)
    : undefined

  const { handleSubmit, handleUpdate, handleDelete } = useWorkoutActions(
    form,
    recordId,
    previousDate,
    allTickets,
  )

  useEffect(() => {
    if (recordId || ticketList.length === 0) return

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
  }, [recordId, ticketList])

  useEffect(() => {
    if (!exerciseDetail || allTickets.length === 0) {
      return
    }

    const isSuccess = exerciseDetail.is_success === 1 || exerciseDetail.is_success === true

    const exerciseDate = exerciseDetail.exercise_date
      ? new Date(exerciseDetail.exercise_date)
      : new Date()

    const ticket = allTickets.find((t) => t.id === exerciseDetail.ticket_id)

    setForm((prev) => ({
      ...prev,
      date: exerciseDate,
      memo: exerciseDetail.memo ?? '',
      workoutResult: isSuccess ? '성공' : '실패',
      failReason: exerciseDetail.failure_reason ?? '',
      exercise: ticket
        ? {
            id: ticket.id,
            label: ticket.exercise_type,
            color: ticket.color_code,
          }
        : prev.exercise,
    }))

    setPreviewUrl(exerciseDetail.image_url ? buildApiUrl(exerciseDetail.image_url) : null)
  }, [exerciseDetail, allTickets])

  return {
    form,
    setForm,
    mappedTickets: availableTickets,
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
