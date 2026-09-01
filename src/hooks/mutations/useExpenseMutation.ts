import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createExpense } from '@/api/expenseApi'
import type { ExpenseForm } from '@/api/expenseApi'
import { reportQueryKeys } from '@/hooks/queries/useReportQuery'

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExpenseForm) => createExpense(payload),
    onSuccess: async (_data, payload) => {
      const [year, month] = payload.expense_date.split('-').map(Number)

      await queryClient.invalidateQueries({ queryKey: reportQueryKeys.month(year, month) })
    },
  })
}
