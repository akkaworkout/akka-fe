import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

// API / hooks / utils
import type { TodayItem } from '@/api/calendarApi'
import { getExerciseDetail } from '@/api/workoutApi'
import { useSummaryQuery, useTodayItemsQuery } from '@/hooks/queries/useCalendarQuery'
import { formatDateForApi } from '@/utils/date'
import { useCalendar } from './hooks/useCalendar'
import { useGoals } from './hooks/useGoals'

// 컴포넌트
import Card from '@/components/card/Card'
import Skeleton from '@/components/skeleton/Skeleton'
import Calendar from './components/Calendar'
import TodayRecordSection from './components/TodayRecordSection'

// 모달
import TodayItemModal from './modals/TodayItemModal'

// 스타일
import styles from './Calendar.module.css'

const CalenderPage = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [selectedItem, setSelectedItem] = useState<TodayItem | null>(null)

  const { year, month, schedules, handlePrevMonth, handleNextMonth, isNextMonthDisabled } =
    useCalendar()

  const { goals, handleGoalChange, handleupdateGoals } = useGoals(year, month)

  const { data: summary } = useSummaryQuery(year, month)
  const selectedDateKey = formatDateForApi(new Date(year, month - 1, selectedDate))
  const { data: todayItems = [], isLoading } = useTodayItemsQuery(selectedDateKey)

  const isOverBudget = Number(summary?.totalAmount ?? 0) > Number(summary?.targetBudget ?? 0)

  const handleItemClick = async (item: TodayItem) => {
    if (item.status === '이용권 등록') {
      navigate('/ticket')
      return
    }

    if (item.status === '구매') {
      setSelectedItem(item)
      return
    }

    try {
      const record = await getExerciseDetail(item.id)

      setSelectedItem({
        id: record.id,
        date: record.exercise_date,
        name: item.name,
        status: record.is_success === 1 ? '성공' : '실패',
        color_code: record.color_code,
        amount: record.exercise_amount,
        memo: record.memo,
        image_url: record.image_url,
      })
    } catch (error) {
      console.error(error)
      alert('운동 기록을 불러오지 못했어요. 다시 시도해주세요.')
    }
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <>
      <Helmet>
        <title>운동 캘린더 | Akkaworkout</title>
        <meta
          name="description"
          content="날짜별 운동 기록, 지출, 이용권 일정을 캘린더에서 확인해 보세요."
        />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.calendarPage}>
          <div className={styles.calendarInner}>
            <div className={styles.title}>캘린더</div>

            <Calendar
              year={year}
              month={month}
              selectedYear={year}
              selectedMonth={month}
              selectedDate={selectedDate}
              schedules={schedules}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              isNextMonthDisabled={isNextMonthDisabled}
              onSelectDay={setSelectedDate}
            />

            <div className={styles.money}>
              {summary ? (
                <Card
                  title={
                    <div className={styles.moneyMain}>
                      {Number.isNaN(Number(summary.totalAmount)) ? (
                        <span className={styles.label}>아직 이번 달 기록이 없어요</span>
                      ) : (
                        <>
                          <span className={styles.label}>금액:</span>
                          <span
                            className={`${styles.current} ${isOverBudget ? styles.overBudget : ''}`}
                          >
                            {Number(summary.totalAmount).toLocaleString()}
                          </span>
                          <span className={styles.total}>
                            &nbsp;/ {Number(summary.targetBudget ?? 0).toLocaleString()}원
                          </span>
                        </>
                      )}
                    </div>
                  }
                  width={445}
                  height={173}
                  backgroundColor="#ffffff"
                  radius={20}
                >
                  <div className={styles.badges}>
                    <div className={styles.badgeYellow}>
                      이번달 날린 금액:{' '}
                      <strong>{Number(summary.failAmount ?? 0).toLocaleString()}원</strong>
                    </div>

                    <div className={styles.badgeBlue}>
                      운동 횟수: <strong>{summary.exerciseCount ?? 0}</strong> /{' '}
                      {summary.targetExerciseCount ?? 0}회
                    </div>
                  </div>
                </Card>
              ) : (
                <Card width={445} height={173}>
                  <div
                    className={styles.moneySkeleton}
                    role="status"
                    aria-label="월간 요약 불러오는 중"
                  >
                    <Skeleton width={210} height={24} borderRadius={9} />
                    <Skeleton width={185} height={34} borderRadius={10} />
                    <Skeleton width={230} height={34} borderRadius={10} />
                  </div>
                </Card>
              )}
            </div>

            <div className={styles.goal}>
              <Card
                title="이달의 목표"
                buttonText="저장"
                onButtonClick={handleupdateGoals}
                width={445}
                height={223}
              >
                <div className={styles.goalList}>
                  {(goals.length > 0 ? goals : ['', '', '']).map((goal, index) => (
                    <div key={index} className={styles.goalItem}>
                      <input
                        value={goal}
                        onChange={(e) => handleGoalChange(index, e.target.value)}
                        placeholder={`${index + 1}. 목표를 입력해주세요.`}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <TodayRecordSection
              year={year}
              month={month}
              selectedDate={selectedDate}
              todayItems={todayItems}
              isLoading={isLoading}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>

      {selectedItem && <TodayItemModal item={selectedItem} onClose={handleCloseModal} />}
    </>
  )
}

export default CalenderPage
