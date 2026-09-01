import { VscTriangleLeft } from 'react-icons/vsc'
import styles from '../Report.module.css'

type Props = {
  year: number
  month: number // 1~12
  onPrevMonth: () => void
  onNextMonth: () => void
  isNextMonthDisabled: boolean

  totalExerciseCount: number
  totalExpenseAmount: number
  noShowCount: number
}

export default function ReportHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  isNextMonthDisabled,
  totalExerciseCount,
  totalExpenseAmount,
  noShowCount,
}: Props) {
  const monthText = `${year}.${String(month).padStart(2, '0')}`

  const expenseText = `₩${Math.max(0, Number(totalExpenseAmount) || 0).toLocaleString()}`
  const exerciseText = `${Math.max(0, Number(totalExerciseCount) || 0)}회`
  const noShowText = `${Math.max(0, Number(noShowCount) || 0)}회`

  return (
    <div className={styles.reportHeader}>
      {/* 월 이동 */}
      <div className={styles.monthArea}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onPrevMonth}
          aria-label="이전 달로 이동"
        >
          <VscTriangleLeft aria-hidden="true" />
        </button>

        <span className={styles.monthText}>{monthText}</span>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={onNextMonth}
          disabled={isNextMonthDisabled}
          aria-label="다음 달로 이동"
        >
          <VscTriangleLeft className={styles.nextIcon} aria-hidden="true" />
        </button>
      </div>

      {/* 우측 요약 */}
      <div className={styles.summaryArea}>
        <Summary label="총 운동" value={exerciseText} />
        <Divider />
        <Summary label="총 지출" value={expenseText} />
        <Divider />
        <Summary label="노쇼 횟수" value={noShowText} />
      </div>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryItem}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

function Divider() {
  return <div className={styles.divider} />
}
