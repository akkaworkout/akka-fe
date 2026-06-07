import styles from '../Workout.module.css'

type Props = {
  failReason: string
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >
}

const WorkoutFailReasonField = ({
  failReason,
  setForm,
}: Props) => {
  return (
    <div className={styles.field}>
      <label>
        실패 이유{' '}
        <span className={styles.limit}>
          (7자 이하)
        </span>
      </label>

      <input
        className={styles.input}
        value={failReason}
        onChange={e => {
          setForm((prev: any) => ({
            ...prev,
            failReason: e.target.value,
          }))
        }}
        placeholder="실패 이유"
        maxLength={7}
      />
    </div>
  )
}

export default WorkoutFailReasonField