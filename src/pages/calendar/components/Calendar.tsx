import { useMemo } from 'react'
import { VscTriangleLeft } from 'react-icons/vsc'

import type { Schedule } from '@/api/calendarApi'

import CalendarDay from './CalendarDay'

// 스타일
import styles from '../Calendar.module.css'

type CalendarProps = {
  year: number
  month: number
  selectedYear: number
  selectedMonth: number
  selectedDate: number
  schedules: Schedule[]
  onPrevMonth: () => void
  onNextMonth: () => void
  isNextMonthDisabled: boolean
  onSelectDay: (day: number) => void
  isLoading?: boolean
}

const Calendar = ({
  year,
  month,
  selectedYear,
  selectedMonth,
  selectedDate,
  schedules,
  onPrevMonth,
  onNextMonth,
  isNextMonthDisabled,
  onSelectDay,
  isLoading = false,
}: CalendarProps) => {
  const monthIndex = month - 1
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const totalDays = new Date(year, month, 0).getDate()
  const displayMonth = String(month).padStart(2, '0')

  const getScheduleDay = (date: string) => {
    const parsedDate = new Date(date)

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getDate()
    }

    const parts = date.split(/[-.]/)
    return Number(parts[2])
  }

  const schedulesByDay = useMemo(() => {
    return schedules.reduce<Record<number, Schedule[]>>((acc, schedule) => {
      const day = getScheduleDay(schedule.date)

      if (!day) {
        return acc
      }

      if (!acc[day]) {
        acc[day] = []
      }

      acc[day].push(schedule)

      return acc
    }, {})
  }, [schedules])

  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <span className={styles.month}>
          {year}.{displayMonth}
        </span>

        <div className={styles.arrow}>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={onPrevMonth}
            aria-label="이전 달로 이동"
          >
            <VscTriangleLeft className={styles.arrowBtn} aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.arrowButton}
            onClick={onNextMonth}
            disabled={isNextMonthDisabled}
            aria-label="다음 달로 이동"
          >
            <VscTriangleLeft className={`${styles.arrowBtn} ${styles.rotate}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.week}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className={styles.weekItem}>
            {d}
          </div>
        ))}
      </div>

      <div className={styles.days}>
        {days.map((day, i) => {
          if (!day) {
            return (
              <div
                key={`empty-${i}`}
                className={`${styles.day} ${styles.emptyDay}`}
                aria-hidden="true"
              />
            )
          }

          const isSelected =
            day === selectedDate && year === selectedYear && month === selectedMonth

          return (
            <CalendarDay
              key={`${year}-${month}-${day}`}
              year={year}
              month={month}
              day={day}
              schedules={schedulesByDay[day] ?? []}
              isSelected={isSelected}
              isLoading={isLoading}
              onSelect={onSelectDay}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
