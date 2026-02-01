import styles from './TodayItemModal.module.css'

type Props = {
  item: {
    date: string
    name: string
    status: '성공' | '실패' | '구매'
    amount: number
    images?: string[]
    memo?: string
  }
  onClose: () => void
}

const TodayItemModal = ({ item, onClose }: Props) => {
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
          {item.date}
        </div>

        <div className={styles.images}>
          {(item.images ?? []).map((src, idx) => (
            <img key={idx} src={src} alt="" />
          ))}
        </div>

        <div className={styles.alert}>
          운동 실패: {item.amount.toLocaleString()}원이 날아갔어요🥲
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