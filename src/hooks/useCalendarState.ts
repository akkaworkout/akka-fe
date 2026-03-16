import { useState } from 'react'

export const useCalendarState = () => {
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(now.getDate())

  const handleSelectDay = (year: number, month: number, day: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setSelectedDate(day)
  }

  return {
    selectedYear,
    selectedMonth,
    selectedDate,
    handleSelectDay
  }
}