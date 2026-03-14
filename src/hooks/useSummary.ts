import { useState, useEffect } from 'react'
import { apiFetch } from '../api/api'
import { CALENDAR_ENDPOINTS } from '../api/calendar'

type Summary = {
  totalAmount: number
  targetBudget: number
  failAmount: number
  exerciseCount: number
  targetExerciseCount: number
}

export const useSummary = (year: number, month: number) => {

  const [summary, setSummary] = useState<Summary>({
    totalAmount: 0,
    targetBudget: 0,
    failAmount: 0,
    exerciseCount: 0,
    targetExerciseCount: 0
  })

  const getSummary = async () => {
    try {

      const res = await apiFetch(
        `${CALENDAR_ENDPOINTS.SUMMARY}?year=${year}&month=${month + 1}`
      )

      setSummary(res.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSummary()
  }, [year, month])

  return {
    summary
  }
}