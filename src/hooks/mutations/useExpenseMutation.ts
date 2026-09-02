import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createExpense } from '@/api/expenseApi'
import type { ExpenseForm } from '@/api/expenseApi'
import { reportQueryKeys } from '@/hooks/queries/useReportQuery'

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExpenseForm) => createExpense(payload),
    onError: (error) => {
      console.error('createExpense failed:', error)
      alert('지출 기록 저장에 실패했어요. 잠시 후 다시 시도해주세요.')
    },
    onSuccess: async (_data, payload) => {
      const [year, month] = payload.expense_date.split('-').map(Number)

      await queryClient.invalidateQueries({ queryKey: reportQueryKeys.month(year, month) })
    },
  })
}
