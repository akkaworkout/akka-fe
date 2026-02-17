import type { ReactNode } from 'react'
import BaseModal from '../../common/BaseModal'
import styles from './TicketModal.module.css'

type Props = {
  title: string
  buttonText: string
  onClose: () => void
  onNext: () => void
  children?: ReactNode
}

const TicketModal = ({
  title,
  buttonText,
  onClose,
  onNext,
  children,
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
          className={styles.nextBtn}
          onClick={onNext}
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  )
}

export default TicketModal