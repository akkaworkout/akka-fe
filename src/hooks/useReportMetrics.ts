import { useMemo } from 'react'

export type ReportMetrics = {
  totalExerciseCount: number
  totalExpenseAmount: number
  noShowCount: number
  noshowLossAmount: number
  ringPercent: number
  exerciseItems: { label: string; count: number }[]
  noshowItems: { label: string; count: number }[]
  failMemoRows: { date: string; label: string; reason: string }[]
  expenseItems: { label: string; amount: number }[]
}

export const useReportMetrics = (reportData: any) => {
  return useMemo(() => {
    const totalExerciseCount = reportData?.kpi?.totalExerciseCount ?? 0
    const totalExpenseAmount = reportData?.kpi?.totalExpenseAmount ?? 0
    const noShowCount = reportData?.kpi?.noShowCount ?? 0
    const noshowLossAmount = reportData?.kpi?.noshowLossAmount ?? 0
    const ringPercent = Number(reportData?.goal?.exerciseAchievementRate ?? 0)

    const exerciseItems = reportData?.breakdown?.exercise ?? []
    const noshowItems = reportData?.breakdown?.noshow ?? []
    const expenseItems = reportData?.breakdown?.expense ?? []

    const failMemoRows =
      reportData?.breakdown?.failMemo?.map((m: any) => ({
        date: m.date,
        label: m.category,
        reason: m.reason,
      })) ?? []

    return {
      totalExerciseCount,
      totalExpenseAmount,
      noShowCount,
      noshowLossAmount,
      ringPercent,
      exerciseItems,
      noshowItems,
      failMemoRows,
      expenseItems,
    }
  }, [reportData])
}