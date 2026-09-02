import styles from '../Workout.module.css'

type Props = {
  failReason: string
  onChange: (failReason: string) => void
}

const WorkoutFailReasonField = ({ failReason, onChange }: Props) => {
  return (
    <div className={styles.field}>
      <label htmlFor="failReason">
        실패 이유 <span className={styles.limit}>(7자 이하)</span>
      </label>

      <input
        id="failReason"
        className={styles.input}
        value={failReason}
        onChange={(e) => onChange(e.target.value)}
        placeholder="실패 이유"
        maxLength={7}
      />
    </div>
  )
}

export default WorkoutFailReasonField
