import styles from '../Workout.module.css'

import DateSelect from '@/components/dateSelect/DateSelect'

type Props = {
  date: Date
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >
}

const WorkoutDateField = ({
  date,
  setForm,
}: Props) => {
  return (
    <div className={styles.field}>
      <label>날짜*</label>

      <DateSelect
        value={date}
        onChange={(newDate) => {
          setForm((prev: any) => ({
            ...prev,
            date: newDate,
          }))
        }}
      />
    </div>
  )
}

export default WorkoutDateField