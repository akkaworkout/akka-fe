import styles from './Button.module.css'

import uploadIcon from '@/assets/icons/upload.png'

type Props = {
  children?: React.ReactNode
  icon?: string
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
        ${
          variant !== 'default'
            ? styles[variant]
            : ''
        }
      `}
      onClick={onClick}
    >
      {variant === 'file' && (
        <img
          src={uploadIcon}
          alt="upload_icon"
          className={styles.uploadIcon}
        />
      )}

      {icon && (
        <img
          src={icon}
          alt="button_icon"
          className={styles.icon}
        />
      )}

      {children}
    </button>
  )
}

export default Button