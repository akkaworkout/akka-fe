import styles from '../Workout.module.css'

import SummaryCard, {
  type Exercise,
} from '@/components/summaryCard/SummaryCard'

type Props = {
  mappedTickets: Exercise[]
  selectedExercise: Exercise
  recordId: number
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >
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

          setForm((prev: any) => ({
            ...prev,
            exercise: value,
          }))
        }}
      />
    </div>
  )
}

export default WorkoutExerciseField