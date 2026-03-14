import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Calendar.module.css'

import SideNav from '../../components/sideNav/SideNav'
import Card from '../../components/common/Card'
import Calendar from './Calendar'
import TodayItemModal from './TodayItemModal'
import Spinner from '../../components/common/Spinner'

import { apiFetch } from '../../api/api'
import { CALENDAR_ENDPOINTS } from '../../api/calendar'
import { EXERCISE_RECORD_ENDPOINTS } from '../../api/exercise'

import { useCalendar } from '../../hooks/useCalendar'
import { useGoals } from '../../hooks/useGoals'
import { useSummary } from '../../hooks/useSummary'

type TodayItem = {
  id: number
  date: string
  name: string
  status: '성공' | '실패' | '구매' | '이용권 등록'
  color: string
  amount: number
  memo?: string
  image_url?: string
}

const CalenderPage = () => {
  const now = new Date()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(now.getDate())

  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const [selectedItem, setSelectedItem] = useState<TodayItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [todayItems, setTodayItems] = useState<TodayItem[]>([])

  const {
    year,
    month,
    schedules,
    handlePrevMonth,
    handleNextMonth
  } = useCalendar()
  console.log("calendar schedules:", schedules)

  const {
    goals,
    handleGoalChange,
    updateGoals
  } = useGoals(year, month)

  const {
    summary
  } = useSummary(year, month)

  const handleSelectDay = async (day: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setSelectedDate(day)

    setIsLoading(true)

    try {
      const monthStr = String(month + 1).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      const date = `${year}-${monthStr}-${dayStr}`
      console.log("clicked date:", date)

      const res = await apiFetch(
        CALENDAR_ENDPOINTS.DATE(date),
        { method: 'GET' }
      )

      const records = res.data.records
      console.log("records:", records)

      const mappedItems: TodayItem[] = records.map((item: any) => {

        if (item.type === 'exercise') {
          return {
            id: item.id,
            date: item.date,
            name: item.exercise_type,
            status: item.success === 1 ? '성공' : '실패',
            color: item.color,
            amount: item.cost,
            memo: item.memo
          }
        }

        if (item.type === 'expense') {
          return {
            id: item.id,
            date: item.date,
            name: item.title,
            status: '구매',
            color: item.color,
            amount: item.amount
          }
        }

        if (item.type === 'ticket') {
          return {
            id: item.id,
            date: item.date,
            name: item.exercise_type,
            status: '이용권 등록',
            color: item.color,
            amount: 0
          }
        }

        return null
      }).filter(Boolean) as TodayItem[]

      setTodayItems(mappedItems)

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = async (item: TodayItem) => {
    if (item.status === '이용권 등록') {
      navigate('/ticket')
      return
    }

    try {
      const res = await apiFetch(
        EXERCISE_RECORD_ENDPOINTS.DETAIL(item.id),
        { method: 'GET' }
      )

      const record = res

      const modalItem: TodayItem = {
        id: record.record_id,
        date: record.exercise_date,
        name: item.name,
        status: record.success === 1 ? '성공' : '실패',
        color: record.color,
        amount: record.cost,
        memo: record.memo,
        image_url: record.image_url
      }

      setSelectedItem(modalItem)
      setIsModalOpen(true)

    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <>
      <div className={styles.wrap}>
        <SideNav
          folded={isSidebarFolded}
          onToggle={() => setIsSidebarFolded(prev => !prev)}
        />

        <main
          className={styles.calendarPage}
          style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
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
                    <span className={styles.current}>
                      {Number(summary.totalAmount).toLocaleString()}
                    </span>
                    <span className={styles.total}>
                      / {summary.targetBudget.toLocaleString()}원
                    </span>
                  </div>
                }
                width={445}
                height={173}
                backgroundColor="#ffffff"
                radius={20}
              >
                <div className={styles.badges}>
                  <div className={styles.badgeYellow}>
                    이번달 날린 금액: <strong>{summary.failAmount.toLocaleString()}원</strong>
                  </div>

                  <div className={styles.badgeBlue}>
                    운동 횟수: <strong>{summary.exerciseCount}</strong> / {summary.targetExerciseCount}회
                  </div>
                </div>
              </Card>
            </div>

            <div className={styles.goal}>
              <Card
                title="이달의 목표"
                buttonText="저장"
                onButtonClick={() => {
                  updateGoals()
                }}
                width={445}
                height={223}
              >
                <div className={styles.goalList}>
                  {(goals.length > 0 ? goals : ["", "", ""]).map((goal, index) => (
                    <div key={index} className={styles.goalItem}>
                      <span>{index + 1}.</span>
                      <input
                        value={goal}
                        onChange={(e) => handleGoalChange(index, e.target.value)}
                        placeholder="목표를 입력해주세요."
                      />
                    </div>
                  ))}
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
                <div className={styles.summary}>
                  <ul className={styles.list}>
                    {isLoading ? (
                      <Spinner />
                    ) : todayItems.length === 0 ? (
                      <div className={styles.empty}>아직 기록이 없어요</div>
                    ) : (
                      todayItems.map(item => (
                        <li
                          key={item.id}
                          className={`${styles.item} ${item.status === '이용권 등록' ? styles.ticketItem : ''}`}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className={styles.left}>
                            <span
                              className={styles.dot}
                              style={{ backgroundColor: item.color }}
                            />
                            <div>
                              <div className={styles.name}>{item.name}</div>
                              <div className={styles.status}>{item.status}</div>
                            </div>
                          </div>

                          <span
                            className={
                              item.status === '성공'
                                ? styles.success
                                : item.status === '실패'
                                  ? styles.fail
                                  : styles.purchase
                            }
                          >
                            {item.amount.toLocaleString()}원
                          </span>
                        </li>
                      ))
                    )}
                  </ul>

                  <button className={styles.addBtn}>+</button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && selectedItem && (
        <TodayItemModal
          item={selectedItem}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default CalenderPage