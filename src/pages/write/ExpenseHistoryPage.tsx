import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../api/write'

import WorkoutTabs from '../../components/write/WorkoutTabs'
import DateSelect from '../../components/write/DateSelect'
import SummaryCard, { type Expense } from '../../components/common/SummaryCard'
import Card from '../../components/common/Card'
import CheckIcon from '../../components/common/icons/CheckIcon'
import styles from './WorkoutHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'

const EXPENSES = [
  { id: 1, value: '운동 용품', label: '운동 용품', color: '#fcd7ff' },
  { id: 2, value: '운동 식품', label: '운동 식품', color: '#FFE6CC' },
  { id: 3, value: '기타', label: '기타(교통비 등)', color: '#E0F0FF' },
]

const ExpenseHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedCategory, setSelectedCategory] = useState<Expense>(EXPENSES[0])
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [monthlyExpenseCount, setMonthlyExpenseCount] = useState(3)
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState(75000)
  const [topExpenseCategory, setTopExpenseCategory] = useState('운동 식품')
  const isFormValid = category.trim() !== '' && price.trim() !== ''
  const navigate = useNavigate()

  const handelBtnClick = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await axios.post(
        `${API_BASE_URL}/expense`,
        {
          category: selectedCategory.value,
          title: category,
          amount: Number(price),
          expense_date: date.toISOString().split('T')[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log('운동지출 POST 성공:', response.data)

      alert('운동지출 기록이 완료되었습니다.')
      navigate('/calendar')

    } catch (error) {
      console.log(error)
    }
  }

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
                  expenses={EXPENSES}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
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
              <button
                className={styles.submitBtn}
                onClick={handelBtnClick}
                disabled={!isFormValid}
              >
                완료
              </button>
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