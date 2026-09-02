import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCreateExpenseMutation } from '@/hooks/mutations/useExpenseMutation'
import { formatDateForApi } from '@/utils/date'

import type { Expense } from '@/components/summaryCard/SummaryCard'

type ExpenseForm = {
  date: Date
  selectedCategory: Expense
  item: string
  amount: string
}

export const useExpenseForm = (initialCategory: Expense) => {
  const navigate = useNavigate()

  const [form, setForm] = useState<ExpenseForm>({
    date: new Date(),
    selectedCategory: initialCategory,
    item: '',
    amount: '',
  })

  const createExpenseMutation = useCreateExpenseMutation()
  const isSubmitting = createExpenseMutation.isPending

  const isFormValid = form.item.trim() !== '' && form.amount.trim() !== ''

  const handleDateChange = (date: Date) => {
    setForm((prev) => ({
      ...prev,
      date,
    }))
  }

  const handleCategoryChange = (selectedCategory: Expense) => {
    setForm((prev) => ({
      ...prev,
      selectedCategory,
    }))
  }

  const handleItemChange = (item: string) => {
    setForm((prev) => ({
      ...prev,
      item,
    }))
  }

  const handleAmountChange = (amount: string) => {
    setForm((prev) => ({
      ...prev,
      amount: amount.replace(/[^0-9]/g, ''),
    }))
  }

  const handleSubmit = () => {
    if (createExpenseMutation.isPending) return

    createExpenseMutation.mutate(
      {
        category: form.selectedCategory.value,
        title: form.item,
        amount: Number(form.amount),
        expense_date: formatDateForApi(form.date),
      },
      {
        onSuccess: () => {
          alert('운동지출 기록이 완료되었어요')
          navigate('/calendar')
        },
      },
    )
  }

  return {
    form,
    isFormValid,
    isSubmitting,
    handleDateChange,
    handleCategoryChange,
    handleItemChange,
    handleAmountChange,
    handleSubmit,
  }
}
