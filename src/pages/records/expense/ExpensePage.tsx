// React / 외부 라이브러리
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// API / 로직
import {
  createExpense,
  getExpenseStats,
} from '@/api/expenseApi'

// 컴포넌트 (UI)
import RecordLayout from '../layout/RecordLayout'
import DateSelect from '@/components/dateSelect/DateSelect'
import SummaryCard, {
  type Expense,
} from '@/components/summaryCard/SummaryCard'
import RecordSummaryCard from '../components/RecordSummaryCard'
import Button from '@/components/button/Button'

// 스타일
import styles from '../workout/Workout.module.css'

const EXPENSES = [
  {
    id: 1,
    value: '운동 용품',
    label: '운동 용품',
    color: '#fcd7ff',
  },
  {
    id: 2,
    value: '운동 식품',
    label: '운동 식품',
    color: '#FFE6CC',
  },
  {
    id: 3,
    value: '기타',
    label: '기타(교통비 등)',
    color: '#E0F0FF',
  },
]

const ExpensePage = () => {
  const navigate = useNavigate()

  // 입력 상태
  const [date, setDate] = useState<Date>(new Date())
  const [selectedCategory, setSelectedCategory] = useState<Expense>(EXPENSES[0])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  // 요약 데이터
  const [monthlyExpenseCount, setMonthlyExpenseCount] = useState(0)
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState(0)
  const [topExpenseCategory, setTopExpenseCategory] = useState('기록 없음')

  const isFormValid = item.trim() !== '' && amount.trim() !== ''

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const handleSubmit = async () => {
    try {
      await createExpense({
        category: selectedCategory.value,
        title: item,
        amount: Number(amount),
        expense_date: formatDate(date),
      })

      alert('운동지출 기록이 완료되었어요')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchExpenseSummary = async () => {
      try {
        const stats = await getExpenseStats()

        setMonthlyExpenseCount(stats.expenseCount)
        setMonthlyTotalExpense(stats.totalAmount)
        setTopExpenseCategory(stats.topCategory)
        setStatus('success')
      } catch (error) {
        console.log(error)
        setStatus('error')
      }
    }

    fetchExpenseSummary()
  }, [])

  return (
    <>
      <Helmet>
        <title>운동 지출 기록 | Akkaworkout</title>
        <meta
          name="description"
          content="운동과 관련된 지출을 기록하고 월별 사용 금액을 관리해 보세요."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <RecordLayout title="기타 지출">
        <div className={styles.write}>
          {/* 날짜 + 분류 */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>날짜*</label>

              <DateSelect
                value={date}
                onChange={setDate}
              />
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

          {/* 항목 */}
          <div className={styles.field}>
            <label htmlFor='itemName'>항목*</label>
            <input
              id='itemName'
              className={styles.input}
              value={item}
              onChange={(e) =>
                setItem(e.target.value)
              }
              placeholder="단백질 쉐이크"
              maxLength={30}
            />
          </div>

          {/* 금액 */}
          <div className={styles.field}>
            <label htmlFor='amount'>금액*</label>
            <div className={styles.priceInput}>
              <input
                id='amount'
                className={styles.input}
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value.replace(
                      /[^0-9]/g,
                      ''
                    )
                  )
                }
                placeholder="23,000"
                maxLength={8}
              />

              <span className={styles.unit}>
                원
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className={styles.footer}>
            <span className={styles.required}>
              *는 필수 입력사항입니다.
            </span>

            <Button
              variant="primary"
              onClick={handleSubmit}
              type="button"
              disabled={!isFormValid}
            >
              완료
            </Button>
          </div>
        </div>

        {/* 요약 카드 */}
        <RecordSummaryCard
          title="이번 기록으로 이렇게 반영돼요"
          items={status === 'success' ? [
            `이번 달 지출: ${monthlyExpenseCount}회`,
            `이번 달 누적 지출금: ${monthlyTotalExpense.toLocaleString()}원`,
            `가장 많이 쓴 항목: ${topExpenseCategory}`,
          ] : [
            `이번 달 지출: 조회에 실패했어요`,
            `이번 달 누적 지출금: 조회에 실패했어요`,
            `가장 많이 쓴 항목: 조회에 실패했어요`,
          ]}
        />
      </RecordLayout>
    </>
  )
}

export default ExpensePage