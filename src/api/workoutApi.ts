import api from '@/api/api'

import type { WorkoutForm } from '@/pages/records/workout/types/workoutTypes'

const buildExerciseFormData = (form: WorkoutForm) => {
  const formData = new FormData()

  const exerciseDate = formatDate(form.date)
  const success = form.workoutResult === '성공'

  formData.append('exercise_date', exerciseDate)
  formData.append('success', String(success))
  formData.append('memo', form.memo)
  formData.append('ticket_id', String(form.exercise.id))

  if (!success) {
    formData.append('fail_reason', form.failReason)
  }

  if (form.imageFile) {
    formData.append('image', form.imageFile)
  }

  return formData
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 특정 운동 기록 조회
export const getExerciseDetail = async (recordId: number) => {
  const { data } = await api.get(`/exercise-record/${recordId}`)

  return data.data
}

// 운동 기록 등록
export const createExercise = async (form: WorkoutForm) => {
  const formData = buildExerciseFormData(form)

  const { data } = await api.post('/exercise-record', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

// 운동 기록 수정
export const updateExercise = async (recordId: number, form: WorkoutForm) => {
  const formData = buildExerciseFormData(form)

  const { data } = await api.patch(`/exercise-record/${recordId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

// 운동 기록 삭제
export const deleteExercise = async (recordId: number) => {
  const { data } = await api.delete(`/exercise-record/${recordId}`)

  return data
}
