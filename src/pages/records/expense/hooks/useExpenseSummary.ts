import { useExpenseStatsQuery } from '@/hooks/queries/useExpenseQuery'

export const useExpenseSummary = () => {
  const {
    data: summary = {
      expenseCount: 0,
      totalAmount: 0,
      topCategory: '기록 없음',
    },
    isLoading,
    isError,
  } = useExpenseStatsQuery()

  const status = isLoading ? 'loading' : isError ? 'error' : 'success'

  return {
    status,
    summary,
  }
}
