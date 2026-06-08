import api from '@/api/api'

export type ExpenseForm = {
  category: string
  title: string
  amount: number
  expense_date: string
}

export type ExpenseStats = {
  expenseCount: number
  totalAmount: number
  topCategory: string
}

const mapExpenseStats = (
  item: any
): ExpenseStats => {
  return {
    expenseCount: item.expenseCount,
    totalAmount: item.totalAmount,
    topCategory:
      item.topCategory ?? '기록 없음',
  }
}

export const createExpense = async (
  data: ExpenseForm
) => {
  const payload = {
    category: data.category,
    title: data.title,
    amount: data.amount,
    expense_date: data.expense_date,
  }

  const response = await api.post(
    '/expense',
    payload
  )

  return response.data
}

export const getExpenseStats =
  async (): Promise<ExpenseStats> => {
    const { data } = await api.get(
      '/expense/stats'
    )

    return mapExpenseStats(data.data)
  }