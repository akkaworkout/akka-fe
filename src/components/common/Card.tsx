import styles from './Card.module.css'

type CardProps = {
  title?: React.ReactNode
  width?: number | string
  height?: number | string
  backgroundColor?: string
  radius?: number
  children?: React.ReactNode
}

const Card = ({
  title,
  width = '100%',
  height = 'auto',
  backgroundColor = '#ffffff',
  radius = 20,
  children,
}: CardProps) => {
  return (
    <div
      className={styles.card}
      style={{
        width,
        height,
        backgroundColor,
        borderRadius: radius,
      }}
    >
      {title && (
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
        </div>
      )}

      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default Card