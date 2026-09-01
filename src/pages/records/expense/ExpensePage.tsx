// React / 외부 라이브러리
import { Helmet } from 'react-helmet-async'

// hooks
import { useExpenseForm } from './hooks/useExpenseForm'
import { useExpenseSummary } from './hooks/useExpenseSummary'

// 컴포넌트 (UI)
import RecordLayout from '../layout/RecordLayout'
import DateSelect from '@/components/dateSelect/DateSelect'
import SummaryCard, { type Expense } from '@/components/summaryCard/SummaryCard'
import RecordSummaryCard from '../components/RecordSummaryCard'
import Button from '@/components/button/Button'

// 스타일
import styles from '../workout/Workout.module.css'
const EXPENSES: Expense[] = [
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
  const {
    form,
    isFormValid,
    isSubmitting,
    handleDateChange,
    handleCategoryChange,
    handleItemChange,
    handleAmountChange,
    handleSubmit,
  } = useExpenseForm(EXPENSES[0])

  const { status, summary } = useExpenseSummary()

  return (
    <>
      <Helmet>
        <title>운동 지출 기록 | Akkaworkout</title>
        <meta
          name="description"
          content="운동과 관련된 지출을 기록하고 월별 사용 금액을 관리해 보세요."
        />
      </Helmet>

      <RecordLayout title="기타 지출">
        <div className={styles.write}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>날짜*</label>

              <DateSelect value={form.date} onChange={handleDateChange} />
            </div>

            <div className={styles.field}>
              <label>지출 분류*</label>

              <SummaryCard
                expenses={EXPENSES}
                selected={form.selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="expense-itemName">항목*</label>

            <input
              id="expense-itemName"
              className={styles.input}
              value={form.item}
              onChange={(e) => handleItemChange(e.target.value)}
              placeholder="단백질 쉐이크"
              maxLength={30}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="expense-amount">금액*</label>

            <div className={styles.priceInput}>
              <input
                id="expense-amount"
                className={styles.input}
                value={form.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="23,000"
                maxLength={8}
              />

              <span className={styles.unit}>원</span>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.required}>*는 필수 입력사항입니다.</span>

            <Button
              variant="primary"
              onClick={handleSubmit}
              type="button"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '완료'}
            </Button>
          </div>
        </div>

        <RecordSummaryCard
          title="이번 기록으로 이렇게 반영돼요"
          isLoading={status === 'loading'}
          items={
            status === 'success'
              ? [
                  `이번 달 지출: ${summary.expenseCount}회`,
                  `이번 달 누적 지출금: ${summary.totalAmount.toLocaleString()}원`,
                  `가장 많이 쓴 항목: ${summary.topCategory}`,
                ]
              : [
                  '이번 달 지출: 조회에 실패했어요',
                  '이번 달 누적 지출금: 조회에 실패했어요',
                  '가장 많이 쓴 항목: 조회에 실패했어요',
                ]
          }
        />
      </RecordLayout>
    </>
  )
}

export default ExpensePage
