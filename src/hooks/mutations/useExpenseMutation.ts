import { useMutation } from '@tanstack/react-query'

import { createExpense } from '@/api/expenseApi'
import type { ExpenseForm } from '@/api/expenseApi'

export const useCreateExpenseMutation = () => {
  return useMutation({
    mutationFn: (payload: ExpenseForm) => createExpense(payload),
  })
}
