import { useMemo } from 'react'
import type { ReportData } from '@/api/reportApi'

export const useReportMetrics = (reportData: ReportData | null, selectedExerciseType?: string) => {
  return useMemo(() => {
    const totalExerciseCount = reportData?.kpi?.totalExerciseCount ?? 0
    const noShowCount = reportData?.kpi?.noShowCount ?? 0
    const noshowLossAmount = reportData?.kpi?.noshowLossAmount ?? 0
    const ringPercent = Number(reportData?.goal?.exerciseAchievementRate ?? 0)

    const exerciseItems = reportData?.breakdown?.exercise ?? []
    const noshowItems = reportData?.breakdown?.noshow ?? []
    const expenseItems = reportData?.breakdown?.expense ?? []

    const totalExpenseAmount = expenseItems.reduce((sum, item) => sum + Number(item.amount ?? 0), 0)

    const failMemoRows =
      reportData?.breakdown?.failMemo
        ?.filter((memo) => {
          if (!selectedExerciseType) return true
          return memo.category === selectedExerciseType
        })
        .map((memo) => ({
          date: memo.date,
          label: memo.category,
          reason: memo.reason,
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
  }, [reportData, selectedExerciseType])
}
