import styles from './Calendar.module.css'

import arrowIcon from '../../assets/icons/chevron-left.png'

type Schedule = {
    date: string
    label: string
    color: string
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
                        className={styles.day}
                        onClick={() => day && onSelectDay(day)}
                    >
                        {day && (
                            <>
                                {day === selectedDate &&
                                    year === selectedYear &&
                                    month === selectedMonth && (
                                        <hr className={styles.activeDateLine} />
                                    )}
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

                                {schedules
                                    .filter(s => s.date.startsWith(currentMonth))
                                    .filter(s => Number(s.date.slice(-2)) === day)
                                    .map(s => (
                                        <div
                                            key={s.label}
                                            className={styles.tag}
                                            style={{ backgroundColor: s.color }}
                                        >
                                            {s.label}
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Calendar