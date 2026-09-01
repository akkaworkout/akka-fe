import api from '@/api/api'

type ReportKPI = {
  totalExerciseCount?: number
  noShowCount?: number
  noshowLossAmount?: number
  totalExpenseAmount?: number
}

type ReportBreakdown = {
  exercise?: { label: string; count: number }[]
  noshow?: { label: string; count: number }[]
  expense?: { label: string; amount: number }[]
  failMemo?: { date: string; category: string; reason: string }[]
}

type ReportCharts = {
  exerciseByDow?: number[]
  expenseByDow?: number[]
}

export type ReportData = {
  period?: { year: number; month: number }
  kpi?: ReportKPI
  goal?: {
    exerciseAchievementRate?: number
  }
  charts?: ReportCharts
  breakdown?: ReportBreakdown
  summary?: unknown
}

export const getReport = async (year: number, month: number, exerciseType: string) => {
  const { data } = await api.get('/reports', {
    params: {
      year,
      month,
      exerciseType,
    },
  })

  return (data?.data ?? null) as ReportData | null
}
