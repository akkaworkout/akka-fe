import type { ReactNode } from 'react'

import styles from './EmptyState.module.css'

type Props = {
  title: string
  description: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
  variant?: 'default' | 'compact'
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  variant = 'default',
}: Props) {
  return (
    <div className={`${styles.root} ${variant === 'compact' ? styles.compact : ''}`}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <strong className={styles.title}>{title}</strong>
      <p className={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
