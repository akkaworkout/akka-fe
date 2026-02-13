import { useState, useRef, useEffect } from 'react'

import calendarIcon from '../../assets/icons/calendar.png'
import arrow from '../../assets/icons/arrow-down.png'
import styles from './DateSelect.module.css'

type DateSelectProps = {
  value: Date
  onChange?: (date: Date) => void
}

const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const DateSelect = ({ value, onChange }: DateSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [currentMonth, setCurrentMonth] = useState(
    new Date(value.getFullYear(), value.getMonth(), 1)
  )

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  const dates: (Date | null)[] = []

  for (let i = 0; i < firstDay; i++) dates.push(null)
  for (let d = 1; d <= lastDate; d++) {
    dates.push(new Date(year, month, d))
  }

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.selectBox}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <img
          className={styles.calendarIcon}
          src={calendarIcon}
          alt="calendar_icon"
        />

        <div>{formatDate(value)}</div>

        <img
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
          src={arrow}
          alt="arrow"
        />
      </button>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(new Date(year, month - 1, 1))
              }
            >
              ‹
            </button>

            <span>
              {year}년 {month + 1}월
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentMonth(new Date(year, month + 1, 1))
              }
            >
              ›
            </button>
          </div>

          <div className={styles.weekdays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className={styles.days}>
            {dates.map((date, idx) =>
              date ? (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.day} ${
                    isSameDate(date, value) ? styles.active : ''
                  }`}
                  onClick={() => {
                    onChange?.(date)
                    setIsOpen(false)
                  }}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div key={idx} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateSelect