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

type CalendarRecordResponse = {
  date: string
  name: string
  color: string
  type: string
}

type TodayItemResponse = {
  id: number
  date: string
  type: 'exercise' | 'expense' | 'ticket'
  exercise_type?: string
  success?: 1 | 0 | boolean
  color: string
  cost?: number
  memo?: string
  title?: string
  amount?: number
}

const mapSchedule = (
  item: CalendarRecordResponse
): Schedule => ({
  date: item.date.slice(0, 10),
  label: item.name,
  color: item.color,
  type: item.type,
})

const mapTodayItem = (
  item: TodayItemResponse
): TodayItem | null => {
  if (item.type === 'exercise') {
    return {
      id: item.id,
      date: item.date,
      name: item.exercise_type ?? '',
      status:
        item.success === 1
          ? '성공'
          : '실패',
      color: item.color,
      amount: item.cost ?? 0,
      memo: item.memo,
    }
  }

  if (item.type === 'expense') {
    return {
      id: item.id,
      date: item.date,
      name: item.title ?? '',
      status: '구매',
      color: item.color,
      amount: item.amount ?? 0,
    }
  }

  if (item.type === 'ticket') {
    return {
      id: item.id,
      date: item.date,
      name: item.exercise_type ?? '',
      status: '이용권 등록',
      color: item.color,
      amount: 0,
    }
  }

  return null
}

// 월 전체 운동 기록 조회
export const getCalendar = async (
  year: number,
  month: number
): Promise<Schedule[]> => {
  const { data } = await api.get(
    `/calendar?year=${year}&month=${month}`
  )

  return data.data.map(mapSchedule)
}

// 월 목표 조회
export const getGoals = async (
  year: number,
  month: number
): Promise<string[]> => {
  const { data } = await api.get(
    `/calendar/goal?year=${year}&month=${month}`
  )

  const list = data.data

  if (!Array.isArray(list)) {
    return ['', '', '']
  }

  return [
    list[0] || '',
    list[1] || '',
    list[2] || '',
  ]
}

// 월 목표 수정
export const updateGoals = async (
  year: number,
  month: number,
  goals: string[]
) => {
  const filteredGoals = goals.filter(
    goal => goal.trim() !== ''
  )

  const { data } = await api.patch(
    '/calendar/goal',
    {
      year,
      month,
      goals: filteredGoals,
    }
  )

  return data.data
}

// 월 요약 정보 조회
export const getSummary = async (
  year: number,
  month: number
): Promise<Summary> => {
  const { data } = await api.get(
    `/calendar/summary?year=${year}&month=${month}`
  )

  return data.data
}

// 특정 날짜 기록 조회
export const getTodayItems = async (
  date: string
): Promise<TodayItem[]> => {
  const { data } = await api.get(
    `/calendar/${date}`
  )

  return data.data.records
    .map(mapTodayItem)
    .filter(Boolean) as TodayItem[]
}