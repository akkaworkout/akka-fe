import api from '@/api/api'

const buildExerciseFormData = (form: any) => {
  const formData = new FormData()

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  formData.append(
    'exercise_date',
    formatDate(form.date)
  )

  formData.append(
    'success',
    form.workoutResult === '성공'
      ? 'true'
      : 'false'
  )

  formData.append('memo', form.memo)

  formData.append(
    'ticket_id',
    String(form.exercise.id)
  )

  if (form.workoutResult === '실패') {
    formData.append(
      'fail_reason',
      form.failReason
    )
  }

  if (form.imageFile) {
    formData.append('image', form.imageFile)
  }

  return formData
}

export const getActiveTickets = async () => {
  const response = await api.get(
    '/tickets/active'
  )

  return response.data
}

export const getExerciseSummary = async (
  ticketId: number
) => {
  const response = await api.get(
    `/tickets/${ticketId}/summary`
  )

  return response.data
}

export const createExercise = async (
  form: any
) => {
  const formData = buildExerciseFormData(form)

  const response = await api.post(
    '/exercise-record',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const updateExercise = async (
  recordId: number,
  form: any
) => {
  const formData = buildExerciseFormData(form)

  const response = await api.patch(
    `/exercise-record/${recordId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const deleteExercise = async (
  recordId: number
) => {
  const response = await api.delete(
    `/exercise-record/${recordId}`
  )

  return response.data
}

export const getExerciseDetail = async (
  recordId: number
) => {
  const response = await api.get(
    `/exercise-record/${recordId}`
  )

  return response.data
}