import leftIcon from '@/assets/icons/chevron-left.png'
import styles from '../Report.module.css'

type Props = {
  year: number
  month: number // 1~12
  onPrevMonth: () => void
  onNextMonth: () => void

  totalExerciseCount: number
  totalExpenseAmount: number
  noShowCount: number
}

export default function ReportHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
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
        <button className={styles.iconBtn} onClick={onPrevMonth}>
          <img src={leftIcon} alt="prev" width={17} height={19} />
        </button>

        <span className={styles.monthText}>{monthText}</span>

        <button className={styles.iconBtn} onClick={onNextMonth}>
          <img
            src={leftIcon}
            alt="next"
            width={17}
            height={19}
            style={{ transform: 'rotate(180deg)' }}
          />
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