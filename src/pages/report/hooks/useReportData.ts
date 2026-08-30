import { useCallback, useEffect, useState } from 'react'
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

export const useReportData = (year: number, month: number, exerciseType?: string) => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getReportData = useCallback(async () => {
    if (!exerciseType) {
      setReportData(null)
      setLoading(false)
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data } = await api.get('/reports', {
        params: {
          year,
          month,
          exerciseType,
        },
      })

      setReportData(data?.data ?? null)
    } catch (error) {
      console.error('리포트 조회 실패:', error)
      setError('리포트 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [year, month, exerciseType])

  useEffect(() => {
    void getReportData()
  }, [getReportData])

  return {
    reportData,
    loading,
    error,
    refetch: getReportData,
  }
}
