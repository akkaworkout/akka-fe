import styles from '../Workout.module.css'

type Props = {
  memo: string
  onChange: (memo: string) => void
}

const WorkoutMemoField = ({ memo, onChange }: Props) => {
  return (
    <div className={styles.field}>
      <label htmlFor="memo">메모</label>

      <input
        id="memo"
        className={styles.input}
        value={memo}
        onChange={(e) => onChange(e.target.value)}
        placeholder="메모"
        maxLength={30}
      />
    </div>
  )
}

export default WorkoutMemoField
