import { useState } from 'react'

import styles from './Calendar.module.css'
import SideNav from '../../components/sideNav/SideNav'
import Card from '../../components/common/Card'
import Calendar from './Calendar'

type Schedule = {
  date: string
  label: string
  color: string
}

const CalenderPage = () => {
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(now.getDate())

  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(prev => prev - 1)
      setMonth(11)
    } else {
      setMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(prev => prev + 1)
      setMonth(0)
    } else {
      setMonth(prev => prev + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setSelectedDate(day)
  }

  const schedules: Schedule[] = [
    { date: '2026-01-02', label: '헬스', color: 'rgb(213, 211, 255)' },
    { date: '2026-01-16', label: '발레', color: 'rgb(245, 217, 255)' },
    { date: '2026-01-16', label: '운동식품', color: 'rgb(223, 246, 246)' },
  ]

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
      />

      <main
        className={styles.calendarPage}
        style={{
          marginLeft: isSidebarFolded ? 74 : 220,
        }}
      >
        <div className={styles.calendarInner}>
          <div className={styles.title}>캘린더</div>

          <Calendar
            year={year}
            month={month}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            schedules={schedules}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDay={handleSelectDay}
          />

          <div className={styles.money}>
            <Card
              title={
                <div className={styles.moneyMain}>
                  <span className={styles.label}>금액:</span>
                  <span className={styles.current}>70,000</span>
                  <span className={styles.total}> / 120,000원</span>
                </div>
              }
              width={445}
              height={173}
              backgroundColor="#ffffff"
              radius={20}
            >
              <div className={styles.badges}>
                <div className={styles.badgeYellow}>
                  이번달 날린 금액: <strong>20,000원</strong>
                </div>
                <div className={styles.badgeBlue}>
                  운동 횟수: <strong>12</strong> / 30회
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.goal}>
            <button className={styles.goalBtn}>저장</button>
            <Card
              title="이달의 목표"
              width={445}
              height={223}
              backgroundColor="#ffffff"
              radius={20}
            >
              <div className={styles.goalList}>
                <div className={styles.goalItem}>
                  <span>1.</span>
                  <input placeholder="목표를 입력해주세요." />
                </div>

                <div className={styles.goalItem}>
                  <span>2.</span>
                  <input placeholder="목표를 입력해주세요." />
                </div>

                <div className={styles.goalItem}>
                  <span>3.</span>
                  <input placeholder="목표를 입력해주세요." />
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.today}>
            <Card
              title={`${selectedYear}년 ${selectedMonth + 1}월 ${selectedDate}일`}
              width={445}
              height={307}
              backgroundColor="#ffffff"
              radius={20}
            >
              <strong>70,000</strong>
            </Card>
          </div>
        </div>
      </main>
    </div>

  )
}

export default CalenderPage
