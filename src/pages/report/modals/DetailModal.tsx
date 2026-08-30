import Modal from './Modal'
import styles from './DetailModal.module.css'

type Item = {
  label: string
  count: number
}

type Props = {
  open: boolean
  onClose: () => void
  restCount: number
  subject: '운동' | '노쇼'
  items: Item[]
}

export default function DetailModal({ open, onClose, restCount, subject, items }: Props) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className={styles.workoutDetail}>
        <p className={styles.detailTitle}>
          상위 {restCount}개 {subject}를 제외한 항목이에요.
        </p>

        <ul className={styles.detailList}>
          {items.map((item, idx) => (
            <li key={idx} className={styles.detailRow}>
              <span className={styles.detailLabel}>{item.label}</span>
              <span className={styles.detailCount}>{item.count}회</span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}
