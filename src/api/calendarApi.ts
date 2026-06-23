import api from '@/api/api'

export type Schedule = {
  date: string
  label: string
  color: string
  type: string
}

export type Summary = {
  totalAmount: number
  targetBudget: number
  failAmount: number
  exerciseCount: number
  targetExerciseCount: number
}

export type TodayItem = {
  id: number
  date: string
  name: string
  status:
    | '성공'
    | '실패'
    | '구매'
    | '이용권 등록'
  color: string
  amount: number
  memo?: string
  image_url?: string
}

const mapSchedule = (
  item: any
): Schedule => ({
  date: item.date.slice(0, 10),
  label: item.name,
  color: item.color,
  type: item.type,
})

const mapTodayItem = (
  item: any
): TodayItem | null => {
  if (item.type === 'exercise') {
    return {
      id: item.id,
      date: item.date,
      name: item.exercise_type,
      status:
        item.success === 1
          ? '성공'
          : '실패',
      color: item.color,
      amount: item.cost,
      memo: item.memo,
    }
  }

  if (item.type === 'expense') {
    return {
      id: item.id,
      date: item.date,
      name: item.title,
      status: '구매',
      color: item.color,
      amount: item.amount,
    }
  }

  if (item.type === 'ticket') {
    return {
      id: item.id,
      date: item.date,
      name: item.exercise_type,
      status: '이용권 등록',
      color: item.color,
      amount: 0,
    }
  }

  return null
}

export const getCalendar = async (
  year: number,
  month: number
): Promise<Schedule[]> => {
  const res = await api.get(
    `/calendar?year=${year}&month=${month + 1}`
  )

  return res.data.data.map(mapSchedule)
}

export const getGoals = async (
  year: number,
  month: number
): Promise<string[]> => {
  const res = await api.get(
    `/calendar/goal?year=${year}&month=${month}`
  )

  const data = res.data.data

  if (!Array.isArray(data)) {
    return ['', '', '']
  }

  return [
    data[0] || '',
    data[1] || '',
    data[2] || '',
  ]
}

export const updateGoals = async (
  year: number,
  month: number,
  goals: string[]
) => {
  const filteredGoals = goals.filter(
    goal => goal.trim() !== ''
  )

  const response = await api.patch(
    '/calendar/goal',
    {
      year,
      month,
      goals: filteredGoals,
    }
  )

  return response.data.data
}

export const getSummary = async (
  year: number,
  month: number
): Promise<Summary> => {
  const res = await api.get(
    `/calendar/summary?year=${year}&month=${month + 1}`
  )

  return res.data.data
}

export const getTodayItems = async (
  date: string
): Promise<TodayItem[]> => {
  const res = await api.get(
    `/calendar/${date}`
  )

  return res.data.data.records
    .map(mapTodayItem)
    .filter(Boolean) as TodayItem[]
}