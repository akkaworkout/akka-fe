import { useState } from 'react'

import { useCalendarQuery } from '@/hooks/queries/useCalendarQuery'

export const useCalendar = () => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const isNextMonthDisabled =
    year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)

  const { data: schedules = [] } = useCalendarQuery(year, month)

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((prev) => prev - 1)
      setMonth(12)
    } else {
      setMonth((prev) => prev - 1)
    }
  }

  // 다음 달로 이동
  const handleNextMonth = () => {
    const currentDate = new Date()
    const isCurrentOrFutureMonth =
      year > currentDate.getFullYear() ||
      (year === currentDate.getFullYear() && month >= currentDate.getMonth() + 1)

    if (isCurrentOrFutureMonth) return

    if (month === 12) {
      setYear((prev) => prev + 1)
      setMonth(1)
    } else {
      setMonth((prev) => prev + 1)
    }
  }

  return {
    year,
    month,
    schedules,
    handlePrevMonth,
    handleNextMonth,
    isNextMonthDisabled,
  }
}
