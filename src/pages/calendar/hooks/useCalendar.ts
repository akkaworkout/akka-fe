import { useState, useEffect } from 'react'

import {
  getCalendar,
  type Schedule,
} from '@/api/calendarApi'

type CalendarDay = {
  date: string
  ticket?: Schedule
  visible: Schedule[]
  hiddenCount: number
}

export const useCalendar = () => {
  const now = new Date()

  const [year, setYear] = useState(
    now.getFullYear()
  )

  const [month, setMonth] = useState(
    now.getMonth()
  )

  const [schedules, setSchedules] =
    useState<Schedule[]>([])

  const [calendarMap, setCalendarMap] =
    useState<
      Record<string, CalendarDay>
    >({})

  // 이전 달
  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(prev => prev - 1)
      setMonth(11)
    } else {
      setMonth(prev => prev - 1)
    }
  }

  // 다음 달
  const handleNextMonth = () => {
    if (month === 11) {
      setYear(prev => prev + 1)
      setMonth(0)
    } else {
      setMonth(prev => prev + 1)
    }
  }

  // 캘린더 데이터 정리
  const buildCalendarMap = (
    list: Schedule[]
  ) => {
    const map: Record<
      string,
      CalendarDay
    > = {}

    list.forEach(item => {
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

    Object.values(map).forEach(day => {
      if (day.visible.length > 2) {
        day.hiddenCount =
          day.visible.length - 2

        day.visible =
          day.visible.slice(0, 2)
      }
    })

    return map
  }

  useEffect(() => {
    const fetchCalendar =
      async () => {
        try {
          const data =
            await getCalendar(
              year,
              month
            )

          setSchedules(data)

          setCalendarMap(
            buildCalendarMap(data)
          )
        } catch (error) {
          console.log(error)
        }
      }

    fetchCalendar()
  }, [year, month])

  return {
    year,
    month,
    schedules,
    calendarMap,
    handlePrevMonth,
    handleNextMonth,
  }
}