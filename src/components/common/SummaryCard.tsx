import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SummaryCard.module.css'
import arrow from '../../assets/icons/arrow-down.png'

export interface Expense {
  id: number
  value: string
  label: string
  color: string
}

type SummaryCardProps = {
  expenses: Expense[]
  selected: Expense
  onChange: (expense: Expense) => void
  showAddButton?: boolean
  addPath?: string
}

export default function SummaryCard({
  expenses,
  selected,
  onChange,
  showAddButton = false,
  addPath = '/ticket',
}: SummaryCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={styles.summaryCard} ref={wrapperRef}>
      <button
        type="button"
        className={styles.select}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span
          className={styles.dot}
          style={{ backgroundColor: selected.color }}
        />
        <span className={styles.text}>{selected.label}</span>
        <img
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
          src={arrow}
          alt="arrow"
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {expenses
            .filter(item => item.id !== selected.id)
            .map(item => (
              <button
                key={item.id}
                className={styles.dropdownItem}
                onClick={() => {
                  onChange(item)
                  setIsOpen(false)
                }}
              >
                <span
                  className={styles.dot}
                  style={{ backgroundColor: item.color }}
                />
                <span className={styles.text}>{item.label}</span>
              </button>
            ))}

          {showAddButton && (
            <button
              className={styles.addButton}
              onClick={() => {
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