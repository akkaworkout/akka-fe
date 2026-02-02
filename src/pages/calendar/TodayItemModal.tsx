import { useEffect } from 'react'
import styles from './TodayItemModal.module.css'
import exampleExercise from '../../assets/images/example_exercise.png'

type Props = {
  item: {
    date: string
    name: string
    status: '성공' | '실패' | '구매'
    amount: number
    memo?: string
  }
  onClose: () => void
}

const TodayItemModal = ({ item, onClose }: Props) => {
  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${year}년 ${month}월 ${day}일`
  }

  const alertTextMap = {
    성공: (amount: number) =>
      `운동 성공: 오늘의 성공으로 ${amount.toLocaleString()}원에 다녀왔어요😆`,
    실패: (amount: number) =>
      `운동 실패: ${amount.toLocaleString()}원이 날아갔어요🥲`,
    구매: (amount: number) =>
      `구매 완료: ${amount.toLocaleString()}원 결제했어요 🛒`,
  }

  const alertClassMap = {
    성공: styles.success,
    실패: styles.fail,
    구매: styles.purchase,
  }

  useEffect(() => {
    document.body.classList.add('modal-open')

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <div className={styles.header}>
          {formatDate(item.date)}
        </div>

        <div className={styles.images}>
          <img src={exampleExercise} alt="exercise" />
        </div>

        <div className={`${styles.alert} ${alertClassMap[item.status]}`}>
          {alertTextMap[item.status](item.amount)}
        </div>

        <div className={styles.section}>
          <div className={styles.label}>{item.name}</div>
          <div className={styles.memo}>
            {item.memo ?? ''}
          </div>
        </div>

        <button className={styles.editBtn}>수정하러 가기</button>
      </div>
    </div>
  )
}

export default TodayItemModal