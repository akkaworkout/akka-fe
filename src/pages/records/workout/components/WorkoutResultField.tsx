import Button from '@/components/button/Button'

import styles from '../Workout.module.css'

type Props = {
  workoutResult: '성공' | '실패'
  failReason: string
  onChange: (result: '성공' | '실패') => void
}

const WorkoutResultField = ({ workoutResult, failReason, onChange }: Props) => {
  return (
    <div className={styles.field}>
      <label>결과*</label>

      <div className={styles.resultButtons}>
        <Button
          type="button"
          active={workoutResult === '성공'}
          variant="green"
          onClick={() => {
            if (workoutResult === '실패' && failReason.trim() !== '') {
              const ok = window.confirm('작성 중인 실패 이유가 사라집니다. 계속하시겠습니까?')

              if (!ok) return
            }

            onChange('성공')
          }}
        >
          성공
        </Button>

        <Button
          type="button"
          active={workoutResult === '실패'}
          variant="red"
          onClick={() => onChange('실패')}
        >
          실패
        </Button>
      </div>
    </div>
  )
}

export default WorkoutResultField
