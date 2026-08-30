import type { WorkoutFormSetter } from '../types/workoutTypes'

import DateSelect from '@/components/dateSelect/DateSelect'

import styles from '../Workout.module.css'

type Props = {
  date: Date
  setForm: WorkoutFormSetter
}

const WorkoutDateField = ({ date, setForm }: Props) => {
  return (
    <div className={styles.field}>
      <label>날짜*</label>

      <DateSelect
        value={date}
        onChange={(newDate) => {
          setForm((prev) => ({
            ...prev,
            date: newDate,
          }))
        }}
      />
    </div>
  )
}

export default WorkoutDateField
