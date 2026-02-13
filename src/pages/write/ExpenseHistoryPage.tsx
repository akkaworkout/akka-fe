import { useState } from 'react'

import WorkoutTabs from '../../components/write/WorkoutTabs'
import DateSelect from '../../components/write/DateSelect'
import SummaryCard, { type Exercise } from '../../components/common/SummaryCard'
import Card from '../../components/common/Card'
import CheckIcon from '../../components/common/icons/CheckIcon'
import styles from './WorkoutHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'

const EXERCISES: Exercise[] = [
  { id: 1, label: '운동 용품', color: 'rgb(252, 215, 255)' },
  { id: 2, label: '운동 식품', color: '#FFE6CC' },
  { id: 3, label: '기타(교통비 등)', color: '#E0F0FF' },
]

const ExpenseHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const [date, setDate] = useState<Date>(new Date())
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(
    EXERCISES[0]
  )

  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')

  const [monthlyExpenseCount, setMonthlyExpenseCount] = useState(3)
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState(75000)
  const [topExpenseCategory, setTopExpenseCategory] =
    useState('운동 식품')

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
      />

      <main
        className={styles.writePage}
        style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
      >
        <div className={styles.writeInner}>
          <div className={styles.title}>기타 지출</div>

          <div className={styles.tabContainer}>
            <WorkoutTabs />
          </div>

          <div className={styles.write}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>날짜*</label>
                <DateSelect value={date} onChange={setDate} />
              </div>

              <div className={styles.field}>
                <label>지출 분류*</label>
                <SummaryCard
                  exercises={EXERCISES}
                  selected={selectedExercise}
                  onChange={setSelectedExercise}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>항목*</label>
              <input
                className={styles.input}
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="단백질 쉐이크"
                maxLength={30}
              />
            </div>

            <div className={styles.field}>
              <label>금액*</label>
              <div className={styles.priceInput}>
                <input
                  className={styles.input}
                  value={price}
                  onChange={e =>
                    setPrice(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="23,000"
                  maxLength={8}
                />
                <span className={styles.unit}>원</span>
              </div>
            </div>

            <div className={styles.footer}>
              <span className={styles.required}>
                *는 필수 입력사항입니다.
              </span>
              <button className={styles.submitBtn}>완료</button>
            </div>
          </div>

          <div className={styles.currentRecord}>
            <Card
              title="이번 기록으로 이렇게 반영돼요"
              width={386}
              height={227}
              radius={20}
              backgroundColor="#ffffff"
            >
              <ul className={styles.recordPreview}>
                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>이번 달 지출: {monthlyExpenseCount}회</span>
                </li>

                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>
                    이번 달 누적 지출금:{' '}
                    {monthlyTotalExpense.toLocaleString()}원
                  </span>
                </li>

                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>가장 많이 쓴 항목: {topExpenseCategory}</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ExpenseHistoryPage