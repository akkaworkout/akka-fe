import type { CSSProperties } from 'react'

import styles from './Skeleton.module.css'

type Props = {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  borderRadius?: CSSProperties['borderRadius']
  className?: string
}

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  className = '',
}: Props) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  )
}
