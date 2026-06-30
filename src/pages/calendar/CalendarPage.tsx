// React / 외부 라이브러리
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async'

// API / hooks / utils
import { useCalendar } from "./hooks/useCalendar";
import { useGoals } from "./hooks/useGoals";
import { useSummary } from "./hooks/useSummary";
import { useTodayItems } from "./hooks/useTodayItems";

// 컴포넌트
import Card from "@/components/card/Card";
import Spinner from "@/components/spinner/Spinner";
import Calendar from "./components/Calendar";
import TodayRecordSection from './components/TodayRecordSection'

// 모달
import TodayItemModal from "./modals/TodayItemModal";

// 스타일 
import styles from './Calendar.module.css'

const CalenderPage = () => {
  const navigate = useNavigate()

  const {
    year,
    month,
    schedules,
    handlePrevMonth,
    handleNextMonth
  } = useCalendar()

  const {
    goals,
    handleGoalChange,
    handleupdateGoals
  } = useGoals(year, month)

  const { summary } = useSummary(year, month)

  const {
    selectedDate,
    selectedItem,
    isModalOpen,
    todayItems,
    isLoading,
    handleSelectDay,
    handleItemClick,
    handleCloseModal
  } = useTodayItems(navigate, new Date().getDate(), year, month)

  const isOverBudget = Number(summary?.totalAmount ?? 0) > Number(summary?.targetBudget ?? 0)

  useEffect(() => {
    handleSelectDay(selectedDate)
  }, [year, month])

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
              onSelectDay={(day) => handleSelectDay(day)}
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
                            className={`${styles.current} ${isOverBudget ? styles.overBudget : ''
                              }`}
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
                  <Spinner />
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
                  {(goals.length > 0 ? goals : ["", "", ""]).map((goal, index) => (
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