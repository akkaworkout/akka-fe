import SummaryCard, { type Exercise } from '@/components/summaryCard/SummaryCard'

import styles from '../Workout.module.css'

type Props = {
  mappedTickets: Exercise[]
  selectedExercise: Exercise
  disabled: boolean
  onChange: (exercise: Exercise) => void
}

const WorkoutExerciseField = ({ mappedTickets, selectedExercise, disabled, onChange }: Props) => {
  return (
    <div className={styles.field}>
      <label>운동 종목*</label>

      <SummaryCard<Exercise>
        expenses={mappedTickets}
        selected={selectedExercise}
        disabled={disabled}
        showAddButton={true}
        onChange={onChange}
      />
    </div>
  )
}

export default WorkoutExerciseField
