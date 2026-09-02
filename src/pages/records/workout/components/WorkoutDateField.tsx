import DateSelect from '@/components/dateSelect/DateSelect'

import styles from '../Workout.module.css'

type Props = {
  date: Date
  onChange: (date: Date) => void
}

const WorkoutDateField = ({ date, onChange }: Props) => {
  return (
    <div className={styles.field}>
      <label>날짜*</label>

      <DateSelect value={date} onChange={onChange} />
    </div>
  )
}

export default WorkoutDateField
