import { useEffect } from 'react'
import type { ReactNode } from 'react'

import styles from './Modal.module.css'

type Props = {
  title?: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}

const Modal = ({ title, children, onClose, footer }: Props) => {
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

        {title && <div className={styles.header}>{title}</div>}

        <div className={styles.content}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
