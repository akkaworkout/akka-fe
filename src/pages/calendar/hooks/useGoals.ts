import { useEffect, useState } from 'react'

import { useGoalsQuery } from '@/hooks/queries/useCalendarQuery'
import { useUpdateGoalsMutation } from '@/hooks/mutations/useGoalMutation'

export const useGoals = (year: number, month: number) => {
  const { data = ['', '', ''] } = useGoalsQuery(year, month)
  const [goals, setGoals] = useState<string[]>(['', '', ''])
  const updateGoalsMutation = useUpdateGoalsMutation()

  useEffect(() => {
    setGoals(data)
  }, [data])

  // 목표 입력 변경
  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...goals]

    updatedGoals[index] = value

    setGoals(updatedGoals)
  }

  // 목표 저장
  const handleupdateGoals = () => {
    updateGoalsMutation.mutate(
      {
        year,
        month,
        goals,
      },
      {
        onSuccess: () => {
          alert('저장이 완료되었어요')
        },
        onError: (error: unknown) => {
          console.error(error)
          alert('목표 저장에 실패했어요. 다시 시도해주세요.')
        },
      },
    )
  }

  return {
    goals,
    setGoals,
    handleGoalChange,
    handleupdateGoals,
    isUpdatingGoals: updateGoalsMutation.isPending,
  }
}
