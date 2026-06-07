import styles from '../Workout.module.css'

type Props = {
  memo: string
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >
}

const WorkoutMemoField = ({
  memo,
  setForm,
}: Props) => {
  return (
    <div className={styles.field}>
      <label>메모</label>

      <input
        className={styles.input}
        value={memo}
        onChange={e => {
          setForm((prev: any) => ({
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