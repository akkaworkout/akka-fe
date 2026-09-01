import styles from './Button.module.css'
import { MdOutlineFileUpload } from 'react-icons/md'

type Props = {
  children?: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  variant?:
    | 'default'
    | 'green'
    | 'red'
    | 'file'
    | 'primary'
    | 'gray'
    | 'dropdownEdit'
    | 'dropdownDelete'
    | 'more'
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

const Button = ({
  children,
  icon,
  active = false,
  variant = 'default',
  onClick,
  type = 'button',
  disabled = false,
}: Props) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${styles.button}
        ${active ? styles.active : ''}
        ${variant !== 'default' ? styles[variant] : ''}
      `}
      onClick={onClick}
    >
      {variant === 'file' && (
        <MdOutlineFileUpload className={styles.uploadIcon} aria-hidden="true" />
      )}

      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}

      {children}
    </button>
  )
}

export default Button
