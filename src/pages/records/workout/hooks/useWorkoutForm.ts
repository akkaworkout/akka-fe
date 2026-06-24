import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getActiveTickets,
  getExerciseSummary,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseDetail,
} from '@/api/exerciseApi'

import { type Exercise } from '@/components/summaryCard/SummaryCard'

type Ticket = {
  id: number
  exercise_type: string
  color_code: string
}

type FormType = {
  date: Date
  workoutResult: '성공' | '실패'
  memo: string
  failReason: string
  exercise: {
    id: number
    label: string
    color: string
  }
  imageFile: File | null
}

export const useWorkoutForm = (
  recordId?: number
) => {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormType>({
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

  const [ticketList, setTicketList] = useState<Ticket[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [remainingCount, setRemainingCount] = useState<number | null>(null)
  const [usedCount, setUsedCount] = useState<number | null>(null)
  const [pricePerSession, setPricePerSession] = useState<number | null>(null)

  const mappedTickets: Exercise[] =
    ticketList.map(ticket => ({
      id: ticket.id,
      label: ticket.exercise_type,
      color: ticket.color_code,
    }))

  const getExercise = async () => {
    try {
      const tickets = await getActiveTickets()

      const list = tickets.data ?? []

      setTicketList(list)

      if (list.length > 0) {
        setForm(prev => ({
          ...prev,
          exercise: {
            id: list[0].id,
            label: list[0].exercise_type,
            color: list[0].color_code,
          }
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getSummary = async (ticketId: number) => {
    try {
      const response = await getExerciseSummary(ticketId)

      setRemainingCount(response.data.remainingCount)
      setUsedCount(response.data.usedCount)
      setPricePerSession(response.data.amountPerSession)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      await createExercise(form)

      alert('운동 기록을 저장했어요')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    if (!recordId) return

    try {
      await updateExercise(recordId, form)

      alert('운동 기록이 수정되었어요')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    if (!recordId) return

    const ok = window.confirm(
      '정말 삭제하시겠습니까?'
    )

    if (!ok) return

    try {
      await deleteExercise(recordId)

      alert('운동 기록이 삭제되었어요')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getExercise()
  }, [])

  useEffect(() => {
    if (!form.exercise.id) return

    getSummary(form.exercise.id)
  }, [form.exercise.id])

  useEffect(() => {
    if (!recordId || ticketList.length === 0) {
      return
    }

    const getRecord = async () => {
      try {
        const data =
          await getExerciseDetail(recordId)

        const isSuccess =
          data.success === 1 ||
          data.success === true

        const exerciseDate =
          data.exercise_date
            ? new Date(data.exercise_date)
            : new Date()

        setForm(prev => ({
          ...prev,
          date: exerciseDate,
          memo: data.memo ?? '',
          workoutResult: isSuccess
            ? '성공'
            : '실패',
          failReason: data.fail_reason ?? '',
        }))

        const ticket = ticketList.find(
          t => t.id === data.ticket_id
        )

        if (ticket) {
          setForm(prev => ({
            ...prev,
            exercise: {
              id: ticket.id,
              label: ticket.exercise_type,
              color: ticket.color_code,
            }
          }))
        }

        if (data.image_url) {
          setPreviewUrl(
            `${import.meta.env.VITE_API_URL}${data.image_url}`
          )
        } else {
          setPreviewUrl(null)
        }

      } catch (error) {
        console.error(error)
      }
    }

    getRecord()
  }, [recordId, ticketList])

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