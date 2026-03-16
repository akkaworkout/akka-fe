import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Calendar.module.css'

import SideNav from '../../components/sideNav/SideNav'
import Card from '../../components/common/Card'
import Calendar from './Calendar'
import TodayItemModal from './TodayItemModal'
import Spinner from '../../components/common/Spinner'

import { useCalendar } from '../../hooks/useCalendar'
import { useGoals } from '../../hooks/useGoals'
import { useSummary } from '../../hooks/useSummary'
import { useTodayItems } from '../../hooks/useTodayItems'
import type { TodayItem } from '../../hooks/useTodayItems'

const CalenderPage = () => {
  const now = new Date()
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
    updateGoals
  } = useGoals(year, month)

  const { summary } = useSummary(year, month)

  const {
    selectedDate,
    selectedItem,
    isModalOpen,
    todayItems,
    isLoading,
    setSelectedDate,
    handleSelectDay,
    handleItemClick,
    handleCloseModal
  } = useTodayItems(navigate, year, month, now.getDate())

  // year, month 변경될 때 오늘 날짜 기준으로 fetch
  useEffect(() => {
    handleSelectDay(selectedDate, year, month)
  }, [year, month])

  return (
    <>
      <div className={styles.wrap}>
        <SideNav
          folded={false}
          onToggle={() => {}}
        />

        <main
          className={styles.calendarPage}
          style={{ marginLeft: 220 }}
        >
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
              onSelectDay={(day) => handleSelectDay(day, year, month)}
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
                onButtonClick={updateGoals}
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
                title={`${year}년 ${month + 1}월 ${selectedDate}일`}
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
                      todayItems.map((item: TodayItem) => (
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