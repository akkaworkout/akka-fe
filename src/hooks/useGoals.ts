import { useState, useEffect } from 'react'
import { apiFetch } from '../api/api'
import { CALENDAR_ENDPOINTS } from '../api/calendar'

export const useGoals = (year: number, month: number) => {

  const [goals, setGoals] = useState<string[]>(["", "", ""])

  // 목표 입력 변경
  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...goals]
    updatedGoals[index] = value
    setGoals(updatedGoals)
  }

  // 목표 조회
  const getGoals = async () => {
    try {

      const res = await apiFetch(
        `${CALENDAR_ENDPOINTS.GOAL}?year=${year}&month=${month}`
      )

      const data = res.data

      if (!Array.isArray(data)) {
        setGoals(["", "", ""])
        return
      }

      const padded = [
        data[0] || "",
        data[1] || "",
        data[2] || ""
      ]

      setGoals(padded)

    } catch (error) {
      console.log(error)
    }
  }

  // 목표 저장
  const updateGoals = async () => {
    try {

      const filteredGoals = goals.filter(goal => goal.trim() !== "")

      const res = await apiFetch(
        CALENDAR_ENDPOINTS.GOAL,
        {
          method: "PATCH",
          body: JSON.stringify({
            year,
            month,
            goals: filteredGoals
          })
        }
      )

      alert("저장이 완료되었습니다.");
      return res

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGoals()
  }, [year, month])

  return {
    goals,
    setGoals,
    handleGoalChange,
    updateGoals
  }
}