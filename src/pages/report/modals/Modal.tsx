import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

type ModalSize = 'sm' | 'lg'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode

  /** sm: 344x254, lg: 466x567 */
  size?: ModalSize

  /** 헤더 타이틀(없으면 헤더 영역 자체를 안 그림) */
  title?: string
}

export default function Modal({
  open,
  onClose,
  children,
  size = 'sm',
  title,
}: Props) {
  const container = useMemo(() => {
    // SSR 대비 (근데 보통 CRA/Vite면 필요 없긴 함)
    if (typeof document === 'undefined') return null
    return document.body
  }, [])

  // body 스크롤 락
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open || !container) return null

  return createPortal(
    <div className={styles.overlay} aria-hidden={!open}>
      <div
        className={`${styles.modal} ${size === 'sm' ? styles.sm : styles.lg}`}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'modal'}
      >
        {/* X 버튼은 무조건 고정 */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="닫기"
        />

        {/* 타이틀 있으면 헤더 */}
        {title ? <div className={styles.header}>{title}</div> : null}

        {/* 내용 */}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    container
  )
}