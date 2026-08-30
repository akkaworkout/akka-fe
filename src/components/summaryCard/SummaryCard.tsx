import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import arrow from '@/assets/icons/common/arrow-down.png'

import styles from './SummaryCard.module.css'

export interface Expense {
  id: number
  value: string
  label: string
  color: string
}

export interface Exercise {
  id: number
  label: string
  color: string
}

type SummaryCardProps<T extends { id: number; label: string; color: string }> = {
  expenses: T[]
  selected: T
  onChange: (item: T) => void
  showAddButton?: boolean
  addPath?: string
  disabled?: boolean
}

export default function SummaryCard<T extends { id: number; label: string; color: string }>({
  expenses,
  selected,
  onChange,
  showAddButton = false,
  addPath = '/ticket',
  disabled = false,
}: SummaryCardProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const canSelect = expenses.length > 1 && !disabled

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (expenses.length === 0) {
    return (
      <div className={styles.summaryCard}>
        <button
          type="button"
          className={styles.select}
          onClick={() => {
            const ok = window.confirm('작성 중인 내용이 사라집니다. 이동할까요?')
            if (!ok) return

            navigate(addPath)
          }}
        >
          이용권 등록하기
        </button>
      </div>
    )
  }

  return (
    <div className={styles.summaryCard} ref={wrapperRef}>
      <button
        type="button"
        className={styles.select}
        onClick={() => {
          if (!canSelect) return

          setIsOpen((prev) => !prev)
        }}
      >
        <span className={styles.dot} style={{ backgroundColor: selected.color }} />
        <span className={styles.text}>{selected.label}</span>

        {canSelect && (
          <img className={`${styles.arrow} ${isOpen ? styles.open : ''}`} src={arrow} alt="arrow" />
        )}
      </button>

      {canSelect && isOpen && (
        <div className={styles.dropdown}>
          {expenses
            .filter((item) => item.id !== selected.id)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  onChange(item)
                  setIsOpen(false)
                }}
              >
                <span className={styles.dot} style={{ backgroundColor: item.color }} />
                <span className={styles.text}>{item.label}</span>
              </button>
            ))}

          {showAddButton && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                const ok = window.confirm('작성 중인 내용이 사라집니다. 이동하시겠습니까?')
                if (!ok) return

                setIsOpen(false)
                navigate(addPath)
              }}
            >
              +
            </button>
          )}
        </div>
      )}
    </div>
  )
}
