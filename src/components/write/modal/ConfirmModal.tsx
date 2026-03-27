import styles from '../../../pages/write/TicketHistory.module.css'

type ConfirmModalProps = {
  message?: string
  subMessage?: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmModal = ({
  message = '이용권을 정말 삭제하시겠습니까?',
  subMessage = '한번 삭제된 이용권은 되돌릴 수 없으며, 해당되는 운동 기록들도 같이 삭제됩니다.',
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className={styles.confirmOverlay}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmText}>{message}</div>
        <div className={styles.subText}>{subMessage}</div>

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