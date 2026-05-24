import { useState, useEffect } from 'react'
import { apiFetch } from '../api/api'

export type ReportKPI = {
  totalExerciseCount?: number
  noShowCount?: number
  noshowLossAmount?: number
  totalExpenseAmount?: number
}

export type ReportBreakdown = {
  exercise?: { label: string; count: number }[]
  noshow?: { label: string; count: number }[]
  expense?: { label: string; amount: number }[]
  failMemo?: { date: string; category: string; reason: string }[]
}

export type ReportCharts = {
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

export const useReportData = (
  year: number,
  month: number,
  exerciseType: string
) => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  // 리포트 조회
  const getReportData = async () => {
    try {
      setLoading(true)
      const res = await apiFetch(
        `/reports?year=${year}&month=${month}&exerciseType=${encodeURIComponent(exerciseType)}`
      )
      
      const data = res?.data ?? null
      setReportData(data)
    } catch (error) {
      console.error('리포트 조회 실패:', error)
      setReportData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getReportData()
  }, [year, month, exerciseType])

  return {
    reportData,
    loading,
    refetch: getReportData
  }
}