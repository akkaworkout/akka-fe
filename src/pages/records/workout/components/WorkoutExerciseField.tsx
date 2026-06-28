import type { WorkoutFormSetter } from '../types/workoutTypes'

import SummaryCard, { type Exercise } from '@/components/summaryCard/SummaryCard'

import styles from '../Workout.module.css'

type Props = {
  mappedTickets: Exercise[]
  selectedExercise: Exercise
  recordId: number
  setForm: WorkoutFormSetter
}

const WorkoutExerciseField = ({
  mappedTickets,
  selectedExercise,
  recordId,
  setForm,
}: Props) => {
  return (
    <div className={styles.field}>
      <label>운동 종목*</label>

      <SummaryCard<Exercise>
        expenses={mappedTickets}
        selected={selectedExercise}
        disabled={!!recordId}
        showAddButton={true}
        onChange={(value) => {
          if (recordId) return

          setForm((prev) => ({
            ...prev,
            exercise: value,
          }))
        }}
      />
    </div>
  )
}

export default WorkoutExerciseField