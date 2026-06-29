import { useMemo } from 'react'

// 이미지
import arrowIcon from '@/assets/icons/common/chevron-left.png'
import ticketIcon from '@/assets/images/ticket.png'

// 스타일
import styles from '../Calendar.module.css'

type Schedule = {
    date: string
    label: string
    color: string
    type: string
}

type CalendarProps = {
    year: number
    month: number
    selectedYear: number
    selectedMonth: number
    selectedDate: number
    schedules: Schedule[]
    onPrevMonth: () => void
    onNextMonth: () => void
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
                        <img
                            className={styles.arrowBtn}
                            src={arrowIcon}
                            alt="prev-button"
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        type="button"
                        className={styles.arrowButton}
                        onClick={onNextMonth}
                        aria-label="다음 달로 이동"
                    >
                        <img
                            className={`${styles.arrowBtn} ${styles.rotate}`}
                            src={arrowIcon}
                            alt="next-button"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>

            <div className={styles.week}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className={styles.weekItem}>{d}</div>
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
                        day === selectedDate &&
                        year === selectedYear &&
                        month === selectedMonth

                    return (
                        <button
                            key={`${year}-${month}-${day}`}
                            type="button"
                            className={`${styles.day} ${isSelected ? styles.activeDay : ''}`}
                            onClick={() => {
                                if (isSelected) return

                                onSelectDay(day)
                            }}
                            aria-pressed={isSelected}
                            aria-label={`${year}년 ${month}월 ${day}일 선택`}
                        >
                            {(() => {
                                const daySchedules = schedulesByDay[day] ?? []

                                const tickets: Schedule[] = []
                                const normalSchedules: Schedule[] = []

                                daySchedules.forEach(s => {
                                    if (s.type === 'ticket') {
                                        tickets.push(s)
                                    } else {
                                        normalSchedules.push(s)
                                    }
                                })

                                const ticketTooltip = tickets.map(t => t.label).join(', ')
                                const visibleDots = normalSchedules.slice(0, 3)
                                const hiddenCount = normalSchedules.length - 3

                                return (
                                    <>
                                        {!isLoading && tickets.length > 0 && (
                                            <div className={styles.ticketWrapper}>
                                                <img
                                                    src={ticketIcon}
                                                    className={styles.ticketIcon}
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                                <div className={styles.ticketTooltip}>
                                                    {ticketTooltip}
                                                </div>
                                            </div>
                                        )}

                                        <span
                                            className={`${styles.date} ${isSelected ? styles.activeDate : ''
                                                }`}
                                        >
                                            {String(day).padStart(2, '0')}
                                        </span>

                                        <div className={styles.dotContainer}>
                                            {isLoading ? (
                                                <div className={styles.skeletonDots} />
                                            ) : (
                                                <>
                                                    {visibleDots.map((s, idx) => (
                                                        <span
                                                            key={`${s.date}-${idx}`}
                                                            className={styles.dot}
                                                            style={{ backgroundColor: s.color }}
                                                        />
                                                    ))}

                                                    {hiddenCount > 0 && (
                                                        <span className={styles.moreDot}>
                                                            +{hiddenCount}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )
                            })()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar