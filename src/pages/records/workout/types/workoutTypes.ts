import type { Exercise } from '@/components/summaryCard/SummaryCard'

export type WorkoutForm = {
  date: Date
  workoutResult: '성공' | '실패'
  memo: string
  failReason: string
  exercise: Exercise
  imageFile: File | null
}

export type WorkoutFormSetter = React.Dispatch<React.SetStateAction<WorkoutForm>>
