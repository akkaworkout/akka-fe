import Modal from './Modal'
import styles from './MemoDetailModal.module.css'

type MemoRow = {
  date: string
  label: string
  reason: string
}

type Props = {
  open: boolean
  onClose: () => void
  monthText: string
  rows: MemoRow[]
}

export default function MemoDetailModal({ open, onClose, monthText, rows }: Props) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className={styles.wrap}>
        <p className={styles.title}>{monthText} 실패 메모내역</p>

        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span>날짜</span>
            <span>종목</span>
            <span>이유</span>
          </div>

          <div className={styles.thickDivider} />

          <div className={styles.body}>
            {rows.map((r, idx) => (
              <div key={`${r.date}-${r.label}-${idx}`} className={styles.dataRow}>
                <span className={styles.cell}>{r.date}</span>
                <span className={styles.cell}>{r.label}</span>
                <span className={styles.cell}>{r.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}