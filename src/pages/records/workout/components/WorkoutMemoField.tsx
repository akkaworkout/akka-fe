import type { WorkoutFormSetter } from '../types/workoutTypes'

import styles from '../Workout.module.css'

type Props = {
  memo: string
  setForm: WorkoutFormSetter
}

const WorkoutMemoField = ({ memo, setForm }: Props) => {
  return (
    <div className={styles.field}>
      <label htmlFor="memo">메모</label>

      <input
        id="memo"
        className={styles.input}
        value={memo}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            memo: e.target.value,
          }))
        }}
        placeholder="메모"
        maxLength={30}
      />
    </div>
  )
}

export default WorkoutMemoField
