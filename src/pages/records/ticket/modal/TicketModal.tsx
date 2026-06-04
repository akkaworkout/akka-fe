import BaseModal from '@/components/common/BaseModal'
import styles from './TicketModal.module.css'

type Props = {
  title: string
  buttonText: string
  onClose: () => void
  onNext: () => void
  children: React.ReactNode
  nextDisabled?: boolean
}

const TicketModal = ({
  title,
  buttonText,
  onClose,
  onNext,
  children,
  nextDisabled,
}: Props) => {
  return (
    <BaseModal
      title={title}
      onClose={onClose}
    >
      <div className={styles.divider} />

      <div className={styles.body}>
        {children}
      </div>

      <div className={styles.footer}>
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={`${styles.nextBtn} ${nextDisabled ? styles.disabled : ''
            }`}
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  )
}

export default TicketModal