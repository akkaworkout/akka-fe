import { useState } from 'react'
import type { ChangeEvent } from 'react'
import styles from './Form.module.css'

import eyeOn from '@/assets/icons/auth/eye-on.png'
import eyeOff from '@/assets/icons/auth/eye-off.png'

type RightButton = {
  label: string
  onClick: () => void
  disabled?: boolean
}

type Props = {
  label: string
  id?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void

  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']

  errorText?: string
  rightButton?: RightButton

  /** 비밀번호 보기 토글 */
  showPasswordToggle?: boolean
}

export default function Input({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  errorText,
  rightButton,
  showPasswordToggle = false,
}: Props) {
  const hasError = Boolean(errorText)
  const [isVisible, setIsVisible] = useState(false)

  const isPassword = type === 'password'
  const inputType =
    isPassword && showPasswordToggle
      ? isVisible
        ? 'text'
        : 'password'
      : type

  // input + error 묶음
  const Field = (
    <div className={styles.inputWrap}>
      <div className={styles.inputInner}>
        <label
          className={styles.visuallyHidden}
          htmlFor={id}
        >
          {label}
        </label>
        <input
          id={id}
          className={`${styles.input} ${hasError ? styles.inputError : ''}`}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />

        {isPassword && showPasswordToggle && (
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setIsVisible(v => !v)}
          >
            <img
              src={isVisible ? eyeOn : eyeOff}
              alt="비밀번호 표시 토글"
            />
          </button>
        )}
      </div>

      {errorText && (
        <p className={styles.error}>{errorText}</p>
      )}
    </div>
  )

  return (
    <div className={styles.row}>
      <label className={styles.label}>{label}</label>

      {rightButton ? (
        <div className={styles.fieldLine}>
          {Field}
          <button
            type="button"
            className={styles.dupBtn}
            onClick={rightButton.onClick}
            disabled={rightButton.disabled}
          >
            {rightButton.label}
          </button>
        </div>
      ) : (
        Field
      )}
    </div>
  )
}