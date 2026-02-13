import { useState, useRef, useEffect } from 'react'
import styles from './SummaryCard.module.css'
import arrow from '../../assets/icons/arrow-down.png'

export type Exercise = {
  id: number
  label: string
  color: string
}

type SummaryCardProps = {
  exercises: Exercise[]
  selected: Exercise
  onChange: (exercise: Exercise) => void
}

export default function SummaryCard({
  exercises,
  selected,
  onChange,
}: SummaryCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

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
          {exercises
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
                <span>{item.label}</span>
              </button>
            ))}

          <button className={styles.addButton}>+</button>
        </div>
      )}
    </div>
  )
}