import styles from '../../../pages/write/TicketHistory.module.css'

type ConfirmModalProps = {
  message?: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmModal = ({
  message = '이용권을 정말 삭제하시겠습니까?',
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className={styles.confirmOverlay}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmText}>{message}</div>

        <div className={styles.confirmButtons}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            취소
          </button>

          <button className={styles.confirmBtn} onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal