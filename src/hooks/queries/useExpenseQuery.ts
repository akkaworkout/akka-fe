import { useQuery } from '@tanstack/react-query'

import { getExpenseStats } from '@/api/expenseApi'

export const useExpenseStatsQuery = () => {
  return useQuery({
    queryKey: ['expenseStats'],
    queryFn: getExpenseStats,
  })
}
