import { useState, useEffect } from 'react'

import {
  getGoals,
  updateGoals as updateGoalsApi,
} from '@/api/calendarApi'

export const useGoals = (
  year: number,
  month: number
) => {
  const [goals, setGoals] =
    useState<string[]>([
      '',
      '',
      '',
    ])

  // 목표 입력 변경
  const handleGoalChange = (
    index: number,
    value: string
  ) => {
    const updatedGoals = [...goals]

    updatedGoals[index] = value

    setGoals(updatedGoals)
  }

  // 목표 조회
  useEffect(() => {
    const fetchGoals =
      async () => {
        try {
          const data =
            await getGoals(
              year,
              month
            )

          setGoals(data)
        } catch (error) {
          console.log(error)
        }
      }

    fetchGoals()
  }, [year, month])

  // 목표 저장
  const updateGoals = async () => {
    try {
      await updateGoalsApi(
        year,
        month,
        goals
      )

      alert('저장이 완료되었어요')
    } catch (error) {
      console.log(error)
    }
  }

  return {
    goals,
    setGoals,
    handleGoalChange,
    updateGoals,
  }
}