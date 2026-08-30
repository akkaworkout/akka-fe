import { useMemo, useState } from 'react'

import { type Schedule } from '@/api/calendarApi'
import { useCalendarQuery } from '@/hooks/queries/useCalendarQuery'

type CalendarDay = {
  date: string
  ticket?: Schedule
  visible: Schedule[]
  hiddenCount: number
}

export const useCalendar = () => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

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
    if (month === 12) {
      setYear((prev) => prev + 1)
      setMonth(1)
    } else {
      setMonth((prev) => prev + 1)
    }
  }

  // 캘린더 데이터 정리
  const buildCalendarMap = (list: Schedule[]) => {
    const map: Record<string, CalendarDay> = {}

    list.forEach((item) => {
      const key = item.date

      if (!map[key]) {
        map[key] = {
          date: key,
          visible: [],
          hiddenCount: 0,
        }
      }

      if (item.type === 'ticket') {
        map[key].ticket = item
      } else {
        map[key].visible.push(item)
      }
    })

    Object.values(map).forEach((day) => {
      if (day.visible.length > 2) {
        day.hiddenCount = day.visible.length - 2

        day.visible = day.visible.slice(0, 2)
      }
    })

    return map
  }

  const calendarMap = useMemo(() => buildCalendarMap(schedules), [schedules])

  return {
    year,
    month,
    schedules,
    calendarMap,
    handlePrevMonth,
    handleNextMonth,
  }
}
