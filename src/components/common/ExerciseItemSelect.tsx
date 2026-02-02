import styles from './ExerciseItemSelect.module.css'
import arrow from '../../assets/icons/arrow-down.png'

type ExerciseItemSelectProps = {
  id: number | string
  label: string
  dotColor: string
  onClick?: (id: number | string) => void
}

const ExerciseItemSelect = ({
  id,
  label,
  dotColor,
  onClick,
}: ExerciseItemSelectProps) => {
  return (
    <button
      type="button"
      className={styles.select}
      onClick={() => onClick?.(id)}
    >
      <span
        className={styles.dot}
        style={{ backgroundColor: dotColor }}
      />
      <span className={styles.text}>{label}</span>
      <img className={styles.arrow} src={arrow} alt='arrow' />
    </button>
  )
}

export default ExerciseItemSelect