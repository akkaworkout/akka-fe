import ticketIcon from '@/assets/images/ticket.png'
import type { Schedule } from '@/api/calendarApi'

import styles from '../Calendar.module.css'

type Props = {
  year: number
  month: number
  day: number
  schedules: Schedule[]
  isSelected: boolean
  isLoading: boolean
  onSelect: (day: number) => void
}

const CalendarDay = ({ year, month, day, schedules, isSelected, isLoading, onSelect }: Props) => {
  const tickets = schedules.filter((schedule) => schedule.type === 'ticket')
  const normalSchedules = schedules.filter((schedule) => schedule.type !== 'ticket')
  const ticketTooltip = tickets.map((ticket) => ticket.label).join(', ')
  const visibleDots = normalSchedules.slice(0, 3)
  const hiddenCount = normalSchedules.length - visibleDots.length

  return (
    <button
      type="button"
      className={`${styles.day} ${isSelected ? styles.activeDay : ''}`}
      onClick={() => {
        if (isSelected) return

        onSelect(day)
      }}
      aria-pressed={isSelected}
      aria-label={`${year}년 ${month}월 ${day}일 선택`}
    >
      {!isLoading && tickets.length > 0 && (
        <div className={styles.ticketWrapper}>
          <img src={ticketIcon} className={styles.ticketIcon} alt="" aria-hidden="true" />
          <div className={styles.ticketTooltip}>{ticketTooltip}</div>
        </div>
      )}

      <span className={`${styles.date} ${isSelected ? styles.activeDate : ''}`}>
        {String(day).padStart(2, '0')}
      </span>

      <div className={styles.dotContainer}>
        {isLoading ? (
          <div className={styles.skeletonDots} />
        ) : (
          <>
            {visibleDots.map((schedule, index) => (
              <span
                key={`${schedule.date}-${index}`}
                className={styles.dot}
                style={{ backgroundColor: schedule.color_code }}
              />
            ))}

            {hiddenCount > 0 && <span className={styles.moreDot}>+{hiddenCount}</span>}
          </>
        )}
      </div>
    </button>
  )
}

export default CalendarDay
