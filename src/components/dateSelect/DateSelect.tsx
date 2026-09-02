import { useState, useRef, useEffect } from 'react'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { VscTriangleLeft } from 'react-icons/vsc'

import { formatDateForDisplay } from '@/utils/date'

import styles from './DateSelect.module.css'

type DateSelectProps = {
  value: Date
  onChange: (date: Date) => void
  disabled?: boolean
}

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const DateSelect = ({ value, onChange, disabled }: DateSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [currentMonth, setCurrentMonth] = useState(
    new Date(value.getFullYear(), value.getMonth(), 1),
  )

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const today = new Date()
  const isNextMonthDisabled =
    year > today.getFullYear() || (year === today.getFullYear() && month >= today.getMonth())

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
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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
        disabled={disabled}
        className={styles.selectBox}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <FaRegCalendarCheck className={styles.calendarIcon} aria-hidden="true" />

        <div>{formatDateForDisplay(value)}</div>

        <IoIosArrowDown
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              aria-label="이전 달로 이동"
            >
              <VscTriangleLeft aria-hidden="true" />
            </button>

            <span>
              {year}년 {month + 1}월
            </span>

            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              disabled={isNextMonthDisabled}
              aria-label="다음 달로 이동"
            >
              <VscTriangleLeft className={styles.nextMonthIcon} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.weekdays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className={styles.days}>
            {dates.map((date, idx) =>
              date ? (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.day} ${isSameDate(date, value) ? styles.active : ''}`}
                  onClick={() => {
                    onChange?.(date)
                    setIsOpen(false)
                  }}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div key={idx} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateSelect
