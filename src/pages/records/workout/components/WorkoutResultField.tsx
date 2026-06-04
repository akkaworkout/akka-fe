import styles from '../Workout.module.css'

type Props = {
  workoutResult: '성공' | '실패'
  failReason: string
  setForm: React.Dispatch<React.SetStateAction<any>>
}

const WorkoutResultField = ({
  workoutResult,
  failReason,
  setForm,
}: Props) => {
  return (
    <div className={styles.field}>
      <label>결과*</label>

      <div className={styles.resultButtons}>
        <button
          type="button"
          className={`${styles.resultBtn} ${
            workoutResult === '성공'
              ? styles.success
              : ''
          }`}
          onClick={() => {
            if (
              workoutResult === '실패' &&
              failReason.trim() !== ''
            ) {
              const ok = window.confirm(
                '작성 중인 실패 이유가 사라집니다. 계속하시겠습니까?'
              )

              if (!ok) return
            }

            setForm((prev: any) => ({
              ...prev,
              workoutResult: '성공',
              failReason: '',
            }))
          }}
        >
          성공
        </button>

        <button
          type="button"
          className={`${styles.resultBtn} ${
            workoutResult === '실패'
              ? styles.fail
              : ''
          }`}
          onClick={() => {
            setForm((prev: any) => ({
              ...prev,
              workoutResult: '실패',
            }))
          }}
        >
          실패
        </button>
      </div>
    </div>
  )
}

export default WorkoutResultField