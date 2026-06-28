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

type ExpenseStatsResponse = {
  expenseCount: number
  totalAmount: number
  topCategory?: string | null
}

const mapExpenseStats = (
  item: ExpenseStatsResponse
): ExpenseStats => {
  return {
    expenseCount: item.expenseCount,
    totalAmount: item.totalAmount,
    topCategory:
      item.topCategory ?? '아직 기록이 없어요',
  }
}

// 기타 지출 등록
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

// 이번달 지출 통계 조회
export const getExpenseStats = async (): Promise<ExpenseStats> => {
  const { data } = await api.get(
    '/expense/stats'
  )

  return mapExpenseStats(data.data)
}