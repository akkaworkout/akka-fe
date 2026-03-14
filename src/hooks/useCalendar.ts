import { useState, useEffect } from 'react'
import { apiFetch } from '../api/api'
import { CALENDAR_ENDPOINTS } from '../api/calendar'

type Schedule = {
  date: string
  label: string
  color: string
  type: string
}

type CalendarDay = {
  date: string
  ticket?: Schedule
  visible: Schedule[]
  hiddenCount: number
}

export const useCalendar = () => {
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [calendarMap, setCalendarMap] = useState<Record<string, CalendarDay>>({})

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(prev => prev - 1)
      setMonth(11)
    } else {
      setMonth(prev => prev - 1)
    }
  }

  // 다음 달로 이동
  const handleNextMonth = () => {
    if (month === 11) {
      setYear(prev => prev + 1)
      setMonth(0)
    } else {
      setMonth(prev => prev + 1)
    }
  }

  // 일정 목록을 날짜 기준으로 정리하고 표시할 일정과 숨길 일정 계산
  const buildCalendarMap = (list: Schedule[]) => {
    const map: Record<string, CalendarDay> = {}

    list.forEach(item => {
      const key = item.date

      if (!map[key]) {
        map[key] = {
          date: key,
          visible: [],
          hiddenCount: 0
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
        day.hiddenCount = day.visible.length - 2
        day.visible = day.visible.slice(0, 2)
      }
    })

    return map
  }

  // 서버에서 캘린더 데이터를 불러오는 함수
  const getCalendar = async () => {
    try {
      const res = await apiFetch(
        `${CALENDAR_ENDPOINTS.LIST}?year=${year}&month=${month + 1}`
      )

      const data = res.data

      const mappedSchedules: Schedule[] = data.map((item: any) => ({
        date: item.date.slice(0, 10),
        label: item.name,
        color: item.color,
        type: item.type
      }))

      setSchedules(mappedSchedules)
      setCalendarMap(buildCalendarMap(mappedSchedules))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCalendar()
  }, [year, month])

  return {
    year,
    month,
    schedules,
    calendarMap,
    handlePrevMonth,
    handleNextMonth
  }
}