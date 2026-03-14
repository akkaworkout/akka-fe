import styles from './Calendar.module.css'

import arrowIcon from '../../assets/icons/chevron-left.png'
import ticketIcon from '../../assets/icons/ticket.png'

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
}: CalendarProps) => {
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const displayMonth = String(month + 1).padStart(2, '0')

    const days: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ]

    const currentMonth = `${year}-${displayMonth}`

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <span className={styles.month}>
                    {year}.{displayMonth}
                </span>

                <div className={styles.arrow}>
                    <img className={styles.arrowBtn} onClick={onPrevMonth} src={arrowIcon} />
                    <img className={`${styles.arrowBtn} ${styles.rotate}`} onClick={onNextMonth} src={arrowIcon} />
                </div>
            </div>

            <div className={styles.week}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className={styles.weekItem}>{d}</div>
                ))}
            </div>

            <div className={styles.days}>
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`${styles.day} ${day === selectedDate &&
                            year === selectedYear &&
                            month === selectedMonth
                            ? styles.activeDay
                            : ''
                            }`}
                        onClick={() => day && onSelectDay(day)}
                    >
                        {day && (() => {
                            const daySchedules = schedules.filter(
                                s => new Date(s.date).getDate() === day
                            )

                            const tickets = daySchedules.filter(s => s.type === 'ticket')
                            const ticketTooltip = tickets.map(t => t.label).join(', ')

                            const normalSchedules = daySchedules.filter(s => s.type !== 'ticket')
                            const visibleDots = normalSchedules.slice(0, 3)
                            const hiddenCount = normalSchedules.length - 3

                            return (
                                <>
                                    {/* ticket badge */}
                                    {tickets.length > 0 && (
                                        <div className={styles.ticketWrapper}>
                                            <img src={ticketIcon} className={styles.ticketIcon} />
                                            <div className={styles.ticketTooltip}>
                                                {ticketTooltip}
                                            </div>
                                        </div>
                                    )}

                                    {/* 날짜 */}
                                    <span
                                        className={`${styles.date} ${day === selectedDate &&
                                                year === selectedYear &&
                                                month === selectedMonth
                                                ? styles.activeDate
                                                : ''
                                            }`}
                                    >
                                        {String(day).padStart(2, '0')}
                                    </span>

                                    {/* 일정 dot */}
                                    <div className={styles.dotContainer}>
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
                                    </div>
                                </>
                            )
                        })()}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Calendar